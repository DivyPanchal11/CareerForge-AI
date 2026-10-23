import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import ExplanationView from "./ExplanationView";

function IncorrectQuestions({ evaluatedQuestions = [] }) {
  const [filter, setFilter] = useState("all"); // 'all' | 'incorrect' | 'correct' | 'unanswered'
  const [expandedId, setExpandedId] = useState(null);

  const filteredQuestions = evaluatedQuestions.filter((q) => {
    if (filter === "incorrect") return q.isAnswered && !q.isCorrect;
    if (filter === "correct") return q.isCorrect;
    if (filter === "unanswered") return !q.isAnswered;
    return true;
  });

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            Question Review & Solutions
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Detailed inspection of your responses with complete step-by-step explanations
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "all", label: "All Questions" },
            { id: "incorrect", label: "Incorrect Only" },
            { id: "correct", label: "Correct Only" },
            { id: "unanswered", label: "Unanswered" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === tab.id
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-500">
            No questions match the selected filter.
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const isExpanded = expandedId === q.id || filter === "incorrect";

            return (
              <div
                key={q.id}
                className="border border-gray-200 rounded-xl overflow-hidden transition"
              >
                {/* Header bar */}
                <button
                  type="button"
                  onClick={() => toggleExpand(q.id)}
                  className="w-full text-left p-4 bg-gray-50/70 hover:bg-gray-100/70 flex items-center justify-between gap-4 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-white border border-gray-200 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>

                    <div className="flex items-center gap-2">
                      {q.isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                          <CheckCircle2 size={15} /> Correct
                        </span>
                      ) : q.isAnswered ? (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-semibold text-xs">
                          <XCircle size={15} /> Incorrect
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-500 font-semibold text-xs">
                          <HelpCircle size={15} /> Skipped
                        </span>
                      )}
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-600 font-medium">
                        {q.topicName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-[11px] font-medium hidden sm:inline">
                      {isExpanded ? "Collapse" : "View Explanation"}
                    </span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {/* Question Details */}
                <div className="p-5 space-y-4 bg-white">
                  {q.passage && (
                    <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600 leading-relaxed border border-gray-100">
                      <span className="font-semibold block mb-1">Passage:</span>
                      {q.passage}
                    </div>
                  )}

                  <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                    {q.question}
                  </p>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt) => {
                      const isUserChoice = opt.id === q.selectedOptionId;
                      const isCorrectChoice = opt.id === q.correctOptionId;

                      let style = "bg-white border-gray-200 text-gray-700";
                      if (isCorrectChoice) {
                        style = "bg-emerald-50 border-emerald-400 text-emerald-950 font-medium";
                      } else if (isUserChoice && !isCorrectChoice) {
                        style = "bg-rose-50 border-rose-400 text-rose-950 font-medium";
                      }

                      return (
                        <div
                          key={opt.id}
                          className={`p-3 rounded-lg border text-xs flex items-center justify-between ${style}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold uppercase">
                              ({opt.id})
                            </span>
                            <span>{opt.text}</span>
                          </div>

                          {isCorrectChoice && (
                            <span className="text-[10px] uppercase font-bold text-emerald-700">
                              Correct
                            </span>
                          )}
                          {isUserChoice && !isCorrectChoice && (
                            <span className="text-[10px] uppercase font-bold text-rose-700">
                              Your Choice
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Detailed Explanation Section */}
                  {isExpanded && (
                    <ExplanationView
                      explanation={q.explanation}
                      correctOptionId={q.correctOptionId}
                      correctOptionText={q.options?.find((o) => o.id === q.correctOptionId)?.text}
                      category={q.category}
                    />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default IncorrectQuestions;
