import { useState, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  RotateCcw,
  AlertTriangle,
  Clock,
} from "lucide-react";

import Navbar from "../components/auth/Navbar";
import AptitudeTimer from "../components/aptitude/AptitudeTimer";
import AptitudeQuestion from "../components/aptitude/AptitudeQuestion";
import QuestionPalette from "../components/aptitude/QuestionPalette";
import TimerWarningBanner from "../components/common/TimerWarningBanner";

import {
  startTestSession,
  saveTestAnswer,
  clearTestAnswer,
  toggleMarkForReview,
  saveTestCurrentIndex,
  submitTestSession,
  getActiveTestSession,
  saveActiveTestSession,
} from "../services/aptitudeService";
import { TEST_PRESETS, APTITUDE_CATEGORIES } from "../constants/aptitudeConstants";

function AptitudeTest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCategory = searchParams.get("category") || "all";

  // Test Config state (when no test is active)
  const [testCategory, setTestCategory] = useState(preselectedCategory);
  const [testDifficulty, setTestDifficulty] = useState("all");
  const [selectedPreset, setSelectedPreset] = useState(TEST_PRESETS[0]);

  // Active Session state (lazily initialized from localStorage)
  const [session, setSession] = useState(() => {
    const active = getActiveTestSession();
    return active && active.status === "in_progress" && active.questions?.length > 0 ? active : null;
  });
  const [currentIndex, setCurrentIndex] = useState(() => session?.currentQuestionIndex || 0);
  const [answers, setAnswers] = useState(() => session?.answers || {});
  const [markedForReview, setMarkedForReview] = useState(() => session?.markedForReview || {});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // One-minute warning state: if returning to active session <= 60s and warning not shown yet, show it
  const [showOneMinWarning, setShowOneMinWarning] = useState(() => {
    const active = getActiveTestSession();
    if (active && active.status === "in_progress" && !active.warningShown && active.startedAt && active.durationSeconds) {
      const startMs = new Date(active.startedAt).getTime();
      const elapsed = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
      const remaining = active.durationSeconds - elapsed;
      return remaining <= 60 && remaining > 0;
    }
    return false;
  });

  // Time tracking
  const timeSpentRef = useRef(0);
  const hasSubmittedRef = useRef(false);

  // Start test
  const handleStartTest = () => {
    const categoryName = testCategory === "all"
      ? "Full Syllabus"
      : APTITUDE_CATEGORIES.find((c) => c.id === testCategory)?.name || "Aptitude";

    const newSession = startTestSession({
      title: `${categoryName} Mock Assessment`,
      category: testCategory,
      difficulty: testDifficulty,
      questionCount: selectedPreset.questions,
      durationMinutes: selectedPreset.minutes,
    });

    if (!newSession.questions || newSession.questions.length === 0) {
      toast.error("No questions found for the selected configuration. Try 'All Difficulties'.");
      return;
    }

    hasSubmittedRef.current = false;
    timeSpentRef.current = 0;
    setShowOneMinWarning(false);
    setSession(newSession);
    setCurrentIndex(0);
    setAnswers({});
    setMarkedForReview({});
    toast.success("Aptitude test started. Good luck!");
  };

  // Timer tick callback
  const handleTimerTick = (secondsLeft) => {
    if (session) {
      timeSpentRef.current = Math.max(0, session.durationSeconds - secondsLeft);
    }
  };

  // One-minute warning callback (shows once per session interval)
  const handleOneMinuteWarning = () => {
    if (!session || session.warningShown) return;
    const updated = {
      ...session,
      warningShown: true,
    };
    setSession(updated);
    saveActiveTestSession(updated);
    setShowOneMinWarning(true);
  };

  // Submission handler
  const handleCompleteSubmission = () => {
    if (hasSubmittedRef.current || isSubmitting) return;
    hasSubmittedRef.current = true;
    setIsSubmitting(true);

    try {
      const finalResult = submitTestSession(timeSpentRef.current);
      setShowConfirmModal(false);
      toast.success("Assessment submitted successfully!");
      if (finalResult && finalResult.id) {
        navigate(`/aptitude/result/${finalResult.id}`);
      } else {
        navigate("/aptitude/history");
      }
    } catch (err) {
      console.error("Test submission error:", err);
      toast.error("Failed to submit test. Please retry.");
      setIsSubmitting(false);
      hasSubmittedRef.current = false;
    }
  };

  // Auto-submit on timer expiry
  const handleTimerExpire = () => {
    if (hasSubmittedRef.current) return;
    toast.error("Time expired! Submitting test automatically...");
    handleCompleteSubmission();
  };

  // Current question data
  const currentQuestion = session?.questions?.[currentIndex] || null;

  // Select an option
  const handleSelectOption = (optionId) => {
    if (!currentQuestion) return;
    const updated = {
      ...answers,
      [currentQuestion.id]: optionId,
    };
    setAnswers(updated);
    saveTestAnswer(currentQuestion.id, optionId);
  };

  // Clear response
  const handleClearResponse = () => {
    if (!currentQuestion) return;
    const updated = { ...answers };
    delete updated[currentQuestion.id];
    setAnswers(updated);
    clearTestAnswer(currentQuestion.id);
  };

  // Toggle mark for review
  const handleToggleMark = () => {
    if (!currentQuestion) return;
    const isMarked = !!markedForReview[currentQuestion.id];
    const updated = {
      ...markedForReview,
      [currentQuestion.id]: !isMarked,
    };
    setMarkedForReview(updated);
    toggleMarkForReview(currentQuestion.id);
  };

  // Question navigation
  const handleJumpToIndex = (idx) => {
    setCurrentIndex(idx);
    saveTestCurrentIndex(idx);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      handleJumpToIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (session && currentIndex < session.questions.length - 1) {
      handleJumpToIndex(currentIndex + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Test Configuration Screen when no session active */}
        {!session && (
          <div className="max-w-2xl mx-auto space-y-6">
            <Link
              to="/aptitude"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-black transition"
            >
              <ChevronLeft size={16} />
              Back to Aptitude Dashboard
            </Link>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Timed Assessment Mode
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  Configure Aptitude Test
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Simulate campus placement recruitment assessments with a real countdown timer, interactive question palette, review tags, and detailed scoring.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Category Coverage
                  </label>
                  <select
                    value={testCategory}
                    onChange={(e) => setTestCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white transition"
                  >
                    <option value="all">Full Syllabus (Mixed Quant, Logical, Verbal)</option>
                    <option value="quantitative">Quantitative Aptitude</option>
                    <option value="logical">Logical Reasoning</option>
                    <option value="verbal">Verbal Ability</option>
                  </select>
                </div>

                {/* Difficulty Selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Difficulty Level
                  </label>
                  <select
                    value={testDifficulty}
                    onChange={(e) => setTestDifficulty(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white transition"
                  >
                    <option value="all">Mixed Difficulties (Standard Placement Test)</option>
                    <option value="easy">Easy Level</option>
                    <option value="medium">Medium Level</option>
                    <option value="hard">Hard Level</option>
                  </select>
                </div>

                {/* Test Presets (Count + Duration) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Test Length & Duration Preset
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {TEST_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSelectedPreset(preset)}
                        className={`p-4 rounded-xl border text-left transition ${
                          selectedPreset.id === preset.id
                            ? "border-black bg-gray-50 ring-1 ring-black"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <p className="text-xs font-bold text-gray-900">
                          {preset.label}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                          <Clock size={12} />
                          {preset.minutes} Minutes
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleStartTest}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-black text-white hover:bg-gray-900 text-xs font-semibold transition active:scale-95 shadow-xs"
                >
                  Start Assessment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* In-Progress Timed Assessment Layout */}
        {session && currentQuestion && (
          <div className="space-y-6">
            {/* Top Bar with Title, Countdown Timer, and Submit Button */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {session.title}
                </h2>
                <p className="text-xs text-gray-500">
                  Question {currentIndex + 1} of {session.questions.length} • Correct answers remain confidential until submission
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                {/* Timer */}
                <AptitudeTimer
                  startedAt={session.startedAt}
                  totalDurationSeconds={session.durationSeconds}
                  initialSeconds={session.durationSeconds}
                  onExpire={handleTimerExpire}
                  onTick={handleTimerTick}
                  onOneMinuteWarning={handleOneMinuteWarning}
                  isFinished={isSubmitting || hasSubmittedRef.current}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  className="px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-900 text-xs font-semibold transition active:scale-95 shadow-xs"
                >
                  Finish Test
                </button>
              </div>
            </div>

            {/* One-Minute Warning Banner */}
            {showOneMinWarning && (
              <TimerWarningBanner
                message="1 minute left. Finish your answer before time runs out."
                onDismiss={() => setShowOneMinWarning(false)}
              />
            )}

            {/* Split Grid: Question on Left, Palette on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Question & Actions (2 cols on desktop) */}
              <div className="lg:col-span-2 space-y-4">
                <AptitudeQuestion
                  question={currentQuestion}
                  questionNumber={currentIndex + 1}
                  totalQuestions={session.questions.length}
                  selectedOptionId={answers[currentQuestion.id] || null}
                  onSelectOption={handleSelectOption}
                  showResult={false}
                />

                {/* Question Control Actions */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleToggleMark}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
                        markedForReview[currentQuestion.id]
                          ? "bg-amber-50 border-amber-300 text-amber-800"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Bookmark size={13} className={markedForReview[currentQuestion.id] ? "fill-amber-600" : ""} />
                      {markedForReview[currentQuestion.id] ? "Marked for Review" : "Mark for Review"}
                    </button>

                    <button
                      type="button"
                      onClick={handleClearResponse}
                      disabled={!answers[currentQuestion.id]}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <RotateCcw size={13} />
                      Clear Response
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                      className="px-3.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <ChevronLeft size={14} />
                      Previous
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={currentIndex === session.questions.length - 1}
                      className="px-3.5 py-1.5 rounded-lg bg-black text-white hover:bg-gray-900 disabled:opacity-40 text-xs font-semibold flex items-center gap-1 transition shadow-xs"
                    >
                      Next
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Question Navigation Palette (1 col on desktop) */}
              <div className="space-y-4">
                <QuestionPalette
                  questions={session.questions}
                  currentIndex={currentIndex}
                  answers={answers}
                  markedForReview={markedForReview}
                  onSelectQuestion={handleJumpToIndex}
                />
              </div>
            </div>
          </div>
        )}

        {/* Submission Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Confirm Test Submission
                  </h3>
                  <p className="text-xs text-gray-500">
                    Are you ready to submit your assessment?
                  </p>
                </div>
              </div>

              {/* Quick Summary Counts */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <div>
                  <p className="text-base font-bold text-gray-900">
                    {Object.keys(answers).length}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase font-semibold">Answered</p>
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">
                    {session.questions.length - Object.keys(answers).length}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase font-semibold">Unanswered</p>
                </div>
                <div>
                  <p className="text-base font-bold text-amber-700">
                    {Object.values(markedForReview).filter(Boolean).length}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase font-semibold">Marked</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Once submitted, answers cannot be edited and your final scorecard, accuracy, and detailed solutions will be generated.
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold transition"
                >
                  Continue Test
                </button>
                <button
                  type="button"
                  onClick={handleCompleteSubmission}
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-black text-white hover:bg-gray-900 text-xs font-semibold transition active:scale-95 shadow-xs"
                >
                  {isSubmitting ? "Grading..." : "Submit Test"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AptitudeTest;
