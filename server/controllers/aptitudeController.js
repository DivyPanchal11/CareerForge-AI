const AptitudeSession = require("../models/AptitudeSession");
const {
  generateAptitudeQuestions,
  verifyFreeTierEligibility,
  ALLOWED_CATEGORIES,
  ALLOWED_DIFFICULTIES,
  GeminiConfigError,
  GeminiQuotaError,
  GeminiValidationError,
} = require("../services/geminiService");
const {
  InsufficientCreditsError,
  getOrCreateAccount,
  reserveCredits,
  commitReservation,
  refundReservation,
  getUserCreditSummary,
} = require("../services/creditService");
const {
  calculateGenerationCost,
  COST_PER_QUESTION,
  DEFAULT_DAILY_ALLOWANCE,
  DEFAULT_WEEKLY_ALLOWANCE,
  getDailyResetWindow,
} = require("../config/creditConfig");

/**
 * Normalizes category names from frontend variants (e.g. "quantitative" -> "Quantitative Aptitude", "mixed" -> "Mixed")
 */
function normalizeCategory(category) {
  if (!category || typeof category !== "string") return "";
  const lower = category.trim().toLowerCase();
  if (lower.startsWith("quant")) return "Quantitative Aptitude";
  if (lower.startsWith("logic")) return "Logical Reasoning";
  if (lower.startsWith("verb")) return "Verbal Ability";
  if (lower === "mixed" || lower.startsWith("mix")) return "Mixed";
  return category.trim();
}

/**
 * Normalizes difficulty (e.g. "beginner" -> "Easy", "medium" -> "Medium", "advanced" -> "Hard")
 */
function normalizeDifficulty(diff) {
  if (!diff || typeof diff !== "string") return "Medium";
  const lower = diff.trim().toLowerCase();
  if (lower === "easy" || lower === "beginner") return "Easy";
  if (lower === "hard" || lower === "advanced") return "Hard";
  return "Medium";
}

/**
 * GET /api/aptitude/config
 * Returns public status of AI question generation, credit costs, and user's credit status if authenticated.
 * Never leaks API keys or secrets.
 */
const getAptitudeConfig = async (req, res) => {
  try {
    const check = verifyFreeTierEligibility();
    const { nextReset } = getDailyResetWindow();

    let userCredits = null;
    if (req.user) {
      userCredits = await getUserCreditSummary(req.user._id);
    }

    const allowance = userCredits
      ? userCredits.dailyAllowance || userCredits.weeklyAllowance
      : DEFAULT_DAILY_ALLOWANCE;

    return res.status(200).json({
      success: true,
      aiEnabled: check.eligible,
      reason: check.eligible ? "AI Question Generation is enabled." : check.reason,
      model: check.eligible ? check.model : null,
      creditPricing: {
        costPerQuestion: COST_PER_QUESTION,
        dailyAllowance: allowance,
        weeklyAllowance: allowance,
        resetPeriod: "daily",
        nextReset: nextReset.toISOString(),
      },
      userCredits: userCredits
        ? {
            balance: userCredits.balance,
            reservedBalance: userCredits.reservedBalance,
            dailyAllowance: allowance,
            weeklyAllowance: allowance,
            resetPeriod: "daily",
            nextReset: userCredits.nextReset,
          }
        : null,
      limits: {
        maxQuestionsPerRequest: parseInt(process.env.GEMINI_MAX_QUESTIONS_PER_REQUEST, 10) || 10,
      },
    });
  } catch (error) {
    console.error("[AptitudeController] Config check error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve aptitude AI configuration.",
    });
  }
};

/**
 * GET /api/aptitude/credits
 * Returns the authenticated user's credit balance, weekly allowance, next reset time, and transaction ledger.
 */
const getUserCredits = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to view credit balance.",
      });
    }

    const summary = await getUserCreditSummary(req.user._id);

    return res.status(200).json({
      success: true,
      credits: summary,
    });
  } catch (error) {
    console.error("[AptitudeController] getUserCredits error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve user credit summary.",
    });
  }
};

/**
 * POST /api/aptitude/generate
 * Generates aptitude placement questions backed by the atomic weekly credit system.
 * Flow:
 *  1. Authenticates user & validates input.
 *  2. Atomically reserves credits before AI generation (with idempotency guard).
 *  3. Calls AI model to generate questions.
 *  4. Validates output; on failure, automatically refunds reservation.
 *  5. On success, persists session and commits credit charge.
 *  6. Returns sanitized questions without answer keys.
 */
