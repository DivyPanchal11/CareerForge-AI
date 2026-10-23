import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  Sparkles,
  HelpCircle,
  RefreshCw,
  LogOut,
} from "lucide-react";

import Navbar from "../components/auth/Navbar";
import InterviewTimer from "../components/interview/InterviewTimer";
import QuestionCard from "../components/interview/QuestionCard";
import AnswerEditor from "../components/interview/AnswerEditor";
import QuestionNavigation from "../components/interview/QuestionNavigation";
import EvaluationFeedbackCard from "../components/interview/EvaluationFeedbackCard";
import SessionSummaryCard from "../components/interview/SessionSummaryCard";
import QuestionReviewList from "../components/interview/QuestionReviewList";
import TimerWarningBanner from "../components/common/TimerWarningBanner";
import {
  INTERVIEW_QUESTION_DURATION_SECONDS,
  STORAGE_KEYS,
} from "../constants/interviewConstants";

import {
  getActiveSession,
  saveDraftAnswer,
  saveQuestionEvaluation,
  saveCurrentQuestionIndex,
  evaluateAIAnswer,
  summarizeAISession,
  completeInterviewSession,
  abortCurrentSession,
  resolveSessionRole,
  updateQuestionTimer,
} from "../services/interviewService";

function InterviewSession() {
  const navigate = useNavigate();

  const [session, setSession] = useState(() => getActiveSession());
  const [currentIdx, setCurrentIdx] = useState(() => {
    const active = getActiveSession();
    return active?.currentQuestionIndex || 0;
  });
  const [answers, setAnswers] = useState(() => {
    const active = getActiveSession();
    return active?.answers || {};
  });
  const [evaluations, setEvaluations] = useState(() => {
    const active = getActiveSession();
    return active?.evaluations || {};
  });

  // Flow states: 'answering' | 'evaluating' | 'feedback' | 'summarizing' | 'summary' | 'error'
  const [sessionState, setSessionState] = useState(() => {
    const active = getActiveSession();
    if (!active?.questions || active.questions.length === 0) return "answering";
    const currentQ = active.questions[active.currentQuestionIndex || 0];
    if (active.evaluations && currentQ && active.evaluations[currentQ.id]) {
      return "feedback";
    }
    return "answering";
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isQuotaError, setIsQuotaError] = useState(false);
  const [finalSummary, setFinalSummary] = useState(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showOneMinWarning, setShowOneMinWarning] = useState(false);

  // Time tracking
  const startTimeRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
    if (!session || !session.questions || session.questions.length === 0) {
      toast.error("No active interview session found. Please configure a session.");
      navigate("/interviews", { replace: true });
      return;
    }

    // Ensure session.questionTimers structure exists for persistence
    if (!session.questionTimers) {
      const initialTimers = {};
      session.questions.forEach((q, idx) => {
        initialTimers[q.id] = {
          startedAt: idx === currentIdx ? Date.now() : null,
          accumulatedElapsed: 0,
          warningShown: false,
          isExpired: false,
        };
      });
      const updated = { ...session, questionTimers: initialTimers };
      setSession(updated);
      try {
        localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(updated));
      } catch (_) {}
    } else {
      const currentQ = session.questions[currentIdx];
      if (currentQ) {
        const timer = session.questionTimers[currentQ.id];
        if (!timer) {
          updateQuestionTimer(currentQ.id, {
            startedAt: Date.now(),
            accumulatedElapsed: 0,
            warningShown: false,
            isExpired: false,
          });
          setSession(getActiveSession());
        } else if (timer.startedAt === null && !timer.isExpired) {
          updateQuestionTimer(currentQ.id, { startedAt: Date.now() });
          setSession(getActiveSession());
        }
      }
    }
  }, [session, currentIdx, navigate]);

  // Handle answer text changes
  const handleAnswerChange = (text) => {
    if (!session) return;
    const currentQ = session.questions[currentIdx];
    if (!currentQ) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: text,
    }));

    // Auto-save to localStorage
    saveDraftAnswer(currentQ.id, text);
  };

  // Submit single answer for AI evaluation
  const handleSubmitAnswer = async () => {
    if (!session) return;
    const currentQ = session.questions[currentIdx];
    if (!currentQ) return;

    const answerText = (answers[currentQ.id] || "").trim();
    if (!answerText) {
      toast.error("Please provide an answer before submitting.");
      return;
    }

    setSessionState("evaluating");
    setErrorMessage("");
    setIsQuotaError(false);

    try {
      const res = await evaluateAIAnswer({
        targetRole: resolveSessionRole(session),
        experienceLevel: session.config.experienceLevel,
        interviewType: session.config.interviewType,
        jobDescription: session.config.jobDescription,
        focusSkills: session.config.skills || session.config.focusSkills || "",
        question: currentQ,
        answer: answerText,
      });

      if (res.success && res.evaluation) {
        setEvaluations((prev) => ({
          ...prev,
          [currentQ.id]: res.evaluation,
        }));
        saveQuestionEvaluation(currentQ.id, res.evaluation);
        setSessionState("feedback");
        toast.success("Answer evaluated!");
        window.scrollTo({ top: 100, behavior: "smooth" });
        return;
      }

      // Check if quota limit was reached
      if (res.isQuotaExhausted) {
        setIsQuotaError(true);
        setErrorMessage(res.message);
      } else {
        setErrorMessage(res.message || "Failed to evaluate answer. Please try again.");
      }
      setSessionState("error");
    } catch (err) {
      console.error("Evaluation error:", err);
      setErrorMessage("Network or provider error while evaluating answer.");
      setSessionState("error");
    }
  };

  // One-minute warning handler - fires only once per question interval
  const handleOneMinuteWarning = () => {
    if (!session) return;
    const currentQ = session.questions[currentIdx];
    if (!currentQ) return;
    const t = session.questionTimers?.[currentQ.id];
    if (t?.warningShown) return;

    updateQuestionTimer(currentQ.id, { warningShown: true });
    setShowOneMinWarning(true);
    setSession(getActiveSession());
  };

  // Question expiration handler
  const handleQuestionExpire = () => {
    if (!session) return;
    const currentQ = session.questions[currentIdx];
    if (!currentQ) return;

    updateQuestionTimer(currentQ.id, {
      isExpired: true,
      startedAt: null,
      accumulatedElapsed: INTERVIEW_QUESTION_DURATION_SECONDS,
    });
    setSession(getActiveSession());

    const currentAns = (answers[currentQ.id] || "").trim();
    if (currentAns) {
      toast("5 minutes expired! Automatically submitting your response...", { icon: "⏳" });
      handleSubmitAnswer();
    } else {
      toast.error("Time expired for this question (5 minutes limit reached).");
    }
  };

  // Skip current question
  const handleSkipQuestion = () => {
    if (!session) return;
    const isLast = currentIdx === session.questions.length - 1;
    if (isLast) {
      handlePromptFinish();
    } else {
      handleMoveToQuestion(currentIdx + 1);
    }
  };

  // Move to another question - resets 5-min timer for different question while preserving answers
  const handleMoveToQuestion = (index) => {
    if (!session || index < 0 || index >= session.questions.length) return;
    if (index === currentIdx) return;

    // 1. Pause and store elapsed time of current question
    const currentQ = session.questions[currentIdx];
    if (currentQ) {
      const t = session.questionTimers?.[currentQ.id] || {};
      const now = Date.now();
      const additional = t.startedAt ? Math.max(0, Math.floor((now - t.startedAt) / 1000)) : 0;
      updateQuestionTimer(currentQ.id, {
        startedAt: null,
        accumulatedElapsed: (t.accumulatedElapsed || 0) + additional,
      });
    }

    // 2. Hide active warning banner when leaving question
    setShowOneMinWarning(false);

    // 3. Start timer for target question (fresh 5 minutes if new)
    const targetQ = session.questions[index];
    if (targetQ) {
      const targetTimer = session.questionTimers?.[targetQ.id];
      if (!targetTimer) {
        updateQuestionTimer(targetQ.id, {
          startedAt: Date.now(),
          accumulatedElapsed: 0,
          warningShown: false,
          isExpired: false,
        });
      } else if (!targetTimer.isExpired) {
        updateQuestionTimer(targetQ.id, {
          startedAt: Date.now(),
        });
      }
    }

    // 4. Update index and sync state
    setCurrentIdx(index);
    saveCurrentQuestionIndex(index);
    const updatedSession = getActiveSession();
    if (updatedSession) {
      setSession(updatedSession);
    }

    if (evaluations[targetQ.id]) {
      setSessionState("feedback");
    } else {
      setSessionState("answering");
    }
    setErrorMessage("");
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  // Retry / revise current question with fresh 5-minute timer
  const handleRetryQuestion = () => {
    const currentQ = session?.questions?.[currentIdx];
    if (session && currentQ) {
      updateQuestionTimer(currentQ.id, {
        startedAt: Date.now(),
        accumulatedElapsed: 0,
        warningShown: false,
        isExpired: false,
      });
      setShowOneMinWarning(false);
      setSession(getActiveSession());
    }
    setSessionState("answering");
    setErrorMessage("");
  };

  // Prompt finish confirmation
  const handlePromptFinish = () => {
    setShowFinishModal(true);
  };

  // Continue to next question or trigger session summary
  const handleContinue = () => {
    if (!session) return;
    const isLast = currentIdx === session.questions.length - 1;
    if (isLast) {
      handlePromptFinish();
    } else {
      handleMoveToQuestion(currentIdx + 1);
    }
  };

  // Complete session and generate AI summary
  const handleFinishSession = async () => {
    setShowFinishModal(false);
    if (!session) return;
    setSessionState("summarizing");
    window.scrollTo({ top: 0, behavior: "smooth" });

    const timeSpentSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);

    // Prepare evaluation list for questions answered
    const evaluationList = session.questions
      .filter((q) => evaluations[q.id])
      .map((q) => ({
        question: q,
        ...evaluations[q.id],
      }));

    const sessionRole = resolveSessionRole(session);

    // If no questions were evaluated with AI, build standard synthesis with 0 score
    if (evaluationList.length === 0) {
      const defaultSummary = {
        overallScore: 0,
        aggregateRubricScores: { accuracy: 0, relevance: 0, completeness: 0, clarity: 0, roleCompetence: 0 },
        summary: `Session was completed for ${sessionRole} without submitting any answers for evaluation. To receive rubric scoring and AI feedback, provide answers to the questions.`,
        keyStrengths: ["Initiated mock interview session"],
        improvementAreas: ["Submit answers for each question to receive fair AI rubric evaluation"],
        topicsToPractice: [sessionRole, "Interview Foundations"],
      };

      const result = completeInterviewSession(defaultSummary, timeSpentSeconds);
      setFinalSummary(result);
      setSessionState("summary");
      return;
    }

    try {
      const res = await summarizeAISession({
        targetRole: sessionRole,
        experienceLevel: session.config.experienceLevel,
        interviewType: session.config.interviewType,
        jobDescription: session.config.jobDescription,
        evaluations: evaluationList,
      });

      let summaryData;
      if (res.success && res.summary) {
        summaryData = res.summary;
      } else {
        // Fallback aggregation if AI summarizer fails
        const avgScore = Math.round(
          evaluationList.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / evaluationList.length
        );
        summaryData = {
          overallScore: avgScore,
          aggregateRubricScores: { accuracy: avgScore, relevance: avgScore, completeness: avgScore, clarity: avgScore, roleCompetence: avgScore },
          summary: `Candidate completed ${evaluationList.length} interview questions with an average score of ${avgScore}%. Consistent practice and detailed articulation are recommended.`,
          keyStrengths: ["Clear communication", "Structured answering style"],
          improvementAreas: ["Elaborate with deeper metrics and technical edge cases"],
          topicsToPractice: [sessionRole, "System Architecture", "Behavioral Scenarios"],
        };
      }

      const result = completeInterviewSession(summaryData, timeSpentSeconds);
      setFinalSummary(result);
      setSessionState("summary");
      toast.success("Interview completed! Session debrief ready.");
    } catch (err) {
      console.error("Summarize error:", err);
      // Fallback
      const avgScore = 70;
      const fallbackSummary = {
        overallScore: avgScore,
        aggregateRubricScores: { accuracy: 70, relevance: 70, depth: 70, clarity: 70, roleCompetence: 70 },
        summary: `Practice session completed for ${session.config.targetRole}.`,
        keyStrengths: ["Participated in mock session"],
        improvementAreas: ["Continue practicing structured responses"],
        topicsToPractice: [session.config.targetRole],
      };
      const result = completeInterviewSession(fallbackSummary, timeSpentSeconds);
      setFinalSummary(result);
      setSessionState("summary");
    }
  };

  // Exit without saving
  const handleConfirmExit = () => {
    abortCurrentSession();
    toast("Interview session discarded.");
    navigate("/interviews", { replace: true });
  };

  if (!session || !session.questions || session.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center p-6 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-sm">
          <div className="w-8 h-8 border-3 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-gray-600">
            Loading interview session...
          </p>
        </div>
      </div>
    );
  }

  const currentQ = session.questions[currentIdx];
  const currentTimer = session?.questionTimers?.[currentQ?.id] || null;
  const currentAnswer = answers[currentQ?.id] || "";
  const currentEvaluation = evaluations[currentQ?.id];
  const isLastQuestion = currentIdx === session.questions.length - 1;

  // Render Session Summary Screen
  if (sessionState === "summary" && finalSummary) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <SessionSummaryCard
            summary={finalSummary}
            config={finalSummary.config}
            totalQuestions={finalSummary.totalQuestions}
            answeredCount={finalSummary.answeredCount}
            onRestartSameRole={() => {
              navigate("/interviews");
            }}
            onNewConfig={() => {
              navigate("/interviews");
            }}
            onViewDashboard={() => {
              navigate("/interviews");
            }}
          />

          {/* Question-by-Question Accordion Review */}
          <QuestionReviewList questionReviews={finalSummary.questionReviews} />
        </main>
      </div>
    );
  }

  // Render Summarizing Loading Screen
  if (sessionState === "summarizing") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-5 max-w-md w-full">
            <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center mx-auto shadow-md">
              <Sparkles size={28} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Compiling Session Debrief
              </h2>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Google Gemini AI is synthesizing your answers across accuracy, depth, clarity, and role competencies...
              </p>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-black h-full rounded-full animate-pulse w-3/4" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Top Session Bar: Back button, Role info, Timer, Exit */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowExitModal(true)}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 transition cursor-pointer"
              title="Exit session"
            >
              <ArrowLeft size={16} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-900">
                  {resolveSessionRole(session)}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-gray-100 text-gray-700 capitalize">
                  {session.config?.interviewType}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                {session.config?.experienceLevel} level • {session.questions.length} questions • 5 min per question
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <InterviewTimer
              key={currentQ?.id}
              durationSeconds={INTERVIEW_QUESTION_DURATION_SECONDS}
              startedAt={currentTimer?.startedAt}
              accumulatedElapsed={currentTimer?.accumulatedElapsed || 0}
              isCompleted={Boolean(currentTimer?.isExpired || evaluations[currentQ?.id] || sessionState === "summary")}
              isPaused={sessionState === "evaluating" || sessionState === "summarizing"}
              onExpire={handleQuestionExpire}
              onOneMinuteWarning={handleOneMinuteWarning}
            />

            <button
              type="button"
              onClick={handlePromptFinish}
              className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer focus-visible:ring-2 focus-visible:ring-black"
            >
              Finish Early
            </button>
          </div>
        </div>

        {/* Progress Bar & Jump pills */}
        <QuestionNavigation
          currentIndex={currentIdx}
          totalQuestions={session.questions.length}
          questions={session.questions}
          answers={answers}
          onSelectQuestion={handleMoveToQuestion}
          onPrevious={() => handleMoveToQuestion(currentIdx - 1)}
          onNext={() => handleMoveToQuestion(currentIdx + 1)}
          onFinish={handlePromptFinish}
          isSubmitting={sessionState === "evaluating"}
        />

        {/* Error Banner (if any) */}
        {sessionState === "error" && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-gray-900 block">
                  {isQuotaError ? "Free-Tier Rate Limit Reached" : "Evaluation Notice"}
                </span>
                <p className="text-xs text-gray-700 mt-0.5">
                  {errorMessage}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleSubmitAnswer}
                className="px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-900 transition cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw size={12} />
                <span>Retry Evaluation</span>
              </button>
              <button
                type="button"
                onClick={handleSkipQuestion}
                className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-white transition cursor-pointer"
              >
                Skip Question
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="space-y-5">
          {/* One-Minute Warning Banner */}
          {showOneMinWarning && (
            <TimerWarningBanner
              message="1 minute left. Finish your answer before time runs out."
              onDismiss={() => setShowOneMinWarning(false)}
            />
          )}

          {/* Question Expired Status Banner */}
          {currentTimer?.isExpired && !evaluations[currentQ?.id] && sessionState === "answering" && (
            <div
              role="status"
              aria-live="polite"
              className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <AlertCircle size={18} className="text-red-600 shrink-0" aria-hidden="true" />
                <span className="text-xs font-semibold leading-relaxed">
                  Time has expired for this question (5 minutes limit reached). You can skip to the next question or submit your answers.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleSkipQuestion}
                  className="px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-900 transition cursor-pointer"
                >
                  {isLastQuestion ? "Finish Session" : "Next Question"}
                </button>
              </div>
            </div>
          )}

          {/* 1. Question Card */}
          <QuestionCard
            question={currentQ}
            questionNumber={currentIdx + 1}
            totalQuestions={session.questions.length}
            targetRole={resolveSessionRole(session)}
            experienceLevel={session.config?.experienceLevel}
            interviewType={session.config?.interviewType}
            isAnswered={Boolean(answers[currentQ?.id]?.trim())}
          />

          {/* 2. Evaluating State Loader */}
          {sessionState === "evaluating" && (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs">
                <Loader2 size={24} className="animate-spin" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Evaluating Your Response with Google Gemini AI
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-md">
                  Analyzing claims for accuracy, relevance, reasoning depth, clarity, and role competence...
                </p>
              </div>
              <div className="w-48 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-black h-full rounded-full animate-pulse w-2/3" />
              </div>
            </div>
          )}

          {/* 3. Feedback Card (when evaluated) */}
          {sessionState === "feedback" && currentEvaluation && (
            <EvaluationFeedbackCard
              evaluation={currentEvaluation}
              questionNumber={currentIdx + 1}
              totalQuestions={session.questions.length}
              onContinue={handleContinue}
              onRetry={handleRetryQuestion}
              onEndSession={handleFinishSession}
              isLastQuestion={isLastQuestion}
            />
          )}

          {/* 4. Answer Editor (when answering or revising) */}
          {sessionState === "answering" && (
            <AnswerEditor
              answer={currentAnswer}
              onChange={handleAnswerChange}
              onSubmit={handleSubmitAnswer}
              onSkip={handleSkipQuestion}
              disabled={Boolean(currentTimer?.isExpired || sessionState === "evaluating")}
              isSubmitting={sessionState === "evaluating"}
            />
          )}
        </div>
      </main>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-200 space-y-4">
            <h3 id="exit-modal-title" className="text-base font-bold text-gray-900">
              Exit Practice Session?
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to exit? Your answers for this active session will be discarded.
            </p>
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer focus-visible:ring-2 focus-visible:ring-black"
              >
                Stay & Continue
              </button>
              <button
                type="button"
                onClick={handleConfirmExit}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition cursor-pointer focus-visible:ring-2 focus-visible:ring-black"
              >
                Exit Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Finish Session Confirmation Modal */}
      {showFinishModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="finish-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 id="finish-modal-title" className="text-base font-bold text-gray-900">
                  Finish Interview Session?
                </h3>
                <p className="text-xs text-gray-500">
                  {session.config?.targetRole} • {session.questions.length} total questions
                </p>
              </div>
            </div>

            {/* Answered vs Unanswered summary */}
            {(() => {
              const answeredCount = session.questions.filter((q) => Boolean(answers[q.id]?.trim())).length;
              const unansweredCount = session.questions.length - answeredCount;

              return (
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Questions answered:</span>
                      <span className="font-bold text-gray-900">
                        {answeredCount} of {session.questions.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Unanswered questions:</span>
                      <span className={`font-bold ${unansweredCount > 0 ? "text-amber-700" : "text-green-700"}`}>
                        {unansweredCount}
                      </span>
                    </div>
                  </div>

                  {unansweredCount > 0 ? (
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertCircle size={14} className="text-amber-700 shrink-0" />
                        <span>Unanswered Question Impact</span>
                      </div>
                      <p>
                        You have <strong>{unansweredCount} unanswered questions</strong>. Finishing now will score unanswered questions as <strong>0 points</strong> and exclude them from rubric analysis.
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-600 leading-relaxed">
                      You have provided answers for all {session.questions.length} questions. Finishing now will generate your comprehensive AI evaluation and feedback debrief.
                    </p>
                  )}
                </div>
              );
            })()}

            <div className="pt-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowFinishModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer focus-visible:ring-2 focus-visible:ring-black"
              >
                Continue Answering
              </button>
              <button
                type="button"
                onClick={handleFinishSession}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-gray-900 transition cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-black"
              >
                Finish Session & View Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InterviewSession;
