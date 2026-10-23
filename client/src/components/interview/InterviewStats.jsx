import { motion } from "framer-motion";
import { CheckCircle2, Award, HelpCircle } from "lucide-react";

function InterviewStats({ stats }) {
  const {
    interviewsCompleted = 0,
    averageScore = 0,
    questionsAnswered = 0,
  } = stats || {};

  const cards = [
    {
      label: "Interviews Completed",
      value: interviewsCompleted,
      unit: interviewsCompleted === 1 ? "session" : "sessions",
      icon: CheckCircle2,
      subtext: interviewsCompleted > 0 ? "Recorded in browser" : "No sessions completed yet",
    },
    {
      label: "Average Score",
      value: `${averageScore}%`,
      unit: "demo score",
      icon: Award,
      subtext: interviewsCompleted > 0 ? "Based on completed sessions" : "Complete an interview to see score",
    },
    {
      label: "Questions Answered",
      value: questionsAnswered,
      unit: "total questions",
      icon: HelpCircle,
      subtext: interviewsCompleted > 0 ? "Across all mock tests" : "0 answers submitted",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                {card.label}
              </span>
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
                <Icon size={16} />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 tracking-tight">
                {card.value}
              </span>
              <span className="text-[11px] font-medium text-gray-400">
                {card.unit}
              </span>
            </div>

            <p className="mt-1 text-[11px] text-gray-500">
              {card.subtext}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

export default InterviewStats;
