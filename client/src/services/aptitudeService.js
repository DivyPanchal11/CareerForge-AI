import axios from "axios";
import { QUANTITATIVE_QUESTIONS } from "../data/quantitativeQuestions";
import { LOGICAL_QUESTIONS } from "../data/logicalReasoningQuestions";
import { VERBAL_QUESTIONS } from "../data/verbalAbilityQuestions";
import { ALL_TOPICS, getTopicById } from "../data/aptitudeTopics";
import { calculateAptitudeScore, generateAptitudeRecommendations } from "../utils/aptitudeScoring";

export const API_BASE_URL = "http://localhost:5000";

const aptitudeApi = axios.create({
  baseURL: `${API_BASE_URL}/api/aptitude`,
});

// Interceptor to attach JWT Bearer token
aptitudeApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

import {
  getActiveTestSession,
  saveActiveTestSession,
  clearActiveTestSession,
  getAptitudeHistory,
  clearAptitudeHistory,
  saveAptitudeResult,
  getResultById as getStoredResultById,
  getPracticeProgress,
  updatePracticeTopicProgress,
  getAptitudeAggregateStats,
} from "../utils/aptitudeStorage";

export { saveActiveTestSession };

// Master question pool
export const ALL_APTITUDE_QUESTIONS = [
  ...QUANTITATIVE_QUESTIONS,
  ...LOGICAL_QUESTIONS,
  ...VERBAL_QUESTIONS,
];

/**
 * Get question count for a specific topic
 */
export const getTopicQuestionCount = (topicId) => {
  return ALL_APTITUDE_QUESTIONS.filter((q) => q.topic === topicId).length;
};

/**
 * Get question count for a category
 */
export const getCategoryQuestionCount = (category) => {
  return ALL_APTITUDE_QUESTIONS.filter((q) => q.category === category).length;
};

/**
 * Get questions filtered by category, topic, difficulty
 */
