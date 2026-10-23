const { GoogleGenAI } = require("@google/genai");

/**
 * STRICT FREE-TIER MODEL WHITELIST
 * Only models verified to have a free tier in Google AI Studio are allowed.
 * Pro models, Ultra models, or experimental paid endpoints are strictly rejected.
 */
const APPROVED_FREE_MODELS = Object.freeze([
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
]);

const ALLOWED_CATEGORIES = Object.freeze([
  "Quantitative Aptitude",
  "Logical Reasoning",
  "Verbal Ability",
  "Mixed",
]);

const ALLOWED_DIFFICULTIES = Object.freeze([
  "Easy",
  "Medium",
  "Hard",
  "Beginner",
  "Intermediate",
  "Advanced",
]);

/**
 * Custom Error Classes for Clean Classification
 */
class GeminiConfigError extends Error {
  constructor(message, statusCode = 403) {
    super(message);
    this.name = "GeminiConfigError";
    this.statusCode = statusCode;
  }
}

class GeminiQuotaError extends Error {
  constructor(message = "Free-tier AI quota is currently exhausted. Please try again later.", statusCode = 429) {
    super(message);
    this.name = "GeminiQuotaError";
    this.statusCode = statusCode;
  }
}

class GeminiValidationError extends Error {
  constructor(message = "Generated questions failed quality or structural verification.", statusCode = 502) {
    super(message);
    this.name = "GeminiValidationError";
    this.statusCode = statusCode;
  }
}

/**
 * Validates whether the current environment configuration is safely approved
 * for free-tier operation.
 */
