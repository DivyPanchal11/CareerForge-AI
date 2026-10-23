/**
 * Aptitude Scoring & Analytical Helper Functions
 * Pure calculations with no fabricated evaluations
 */

/**
 * Calculate test or practice metrics
 * Scoring: +1 mark for correct, 0 for unattempted, 0 for incorrect (standard campus aptitude without negative marking unless specified)
 */
export const calculateAptitudeScore = ({ questions = [], answers = {}, timeSpentSeconds = 0 }) => {
  const totalQuestions = questions.length;
  let attempted = 0;
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;

  const topicMap = {};
  const difficultyMap = {};

  const evaluatedQuestions = questions.map((q) => {
    const selectedOptionId = answers[q.id] || null;
    const isAnswered = selectedOptionId !== null && selectedOptionId !== undefined;
    const isCorrect = isAnswered && selectedOptionId === q.correctOptionId;

    if (isAnswered) {
      attempted += 1;
      if (isCorrect) {
        correct += 1;
      } else {
        incorrect += 1;
      }
    } else {
      unanswered += 1;
    }

    // Topic performance tracking
    const topicKey = q.topic || "general";
    if (!topicMap[topicKey]) {
      topicMap[topicKey] = {
        topic: topicKey,
        topicName: q.topicName || topicKey,
        category: q.category,
        total: 0,
        attempted: 0,
        correct: 0,
      };
    }
    topicMap[topicKey].total += 1;
    if (isAnswered) {
      topicMap[topicKey].attempted += 1;
      if (isCorrect) topicMap[topicKey].correct += 1;
    }

    // Difficulty performance tracking
    const diffKey = q.difficulty || "medium";
    if (!difficultyMap[diffKey]) {
      difficultyMap[diffKey] = {
        difficulty: diffKey,
        total: 0,
        attempted: 0,
        correct: 0,
      };
    }
    difficultyMap[diffKey].total += 1;
    if (isAnswered) {
      difficultyMap[diffKey].attempted += 1;
      if (isCorrect) difficultyMap[diffKey].correct += 1;
    }

    return {
      ...q,
      selectedOptionId,
      isAnswered,
      isCorrect,
    };
  });

  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  const score = correct;
  const scorePercentage = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;

  // Format topic performance breakdown
  const topicPerformance = Object.values(topicMap).map((t) => ({
    ...t,
    accuracy: t.attempted > 0 ? Math.round((t.correct / t.attempted) * 100) : 0,
  }));

  // Format difficulty performance breakdown
  const difficultyPerformance = Object.values(difficultyMap).map((d) => ({
    ...d,
    accuracy: d.attempted > 0 ? Math.round((d.correct / d.attempted) * 100) : 0,
  }));

  return {
    totalQuestions,
    attempted,
    correct,
    incorrect,
    unanswered,
    score,
    scorePercentage,
    accuracy,
    timeSpentSeconds,
    topicPerformance,
    difficultyPerformance,
    evaluatedQuestions,
  };
};

/**
 * Format seconds into mm:ss or hh:mm:ss
 */
export const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const pad = (n) => String(n).padStart(2, "0");

  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${pad(hrs)}:${pad(remMins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
};

/**
 * Compute performance-based recommendations without fabricated claims.
 * Identifies topics with accuracy < 60% or high error rate.
 */
export const generateAptitudeRecommendations = (allAttempts = [], allTopics = []) => {
  if (!allAttempts || allAttempts.length === 0) {
    return [
      {
        topicId: "percentages",
        topicName: "Percentages",
        category: "quantitative",
        reason: "Foundation topic: Recommended starting point for numerical ability.",
      },
      {
        topicId: "number-series",
        topicName: "Number Series",
        category: "logical",
        reason: "Frequently tested pattern recognition topic across campus tests.",
      },
      {
        topicId: "error-spotting",
        topicName: "Error Spotting",
        category: "verbal",
        reason: "Core verbal grammar concept tested in company placement drives.",
      },
    ];
  }

  // Aggregate stats per topic from past attempts
  const topicStats = {};
  allAttempts.forEach((attempt) => {
    (attempt.topicPerformance || []).forEach((tp) => {
      if (!topicStats[tp.topic]) {
        topicStats[tp.topic] = {
          topicId: tp.topic,
          topicName: tp.topicName || tp.topic,
          category: tp.category,
          totalAttempted: 0,
          totalCorrect: 0,
        };
      }
      topicStats[tp.topic].totalAttempted += tp.attempted;
      topicStats[tp.topic].totalCorrect += tp.correct;
    });
  });

  const weakTopics = Object.values(topicStats)
    .filter((t) => t.totalAttempted >= 2)
    .map((t) => ({
      ...t,
      accuracy: Math.round((t.totalCorrect / t.totalAttempted) * 100),
    }))
    .filter((t) => t.accuracy < 65)
    .sort((a, b) => a.accuracy - b.accuracy);

  if (weakTopics.length > 0) {
    return weakTopics.slice(0, 3).map((w) => ({
      topicId: w.topicId,
      topicName: w.topicName,
      category: w.category,
      reason: `Current accuracy is ${w.accuracy}%. Review concepts and take practice questions to strengthen.`,
    }));
  }

  // If doing well in attempted topics, recommend unattempted high-yield topics
  const attemptedTopicIds = new Set(Object.keys(topicStats));
  const unattempted = allTopics.filter((t) => !attemptedTopicIds.has(t.id));

  if (unattempted.length > 0) {
    return unattempted.slice(0, 3).map((u) => ({
      topicId: u.id,
      topicName: u.name,
      category: u.category,
      reason: `Unattempted topic: Expand your syllabus coverage by practicing questions here.`,
    }));
  }

  return [
    {
      topicId: "time-and-work",
      topicName: "Time and Work",
      category: "quantitative",
      reason: "High weightage in competitive assessments.",
    },
    {
      topicId: "syllogisms",
      topicName: "Syllogisms",
      category: "logical",
      reason: "Enhance deductive reasoning speed with practice.",
    },
  ];
};
