import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { History, Trash2, Plus } from "lucide-react";

import Navbar from "../components/auth/Navbar";
import HistoryFilters from "../components/interview/HistoryFilters";
import HistoryTable from "../components/interview/HistoryTable";

import {
  getInterviewHistory,
  clearInterviewHistory,
} from "../services/interviewService";

function InterviewHistory() {
  const navigate = useNavigate();

  const [history, setHistory] = useState(() => getInterviewHistory());
  const [showClearModal, setShowClearModal] = useState(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const handleResetFilters = () => {
    setSearchQuery("");
    setTypeFilter("All");
    setDifficultyFilter("All");
    setSortBy("newest");
  };

  const handleClearHistory = () => {
    clearInterviewHistory();
    setHistory([]);
    setShowClearModal(false);
    toast.success("Interview history has been cleared.");
  };

  // Filtered & sorted data
  const filteredHistory = useMemo(() => {
    let result = [...history];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const role = (item.config?.targetRole || "").toLowerCase();
        const type = (item.config?.interviewType || "").toLowerCase();
        const diff = (item.config?.difficulty || "").toLowerCase();
        return role.includes(q) || type.includes(q) || diff.includes(q);
      });
    }

    // Type filter
    if (typeFilter !== "All") {
      result = result.filter((item) => item.config?.interviewType === typeFilter);
    }

    // Difficulty filter
    if (difficultyFilter !== "All") {
      result = result.filter((item) => item.config?.difficulty === difficultyFilter);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.completedAt) - new Date(b.completedAt);
      }
      if (sortBy === "highest_score") {
        return (b.overallScore || 0) - (a.overallScore || 0);
      }
      if (sortBy === "lowest_score") {
        return (a.overallScore || 0) - (b.overallScore || 0);
      }
      // default: newest
      return new Date(b.completedAt) - new Date(a.completedAt);
    });

    return result;
  }, [history, searchQuery, typeFilter, difficultyFilter, sortBy]);

  const isFiltered = Boolean(
    searchQuery ||
    typeFilter !== "All" ||
    difficultyFilter !== "All" ||
    sortBy !== "newest"
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Header Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white shrink-0">
              <History size={22} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  Interview History
                </h1>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                  {history.length} Attempt{history.length === 1 ? "" : "s"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Access past evaluations, examine demo scores, and track your ongoing mock test performance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center">
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setShowClearModal(true)}
                className="px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:text-red-600 hover:border-red-200 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <Trash2 size={13} />
                Clear All
              </button>
            )}

            <Link
              to="/interviews"
              className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-900 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <Plus size={14} />
              New Interview
            </Link>
          </div>
        </div>

        {/* Filters */}
        <HistoryFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          difficultyFilter={difficultyFilter}
          onDifficultyFilterChange={setDifficultyFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onReset={handleResetFilters}
        />

        {/* Table & Cards */}
        <HistoryTable
          history={filteredHistory}
          isFiltered={isFiltered}
          onClearFilters={handleResetFilters}
          onStartInterview={() => navigate("/interviews")}
        />
      </main>

      {/* Clear Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Clear Interview History?
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  This will permanently remove all {history.length} saved mock interview attempts from your browser storage.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleClearHistory}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs font-semibold transition active:scale-95 cursor-pointer"
              >
                Yes, Clear History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InterviewHistory;
