import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  History,
  Trash2,
  Plus,
  Search,
  ChevronLeft,
  ArrowRight,
  Clock,
  Award,
} from "lucide-react";

import Navbar from "../components/auth/Navbar";
import {
  getAptitudeHistory,
  clearAptitudeHistory,
} from "../services/aptitudeService";
import { formatTime } from "../utils/aptitudeScoring";
import AptitudeEmptyState from "../components/aptitude/AptitudeEmptyState";

function AptitudeHistory() {
  const navigate = useNavigate();

  const [history, setHistory] = useState(() => getAptitudeHistory());
  const [showClearModal, setShowClearModal] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // 'all' | 'test' | 'practice'
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const handleClearHistory = () => {
    clearAptitudeHistory();
    setHistory([]);
    setShowClearModal(false);
    toast.success("Aptitude assessment history has been cleared.");
  };

  const filteredHistory = useMemo(() => {
    let result = [...history];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const title = (item.title || "").toLowerCase();
        const cat = (item.category || "").toLowerCase();
        const topic = (item.topicName || "").toLowerCase();
        return title.includes(q) || cat.includes(q) || topic.includes(q);
      });
    }

    if (typeFilter !== "all") {
      result = result.filter((item) => item.type === typeFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter((item) => item.category === categoryFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.completedAt) - new Date(b.completedAt);
      }
      if (sortBy === "highest_score") {
        return (b.accuracy || 0) - (a.accuracy || 0);
      }
      if (sortBy === "lowest_score") {
        return (a.accuracy || 0) - (b.accuracy || 0);
      }
      return new Date(b.completedAt) - new Date(a.completedAt);
    });

    return result;
  }, [history, searchQuery, typeFilter, categoryFilter, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/aptitude"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-black transition"
          >
            <ChevronLeft size={16} />
            Back to Aptitude Dashboard
          </Link>
        </div>

        {/* Top Header Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white shrink-0">
              <History size={22} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  Aptitude Assessment History
                </h1>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                  {history.length} {history.length === 1 ? "Session" : "Sessions"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Review past practice exercises and timed test scorecards saved in browser storage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center">
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setShowClearModal(true)}
                className="px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:text-rose-600 hover:border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
              >
                <Trash2 size={13} />
                Clear All
              </button>
            )}

            <Link
              to="/aptitude/test"
              className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-900 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-xs"
            >
              <Plus size={14} />
              New Test
            </Link>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white transition"
              />
            </div>

            {/* Session Type */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white transition"
              >
                <option value="all">All Session Types</option>
                <option value="test">Timed Tests</option>
                <option value="practice">Topic Practice</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white transition"
              >
                <option value="all">All Categories</option>
                <option value="quantitative">Quantitative Aptitude</option>
                <option value="logical">Logical Reasoning</option>
                <option value="verbal">Verbal Ability</option>
              </select>
            </div>

            {/* Sorting */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white transition"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest_score">Highest Accuracy</option>
                <option value="lowest_score">Lowest Accuracy</option>
              </select>
            </div>
          </div>
        </div>

        {/* History List */}
        <div>
          {filteredHistory.length === 0 ? (
            <AptitudeEmptyState
              title={history.length === 0 ? "No Aptitude History Yet" : "No Sessions Match Filter"}
              description={
                history.length === 0
                  ? "Completed practice sessions and timed tests will appear here with detailed scorecards and solution reviews."
                  : "Try clearing search keywords or selecting 'All Session Types'."
              }
              actionText="Take a Timed Test"
              actionLink="/aptitude/test"
            />
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-5 hover:bg-gray-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900">
                        {item.title}
                      </h3>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {item.type}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-2">
                      <span>{new Date(item.completedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{formatTime(item.timeSpentSeconds)} duration</span>
                      <span>•</span>
                      <span className="capitalize">{item.category}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-xs font-bold text-gray-900 block">
                        {item.score} / {item.totalQuestions} Marks
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-600">
                        {item.accuracy}% Accuracy
                      </span>
                    </div>

                    <Link
                      to={`/aptitude/result/${item.id}`}
                      className="px-3.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1 transition"
                    >
                      Review
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Clear Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Clear Aptitude History?
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  This will remove all {history.length} saved test and practice sessions from your local browser storage.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleClearHistory}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 text-xs font-semibold transition active:scale-95"
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

export default AptitudeHistory;
