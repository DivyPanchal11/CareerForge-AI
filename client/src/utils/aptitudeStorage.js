/**
 * Aptitude Browser Storage Helper
 * Provides safe, robust wrappers around localStorage without breaking if storage is disabled or quota exceeded.
 * Clearly documents that storage is client-side prototype persistence.
 */

import { STORAGE_KEYS } from "../constants/aptitudeConstants";

const safeGetItem = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`[AptitudeStorage] Error reading key "${key}":`, err);
    return fallback;
  }
};

const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[AptitudeStorage] Error writing key "${key}":`, err);
    return false;
  }
};

const safeRemoveItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.warn(`[AptitudeStorage] Error removing key "${key}":`, err);
    return false;
  }
};

/* --- Active Test Session --- */
export const getActiveTestSession = () => {
  return safeGetItem(STORAGE_KEYS.CURRENT_TEST_SESSION, null);
};

export const saveActiveTestSession = (session) => {
  return safeSetItem(STORAGE_KEYS.CURRENT_TEST_SESSION, session);
};

export const clearActiveTestSession = () => {
  return safeRemoveItem(STORAGE_KEYS.CURRENT_TEST_SESSION);
};

/* --- History & Results --- */
export const getAptitudeHistory = () => {
  const history = safeGetItem(STORAGE_KEYS.TEST_HISTORY, []);
  return Array.isArray(history) ? history : [];
};

export const saveAptitudeResult = (result) => {
  const history = getAptitudeHistory();
  const updatedHistory = [result, ...history];
  safeSetItem(STORAGE_KEYS.TEST_HISTORY, updatedHistory);
  safeSetItem(STORAGE_KEYS.LATEST_RESULT, result);
  return result;
};

export const getResultById = (id) => {
  if (!id) return null;
  const latest = safeGetItem(STORAGE_KEYS.LATEST_RESULT, null);
  if (latest && latest.id === id) return latest;
  const history = getAptitudeHistory();
  return history.find((h) => h.id === id) || null;
};

export const clearAptitudeHistory = () => {
  safeRemoveItem(STORAGE_KEYS.TEST_HISTORY);
  safeRemoveItem(STORAGE_KEYS.LATEST_RESULT);
  return true;
};

/* --- Practice Mode Progress --- */
export const getPracticeProgress = () => {
  return safeGetItem(STORAGE_KEYS.PRACTICE_PROGRESS, {});
};

export const updatePracticeTopicProgress = (topicId, { attempted = 0, correct = 0 }) => {
  const progress = getPracticeProgress();
  const current = progress[topicId] || { attempted: 0, correct: 0 };
  const updated = {
    ...progress,
    [topicId]: {
      attempted: current.attempted + attempted,
      correct: current.correct + correct,
      lastPracticed: new Date().toISOString(),
    },
  };
  safeSetItem(STORAGE_KEYS.PRACTICE_PROGRESS, updated);
  return updated;
};

/* --- Aggregate User Statistics --- */
export const getAptitudeAggregateStats = () => {
  const history = getAptitudeHistory();
  const practiceProgress = getPracticeProgress();

  let practiceAttempted = 0;
  let practiceCorrect = 0;
  Object.values(practiceProgress).forEach((p) => {
    practiceAttempted += p.attempted || 0;
    practiceCorrect += p.correct || 0;
  });

  let testAttempted = 0;
  let testCorrect = 0;
  let testsCompleted = 0;

  // Breakdown by category
  const categoryStats = {
    quantitative: { attempted: 0, correct: 0 },
    logical: { attempted: 0, correct: 0 },
    verbal: { attempted: 0, correct: 0 },
  };

  history.forEach((attempt) => {
    testsCompleted += 1;
    testAttempted += attempt.attempted || 0;
    testCorrect += attempt.correct || 0;

    (attempt.topicPerformance || []).forEach((tp) => {
      const cat = tp.category || "quantitative";
      if (categoryStats[cat]) {
        categoryStats[cat].attempted += tp.attempted || 0;
        categoryStats[cat].correct += tp.correct || 0;
      }
    });
  });

  const totalAttempted = practiceAttempted + testAttempted;
  const totalCorrect = practiceCorrect + testCorrect;
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  const quantAcc = categoryStats.quantitative.attempted > 0
    ? Math.round((categoryStats.quantitative.correct / categoryStats.quantitative.attempted) * 100)
    : 0;

  const logicalAcc = categoryStats.logical.attempted > 0
    ? Math.round((categoryStats.logical.correct / categoryStats.logical.attempted) * 100)
    : 0;

  const verbalAcc = categoryStats.verbal.attempted > 0
    ? Math.round((categoryStats.verbal.correct / categoryStats.verbal.attempted) * 100)
    : 0;

  return {
    totalAttempted,
    totalCorrect,
    overallAccuracy,
    testsCompleted,
    categoryAccuracy: {
      quantitative: quantAcc,
      logical: logicalAcc,
      verbal: verbalAcc,
    },
    recentAttempts: history.slice(0, 5),
    hasHistory: totalAttempted > 0 || testsCompleted > 0,
  };
};
