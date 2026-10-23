const {
  verifyEligibility,
  generateQuestions: generateAIQuestions,
  evaluateAnswer: evaluateAIAnswer,
  summarizeSession: summarizeAISession,
  ALLOWED_INTERVIEW_TYPES,
  ALLOWED_EXPERIENCE_LEVELS,
  InterviewConfigError,
  InterviewQuotaError,
  InterviewValidationError,
} = require("../services/interviewGeminiService");

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

const { checkInterviewUsage } = require("../utils/interviewRateLimiter");

/**
 * Normalizes interview type from various frontend casing/labels
 */
function normalizeInterviewType(type) {
  if (!type || typeof type !== "string") return "technical";
  const lower = type.trim().toLowerCase().replace(/[^a-z]/g, "_");
  if (lower.includes("behav")) return "behavioral";
  if (lower.includes("role") || lower.includes("culture") || lower.includes("hr")) return "role_specific";
  if (lower.includes("mix")) return "mixed";
  return "technical";
}

/**
 * Normalizes experience level
 */
function normalizeExperienceLevel(level) {
  if (!level || typeof level !== "string") return "entry";
  const lower = level.trim().toLowerCase();
  if (lower.includes("fresh") || lower.includes("entry") || lower.includes("junior")) return "entry";
  if (lower.includes("mid") || lower.includes("intermed")) return "mid";
  if (lower.includes("senior") || lower.includes("lead") || lower.includes("expert")) return "senior";
  return level.trim().slice(0, 60);
}

/**
 * GET /api/interview/config
 * Returns public AI readiness status, active model, and configured credit pricing without leaking API key.
 */
const getInterviewConfig = async (req, res) => {
  try {
    const check = verifyEligibility();
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
      model: check.eligible ? check.model : null,
      reason: check.eligible ? "Gemini AI interview practice is active." : check.reason,
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
        maxQuestions: 10,
        maxAnswerChars: 6000,
        maxJobDescriptionChars: 4000,
      },
    });
  } catch (error) {
    console.error("[InterviewController] Error fetching config:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve interview AI configuration.",
    });
  }
};

/**
 * GET /api/interview/credits
 * Returns the authenticated user's credit balance, daily allowance, next reset time, and transaction ledger.
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
    console.error("[InterviewController] getUserCredits error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve user credit summary.",
    });
  }
};

/**
 * POST /api/interview/generate-questions
 * Generates custom interview questions backed by atomic daily application credits.
 */
const generateQuestions = async (req, res) => {
  let reservationResult = null;
  const userId = req.user ? req.user._id : null;

  try {
    // 1. Enforce Authentication for Credit-Backed AI Interview Generation
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please sign in to generate AI interview questions using your daily credits.",
      });
    }

    const {
      targetRole: rawRole,
      experienceLevel: rawLevel,
      interviewType: rawType,
      jobDescription: rawJD = "",
      skills: rawSkills = "",
      questionCount: rawCount = 5,
    } = req.body || {};

    // 2. Validate Target Role
    if (typeof rawRole !== "string" || !rawRole.trim() || rawRole.trim().length > 120) {
      return res.status(400).json({
        success: false,
        message: "Target role is required and must not exceed 120 characters.",
      });
    }
    const targetRole = rawRole.trim();

    // 3. Validate Experience Level
    const experienceLevel = normalizeExperienceLevel(rawLevel);

    // 4. Validate Interview Type
    const interviewType = normalizeInterviewType(rawType);

    // 5. Validate Job Description (optional)
    const jobDescription = typeof rawJD === "string" ? rawJD.trim().slice(0, 4000) : "";

    // 6. Validate Skills (optional)
    const skills = typeof rawSkills === "string" ? rawSkills.trim().slice(0, 500) : "";

    // 7. Validate Question Count (Server source of truth)
    const count = parseInt(rawCount, 10);
    if (isNaN(count) || count < 1 || count > 10) {
      return res.status(400).json({
        success: false,
        message: "Question count must be an integer between 1 and 10.",
      });
    }

    // 8. Rate Limiting & Abuse Prevention Check
    const rateCheck = await checkInterviewUsage({ userId, ip: req.ip });
    if (!rateCheck.allowed) {
      return res.status(rateCheck.statusCode || 429).json({
        success: false,
        message: rateCheck.reason,
        retryAfter: rateCheck.retryAfter,
      });
    }

    // 9. Extract Idempotency Key (header or body)
    const idempotencyKey =
      req.headers["idempotency-key"] ||
      req.headers["x-idempotency-key"] ||
      (typeof req.body?.idempotencyKey === "string" ? req.body.idempotencyKey.trim() : null);

    // 10. Atomically Reserve Credits (Concurrency-safe & Idempotent)
    reservationResult = await reserveCredits({
      userId,
      questionCount: count,
      idempotencyKey,
      metadata: {
        module: "interview",
        targetRole,
        experienceLevel,
        interviewType,
        questionCount: count,
      },
    });

    // 11. Call AI Question Generation protected with safe refund on any failure
    let result;
    try {
      result = await generateAIQuestions({
        targetRole,
        experienceLevel,
        interviewType,
        jobDescription,
        skills,
        questionCount: count,
      });
    } catch (genError) {
      // Automatic immediate refund on provider error, timeout, or validation rejection
      if (reservationResult?.reservationId) {
        await refundReservation({
          userId,
          reservationId: reservationResult.reservationId,
          reason: genError.message || "Interview generation failed",
          metadata: { module: "interview", errorName: genError.name },
        });
        reservationResult = null; // Mark handled
      }
      throw genError;
    }

    // 12. Finalize and Commit the credit charge only after successful generation
    await commitReservation({
      userId,
      reservationId: reservationResult.reservationId,
      metadata: {
        module: "interview",
        targetRole,
        experienceLevel,
        interviewType,
        questionCount: result.questions.length,
        modelUsed: result.modelUsed,
      },
    });

    const creditSummary = await getUserCreditSummary(userId);

    return res.status(200).json({
      success: true,
      modelUsed: result.modelUsed,
      questions: result.questions,
      credits: {
        spent: reservationResult.cost,
        remaining: creditSummary.balance,
        dailyAllowance: creditSummary.dailyAllowance || creditSummary.weeklyAllowance,
        resetPeriod: "daily",
        nextReset: creditSummary.nextReset,
      },
    });
  } catch (error) {
    console.error("[InterviewController] Generate questions error:", error.message);

    // If reservation exists and wasn't refunded yet, safely refund it
    if (reservationResult?.reservationId && userId) {
      try {
        await refundReservation({
          userId,
          reservationId: reservationResult.reservationId,
          reason: error.message || "Unhandled generation error",
          metadata: { module: "interview", errorName: error.name },
        });
      } catch (refundErr) {
        console.error("[InterviewController] Emergency refund error:", refundErr.message);
      }
    }

    if (error instanceof InsufficientCreditsError) {
      return res.status(402).json({
        success: false,
        isInsufficientCredits: true,
        message: error.message,
        balance: error.currentBalance,
        required: error.requiredCost,
        nextReset: error.nextReset,
      });
    }

    if (error instanceof InterviewQuotaError) {
      return res.status(429).json({
        success: false,
        isQuotaExhausted: true,
        message: error.message,
      });
    }

    if (error instanceof InterviewConfigError) {
      return res.status(error.statusCode || 503).json({
        success: false,
        message: error.message,
      });
    }

    if (error instanceof InterviewValidationError) {
      return res.status(502).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while generating interview questions. Your credits have been preserved.",
    });
  }
};