const generateQuestions = async (req, res) => {
  let reservationResult = null;
  const userId = req.user ? req.user._id : null;

  try {
    // 1. Enforce Authentication for Credit-Backed AI Generation
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please sign in to generate AI placement practice questions using your weekly credits.",
      });
    }

    const {
      category: rawCategory,
      topic: rawTopic,
      difficulty: rawDifficulty = "Medium",
      count: rawCount = 5,
    } = req.body || {};

    // 2. Validate Category
    const category = normalizeCategory(rawCategory);
    if (!ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Allowed categories are: ${ALLOWED_CATEGORIES.join(", ")}.`,
      });
    }

    // 3. Validate Topic (Mixed sets can use general placement topic if none supplied)
    const isMixed = category === "Mixed";
    let topic = "";
    if (isMixed) {
      topic = typeof rawTopic === "string" && rawTopic.trim() ? rawTopic.trim() : "Placement Preparation";
    } else {
      if (typeof rawTopic !== "string" || !rawTopic.trim() || rawTopic.trim().length > 100) {
        return res.status(400).json({
          success: false,
          message: "Topic must be a non-empty string with maximum 100 characters.",
        });
      }
      topic = rawTopic.trim();
    }

    // 4. Validate Difficulty
    const difficulty = normalizeDifficulty(rawDifficulty);
    if (!ALLOWED_DIFFICULTIES.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: "Difficulty must be Easy/Beginner, Medium/Intermediate, or Hard/Advanced.",
      });
    }

    // 5. Validate Question Count (Server source of truth)
    const maxAllowed = parseInt(process.env.GEMINI_MAX_QUESTIONS_PER_REQUEST, 10) || 10;
    const count = parseInt(rawCount, 10);
    if (isNaN(count) || count < 1 || count > maxAllowed) {
      return res.status(400).json({
        success: false,
        message: `Question count must be an integer between 1 and ${maxAllowed}.`,
      });
    }

    // 6. Pre-check Free-Tier Model Eligibility
    const check = verifyFreeTierEligibility();
    if (!check.eligible) {
      return res.status(check.statusCode || 403).json({
        success: false,
        message: check.reason,
      });
    }

    // 7. Extract Idempotency Key (header or body)
    const idempotencyKey =
      req.headers["idempotency-key"] ||
      req.headers["x-idempotency-key"] ||
      (typeof req.body?.idempotencyKey === "string" ? req.body.idempotencyKey.trim() : null);

    // 8. Atomically Reserve Credits (Handles overspend concurrency & idempotency)
    reservationResult = await reserveCredits({
      userId,
      questionCount: count,
      idempotencyKey,
      metadata: { category, topic, difficulty, count },
    });

    // If request was already processed and committed under this idempotencyKey, return previous result
    if (reservationResult.isIdempotentDuplicate && reservationResult.status === "COMMITTED") {
      const prevSessionId = reservationResult.metadata?.sessionId;
      if (prevSessionId) {
        const existingSession = await AptitudeSession.findOne({ sessionId: prevSessionId });
        if (existingSession) {
          const sanitized = existingSession.questions.map((q) => ({
            id: q.id,
            category: q.category,
            topic: q.topic,
            difficulty: q.difficulty,
            question: q.question,
            options: q.options.map((opt) => ({ id: opt.id, text: opt.text })),
          }));

          const userSummary = await getUserCreditSummary(userId);

          return res.status(200).json({
            success: true,
            isDuplicate: true,
            sessionId: existingSession.sessionId,
            category: existingSession.category,
            topic: existingSession.topic,
            difficulty: existingSession.difficulty,
            modelUsed: existingSession.modelUsed,
            questions: sanitized,
            credits: {
              spent: reservationResult.cost,
              remaining: userSummary.balance,
              weeklyAllowance: userSummary.weeklyAllowance,
              nextReset: userSummary.nextReset,
            },
          });
        }
      }
    }

    // 9. Invoke AI Question Generation (Protected by try/catch with automated credit refund)
    let generationResult;
    try {
      generationResult = await generateAptitudeQuestions({
        category,
        topic,
        difficulty,
        count,
      });
    } catch (genError) {
      // Release and refund reserved credits on any failure
      await refundReservation({
        userId,
        reservationId: reservationResult.reservationId,
        reason: genError.message || "Question generation failed",
        metadata: { errorName: genError.name },
      });
      reservationResult = null; // Mark resolved
      throw genError;
    }

    const { modelUsed, questions } = generationResult;

    // 10. Persist Session with Trusted Answer Keys
    const sessionId = `session_apt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    await AptitudeSession.create({
      sessionId,
      userId,
      category,
      topic,
      difficulty,
      modelUsed,
      questions,
      totalQuestions: questions.length,
    });

    // 11. Commit the Credit Charge
    await commitReservation({
      userId,
      reservationId: reservationResult.reservationId,
      metadata: {
        sessionId,
        questionCount: questions.length,
        category,
        topic,
        difficulty,
      },
    });

    // 12. Sanitize Questions (CRITICAL SECURITY REQUIREMENT):
    // Strip correctOptionId and explanation before sending to the client.
    const sanitizedQuestions = questions.map((q) => ({
      id: q.id,
      category: q.category,
      topic: q.topic,
      difficulty: q.difficulty,
      question: q.question,
      options: q.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
      })),
    }));

    const creditSummary = await getUserCreditSummary(userId);

    return res.status(200).json({
      success: true,
      sessionId,
      category,
      topic,
      difficulty,
      modelUsed,
      questions: sanitizedQuestions,
      credits: {
        spent: reservationResult.cost,
        remaining: creditSummary.balance,
        dailyAllowance: creditSummary.dailyAllowance || creditSummary.weeklyAllowance,
        weeklyAllowance: creditSummary.dailyAllowance || creditSummary.weeklyAllowance,
        resetPeriod: "daily",
        nextReset: creditSummary.nextReset,
      },
    });
  } catch (error) {
    console.error("[AptitudeController] Generation error:", error.message);

    // If reservation exists and wasn't refunded yet, safely refund it
    if (reservationResult && reservationResult.reservationId && userId) {
      try {
        await refundReservation({
          userId,
          reservationId: reservationResult.reservationId,
          reason: error.message || "Unhandled generation error",
          metadata: { errorName: error.name },
        });
      } catch (refundErr) {
        console.error("[AptitudeController] Emergency refund error:", refundErr.message);
      }
    }

    if (error instanceof InsufficientCreditsError) {
      return res.status(402).json({
        success: false,
        message: error.message,
        balance: error.currentBalance,
        required: error.requiredCost,
        nextReset: error.nextReset,
      });
    }

    if (error instanceof GeminiConfigError) {
      return res.status(error.statusCode || 403).json({
        success: false,
        message: error.message,
      });
    }

    if (error instanceof GeminiQuotaError) {
      return res.status(429).json({
        success: false,
        message: error.message,
      });
    }

    if (error instanceof GeminiValidationError) {
      return res.status(502).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred during question generation. Your credits have been restored. Please try again.",
    });
  }
};

