import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Sparkles,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Coins,
  Clock,
  Check,
  X,
  Info,
} from "lucide-react";

import Navbar from "../components/auth/Navbar";
import AptitudeQuestion from "../components/aptitude/AptitudeQuestion";
import AnswerExplanation from "../components/aptitude/AnswerExplanation";
import TestSummary from "../components/aptitude/TestSummary";
import IncorrectQuestions from "../components/aptitude/IncorrectQuestions";

import {
  ALL_TOPICS,
  getTopicById,
  QUANTITATIVE_TOPICS,
  LOGICAL_TOPICS,
  VERBAL_TOPICS,
} from "../data/aptitudeTopics";
import {
  getFilteredQuestions,
  completePracticeSession,
  fetchAptitudeAIConfig,
  fetchUserCredits,
  generateAptitudeAIQuestions,
  submitAptitudeAISession,
} from "../services/aptitudeService";
import { saveAptitudeResult } from "../utils/aptitudeStorage";

/**
 * Formats ISO UTC reset string into user's local timezone.
 */
function formatLocalResetTime(isoString) {
  if (!isoString) return "Every day at 00:00 UTC";
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(d);
  } catch (_) {
    return new Date(isoString).toLocaleString();
  }
}

function AptitudePractice() {
  const { topicId: routeTopicId } = useParams();
  const navigate = useNavigate();

  // Configuration state
  const initialTopic = routeTopicId ? getTopicById(routeTopicId) : ALL_TOPICS[0];
  const [selectedCategory, setSelectedCategory] = useState(initialTopic?.category || "quantitative");
  const [selectedTopicId, setSelectedTopicId] = useState(initialTopic?.id || "percentages");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedCount, setSelectedCount] = useState(5);

  // AI Configuration & Credit State
  const [aiConfig, setAiConfig] = useState(null);
  const [credits, setCredits] = useState(null);
  const [isConfigLoading, setIsConfigLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmittingAI, setIsSubmittingAI] = useState(false);
  const [isAiSession, setIsAiSession] = useState(false);
  const [aiSessionId, setAiSessionId] = useState(null);

  // Modals
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showInsufficientModal, setShowInsufficientModal] = useState(false);

  // Practice session state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sessionAnswers, setSessionAnswers] = useState({});
  const [startTime, setStartTime] = useState(null);

  // Completed session result
  const [practiceResult, setPracticeResult] = useState(null);

  // Fetch AI Config and User Credits on Mount
  useEffect(() => {
    let mounted = true;
    async function loadConfigAndCredits() {
      try {
        const [config, creditData] = await Promise.all([
          fetchAptitudeAIConfig(),
          fetchUserCredits(),
        ]);
        if (mounted) {
          setAiConfig(config);
          if (creditData?.success && creditData.credits) {
            setCredits(creditData.credits);
          } else if (config?.userCredits) {
            setCredits(config.userCredits);
          }
        }
      } catch (err) {
        console.warn("Failed to retrieve AI configuration & credits:", err);
      } finally {
        if (mounted) setIsConfigLoading(false);
      }
    }
    loadConfigAndCredits();
    return () => {
      mounted = false;
    };
  }, []);

  // Available topics for selected category
  const availableTopics = useMemo(() => {
    if (selectedCategory === "quantitative") return QUANTITATIVE_TOPICS;
    if (selectedCategory === "logical") return LOGICAL_TOPICS;
    if (selectedCategory === "verbal") return VERBAL_TOPICS;
    if (selectedCategory === "mixed") {
      return [{ id: "placement-all", name: "Comprehensive Placement Set (All Topics)", category: "mixed" }];
    }
    return ALL_TOPICS;
  }, [selectedCategory]);

  // Keep topic synced when category changes
  useEffect(() => {
    if (!availableTopics.some((t) => t.id === selectedTopicId)) {
      setSelectedTopicId(availableTopics[0]?.id || "percentages");
    }
  }, [selectedCategory, availableTopics, selectedTopicId]);

  // If route topicId changes
  useEffect(() => {
    if (routeTopicId) {
      const t = getTopicById(routeTopicId);
      if (t) {
        setSelectedCategory(t.category);
        setSelectedTopicId(t.id);
      }
    }
  }, [routeTopicId]);

  // Credit calculation
  const costPerQuestion = aiConfig?.creditPricing?.costPerQuestion || credits?.costPerQuestion || 2;
  const requiredCredits = selectedCount * costPerQuestion;
  const nextResetLocal = formatLocalResetTime(credits?.nextReset || aiConfig?.creditPricing?.nextReset);

  // Start Standard Practice Handler (Local Question Pool)
  const handleStartStandardPractice = () => {
    const qList = getFilteredQuestions({
      category: selectedCategory === "mixed" ? "all" : selectedCategory,
      topic: selectedCategory === "mixed" ? "all" : selectedTopicId,
      difficulty: selectedDifficulty,
      limit: selectedCount,
    });

    if (!qList || qList.length === 0) {
      toast.error("No questions found matching this configuration. Try selecting 'All Difficulties'.");
      return;
    }

    setQuestions(qList);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setSessionAnswers({});
    setPracticeResult(null);
    setIsAiSession(false);
    setAiSessionId(null);
    setStartTime(Date.now());
    setIsSessionActive(true);
  };

  // Open confirmation modal or insufficient credit dialog
  const handleOpenGenerateModal = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in to generate questions using your weekly credits.");
      navigate("/login");
      return;
    }

    if (!aiConfig?.aiEnabled) {
      toast.error(aiConfig?.reason || "AI question generation is currently disabled by administrator.");
      return;
    }

    if (credits && credits.balance < requiredCredits) {
      setShowInsufficientModal(true);
      return;
    }

    setShowConfirmModal(true);
  };

  // Start AI Question Generation Handler (Google Gemini Free Tier + Credits)
  const handleGenerateAIQuestions = async () => {
    if (isGenerating) return;

    setShowConfirmModal(false);

    const isMixed = selectedCategory === "mixed";
    const currentTopicObj = getTopicById(selectedTopicId);
    const topicDisplayName = isMixed
      ? "Comprehensive Placement Set"
      : (currentTopicObj ? currentTopicObj.name : selectedTopicId);

    const categoryMap = {
      quantitative: "Quantitative Aptitude",
      logical: "Logical Reasoning",
      verbal: "Verbal Ability",
      mixed: "Mixed",
    };
    const categoryDisplayName = categoryMap[selectedCategory] || "Quantitative Aptitude";

    const countToGenerate = Math.min(Math.max(1, Number(selectedCount) || 5), 10);
    const difficultyToGenerate =
      selectedDifficulty === "all"
        ? "Medium"
        : selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1);

    const idempotencyKey = `idem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    setIsGenerating(true);
    const toastId = toast.loading(
      `Generating ${countToGenerate} questions with AI (${requiredCredits} credits)...`
    );

    try {
      const data = await generateAptitudeAIQuestions({
        category: categoryDisplayName,
        topic: topicDisplayName,
        difficulty: difficultyToGenerate,
        count: countToGenerate,
        idempotencyKey,
      });

      if (!data.success || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error(data.message || "Failed to generate valid questions.");
      }

      // Format questions for display (Note: correctOptionId and explanation are hidden by server!)
      const formattedAIQuestions = data.questions.map((q) => ({
        id: q.id,
        category: q.category,
        topic: selectedTopicId,
        topicName: q.topic || topicDisplayName,
        difficulty: q.difficulty,
        question: q.question,
        options: q.options,
      }));

      setQuestions(formattedAIQuestions);
      setCurrentIndex(0);
      setSelectedOptionId(null);
      setIsSubmitted(false);
      setSessionAnswers({});
      setPracticeResult(null);
      setIsAiSession(true);
      setAiSessionId(data.sessionId);
      setStartTime(Date.now());
      setIsSessionActive(true);

      // Update remaining credits locally from server response
      if (data.credits) {
        setCredits((prev) => ({
          ...prev,
          balance: data.credits.remaining,
          weeklyAllowance: data.credits.weeklyAllowance,
          nextReset: data.credits.nextReset,
        }));
      }

      toast.success(
        `Generated ${formattedAIQuestions.length} verified questions! (${data.credits?.spent || requiredCredits} credits spent)`,
        { id: toastId }
      );
    } catch (error) {
      console.error("AI Generation Error:", error);
      if (error.response?.status === 402) {
        setShowInsufficientModal(true);
      }
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Unable to generate questions with AI right now. Please try again or use the question bank.";
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const currentQuestion = questions[currentIndex];

  // Option selection
  const handleSelectOption = (optionId) => {
    if (isSubmitted && !isAiSession) return; // Prevent changing after per-question submit in static mode
    setSelectedOptionId(optionId);
    setSessionAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  // Submit single question in Standard Mode
  const handleStandardSubmitAnswer = () => {
    if (!selectedOptionId) {
      toast.error("Please choose an answer option before submitting.");
      return;
    }

    setIsSubmitted(true);
    if (selectedOptionId === currentQuestion.correctOptionId) {
      toast.success("Correct answer!");
    } else {
      toast.error("Incorrect. Check the explanation below.");
    }
  };

  // Finish / Submit Assessment (Handles both AI server-side grading and Standard local grading)
  const handleFinishSession = async () => {
    const durationSeconds = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
    const activeTopic = getTopicById(selectedTopicId) || { name: "Aptitude Practice" };

    if (isAiSession) {
      // AI Session: Send to backend for trusted evaluation
      setIsSubmittingAI(true);
      const toastId = toast.loading("Evaluating test answers on server...");

      try {
        const response = await submitAptitudeAISession({
          sessionId: aiSessionId,
          answers: sessionAnswers,
          timeSpentSeconds: durationSeconds,
        });

        if (!response.success || !response.result) {
          throw new Error(response.message || "Failed to evaluate answers.");
        }

        const res = response.result;
        const finalResult = {
          id: res.sessionId,
          type: "practice",
          title: `${res.topic || activeTopic.name} (AI Assessment)`,
          topicId: selectedTopicId,
          topicName: res.topic || activeTopic.name,
          category: res.category,
          completedAt: res.submittedAt || new Date().toISOString(),
          score: res.score,
          scorePercentage: res.scorePercentage,
          totalQuestions: res.totalQuestions,
          attempted: res.attempted,
          correct: res.correct,
          incorrect: res.incorrect,
          unanswered: res.unattempted,
          accuracy: res.accuracy,
          timeSpentSeconds: res.timeSpentSeconds,
          evaluatedQuestions: res.questions,
        };

        saveAptitudeResult(finalResult);
        setPracticeResult(finalResult);
        setIsSessionActive(false);
        toast.success(`Scored ${res.score}/${res.totalQuestions} (${res.accuracy}% accuracy)!`, { id: toastId });
      } catch (error) {
        console.error("AI Submission Error:", error);
        toast.error(error.response?.data?.message || "Failed to submit answers. Please retry.", { id: toastId });
      } finally {
        setIsSubmittingAI(false);
      }
    } else {
      // Standard local practice session
      const result = completePracticeSession({
        topicId: selectedTopicId,
        topicName: activeTopic.name,
        category: selectedCategory,
        questions,
        answers: sessionAnswers,
        timeSpentSeconds: durationSeconds,
      });

      setPracticeResult(result);
      setIsSessionActive(false);
      toast.success("Practice session completed!");
    }
  };

  // Navigation between questions
  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedOptionId(sessionAnswers[questions[nextIndex]?.id] || null);
      if (!isAiSession) setIsSubmitted(false);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setSelectedOptionId(sessionAnswers[questions[prevIndex]?.id] || null);
      if (!isAiSession) setIsSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/aptitude/topics"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-black transition"
          >
            <ChevronLeft size={16} />
            Back to Topics
          </Link>

          {isSessionActive && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Are you sure you want to exit this session? Your current progress will be lost.")) {
                  setIsSessionActive(false);
                }
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition"
            >
              Exit Practice
            </button>
          )}
        </div>

        {/* Practice Setup Screen */}
        {!isSessionActive && !practiceResult && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Aptitude Preparation
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  Configure Practice Session
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Generate dynamic questions with Google Gemini Free Tier, or practice with our curated offline question bank.
                </p>
              </div>

              {/* Daily Credits & Reset Status Badge */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs sm:text-right shrink-0">
                <div className="flex items-center gap-1.5 sm:justify-end">
                  <Coins size={15} className="text-amber-500" />
                  <span className="font-bold text-gray-900">
                    {credits ? `${credits.balance} Credits` : "Loading..."}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-gray-600 bg-gray-200/70 px-1.5 py-0.5 rounded">
                    {credits ? `${credits.dailyAllowance || credits.weeklyAllowance}/day` : "100/day"}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Reset: <strong className="text-gray-700">{nextResetLocal}</strong>
                </p>
              </div>
            </div>

            {/* AI Disabled Alert Banner if applicable */}
            {!isConfigLoading && aiConfig && !aiConfig.aiEnabled && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <p className="font-semibold">AI Question Generation Disabled</p>
                  <p className="text-amber-800/90 mt-0.5">
                    {aiConfig.reason || "AI question generation is currently disabled. You can continue practicing with curated questions below."}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-gray-100">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white transition"
                >
                  <option value="quantitative">Quantitative Aptitude</option>
                  <option value="logical">Logical Reasoning</option>
                  <option value="verbal">Verbal Ability</option>
                  <option value="mixed">Mixed (Quant + Logic + Verbal)</option>
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Topic
                </label>
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white transition"
                >
                  {availableTopics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Difficulty Level
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white transition"
                >
                  <option value="all">All Difficulties (Medium Default)</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Question Count (Enforces max 10 for free-tier safeguard) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Number of Questions (Max 10)
                </label>
                <select
                  value={selectedCount}
                  onChange={(e) => setSelectedCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white transition"
                >
                  <option value={3}>3 Questions ({3 * costPerQuestion} Credits)</option>
                  <option value={5}>5 Questions ({5 * costPerQuestion} Credits)</option>
                  <option value={10}>10 Questions ({10 * costPerQuestion} Credits)</option>
                </select>
              </div>
            </div>

            {/* Disclaimer & Action Buttons */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link
                to={`/aptitude/learn/${selectedTopicId}`}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <BookOpen size={14} />
                Review Concepts First
              </Link>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleStartStandardPractice}
                  disabled={isGenerating}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 text-xs font-semibold transition active:scale-95"
                >
                  Practice Question Bank (Free)
                </button>

                <button
                  type="button"
                  onClick={handleOpenGenerateModal}
                  disabled={isGenerating || (aiConfig && !aiConfig.aiEnabled)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-black text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95 shadow-xs"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} className="text-amber-400" />
                      Generate with AI ({requiredCredits} credits)
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 text-center sm:text-right pt-1">
              * Weekly generation cost is {costPerQuestion} credits/question. Credits are reserved and refunded automatically if generation fails.
            </p>
          </div>
        )}

        {/* Active Practice Question Workflow */}
        {isSessionActive && currentQuestion && (
          <div className="space-y-6">
            {/* Mode Banner */}
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                {isAiSession ? (
                  <>
                    <Sparkles size={14} className="text-amber-500" />
                    AI-Generated Placement Assessment ({currentQuestion.topicName || selectedTopicId})
                  </>
                ) : (
                  <>Question Bank Practice ({currentQuestion.topicName || selectedTopicId})</>
                )}
              </span>

              {isAiSession && (
                <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                  Answers evaluated securely on server upon completion
                </span>
              )}
            </div>

            {/* Question card */}
            <AptitudeQuestion
              question={currentQuestion}
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
              selectedOptionId={selectedOptionId}
              onSelectOption={handleSelectOption}
              showResult={!isAiSession && isSubmitted}
              disabled={!isAiSession && isSubmitted}
            />

            {/* Actions Bar */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevQuestion}
                  disabled={currentIndex === 0}
                  className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1 transition"
                >
                  <ChevronLeft size={14} />
                  Previous
                </button>

                <span className="text-xs text-gray-500 font-medium px-2">
                  Question {currentIndex + 1} of {questions.length}
                </span>

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  disabled={currentIndex === questions.length - 1}
                  className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1 transition"
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {/* Standard Offline Mode: Submit Single Question */}
                {!isAiSession && (
                  <>
                    {!isSubmitted ? (
                      <button
                        type="button"
                        onClick={handleStandardSubmitAnswer}
                        disabled={!selectedOptionId}
                        className="px-5 py-2 rounded-xl bg-black text-white hover:bg-gray-900 disabled:opacity-50 text-xs font-semibold transition active:scale-95 shadow-xs"
                      >
                        Check Answer
                      </button>
                    ) : currentIndex < questions.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="px-5 py-2 rounded-xl bg-black text-white hover:bg-gray-900 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-xs"
                      >
                        Next Question
                        <ArrowRight size={14} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleFinishSession}
                        className="px-5 py-2 rounded-xl bg-black text-white hover:bg-gray-900 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-xs"
                      >
                        Finish Practice
                        <CheckCircle2 size={14} />
                      </button>
                    )}
                  </>
                )}

                {/* AI Session Mode: Answer security enforced. User finishes assessment and submits to server */}
                {isAiSession && (
                  <button
                    type="button"
                    onClick={handleFinishSession}
                    disabled={isSubmittingAI}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-black text-white hover:bg-gray-900 disabled:opacity-50 text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95 shadow-xs"
                  >
                    {isSubmittingAI ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Scoring on Server...
                      </>
                    ) : (
                      <>
                        Submit & Evaluate Test
                        <CheckCircle2 size={14} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Explanation box shown once submitted in Standard Mode */}
            {!isAiSession && isSubmitted && (
              <AnswerExplanation
                question={currentQuestion}
                selectedOptionId={selectedOptionId}
              />
            )}
          </div>
        )}

        {/* Completed Practice Summary */}
        {practiceResult && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Assessment Completed
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                  Session Performance Summary
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {isAiSession
                    ? "Evaluated and verified securely by server-side scoring engine."
                    : "Progress updated in your local browser history."}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setPracticeResult(null);
                    setIsSessionActive(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <RotateCcw size={14} />
                  Practice Again
                </button>

                <Link
                  to="/aptitude/test"
                  className="px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-900 text-xs font-semibold transition"
                >
                  Take Timed Mock Test
                </Link>
              </div>
            </div>

            {/* Summary statistics */}
            <TestSummary result={practiceResult} />

            {/* Detailed questions review with server explanations */}
            <IncorrectQuestions evaluatedQuestions={practiceResult.evaluatedQuestions} />
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-5 animate-in fade-in zoom-in-95 duration-150"
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-modal-title"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-50 rounded-xl text-amber-600 border border-amber-200">
                    <Coins size={18} />
                  </div>
                  <div>
                    <h3 id="confirm-modal-title" className="text-base font-bold text-gray-900">
                      Confirm AI Question Set
                    </h3>
                    <p className="text-[11px] text-gray-500">Daily Credit Authorization</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Set specifications */}
              <div className="bg-gray-50 rounded-xl p-3.5 space-y-2 text-xs border border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Category:</span>
                  <span className="font-semibold text-gray-900">
                    {selectedCategory === "mixed"
                      ? "Mixed (Quant + Logic + Verbal)"
                      : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Topic:</span>
                  <span className="font-semibold text-gray-900 truncate max-w-[200px]">
                    {selectedCategory === "mixed"
                      ? "Comprehensive Placement"
                      : (getTopicById(selectedTopicId)?.name || selectedTopicId)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Difficulty:</span>
                  <span className="font-semibold text-gray-900 capitalize">
                    {selectedDifficulty === "all" ? "Medium (Standard)" : selectedDifficulty}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Number of Questions:</span>
                  <span className="font-semibold text-gray-900">{selectedCount} Questions</span>
                </div>
              </div>

              {/* Credit Breakdown */}
              <div className="border border-gray-200 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between items-center text-gray-700">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Coins size={14} className="text-amber-500" /> Generation Cost:
                  </span>
                  <span className="font-bold text-gray-900">
                    {requiredCredits} Credits ({selectedCount} × {costPerQuestion} per Q)
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Current Balance:</span>
                  <span className="font-medium text-gray-800">{credits?.balance ?? 0} Credits</span>
                </div>
                <div className="flex justify-between text-gray-600 pt-2 border-t border-gray-100">
                  <span>Balance After Generation:</span>
                  <span className="font-bold text-emerald-700">
                    {Math.max(0, (credits?.balance ?? 0) - requiredCredits)} Credits
                  </span>
                </div>
              </div>

              {/* Refund and Recovery Notice */}
              <div className="text-[11px] text-gray-600 space-y-1 bg-amber-50/50 border border-amber-200/60 rounded-xl p-3">
                <p className="flex items-center gap-1.5 text-amber-900 font-semibold">
                  <ShieldCheck size={14} className="text-amber-600 shrink-0" />
                  Two-Phase Safe Reservation
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Credits are reserved atomically before generation and only deducted after questions pass server-side accuracy verification. Failed generations are automatically refunded.
                </p>
                <p className="text-gray-500 pt-1 flex items-center gap-1.5">
                  <Clock size={12} className="text-gray-400 shrink-0" />
                  Daily reset: <strong className="text-gray-700">{nextResetLocal}</strong>
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGenerateAIQuestions}
                  disabled={isGenerating}
                  className="px-5 py-2.5 rounded-xl bg-black hover:bg-gray-900 text-white text-xs font-semibold flex items-center gap-2 transition shadow-xs disabled:opacity-50"
                >
                  <Sparkles size={14} className="text-amber-400" />
                  Confirm & Spend {requiredCredits} Credits
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Insufficient Credits Modal */}
        {showInsufficientModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-5 animate-in fade-in zoom-in-95 duration-150"
              role="dialog"
              aria-modal="true"
              aria-labelledby="insufficient-modal-title"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-rose-50 rounded-xl text-rose-600 border border-rose-200">
                    <AlertCircle size={18} />
                  </div>
                  <div>
                    <h3 id="insufficient-modal-title" className="text-base font-bold text-gray-900">
                      Insufficient Daily Credits
                    </h3>
                    <p className="text-[11px] text-gray-500">Credit Limit Reached</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInsufficientModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs text-gray-600">
                <p className="leading-relaxed">
                  Generating this set of <strong className="text-gray-900">{selectedCount} questions</strong> requires{" "}
                  <strong className="text-rose-600">{requiredCredits} credits</strong>, but your current balance is{" "}
                  <strong className="text-gray-900">{credits?.balance ?? 0} credits</strong>.
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Current Available Balance:</span>
                    <span className="font-bold text-gray-900">{credits?.balance ?? 0} Credits</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Daily Allowance:</span>
                    <span className="font-bold text-gray-900">{credits?.dailyAllowance || credits?.weeklyAllowance || 100} Credits / Day</span>
                  </div>
                  <div className="flex justify-between text-gray-700 pt-1.5 border-t border-gray-200">
                    <span>Next Daily Reset:</span>
                    <span className="font-semibold text-emerald-700">{nextResetLocal}</span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Daily allowances reset deterministically every day at 00:00 UTC ({nextResetLocal} in your local timezone).
                  In the meantime, you can continue practicing without limits with our curated offline question bank!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowInsufficientModal(false);
                    handleStartStandardPractice();
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-800 hover:bg-gray-50 transition"
                >
                  Practice Question Bank (Free)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowInsufficientModal(false);
                    navigate("/profile");
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-black text-white hover:bg-gray-900 text-xs font-semibold transition"
                >
                  View Profile & Ledger
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AptitudePractice;
