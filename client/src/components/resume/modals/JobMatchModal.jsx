import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Target,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Link as LinkIcon,
  FileText,
  ArrowRight,
  GitFork,
  Building2,
  Check,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import { useResume } from "../../../context/ResumeContext";
import { matchJobDescription, forkAndTailorResume } from "../../../services/resumeService";

export function JobMatchModal({ isOpen, onClose, resumeId, onOpenCoverLetter }) {
  const navigate = useNavigate();
  const { resume, setHighlightKeywords, setMissingKeywords } = useResume();

  const [inputMode, setInputMode] = useState("text"); // "text" | "url"
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [matchingLoading, setMatchingLoading] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  const [forkLoading, setForkLoading] = useState(false);
  const [forkStep, setForkStep] = useState(""); // progress status
  const [forkedData, setForkedData] = useState(null); // { forkedResume, tailoredSummary, tailoredExperience, changesMade, companyName }

  if (!isOpen) return null;

  // Auto-detect company name if empty
  const detectCompany = (text) => {
    const patterns = [
      /(?:about|at|join|welcome to)\s+([A-Z][a-zA-Z0-9&.\s]{2,20}?)(?:\s+is|\s+in|\s+team|\s*\.|\s*,|\s*\n)/i,
      /([A-Z][a-zA-Z0-9&]{2,20})\s+(?:is looking for|is hiring|seeks)/i,
    ];
    for (const pat of patterns) {
      const match = text.match(pat);
      if (match && match[1]) {
        const clean = match[1].trim();
        if (!["The", "Our", "This", "A", "An"].includes(clean)) {
          return clean;
        }
      }
    }
    return "";
  };

  const handleJobDescChange = (e) => {
    const val = e.target.value;
    setJobDescription(val);
    if (!companyName && val.length > 20) {
      const detected = detectCompany(val);
      if (detected) setCompanyName(detected);
    }
  };

  const handleMatch = async (e) => {
    e?.preventDefault();
    const content = inputMode === "url" ? jobUrl : jobDescription;
    if (!content.trim()) {
      toast.error(inputMode === "url" ? "Please enter a valid job posting URL" : "Please paste a job description");
      return;
    }

    try {
      setMatchingLoading(true);
      const res = await matchJobDescription(resume, content);
      if (res.data.success) {
        setMatchResult(res.data);
        if (res.data.matchingSkills && setHighlightKeywords) {
          setHighlightKeywords(res.data.matchingSkills.map((s) => s.toLowerCase()));
        }
        if (res.data.missingSkills && setMissingKeywords) {
          setMissingKeywords(res.data.missingSkills);
        }
        toast.success("Job match analysis complete! Keywords highlighted.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Job match analysis failed");
    } finally {
      setMatchingLoading(false);
    }
  };

  const handle1ClickFork = async () => {
    const currentId = resumeId || resume._id;
    if (!currentId) {
      toast.error("Please save the resume first before forking");
      return;
    }

    const content = inputMode === "url" ? "" : jobDescription;
    const url = inputMode === "url" ? jobUrl : "";

    try {
      setForkLoading(true);
      setForkStep("Analyzing job requirements and missing keywords...");

      setTimeout(() => {
        setForkStep("Weaving missing ATS keywords into summary & experience...");
      }, 700);

      const res = await forkAndTailorResume(currentId, content, companyName, url);

      if (res.data.success && res.data.forkedResume) {
        setForkStep("Finalizing dedicated tailored resume version...");
        setForkedData(res.data);
        toast.success(`Resume tailored & duplicated for ${res.data.companyName || "Target Company"}!`);
      } else {
        toast.error("Forking failed");
      }
    } catch (err) {
      console.error("Fork error:", err);
      toast.error("Failed to fork and tailor resume");
    } finally {
      setForkLoading(false);
      setForkStep("");
    }
  };

  const handleGoToForked = () => {
    if (forkedData?.forkedResume?._id) {
      onClose();
      navigate(`/resume/${forkedData.forkedResume._id}/edit`);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-7 max-h-[88vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs">
                <Target size={18} className="text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Tailor for Job Description</h3>
                <p className="text-xs text-gray-500">1-Click fork, match scoring & automatic ATS keyword injection</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Forked Success View */}
          {forkedData ? (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="text-base font-bold text-emerald-950">
                  Tailored Resume Created for {forkedData.companyName || "Target Company"}!
                </h4>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  A new dedicated resume was created in your dashboard. Relevant ATS keywords have been pre-populated into your summary and experience bullet points.
                </p>
              </div>

              {/* Changes Breakdown */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Automated Tailoring Summary
                </h5>

                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 space-y-2.5">
                  {forkedData.changesMade?.map((change, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                      <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{change}</span>
                    </div>
                  ))}
                </div>

                {/* Tailored Summary Preview */}
                {forkedData.tailoredSummary && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-1.5 shadow-xs">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tailored Professional Summary</p>
                    <p className="text-xs text-gray-800 leading-relaxed italic bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                      "{forkedData.tailoredSummary}"
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 pt-2">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="button"
                    onClick={handleGoToForked}
                    className="flex-1 bg-black hover:bg-gray-800 text-white font-bold text-xs py-3.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Open Tailored Resume in Builder</span>
                    <ArrowRight size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setForkedData(null);
                      setMatchResult(null);
                    }}
                    className="px-4 py-3.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-xl transition cursor-pointer"
                  >
                    Tailor Another Job
                  </button>
                </div>

                {onOpenCoverLetter && (
                  <button
                    type="button"
                    onClick={() =>
                      onOpenCoverLetter({
                        companyName: forkedData.companyName || companyName,
                        jobDescription,
                      })
                    }
                    className="w-full bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <FileText size={14} className="text-purple-600" />
                    <span>Generate Matching Cover Letter for {forkedData.companyName || companyName || "this Role"}</span>
                  </button>
                )}
              </div>
            </div>
          ) : !matchResult ? (
            /* Input Form */
            <form onSubmit={handleMatch} className="space-y-4">
              {/* Target Company Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Target Company Name (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Building2 size={14} />
                  </div>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Google, Stripe, Spotify (Auto-detected if left blank)"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:border-black outline-none transition"
                  />
                </div>
              </div>

              {/* Input Mode Selector */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setInputMode("text")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    inputMode === "text" ? "bg-white text-black shadow-xs" : "text-gray-600 hover:text-black"
                  }`}
                >
                  <FileText size={14} />
                  <span>Paste Job Description</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("url")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    inputMode === "url" ? "bg-white text-black shadow-xs" : "text-gray-600 hover:text-black"
                  }`}
                >
                  <LinkIcon size={14} />
                  <span>Paste Job Posting URL</span>
                </button>
              </div>

              {inputMode === "text" ? (
                <div>
                  <textarea
                    rows={6}
                    value={jobDescription}
                    onChange={handleJobDescChange}
                    placeholder="Paste the full job posting text here (requirements, qualifications, responsibilities)..."
                    className="w-full rounded-2xl border border-gray-300 p-3.5 text-xs text-gray-900 focus:border-black outline-none transition leading-relaxed"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <input
                    type="url"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    placeholder="https://careers.google.com/jobs/results/..."
                    className="w-full rounded-2xl border border-gray-300 p-3.5 text-xs text-gray-900 focus:border-black outline-none transition"
                  />
                  <p className="text-[11px] text-gray-500">
                    We will extract the job requirements and tech stack directly from the link.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={matchingLoading || (inputMode === "text" ? !jobDescription.trim() : !jobUrl.trim())}
                className="w-full bg-black hover:bg-gray-800 text-white font-bold text-xs py-3.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {matchingLoading ? <RefreshCw size={14} className="animate-spin" /> : <Target size={14} />}
                <span>Calculate Match & Preview Keywords</span>
              </button>
            </form>
          ) : (
            /* Match Results & 1-Click Fork View */
            <div className="space-y-5">
              {/* Score & Fork Banner */}
              <div className="bg-gradient-to-r from-gray-900 to-black text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                <div>
                  <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    {companyName ? `Match for ${companyName}` : "Target Job Match"}
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h4 className="text-3xl font-black">{matchResult.matchScore}%</h4>
                    <span className="text-xs text-gray-300">ATS Keyword Compatibility</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handle1ClickFork}
                  disabled={forkLoading}
                  className="bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs px-4 py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-60"
                  title="Duplicate resume and auto-inject missing keywords"
                >
                  {forkLoading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Forking Resume...</span>
                    </>
                  ) : (
                    <>
                      <GitFork size={15} />
                      <span>✨ 1-Click Fork & Tailor</span>
                    </>
                  )}
                </button>
              </div>

              {/* Progress feedback while forking */}
              {forkLoading && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center text-xs font-semibold text-amber-900 animate-pulse flex items-center justify-center gap-2">
                  <Sparkles size={14} className="text-amber-600 animate-spin" />
                  <span>{forkStep}</span>
                </div>
              )}

              {/* Matching Skills */}
              {matchResult.matchingSkills && matchResult.matchingSkills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-green-600" />
                    Matching Keywords Present in Resume ({matchResult.matchingSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.matchingSkills.map((sk, i) => (
                      <span
                        key={i}
                        className="bg-green-100 border border-green-300 text-green-900 text-xs px-2.5 py-0.5 rounded-lg font-semibold"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Skills */}
              {matchResult.missingSkills && matchResult.missingSkills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertCircle size={14} className="text-amber-500" />
                    Missing ATS Keywords (Will be injected when forked)
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.missingSkills.map((sk, i) => (
                      <span
                        key={i}
                        className="bg-amber-50 border border-amber-300 text-amber-900 text-xs px-2.5 py-0.5 rounded-lg font-semibold"
                      >
                        + {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {matchResult.suggestions && matchResult.suggestions.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Zap size={14} className="text-indigo-600" />
                    Strategic Tailoring Suggestions
                  </h4>
                  <ul className="space-y-1.5 text-xs text-gray-700 list-disc pl-5">
                    {matchResult.suggestions.map((sug, i) => (
                      <li key={i}>{sug}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer controls */}
              <div className="pt-2 flex justify-between items-center border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setMatchResult(null)}
                  className="text-xs font-semibold text-gray-600 hover:text-black py-2 cursor-pointer"
                >
                  ← Test Another Job Posting
                </button>

                {onOpenCoverLetter && (
                  <button
                    type="button"
                    onClick={() =>
                      onOpenCoverLetter({
                        companyName,
                        jobDescription,
                      })
                    }
                    className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1.5 py-2 cursor-pointer"
                  >
                    <FileText size={13} />
                    <span>Draft Matching Cover Letter →</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default JobMatchModal;
