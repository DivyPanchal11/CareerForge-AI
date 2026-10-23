import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Download, Printer, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/auth/Navbar";
import ResumePreview from "../components/resume/templates/ResumePreview";
import { getResumeById } from "../services/resumeService";
import { downloadResumePDF } from "../utils/pdfExport";
import ExportResumeModal from "../components/resume/modals/ExportResumeModal";
import ShareResumeModal from "../components/resume/modals/ShareResumeModal";

export function ResumePreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadResume(id);
    }
  }, [id]);

  const loadResume = async (resId) => {
    try {
      setLoading(true);
      const res = await getResumeById(resId);
      if (res.data.success && res.data.resume) {
        setResume(res.data.resume);
      }
    } catch (err) {
      toast.error("Failed to load resume preview");
      navigate("/resumes");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    await downloadResumePDF("resume-preview-content", resume);
    setDownloading(false);
  };

  const handlePrint = async () => {
    if (downloading) return;
    setDownloading(true);
    await downloadResumePDF("resume-preview-content", resume);
    setDownloading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={32} className="animate-spin text-black" />
          <p className="text-sm font-medium text-gray-600">Loading Resume Preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      <Navbar />

      <div className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-30 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/resume/${id}/edit`)}
              className="flex items-center gap-1.5 p-2 text-gray-700 hover:text-black font-semibold text-xs rounded-lg hover:bg-gray-100 transition cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back to Builder</span>
            </button>
            <h2 className="text-base font-bold text-gray-900">{resume?.title || "Resume Preview"}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl border border-gray-200 transition cursor-pointer"
              title="Print Resume"
            >
              <Printer size={15} />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl border border-gray-200 transition cursor-pointer"
              title="Share Link & Recruiter Analytics"
            >
              <Share2 size={15} className={resume?.isPublic ? "text-emerald-600" : "text-gray-500"} />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer shadow-xs"
              title="Export (.pdf, .docx, .txt)"
            >
              <Download size={14} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full flex justify-center">
        {resume && <ResumePreview resume={resume} isFullPage={true} />}
      </main>

      {resume && (
        <>
          <ExportResumeModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            resume={resume}
            onOpenShareModal={() => setIsShareModalOpen(true)}
          />

          <ShareResumeModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            resumeId={id}
            initialPublic={resume.isPublic}
          />
        </>
      )}
    </div>
  );
}

export default ResumePreviewPage;
