import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Award, History, BookOpen, Play } from "lucide-react";

import Navbar from "../components/auth/Navbar";
import AptitudeHeader from "../components/aptitude/AptitudeHeader";
import AptitudeStats from "../components/aptitude/AptitudeStats";
import AptitudeCategoryCard from "../components/aptitude/AptitudeCategoryCard";
import AptitudeRecommendations from "../components/aptitude/AptitudeRecommendations";
import AptitudeEmptyState from "../components/aptitude/AptitudeEmptyState";

import {
  getAptitudeDashboardData,
  getCategoryQuestionCount,
} from "../services/aptitudeService";
import {
  QUANTITATIVE_TOPICS,
  LOGICAL_TOPICS,
  VERBAL_TOPICS,
} from "../data/aptitudeTopics";
import { APTITUDE_CATEGORIES } from "../constants/aptitudeConstants";
import { formatTime } from "../utils/aptitudeScoring";

function Aptitude() {
  const [data] = useState(() => getAptitudeDashboardData());

  const categoryTopicCounts = {
    quantitative: QUANTITATIVE_TOPICS.length,
    logical: LOGICAL_TOPICS.length,
    verbal: VERBAL_TOPICS.length,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <AptitudeHeader />

        {/* Aggregate Stats Banner */}
        <AptitudeStats stats={data} />

        {/* Aptitude Categories Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Aptitude Categories
              </h2>
              <p className="text-xs text-gray-500">
                Core syllabus domains tested in engineering & campus recruitment assessments
              </p>
            </div>

            <Link
              to="/aptitude/topics"
              className="text-xs font-semibold text-gray-700 hover:text-black flex items-center gap-1 transition"
            >
              Browse All 42 Topics
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {APTITUDE_CATEGORIES.map((cat, idx) => (
              <AptitudeCategoryCard
                key={cat.id}
                category={cat}
                topicCount={categoryTopicCounts[cat.id]}
                questionCount={getCategoryQuestionCount(cat.id)}
                accuracy={data.categoryAccuracy?.[cat.id] || 0}
                delay={idx * 0.05}
              />
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <AptitudeRecommendations recommendations={data.recommendations} />

        {/* Bottom Section: Continue Practicing & Recent Test Attempts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Continue Practicing / Quick Launch */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-800">
                  <Play size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Quick Practice
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Jump right into topic-wise MCQ training
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Link
                  to="/aptitude/practice/percentages"
                  className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-xs font-semibold text-gray-800 transition"
                >
                  <span>Percentages (Quant)</span>
                  <ArrowRight size={14} className="text-gray-400" />
                </Link>

                <Link
                  to="/aptitude/practice/number-series"
                  className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-xs font-semibold text-gray-800 transition"
                >
                  <span>Number Series (Logical)</span>
                  <ArrowRight size={14} className="text-gray-400" />
                </Link>

                <Link
                  to="/aptitude/practice/error-spotting"
                  className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-xs font-semibold text-gray-800 transition"
                >
                  <span>Error Spotting (Verbal)</span>
                  <ArrowRight size={14} className="text-gray-400" />
                </Link>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100">
              <Link
                to="/aptitude/topics"
                className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <BookOpen size={13} />
                Explore All Topics
              </Link>
            </div>
          </div>

          {/* Recent Test Attempts */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-800">
                  <History size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Recent Test Attempts
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Your recent assessments stored in local browser history
                  </p>
                </div>
              </div>

              {data.recentAttempts && data.recentAttempts.length > 0 && (
                <Link
                  to="/aptitude/history"
                  className="text-xs font-semibold text-gray-700 hover:text-black flex items-center gap-1 transition"
                >
                  View All
                  <ArrowRight size={13} />
                </Link>
              )}
            </div>

            <div className="mt-4">
              {data.recentAttempts && data.recentAttempts.length > 0 ? (
                <div className="space-y-2.5">
                  {data.recentAttempts.map((attempt) => (
                    <div
                      key={attempt.id}
                      className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-100/70 transition"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900">
                            {attempt.title || "Aptitude Assessment"}
                          </span>
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                            {attempt.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {new Date(attempt.completedAt).toLocaleDateString()} • {formatTime(attempt.timeSpentSeconds)} duration
                        </p>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <div className="text-right">
                          <span className="text-xs font-bold text-gray-900 block">
                            Score: {attempt.score} / {attempt.totalQuestions}
                          </span>
                          <span className="text-[11px] text-emerald-600 font-semibold">
                            {attempt.accuracy}% accuracy
                          </span>
                        </div>

                        <Link
                          to={`/aptitude/result/${attempt.id}`}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold transition"
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <AptitudeEmptyState
                  title="No Test Attempts Yet"
                  description="You have not completed any aptitude assessments yet. Take a test or solve practice MCQs to start recording real metrics."
                  actionText="Take a Timed Test"
                  actionLink="/aptitude/test"
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Aptitude;
