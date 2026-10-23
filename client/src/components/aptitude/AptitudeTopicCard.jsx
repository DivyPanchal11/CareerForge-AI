import { motion } from "framer-motion";
import { BookOpen, Play, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

function AptitudeTopicCard({ topic, questionCount = 0, progress = null, delay = 0 }) {
  const { id, name, difficulty = "Medium", description } = topic;
  const attempted = progress?.attempted || 0;
  const correct = progress?.correct || 0;
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : null;

  const difficultyBadgeColor = {
    Easy: "text-emerald-700 bg-emerald-50 border-emerald-200",
    Medium: "text-amber-700 bg-amber-50 border-amber-200",
    Hard: "text-rose-700 bg-rose-50 border-rose-200",
  }[difficulty] || "text-gray-700 bg-gray-50 border-gray-200";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-gray-300 transition"
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${difficultyBadgeColor}`}>
            {difficulty}
          </span>

          <span className="text-[11px] font-medium text-gray-500">
            {questionCount} {questionCount === 1 ? "question" : "questions"}
          </span>
        </div>

        <h3 className="text-base font-bold text-gray-900 mt-3">
          {name}
        </h3>

        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Progress details if practiced */}
        {attempted > 0 ? (
          <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500 flex items-center gap-1">
              <CheckCircle2 size={13} className="text-emerald-600" />
              {attempted} attempted
            </span>
            <span className="font-semibold text-gray-900">
              {accuracy}% accuracy
            </span>
          </div>
        ) : (
          <div className="mt-3.5 pt-3 border-t border-gray-100 text-[11px] text-gray-400">
            Not practiced yet
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4 pt-2">
        <Link
          to={`/aptitude/learn/${id}`}
          className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
        >
          <BookOpen size={13} />
          Learn
        </Link>

        <Link
          to={`/aptitude/practice/${id}`}
          className="px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs"
        >
          <Play size={13} />
          Practice
        </Link>
      </div>
    </motion.div>
  );
}

export default AptitudeTopicCard;