function verifyFreeTierEligibility() {
  const isEnabled = String(process.env.GEMINI_AI_ENABLED).trim().toLowerCase() === "true";
  if (!isEnabled) {
    return {
      eligible: false,
      reason: "AI question generation is currently disabled by administrator configuration.",
      statusCode: 403,
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim() || apiKey.trim() === "your_secret_key" || apiKey.trim() === "your_gemini_api_key_here") {
    return {
      eligible: false,
      reason: "Gemini API key is not configured on the server. AI generation is disabled.",
      statusCode: 503,
    };
  }

  const model = process.env.GEMINI_MODEL ? process.env.GEMINI_MODEL.trim() : "";
  if (!model || !APPROVED_FREE_MODELS.includes(model)) {
    return {
      eligible: false,
      reason: `Configured model '${model || "undefined"}' is not on the verified free-tier whitelist. Generation is halted for billing safety.`,
      statusCode: 403,
    };
  }

  return {
    eligible: true,
    model,
    apiKey: apiKey.trim(),
  };
}

/**
 * Sanity-checks numerical and arithmetic answers where practical.
 * Verifies that options are mathematically distinct and calculations align.
 */
function validateMathematicalSanity(questionObj) {
  const { question, options, correctOptionId, explanation } = questionObj;
  const correctOpt = options.find((o) => o.id === correctOptionId);
  if (!correctOpt) return false;

  // Ensure all 4 option texts are distinct
  const uniqueTexts = new Set(options.map((o) => o.text.trim().toLowerCase()));
  if (uniqueTexts.size !== 4) {
    return false;
  }

  // 1. Percentage calculation sanity check: "X% of Y"
  const pctMatch = question.match(/(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)/i);
  if (pctMatch) {
    const rate = parseFloat(pctMatch[1]);
    const base = parseFloat(pctMatch[2]);
    const expected = (rate * base) / 100;
    const correctVal = parseFloat(correctOpt.text.replace(/[^0-9.]/g, ""));
    if (!isNaN(expected) && !isNaN(correctVal)) {
      if (
        (question.toLowerCase().includes("is what") || question.toLowerCase().includes("what is")) &&
        !question.toLowerCase().includes("increase") &&
        !question.toLowerCase().includes("decrease") &&
        !question.toLowerCase().includes("more") &&
        !question.toLowerCase().includes("less")
      ) {
        if (Math.abs(expected - correctVal) > 0.5) {
          return false;
        }
      }
    }
  }

  // 2. Simple Interest sanity check: P = X, R = Y%, T = Z
  const siMatch = question.match(/principal\s*(?:of\s*)?\$?(\d+).*?rate\s*(?:of\s*)?(\d+(?:\.\d+)?)\%.*?(?:time|period|years?)\s*(?:of\s*)?(\d+)/i);
  if (siMatch) {
    const p = parseFloat(siMatch[1]);
    const r = parseFloat(siMatch[2]);
    const t = parseFloat(siMatch[3]);
    const expectedInterest = (p * r * t) / 100;
    const correctVal = parseFloat(correctOpt.text.replace(/[^0-9.]/g, ""));
    if (!isNaN(expectedInterest) && !isNaN(correctVal) && question.toLowerCase().includes("simple interest")) {
      if (Math.abs(expectedInterest - correctVal) > 0.5 && Math.abs(p + expectedInterest - correctVal) > 0.5) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Validates structured question output from the LLM.
 */
function validateQuestions(rawQuestions, expectedCategory, expectedTopic, expectedDifficulty, expectedCount) {
  if (!Array.isArray(rawQuestions) || rawQuestions.length !== expectedCount) {
    throw new GeminiValidationError(
      `Expected exactly ${expectedCount} questions, but model returned ${rawQuestions ? rawQuestions.length : 0}.`
    );
  }

  const seenQuestions = new Set();
  const validated = [];
  const validOptionIds = ["A", "B", "C", "D"];
  const isMixed = expectedCategory === "Mixed";

  for (let i = 0; i < rawQuestions.length; i++) {
    const q = rawQuestions[i];
    if (!q || typeof q !== "object") {
      throw new GeminiValidationError(`Question at index ${i} is not a valid object.`);
    }

    const questionText = typeof q.question === "string" ? q.question.trim() : "";
    if (questionText.length < 10) {
      throw new GeminiValidationError(`Question text at index ${i} is too short or empty.`);
    }

    // Check for duplicate question text within the set
    const normalizedQ = questionText.toLowerCase();
    if (seenQuestions.has(normalizedQ)) {
      throw new GeminiValidationError(`Duplicate question detected at index ${i}.`);
    }
    seenQuestions.add(normalizedQ);

    // Validate exactly 4 options
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      throw new GeminiValidationError(`Question at index ${i} must have exactly 4 options.`);
    }

    const formattedOptions = [];
    const seenOptionIds = new Set();
    const seenOptionTexts = new Set();

    for (let j = 0; j < q.options.length; j++) {
      const opt = q.options[j];
      let optId = validOptionIds[j];
      let optText = "";

      if (typeof opt === "string") {
        optText = opt.trim();
      } else if (opt && typeof opt === "object") {
        optId = typeof opt.id === "string" ? opt.id.trim().toUpperCase() : validOptionIds[j];
        optText = typeof opt.text === "string" ? opt.text.trim() : "";
      }

      if (!optText) {
        throw new GeminiValidationError(`Empty option text at question ${i + 1}, option ${j + 1}.`);
      }

      if (!validOptionIds.includes(optId)) {
        optId = validOptionIds[j];
      }

      const normText = optText.toLowerCase();
      if (seenOptionTexts.has(normText)) {
        throw new GeminiValidationError(`Duplicate option text "${optText}" in question ${i + 1}.`);
      }

      seenOptionIds.add(optId);
      seenOptionTexts.add(normText);
      formattedOptions.push({ id: optId, text: optText });
    }

    // Validate correctOptionId
    let rawCorrect = typeof q.correctOptionId === "string" ? q.correctOptionId.trim().toUpperCase() : "";
    if (!rawCorrect && typeof q.correctAnswer === "string") {
      const found = formattedOptions.find(
        (o) => o.text.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
      );
      if (found) rawCorrect = found.id;
    }

    if (!validOptionIds.includes(rawCorrect)) {
      throw new GeminiValidationError(`Question ${i + 1} specifies an invalid or non-existent correct option.`);
    }

    const explanationText = typeof q.explanation === "string" ? q.explanation.trim() : "";
    if (explanationText.length < 5) {
      throw new GeminiValidationError(`Explanation for question ${i + 1} is missing or too brief.`);
    }

    // Check for obvious contradiction between explanation and correctOptionId
    const explicitOptionMention = explanationText.match(/(?:option|choice|answer)\s+([A-D])\s+(?:is\s+(?:the\s+)?(?:correct|right|true|answer))/i);
    if (explicitOptionMention && explicitOptionMention[1].toUpperCase() !== rawCorrect) {
      throw new GeminiValidationError(
        `Contradiction in question ${i + 1}: explanation states Option ${explicitOptionMention[1].toUpperCase()} is correct, but designated answer is ${rawCorrect}.`
      );
    }

    // Determine category and topic for this question
    let questionCategory = expectedCategory;
    let questionTopic = expectedTopic;

    if (isMixed) {
      const allowedSubs = ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability"];
      if (q.category && allowedSubs.includes(q.category.trim())) {
        questionCategory = q.category.trim();
      } else {
        questionCategory = allowedSubs[i % allowedSubs.length];
      }
      questionTopic = (typeof q.topic === "string" && q.topic.trim()) ? q.topic.trim() : "Placement Practice";
    }

    const cleanQuestionObj = {
      id: `ai_${Date.now()}_${i + 1}_${Math.random().toString(36).substring(2, 6)}`,
      category: questionCategory,
      topic: questionTopic,
      difficulty: expectedDifficulty,
      question: questionText,
      options: formattedOptions,
      correctOptionId: rawCorrect,
      explanation: explanationText,
    };

    if (questionCategory === "Quantitative Aptitude") {
      const isSane = validateMathematicalSanity(cleanQuestionObj);
      if (!isSane) {
        throw new GeminiValidationError(`Mathematical calculation check failed for question ${i + 1}.`);
      }
    }

    validated.push(cleanQuestionObj);
  }

  return validated;
}

/**
 * Builds the strict JSON-generating prompt for Gemini.
 */
function buildGenerationPrompt({ category, topic, difficulty, count }) {
  const isMixed = category === "Mixed";

  const scopeDescription = isMixed
    ? `Category: Mixed Placement Preparation (Balanced distribution across Quantitative Aptitude, Logical Reasoning, and Verbal Ability).
- For each question, assign its appropriate "category" ("Quantitative Aptitude", "Logical Reasoning", or "Verbal Ability") and descriptive "topic".`
    : `Category: ${category}
- Topic: ${topic}`;

  return `You are an expert aptitude test author for top placement assessments.
Generate exactly ${count} original, high-quality multiple choice placement questions.

Parameters:
- ${scopeDescription}
- Difficulty: ${difficulty}
- Required Question Count: ${count}

Strict Rules:
1. Every question must have EXACTLY 4 options with IDs "A", "B", "C", and "D".
2. All 4 option texts must be completely distinct.
3. EXACTLY one option must be the correct answer. The "correctOptionId" must be "A", "B", "C", or "D".
4. Numerical calculations and arithmetic reasoning must be 100% mathematically correct.
5. Provide a detailed, step-by-step explanation for why the correct option is right and how it is derived.
6. The explanation must agree with the correctOptionId without contradictions.
7. Avoid giveaway options or ambiguous phrasing.
8. Do not include duplicate or trivial questions.
9. Return strictly valid JSON matching the exact schema below without any markdown fences, backticks, or extra prose.

Required JSON Structure:
{
  "questions": [
    {
      "question": "Question text here",
      "category": "${isMixed ? "Quantitative Aptitude / Logical Reasoning / Verbal Ability" : category}",
      "topic": "${isMixed ? "Specific Topic" : topic}",
      "options": [
        { "id": "A", "text": "First option" },
        { "id": "B", "text": "Second option" },
        { "id": "C", "text": "Third option" },
        { "id": "D", "text": "Fourth option" }
      ],
      "correctOptionId": "A",
      "explanation": "Clear step-by-step solution and derivation."
    }
  ]
}`;
}

/**
 * Core Service: Calls Gemini with approved free-tier model and handles retries.
 */
async function generateAptitudeQuestions({ category, topic, difficulty, count }) {
  // 1. Fail-closed check: verify free-tier eligibility
  const check = verifyFreeTierEligibility();
  if (!check.eligible) {
    throw new GeminiConfigError(check.reason, check.statusCode);
  }

  const { model, apiKey } = check;
  const ai = new GoogleGenAI({ apiKey });

  const prompt = buildGenerationPrompt({ category, topic, difficulty, count });

  // Bounded attempt: at most 2 attempts (1 initial + 1 retry if model output was malformed)
  // NEVER retry if the error is 429 / Quota / Billing / Auth.
  let lastError = null;
  const MAX_ATTEMPTS = 2;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.4, // Lower temperature for mathematical precision and consistency
        },
      });

      const responseText = response.text ? response.text.trim() : "";
      if (!responseText) {
        throw new GeminiValidationError("Gemini returned an empty response.");
      }

      let parsed;
      try {
        // Strip any potential markdown fences just in case
        const cleanJson = responseText
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/```$/g, "")
          .trim();
        parsed = JSON.parse(cleanJson);
      } catch (err) {
        throw new GeminiValidationError(`Malformed JSON from model: ${err.message}`);
      }

      const rawQuestions = parsed.questions || parsed;
      const validatedQuestions = validateQuestions(
        rawQuestions,
        category,
        topic,
        difficulty,
        count
      );

      return {
        modelUsed: model,
        questions: validatedQuestions,
      };
    } catch (error) {
      lastError = error;

      // Detect Quota / Billing / Rate limits - DO NOT RETRY!
      const errorMsg = String(error.message || "").toLowerCase();
      const status = error.status || error.statusCode;

      if (
        status === 429 ||
        errorMsg.includes("quota") ||
        errorMsg.includes("resource_exhausted") ||
        errorMsg.includes("rate limit") ||
        errorMsg.includes("too many requests")
      ) {
        console.warn(`[GeminiService] Quota or rate limit encountered on model ${model}:`, error.message);
        throw new GeminiQuotaError(
          "Google Gemini free-tier daily or per-minute quota has been reached. Please try again later or use local question sets."
        );
      }

      if (status === 401 || status === 403 || errorMsg.includes("api key") || errorMsg.includes("permission denied")) {
        console.error("[GeminiService] Authentication/Authorization failure:", error.message);
        throw new GeminiConfigError("Invalid or unauthorized Gemini API key configured on server.", 503);
      }

      if (error instanceof GeminiConfigError || error instanceof GeminiQuotaError) {
        throw error;
      }

      console.warn(`[GeminiService] Generation attempt ${attempt} failed: ${error.message}`);
      if (attempt === MAX_ATTEMPTS) {
        break;
      }
    }
  }

  // If we reached here, both attempts failed validation or formatting
  throw new GeminiValidationError(
    `Failed to generate valid aptitude questions after verification: ${lastError ? lastError.message : "Unknown verification failure"}`
  );
}

module.exports = {
  APPROVED_FREE_MODELS,
  ALLOWED_CATEGORIES,
  ALLOWED_DIFFICULTIES,
  verifyFreeTierEligibility,
  generateAptitudeQuestions,
  GeminiConfigError,
  GeminiQuotaError,
  GeminiValidationError,
};
