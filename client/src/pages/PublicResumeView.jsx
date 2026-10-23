import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Download,
  FileText,
  FileCode,
  FileSignature,
  Lock,
  Mail,
  Phone,
  RefreshCw,
  ExternalLink,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import ResumePreview from "../components/resume/templates/ResumePreview";
import { getPublicResume, trackPublicDownload } from "../services/resumeService";
import { downloadResumePDF } from "../utils/pdfExport";
import { downloadResumeDocx } from "../utils/docxExport";
import { downloadAtsPlainText } from "../utils/atsTextExport";

function LinkedinIcon({ size = 14, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function PublicResumeView() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadResume(id);
    }
  }, [id]);

  const loadResume = async (resId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getPublicResume(resId);
      if (res.data?.success && res.data.resume) {
        setResume(res.data.resume);
      } else {
        setError(res.data?.message || "Resume not found");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "This resume is private or no longer available.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format) => {
    if (!resume) return;
    try {
      setDownloading(format);
      trackPublicDownload(id).catch(() => {});

      if (format === "pdf") {
        await downloadResumePDF("resume-preview-content", resume);
      } else if (format === "docx") {
        await downloadResumeDocx(resume);
      } else if (format === "txt") {
        downloadAtsPlainText(resume);
      }
    } finally {
      setDownloading(null);
    }
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={32} className="animate-spin text-black" />
          <p className="text-sm font-semibold text-gray-700">Loading Resume...</p>
        </div>
      </div>
    );
  }

  // Private / Not Found Screen
  if (error || !resume) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-gray-50">
        <header className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-gray-900">
                Career<span className="text-amber-500">Forge</span> AI
              </span>
            </Link>
          </div>
        </header>

        <main className="max-w-md mx-auto p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-gray-200 text-gray-700 flex items-center justify-center mx-auto shadow-inner">
            <Lock size={28} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Resume is Private</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            {error || "The author has made this resume private or disabled the public web link."}
          </p>

          <div className="pt-2">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-xs"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span>Create Your Own Resume</span>
            </Link>
          </div>
        </main>

        <footer className="p-6 text-center text-xs text-gray-400 border-t border-gray-200 bg-white">
          CareerForge AI • Intelligent Candidate Resume Builder
        </footer>
      </div>
    );
  }

  const p = resume.personalInfo || {};

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between selection:bg-black selection:text-white">
      {/* ── Recruiter Top Sticky Bar ── */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 py-3 sticky top-0 z-40 shadow-xs print:hidden">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Candidate identity */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <Link to="/" className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-black text-xs shrink-0">
              CF
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold text-gray-900 tracking-tight">
                  {p.fullName || resume.title || "Resume"}
                </h1>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-green-100 text-green-800">
                  Verified Candidate
                </span>
              </div>
              {p.jobTitle && <p className="text-xs text-gray-500">{p.jobTitle}</p>}
            </div>
          </div>

          {/* Action buttons for recruiters */}
          <div className="flex items-center gap-2 flex-wrap justify-end w-full sm:w-auto">
            {/* Contact Dropdown */}
            {(p.email || p.phone || p.linkedin) && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsContactOpen(!isContactOpen)}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition cursor-pointer"
                >
                  <Mail size={13} className="text-amber-600" />
                  <span>Contact</span>
                  <ChevronDown size={13} className="text-gray-400" />
                </button>

                {isContactOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-50 animate-in fade-in duration-150 space-y-1">
                    {p.email && (
                      <a
                        href={`mailto:${p.email}`}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition"
                      >
                        <Mail size={14} className="text-gray-400" />
                        <span className="truncate">{p.email}</span>
                      </a>
                    )}
                    {p.phone && (
                      <a
                        href={`tel:${p.phone}`}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition"
                      >
                        <Phone size={14} className="text-gray-400" />
                        <span className="truncate">{p.phone}</span>
                      </a>
                    )}
                    {p.linkedin && (
                      <a
                        href={p.linkedin.startsWith("http") ? p.linkedin : `https://${p.linkedin}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition"
                      >
                        <LinkedinIcon size={14} className="text-blue-600" />
                        <span>LinkedIn Profile</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Word .docx */}
            <button
              type="button"
              onClick={() => handleDownload("docx")}
              disabled={Boolean(downloading)}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl transition cursor-pointer shadow-2xs disabled:opacity-50"
              title="Download editable Microsoft Word format"
            >
              {downloading === "docx" ? <RefreshCw size={13} className="animate-spin" /> : <FileCode size={13} className="text-blue-600" />}
              <span className="hidden md:inline">Word</span>
              <span>.docx</span>
            </button>

            {/* ATS .txt */}
            <button
              type="button"
              onClick={() => handleDownload("txt")}
              disabled={Boolean(downloading)}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl transition cursor-pointer shadow-2xs disabled:opacity-50"
              title="Download clean plain-text format"
            >
              {downloading === "txt" ? <RefreshCw size={13} className="animate-spin" /> : <FileSignature size={13} className="text-amber-600" />}
              <span className="hidden md:inline">ATS</span>
              <span>.txt</span>
            </button>

            {/* Primary PDF Download */}
            <button
              type="button"
              onClick={() => handleDownload("pdf")}
              disabled={Boolean(downloading)}
              className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-xs disabled:opacity-50"
            >
              {downloading === "pdf" ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Resume Preview Body ── */}
      <main className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full flex justify-center">
        <ResumePreview resume={resume} isFullPage={true} />
      </main>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center text-xs text-gray-500 print:hidden">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{p.fullName ? `© ${new Date().getFullYear()} ${p.fullName}` : "CareerForge AI"}</span>
          <Link
            to="/signup"
            className="flex items-center gap-1 text-gray-700 hover:text-black font-semibold transition"
          >
            <span>Powered by CareerForge AI Resume Builder</span>
            <ExternalLink size={12} />
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default PublicResumeView;
