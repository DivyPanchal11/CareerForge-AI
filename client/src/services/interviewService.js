import axios from "axios";
import {
  STORAGE_KEYS,
  calculateDurationMinutes,
  INTERVIEW_QUESTION_DURATION_SECONDS,
  DEFAULT_INTERVIEW_ROLE,
} from "../constants/interviewConstants";
import { SAMPLE_QUESTIONS } from "../data/interviewQuestions";

export const API_BASE_URL = "http://localhost:5000";

const interviewApi = axios.create({
  baseURL: `${API_BASE_URL}/api/interview`,
  timeout: 45000, // 45 seconds for AI generation
});

// Interceptor to attach Bearer token if user is logged in
interviewApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * LocalStorage Helpers
 */
const safeGetItem = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn(`[InterviewService] Error reading from localStorage (${key}):`, error);
    return null;
  }
};

const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[InterviewService] Error writing to localStorage (${key}):`, error);
  }
};

const safeRemoveItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[InterviewService] Error removing from localStorage (${key}):`, error);
  }
};

/**
 * Fetch AI interview configuration and availability from server
 */
export const fetchInterviewAIConfig = async () => {
  try {
    const res = await interviewApi.get("/config");
    return res.data;
  } catch (error) {
    console.warn("[InterviewService] Failed to fetch server interview config:", error.message);
    return {
      success: false,
      aiEnabled: false,
      reason: error.response?.data?.message || "Server AI endpoint unavailable.",
    };
  }
};

/**
 * Fetch current authenticated user's credit balance and daily reset time
 */
export const fetchInterviewCredits = async () => {
  try {
    const res = await interviewApi.get("/credits");
    return res.data;
  } catch (error) {
    console.warn("[InterviewService] Failed to fetch interview credits:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Unable to fetch credits.",
    };
  }
};

/**
 * Fallback questions if AI backend is temporarily unreachable or quota exceeded
 */
export const getFallbackQuestions = (config) => {
  const {
    interviewType = "technical",
    targetRole = "Frontend Developer",
    difficulty = "intermediate",
    questionCount = 5,
  } = config;

  const count = Number(questionCount) || 5;
  const normalizedType = interviewType.toLowerCase();

  const matches = (q) => {
    const typeMatch =
      normalizedType === "mixed" ||
      (q.type || "").toLowerCase().includes(normalizedType) ||
      (normalizedType === "role_specific" && (q.type || "").toLowerCase().includes("role"));

    const roleMatch =
      q.role === "General" ||
      targetRole === "Custom Role" ||
      (q.role || "").toLowerCase().includes(targetRole.toLowerCase());

    return typeMatch && roleMatch;
  };

  let pool = SAMPLE_QUESTIONS.filter(matches);
  if (pool.length < count) {
    const remaining = SAMPLE_QUESTIONS.filter((q) => !pool.some((p) => p.id === q.id));
    pool = [...pool, ...remaining];
  }

  return pool.slice(0, count).map((q, idx) => ({
    id: q.id || `fallback_${Date.now()}_${idx}`,
    question: q.question,
    category: (q.type || "technical").toLowerCase(),
    difficulty: (q.difficulty || difficulty || "intermediate").toLowerCase(),
    whatItAssesses: q.suggestedPoints || [q.topic || "Core Knowledge"],
    isFallback: true,
  }));
};

/**
 * Generate AI interview questions from backend with credit deduction & idempotency
 */
