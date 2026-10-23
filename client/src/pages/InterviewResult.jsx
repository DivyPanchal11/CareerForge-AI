import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, AlertCircle } from "lucide-react";

import Navbar from "../components/auth/Navbar";
import ScoreBreakdown from "../components/interview/ScoreBreakdown";
import FeedbackCard from "../components/interview/FeedbackCard";
import QuestionReviewList from "../components/interview/QuestionReviewList";

import {
  getResultById,
  getLatestResult,
  startInterviewSession,
} from "../services/interviewService";

function InterviewResult() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [result] = useState(() => (id ? getResultById(id) : getLatestResult()));

  const handleRetry = () => {
    if (!result?.config) {
      navigate("/interviews");
      return;
    }

    try {
      startInterviewSession(result.config);
      toast.success("Starting fresh session with same parameters!");
      navigate("/interviews/session");
    } catch (err) {
      console.error("Retry error:", err);
      toast.error("Could not re-initialize interview.");
    }
  };

  const handleGoDashboard = () => {
    navigate("/interviews");
  };

  const handleGoHistory = () => {
    navigate("/interviews/history");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {!result ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center max-w-md mx-auto shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-500">
              <AlertCircle size={22} />
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900">
                No Evaluation Result Found
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                The requested interview evaluation could not be located in your browser session.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/interviews"
                className="px-4 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:bg-gray-900 transition active:scale-95 inline-flex items-center gap-1.5"
              >
                <ArrowLeft size={13} />
                Return to Interview Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Top Back Navigation Bar */}
            <div className="flex items-center justify-between">
              <Link
                to="/interviews"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-black transition"
              >
                <ArrowLeft size={14} />
                Back to Interview Hub
              </Link>

              <span className="text-[11px] text-gray-400">
                Attempt completed on{" "}
                {new Date(result.completedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Performance Overview & Metric Dial */}
            <ScoreBreakdown result={result} />

            {/* Strengths, Improvements & Action Controls */}
            <FeedbackCard
              result={result}
              onRetry={handleRetry}
              onDashboard={handleGoDashboard}
              onHistory={handleGoHistory}
            />

            {/* Question by Question Review Accordion */}
            <QuestionReviewList questionReviews={result.questionReviews} />
          </>
        )}
      </main>
    </div>
  );
}

export default InterviewResult;
