const { GoogleGenAI } = require("@google/genai");

/**
 * Approved free-tier Gemini models
 */
const APPROVED_MODELS = Object.freeze([
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
]);

const ALLOWED_INTERVIEW_TYPES = Object.freeze([
  "technical",
  "behavioral",
  "role_specific",
  "mixed",
]);

const ALLOWED_EXPERIENCE_LEVELS = Object.freeze([
  "entry",
  "mid",
  "senior",
  "custom",
]);

/**
 * Custom Error Classes for Clean Classification
 */
class InterviewConfigError extends Error {
  constructor(message, statusCode = 403) {
    super(message);
    this.name = "InterviewConfigError";
    this.statusCode = statusCode;
  }
}

class InterviewQuotaError extends Error {
  constructor(
    message = "The AI practice service is temporarily at its free-tier rate or daily quota limit. Please wait a moment and retry.",
    statusCode = 429
  ) {
    super(message);
    this.name = "InterviewQuotaError";
    this.statusCode = statusCode;
  }
}

class InterviewValidationError extends Error {
  constructor(message = "AI response validation failed.", statusCode = 502) {
    super(message);
    this.name = "InterviewValidationError";
    this.statusCode = statusCode;
  }
}

/**
 * Verifies server configuration and free-tier eligibility
 */
function verifyEligibility() {
  const isEnabled = String(process.env.GEMINI_AI_ENABLED ?? "true").trim().toLowerCase() === "true";
  if (!isEnabled) {
    return {
      eligible: false,
      reason: "AI interview practice is currently disabled by administrator configuration.",
      statusCode: 403,
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (
    !apiKey ||
    !apiKey.trim() ||
    apiKey.trim() === "your_secret_key" ||
    apiKey.trim() === "your_gemini_api_key_here"
  ) {
    return {
      eligible: false,
      reason: "Google Gemini API key is not configured on the server.",
      statusCode: 503,
    };
  }

  const configuredModel = process.env.GEMINI_MODEL ? process.env.GEMINI_MODEL.trim() : "gemini-3.5-flash-lite";
  if (!APPROVED_MODELS.includes(configuredModel)) {
    return {
      eligible: false,
      reason: `Configured model '${configuredModel}' is not on the verified free-tier whitelist.`,
      statusCode: 403,
    };
  }

  return {
    eligible: true,
    model: configuredModel,
    apiKey: apiKey.trim(),
  };
}

/**
 * Safely parse JSON from LLM, stripping markdown fences if present
 */
function safeJsonParse(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw new InterviewValidationError("Received empty response from AI model.");
  }
  const clean = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/g, "")
    .trim();

  try {
    return JSON.parse(clean);
  } catch (err) {
    throw new InterviewValidationError(`Malformed JSON response from AI model: ${err.message}`);
  }
}

/**
 * Extracts a clean, human-readable error string from raw Gemini errors
 */