export const getFilteredQuestions = ({
  category = "all",
  topic = "all",
  difficulty = "all",
  limit = 10,
}) => {
  let pool = [...ALL_APTITUDE_QUESTIONS];

  if (category && category !== "all") {
    pool = pool.filter((q) => q.category === category);
  }

  if (topic && topic !== "all") {
    pool = pool.filter((q) => q.topic === topic);
  }

  if (difficulty && difficulty !== "all") {
    pool = pool.filter((q) => q.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  // If pool has fewer items than limit and specific difficulty was chosen, fallback to topic/category pool
  if (pool.length < limit && difficulty !== "all") {
    const fallbackPool = ALL_APTITUDE_QUESTIONS.filter((q) => {
      const matchCat = category === "all" || q.category === category;
      const matchTop = topic === "all" || q.topic === topic;
      return matchCat && matchTop;
    });
    // Add unique missing questions
    fallbackPool.forEach((q) => {
      if (!pool.some((p) => p.id === q.id)) {
        pool.push(q);
      }
    });
  }

  return pool.slice(0, Number(limit) || 10);
};

/**
 * Start a new timed assessment session
 */
export const startTestSession = ({
  title = "General Aptitude Test",
  category = "all",
  difficulty = "all",
  questionCount = 10,
  durationMinutes = 15,
}) => {
  const questions = getFilteredQuestions({
    category,
    difficulty,
    limit: questionCount,
  });

  const session = {
    id: `test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title,
    category,
    difficulty,
    durationMinutes: Number(durationMinutes) || 15,
    durationSeconds: (Number(durationMinutes) || 15) * 60,
    startedAt: new Date().toISOString(),
    questions,
    answers: {}, // questionId -> optionId
    markedForReview: {}, // questionId -> boolean
    currentQuestionIndex: 0,
    status: "in_progress",
  };

  saveActiveTestSession(session);
  return session;
};

/**
 * Save answer draft for active test
 */
export const saveTestAnswer = (questionId, optionId) => {
  const session = getActiveTestSession();
  if (!session) return null;

  session.answers = {
    ...session.answers,
    [questionId]: optionId,
  };

  saveActiveTestSession(session);
  return session;
};

/**
 * Clear selected answer for a question
 */
export const clearTestAnswer = (questionId) => {
  const session = getActiveTestSession();
  if (!session) return null;

  const newAnswers = { ...session.answers };
  delete newAnswers[questionId];
  session.answers = newAnswers;

  saveActiveTestSession(session);
  return session;
};

/**
 * Toggle mark for review state
 */
export const toggleMarkForReview = (questionId) => {
  const session = getActiveTestSession();
  if (!session) return null;

  const isMarked = !!session.markedForReview?.[questionId];
  session.markedForReview = {
    ...session.markedForReview,
    [questionId]: !isMarked,
  };

  saveActiveTestSession(session);
  return session;
};

/**
 * Save current question index
 */
export const saveTestCurrentIndex = (index) => {
  const session = getActiveTestSession();
  if (!session) return null;

  session.currentQuestionIndex = index;
  saveActiveTestSession(session);
  return session;
};

/**
 * Submit and evaluate the active test session
 */
export const submitTestSession = (timeSpentSeconds = 0) => {
  const session = getActiveTestSession();
  if (!session) {
    const history = getAptitudeHistory();
    return history[0] || null;
  }

  const scoreResult = calculateAptitudeScore({
    questions: session.questions,
    answers: session.answers,
    timeSpentSeconds,
  });

  const finalResult = {
    id: session.id,
    type: "test",
    title: session.title,
    category: session.category,
    difficulty: session.difficulty,
    completedAt: new Date().toISOString(),
    ...scoreResult,
  };

  saveAptitudeResult(finalResult);
  clearActiveTestSession();
  return finalResult;
};

/**
 * Record a practice session completion
 */
export const completePracticeSession = ({
  topicId,
  topicName,
  category,
  questions = [],
  answers = {},
  timeSpentSeconds = 0,
}) => {
  const scoreResult = calculateAptitudeScore({
    questions,
    answers,
    timeSpentSeconds,
  });

  // Update topic practice counter in storage
  updatePracticeTopicProgress(topicId, {
    attempted: scoreResult.attempted,
    correct: scoreResult.correct,
  });

  const practiceResult = {
    id: `practice_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type: "practice",
    title: `${topicName} Practice`,
    topicId,
    topicName,
    category,
    completedAt: new Date().toISOString(),
    ...scoreResult,
  };

  saveAptitudeResult(practiceResult);
  return practiceResult;
};

/**
 * Get dashboard stats
 */
export const getAptitudeDashboardData = () => {
  const stats = getAptitudeAggregateStats();
  const history = getAptitudeHistory();
  const practiceProgress = getPracticeProgress();
  const recommendations = generateAptitudeRecommendations(history, ALL_TOPICS);

  return {
    ...stats,
    practiceProgress,
    recommendations,
  };
};

/**
 * Fetch public AI generation configuration & remaining quota
 */
export const fetchAptitudeAIConfig = async () => {
  try {
    const response = await aptitudeApi.get("/config");
    return response.data;
  } catch (error) {
    console.warn("[AptitudeService] Could not fetch AI config:", error.message);
    return {
      success: false,
      aiEnabled: false,
      message: error.response?.data?.message || "Failed to load AI config",
    };
  }
};

/**
 * Fetch authenticated user's weekly credit allowance, balance, and next reset
 */
export const fetchUserCredits = async () => {
  try {
    const response = await aptitudeApi.get("/credits");
    return response.data;
  } catch (error) {
    console.warn("[AptitudeService] Could not fetch user credits:", error.message);
    return {
      success: false,
      credits: null,
      message: error.response?.data?.message || "Failed to load credits",
    };
  }
};

/**
 * Generate questions dynamically via Gemini Free-Tier backend backed by weekly credits
 */
export const generateAptitudeAIQuestions = async ({
  category,
  topic,
  difficulty,
  count,
  idempotencyKey,
}) => {
  const cleanIdempotencyKey =
    idempotencyKey || `idem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const response = await aptitudeApi.post(
    "/generate",
    {
      category,
      topic,
      difficulty,
      count,
      idempotencyKey: cleanIdempotencyKey,
    },
    {
      headers: {
        "Idempotency-Key": cleanIdempotencyKey,
      },
    }
  );
  return response.data;
};

/**
 * Submit student test answers to backend for trusted scoring & explanations
 */
export const submitAptitudeAISession = async ({
  sessionId,
  answers,
  timeSpentSeconds = 0,
}) => {
  const response = await aptitudeApi.post("/submit", {
    sessionId,
    answers,
    timeSpentSeconds,
  });
  return response.data;
};

export {
  getActiveTestSession,
  clearActiveTestSession,
  getAptitudeHistory,
  clearAptitudeHistory,
  getStoredResultById as getResultById,
  ALL_TOPICS,
  getTopicById,
};

