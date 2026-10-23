import { motion } from "framer-motion";
import { Brain, History, BookOpen, Clock } from "lucide-react";
import { Link } from "react-router-dom";

function AptitudeHeader({
  title = "Aptitude Preparation",
  description = "Master quantitative, logical, and verbal concepts with topic-wise learning, MCQ practice, and timed recruitment tests.",
  showActions = true,
  onStartTest = null,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5"
    >
      <div className="flex items-start sm:items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white shrink-0 shadow-xs">
          <Brain size={22} />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700">
              Campus Prep
            </span>
          </div>

          <p className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {showActions && (
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
          <Link
            to="/aptitude/topics"
            className="px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
          >
            <BookOpen size={14} />
            Browse Topics
          </Link>

          <Link
            to="/aptitude/history"
            className="px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
          >
            <History size={14} />
            History
          </Link>

          {onStartTest ? (
            <button
              type="button"
              onClick={onStartTest}
              className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-900 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-xs"
            >
              <Clock size={14} />
              Take Test
            </button>
          ) : (
            <Link
              to="/aptitude/test"
              className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-900 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-xs"
            >
              <Clock size={14} />
              Take Test
            </Link>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default AptitudeHeader;
