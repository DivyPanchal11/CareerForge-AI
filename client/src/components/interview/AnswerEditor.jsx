import { useEffect } from "react";
import { MessageSquare, RotateCcw, Send, Loader2, SkipForward, Lightbulb } from "lucide-react";

function AnswerEditor({
  answer = "",
  onChange,
  onSubmit,
  onSkip,
  disabled = false,
  isSubmitting = false,
}) {
  const words = answer.trim() ? answer.trim().split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const charCount = answer.length;

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear your current draft response?")) {
      onChange("");
    }
  };

  const handleSkipWithCheck = () => {
    if (answer.trim().length > 0) {
      if (!window.confirm("You have typed a draft response. Skipping will move to the next question without evaluating this answer. Continue?")) {
        return;
      }
    }
    onSkip && onSkip();
  };

  // Keyboard shortcut: Ctrl+Enter / Cmd+Enter to submit
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (!disabled && !isSubmitting && answer.trim()) {
        onSubmit && onSubmit();
      }
    }
  };

  return (
    <section
      aria-label="Your Answer Editor"
      className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-4"
    >
      <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-gray-900" />
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Your Spoken or Written Response
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {answer.trim().length > 0 && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-[11px] font-semibold text-gray-400 hover:text-red-600 transition flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:underline"
              title="Clear draft response"
            >
              <RotateCcw size={11} />
              <span>Clear draft</span>
            </button>
          )}

          <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
            <span>{wordCount} words</span>
            <span className="text-gray-300">•</span>
            <span>{charCount} chars</span>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="interview-answer-textarea" className="sr-only">
          Type your interview response
        </label>
        <textarea
          id="interview-answer-textarea"
          rows={7}
          value={answer}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isSubmitting}
          placeholder="Articulate your answer clearly... Outline your core approach, walk through a concrete example or architecture, and explain trade-offs. (Press Ctrl + Enter to submit)"
          className="w-full rounded-xl border border-gray-200 bg-gray-50/70 p-4 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-black focus-visible:ring-2 focus-visible:ring-black leading-relaxed resize-y min-h-[170px] disabled:opacity-75"
        />
      </div>

      {/* Helpful Guidance Tip */}
      <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-100 flex items-start gap-2.5">
        <Lightbulb size={15} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="text-[11px] text-gray-600 leading-normal">
          <strong className="text-gray-800">Answering advice:</strong> Evaluate only what you explicitly mention. Avoid buzzwords without substance. If applicable, mention measurable results or specific trade-offs.
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[11px] text-gray-500">
        <div>
          {wordCount >= 25 ? (
            <span className="text-green-700 font-medium flex items-center gap-1">
              ✓ Good depth and substance for thorough AI evaluation
            </span>
          ) : (
            <span className="text-gray-400">
              Aim for at least 25–50 words to provide meaningful detail for scoring.
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {onSkip && (
            <button
              type="button"
              disabled={disabled || isSubmitting}
              onClick={handleSkipWithCheck}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 disabled:opacity-40 cursor-pointer focus-visible:ring-2 focus-visible:ring-black"
            >
              <SkipForward size={13} />
              <span>Skip Question</span>
            </button>
          )}

          {onSubmit && (
            <button
              type="button"
              disabled={disabled || isSubmitting || !answer.trim()}
              onClick={onSubmit}
              className="px-6 py-2.5 rounded-xl bg-black text-white hover:bg-gray-900 text-xs font-bold flex items-center gap-2 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              title={!answer.trim() ? "Type your answer before submitting" : "Submit answer for evaluation (Ctrl+Enter)"}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Evaluating with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>Submit Answer for Evaluation</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default AnswerEditor;