function extractReadableErrorMessage(rawMessage) {
  if (!rawMessage || typeof rawMessage !== "string") {
    return "AI service is temporarily unavailable. Please retry.";
  }

  // Check if rawMessage contains a JSON error block: {"error": {"message": ...}}
  try {
    const jsonMatch = rawMessage.match(/\{[\s\S]*"error"[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.error && parsed.error.message) {
        return parsed.error.message;
      }
    }
  } catch (_) {
    // Ignore JSON parsing failure
  }

  return rawMessage;
}

/**
 * Handles Gemini API errors cleanly without leaking raw JSON or secrets
 */
function handleGeminiError(error, model) {
  const errorMsg = String(error.message || "").toLowerCase();
  const status = error.status || error.statusCode;

  // 1. Quota exhaustion or rate limit
  if (
    status === 429 ||
    errorMsg.includes("quota") ||
    errorMsg.includes("resource_exhausted") ||
    errorMsg.includes("rate limit") ||
    errorMsg.includes("too many requests")
  ) {
    console.warn(`[InterviewGeminiService] Quota or rate limit on model ${model}:`, error.message);
    return new InterviewQuotaError(
      "Google Gemini free-tier service is temporarily at its limit. Please wait a moment and retry."
    );
  }

  // 2. High demand / temporary spike (HTTP 503)
  if (
    status === 503 ||
    errorMsg.includes("high demand") ||
    errorMsg.includes("unavailable") ||
    errorMsg.includes("overloaded")
  ) {
    console.warn(`[InterviewGeminiService] Upstream high demand (503) on model ${model}:`, error.message);
    return new InterviewQuotaError(
      "Google Gemini free-tier servers are currently experiencing high demand. Please wait a moment and retry, or continue with curated question sets.",
      503
    );
  }

  // 3. Auth failure
  if (
    status === 401 ||
    status === 403 ||
    errorMsg.includes("api key") ||
    errorMsg.includes("permission denied")
  ) {
    console.error("[InterviewGeminiService] Authentication failure:", error.message);
    return new InterviewConfigError("Invalid or unauthorized Gemini API key configured on server.", 503);
  }

  if (
    error instanceof InterviewConfigError ||
    error instanceof InterviewQuotaError ||
    error instanceof InterviewValidationError
  ) {
    return error;
  }

  const cleanMsg = extractReadableErrorMessage(error.message);
  return new InterviewValidationError(`AI service error: ${cleanMsg}`);
}

/**
 * Executes a Gemini request with automatic fallback to secondary approved model
 * if primary model is experiencing high demand (503) or rate limit.
 */
async function executeWithFallback(ai, primaryModel, generateFn) {
  try {
    return await generateFn(primaryModel);
  } catch (error) {
    const errorMsg = String(error.message || "").toLowerCase();
    const status = error.status || error.statusCode;

    const isHighDemandOrBusy =
      status === 503 ||
      status === 429 ||
      errorMsg.includes("high demand") ||
      errorMsg.includes("unavailable") ||
      errorMsg.includes("not found") ||
      errorMsg.includes("no longer available");

    if (isHighDemandOrBusy) {
      // Pick a suitable fallback from approved models
      const fallbacks = APPROVED_MODELS.filter((m) => m !== primaryModel);
      for (const fallbackModel of fallbacks) {
        try {
          console.log(`[InterviewGeminiService] Model ${primaryModel} busy/unavailable. Trying fallback ${fallbackModel}...`);
          const res = await generateFn(fallbackModel);
          return res;
        } catch (fallbackErr) {
          console.warn(`[InterviewGeminiService] Fallback model ${fallbackModel} also failed:`, fallbackErr.message);
        }
      }
    }

    throw handleGeminiError(error, primaryModel);
  }
}

/**
 * Validates and sanitizes questions returned from Gemini
 */
function validateQuestions(rawList, expectedCount) {
  if (!Array.isArray(rawList) || rawList.length === 0) {
    throw new InterviewValidationError("Model did not return a valid list of questions.");
  }

  const validCategories = ["technical", "behavioral", "role_specific"];
  const validDifficulties = ["beginner", "intermediate", "advanced"];
  const validated = [];

  for (let i = 0; i < rawList.length; i++) {
    const item = rawList[i];
    if (!item || typeof item !== "object") continue;

    const questionText = typeof item.question === "string" ? item.question.trim() : "";
    if (questionText.length < 15) {
      continue;
    }

    let category = typeof item.category === "string" ? item.category.trim().toLowerCase() : "technical";
    if (!validCategories.includes(category)) {
      category = category.includes("behav") ? "behavioral" : category.includes("role") ? "role_specific" : "technical";
    }

    let difficulty = typeof item.difficulty === "string" ? item.difficulty.trim().toLowerCase() : "intermediate";
    if (!validDifficulties.includes(difficulty)) {
      difficulty = "intermediate";
    }

    const whatItAssesses = Array.isArray(item.whatItAssesses)
      ? item.whatItAssesses.map((s) => String(s).trim()).filter(Boolean).slice(0, 5)
      : ["Core Competence"];

    validated.push({
      id: `ai_q_${Date.now()}_${i + 1}_${Math.random().toString(36).substring(2, 6)}`,
      question: questionText,
      category,
      difficulty,
      whatItAssesses: whatItAssesses.length > 0 ? whatItAssesses : ["Core Competence"],
    });

    if (validated.length >= expectedCount) break;
  }

  if (validated.length === 0) {
    throw new InterviewValidationError("No valid questions could be extracted from AI response.");
  }

  return validated;
}

/**
 * Generate questions specific to role, level, type, and optional job description/skills
 */
async function generateQuestions({
  targetRole,
  experienceLevel,
  interviewType,
  jobDescription = "",
  skills = "",
  questionCount = 5,
}) {
  const check = verifyEligibility();
  if (!check.eligible) {
    throw new InterviewConfigError(check.reason, check.statusCode);
  }

  const { model, apiKey } = check;
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are an expert technical and hiring interviewer.
Generate exactly ${questionCount} interview questions tailored specifically for this candidate.

Target Role: ${targetRole}
Experience Level: ${experienceLevel}
Interview Type: ${interviewType}
${skills ? `Skills / Focus Areas: ${skills}` : ""}
${jobDescription ? `Job Description Context:\n${jobDescription.slice(0, 1500)}` : ""}

Strict Guidelines:
1. Avoid generic questions when role details are available. Calibrate question depth to the candidate's experience level (${experienceLevel}).
2. For Technical questions, focus on realistic problems, architecture, or technical trade-offs relevant to ${targetRole}.
3. For Behavioral questions, target realistic workplace situations, collaboration, leadership, or conflict resolution.
4. For Role-specific questions, test domain methodologies, workflows, and tools typical for ${targetRole}.
5. For Mixed interviews, provide a balanced combination of technical, behavioral, and role-specific questions.
6. Do NOT invent company-specific requirements not present in the supplied details; rely only on the supplied text and industry-standard role expectations.
7. Do NOT include sample answers, hints, or answer keys in the output.
8. Output strictly valid JSON matching the exact schema below:

{
  "questions": [
    {
      "question": "Clear, detailed, realistic interview question prompt",
      "category": "technical | behavioral | role_specific",
      "difficulty": "beginner | intermediate | advanced",
      "whatItAssesses": ["Skill 1", "Skill 2"]
    }
  ]
}`;

  let usedModel = model;
  const response = await executeWithFallback(ai, model, async (activeModel) => {
    usedModel = activeModel;
    return await ai.models.generateContent({
      model: activeModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5,
      },
    });
  });

  const parsed = safeJsonParse(response.text);
  const rawList = parsed.questions || parsed;
  const validated = validateQuestions(rawList, questionCount);

  return {
    modelUsed: usedModel,
    questions: validated,
  };
}

/**
 * Validates and clamps a number between 0 and 100
 */
function clampScore(val, defaultVal = 70) {
  const num = Number(val);
  if (isNaN(num)) return defaultVal;
  return Math.max(0, Math.min(100, Math.round(num)));
}

/**
 * Evaluates candidate's actual answer against rigorous, fair rubrics
 */
async function evaluateAnswer({
  targetRole,
  experienceLevel,
  interviewType,
  jobDescription = "",
  focusSkills = "",
  question,
  answer,
}) {
  const check = verifyEligibility();
  if (!check.eligible) {
    throw new InterviewConfigError(check.reason, check.statusCode);
  }

  const { model, apiKey } = check;
  const ai = new GoogleGenAI({ apiKey });

  const qText = typeof question === "string" ? question : question?.question || "";
  const qCategory = question?.category || interviewType || "technical";
  const qDifficulty = question?.difficulty || "intermediate";
  const qAssesses = Array.isArray(question?.whatItAssesses)
    ? question.whatItAssesses.join(", ")
    : "Domain knowledge";

  const prompt = `You are an expert, objective, fair, and constructive interview evaluator.
Evaluate ONLY the candidate's submitted answer against the question and the session context:

Evaluation Context:
- Target Role: ${targetRole}
- Experience Level: ${experienceLevel}
- Interview Type: ${interviewType}
- Question Category: ${qCategory}
- Difficulty Level: ${qDifficulty}
- Question Assesses: ${qAssesses}
${focusSkills ? `- Focus Skills: ${focusSkills}` : ""}
${jobDescription ? `- Supplied Job Description: ${jobDescription.slice(0, 1200)}` : ""}

Interview Question Asked:
"${qText}"

Candidate's Submitted Answer:
"${answer}"

CORE EVALUATION PRINCIPLES:
1. Strict Evidence-Based Assessment:
   - Evaluate ONLY what the candidate actually stated or clearly omitted.
   - Do NOT assume the candidate has experience, skills, or credentials they did not mention.
   - Do NOT reward confidence, assertive tone, answer length, verbosity, or buzzwords unless the content is technically accurate and directly relevant.
   - Do NOT award a high score solely because the candidate included many details.
   - Accept different valid approaches, methodologies, or design patterns when the question allows multiple valid solutions.
2. Distinguish Clearly:
   - Incorrect information (factual/technical mistakes).
   - Missing essential details (omissions required for a complete answer).
   - Reasonable alternative approaches or trade-offs.
   - Information that inherently depends on employer, product, jurisdiction, or policy.
3. Regulated, Financial, Legal, Medical & System Procedures:
   - For accounting, finance, banking, legal, tax, medical, or other regulated domains, treat rules, journal entries, formulas, and operational steps as dependent on jurisdiction, accounting standard (e.g. GAAP vs IFRS), date, and organization policy.
   - Treat entries and workflows as conditional when they depend on context (e.g., "If credited to the customer's account, a typical entry is...").
   - Do NOT claim to know a named employer's internal proprietary systems, processes, or hiring expectations unless explicitly confirmed in the supplied job description.
   - If a detail cannot be verified or depends on jurisdiction/policy, state the uncertainty in "uncertaintyNote" rather than guessing.
   - If the question is too vague, open-ended, or combines several distinct topics, mention that limitation in "uncertaintyNote" and evaluate the answer fairly.
4. Scoring Rubric (Score each dimension from 0 to 100 based on evidence):
   - accuracy (0-100): Factual and technical correctness. Penalize errors, but distinguish reasonable alternative approaches from mistakes.
   - relevance (0-100): How directly the answer addresses the question asked and fits the ${targetRole} context.
   - completeness (0-100): Whether it covers the question's main requirements, necessary components, and expected scope.
   - clarity (0-100): Whether the answer is understandable, logically organized, and cleanly communicated.
   - roleCompetence (0-100): Whether it demonstrates appropriate skills, practical grasp, and seniority for a ${experienceLevel} candidate.
   - overallScore: Calculate consistently as the unweighted average of the 5 rubric dimensions: (accuracy + relevance + completeness + clarity + roleCompetence) / 5.
5. Score Justifications (scoreReasons):
   - Provide a concise 1-2 sentence evidence-based explanation for EACH dimension's score, citing specific points the candidate mentioned or omitted.
6. Sample Answer Requirements:
   - Provide "sampleAnswer" ONLY when it helps illustrate how to address a gap or missing concept.
   - Return null if the candidate's answer was already strong and comprehensive, or if a brief improvement suggestion is enough.
   - Keep it concise and suitable for spoken delivery in an interview (speaking-friendly, not an essay).
   - Label and qualify context-dependent examples (e.g., "Example speaking response: Depending on the architecture, ..."). Never present it as universal or as the candidate's own words.
7. Follow-Up Question:
   - Suggest a concise, relevant follow-up question ("followUpQuestion") that probes deeper into an edge case or clarifies a key point, or null if not needed.

Return strictly valid JSON matching this schema:
{
  "overallScore": 0,
  "rubricScores": {
    "accuracy": 0,
    "relevance": 0,
    "completeness": 0,
    "clarity": 0,
    "roleCompetence": 0
  },
  "scoreReasons": {
    "accuracy": "Brief evidence-based justification citing what candidate said or got wrong",
    "relevance": "Brief evidence-based justification on how directly it addresses the question",
    "completeness": "Brief evidence-based justification citing covered vs missing requirements",
    "clarity": "Brief evidence-based justification on organization and articulation",
    "roleCompetence": "Brief evidence-based justification on demonstrated role skills for level"
  },
  "strengths": [
    "Specific strength with direct evidence from the answer"
  ],
  "improvements": [
    "Specific missing, vague, or incorrect point with concise actionable guidance"
  ],
  "accuracyNotes": [
    "Specific note distinguishing errors from omissions or valid alternative approaches (empty array if none)"
  ],
  "sampleAnswer": "Concise speaking-friendly example response (or null)",
  "followUpQuestion": "Concise follow-up probe (or null)",
  "uncertaintyNote": "Contextual, jurisdictional, or question ambiguity limitation note (or null)"
}`;

  const response = await executeWithFallback(ai, model, async (activeModel) => {
    return await ai.models.generateContent({
      model: activeModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });
  });

  const parsed = safeJsonParse(response.text);

  const rubric = parsed.rubricScores || {};
  const accuracy = clampScore(rubric.accuracy, 70);
  const relevance = clampScore(rubric.relevance, 70);
  const completeness = clampScore(rubric.completeness ?? rubric.depth, 70);
  const clarity = clampScore(rubric.clarity, 70);
  const roleCompetence = clampScore(rubric.roleCompetence, 70);

  // Consistent mathematical calculation of overall score from the 5 rubric dimensions
  const calculatedAvg = Math.round(
    (accuracy + relevance + completeness + clarity + roleCompetence) / 5
  );
  const overallScore = clampScore(parsed.overallScore, calculatedAvg);

  // Extract score justifications
  const rawReasons = parsed.scoreReasons || {};
  const scoreReasons = {
    accuracy: typeof rawReasons.accuracy === "string" && rawReasons.accuracy.trim()
      ? rawReasons.accuracy.trim()
      : `Technical accuracy scored at ${accuracy}/100.`,
    relevance: typeof rawReasons.relevance === "string" && rawReasons.relevance.trim()
      ? rawReasons.relevance.trim()
      : `Relevance to question scored at ${relevance}/100.`,
    completeness: typeof rawReasons.completeness === "string" && rawReasons.completeness.trim()
      ? rawReasons.completeness.trim()
      : `Requirement completeness scored at ${completeness}/100.`,
    clarity: typeof rawReasons.clarity === "string" && rawReasons.clarity.trim()
      ? rawReasons.clarity.trim()
      : `Communication clarity scored at ${clarity}/100.`,
    roleCompetence: typeof rawReasons.roleCompetence === "string" && rawReasons.roleCompetence.trim()
      ? rawReasons.roleCompetence.trim()
      : `Role competence scored at ${roleCompetence}/100.`,
  };

  const strengths = Array.isArray(parsed.strengths)
    ? parsed.strengths.map((s) => String(s).trim()).filter(Boolean)
    : ["Communicated core foundational concepts directly."];

  const improvements = Array.isArray(parsed.improvements)
    ? parsed.improvements.map((s) => String(s).trim()).filter(Boolean)
    : ["Elaborate with concrete technical examples and specific trade-offs."];

  const accuracyNotes = Array.isArray(parsed.accuracyNotes)
    ? parsed.accuracyNotes.map((s) => String(s).trim()).filter(Boolean)
    : [];

  const rawSample = parsed.sampleAnswer ?? parsed.sampleImprovement;
  const sampleAnswer = typeof rawSample === "string" && rawSample.trim()
    ? rawSample.trim()
    : null;

  const followUpQuestion = typeof parsed.followUpQuestion === "string" && parsed.followUpQuestion.trim()
    ? parsed.followUpQuestion.trim()
    : null;

  const uncertaintyNote = typeof parsed.uncertaintyNote === "string" && parsed.uncertaintyNote.trim()
    ? parsed.uncertaintyNote.trim()
    : null;

  return {
    overallScore,
    rubricScores: {
      accuracy,
      relevance,
      completeness,
      clarity,
      roleCompetence,
      // Backward-compatibility alias
      depth: completeness,
    },
    scoreReasons,
    strengths: strengths.length > 0 ? strengths : ["Communicated core foundational concepts directly."],
    improvements: improvements.length > 0 ? improvements : ["Elaborate with concrete technical examples."],
    accuracyNotes,
    sampleAnswer,
    // Backward-compatibility alias
    sampleImprovement: sampleAnswer,
    followUpQuestion,
    uncertaintyNote,
  };
}

/**
 * Summarizes the entire interview practice session
 */
async function summarizeSession({
  targetRole,
  experienceLevel,
  interviewType,
  jobDescription = "",
  evaluations = [],
}) {
  const check = verifyEligibility();
  if (!check.eligible) {
    throw new InterviewConfigError(check.reason, check.statusCode);
  }

  const { model, apiKey } = check;
  const ai = new GoogleGenAI({ apiKey });

  if (!Array.isArray(evaluations) || evaluations.length === 0) {
    throw new InterviewValidationError("No evaluations provided to summarize.");
  }

  let totalScore = 0;
  let totalAcc = 0;
  let totalRel = 0;
  let totalComp = 0;
  let totalCla = 0;
  let totalRole = 0;

  evaluations.forEach((e) => {
    totalScore += e.overallScore || 0;
    const r = e.rubricScores || {};
    totalAcc += r.accuracy || e.overallScore || 0;
    totalRel += r.relevance || e.overallScore || 0;
    totalComp += r.completeness || r.depth || e.overallScore || 0;
    totalCla += r.clarity || e.overallScore || 0;
    totalRole += r.roleCompetence || e.overallScore || 0;
  });

  const count = evaluations.length;
  const baselineOverall = Math.round(totalScore / count);
  const baselineRubric = {
    accuracy: Math.round(totalAcc / count),
    relevance: Math.round(totalRel / count),
    completeness: Math.round(totalComp / count),
    clarity: Math.round(totalCla / count),
    roleCompetence: Math.round(totalRole / count),
  };

  const evalSummaryForPrompt = evaluations.map((item, idx) => ({
    questionIndex: idx + 1,
    question: item.question?.question || item.question || `Question ${idx + 1}`,
    score: item.overallScore,
    rubric: item.rubricScores,
    strengths: item.strengths,
    improvements: item.improvements,
  }));

  const prompt = `You are a senior hiring committee chair providing an end-of-session interview summary.

Candidate Interview Context:
- Target Role: ${targetRole}
- Experience Level: ${experienceLevel}
- Interview Type: ${interviewType}
${jobDescription ? `- Job Description Context: ${jobDescription.slice(0, 1000)}` : ""}

Completed Question Evaluations (${count} questions total):
${JSON.stringify(evalSummaryForPrompt, null, 2)}

Provide a comprehensive, encouraging, and constructive interview debrief.
Identify overall candidate readiness for ${targetRole}, recurrent strengths, primary areas for improvement, and concrete topics/skills to practice next.

Return strictly valid JSON:
{
  "overallScore": ${baselineOverall},
  "aggregateRubricScores": {
    "accuracy": ${baselineRubric.accuracy},
    "relevance": ${baselineRubric.relevance},
    "completeness": ${baselineRubric.completeness},
    "clarity": ${baselineRubric.clarity},
    "roleCompetence": ${baselineRubric.roleCompetence}
  },
  "summary": "2-3 paragraphs synthesizing overall interview performance, communication style, technical grounding, and readiness.",
  "keyStrengths": [
    "Recurrent strength observed across questions",
    "Another notable strength"
  ],
  "improvementAreas": [
    "Specific habit or technical gap to address",
    "Another actionable area for improvement"
  ],
  "topicsToPractice": [
    "Topic 1 to study",
    "Topic 2 to study",
    "Topic 3 to study"
  ]
}`;

  const response = await executeWithFallback(ai, model, async (activeModel) => {
    return await ai.models.generateContent({
      model: activeModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });
  });

  const parsed = safeJsonParse(response.text);

  const agg = parsed.aggregateRubricScores || {};
  const completeness = clampScore(agg.completeness ?? agg.depth, baselineRubric.completeness);

  return {
    overallScore: clampScore(parsed.overallScore, baselineOverall),
    aggregateRubricScores: {
      accuracy: clampScore(agg.accuracy, baselineRubric.accuracy),
      relevance: clampScore(agg.relevance, baselineRubric.relevance),
      completeness,
      clarity: clampScore(agg.clarity, baselineRubric.clarity),
      roleCompetence: clampScore(agg.roleCompetence, baselineRubric.roleCompetence),
      // Backward-compatibility alias
      depth: completeness,
    },
    summary: typeof parsed.summary === "string" && parsed.summary.trim()
      ? parsed.summary.trim()
      : "Session completed successfully with solid demonstrated foundation and clear opportunities for further technical depth.",
    keyStrengths: Array.isArray(parsed.keyStrengths) && parsed.keyStrengths.length > 0
      ? parsed.keyStrengths.map((s) => String(s).trim()).filter(Boolean)
      : ["Clear communication", "Structured approach to interview questions"],
    improvementAreas: Array.isArray(parsed.improvementAreas) && parsed.improvementAreas.length > 0
      ? parsed.improvementAreas.map((s) => String(s).trim()).filter(Boolean)
      : ["Elaborate on edge cases and measurable impacts"],
    topicsToPractice: Array.isArray(parsed.topicsToPractice) && parsed.topicsToPractice.length > 0
      ? parsed.topicsToPractice.map((s) => String(s).trim()).filter(Boolean)
      : [targetRole, "System Architecture", "Behavioral Scenarios"],
  };
}

module.exports = {
  APPROVED_MODELS,
  ALLOWED_INTERVIEW_TYPES,
  ALLOWED_EXPERIENCE_LEVELS,
  verifyEligibility,
  generateQuestions,
  evaluateAnswer,
  summarizeSession,
  InterviewConfigError,
  InterviewQuotaError,
  InterviewValidationError,
};
