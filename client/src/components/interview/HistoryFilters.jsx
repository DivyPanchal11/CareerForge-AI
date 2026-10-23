import { Search, X } from "lucide-react";
import {
  INTERVIEW_TYPES,
  DIFFICULTY_LEVELS,
} from "../../constants/interviewConstants";

function HistoryFilters({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  difficultyFilter,
  onDifficultyFilterChange,
  sortBy,
  onSortByChange,
  onReset,
}) {
  const isFiltered = Boolean(
    searchQuery ||
    typeFilter !== "All" ||
    difficultyFilter !== "All" ||
    sortBy !== "newest"
  );

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by role, keyword, or interview type..."
            className="w-full h-9.5 pl-9 pr-8 rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-gray-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            className="h-9.5 px-3 rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-700 outline-none transition focus:bg-white focus:border-gray-400 cursor-pointer"
          >
            <option value="All">All Types</option>
            {INTERVIEW_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={difficultyFilter}
            onChange={(e) => onDifficultyFilterChange(e.target.value)}
            className="h-9.5 px-3 rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-700 outline-none transition focus:bg-white focus:border-gray-400 cursor-pointer"
          >
            <option value="All">All Difficulties</option>
            {DIFFICULTY_LEVELS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>



          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="h-9.5 px-3 rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-700 outline-none transition focus:bg-white focus:border-gray-400 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest_score">Highest Score</option>
            <option value="lowest_score">Lowest Score</option>
          </select>

          {/* Reset button */}
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="h-9.5 px-3 rounded-lg text-xs font-semibold text-gray-600 hover:text-black hover:bg-gray-100 transition cursor-pointer flex items-center gap-1"
            >
              <X size={13} />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default HistoryFilters;