/**
 * POST /api/interview/evaluate-answer
 * Evaluates candidate answer for a specific question against multi-dimensional rubric
 */
const evaluateAnswer = async (req, res) => {
  try {
    const {
      targetRole: rawRole = "Interview Practice",
      experienceLevel: rawLevel = "entry",
      interviewType: rawType = "technical",
      jobDescription: rawJD = "",
      focusSkills: rawSkills = "",
      question,
      answer: rawAnswer,
    } = req.body || {};

    // Validate Question
    if (!question || (typeof question !== "object" && typeof question !== "string")) {
      return res.status(400).json({
        success: false,
        message: "Question information is required.",
      });
    }

    const questionText = typeof question === "string" ? question.trim() : (question.question || "").trim();
    if (!questionText || questionText.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Valid question text is required.",
      });
    }

    // Validate Answer
    if (typeof rawAnswer !== "string" || !rawAnswer.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide an answer before submitting for evaluation.",
      });
    }

    const answer = rawAnswer.trim().slice(0, 6000);
    const targetRole = typeof rawRole === "string" && rawRole.trim() ? rawRole.trim().slice(0, 120) : "Interview Practice";
    const experienceLevel = normalizeExperienceLevel(rawLevel);
    const interviewType = normalizeInterviewType(rawType);
    const jobDescription = typeof rawJD === "string" ? rawJD.trim().slice(0, 4000) : "";
    const focusSkills = typeof rawSkills === "string" ? rawSkills.trim().slice(0, 1000) : "";

    const evaluation = await evaluateAIAnswer({
      targetRole,
      experienceLevel,
      interviewType,
      jobDescription,
      focusSkills,
      question: typeof question === "object" ? question : { question: questionText },
      answer,
    });

    return res.status(200).json({
      success: true,
      evaluation,
    });
  } catch (error) {
    console.error("[InterviewController] Evaluate answer error:", error.message);

    if (error instanceof InterviewQuotaError) {
      return res.status(429).json({
        success: false,
        isQuotaExhausted: true,
        message: error.message,
      });
    }

    if (error instanceof InterviewConfigError) {
      return res.status(error.statusCode || 503).json({
        success: false,
        message: error.message,
      });
    }

    if (error instanceof InterviewValidationError) {
      return res.status(502).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred while evaluating your answer. Please retry.",
    });
  }
};

/**
 * POST /api/interview/summarize-session
 * Generates an end-of-session evaluation summary
 */
const summarizeSession = async (req, res) => {
  try {
    const {
      targetRole = "Interview Practice",
      experienceLevel = "entry",
      interviewType = "technical",
      jobDescription = "",
      evaluations,
    } = req.body || {};

    if (!Array.isArray(evaluations) || evaluations.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No question evaluations provided for session summary.",
      });
    }

    const safeTargetRole = typeof targetRole === "string" && targetRole.trim() ? targetRole.trim().slice(0, 120) : "Interview Practice";

    const summary = await summarizeAISession({
      targetRole: safeTargetRole,
      experienceLevel: normalizeExperienceLevel(experienceLevel),
      interviewType: normalizeInterviewType(interviewType),
      jobDescription: String(jobDescription).slice(0, 4000),
      evaluations,
    });

    return res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("[InterviewController] Summarize session error:", error.message);

    if (error instanceof InterviewQuotaError) {
      return res.status(429).json({
        success: false,
        isQuotaExhausted: true,
        message: error.message,
      });
    }

    if (error instanceof InterviewConfigError) {
      return res.status(error.statusCode || 503).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to generate interview session summary. Please review individual question feedback.",
    });
  }
};

module.exports = {
  getInterviewConfig,
  getUserCredits,
  generateQuestions,
  evaluateAnswer,
  summarizeSession,
};
