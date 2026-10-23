import { Link } from "react-router-dom";
import { Clock, ArrowRight, Award, History } from "lucide-react";
import InterviewEmptyState from "./InterviewEmptyState";
import { resolveSessionRole } from "../../services/interviewService";

function InterviewRecentActivity({ recentAttempts = [], onStartNew = null }) {
  if (!recentAttempts || recentAttempts.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Recent Activity
            </h3>
            <p className="text-xs text-gray-500">
              Your completed mock interviews will appear here.
            </p>
          </div>
        </div>

        <div className="py-8">
          <InterviewEmptyState
            icon={History}
            title="No Interview History Yet"
            description="You haven't completed any mock interviews yet. Set your preferences above and launch your first timed test!"
            actionButton={
              onStartNew && (
                <button
                  type="button"
                  onClick={onStartNew}
                  className="px-4 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:bg-gray-900 transition active:scale-95 inline-flex items-center gap-2 cursor-pointer"
                >
                  Configure an Interview
                  <ArrowRight size={13} />
                </button>
              )
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            Recent Activity
          </h3>
          <p className="text-xs text-gray-500">
            Review your latest mock session attempts and demo scores.
          </p>
        </div>

        <Link
          to="/interviews/history"
          className="text-xs font-semibold text-gray-700 hover:text-black flex items-center gap-1 transition"
        >
          View All History
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="mt-4 divide-y divide-gray-100">
        {recentAttempts.map((attempt) => {
          const score = attempt.overallScore || 0;
          const dateStr = attempt.completedAt
            ? new Date(attempt.completedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Recent";

          return (
            <div
              key={attempt.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 rounded-xl px-2.5 transition"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700 shrink-0">
                  <Award size={18} />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-gray-900">
                      {resolveSessionRole(attempt)}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium">
                      {attempt.config?.interviewType || "General"}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200 text-gray-600 font-medium">
                      {attempt.config?.difficulty || "Intermediate"}
                    </span>
                    {/* Level badge */}
                  </div>

                  <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {dateStr}
                    </span>
                    <span>•</span>
                    <span>
                      {attempt.answeredCount || 0} of {attempt.totalQuestions || 5} questions answered
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-900">
                    {score}%
                  </span>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {attempt.isPrototypeEvaluation ? "Demo Score" : "Score"}
                  </p>
                </div>

                <Link
                  to={`/interviews/result/${attempt.id}`}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-[11px] font-semibold text-gray-700 transition flex items-center gap-1.5 active:scale-95"
                >
                  Review
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default InterviewRecentActivity;
