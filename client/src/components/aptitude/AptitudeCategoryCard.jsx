import { motion } from "framer-motion";
import { Calculator, Lightbulb, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const iconMap = {
  Calculator,
  Lightbulb,
  BookOpen,
};

function AptitudeCategoryCard({ category, topicCount, questionCount, accuracy = 0, delay = 0 }) {
  const Icon = iconMap[category.iconName] || Calculator;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-gray-300 transition"
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900">
            <Icon size={20} />
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-100">
            {topicCount} Topics
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mt-4">
          {category.name}
        </h3>

        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
          {category.description}
        </p>

        {/* Accuracy and Questions */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-[11px] text-gray-400">Questions Available</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">{questionCount}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400">Accuracy Rate</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">
              {accuracy > 0 ? `${accuracy}%` : "0%"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 flex items-center justify-between gap-2">
        <Link
          to={`/aptitude/topics?category=${category.id}`}
          className="text-xs font-semibold text-gray-900 hover:text-black flex items-center gap-1 transition"
        >
          Explore All Topics
          <ArrowRight size={14} />
        </Link>

        <Link
          to={`/aptitude/test?category=${category.id}`}
          className="px-3 py-1.5 rounded-lg bg-black text-white hover:bg-gray-900 text-xs font-semibold transition"
        >
          Test Category
        </Link>
      </div>
    </motion.div>
  );
}

export default AptitudeCategoryCard;
