import { CheckCircle2, AlertCircle, BookOpen, RotateCcw, LayoutDashboard, History, Sparkles } from "lucide-react";

function FeedbackCard({ result, onRetry, onDashboard, onHistory }) {
  if (!result) return null;

  const {
    strengths = result.keyStrengths || [],
    improvements = result.improvementAreas || [],
    topicsToPractice = [],
    summary = "",
  } = result;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
      {/* AI Evaluation Notice */}
      <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-3">
        <Sparkles size={17} className="text-black shrink-0 mt-0.5" />
        <div className="text-xs text-gray-700 leading-relaxed">
          <span className="font-bold text-gray-900 block mb-0.5">
            AI-Powered Evaluation Overview
          </span>
          {summary || "This evaluation synthesized candidate claims, factual correctness, reasoning depth, answer structure, and role-specific competencies."}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Key Strengths */}
        <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
            <CheckCircle2 size={16} className="text-green-600" />
            <span>Demonstrated Strengths</span>
          </div>

          <ul className="space-y-2 text-xs text-gray-700">
            {strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 mt-1.5" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
            <AlertCircle size={16} className="text-amber-600" />
            <span>Opportunities for Growth</span>
          </div>

          <ul className="space-y-2 text-xs text-gray-700">
            {improvements.map((imp, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggested Topics for Practice */}
      {topicsToPractice && topicsToPractice.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-2.5">
            <BookOpen size={15} className="text-black" />
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Recommended Topics for Next Practice
            </h4>
          </div>

          <div className="flex flex-wrap gap-2">
            {topicsToPractice.map((topic, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg bg-gray-100 text-gray-800 text-xs font-semibold border border-gray-200"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Navigation */}
      <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onDashboard}
            className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <LayoutDashboard size={14} />
            Interview Hub
          </button>

          <button
            type="button"
            onClick={onHistory}
            className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <History size={14} />
            View History
          </button>
        </div>

        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-900 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer"
        >
          <RotateCcw size={14} />
          Practice Again
        </button>
      </div>
    </div>
  );
}

export default FeedbackCard;
