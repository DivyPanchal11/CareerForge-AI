import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Video,
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react";

function InterviewPreparation() {
  const readiness = 72;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center">
            <Video size={21} className="text-white" />
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Interview Preparation
            </p>

            <h2 className="text-lg font-semibold text-gray-900">
              Interview Readiness
            </h2>
          </div>
        </div>

        <span className="text-2xl font-bold text-gray-900">
          {readiness}%
        </span>
      </div>

      {/* Progress */}
      <div className="mt-5">
        <div className="flex justify-between mb-2">
          <span className="text-xs text-gray-500">
            Overall readiness
          </span>

          <span className="text-xs font-semibold text-gray-900">
            {readiness}%
          </span>
        </div>

        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${readiness}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-black rounded-full"
          />
        </div>
      </div>

      {/* Preparation Areas */}
      <div className="grid grid-cols-3 gap-2 mt-5">
        <div className="bg-gray-50 rounded-xl p-3">
          <CheckCircle2 size={16} className="text-gray-700 mb-2" />

          <p className="text-xs text-gray-500">
            Technical
          </p>

          <p className="text-sm font-bold text-gray-900 mt-1">
            78%
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-3">
          <CheckCircle2 size={16} className="text-gray-700 mb-2" />

          <p className="text-xs text-gray-500">
            HR
          </p>

          <p className="text-sm font-bold text-gray-900 mt-1">
            65%
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-3">
          <Clock size={16} className="text-gray-700 mb-2" />

          <p className="text-xs text-gray-500">
            Mock Tests
          </p>

          <p className="text-sm font-bold text-gray-900 mt-1">
            8
          </p>
        </div>
      </div>

      {/* Next Action */}
      <div className="mt-5 p-3 rounded-xl bg-gray-50 border border-gray-100">
        <p className="text-xs font-semibold text-gray-900">
          Recommended
        </p>

        <p className="text-xs text-gray-500 mt-1">
          Take an AI-powered mock interview to improve your readiness.
        </p>
      </div>

      {/* Button */}
      <Link
        to="/interviews"
        className="
          mt-5
          inline-flex
          items-center
          gap-2
          text-sm
          font-semibold
          text-gray-900
          hover:gap-3
          transition-all
        "
      >
        Start Mock Interview
        <ArrowRight size={16} />
      </Link>
    </motion.div>
  );
}

export default InterviewPreparation;