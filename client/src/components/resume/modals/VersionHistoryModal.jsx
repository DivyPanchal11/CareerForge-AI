import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  History,
  Clock,
  Plus,
  RotateCcw,
  Trash2,
  Check,
  Bookmark,
  Calendar,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useResume } from "../../../context/ResumeContext";

export function VersionHistoryModal({ isOpen, onClose }) {
  const { resume, createVersion, restoreVersion, deleteVersion } = useResume();
  const [snapshotName, setSnapshotName] = useState("");
  const [confirmRestoreId, setConfirmRestoreId] = useState(null);

  if (!isOpen) return null;

  const versions = resume.versions || [];

  const handleCreate = (e) => {
    e.preventDefault();
    if (!snapshotName.trim()) {
      toast.error("Please enter a version name");
      return;
    }
    const created = createVersion(snapshotName);
    toast.success(`Saved snapshot "${created.name}"!`, { icon: "📸" });
    setSnapshotName("");
  };

  const handleRestore = (ver) => {
    const success = restoreVersion(ver.id);
    if (success) {
      toast.success(`Restored "${ver.name}"!`, { icon: "⏪" });
      setConfirmRestoreId(null);
      onClose();
    } else {
      toast.error("Failed to restore version");
    }
  };

  const handleDelete = (verId, verName, e) => {
    e.stopPropagation();
    deleteVersion(verId);
    toast.success(`Deleted snapshot "${verName}"`);
  };

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Unknown date";
    }
  };

  const quickPicks = [
    "Tech Lead Application",
    "Startup Focused Version",
    "Condensed 1-Page Draft",
    "Executive Role Draft",
    "Pre-Review Snapshot",
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 flex flex-col max-h-[88vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs">
                <History size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 tracking-tight">
                  Version History & Snapshots
                </h3>
                <p className="text-xs text-gray-500">
                  Save named versions and roll back anytime with 1 click.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-black rounded-xl hover:bg-gray-100 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Create Snapshot Box */}
            <form onSubmit={handleCreate} className="space-y-2.5 bg-gray-50 border border-gray-200/90 rounded-2xl p-4">
              <label className="block text-xs font-bold text-gray-800">
                Save Current Resume as Named Snapshot
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Google SWE Application - Nov 2024"
                  value={snapshotName}
                  onChange={(e) => setSnapshotName(e.target.value)}
                  className="flex-1 bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer shadow-xs shrink-0"
                >
                  <Plus size={14} />
                  <span>Save Snapshot</span>
                </button>
              </div>

              {/* Quick Picks */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mr-1">
                  Suggestions:
                </span>
                {quickPicks.map((pick) => (
                  <button
                    key={pick}
                    type="button"
                    onClick={() => setSnapshotName(pick)}
                    className="text-[10px] font-semibold text-gray-600 bg-white hover:bg-gray-200 border border-gray-200 px-2 py-0.5 rounded-md transition cursor-pointer"
                  >
                    + {pick}
                  </button>
                ))}
              </div>
            </form>

            {/* Saved Versions List */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Saved Snapshots ({versions.length})
                </h4>
                <span className="text-[11px] text-gray-400">
                  Ctrl+Z / Ctrl+Y active in builder
                </span>
              </div>

              {versions.length === 0 ? (
                <div className="text-center py-10 px-4 border-2 border-dashed border-gray-200 rounded-2xl space-y-2 bg-gray-50/40">
                  <Bookmark size={26} className="mx-auto text-gray-300" />
                  <p className="text-xs font-bold text-gray-700">No snapshots saved yet</p>
                  <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
                    Take a snapshot before applying to a specific company or experimenting with different templates!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {versions.map((ver) => {
                    const isConfirming = confirmRestoreId === ver.id;
                    const expCount = ver.resumeData?.experience?.length || 0;
                    const skillsCount = ver.resumeData?.skills?.length || 0;

                    return (
                      <div
                        key={ver.id}
                        className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-3.5 transition flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-bold text-gray-900 truncate">
                              {ver.name}
                            </h5>
                            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md capitalize shrink-0">
                              {ver.resumeData?.template || "Modern"}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar size={11} />
                              {formatDate(ver.createdAt)}
                            </span>
                            <span>•</span>
                            <span>{expCount} jobs</span>
                            <span>•</span>
                            <span>{skillsCount} skills</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {isConfirming ? (
                            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl animate-in fade-in">
                              <span className="text-[10px] font-bold text-amber-900">
                                Restore this?
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRestore(ver)}
                                className="text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-white px-2 py-0.5 rounded-md transition cursor-pointer"
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmRestoreId(null)}
                                className="text-[10px] font-bold text-gray-600 hover:text-black px-1.5 py-0.5 cursor-pointer"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmRestoreId(ver.id)}
                              className="flex items-center gap-1.5 text-xs font-bold bg-gray-100 hover:bg-black hover:text-white text-gray-800 px-3 py-1.5 rounded-xl transition cursor-pointer"
                              title="Restore resume to this snapshot"
                            >
                              <RotateCcw size={12} />
                              <span>Restore</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={(e) => handleDelete(ver.id, ver.name, e)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                            title="Delete snapshot"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1 text-[11px]">
              <AlertCircle size={12} className="text-gray-400" />
              Restoring automatically preserves current draft in Undo history
            </span>
            <button
              onClick={onClose}
              className="font-bold text-gray-700 hover:text-black cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default VersionHistoryModal;
