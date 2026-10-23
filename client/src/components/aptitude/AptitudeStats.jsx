import { motion } from "framer-motion";
import { HelpCircle, Award, CheckCircle2 } from "lucide-react";

function AptitudeStats({ stats }) {
  const {
    totalAttempted = 0,
    overallAccuracy = 0,
    testsCompleted = 0,
  } = stats || {};

  const cards = [
    {
      label: "Questions Attempted",
      value: totalAttempted,
      unit: totalAttempted === 1 ? "question" : "questions",
      icon: HelpCircle,
      subtext: totalAttempted > 0 ? "Practiced & tested questions" : "No questions attempted yet",
    },
    {
      label: "Overall Accuracy",
      value: `${overallAccuracy}%`,
      unit: "accuracy rate",
      icon: Award,
      subtext: totalAttempted > 0 ? "Calculated from valid attempts" : "Solve questions to calculate",
    },
    {
      label: "Tests Completed",
      value: testsCompleted,
      unit: testsCompleted === 1 ? "test" : "tests",
      icon: CheckCircle2,
      subtext: testsCompleted > 0 ? "Timed mock assessments" : "No timed tests completed yet",
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

export default AptitudeStats;
