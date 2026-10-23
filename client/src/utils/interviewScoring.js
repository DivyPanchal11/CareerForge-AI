/**
 * Deterministic Demo Evaluation & Scoring Utility
 *
 * NOTE: This is a frontend demo scoring algorithm designed for the prototype.
 * It provides consistent, reproducible evaluation based on answer completeness,
 * depth, and keyword coverage. It does not replace real AI assessment.
 */

export const evaluateInterviewSession = ({ questions, answers, timeSpentSeconds, config }) => {
  const totalQuestions = questions.length;
  let answeredCount = 0;
  let totalScoreSum = 0;
  let writtenDepthSum = 0;
  let writtenKeywordSum = 0;

  const questionReviews = questions.map((q) => {
    const rawAnswer = (answers[q.id] || "").trim();
    const isAnswered = rawAnswer.length > 0;

    if (isAnswered) {
      answeredCount += 1;
    }

    // Written Answer Question Evaluation
    const words = isAnswered ? rawAnswer.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;

    // 1. Depth & Elaboration score (0 - 100)
    let depthScore = 0;
    if (wordCount >= 60) {
      depthScore = 95;
    } else if (wordCount >= 35) {
      depthScore = 80;
    } else if (wordCount >= 20) {
      depthScore = 65;
    } else if (wordCount >= 10) {
      depthScore = 45;
    } else if (wordCount > 0) {
      depthScore = 30;
    }

    // 2. Keyword relevance score (0 - 100)
    let keywordScore;
    const keywords = q.keywords || [];
    const lowerAnswer = rawAnswer.toLowerCase();
    const matchedKeywords = keywords.filter((kw) => lowerAnswer.includes(kw.toLowerCase()));

    if (keywords.length > 0) {
      const matchRatio = matchedKeywords.length / keywords.length;
      keywordScore = Math.min(100, Math.round(matchRatio * 100 + (wordCount > 25 ? 20 : 0)));
    } else {
      keywordScore = depthScore;
    }

    // 3. Question score: 50% depth, 50% keywords
    const questionScore = isAnswered ? Math.min(100, Math.round(depthScore * 0.5 + keywordScore * 0.5)) : 0;

    totalScoreSum += questionScore;
    writtenDepthSum += depthScore;
    writtenKeywordSum += keywordScore;

    // Feedback summary per question
    let feedbackNote;
    if (!isAnswered) {
      feedbackNote = "Question was skipped. Providing even a partial framework or thought process is recommended.";
    } else if (questionScore >= 80) {
      feedbackNote = "Well-articulated response covering core principles and relevant terminology.";
    } else if (questionScore >= 55) {
      feedbackNote = "Good foundation. Consider expanding on real-world examples, edge cases, and specific metrics.";
    } else {
      feedbackNote = "Brief answer. Aim to provide structured points using the STAR method or concrete technical definitions.";
    }

    return {
      questionId: q.id,
      question: q.question,
      topic: q.topic,
      type: q.type,
      difficulty: q.difficulty,
      questionFormat: "written",
      userAnswer: rawAnswer || "No answer provided.",
      isAnswered,
      isCorrect: null,
      wordCount,
      score: questionScore,
      matchedKeywords,
      suggestedPoints: q.suggestedPoints || [],
      feedbackNote,
    };
  });

  const completionPercentage = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const overallScore = totalQuestions > 0 ? Math.round(totalScoreSum / totalQuestions) : 0;

  const avgDepth = answeredCount > 0 ? Math.round(writtenDepthSum / answeredCount) : 0;
  const avgRelevance = answeredCount > 0 ? Math.round(writtenKeywordSum / answeredCount) : 0;

  // Determine strengths
  const strengths = [];
  if (completionPercentage >= 80) {
    strengths.push(`Strong completion consistency (${answeredCount} of ${totalQuestions} questions attempted).`);
  }
  if (answeredCount > 0 && avgDepth >= 70) {
    strengths.push("Good depth of elaboration across written answers with clear explanations.");
  }
  if (answeredCount > 0 && avgRelevance >= 65) {
    strengths.push("Effective use of domain terminology and relevant technical keywords.");
  }
  if (strengths.length === 0) {
    strengths.push("Committed effort to engaging in mock interview preparation.");
    strengths.push("Familiarity established with the mock interview structure and pacing.");
  }

  // Determine areas for improvement
  const improvements = [];
  const unansweredCount = totalQuestions - answeredCount;
  if (unansweredCount > 0) {
    improvements.push(`${unansweredCount} question(s) left unanswered. In real interviews, walk through your thought process even if unsure.`);
  }
  if (answeredCount > 0 && avgDepth < 65) {
    improvements.push("Expand on written answers by detailing specific methodologies, trade-offs, and examples.");
  }
  if (answeredCount > 0 && avgRelevance < 60) {
    improvements.push("Incorporate more industry-standard terminology and direct concepts referenced in question prompts.");
  }
  if (improvements.length === 0) {
    improvements.push("Practice time pacing to explain complex topics concisely under interview conditions.");
  }

  // Determine suggested topics for practice
  const topicsToPractice = [
    ...new Set(
      questionReviews
        .filter((r) => r.score < 70)
        .map((r) => r.topic)
        .filter(Boolean)
    ),
  ];
  if (topicsToPractice.length === 0) {
    topicsToPractice.push(questions[0]?.topic || "System Architecture");
  }

  return {
    id: `eval_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    completedAt: new Date().toISOString(),
    config: {
      interviewType: config.interviewType,
      targetRole: config.targetRole,
      difficulty: config.difficulty,
      experienceLevel: config.experienceLevel,
      questionCount: totalQuestions,
      customRole: config.customRole || "",
      durationMinutes: config.durationMinutes,
    },
    overallScore,
    completionPercentage,
    answeredCount,
    totalQuestions,
    timeSpentSeconds: timeSpentSeconds || 0,
    breakdown: {
      contentDepth: avgDepth,
      relevance: avgRelevance,
      completionRate: completionPercentage,
    },
    strengths,
    improvements,
    topicsToPractice: topicsToPractice.slice(0, 4),
    questionReviews,
    isPrototypeEvaluation: true,
  };
};

