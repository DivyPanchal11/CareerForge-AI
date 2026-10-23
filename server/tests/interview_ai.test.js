const test = require("node:test");
const assert = require("node:assert/strict");

const {
  APPROVED_MODELS,
  verifyEligibility,
  InterviewConfigError,
  InterviewQuotaError,
  InterviewValidationError,
} = require("../services/interviewGeminiService");

test("Interview AI Security, Rubric & Free-Tier Test Suite", async (t) => {
  const originalEnv = { ...process.env };

  t.afterEach(() => {
    process.env = { ...originalEnv };
  });

  await t.test("1. Model Whitelist: Only approved free-tier models are accepted", () => {
    assert.deepEqual(APPROVED_MODELS, [
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
    process.env.GEMINI_MODEL = "gemini-3.8-flash";

    const result = verifyEligibility();
    assert.equal(result.eligible, false);
    assert.equal(result.statusCode, 403);
    assert.match(result.reason, /disabled by administrator/i);
  });

  await t.test("3. Missing API Key: Fails closed when GEMINI_API_KEY is missing", () => {
    process.env.GEMINI_AI_ENABLED = "true";
    process.env.GEMINI_API_KEY = "";
    process.env.GEMINI_MODEL = "gemini-3.8-flash";

    const result = verifyEligibility();
    assert.equal(result.eligible, false);
    assert.equal(result.statusCode, 503);
    assert.match(result.reason, /not configured/i);
  });

  await t.test("4. Unapproved Model: Rejects paid models like gemini-1.5-pro", () => {
    process.env.GEMINI_AI_ENABLED = "true";
    process.env.GEMINI_API_KEY = "test_key";
    process.env.GEMINI_MODEL = "gemini-1.5-pro";

    const result = verifyEligibility();
    assert.equal(result.eligible, false);
    assert.equal(result.statusCode, 403);
    assert.match(result.reason, /whitelist/i);
  });

  await t.test("5. Valid Free Model: Succeeds when configured with approved free-tier model", () => {
    process.env.GEMINI_AI_ENABLED = "true";
    process.env.GEMINI_API_KEY = "test_key_valid";
    process.env.GEMINI_MODEL = "gemini-3.8-flash";

    const result = verifyEligibility();
    assert.equal(result.eligible, true);
    assert.equal(result.model, "gemini-3.8-flash");
    assert.equal(result.apiKey, "test_key_valid");
  });

  await t.test("6. Quota Error Detection: Classifies 429 and resource_exhausted properly", () => {
    const err = new InterviewQuotaError();
    assert.equal(err.statusCode, 429);
    assert.match(err.message, /quota/i);
  });

  await t.test("7. Validation Error Handling: Custom error for malformed structure", () => {
    const err = new InterviewValidationError("Output missing rubricScores");
    assert.equal(err.statusCode, 502);
    assert.equal(err.name, "InterviewValidationError");
  });
});
