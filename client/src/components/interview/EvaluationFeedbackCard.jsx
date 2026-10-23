import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  LogOut,
  Target,
  Info,
  Scale,
} from "lucide-react";

function EvaluationFeedbackCard({
  evaluation,
  questionNumber,
  totalQuestions,
  onContinue,
  onRetry,
  onEndSession,
  isLastQuestion,
}) {
  if (!evaluation) return null;

  const {
    overallScore = 0,
    rubricScores = {},
    scoreReasons = {},
    strengths = [],
    improvements = [],
    accuracyNotes = [],
    sampleAnswer = null,
    sampleImprovement = null,
    followUpQuestion = null,
    uncertaintyNote = null,
  } = evaluation;

  const actualSample = sampleAnswer || sampleImprovement;

  const accuracy = rubricScores.accuracy ?? 0;
  const relevance = rubricScores.relevance ?? 0;
  const completeness = rubricScores.completeness ?? rubricScores.depth ?? 0;
  const clarity = rubricScores.clarity ?? 0;
  const roleCompetence = rubricScores.roleCompetence ?? 0;

  // Score color badge
  const getScoreBadge = (s) => {
    if (s >= 85) return { bg: "bg-green-50 text-green-700 border-green-200", label: "Strong Answer" };
    if (s >= 70) return { bg: "bg-blue-50 text-blue-700 border-blue-200", label: "Competent Answer" };
    if (s >= 50) return { bg: "bg-amber-50 text-amber-700 border-amber-200", label: "Needs Elaboration" };
    return { bg: "bg-red-50 text-red-700 border-red-200", label: "Significant Gaps" };
  };

  const badge = getScoreBadge(overallScore);

  const rubricItems = [
    {
      key: "accuracy",
      label: "Accuracy",
      score: accuracy,
      desc: "Factual correctness and technical validity without misinformation",
      reason: scoreReasons?.accuracy,
    },
    {
      key: "relevance",
      label: "Relevance",
      score: relevance,
      desc: "Direct alignment to the prompt and target job role scope",
      reason: scoreReasons?.relevance,
    },
    {
      key: "completeness",
      label: "Completeness",
      score: completeness,
      desc: "Coverage of core concepts, reasoning, and practical trade-offs",
      reason: scoreReasons?.completeness,
    },
    {
      key: "clarity",
      label: "Clarity",
      score: clarity,
      desc: "Structured, concise, and professional spoken articulation",
      reason: scoreReasons?.clarity,
    },
    {
      key: "roleCompetence",
      label: "Role Competence",
      score: roleCompetence,
      desc: "Demonstration of practical domain knowledge expected at this level",
      reason: scoreReasons?.roleCompetence,
    },
  ];

  return (
    <section
      aria-label={`Evaluation feedback for question ${questionNumber}`}
      className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-gray-100 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Question {questionNumber} of {totalQuestions} • Evaluation
            </span>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${badge.bg}`}>
              {badge.label}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            Fair & Constructive Answer Evaluation
          </h3>
          <p className="text-xs text-gray-500">
            Assessed strictly against accuracy, relevance, completeness, clarity, and role expectations.
          </p>
        </div>

        {/* Overall Score Dial */}
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-200 w-fit">
          <div className="w-12 h-12 rounded-full border-3 border-black flex items-center justify-center bg-white shadow-2xs">
            <span className="text-base font-extrabold text-gray-900">
              {overallScore}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
              Score
            </span>
            <span className="text-xs font-bold text-gray-900">Out of 100</span>
          </div>
        </div>
      </div>

      {/* Uncertainty & Context Note Banner (when applicable) */}
      {uncertaintyNote && (
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
            <Info size={15} className="text-amber-700 shrink-0" />
            <span>Conditional Context & Scope Note</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed pl-5 font-sans">
            {uncertaintyNote}
          </p>
        </div>
      )}

      {/* 5-Dimensional Rubric Breakdown with Evidence-Based Reasons */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            <Scale size={14} className="text-gray-700" />
            <span>Rubric Performance & Evidence</span>
          </h4>
          <span className="text-[11px] text-gray-400">
            0 - 100 scale per dimension
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {rubricItems.map((item) => (
            <div key={item.key} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-900 mb-1">
                  <span>{item.label}</span>
                  <span>{item.score}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1.5">
                  <div
                    className="h-full bg-black rounded-full transition-all duration-300"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-500 leading-tight">
                  {item.desc}
                </p>
              </div>

              {/* Score Justification */}
              {item.reason && (
                <div className="mt-2.5 pt-2 border-t border-gray-200/80">
                  <p className="text-[10px] text-gray-600 leading-snug italic">
                    "{item.reason}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Improvements Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* What You Did Well */}
        <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
            <CheckCircle2 size={16} className="text-green-600" />
            <span>What You Did Well</span>
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

        {/* What Is Missing, Vague, or Incorrect */}
        <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
            <AlertCircle size={16} className="text-amber-600" />
            <span>Missing, Vague, or Needs Work</span>
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

      {/* Accuracy & Technical Notes (if any) */}
      {accuracyNotes && accuracyNotes.length > 0 && (
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
            <Target size={15} className="text-gray-700" />
            <span>Accuracy & Distinction Notes</span>
          </div>
          <ul className="space-y-1.5 text-xs text-gray-600">
            {accuracyNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-gray-400 font-bold">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Example Stronger Answer (Sample Speaking Response) */}
      {actualSample && (
        <div className="p-4 sm:p-5 rounded-xl border border-gray-200 bg-gray-50/70 space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
              <BookOpen size={15} className="text-black" />
              <span>Example of a Stronger Answer</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-600 font-medium">
              Illustrative Sample • Context-Dependent
            </span>
          </div>
          <div className="bg-white p-3.5 rounded-lg border border-gray-200 text-xs text-gray-800 leading-relaxed font-sans whitespace-pre-line">
            {actualSample}
          </div>
          <p className="text-[10px] text-gray-400 italic">
            Note: This is an example suitable for spoken delivery in an interview, not the candidate's own words. Specific wording and procedures vary by employer policy and environment.
          </p>
        </div>
      )}

      {/* Follow-up Question (when suggested) */}
      {followUpQuestion && (
        <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
            <HelpCircle size={15} className="text-blue-600" />
            <span>Recommended Follow-Up Question</span>
          </div>
          <p className="text-xs text-gray-800 italic leading-relaxed">
            "{followUpQuestion}"
          </p>
        </div>
      )}

      {/* Navigation & Action Bar (Step 5: continue, retry, end) */}
      <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black"
            title="Refine and re-evaluate answer"
          >
            <RotateCcw size={13} />
            <span>Retry & Revise Answer</span>
          </button>

          <button
            type="button"
            onClick={onEndSession}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-red-600 transition flex items-center gap-1 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <LogOut size={13} />
            <span>End Session Now</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="px-6 py-2.5 rounded-xl bg-black text-white hover:bg-gray-900 text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black"
        >
          <span>{isLastQuestion ? "Finish & View Full Summary" : "Continue to Next Question"}</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
}

export default EvaluationFeedbackCard;