/**
 * POST /api/aptitude/submit
 * Evaluates student answers against trusted server-side session data.
 * Computes score, accuracy, reveals explanations, and prevents multiple submissions.
 */
const submitAnswers = async (req, res) => {
  try {
    const { sessionId, answers = {}, timeSpentSeconds = 0 } = req.body || {};

    if (!sessionId || typeof sessionId !== "string") {
      return res.status(400).json({
        success: false,
        message: "A valid sessionId is required for test submission.",
      });
    }

    // Retrieve the trusted session
    const session = await AptitudeSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Aptitude session not found or expired.",
      });
    }

    // Prevent tampering with already-submitted sessions
    if (session.isSubmitted) {
      return res.status(400).json({
        success: false,
        message: "This test session has already been submitted and graded.",
      });
    }

    const trustedQuestions = session.questions;
    let correctCount = 0;
    let attemptedCount = 0;

    const detailedReview = trustedQuestions.map((q) => {
      const studentAnswer = answers[q.id] || null;
      const isAttempted = !!studentAnswer;
      const isCorrect = isAttempted && studentAnswer.toUpperCase() === q.correctOptionId.toUpperCase();

      if (isAttempted) attemptedCount++;
      if (isCorrect) correctCount++;

      return {
        id: q.id,
        category: q.category,
        topic: q.topic,
        difficulty: q.difficulty,
        question: q.question,
        options: q.options,
        selectedOptionId: studentAnswer,
        correctOptionId: q.correctOptionId,
        isCorrect,
        isAttempted,
        isAnswered: isAttempted,
        explanation: q.explanation,
      };
    });

    const totalQuestions = trustedQuestions.length;
    const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    // Update and mark session as submitted
    session.submittedAnswers = answers;
    session.score = correctCount;
    session.accuracy = accuracy;
    session.timeSpentSeconds = Math.max(0, parseInt(timeSpentSeconds, 10) || 0);
    session.isSubmitted = true;
    session.submittedAt = new Date();
    await session.save();

    return res.status(200).json({
      success: true,
      result: {
        sessionId: session.sessionId,
        category: session.category,
        topic: session.topic,
        difficulty: session.difficulty,
        totalQuestions,
        attempted: attemptedCount,
        correct: correctCount,
        incorrect: attemptedCount - correctCount,
        unattempted: totalQuestions - attemptedCount,
        score: correctCount,
        scorePercentage,
        accuracy,
        timeSpentSeconds: session.timeSpentSeconds,
        submittedAt: session.submittedAt,
        questions: detailedReview,
      },
    });
  } catch (error) {
    console.error("[AptitudeController] Submission error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while evaluating test answers.",
    });
  }
};

module.exports = {
  getAptitudeConfig,
  getUserCredits,
  generateQuestions,
  submitAnswers,
};