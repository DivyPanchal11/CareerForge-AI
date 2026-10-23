import { Link } from "react-router-dom";
import { ArrowRight, Clock, Award, SearchX } from "lucide-react";
import InterviewEmptyState from "./InterviewEmptyState";
import { resolveSessionRole } from "../../services/interviewService";

function HistoryTable({ history = [], isFiltered = false, onClearFilters = null, onStartInterview = null }) {
  if (history.length === 0) {
    if (isFiltered) {
      return (
        <div className="py-8">
          <InterviewEmptyState
            icon={SearchX}
            title="No Matching Attempts"
            description="No past interview attempts match your current search or filter criteria. Try resetting the filters."
            actionButton={
              onClearFilters && (
                <button
                  type="button"
                  onClick={onClearFilters}
                  className="px-4 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:bg-gray-900 transition active:scale-95 cursor-pointer"
                >
                  Clear Filters
                </button>
              )
            }
          />
        </div>
      );
    }

    return (
      <div className="py-8">
        <InterviewEmptyState
          icon={Award}
          title="No Interviews Recorded"
          description="You haven't completed any mock interviews yet. Launch your first mock session to see your progress and history here."
          actionButton={
            onStartInterview && (
              <button
                type="button"
                onClick={onStartInterview}
                className="px-4 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:bg-gray-900 transition active:scale-95 cursor-pointer"
              >
                Start an Interview
              </button>
            )
          }
        />
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Desktop / Tablet Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-900 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-5 py-3.5">Date & Time</th>
              <th className="px-5 py-3.5">Target Role</th>
              <th className="px-5 py-3.5">Type & Level</th>
              <th className="px-5 py-3.5">Questions</th>
              <th className="px-5 py-3.5">Score</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {history.map((item) => {
              const dateStr = item.completedAt
                ? new Date(item.completedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Unknown";

              return (
                <tr key={item.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-5 py-4 whitespace-nowrap text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-gray-400" />
                      <span>{dateStr}</span>
                    </div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap font-bold text-gray-900">
                    {resolveSessionRole(item)}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium text-[10px]">
                        {item.config?.interviewType || "General"}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200 text-gray-600 font-medium text-[10px]">
                        {item.config?.difficulty || "Intermediate"}
                      </span>

                    </div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-gray-700 font-medium">
                      {item.answeredCount || 0}/{item.totalQuestions || 5} answered
                    </span>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1 font-bold text-gray-900">
                      <span>{item.overallScore || 0}%</span>
                    </div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <Link
                      to={`/interviews/result/${item.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold transition active:scale-95"
                    >
                      View Result
                      <ArrowRight size={12} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-100 p-3">
        {history.map((item) => {
          const dateStr = item.completedAt
            ? new Date(item.completedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Unknown";

          return (
            <div key={item.id} className="p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900">
                  {resolveSessionRole(item)}
                </span>
                <span className="text-xs font-bold text-gray-900">
                  {item.overallScore || 0}%
                </span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium text-[10px]">
                  {item.config?.interviewType}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200 text-gray-600 font-medium text-[10px]">
                  {item.config?.difficulty}
                </span>

                <span className="text-[11px] text-gray-400">
                  • {item.answeredCount}/{item.totalQuestions} questions
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Clock size={11} />
                  {dateStr}
                </span>

                <Link
                  to={`/interviews/result/${item.id}`}
                  className="px-3 py-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-[11px] font-semibold flex items-center gap-1 transition"
                >
                  View Result
                  <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HistoryTable;
