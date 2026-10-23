import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  HelpCircle,
  Target,
  Info,
} from "lucide-react";

function QuestionReviewList({ questionReviews = [] }) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  if (!questionReviews || questionReviews.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-4">
      {/* Header */}
      <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            Question-by-Question Review & Feedback
          </h3>
          <p className="text-xs text-gray-500">
            Examine each submitted response, rubric breakdown, strengths, areas for improvement, and sample answers.
          </p>
        </div>

        <span className="text-xs font-semibold text-gray-500">
          {questionReviews.length} Questions
        </span>
      </div>

      <div className="divide-y divide-gray-100">
        {questionReviews.map((review, idx) => {
          const isExpanded = expandedIndex === idx;
          const isAnswered = review.isAnswered || Boolean(review.userAnswer?.trim());
          const category = (review.category || review.topic || "Technical").toUpperCase();

          return (
            <div key={review.questionId || idx} className="py-4">
              {/* Accordion Toggle Row */}
              <button
                type="button"
                id={`review-toggle-${idx}`}
                aria-expanded={isExpanded}
                aria-controls={`review-details-${idx}`}
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full flex items-center justify-between text-left gap-4 cursor-pointer p-1 rounded-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black"
              >
                <div className="flex items-start sm:items-center gap-3">
                  {/* Question Number Badge */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      isAnswered
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-gray-100 text-gray-800">
                        {category}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200 text-gray-500 font-medium capitalize">
                        {review.difficulty || "Intermediate"}
                      </span>
                    </div>

                    <p className="text-xs text-gray-800 line-clamp-1 font-medium">
                      {review.question}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-900">
                      {review.score !== undefined ? `${review.score}%` : "--"}
                    </span>
                    <p className="text-[10px] text-gray-400 font-medium">
                      {isAnswered ? "Answered" : "Skipped"}
                    </p>
                  </div>

                  <div className="text-gray-400">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </button>

              {/* Accordion Expanded Details */}
              {isExpanded && (
                <div
                  id={`review-details-${idx}`}
                  role="region"
                  aria-labelledby={`review-toggle-${idx}`}
                  className="mt-4 pt-3 border-t border-gray-100 space-y-4 text-xs"
                >
                  {/* Full Question Text */}
                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="font-bold text-gray-900 block mb-1">
                      Question Asked:
                    </span>
                    <p className="text-gray-800 leading-relaxed">
                      {review.question}
                    </p>
                  </div>

                  {/* Candidate Submitted Response */}
                  <div>
                    <span className="font-bold text-gray-900 block mb-1">
                      Your Response:
                    </span>
                    <div className="p-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {review.userAnswer ? review.userAnswer : <span className="text-gray-400 italic">No response submitted for this question.</span>}
                    </div>
                  </div>

                  {/* Uncertainty & Context Note (if any) */}
                  {review.uncertaintyNote && (
                    <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-amber-900 text-[11px]">
                        <Info size={14} className="text-amber-700 shrink-0" />
                        <span>Conditional Scope & Uncertainty Note:</span>
                      </div>
                      <p className="text-amber-900 leading-relaxed pl-5 text-[11px]">
                        {review.uncertaintyNote}
                      </p>
                    </div>
                  )}

                  {/* Rubric Scores with Evidence Justifications */}
                  {review.rubricScores && (
                    <div className="space-y-2">
                      <span className="font-bold text-gray-900 block text-[11px] uppercase tracking-wider">
                        Rubric Performance & Evidence
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-1">
                        {[
                          { key: "accuracy", label: "Accuracy", score: review.rubricScores.accuracy ?? 0 },
                          { key: "relevance", label: "Relevance", score: review.rubricScores.relevance ?? 0 },
                          { key: "completeness", label: "Completeness", score: review.rubricScores.completeness ?? review.rubricScores.depth ?? 0 },
                          { key: "clarity", label: "Clarity", score: review.rubricScores.clarity ?? 0 },
                          { key: "roleCompetence", label: "Role Competence", score: review.rubricScores.roleCompetence ?? 0 },
                        ].map((m) => {
                          const reason = review.scoreReasons?.[m.key];
                          return (
                            <div key={m.key} className="p-2.5 rounded-lg border border-gray-200 bg-gray-50/70 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                                    {m.label}
                                  </span>
                                  <span className="text-xs font-extrabold text-gray-900">
                                    {m.score}%
                                  </span>
                                </div>
                                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden mb-1">
                                  <div
                                    className="h-full bg-black rounded-full"
                                    style={{ width: `${m.score}%` }}
                                  />
                                </div>
                              </div>
                              {reason && (
                                <p className="text-[10px] text-gray-600 italic mt-1.5 pt-1.5 border-t border-gray-200/80 leading-snug">
                                  "{reason}"
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Strengths & Improvements */}
                  {(review.strengths?.length > 0 || review.improvements?.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                      {review.strengths?.length > 0 && (
                        <div className="p-3 rounded-xl border border-gray-200 bg-white space-y-1.5">
                          <div className="flex items-center gap-1.5 font-bold text-gray-900 text-[11px] uppercase tracking-wider">
                            <CheckCircle2 size={13} className="text-green-600" />
                            <span>What You Did Well</span>
                          </div>
                          <ul className="space-y-1 text-gray-700 pl-1">
                            {review.strengths.map((str, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-green-500 font-bold">•</span>
                                <span>{str}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {review.improvements?.length > 0 && (
                        <div className="p-3 rounded-xl border border-gray-200 bg-white space-y-1.5">
                          <div className="flex items-center gap-1.5 font-bold text-gray-900 text-[11px] uppercase tracking-wider">
                            <AlertCircle size={13} className="text-amber-600" />
                            <span>Improvement Suggestions</span>
                          </div>
                          <ul className="space-y-1 text-gray-700 pl-1">
                            {review.improvements.map((imp, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-amber-500 font-bold">•</span>
                                <span>{imp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Accuracy Notes (if any) */}
                  {review.accuracyNotes && review.accuracyNotes.length > 0 && (
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-gray-900 text-[11px]">
                        <Target size={13} className="text-gray-700" />
                        <span>Accuracy & Technical Distinction:</span>
                      </div>
                      <ul className="space-y-0.5 text-gray-600 pl-1">
                        {review.accuracyNotes.map((note, i) => (
                          <li key={i}>• {note}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Sample Stronger Answer */}
                  {(review.sampleAnswer || review.sampleImprovement) && (
                    <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/70 space-y-1.5">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 font-bold text-gray-900 text-[11px]">
                          <BookOpen size={13} className="text-black" />
                          <span>Example of a Stronger Answer:</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-500 font-medium">
                          Spoken Example • Context-Dependent
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed bg-white p-2.5 rounded-lg border border-gray-200 whitespace-pre-line">
                        {review.sampleAnswer || review.sampleImprovement}
                      </p>
                    </div>
                  )}

                  {/* Follow-up Question */}
                  {review.followUpQuestion && (
                    <div className="p-3 rounded-xl border border-gray-200 bg-white space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-gray-900 text-[11px]">
                        <HelpCircle size={13} className="text-blue-600" />
                        <span>Follow-Up Probe:</span>
                      </div>
                      <p className="text-gray-700 italic">
                        "{review.followUpQuestion}"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QuestionReviewList;
