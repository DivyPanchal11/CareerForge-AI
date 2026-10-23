import { Clock, CheckCircle2, FileText, Sparkles, Award } from "lucide-react";
import { resolveSessionRole } from "../../services/interviewService";

function ScoreBreakdown({ result }) {
  if (!result) return null;

  const {
    overallScore = 0,
    answeredCount = 0,
    totalQuestions = 0,
    timeSpentSeconds = 0,
    config = {},
    aggregateRubricScores,
  } = result;

  const mins = Math.floor(timeSpentSeconds / 60);
  const secs = timeSpentSeconds % 60;
  const timeFormatted = `${mins}m ${secs}s`;

  const rubric = aggregateRubricScores || {};

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-gray-100 gap-3">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
            Performance Summary
          </span>
          <h2 className="text-xl font-bold text-gray-900 mt-0.5">
            Interview Results Overview
          </h2>
          <p className="text-xs text-gray-500">
            {resolveSessionRole(result)} • {config.experienceLevel || "Entry"} level • {config.interviewType || "Practice"}
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-[11px] font-medium text-gray-700 w-fit">
          <Sparkles size={12} className="text-black" />
          <span>Gemini AI Evaluation</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mt-6">
        {/* Overall Score Dial Card */}
        <div className="lg:col-span-1 bg-gray-50 rounded-2xl p-5 flex flex-col items-center justify-center text-center border border-gray-100">
          <div className="w-20 h-20 rounded-full border-4 border-black flex items-center justify-center bg-white shadow-xs">
            <span className="text-2xl font-extrabold text-gray-900">
              {overallScore}%
            </span>
          </div>
          <span className="text-xs font-bold text-gray-900 mt-3">
            Overall Score
          </span>
          <p className="text-[10px] text-gray-500 mt-0.5">
            {answeredCount} of {totalQuestions} questions evaluated
          </p>
        </div>

        {/* Breakdown Stats Cards */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Accuracy */}
          <div className="p-3.5 rounded-xl border border-gray-200 bg-white">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Accuracy
            </span>
            <div className="text-lg font-extrabold text-gray-900">
              {rubric.accuracy !== undefined ? `${rubric.accuracy}%` : `${overallScore}%`}
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Factual & procedural claims
            </p>
          </div>

          {/* Relevance */}
          <div className="p-3.5 rounded-xl border border-gray-200 bg-white">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Relevance
            </span>
            <div className="text-lg font-extrabold text-gray-900">
              {rubric.relevance !== undefined ? `${rubric.relevance}%` : `${overallScore}%`}
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Direct answer alignment
            </p>
          </div>

          {/* Completeness */}
          <div className="p-3.5 rounded-xl border border-gray-200 bg-white">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Completeness
            </span>
            <div className="text-lg font-extrabold text-gray-900">
              {rubric.completeness !== undefined
                ? `${rubric.completeness}%`
                : rubric.depth !== undefined
                ? `${rubric.depth}%`
                : `${overallScore}%`}
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Requirement coverage & scope
            </p>
          </div>

          {/* Clarity */}
          <div className="p-3.5 rounded-xl border border-gray-200 bg-white">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Clarity
            </span>
            <div className="text-lg font-extrabold text-gray-900">
              {rubric.clarity !== undefined ? `${rubric.clarity}%` : `${overallScore}%`}
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Structure & communication
            </p>
          </div>

          {/* Role Competence */}
          <div className="p-3.5 rounded-xl border border-gray-200 bg-white">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Role Competence
            </span>
            <div className="text-lg font-extrabold text-gray-900">
              {rubric.roleCompetence !== undefined ? `${rubric.roleCompetence}%` : `${overallScore}%`}
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Demonstrated role skills
            </p>
          </div>

          {/* Time Invested */}
          <div className="p-3.5 rounded-xl border border-gray-200 bg-white">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Time Invested
            </span>
            <div className="text-lg font-extrabold text-gray-900">
              {timeFormatted}
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Pacing across session
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScoreBreakdown;
