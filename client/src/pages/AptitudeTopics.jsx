import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Clock, ChevronLeft } from "lucide-react";

import Navbar from "../components/auth/Navbar";
import AptitudeTopicCard from "../components/aptitude/AptitudeTopicCard";
import {
  ALL_TOPICS,
  QUANTITATIVE_TOPICS,
  LOGICAL_TOPICS,
  VERBAL_TOPICS,
} from "../data/aptitudeTopics";
import {
  getTopicQuestionCount,
} from "../services/aptitudeService";
import { getPracticeProgress } from "../utils/aptitudeStorage";

function AptitudeTopics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const [practiceProgress] = useState(() => getPracticeProgress());

  // Handle category tab change
  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    if (catId === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", catId);
    }
    setSearchParams(searchParams);
  };

  // Filter topics
  const filteredTopics = useMemo(() => {
    return ALL_TOPICS.filter((topic) => {
      // Category filter
      if (activeCategory !== "all" && topic.category !== activeCategory) {
        return false;
      }
      // Difficulty filter
      if (selectedDifficulty !== "all" && topic.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = topic.name.toLowerCase().includes(query);
        const matchDesc = topic.description.toLowerCase().includes(query);
        if (!matchName && !matchDesc) return false;
      }
      return true;
    });
  }, [activeCategory, selectedDifficulty, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/aptitude"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-black transition"
          >
            <ChevronLeft size={16} />
            Back to Aptitude Dashboard
          </Link>

          <Link
            to="/aptitude/test"
            className="px-3.5 py-1.5 rounded-lg bg-black text-white hover:bg-gray-900 text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
          >
            <Clock size={13} />
            Take Timed Test
          </Link>
        </div>

        {/* Page Title & Intro */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Aptitude Topics Directory
          </h1>
          <p className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
            Browse all topics across Quantitative Aptitude, Logical Reasoning, and Verbal Ability.
            Each topic includes concept explanations, formulas, and verified MCQ practice.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-gray-100">
            {[
              { id: "all", label: "All Topics (42)" },
              { id: "quantitative", label: `Quantitative (${QUANTITATIVE_TOPICS.length})` },
              { id: "logical", label: `Logical (${LOGICAL_TOPICS.length})` },
              { id: "verbal", label: `Verbal (${VERBAL_TOPICS.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleCategoryChange(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  activeCategory === tab.id
                    ? "bg-black text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search and Difficulty Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <div className="sm:col-span-2 relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search topics (e.g. Percentages, Blood Relations, Syllogisms)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white transition"
              />
            </div>

            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white transition"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy Level</option>
                <option value="medium">Medium Level</option>
                <option value="hard">Hard Level</option>
              </select>
            </div>
          </div>
        </div>

        {/* Topics Grid */}
        <div>
          <div className="flex items-center justify-between mb-3 text-xs text-gray-500 font-medium">
            <span>Showing {filteredTopics.length} topics</span>
          </div>

          {filteredTopics.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-500 text-xs">
              No topics matched your search criteria. Try modifying your filter or search keywords.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTopics.map((topic, idx) => (
                <AptitudeTopicCard
                  key={topic.id}
                  topic={topic}
                  questionCount={getTopicQuestionCount(topic.id)}
                  progress={practiceProgress[topic.id] || null}
                  delay={Math.min(idx * 0.03, 0.3)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AptitudeTopics;
