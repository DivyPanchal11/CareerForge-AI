import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Eye,
  Download,
  Clock,
  Globe,
  Lock,
  RefreshCw,
  Mail,
  MessageCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { togglePublicStatus, getResumeAnalytics } from "../../../services/resumeService";

function LinkedinIcon({ size = 12, className = "" }) {
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

export function ShareResumeModal({ isOpen, onClose, resumeId, initialPublic = false }) {
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [analytics, setAnalytics] = useState({
    viewsCount: 0,
    downloadsCount: 0,
    lastViewedAt: null,
  });
  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [copied, setCopied] = useState(false);

  const publicUrl = `${window.location.origin}/view/${resumeId}`;

  // Fetch analytics whenever modal opens
  useEffect(() => {
    if (isOpen && resumeId) {
      loadAnalytics();
    }
  }, [isOpen, resumeId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await getResumeAnalytics(resumeId);
      if (res.data?.success && res.data.analytics) {
        setIsPublic(Boolean(res.data.analytics.isPublic));
        setAnalytics({
          viewsCount: res.data.analytics.viewsCount || 0,
          downloadsCount: res.data.analytics.downloadsCount || 0,
          lastViewedAt: res.data.analytics.lastViewedAt,
        });
      }
    } catch (err) {
      console.warn("Could not load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    try {
      setToggling(true);
      const newStatus = !isPublic;
      const res = await togglePublicStatus(resumeId, newStatus);
      if (res.data?.success) {
        setIsPublic(res.data.isPublic);
        setAnalytics((prev) => ({
          ...prev,
          viewsCount: res.data.viewsCount || prev.viewsCount,
          downloadsCount: res.data.downloadsCount || prev.downloadsCount,
          lastViewedAt: res.data.lastViewedAt || prev.lastViewedAt,
        }));
        toast.success(res.data.isPublic ? "Public link activated! Anyone with link can view." : "Public link disabled.");
      }
    } catch (err) {
      toast.error("Failed to update public status");
    } finally {
      setToggling(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success("Shareable link copied to clipboard!", { icon: "🔗" });
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  // Format relative or readable date
  const formatLastViewed = (dateStr) => {
    if (!dateStr) return "Not viewed yet";
    const date = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return "Just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (!isOpen) return null;

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
                <Share2 size={18} className="text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 tracking-tight">Public Share & Analytics</h3>
                <p className="text-xs text-gray-500">Generate a view-only web link and track recruiter engagement</p>
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

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* 1. Public Link Toggle Card */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isPublic ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {isPublic ? <Globe size={18} /> : <Lock size={18} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-gray-900">
                      {isPublic ? "Public Web Link Active" : "Public Link Disabled"}
                    </h4>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                        isPublic ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {isPublic ? "Live" : "Private"}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {isPublic
                      ? "Anyone with the link can view your formatted resume."
                      : "Only you can view and edit this resume while logged in."}
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={handleToggle}
                  disabled={toggling}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black" />
              </label>
            </div>

            {/* 2. Shareable Link Box (Visible when active) */}
            {isPublic && (
              <div className="space-y-2 animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-gray-700">Shareable Web Link</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={publicUrl}
                    className="flex-1 text-xs font-mono p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 outline-none select-all truncate"
                  />

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-xs font-bold px-3.5 py-3 rounded-xl transition cursor-pointer shadow-xs shrink-0"
                  >
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>

                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition cursor-pointer shrink-0"
                    title="Open in new tab"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>

                {/* Quick Share Pills */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">Share on:</span>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] font-semibold text-gray-700 hover:text-black bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-lg transition"
                  >
                    <LinkedinIcon size={12} className="text-blue-600" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Check out my resume: ${publicUrl}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] font-semibold text-gray-700 hover:text-black bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-lg transition"
                  >
                    <MessageCircle size={12} className="text-green-600" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`mailto:?subject=${encodeURIComponent("My Resume")}&body=${encodeURIComponent(`Hi,\n\nPlease find my resume at: ${publicUrl}\n\nBest regards.`)}`}
                    className="flex items-center gap-1 text-[11px] font-semibold text-gray-700 hover:text-black bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-lg transition"
                  >
                    <Mail size={12} className="text-amber-600" />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            )}

            {/* 3. View & Engagement Analytics */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
                  <span>Recruiter Engagement Analytics</span>
                </h4>
                <button
                  type="button"
                  onClick={loadAnalytics}
                  disabled={loading}
                  className="text-[11px] font-semibold text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Views */}
                <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-center">
                  <div className="flex items-center justify-center text-gray-400 mb-1">
                    <Eye size={16} />
                  </div>
                  <div className="text-xl font-black text-gray-900">{analytics.viewsCount}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                    Total Views
                  </div>
                </div>

                {/* Downloads */}
                <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-center">
                  <div className="flex items-center justify-center text-gray-400 mb-1">
                    <Download size={16} />
                  </div>
                  <div className="text-xl font-black text-gray-900">{analytics.downloadsCount}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                    Downloads
                  </div>
                </div>

                {/* Last Activity */}
                <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-center flex flex-col justify-between">
                  <div className="flex items-center justify-center text-gray-400 mb-1">
                    <Clock size={16} />
                  </div>
                  <div className="text-xs font-bold text-gray-900 truncate">
                    {formatLastViewed(analytics.lastViewedAt)}
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                    Last Viewed
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 text-center italic pt-1">
                💡 Every view or download by recruiters increments your counters in real-time.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ShareResumeModal;
