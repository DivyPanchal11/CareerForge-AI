import { useState } from "react";
import { Target, Copy, Check, HelpCircle, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  targetRole = "",
  experienceLevel = "",
  interviewType = "",
  isAnswered = false,
}) {
  const [copied, setCopied] = useState(false);

  if (!question) return null;

  const category = (question.category || question.type || interviewType || "technical").toLowerCase();
  const difficulty = (question.difficulty || "intermediate").toLowerCase();
  const assesses = question.whatItAssesses || question.suggestedPoints || [];

  const getCategoryBadge = (cat) => {
    if (cat.includes("behav")) return { bg: "bg-purple-50 text-purple-700 border-purple-200", label: "Behavioral" };
    if (cat.includes("role")) return { bg: "bg-blue-50 text-blue-700 border-blue-200", label: "Role-Specific" };
    return { bg: "bg-gray-100 text-gray-800 border-gray-200", label: "Technical" };
  };

  const catBadge = getCategoryBadge(category);

  const handleCopyQuestion = async () => {
    try {
      await navigator.clipboard.writeText(question.question);
      setCopied(true);
      toast.success("Question copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      toast.error("Could not copy question text");
    }
  };

  return (
    <section
      aria-labelledby="current-question-title"
      className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm transition"
    >
      {/* Top Meta info */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-extrabold text-black bg-gray-100 px-3 py-1 rounded-lg border border-gray-200">
            Question {questionNumber} of {totalQuestions}
          </span>

          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${catBadge.bg}`}>
            {catBadge.label}
          </span>

          <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-gray-50 border border-gray-200 text-gray-600 capitalize">
            {difficulty}
          </span>

          {isAnswered ? (
            <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
              <CheckCircle2 size={11} />
              Answer Drafted
            </span>
          ) : (
            <span className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-gray-50 text-gray-500 border border-gray-200">
              Awaiting Answer
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {targetRole && (
            <span className="hidden sm:inline-block text-[11px] text-gray-400 font-medium truncate max-w-xs">
              {targetRole} {experienceLevel ? `• ${experienceLevel}` : ""}
            </span>
          )}

          <button
            type="button"
            onClick={handleCopyQuestion}
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-900 transition flex items-center gap-1 text-[11px] cursor-pointer"
            title="Copy question text"
            aria-label="Copy question text"
          >
            {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
            <span className="hidden md:inline">{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Main Question Prompt */}
      <div className="mt-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
          Interview Question:
        </span>
        <h2
          id="current-question-title"
          className="text-base sm:text-xl font-bold text-gray-900 leading-snug tracking-tight"
        >
          {question.question}
        </h2>
      </div>

      {/* What it assesses tags */}
      {assesses && assesses.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Target size={12} className="text-gray-400" />
            Assesses:
          </span>
          {assesses.map((item, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-gray-50 text-gray-700 border border-gray-200 font-medium"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

export default QuestionCard;

