import { motion } from "framer-motion";
import { Compass, ArrowRight, BookOpen, Play } from "lucide-react";
import { Link } from "react-router-dom";

function AptitudeRecommendations({ recommendations = [] }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-800">
            <Compass size={17} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Recommended Focus Areas
            </h3>
            <p className="text-xs text-gray-500">
              Deterministic suggestions derived from your recent accuracy and syllabus coverage.
            </p>
          </div>
        </div>

        <Link
          to="/aptitude/topics"
          className="text-xs font-semibold text-gray-700 hover:text-black flex items-center gap-1 transition"
        >
          View All Topics
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {recommendations.map((rec) => (
          <div
            key={rec.topicId}
            className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                  {rec.category}
                </span>
              </div>
              <h4 className="text-sm font-bold text-gray-900 mt-1">
                {rec.topicName}
              </h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {rec.reason}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-200/60">
              <Link
                to={`/aptitude/learn/${rec.topicId}`}
                className="flex-1 py-1.5 px-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 text-xs font-semibold flex items-center justify-center gap-1 transition"
              >
                <BookOpen size={12} />
                Learn
              </Link>
              <Link
                to={`/aptitude/practice/${rec.topicId}`}
                className="flex-1 py-1.5 px-2 rounded-lg bg-black text-white hover:bg-gray-900 text-xs font-semibold flex items-center justify-center gap-1 transition"
              >
                <Play size={12} />
                Practice
              </Link>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default AptitudeRecommendations;
