import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Sparkles,
  Target,
  CheckCircle2,
  Lightbulb,
  RefreshCw,
  Wand2,
  FileSearch,
  X,
  GitFork,
  MessageSquare,
  ArrowRight,
  Layers,
  HelpCircle,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import { useResume } from "../../../context/ResumeContext";
import { analyzeATS, matchJobDescription, generateSummary, suggestSkills } from "../../../services/resumeService";
import { calculateClientATS } from "../../../utils/atsCalculator";
import { analyzeKeywords } from "../../../utils/keywordMatcher";
import QualityLinterCard from "./QualityLinterCard";

export function AIToolsPanel({
  onOpenQualityModal,
  onOpenJobMatch,
  onOpenInterviewPrep,
  onOpenCoverLetter,
}) {
  const { resume, setResume, setHighlightKeywords, setMissingKeywords } = useResume();
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsData, setAtsData] = useState(null);

  const [jobDesc, setJobDesc] = useState("");
  const [jobMatchLoading, setJobMatchLoading] = useState(false);
  const [jobMatchResult, setJobMatchResult] = useState(null);

  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [suggestSkillsLoading, setSuggestSkillsLoading] = useState(false);

  // Live keyword analysis state (local UI display)
  const [keywordStats, setKeywordStats] = useState(null); // { matched: [], missing: [] }
  const debounceRef = useRef(null);

  // ── Live Keyword Analysis: debounce 500ms after job desc changes ──
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!jobDesc.trim()) {
      // Clear all highlighting when job description is empty
      setHighlightKeywords([]);
      setMissingKeywords([]);
      setKeywordStats(null);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const { matched, missing } = analyzeKeywords(jobDesc, resume);
      setHighlightKeywords(matched);
      setMissingKeywords(missing);
      setKeywordStats({ matched, missing });
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [jobDesc, resume, setHighlightKeywords, setMissingKeywords]);

  // Clear keyword highlights when component unmounts (user leaves AI tab)
  useEffect(() => {
    return () => {
      setHighlightKeywords([]);
      setMissingKeywords([]);
    };
  }, [setHighlightKeywords, setMissingKeywords]);

  const handleRunATS = async () => {
    try {
      setAtsLoading(true);
      const res = await analyzeATS(resume);
      if (res?.data?.success) {
        setAtsData(res.data);
        toast.success("ATS Analysis completed!");
      } else {
        const local = calculateClientATS(resume);
        setAtsData(local);
        toast.success("ATS Analysis completed!");
      }
    } catch (err) {
      console.warn("ATS backend call error, falling back to local heuristic:", err.message);
      const local = calculateClientATS(resume);
      setAtsData(local);
      toast.success("ATS Analysis completed!");
    } finally {
      setAtsLoading(false);
    }
  };

  const handleMatchJob = async () => {
    if (!jobDesc.trim()) {
      toast.error("Please paste a job description first");
      return;
    }
    try {
      setJobMatchLoading(true);
      const res = await matchJobDescription(resume, jobDesc);
      if (res.data.success && res.data.result) {
        setJobMatchResult(res.data.result);
        toast.success("Job match analysis completed!");
      }
    } catch (err) {
      toast.error("Failed to match job description");
    } finally {
      setJobMatchLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    try {
      setAiSummaryLoading(true);
      const res = await generateSummary(resume);
      if (res.data.success && res.data.result) {
        setResume((prev) => ({ ...prev, summary: res.data.result }));
        toast.success("AI Professional Summary updated!");
      }
    } catch (err) {
      toast.error("Failed to generate summary");
    } finally {
      setAiSummaryLoading(false);
    }
  };

  const handleSuggestSkills = async () => {
    try {
      setSuggestSkillsLoading(true);
      const res = await suggestSkills(resume);
      if (res.data.success && res.data.skills) {
        const existingNames = (resume.skills || []).map((s) => s.name.toLowerCase());
        const newSkills = res.data.skills
          .filter((name) => !existingNames.includes(name.toLowerCase()))
          .map((name) => ({ id: Math.random().toString(), name, category: "Technical" }));

        if (newSkills.length > 0) {
          setResume((prev) => ({
            ...prev,
            skills: [...(prev.skills || []), ...newSkills],
          }));
          toast.success(`Added ${newSkills.length} suggested skills!`);
        } else {
          toast("No new skills to add.");
        }
      }
    } catch (err) {
      toast.error("Failed to suggest skills");
    } finally {
      setSuggestSkillsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
            <Sparkles size={20} className="text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">AI Enhancement Suite</h2>
            <p className="text-xs text-gray-500">Analyze ATS parseability, quality & consistency linter, and match job descriptions.</p>
          </div>
        </div>
      </div>

      {/* Real-Time Resume Quality & Consistency Linter */}
      <QualityLinterCard onOpenModal={onOpenQualityModal} />

      {/* 1. ATS Score & Analysis Tool */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
            <FileSearch size={15} className="text-gray-900" />
            <span>ATS Compatibility Analysis</span>
          </h3>

          <button
            type="button"
            onClick={handleRunATS}
            disabled={atsLoading}
            className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            {atsLoading ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} />}
            <span>{atsData ? "Re-analyze" : "Run ATS Analysis"}</span>
          </button>
        </div>

        {atsData ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 p-4 rounded-xl">
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">ATS Optimization Score</p>
                <h4 className="text-2xl font-black text-gray-900 mt-0.5">{atsData.atsScore} / 100</h4>
                <p className="text-xs text-gray-600 mt-1">
                  {atsData.atsScore >= 80 ? "🎉 Excellent ATS parseability!" : atsData.atsScore >= 60 ? "👍 Good baseline resume. Needs minor tweaks." : "⚠️ Requires optimization."}
                </p>
              </div>
            </div>

            {atsData.strengths && atsData.strengths.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-green-600" />
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {atsData.strengths.map((str, i) => (
                    <li key={i} className="text-xs text-gray-700 bg-green-50/60 border border-green-200/60 p-2 rounded-lg">
                      {str}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {atsData.recommendations && atsData.recommendations.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Lightbulb size={14} className="text-amber-500" />
                  Recommendations
                </h4>
                <ul className="space-y-1">
                  {atsData.recommendations.map((rec, i) => (
                    <li key={i} className="text-xs text-gray-700 bg-amber-50/60 border border-amber-200/60 p-2 rounded-lg">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center border border-dashed border-gray-200 rounded-xl">
            <Sparkles size={24} className="mx-auto text-amber-500 mb-2" />
            <p className="text-xs text-gray-600 font-medium">Click "Run ATS Analysis" above to score your resume formatting and parseability.</p>
          </div>
        )}
      </div>

      {/* 2. Job Description Match Tool */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
          <Target size={15} className="text-gray-900" />
          <span>Match Target Job Description</span>
        </h3>

        <textarea
          rows={4}
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          placeholder="Paste job posting text here to analyze keyword match..."
          className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:border-black outline-none transition mb-3"
        />

        <button
          type="button"
          onClick={handleMatchJob}
          disabled={jobMatchLoading || !jobDesc.trim()}
          className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white text-xs font-bold py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50"
        >
          {jobMatchLoading ? <RefreshCw size={14} className="animate-spin" /> : <Target size={14} />}
          <span>Analyze Job Description Match</span>
        </button>

        {/* ── Live Keyword Match Stats ── */}
        {keywordStats && (
          <div className="mt-4 space-y-3">
            {/* Summary bar */}
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-lg font-black text-green-600">{keywordStats.matched.length}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Found</p>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="text-center">
                  <p className="text-lg font-black text-amber-600">{keywordStats.missing.length}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Missing</p>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="text-center">
                  <p className="text-lg font-black text-gray-900">
                    {keywordStats.matched.length + keywordStats.missing.length > 0
                      ? Math.round(
                          (keywordStats.matched.length /
                            (keywordStats.matched.length + keywordStats.missing.length)) *
                            100
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Match</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setJobDesc("");
                  setKeywordStats(null);
                  setHighlightKeywords([]);
                  setMissingKeywords([]);
                }}
                className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                title="Clear job description & highlights"
              >
                <X size={14} />
              </button>
            </div>

            {/* Matched keywords */}
            {keywordStats.matched.length > 0 && (
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-green-700 mb-1.5 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>Matched Keywords ({keywordStats.matched.length})</span>
                </h4>
                <div className="flex flex-wrap gap-1">
                  {keywordStats.matched.map((kw) => (
                    <span
                      key={kw}
                      className="bg-green-100 text-green-800 border border-green-200 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing keywords */}
            {keywordStats.missing.length > 0 && (
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1.5 flex items-center gap-1">
                  <Lightbulb size={12} />
                  <span>Missing Keywords ({keywordStats.missing.length})</span>
                </h4>
                <div className="flex flex-wrap gap-1">
                  {keywordStats.missing.map((kw) => (
                    <span
                      key={kw}
                      className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-gray-500 mt-2 italic">
                  💡 Add these keywords to your resume to improve your match score.
                </p>
              </div>
            )}

            <p className="text-[10px] text-gray-400 text-center">
              ✨ Keywords are highlighted live on the resume preview
            </p>
          </div>
        )}

        {jobMatchResult && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2 text-xs">
            <h4 className="font-bold text-gray-900">AI Analysis Results</h4>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{jobMatchResult}</p>
          </div>
        )}
      </div>

      {/* 3. Quick AI Generators */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
          <Wand2 size={15} className="text-gray-900" />
          <span>Quick AI Content Actions</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleGenerateSummary}
            disabled={aiSummaryLoading}
            className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-black bg-gray-50 hover:bg-white text-xs font-semibold text-gray-900 transition cursor-pointer disabled:opacity-50"
          >
            <span>Auto-Generate Summary</span>
            {aiSummaryLoading ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} className="text-amber-500" />}
          </button>

          <button
            type="button"
            onClick={handleSuggestSkills}
            disabled={suggestSkillsLoading}
            className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-black bg-gray-50 hover:bg-white text-xs font-semibold text-gray-900 transition cursor-pointer disabled:opacity-50"
          >
            <span>Suggest Relevant Skills</span>
            {suggestSkillsLoading ? <RefreshCw size={13} className="animate-spin" /> : <Wand2 size={13} className="text-gray-700" />}
          </button>
        </div>
      </div>

      {/* 4. Tailor for Job Description (1-Click Fork) */}
      <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-black flex items-center justify-center font-bold">
            <GitFork size={16} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Tailor for Job (1-Click Fork)</h4>
            <p className="text-[11px] text-gray-400">Match score, duplicate & auto-populate keywords</p>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          Paste a target job posting or URL. The AI will score ATS match, duplicate your resume into a dedicated version (e.g., <em>"Tailored for Stripe"</em>), and pre-populate missing keywords into your experience bullets.
        </p>

        <button
          type="button"
          onClick={onOpenJobMatch}
          className="w-full py-2.5 bg-white hover:bg-gray-100 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
        >
          <span>Open Tailor & Fork Engine</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 5. AI Interview Prep Kit */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <MessageSquare size={16} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">AI Interview Prep Kit</h4>
            <p className="text-[11px] text-gray-500">STAR talking points & Top 10 Recruiter questions</p>
          </div>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          Transforms each of your work experience bullets into structured interview stories (Situation, Task, Action, Result) and predicts the top 10 technical & behavioral questions recruiters will ask.
        </p>

        <button
          type="button"
          onClick={onOpenInterviewPrep}
          className="w-full py-2.5 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
        >
          <Sparkles size={13} className="text-amber-400" />
          <span>Launch AI Interview Prep Kit</span>
        </button>
      </div>

      {/* 6. AI Cover Letter Generator */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <FileText size={16} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">AI Cover Letter Generator</h4>
            <p className="text-[11px] text-gray-500">Synced with resume skills & target company tone</p>
          </div>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          Draft a compelling, recruiter-ready cover letter tailored directly to any company or job description. Choose between Confident, Startup, Executive, or Creative tones, edit directly, and export to PDF.
        </p>

        <button
          type="button"
          onClick={onOpenCoverLetter}
          className="w-full py-2.5 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
        >
          <Sparkles size={13} className="text-purple-300" />
          <span>Draft AI Cover Letter</span>
        </button>
      </div>
    </div>
  );
}

export default AIToolsPanel;
