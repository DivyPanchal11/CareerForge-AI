import React, { useState } from "react";
import { Sparkles, CheckCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { useResume } from "../../../context/ResumeContext";
import { generateSummary, improveWriting, checkGrammar } from "../../../services/resumeService";

export function SummaryEditor() {
  const { resume, setResume } = useResume();
  const summary = resume.summary || "";
  const [loading, setLoading] = useState(false);

  const wordCount = summary.trim() ? summary.trim().split(/\s+/).length : 0;
  const charCount = summary.length;

  const handleChange = (e) => {
    setResume((prev) => ({ ...prev, summary: e.target.value }));
  };

  const handleGenerateAI = async () => {
    try {
      setLoading(true);
      const res = await generateSummary(resume);
      if (res.data.success && res.data.result) {
        setResume((prev) => ({ ...prev, summary: res.data.result }));
        toast.success("AI Professional Summary generated!");
      }
    } catch (err) {
      toast.error("Failed to generate summary with AI");
    } finally {
      setLoading(false);
    }
  };

  const handleImproveWriting = async () => {
    if (!summary) {
      toast.error("Please enter a summary first");
      return;
    }
    try {
      setLoading(true);
      const res = await improveWriting(summary, "professional summary");
      if (res.data.success && res.data.result) {
        setResume((prev) => ({ ...prev, summary: res.data.result }));
        toast.success("Summary tone and phrasing improved!");
      }
    } catch (err) {
      toast.error("Failed to improve writing");
    } finally {
      setLoading(false);
    }
  };

  const handleGrammarCheck = async () => {
    if (!summary) return;
    try {
      setLoading(true);
      const res = await checkGrammar(summary);
      if (res.data.success && res.data.text) {
        setResume((prev) => ({ ...prev, summary: res.data.text }));
        toast.success("Grammar check completed!");
      }
    } catch (err) {
      toast.error("Grammar check failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center pb-2">
        <label className="text-xs font-bold text-gray-700">
          Professional Summary
        </label>

        {/* AI Action Buttons */}
        <button
          type="button"
          onClick={handleGenerateAI}
          disabled={loading}
          className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} className="text-amber-400" />}
          <span>Generate AI Summary</span>
        </button>
      </div>

      <div className="relative">
        <textarea
          rows={6}
          value={summary}
          onChange={handleChange}
          placeholder="e.g. Results-oriented Software Engineer with 4+ years of experience in designing scalable microservices and React web applications..."
          className="w-full rounded-xl border border-gray-300 p-3.5 text-sm text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none transition"
        />

        {/* Counters */}
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleImproveWriting}
              disabled={loading || !summary}
              className="text-xs text-gray-700 hover:text-black font-semibold underline disabled:opacity-40"
            >
              Improve Writing
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={handleGrammarCheck}
              disabled={loading || !summary}
              className="text-xs text-gray-700 hover:text-black font-semibold underline disabled:opacity-40"
            >
              Check Grammar
            </button>
          </div>

          <div className="font-mono">
            {wordCount} words | {charCount} chars
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryEditor;
