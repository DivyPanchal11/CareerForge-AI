import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, CheckCircle2, AlertTriangle, Lightbulb, RefreshCw, Key, AlignLeft } from "lucide-react";
import { useResume } from "../../../context/ResumeContext";
import { analyzeATS } from "../../../services/resumeService";
import { calculateClientATS } from "../../../utils/atsCalculator";
import toast from "react-hot-toast";

export function ATSAnalysisModal({ isOpen, onClose }) {
  const { resume } = useResume();
  const [loading, setLoading] = useState(false);
  const [atsData, setAtsData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      runAnalysis();
    }
  }, [isOpen]);

  const runAnalysis = async () => {
    try {
      setLoading(true);
      const res = await analyzeATS(resume);
      if (res?.data?.success) {
        setAtsData(res.data);
      } else {
        // Fallback to local heuristic
        const local = calculateClientATS(resume);
        setAtsData(local);
      }
    } catch (err) {
      console.warn("ATS backend call failed, using client heuristic:", err.message);
      const local = calculateClientATS(resume);
      setAtsData(local);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const score = atsData?.atsScore ?? 0;
  const scoreColor =
    score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-500" : "text-rose-500";
  const scoreBg =
    score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-rose-500";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-h-[88vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shadow-xs">
                <Sparkles size={18} className="text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">ATS Resume Compatibility Score</h3>
                <p className="text-xs text-gray-500">Applicant Tracking System parseability & keyword analysis</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-black rounded-lg hover:bg-gray-100 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <RefreshCw size={32} className="animate-spin text-black" />
              <p className="text-xs font-semibold text-gray-700">Evaluating ATS parseability, keywords & structure...</p>
            </div>
          ) : atsData ? (
            <div className="space-y-5">
              {/* Score Card */}
              <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Overall ATS Readiness
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className={`text-4xl font-black ${scoreColor}`}>{score}</span>
                      <span className="text-base font-bold text-gray-400">/ 100</span>
                    </div>
                    <p className="text-xs font-medium text-gray-600 mt-1">
                      {score >= 80
                        ? "🎉 Excellent parseability! Ready for corporate job portals."
                        : score >= 60
                        ? "👍 Solid foundation. Complete the recommendations below to hit 85+."
                        : "⚠️ Needs attention to ensure ATS software doesn't filter your resume."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={runAnalysis}
                    className="self-start sm:self-center flex items-center gap-1.5 text-xs font-bold text-black bg-white border border-gray-300 hover:bg-gray-100 px-3.5 py-2 rounded-xl transition shadow-xs cursor-pointer"
                  >
                    <RefreshCw size={13} />
                    <span>Re-evaluate</span>
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-4">
                  <div
                    className={`h-full ${scoreBg} transition-all duration-500`}
                    style={{ width: `${Math.min(score, 100)}%` }}
                  />
                </div>
              </div>

              {/* Strengths */}
              {atsData.strengths && atsData.strengths.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600" />
                    <span>ATS Strengths ({atsData.strengths.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {atsData.strengths.map((str, i) => (
                      <div
                        key={i}
                        className="text-xs font-medium text-gray-700 bg-emerald-50/70 border border-emerald-200/60 p-2.5 rounded-xl flex items-start gap-2"
                      >
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Weaknesses / Improvements */}
              {atsData.weaknesses && atsData.weaknesses.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                    <AlertTriangle size={15} className="text-amber-500" />
                    <span>Areas to Improve ({atsData.weaknesses.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {atsData.weaknesses.map((w, i) => (
                      <div
                        key={i}
                        className="text-xs font-medium text-gray-700 bg-amber-50/70 border border-amber-200/60 p-2.5 rounded-xl flex items-start gap-2"
                      >
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Recommendations */}
              {atsData.recommendations && atsData.recommendations.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                    <Lightbulb size={15} className="text-blue-500" />
                    <span>Actionable Next Steps</span>
                  </h4>
                  <div className="space-y-1.5">
                    {atsData.recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="text-xs font-medium text-gray-700 bg-blue-50/60 border border-blue-200/60 p-2.5 rounded-xl flex items-start gap-2"
                      >
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing High-Impact Keywords */}
              {atsData.missingKeywords && atsData.missingKeywords.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Key size={14} className="text-gray-700" />
                    <span>Suggested ATS Keywords</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {atsData.missingKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-semibold text-gray-800 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-lg"
                      >
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Formatting Advice */}
              {atsData.formattingIssues && atsData.formattingIssues.length > 0 && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <h5 className="text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <AlignLeft size={13} className="text-gray-600" />
                    <span>ATS Layout Best Practices</span>
                  </h5>
                  <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                    {atsData.formattingIssues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500 text-xs">
              Unable to load analysis. Please click Re-evaluate.
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={onClose}
              className="bg-black hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ATSAnalysisModal;