export const generateAIQuestions = async (config, options = {}) => {
  const idempotencyKey =
    options.idempotencyKey ||
    (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `gen_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);

  try {
    const res = await interviewApi.post(
      "/generate-questions",
      {
        targetRole: config.targetRole,
        experienceLevel: config.experienceLevel,
        interviewType: config.interviewType,
        jobDescription: config.jobDescription,
        skills: config.skills,
        questionCount: config.questionCount,
        idempotencyKey,
      },
      {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      }
    );

    if (res.data?.success && Array.isArray(res.data.questions) && res.data.questions.length > 0) {
      return {
        success: true,
        modelUsed: res.data.modelUsed,
        questions: res.data.questions,
        credits: res.data.credits || null,
        charged: res.data.charged || 0,
      };
    }

    throw new Error(res.data?.message || "Invalid question format received from server.");
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      "Could not generate questions with Gemini AI.";
    const isQuota = Boolean(error.response?.data?.isQuotaExhausted || error.response?.status === 429);
    const isInsufficientCredits = Boolean(
      error.response?.data?.isInsufficientCredits || error.response?.status === 402
    );

    return {
      success: false,
      isQuotaExhausted: isQuota,
      isInsufficientCredits,
      nextReset: error.response?.data?.nextReset || null,
      required: error.response?.data?.required || null,
      balance: error.response?.data?.balance ?? null,
      message: errorMsg,
      fallbackQuestions: isInsufficientCredits ? [] : getFallbackQuestions(config),
    };
  }
};

/**
 * Evaluate single candidate answer via backend Gemini API
 */
export const evaluateAIAnswer = async ({
  targetRole,
  experienceLevel,
  interviewType,
  jobDescription,
  focusSkills,
  question,
  answer,
}) => {
  try {
    const res = await interviewApi.post("/evaluate-answer", {
      targetRole,
      experienceLevel,
      interviewType,
      jobDescription,
      focusSkills,
      question,
      answer,
    });

    if (res.data?.success && res.data.evaluation) {
      return {
        success: true,
        evaluation: res.data.evaluation,
      };
    }

    throw new Error(res.data?.message || "Invalid evaluation format received from server.");
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      "Could not evaluate answer with Gemini AI.";
    const isQuota = Boolean(error.response?.data?.isQuotaExhausted || error.response?.status === 429);

    return {
      success: false,
      isQuotaExhausted: isQuota,
      message: errorMsg,
    };
  }
};

/**
 * Summarize entire interview session via backend Gemini API
 */
export const summarizeAISession = async ({
  targetRole,
  experienceLevel,
  interviewType,
  jobDescription,
  evaluations,
}) => {
  try {
    const res = await interviewApi.post("/summarize-session", {
      targetRole,
      experienceLevel,
      interviewType,
      jobDescription,
      evaluations,
    });

    if (res.data?.success && res.data.summary) {
      return {
        success: true,
        summary: res.data.summary,
      };
    }

    throw new Error(res.data?.message || "Invalid summary format received from server.");
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      "Could not summarize interview session.";
    return {
      success: false,
      message: errorMsg,
    };
  }
};

/**
 * Resolves role cleanly with graceful fallback to neutral DEFAULT_INTERVIEW_ROLE
 */
export const resolveSessionRole = (record) => {
  if (!record) return DEFAULT_INTERVIEW_ROLE;

  const custom =
    (typeof record.customRole === "string" && record.customRole.trim()) ||
    (typeof record.config?.customRole === "string" && record.config.customRole.trim()) ||
    "";

  const targetRole =
    (typeof record.targetRole === "string" && record.targetRole.trim()) ||
    (typeof record.config?.targetRole === "string" && record.config.targetRole.trim()) ||
    "";

  if (targetRole === "Custom Role" && custom) {
    return custom;
  }

  const role =
    (targetRole && targetRole !== "Custom Role" ? targetRole : "") ||
    custom ||
    (typeof record.role === "string" && record.role.trim() && record.role.trim() !== "Custom Role" ? record.role.trim() : "") ||
    (typeof record.config?.role === "string" && record.config.role.trim() && record.config.role.trim() !== "Custom Role" ? record.config.role.trim() : "") ||
    "";

  return role || DEFAULT_INTERVIEW_ROLE;
};

/**
 * Start a new interview session and persist in localStorage
 */
export const startInterviewSession = (config = {}, questions = null) => {
  const role = resolveSessionRole(config);
  const qList = Array.isArray(questions) && questions.length > 0 ? questions : getFallbackQuestions(config);
  const durationMinutes =
    config.durationMinutes ||
    calculateDurationMinutes(qList.length, config.difficulty);

  const initialQuestionTimers = {};
  qList.forEach((q, idx) => {
    initialQuestionTimers[q.id] = {
      startedAt: idx === 0 ? Date.now() : null,
      accumulatedElapsed: 0,
      warningShown: false,
      isExpired: false,
    };
  });

  const sessionConfig = {
    ...config,
    targetRole: role,
    durationMinutes,
    questionCount: qList.length,
    questionDurationSeconds: INTERVIEW_QUESTION_DURATION_SECONDS,
  };

  const newSession = {
    sessionId: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    targetRole: role,
    startedAt: new Date().toISOString(),
    config: sessionConfig,
    durationSeconds: durationMinutes * 60,
    questions: qList,
    answers: {},
    evaluations: {},
    questionTimers: initialQuestionTimers,
    currentQuestionIndex: 0,
    status: "in_progress", // 'in_progress' | 'completed' | 'abandoned'
  };

  safeSetItem(STORAGE_KEYS.CURRENT_SESSION, newSession);
  return newSession;
};

/**
 * Update timer data for a specific question in active session
 */
export const updateQuestionTimer = (questionId, timerData) => {
  const session = getActiveSession();
  if (!session || !questionId) return null;

  session.questionTimers = {
    ...(session.questionTimers || {}),
    [questionId]: {
      ...(session.questionTimers?.[questionId] || {}),
      ...timerData,
    },
  };

  safeSetItem(STORAGE_KEYS.CURRENT_SESSION, session);
  return session;
};

/**
 * Get active in-progress session
 */
export const getActiveSession = () => {
  return safeGetItem(STORAGE_KEYS.CURRENT_SESSION);
};

/**
 * Save draft answer for a question
 */
export const saveDraftAnswer = (questionId, answerText) => {
  const session = getActiveSession();
  if (!session) return null;

  session.answers = {
    ...session.answers,
    [questionId]: answerText,
  };

  safeSetItem(STORAGE_KEYS.CURRENT_SESSION, session);
  return session;
};

/**
 * Save evaluation for a specific question
 */
export const saveQuestionEvaluation = (questionId, evaluation) => {
  const session = getActiveSession();
  if (!session) return null;

  session.evaluations = {
    ...session.evaluations,
    [questionId]: evaluation,
  };

  safeSetItem(STORAGE_KEYS.CURRENT_SESSION, session);
  return session;
};

/**
 * Save current question index in active session
 */
export const saveCurrentQuestionIndex = (index) => {
  const session = getActiveSession();
  if (!session) return;
  session.currentQuestionIndex = index;
  safeSetItem(STORAGE_KEYS.CURRENT_SESSION, session);
};

/**
 * Complete interview session, store in history, and return final result object
 */
export const completeInterviewSession = (summaryData, timeSpentSeconds = 0) => {
  const session = getActiveSession();
  const completedAt = new Date().toISOString();

  const questions = session?.questions || [];
  const answers = session?.answers || {};
  const evaluations = session?.evaluations || {};
  const rawConfig = session?.config || {};
  const role = resolveSessionRole(session);
  const config = {
    ...rawConfig,
    targetRole: role,
  };

  const answeredCount = questions.filter((q) => answers[q.id]?.trim()).length;
  const isZeroAnswered = answeredCount === 0;

  // Compute question reviews
  const questionReviews = questions.map((q) => {
    const ans = answers[q.id] || "";
    const ev = evaluations[q.id];
    return {
      questionId: q.id,
      question: q.question,
      category: q.category,
      difficulty: q.difficulty,
      whatItAssesses: q.whatItAssesses,
      userAnswer: ans,
      isAnswered: Boolean(ans.trim()),
      score: ev ? ev.overallScore : 0,
      rubricScores: ev?.rubricScores || {
        accuracy: 0,
        relevance: 0,
        completeness: 0,
        clarity: 0,
        roleCompetence: 0,
      },
      scoreReasons: ev?.scoreReasons || null,
      strengths: ev?.strengths || [],
      improvements: ev?.improvements || (ans.trim() ? [] : ["Question was skipped or left blank."]),
      accuracyNotes: ev?.accuracyNotes || [],
      sampleAnswer: ev?.sampleAnswer || ev?.sampleImprovement || null,
      sampleImprovement: ev?.sampleAnswer || ev?.sampleImprovement || null,
      followUpQuestion: ev?.followUpQuestion || null,
      uncertaintyNote: ev?.uncertaintyNote || null,
    };
  });

  const finalOverallScore = isZeroAnswered ? 0 : (summaryData.overallScore ?? 0);
  const finalRubricScores = isZeroAnswered
    ? { accuracy: 0, relevance: 0, completeness: 0, clarity: 0, roleCompetence: 0 }
    : (summaryData.aggregateRubricScores || {
        accuracy: finalOverallScore,
        relevance: finalOverallScore,
        completeness: finalOverallScore,
        clarity: finalOverallScore,
        roleCompetence: finalOverallScore,
      });

  const finalResult = {
    id: session?.sessionId || `result_${Date.now()}`,
    completedAt,
    timeSpentSeconds,
    targetRole: role,
    config,
    overallScore: finalOverallScore,
    aggregateRubricScores: finalRubricScores,
    summary: isZeroAnswered
      ? `Session was ended without submitting answers for evaluation. Submit answers to receive AI rubric evaluation.`
      : summaryData.summary,
    keyStrengths: isZeroAnswered
      ? ["Session initiated"]
      : (summaryData.keyStrengths || []),
    improvementAreas: isZeroAnswered
      ? ["Submit answers for each question to be evaluated"]
      : (summaryData.improvementAreas || []),
    topicsToPractice: summaryData.topicsToPractice || [],
    totalQuestions: questions.length,
    answeredCount,
    questionReviews,
  };

  // Save latest result
  safeSetItem(STORAGE_KEYS.LATEST_RESULT, finalResult);

  // Add to history
  const history = safeGetItem(STORAGE_KEYS.HISTORY) || [];
  const updatedHistory = [finalResult, ...history.filter((h) => h.id !== finalResult.id)];
  safeSetItem(STORAGE_KEYS.HISTORY, updatedHistory);

  // Clear active session
  safeRemoveItem(STORAGE_KEYS.CURRENT_SESSION);

  return finalResult;
};

/**
 * Helper to sanitize zero-answer sessions in storage and ensure valid role resolution
 */
const sanitizeSessionRecord = (item) => {
  if (!item) return item;
  const role = resolveSessionRole(item);
  const sanitizedItem = {
    ...item,
    targetRole: role,
    config: {
      ...(item.config || {}),
      targetRole: role,
    },
  };
  const answeredCount = sanitizedItem.answeredCount ??
    (Array.isArray(sanitizedItem.questionReviews) ? sanitizedItem.questionReviews.filter((r) => r.isAnswered).length : 0);

  if (answeredCount === 0 && sanitizedItem.overallScore > 0) {
    return {
      ...sanitizedItem,
      overallScore: 0,
      answeredCount: 0,
      aggregateRubricScores: {
        accuracy: 0,
        relevance: 0,
        completeness: 0,
        clarity: 0,
        roleCompetence: 0,
      },
      summary: "Session was completed without submitting answers. Questions were left blank.",
    };
  }
  return sanitizedItem;
};

/**
 * Retrieve latest completed result
 */
export const getLatestResult = () => {
  const result = safeGetItem(STORAGE_KEYS.LATEST_RESULT);
  return sanitizeSessionRecord(result);
};

/**
 * Retrieve specific result by ID
 */
export const getResultById = (id) => {
  if (!id) return null;
  const latest = getLatestResult();
  if (latest && latest.id === id) return sanitizeSessionRecord(latest);

  const history = safeGetItem(STORAGE_KEYS.HISTORY) || [];
  const found = history.find((item) => item.id === id) || null;
  return sanitizeSessionRecord(found);
};

/**
 * Retrieve history
 */
export const getInterviewHistory = () => {
  const history = safeGetItem(STORAGE_KEYS.HISTORY);
  if (!Array.isArray(history)) return [];
  return history.map(sanitizeSessionRecord);
};

/**
 * Clear history
 */
export const clearInterviewHistory = () => {
  safeRemoveItem(STORAGE_KEYS.HISTORY);
  safeRemoveItem(STORAGE_KEYS.LATEST_RESULT);
  return true;
};

/**
 * Abort active session
 */
export const abortCurrentSession = () => {
  safeRemoveItem(STORAGE_KEYS.CURRENT_SESSION);
};

/**
 * Aggregate statistics
 */
export const getInterviewStats = () => {
  const history = getInterviewHistory();
  if (!history || history.length === 0) {
    return {
      interviewsCompleted: 0,
      averageScore: 0,
      questionsAnswered: 0,
      recentAttempts: [],
    };
  }

  const interviewsCompleted = history.length;
  const scoreSum = history.reduce((acc, curr) => acc + (curr.overallScore || 0), 0);
  const averageScore = Math.round(scoreSum / interviewsCompleted);
  const questionsAnswered = history.reduce((acc, curr) => acc + (curr.answeredCount || 0), 0);

  return {
    interviewsCompleted,
    averageScore,
    questionsAnswered,
    recentAttempts: history.slice(0, 5),
  };
};
