import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Type,
  Wand2,
  ChevronDown,
  ChevronUp,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import { useResume } from "../../../context/ResumeContext";
import {
  lintResume,
  fixResumePunctuation,
  replaceVerbInBullet,
  replaceWeakPhraseInBullet,
} from "../../../utils/resumeLinter";

export function QualityLinterModal({ isOpen, onClose }) {
  const { resume, setResume } = useResume();
  const [activeFilter, setActiveFilter] = useState("all");
  const [expanded, setExpanded] = useState({
    punctuation: true,
    dates: true,
    verbs: true,
    passive: true,
  });

  if (!isOpen) return null;

  const toggle = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const lintResults = lintResume(resume);
  const { qualityScore, qualityGrade, gradeColor, issuesCount, allChecksPassed } = lintResults;

  // 1-Click Punctuation Fix
  const handleFixPunctuation = (mode) => {
    const updated = fixResumePunctuation(resume, mode);
    setResume(updated);
    toast.success(
      mode === "add"
        ? "Added trailing periods to all bullet points!"
        : "Removed trailing periods from all bullet points!"
    );
  };

  // 1-Click Verb Replacement
  const handleReplaceVerb = (bullet, oldWord, newVerb) => {
    const updated = replaceVerbInBullet(resume, {
      section: bullet.section,
      entryId: bullet.entryId,
      bulletIndex: bullet.bulletIndex,
      newVerb,
    });
    setResume(updated);
    toast.success(`Replaced "${oldWord}" with "${newVerb}"!`);
  };

  // 1-Click Passive Phrase Replacement
  const handleReplacePassivePhrase = (item, newWord) => {
    const updated = replaceWeakPhraseInBullet(resume, {
      section: item.bullet.section,
      entryId: item.bullet.entryId,
      targetPhrase: item.matchedSnippet || item.phrase,
      newWord,
    });
    setResume(updated);
    toast.success(`Replaced "${item.phrase}" with "${newWord}"!`);
  };

  const scoreColor =
    qualityScore >= 80 ? "text-emerald-600" : qualityScore >= 60 ? "text-amber-500" : "text-rose-500";

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
                <ShieldCheck size={18} className="text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Resume Quality & Consistency Linter</h3>
                <p className="text-xs text-gray-500">
                  Real-time audit of punctuation, date styles, overused action verbs, and passive voice
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-black rounded-lg hover:bg-gray-100 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-5">
            {/* Score Card Banner */}
            <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Consistency Score
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className={`text-4xl font-black ${scoreColor}`}>{qualityScore}</span>
                    <span className="text-base font-bold text-gray-400">/ 100</span>
                  </div>
                  <p className="text-xs font-medium text-gray-600 mt-1">
                    {allChecksPassed
                      ? "🎉 100% Consistent! All punctuation, date formats, verbs, and active voice checks passed."
                      : `${issuesCount} consistency issue${issuesCount !== 1 ? "s" : ""} detected. Apply 1-click fixes below to polish your resume.`}
                  </p>
                </div>

                <div className="shrink-0 sm:text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-xl font-bold text-xs border ${gradeColor}`}
                  >
                    {qualityGrade}
                  </span>
                  <p className="text-[10px] text-gray-400 font-semibold mt-1">Real-time sync</p>
                </div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeFilter === "all"
                    ? "bg-black text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
              >
                All Checks ({issuesCount})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter("punctuation")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === "punctuation"
                    ? "bg-black text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
              >
                <span>Punctuation</span>
                {lintResults.punctuation.hasIssue && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter("dates")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === "dates"
                    ? "bg-black text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
              >
                <span>Dates</span>
                {lintResults.dates.hasIssue && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter("verbs")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === "verbs"
                    ? "bg-black text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
              >
                <span>Repetitive Verbs</span>
                {lintResults.repetitiveVerbs.hasIssue && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter("passive")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === "passive"
                    ? "bg-black text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
              >
                <span>Passive Voice</span>
                {lintResults.passiveVoice.hasIssue && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
              </button>
            </div>

            {/* 1. Inconsistent Punctuation */}
            {(activeFilter === "all" || activeFilter === "punctuation") && (
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggle("punctuation")}
                  className="w-full flex items-center justify-between p-3.5 bg-gray-50/50 hover:bg-gray-100/50 transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2">
                    {lintResults.punctuation.hasIssue ? (
                      <AlertTriangle size={15} className="text-amber-500 shrink-0" />
                    ) : (
                      <CheckCircle2 size={15} className="text-green-600 shrink-0" />
                    )}
                    <span className="text-xs font-bold text-gray-800">Inconsistent Punctuation</span>
                    <span className="text-[11px] text-gray-500 truncate max-w-xs">
                      — {lintResults.punctuation.message}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        lintResults.punctuation.hasIssue
                          ? "bg-amber-100 text-amber-900"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {lintResults.punctuation.hasIssue ? "Fix Available" : "Clean"}
                    </span>
                    {expanded.punctuation ? (
                      <ChevronUp size={14} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={14} className="text-gray-400" />
                    )}
                  </div>
                </button>

                {expanded.punctuation && (
                  <div className="p-4 space-y-3 border-t border-gray-100 text-xs">
                    <div className="flex items-center justify-between text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <span>
                        <strong>{lintResults.punctuation.withPeriodCount}</strong> bullet(s) end with period (.)
                      </span>
                      <span className="text-gray-300">•</span>
                      <span>
                        <strong>{lintResults.punctuation.withoutPeriodCount}</strong> bullet(s) without period
                      </span>
                    </div>

                    {lintResults.punctuation.hasIssue && (
                      <div className="flex flex-col sm:flex-row gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleFixPunctuation("add")}
                          className="flex-1 bg-black hover:bg-gray-800 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Zap size={13} className="text-amber-400" />
                          <span>Add periods to all bullets (1-Click)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFixPunctuation("remove")}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold py-2.5 px-3 rounded-xl transition cursor-pointer"
                        >
                          <span>Remove all periods</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 2. Inconsistent Date Formats */}
            {(activeFilter === "all" || activeFilter === "dates") && (
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggle("dates")}
                  className="w-full flex items-center justify-between p-3.5 bg-gray-50/50 hover:bg-gray-100/50 transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2">
                    {lintResults.dates.hasIssue ? (
                      <Calendar size={15} className="text-amber-500 shrink-0" />
                    ) : (
                      <CheckCircle2 size={15} className="text-green-600 shrink-0" />
                    )}
                    <span className="text-xs font-bold text-gray-800">Inconsistent Dates</span>
                    <span className="text-[11px] text-gray-500 truncate max-w-xs">
                      — {lintResults.dates.message}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        lintResults.dates.hasIssue
                          ? "bg-amber-100 text-amber-900"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {lintResults.dates.hasIssue ? "Mismatched" : "Consistent"}
                    </span>
                    {expanded.dates ? (
                      <ChevronUp size={14} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={14} className="text-gray-400" />
                    )}
                  </div>
                </button>

                {expanded.dates && (
                  <div className="p-4 space-y-2.5 border-t border-gray-100 text-xs">
                    <div className="flex flex-wrap gap-1.5">
                      {lintResults.dates.formatsFound.map((fmt) => (
                        <span
                          key={fmt.key}
                          className="bg-gray-50 border border-gray-200 text-gray-700 px-2.5 py-1 rounded-md text-[11px]"
                        >
                          <strong>{fmt.label}</strong> ({fmt.count}×, e.g. "{fmt.entries[0]?.value}")
                        </span>
                      ))}
                    </div>

                    {lintResults.dates.hasIssue && lintResults.dates.suggestion && (
                      <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200/60 p-2.5 rounded-lg leading-relaxed">
                        💡 {lintResults.dates.suggestion}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 3. Repetitive Action Verbs */}
            {(activeFilter === "all" || activeFilter === "verbs") && (
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggle("verbs")}
                  className="w-full flex items-center justify-between p-3.5 bg-gray-50/50 hover:bg-gray-100/50 transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2">
                    {lintResults.repetitiveVerbs.hasIssue ? (
                      <Type size={15} className="text-amber-500 shrink-0" />
                    ) : (
                      <CheckCircle2 size={15} className="text-green-600 shrink-0" />
                    )}
                    <span className="text-xs font-bold text-gray-800">Repetitive Action Verbs</span>
                    <span className="text-[11px] text-gray-500 truncate max-w-xs">
                      — {lintResults.repetitiveVerbs.message}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        lintResults.repetitiveVerbs.hasIssue
                          ? "bg-amber-100 text-amber-900"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {lintResults.repetitiveVerbs.hasIssue
                        ? `${lintResults.repetitiveVerbs.repetitiveVerbs.length} Overused`
                        : "Diversified"}
                    </span>
                    {expanded.verbs ? (
                      <ChevronUp size={14} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={14} className="text-gray-400" />
                    )}
                  </div>
                </button>

                {expanded.verbs && (
                  <div className="p-4 space-y-3 border-t border-gray-100 text-xs">
                    {lintResults.repetitiveVerbs.hasIssue ? (
                      lintResults.repetitiveVerbs.repetitiveVerbs.map((vg) => (
                        <div
                          key={vg.normalized}
                          className="bg-gray-50 border border-gray-200/80 p-3 rounded-xl space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900">
                              "{vg.word}" <span className="text-gray-500 font-normal">used {vg.count} times</span>
                            </span>
                            <span className="text-[10px] text-gray-400">Click alternative to replace</span>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {vg.alternatives.map((alt) => (
                              <button
                                key={alt}
                                type="button"
                                onClick={() => {
                                  const target = vg.bullets[0];
                                  if (target) handleReplaceVerb(target, vg.word, alt);
                                }}
                                className="bg-white hover:bg-black hover:text-white border border-gray-200 text-gray-800 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition cursor-pointer shadow-2xs"
                              >
                                {alt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-gray-500">
                        Great variety! Every bullet point starts with a diverse action verb.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 4. Passive Voice Detector */}
            {(activeFilter === "all" || activeFilter === "passive") && (
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggle("passive")}
                  className="w-full flex items-center justify-between p-3.5 bg-gray-50/50 hover:bg-gray-100/50 transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2">
                    {lintResults.passiveVoice.hasIssue ? (
                      <Wand2 size={15} className="text-amber-500 shrink-0" />
                    ) : (
                      <CheckCircle2 size={15} className="text-green-600 shrink-0" />
                    )}
                    <span className="text-xs font-bold text-gray-800">Passive Voice Detector</span>
                    <span className="text-[11px] text-gray-500 truncate max-w-xs">
                      — {lintResults.passiveVoice.message}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        lintResults.passiveVoice.hasIssue
                          ? "bg-amber-100 text-amber-900"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {lintResults.passiveVoice.hasIssue
                        ? `${lintResults.passiveVoice.totalDetected} Weak Phrases`
                        : "Active Voice"}
                    </span>
                    {expanded.passive ? (
                      <ChevronUp size={14} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={14} className="text-gray-400" />
                    )}
                  </div>
                </button>

                {expanded.passive && (
                  <div className="p-4 space-y-2.5 border-t border-gray-100 text-xs">
                    {lintResults.passiveVoice.hasIssue ? (
                      lintResults.passiveVoice.detectedIssues.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 border border-gray-200/80 p-3 rounded-xl space-y-1.5"
                        >
                          <p className="text-[11px] text-gray-700 italic">
                            "{item.bullet.clean}"
                          </p>

                          <div className="flex flex-wrap items-center gap-1 pt-0.5">
                            <span className="text-[10px] text-gray-400 font-semibold mr-1">
                              Replace "{item.phrase}" with:
                            </span>
                            {item.alternatives.map((alt) => (
                              <button
                                key={alt}
                                type="button"
                                onClick={() => handleReplacePassivePhrase(item, alt)}
                                className="bg-white hover:bg-black hover:text-white border border-gray-200 text-gray-800 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition cursor-pointer shadow-2xs"
                              >
                                {alt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-gray-500">
                        No passive phrases found! Strong active voice is maintained throughout.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default QualityLinterModal;
