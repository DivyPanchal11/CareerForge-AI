import { ArrowLeft, ArrowRight, Send, Loader2, Check, CheckCircle2 } from "lucide-react";

function QuestionNavigation({
  currentIndex,
  totalQuestions,
  questions = [],
  answers = {},
  onSelectQuestion,
  onPrevious,
  onNext,
  onFinish,
  isSubmitting = false,
}) {
  const answeredCount = questions.filter((q) => {
    const ans = answers[q.id];
    return ans && ans.trim().length > 0;
  }).length;

  const unansweredCount = Math.max(0, totalQuestions - answeredCount);
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <nav
      aria-label="Interview question navigation and session progress"
      className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4"
    >
      {/* Overall Progress Bar */}
      <div>
        <div className="flex flex-wrap items-center justify-between text-xs mb-1.5 gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-gray-900">
              Session Progress:
            </span>
            <span className="text-gray-600 font-medium">
              {answeredCount} of {totalQuestions} answered
            </span>
            {unansweredCount > 0 ? (
              <span className="text-[11px] text-gray-500 font-medium">
                • {unansweredCount} remaining
              </span>
            ) : (
              <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                All questions answered
              </span>
            )}
          </div>
          <span className="font-extrabold text-gray-900">{progressPercent}%</span>
        </div>

        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Interview completion progress"
          aria-valuetext={`${answeredCount} of ${totalQuestions} questions answered (${progressPercent}%)`}
          className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-black rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Number Pills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
            Jump to Question
          </span>
          <span className="text-[11px] text-gray-500">
            Current: Q{currentIndex + 1}
          </span>
        </div>

        <div
          role="group"
          aria-label="Question selector"
          className="flex flex-wrap gap-2"
        >
          {questions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const hasAnswer = Boolean(answers[q.id] && answers[q.id].trim().length > 0);

            return (
              <button
                key={q.id || idx}
                type="button"
                onClick={() => onSelectQuestion(idx)}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Question ${idx + 1}: ${hasAnswer ? "Answered" : "Unanswered"}${isCurrent ? ", currently active" : ""}`}
                title={`Question ${idx + 1}: ${hasAnswer ? "Answered" : "Unanswered"}`}
                className={`w-9 h-9 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer relative focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1 ${
                  isCurrent
                    ? "bg-black text-white ring-2 ring-gray-900 shadow-xs"
                    : hasAnswer
                    ? "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300"
                    : "bg-white text-gray-400 hover:text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span>{idx + 1}</span>
                {/* Visual checkmark so user does NOT rely on color alone */}
                {hasAnswer && !isCurrent && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-black text-white rounded-full flex items-center justify-center ring-2 ring-white"
                  >
                    <Check size={8} strokeWidth={3.5} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center gap-4 text-[11px] text-gray-500 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-black inline-block" />
            <span>Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-300 inline-flex items-center justify-center text-[9px] font-bold text-black">
              ✓
            </span>
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-white border border-gray-200 inline-block" />
            <span>Unanswered</span>
          </div>
        </div>
      </div>

      {/* Navigation & Submit Action Bar */}
      <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentIndex === 0 || isSubmitting}
            onClick={onPrevious}
            className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black"
          >
            <ArrowLeft size={13} />
            <span>Previous Question</span>
          </button>

          {!isLastQuestion && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onNext}
              className="px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-900 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 disabled:opacity-40 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black"
            >
              <span>Next Question</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onFinish}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-black text-white hover:bg-gray-900 text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Submitting Session...
              </>
            ) : (
              <>
                <Send size={13} />
                <span>
                  {isLastQuestion
                    ? "Finish & View Results"
                    : unansweredCount > 0
                    ? `Finish Early (${unansweredCount} unanswered)`
                    : "Finish & View Results"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default QuestionNavigation;
