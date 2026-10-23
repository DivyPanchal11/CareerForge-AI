import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AlertCircle, Clock } from "lucide-react";

import Navbar from "../components/auth/Navbar";
import InterviewHeader from "../components/interview/InterviewHeader";
import InterviewStats from "../components/interview/InterviewStats";
import InterviewConfigForm from "../components/interview/InterviewConfigForm";
import InterviewRecentActivity from "../components/interview/InterviewRecentActivity";

import {
  getInterviewStats,
  fetchInterviewAIConfig,
  fetchInterviewCredits,
  generateAIQuestions,
  startInterviewSession,
} from "../services/interviewService";
import { formatLocalResetTime } from "../utils/creditTimeUtils";

function Interview() {
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [stats] = useState(() => getInterviewStats());
  const [aiConfig, setAiConfig] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [quotaModal, setQuotaModal] = useState({ show: false, message: "", fallbackQuestions: null, pendingConfig: null });
  const [creditModal, setCreditModal] = useState({ show: false, balance: 0, required: 0, nextReset: "" });

  useEffect(() => {
    let active = true;
    const loadAiConfig = async () => {
      try {
        const cfg = await fetchInterviewAIConfig();
        if (active && cfg) {
          setAiConfig(cfg);
        }
        const token = localStorage.getItem("token");
        if (token) {
          const creditRes = await fetchInterviewCredits();
          if (active && creditRes?.success && creditRes.credits) {
            setAiConfig((prev) => ({
              ...(prev || {}),
              userCredits: creditRes.credits,
            }));
          }
        }
      } catch (e) {
        console.warn("Failed to load interview config/credits:", e);
      }
    };

    loadAiConfig();
    return () => {
      active = false;
    };
  }, []);

  const scrollToSetup = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleStartInterview = async (config) => {
    setIsStarting(true);
    try {
      const res = await generateAIQuestions(config);

      if (res.success && res.questions?.length > 0) {
        if (res.credits) {
          setAiConfig((prev) => ({
            ...(prev || {}),
            userCredits: {
              ...(prev?.userCredits || {}),
              balance: res.credits.balance,
              reservedBalance: res.credits.reservedBalance,
              dailyAllowance: res.credits.dailyAllowance,
              nextReset: res.credits.nextReset,
            },
          }));
        }
        startInterviewSession(config, res.questions);
        toast.success("AI interview session prepared!");
        navigate("/interviews/session");
        return;
      }

      // Check if user has insufficient credits
      if (res.isInsufficientCredits) {
        const resetLocal = formatLocalResetTime(
          res.nextReset || aiConfig?.userCredits?.nextReset || aiConfig?.creditPricing?.nextReset
        );
        setCreditModal({
          show: true,
          balance: res.balance ?? aiConfig?.userCredits?.balance ?? 0,
          required: res.required ?? (Number(config.questionCount) * (aiConfig?.creditPricing?.costPerQuestion || 2)),
          nextReset: resetLocal,
        });
        setIsStarting(false);
        return;
      }

      // Helper to strip any raw JSON
      const cleanMessage = (msg) => {
        if (!msg) return "The AI service is temporarily busy. Please wait a moment.";
        try {
          const match = msg.match(/\{[\s\S]*"error"[\s\S]*\}/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            if (parsed.error && parsed.error.message) {
              return parsed.error.message;
            }
          }
        } catch {
          // ignore json parse errors
        }
        return msg.replace(/^AI service error:\s*/i, "").trim();
      };

      // Check if free-tier quota was exhausted
      if (res.isQuotaExhausted) {
        setQuotaModal({
          show: true,
          message: cleanMessage(res.message) || "Google Gemini free-tier daily or rate limit reached.",
          fallbackQuestions: res.fallbackQuestions,
          pendingConfig: config,
        });
        setIsStarting(false);
        return;
      }

      // If general error, also offer fallback questions
      if (res.fallbackQuestions && res.fallbackQuestions.length > 0) {
        setQuotaModal({
          show: true,
          message: cleanMessage(res.message) || "Could not connect to Gemini AI.",
          fallbackQuestions: res.fallbackQuestions,
          pendingConfig: config,
        });
        setIsStarting(false);
        return;
      }

      toast.error(res.message || "Could not generate interview questions.");
      setIsStarting(false);
    } catch (err) {
      console.error("Start interview error:", err);
      toast.error("Could not initiate interview session. Please try again.");
      setIsStarting(false);
    }
  };

  const handleUseFallback = () => {
    if (!quotaModal.pendingConfig || !quotaModal.fallbackQuestions) return;
    startInterviewSession(quotaModal.pendingConfig, quotaModal.fallbackQuestions);
    setQuotaModal({ show: false, message: "", fallbackQuestions: null, pendingConfig: null });
    toast.success("Practice session loaded with curated role questions!");
    navigate("/interviews/session");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <InterviewHeader onStartClick={scrollToSetup} />

        {/* Statistics Banner */}
        <InterviewStats stats={stats} />

        {/* Setup Configuration Form */}
        <div ref={formRef}>
          <InterviewConfigForm
            onStartInterview={handleStartInterview}
            isStarting={isStarting}
            aiConfig={aiConfig}
          />
        </div>

        {/* Recent Activity List */}
        <InterviewRecentActivity
          recentAttempts={stats.recentAttempts}
          onStartNew={scrollToSetup}
        />
      </main>

      {/* Quota / Fallback Modal */}
      {quotaModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                <AlertCircle size={22} />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                AI Service Notice
              </h3>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              {quotaModal.message}
            </p>
            <p className="text-xs text-gray-500">
              You can wait a moment and retry with Google Gemini, or practice immediately using our curated, role-specific question sets.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-end">
              <button
                type="button"
                onClick={() => setQuotaModal({ show: false, message: "", fallbackQuestions: null, pendingConfig: null })}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                Close & Retry Later
              </button>
              {quotaModal.fallbackQuestions && (
                <button
                  type="button"
                  onClick={handleUseFallback}
                  className="px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-900 transition cursor-pointer"
                >
                  Continue with Curated Set
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Insufficient Credit Modal */}
      {creditModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertCircle size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Insufficient Daily Credits
                </h3>
                <span className="text-[11px] text-red-600 font-medium">
                  {creditModal.required} credits required
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Generating this interview question set requires <strong className="text-gray-900">{creditModal.required} credits</strong>, but you only have <strong className="text-gray-900">{creditModal.balance} credits</strong> available today.
            </p>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-gray-900">
                <Clock size={13} className="text-gray-500" />
                <span>Next Allowance Reset</span>
              </div>
              <p className="text-xs font-semibold text-emerald-700">
                {creditModal.nextReset}
              </p>
              <p className="text-[10px] text-gray-500">
                Daily allowances reset deterministically every day at 00:00 UTC ({creditModal.nextReset} in your local timezone).
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setCreditModal({ show: false, balance: 0, required: 0, nextReset: "" })}
                className="px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-900 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Interview;
