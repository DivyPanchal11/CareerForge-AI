/**
 * Interview Module Constants
 * AI configurations, storage keys, and presets.
 */

export const STORAGE_KEYS = {
  CURRENT_SESSION: "careerforge_interview_active_session",
  HISTORY: "careerforge_interview_history",
  LATEST_RESULT: "careerforge_interview_latest_result",
};

export const INTERVIEW_TYPES = [
  {
    id: "technical",
    label: "Technical",
    description: "System architecture, code reasoning, data structures, and tech trade-offs.",
    badge: "Code & Architecture",
  },
  {
    id: "behavioral",
    label: "Behavioral",
    description: "Real workplace scenarios, teamwork, conflict handling, and leadership outcomes.",
    badge: "Situational Scenarios",
  },
  {
    id: "role_specific",
    label: "Role-Specific",
    description: "Domain methodologies, tools, workflows, and role-specific competencies.",
    badge: "Domain Expertise",
  },
  {
    id: "mixed",
    label: "Mixed Mock",
    description: "A well-rounded, balanced blend of technical, situational, and behavioral questions.",
    badge: "Comprehensive",
  },
];

export const TARGET_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "DevOps & Cloud Engineer",
  "Product Manager",
  "Mobile Developer (React Native / iOS / Android)",
  "Machine Learning Engineer",
  "Custom Role",
];

export const DIFFICULTY_LEVELS = [
  { id: "beginner", label: "Beginner", subtext: "Foundations & Core Principles" },
  { id: "intermediate", label: "Intermediate", subtext: "Practical Scenarios & System Design" },
  { id: "advanced", label: "Advanced", subtext: "Deep Architectural Trade-offs & Edge Cases" },
];

export const EXPERIENCE_LEVELS = [
  { id: "entry", label: "Entry-level", subtext: "0-2 years / Fresh Graduate" },
  { id: "mid", label: "Mid-level", subtext: "3-5 years experience" },
  { id: "senior", label: "Senior", subtext: "5+ years / Tech Lead" },
  { id: "custom", label: "Custom", subtext: "Specify custom background" },
];

export const QUESTION_COUNT_OPTIONS = [3, 5, 8, 10];

export const INTERVIEW_QUESTION_DURATION_SECONDS = 300; // 5 minutes per question
export const DEFAULT_INTERVIEW_ROLE = "Interview Practice";

/**
 * Calculates suggested duration (in minutes) based on question count and difficulty.
 * Consistently allocates 5 minutes per question for all interview sessions.
 */
export const calculateDurationMinutes = (
  questionCount,
  difficulty = "intermediate"
) => {
  const count = Number(questionCount) || 5;
  return Math.max(5, count * 5);
};
