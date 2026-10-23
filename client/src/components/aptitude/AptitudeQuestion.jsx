import { CheckCircle2, XCircle } from "lucide-react";

function AptitudeQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionId = null,
  onSelectOption,
  showResult = false,
  disabled = false,
}) {
  if (!question) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center text-gray-500">
        Question data is unavailable.
      </div>
    );
  }

  const {
    topicName,
    difficulty = "Medium",
    passage,
    options = [],
    correctOptionId,
  } = question;

  const difficultyBadgeColor = {
    easy: "text-emerald-700 bg-emerald-50 border-emerald-200",
    medium: "text-amber-700 bg-amber-50 border-amber-200",
    hard: "text-rose-700 bg-rose-50 border-rose-200",
  }[difficulty.toLowerCase()] || "text-gray-700 bg-gray-50 border-gray-200";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
      {/* Top Meta Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-xs text-gray-500 font-medium">
            {topicName}
          </span>
        </div>

        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${difficultyBadgeColor} capitalize`}>
          {difficulty}
        </span>
      </div>

      {/* Reading Comprehension Passage if present */}
      {passage && (
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80 text-xs sm:text-sm text-gray-700 leading-relaxed max-h-60 overflow-y-auto">
          <p className="font-semibold text-gray-900 mb-1.5 flex items-center gap-1.5">
            Reading Passage:
          </p>
          <p className="whitespace-pre-line">{passage}</p>
        </div>
      )}

      {/* Question Text */}
      <div className="text-base sm:text-lg font-semibold text-gray-900 leading-relaxed whitespace-pre-line">
        {question.question}
      </div>

      {/* Options List */}
      <div className="space-y-3 pt-2">
        {options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.id === correctOptionId;

          let optionStyle = "border-gray-200 bg-white hover:border-gray-300 text-gray-800";
          let badgeStyle = "bg-gray-100 text-gray-700 border-gray-200";

          if (showResult) {
            if (isCorrect) {
              optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-medium";
              badgeStyle = "bg-emerald-600 text-white border-emerald-600";
            } else if (isSelected && !isCorrect) {
              optionStyle = "border-rose-400 bg-rose-50 text-rose-950";
              badgeStyle = "bg-rose-600 text-white border-rose-600";
            } else {
              optionStyle = "border-gray-100 bg-gray-50/50 text-gray-400 opacity-70";
            }
          } else if (isSelected) {
            optionStyle = "border-black bg-gray-50 text-black ring-1 ring-black";
            badgeStyle = "bg-black text-white border-black";
          }

          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectOption && onSelectOption(option.id)}
              className={`
                w-full text-left p-4 rounded-xl border transition flex items-center justify-between gap-3
                ${optionStyle}
                ${disabled ? "cursor-default" : "cursor-pointer active:scale-[0.99]"}
              `}
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border uppercase transition ${badgeStyle}`}>
                  {option.id}
                </span>
                <span className="text-sm leading-snug">
                  {option.text}
                </span>
              </div>

              {showResult && (
                <div className="shrink-0">
                  {isCorrect && (
                    <CheckCircle2 size={18} className="text-emerald-600" />
                  )}
                  {isSelected && !isCorrect && (
                    <XCircle size={18} className="text-rose-600" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AptitudeQuestion;
