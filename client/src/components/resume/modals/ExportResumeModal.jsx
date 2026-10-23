import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  FileText,
  FileCode,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Printer,
  RefreshCw,
  Share2,
} from "lucide-react";
import toast from "react-hot-toast";
import { downloadResumePDF } from "../../../utils/pdfExport";
import { downloadResumeDocx } from "../../../utils/docxExport";
import { downloadAtsPlainText, copyAtsPlainTextToClipboard } from "../../../utils/atsTextExport";

export function ExportResumeModal({ isOpen, onClose, resume, onOpenShareModal }) {
  const [downloadingFormat, setDownloadingFormat] = useState(null);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    try {
      setDownloadingFormat("pdf");
      await downloadResumePDF("resume-preview-content", resume);
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleDownloadDocx = async () => {
    try {
      setDownloadingFormat("docx");
      await downloadResumeDocx(resume);
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleDownloadTxt = () => {
    try {
      setDownloadingFormat("txt");
      downloadAtsPlainText(resume);
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleCopyAtsText = async () => {
    const success = await copyAtsPlainTextToClipboard(resume);
    if (success) {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shadow-xs">
                <Download size={18} className="text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 tracking-tight">Export Resume</h3>
                <p className="text-xs text-gray-500">Choose your preferred format for applications and recruiters</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-black rounded-xl hover:bg-gray-100 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Formats Grid */}
          <div className="p-6 space-y-3.5">
            {/* 1. PDF Document */}
            <div className="p-4 rounded-2xl border border-gray-200 hover:border-black bg-white hover:bg-gray-50/50 transition flex items-center justify-between group">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-900">PDF Document</h4>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800">
                      Standard
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Crisp vector graphics, ATS-parseable text layer & print-perfect layout.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={downloadingFormat === "pdf"}
                className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer shadow-xs shrink-0 ml-3 disabled:opacity-50"
              >
                {downloadingFormat === "pdf" ? <RefreshCw size={13} className="animate-spin" /> : <Download size={13} />}
                <span>Download</span>
              </button>
            </div>

            {/* 2. Microsoft Word (.docx) */}
            <div className="p-4 rounded-2xl border border-gray-200 hover:border-black bg-white hover:bg-gray-50/50 transition flex items-center justify-between group">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                  <FileCode size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-900">Word Document (.docx)</h4>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800">
                      Recruiter
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Fully editable Word file for agency recruiters and portals requiring .docx.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadDocx}
                disabled={downloadingFormat === "docx"}
                className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer shadow-xs shrink-0 ml-3 disabled:opacity-50"
              >
                {downloadingFormat === "docx" ? <RefreshCw size={13} className="animate-spin" /> : <Download size={13} />}
                <span>Download</span>
              </button>
            </div>

            {/* 3. Clean ATS Plain-Text (.txt) */}
            <div className="p-4 rounded-2xl border border-gray-200 hover:border-black bg-white hover:bg-gray-50/50 transition flex items-center justify-between group">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-900">Clean ATS Text (.txt)</h4>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900">
                      Workday & Taleo
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Pure UTF-8 text with clean delimiters for enterprise corporate portals.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-3">
                <button
                  type="button"
                  onClick={handleCopyAtsText}
                  className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-2 rounded-xl transition cursor-pointer"
                  title="Copy plain text to clipboard"
                >
                  {copiedText ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                  <span>{copiedText ? "Copied" : "Copy"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  disabled={downloadingFormat === "txt"}
                  className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer shadow-xs disabled:opacity-50"
                  title="Download .txt file"
                >
                  {downloadingFormat === "txt" ? <RefreshCw size={13} className="animate-spin" /> : <Download size={13} />}
                  <span>.txt</span>
                </button>
              </div>
            </div>

            {/* Public Link Callout */}
            {onOpenShareModal && (
              <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <Share2 size={13} className="text-black" />
                    <span>Need a public link for recruiters?</span>
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Enable a responsive web link with view count analytics.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenShareModal();
                  }}
                  className="text-xs font-bold text-black hover:underline cursor-pointer flex items-center gap-1 shrink-0 ml-2"
                >
                  <span>Share Link</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ExportResumeModal;
