import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Download,
  Building2,
  Briefcase,
  Sliders,
  Send,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import { useResume } from "../../../context/ResumeContext";
import { generateCoverLetter } from "../../../services/resumeService";

const TONES = [
  { id: "confident", label: "Confident & Direct", desc: "Results-driven, metrics-focused" },
  { id: "startup", label: "Enthusiastic Startup", desc: "High energy, mission & ownership" },
  { id: "executive", label: "Executive & Formal", desc: "Strategic leadership, high polish" },
  { id: "creative", label: "Creative Storytelling", desc: "Memorable narrative & authentic voice" },
];

export function CoverLetterModal({
  isOpen,
  onClose,
  initialCompany = "",
  initialJobDesc = "",
}) {
  const { resume } = useResume();
  const [companyName, setCompanyName] = useState(initialCompany);
  const [jobDescription, setJobDescription] = useState(initialJobDesc);
  const [tone, setTone] = useState("confident");
  const [loading, setLoading] = useState(false);
  const [coverLetterText, setCoverLetterText] = useState("");
  const [keyHighlights, setKeyHighlights] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialCompany) setCompanyName(initialCompany);
    if (initialJobDesc) setJobDescription(initialJobDesc);
  }, [initialCompany, initialJobDesc]);

  if (!isOpen) return null;

  const handleGenerate = async (overrideTone) => {
    const activeTone = overrideTone || tone;
    try {
      setLoading(true);
      const res = await generateCoverLetter(resume, jobDescription, companyName, activeTone);
      if (res?.data?.success) {
        setCoverLetterText(res.data.coverLetter);
        setKeyHighlights(res.data.keyHighlights || []);
        toast.success(`Cover letter generated in "${activeTone}" tone!`);
      } else {
        toast.error("Failed to generate cover letter");
      }
    } catch (err) {
      console.error("Cover Letter Generation Error:", err);
      toast.error("Error generating cover letter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!coverLetterText) return;
    navigator.clipboard.writeText(coverLetterText);
    setCopied(true);
    toast.success("Cover letter copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTxt = () => {
    if (!coverLetterText) return;
    const blob = new Blob([coverLetterText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const name = resume.personalInfo?.fullName
      ? resume.personalInfo.fullName.replace(/\s+/g, "_")
      : "Candidate";
    const comp = companyName ? `_${companyName.replace(/\s+/g, "_")}` : "";
    link.href = url;
    link.download = `${name}_Cover_Letter${comp}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Cover letter downloaded as .txt!");
  };

  const handlePrint = () => {
    if (!coverLetterText) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Pop-up blocked! Please allow pop-ups to print.");
      return;
    }
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${resume.personalInfo?.fullName || "Candidate"} - Cover Letter</title>
          <style>
            body {
              font-family: 'Times New Roman', Times, serif;
              font-size: 11pt;
              line-height: 1.6;
              color: #111;
              max-width: 750px;
              margin: 40px auto;
              padding: 0 20px;
              white-space: pre-wrap;
            }
            @media print {
              body { margin: 20mm; }
            }
          </style>
        </head>
        <body>${coverLetterText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.18 }}
          className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shadow-xs">
                <FileText size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span>AI Cover Letter Generator</span>
                  <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Synced with Resume
                  </span>
                </h3>
                <p className="text-xs text-gray-500">
                  Tailored to your target company, achievements, and desired tone.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-black transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {!coverLetterText ? (
              /* Configuration Form */
              <div className="space-y-5 max-w-2xl mx-auto py-2">
                {/* Target Company & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Target Company Name
                    </label>
                    <div className="relative">
                      <Building2
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Stripe, Google, Linear, Figma..."
                        className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:bg-white outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Candidate Role
                    </label>
                    <div className="relative">
                      <Briefcase
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        disabled
                        value={resume.personalInfo?.jobTitle || "Software Engineer / Professional"}
                        className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Tone Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Writing Tone
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TONES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTone(t.id)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          tone === t.id
                            ? "border-black bg-gray-50 ring-1 ring-black"
                            : "border-gray-200 hover:border-gray-400 bg-white"
                        }`}
                      >
                        <span className="text-xs font-bold text-gray-900 mb-0.5">{t.label}</span>
                        <span className="text-[10px] text-gray-500">{t.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Job Description */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Target Job Description (Optional but recommended)
                    </label>
                    <span className="text-[11px] text-gray-400">Pasting text helps AI target key requirements</span>
                  </div>
                  <textarea
                    rows={5}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste job posting duties, key qualifications, or mission statement here..."
                    className="w-full text-xs p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:bg-white outline-none transition leading-relaxed"
                  />
                </div>

                {/* Generate Action */}
                <button
                  type="button"
                  onClick={() => handleGenerate()}
                  disabled={loading}
                  className="w-full py-3.5 bg-black hover:bg-gray-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Drafting Tailored Cover Letter with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} className="text-amber-400" />
                      <span>Generate Professional Cover Letter</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Generated Cover Letter Editor & Preview */
              <div className="space-y-4">
                {/* Tone Switcher & Highlights */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 border border-gray-200 p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-700">Tone:</span>
                    <div className="flex flex-wrap gap-1">
                      {TONES.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          disabled={loading}
                          onClick={() => {
                            setTone(t.id);
                            handleGenerate(t.id);
                          }}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition cursor-pointer font-medium ${
                            tone === t.id
                              ? "bg-black text-white border-black font-semibold"
                              : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {keyHighlights.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <span className="font-semibold text-gray-700">Matched Skills:</span>
                      <div className="flex flex-wrap gap-1">
                        {keyHighlights.map((k) => (
                          <span
                            key={k}
                            className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-md font-semibold border border-green-200"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Editable Letter Canvas */}
                <div className="border border-gray-300 rounded-2xl shadow-sm overflow-hidden bg-white">
                  <div className="bg-gray-100/70 border-b border-gray-200 px-4 py-2 flex items-center justify-between text-xs text-gray-500">
                    <span className="font-mono text-[11px]">Cover Letter (Editable Draft)</span>
                    <span>Click anywhere in text to edit directly</span>
                  </div>
                  <textarea
                    rows={16}
                    value={coverLetterText}
                    onChange={(e) => setCoverLetterText(e.target.value)}
                    className="w-full p-6 text-sm text-gray-900 font-serif leading-relaxed outline-none border-none resize-y min-h-[360px]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          {coverLetterText && (
            <div className="p-4 px-6 border-t border-gray-100 bg-gray-50 shrink-0 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCoverLetterText("")}
                className="text-xs font-semibold text-gray-600 hover:text-black transition cursor-pointer"
              >
                ← Back to Settings
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-300 hover:border-black bg-white text-gray-800 text-xs font-semibold transition cursor-pointer shadow-xs"
                >
                  {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  <span>{copied ? "Copied!" : "Copy Text"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-300 hover:border-black bg-white text-gray-800 text-xs font-semibold transition cursor-pointer shadow-xs"
                >
                  <Download size={14} />
                  <span>Download .txt</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                >
                  <FileText size={14} />
                  <span>Print / Save as PDF</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default CoverLetterModal;
