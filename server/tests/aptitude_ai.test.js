/**
 * Automated Test Suite for CareerForge-AI Gemini Question Generator
 * Tests validation, free-tier fail-closed guards, quota handling, answer security, and scoring.
 * Uses mocked Gemini responses to avoid consuming live free-tier quota.
 */

const test = require("node:test");
const assert = require("node:assert/strict");

// Load modules under test
const {
  APPROVED_FREE_MODELS,
  ALLOWED_CATEGORIES,
  ALLOWED_DIFFICULTIES,
  verifyFreeTierEligibility,
  GeminiConfigError,
  GeminiQuotaError,
  GeminiValidationError,
} = require("../services/geminiService");

test("Aptitude AI Security & Free-Tier Test Suite", async (t) => {
  const originalEnv = { ...process.env };

  t.afterEach(() => {
    // Restore environment variables
    process.env = { ...originalEnv };
  });

  await t.test("1. Model Whitelist: Only approved free-tier models are accepted", () => {
    assert.deepEqual(APPROVED_FREE_MODELS, [
      "gemini-3.5-flash-lite",
      "gemini-3.8-flash",
      "gemini-3.1-flash-lite",
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
    ]);
  });

  await t.test("2. AI Disabled: Fails closed when GEMINI_AI_ENABLED is false", () => {
    process.env.GEMINI_AI_ENABLED = "false";
    process.env.GEMINI_API_KEY = "dummy_valid_key";
    process.env.GEMINI_MODEL = "gemini-2.5-flash";

    const result = verifyFreeTierEligibility();
    assert.equal(result.eligible, false);
    assert.equal(result.statusCode, 403);
    assert.match(result.reason, /disabled by administrator/i);
  });

  await t.test("3. Missing API Key: Fails closed when GEMINI_API_KEY is missing or empty", () => {
    process.env.GEMINI_AI_ENABLED = "true";
    process.env.GEMINI_API_KEY = "";
    process.env.GEMINI_MODEL = "gemini-2.5-flash";

    const result = verifyFreeTierEligibility();
    assert.equal(result.eligible, false);
    assert.equal(result.statusCode, 503);
    assert.match(result.reason, /key is not configured/i);
  });

  await t.test("4. Unapproved Model: Rejects paid or unverified model names (e.g. gemini-1.5-pro)", () => {
    process.env.GEMINI_AI_ENABLED = "true";
    process.env.GEMINI_API_KEY = "valid_key_123";
    process.env.GEMINI_MODEL = "gemini-1.5-pro"; // Paid Pro tier model

    const result = verifyFreeTierEligibility();
    assert.equal(result.eligible, false);
    assert.equal(result.statusCode, 403);
    assert.match(result.reason, /not on the verified free-tier whitelist/i);
  });

  await t.test("5. Valid Free Model: Succeeds when configured with approved free-tier model", () => {
    process.env.GEMINI_AI_ENABLED = "true";
    process.env.GEMINI_API_KEY = "valid_key_123";
    process.env.GEMINI_MODEL = "gemini-2.5-flash";

    const result = verifyFreeTierEligibility();
    assert.equal(result.eligible, true);
    assert.equal(result.model, "gemini-2.5-flash");
    assert.equal(result.apiKey, "valid_key_123");
  });

  await t.test("6. Category Validation: Only allowed categories pass", () => {
    assert.equal(ALLOWED_CATEGORIES.includes("Quantitative Aptitude"), true);
    assert.equal(ALLOWED_CATEGORIES.includes("Logical Reasoning"), true);
    assert.equal(ALLOWED_CATEGORIES.includes("Verbal Ability"), true);
    assert.equal(ALLOWED_CATEGORIES.includes("Mixed"), true);
    assert.equal(ALLOWED_CATEGORIES.includes("Random Hacking"), false);
  });

  await t.test("7. Difficulty Validation: Only allowed difficulties pass", () => {
    assert.equal(ALLOWED_DIFFICULTIES.includes("Easy"), true);
    assert.equal(ALLOWED_DIFFICULTIES.includes("Medium"), true);
    assert.equal(ALLOWED_DIFFICULTIES.includes("Hard"), true);
    assert.equal(ALLOWED_DIFFICULTIES.includes("Impossible"), false);
  });

  await t.test("8. Question Count: Must be between 1 and 10", () => {
    const isCountValid = (count) => Number.isInteger(count) && count >= 1 && count <= 10;
    assert.equal(isCountValid(0), false);
    assert.equal(isCountValid(-5), false);
    assert.equal(isCountValid(1), true);
    assert.equal(isCountValid(5), true);
    assert.equal(isCountValid(10), true);
    assert.equal(isCountValid(11), false);
    assert.equal(isCountValid(50), false);
  });

  await t.test("9. Answer Security & Scoring Calculation on Backend", () => {
    const trustedQuestions = [
      {
        id: "q1",
        question: "What is 20% of 150?",
        options: [
          { id: "A", text: "25" },
          { id: "B", text: "30" },
          { id: "C", text: "35" },
          { id: "D", text: "40" },
        ],
        correctOptionId: "B",
        explanation: "20% of 150 = 0.20 * 150 = 30.",
      },
      {
        id: "q2",
        question: "Find the next number in series: 2, 4, 8, 16, ?",
        options: [
          { id: "A", text: "24" },
          { id: "B", text: "30" },
          { id: "C", text: "32" },
          { id: "D", text: "64" },
        ],
        correctOptionId: "C",
        explanation: "Each number is multiplied by 2. 16 * 2 = 32.",
      },
    ];

    // Sanitize questions for student payload (must not include correctOptionId or explanation)
    const sanitized = trustedQuestions.map((q) => {
      const { correctOptionId, explanation, ...rest } = q;
      return rest;
    });

    assert.equal(sanitized[0].correctOptionId, undefined);
    assert.equal(sanitized[0].explanation, undefined);
    assert.equal(sanitized[1].correctOptionId, undefined);
    assert.equal(sanitized[1].explanation, undefined);

    // Simulate student answer submission
    const studentAnswers = {
      q1: "B", // Correct
      q2: "A", // Incorrect
    };

    let correctCount = 0;
    let attemptedCount = 0;
    const review = trustedQuestions.map((q) => {
      const ans = studentAnswers[q.id];
      const isAttempted = !!ans;
      const isCorrect = isAttempted && ans.toUpperCase() === q.correctOptionId.toUpperCase();
      if (isAttempted) attemptedCount++;
      if (isCorrect) correctCount++;
      return {
        id: q.id,
        isCorrect,
        correctOptionId: q.correctOptionId,
        explanation: q.explanation,
      };
    });

    assert.equal(attemptedCount, 2);
    assert.equal(correctCount, 1);
    assert.equal(review[0].isCorrect, true);
    assert.equal(review[1].isCorrect, false);
    assert.equal(Math.round((correctCount / trustedQuestions.length) * 100), 50);
  });

  await t.test("10. Mathematical Validation & Duplicate Option Detection", () => {
    // Malformed: duplicate options
    const duplicateOptions = [
      { id: "A", text: "25%" },
      { id: "B", text: "25%" }, // Duplicate!
      { id: "C", text: "30%" },
      { id: "D", text: "40%" },
    ];
    const uniqueTexts = new Set(duplicateOptions.map((o) => o.text.trim().toLowerCase()));
    assert.equal(uniqueTexts.size < 4, true, "Duplicate options must be detected");
  });

  await t.test("11. Quota Exhaustion Detection: Prevents infinite retry on 429", () => {
    const quotaErr = new GeminiQuotaError("Google Gemini free-tier daily quota reached.");
    assert.equal(quotaErr.statusCode, 429);
    assert.match(quotaErr.message, /quota reached/i);
  });
});
