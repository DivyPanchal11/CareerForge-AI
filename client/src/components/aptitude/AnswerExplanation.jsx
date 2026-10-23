import { Lightbulb, CheckCircle2, XCircle } from "lucide-react";
import ExplanationView from "./ExplanationView";

function AnswerExplanation({
  question,
  selectedOptionId = null,
}) {
  if (!question) return null;

  const { options = [], correctOptionId, explanation, category } = question;
  const correctOption = options.find((o) => o.id === correctOptionId);
  const selectedOption = options.find((o) => o.id === selectedOptionId);
  const isCorrect = selectedOptionId === correctOptionId;
  const isAttempted = selectedOptionId !== null && selectedOptionId !== undefined;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
      {/* Answer status alert */}
      {isAttempted ? (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
            isCorrect
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {isCorrect ? (
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            ) : (
              <XCircle size={18} className="text-rose-600 shrink-0" />
            )}
            <span className="font-medium">
              {isCorrect
                ? "Your answer is correct! Well done."
                : `Your answer (${selectedOption?.id?.toUpperCase() || "N/A"}) is incorrect.`}
            </span>
          </div>

          <span
            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
              isCorrect
                ? "bg-emerald-100 text-emerald-800"
                : "bg-rose-100 text-rose-800"
            }`}
          >
            {isCorrect ? "+1 Mark" : "Review"}
          </span>
        </div>
      ) : (
        <div className="p-3 rounded-xl border bg-gray-50 border-gray-200 text-gray-700 text-xs">
          This question was unattempted.
        </div>
      )}

      {/* Enhanced Explanation & Derivation View */}
      <ExplanationView
        explanation={explanation}
        correctOptionId={correctOptionId}
        correctOptionText={correctOption?.text}
        category={category}
      />
    </div>
  );
}

export default AnswerExplanation;
