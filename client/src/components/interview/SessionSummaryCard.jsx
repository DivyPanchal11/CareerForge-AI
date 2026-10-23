import {
  Trophy,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  RotateCcw,
  LayoutDashboard,
  Sparkles,
  ArrowRight,
} from "lucide-react";

function SessionSummaryCard({
  summary,
  config = {},
  totalQuestions = 0,
  answeredCount = 0,
  timeSpentFormatted = "",
  onRestartSameRole,
  onNewConfig,
  onViewDashboard,
}) {
  if (!summary) return null;

  const {
    overallScore = 0,
    aggregateRubricScores = {},
    summary: summaryText = "",
    keyStrengths = [],
    improvementAreas = [],
    topicsToPractice = [],
  } = summary;

  const {
    accuracy = overallScore,
    relevance = overallScore,
    completeness = aggregateRubricScores.depth ?? overallScore,
    clarity = overallScore,
    roleCompetence = overallScore,
  } = aggregateRubricScores;

  const rubricMetrics = [
    { label: "Accuracy", score: accuracy },
    { label: "Relevance", score: relevance },
    { label: "Completeness", score: completeness },
    { label: "Clarity", score: clarity },
    { label: "Role Competence", score: roleCompetence },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-100 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Session Debrief • Final Performance
            </span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-gray-100 text-gray-800 border border-gray-200 flex items-center gap-1">
              <Sparkles size={11} className="text-amber-500" />
              AI Evaluated
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Interview Performance Summary
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {config.targetRole} • {config.experienceLevel} level • {config.interviewType}
          </p>
        </div>

        {/* Overall Score Dial */}
        <div className="flex items-center gap-3.5 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-200 w-fit">
          <div className="w-14 h-14 rounded-full border-4 border-black flex items-center justify-center bg-white shadow-xs">
            <span className="text-xl font-extrabold text-gray-900">
              {overallScore}%
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
              Overall Score
            </span>
            <span className="text-xs font-semibold text-gray-700">
              {answeredCount} of {totalQuestions} answered
            </span>
          </div>
        </div>
      </div>

      {/* Aggregate Rubric Bars */}
      <div>
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
          Overall Competency Scores
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {rubricMetrics.map((m) => (
            <div key={m.label} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/60">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                {m.label}
              </span>
              <span className="text-lg font-extrabold text-gray-900 block mb-1.5">
                {m.score}%
              </span>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black rounded-full transition-all duration-300"
                  style={{ width: `${m.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Summary Text */}
      {summaryText && (
        <div className="p-4 sm:p-5 rounded-xl border border-gray-200 bg-white space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
            <Trophy size={16} className="text-black" />
            <span>AI Committee Assessment</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {summaryText}
          </p>
        </div>
      )}

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Strengths */}
        <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
            <CheckCircle2 size={16} className="text-green-600" />
            <span>Key Demonstrated Strengths</span>
          </div>
          <ul className="space-y-2 text-xs text-gray-700">
            {keyStrengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 mt-1.5" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvement Areas */}
        <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
            <AlertCircle size={16} className="text-amber-600" />
            <span>Primary Growth & Improvement Areas</span>
          </div>
          <ul className="space-y-2 text-xs text-gray-700">
            {improvementAreas.map((imp, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggested Topics to Practice Next */}
      {topicsToPractice && topicsToPractice.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-2.5">
            <BookOpen size={16} className="text-black" />
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Recommended Topics to Practice Next
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {topicsToPractice.map((topic, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-xl bg-gray-100 text-gray-800 text-xs font-semibold border border-gray-200"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {onRestartSameRole && (
            <button
              type="button"
              onClick={onRestartSameRole}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black"
            >
              <RotateCcw size={13} />
              <span>Practice Again ({config.targetRole})</span>
            </button>
          )}

          {onViewDashboard && (
            <button
              type="button"
              onClick={onViewDashboard}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black"
            >
              <LayoutDashboard size={13} />
              <span>Interview Hub</span>
            </button>
          )}
        </div>

        {onNewConfig && (
          <button
            type="button"
            onClick={onNewConfig}
            className="px-6 py-2.5 rounded-xl bg-black text-white hover:bg-gray-900 text-xs font-bold flex items-center gap-2 transition active:scale-95 cursor-pointer shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black"
          >
            <span>Configure New Session</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export default SessionSummaryCard;
