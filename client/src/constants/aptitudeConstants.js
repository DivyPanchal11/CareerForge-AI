/**
 * Aptitude Module Constants & Configuration
 * Preserves the exact styling and design system of CareerForge-AI
 */

export const APTITUDE_CATEGORIES = [
  {
    id: "quantitative",
    name: "Quantitative Aptitude",
    shortName: "Quantitative",
    description: "Numerical computation, arithmetic reasoning, commercial mathematics, and data interpretation.",
    iconName: "Calculator",
    color: "blue",
  },
  {
    id: "logical",
    name: "Logical Reasoning",
    shortName: "Logical",
    description: "Deductive logic, pattern recognition, spatial reasoning, puzzles, and critical thinking.",
    iconName: "Lightbulb",
    color: "amber",
  },
  {
    id: "verbal",
    name: "Verbal Ability",
    shortName: "Verbal",
    description: "English grammar, vocabulary, sentence correction, reading comprehension, and verbal logic.",
    iconName: "BookOpen",
    color: "emerald",
  },
];

export const DIFFICULTY_LEVELS = [
  { id: "all", label: "All Difficulties" },
  { id: "easy", label: "Easy", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { id: "medium", label: "Medium", color: "text-amber-700 bg-amber-50 border-amber-200" },
  { id: "hard", label: "Hard", color: "text-rose-700 bg-rose-50 border-rose-200" },
];

export const STORAGE_KEYS = {
  CURRENT_TEST_SESSION: "careerforge_aptitude_current_test",
  TEST_HISTORY: "careerforge_aptitude_history",
  PRACTICE_PROGRESS: "careerforge_aptitude_practice_progress",
  LATEST_RESULT: "careerforge_aptitude_latest_result",
  USER_STATS: "careerforge_aptitude_user_stats",
};

export const QUESTION_STATUS = {
  NOT_VISITED: "not_visited",
  UNANSWERED: "unanswered",
  ANSWERED: "answered",
  MARKED_FOR_REVIEW: "marked_for_review",
  ANSWERED_AND_MARKED: "answered_and_marked",
};

export const TEST_PRESETS = [
  { id: "quick_10", label: "10 Questions", questions: 10, minutes: 12 },
  { id: "standard_20", label: "20 Questions", questions: 20, minutes: 25 },
  { id: "comprehensive_30", label: "30 Questions", questions: 30, minutes: 40 },
];
