import { motion } from "framer-motion";
import { FileText, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ResumeScoreCard() {
  const navigate = useNavigate();
  const resumeScore = 78;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm cursor-pointer hover:border-black transition"
      onClick={() => navigate("/resumes")}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center">
            <FileText size={21} className="text-white" />
          </div>

          <div>
            <p className="text-xs text-gray-500">
              AI Resume Analysis
            </p>

            <h2 className="text-lg font-semibold text-gray-900">
              Resume Score
            </h2>
          </div>
        </div>

        <Sparkles size={18} className="text-gray-400" />
      </div>

      {/* Score */}
      <div className="flex items-center gap-6 mt-5">
        {/* Circular Score */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 100 100"
          >
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-100"
            />

            {/* Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="264"
              strokeDashoffset={264 - (264 * resumeScore) / 100}
              className="text-black"
            />
          </svg>

          <span className="text-xl font-bold text-gray-900">
            {resumeScore}
          </span>
        </div>

        {/* Score Description */}
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Good Resume
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Your resume is performing well.
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Target: 85+
          </p>
        </div>
      </div>

      {/* Analysis Stats */}
      <div className="grid grid-cols-3 gap-2 mt-5">
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-sm font-bold text-gray-900">
            82%
          </p>
          <p className="text-[10px] text-gray-500">
            ATS Match
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-sm font-bold text-gray-900">
            76%
          </p>
          <p className="text-[10px] text-gray-500">
            Skills Match
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-sm font-bold text-gray-900">
            80%
          </p>
          <p className="text-[10px] text-gray-500">
            Content
          </p>
        </div>
      </div>

      {/* Action */}
      <button
        type="button"
        className="mt-5 flex items-center gap-2 text-sm font-semibold text-gray-900 hover:gap-3 transition-all"
      >
        Analyze Resume
        <ArrowRight size={16} />
      </button>
    </motion.div>
  );
}

export default ResumeScoreCard;