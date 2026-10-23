import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Camera,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  Circle,
  Square,
  Sparkles,
  Upload,
  Trash2,
  Move,
  Sliders,
} from "lucide-react";
import toast from "react-hot-toast";
import { useResume, defaultPhotoSettings } from "../../../context/ResumeContext";

/**
 * In-browser Photo Editor & Styling Modal
 * - Shape & Border Picker (Circle, Rounded Square, Square + width & primary ring)
 * - B&W / Grayscale Filter toggle
 * - Crop & Zoom with interactive drag-to-pan & zoom slider
 */
export function PhotoEditorModal({ isOpen, onClose }) {
  const { resume, setResume } = useResume();
  const personalInfo = resume.personalInfo || {};
  const currentPhoto = personalInfo.photo || "";

  const themePrimaryColor = resume.theme?.primaryColor || "#000000";

  // Local working settings initialized from resume or defaults
  const [settings, setSettings] = useState({
    ...defaultPhotoSettings,
    ...(resume.photoSettings || {}),
  });

  // Keep local settings in sync when modal opens
  useEffect(() => {
    if (isOpen) {
      setSettings({
        ...defaultPhotoSettings,
        ...(resume.photoSettings || {}),
      });
    }
  }, [isOpen, resume.photoSettings]);

  // Drag-to-pan state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, initialPanX: 0, initialPanY: 0 });
  const viewportRef = useRef(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // ── Drag to Pan handlers ──
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialPanX: settings.panX || 0,
      initialPanY: settings.panY || 0,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    // Convert pixel delta to percentage offset relative to 240px viewport
    const sensitivity = 0.45;
    const newPanX = Math.max(-60, Math.min(60, Number((dragStartRef.current.initialPanX + deltaX * sensitivity).toFixed(1))));
    const newPanY = Math.max(-60, Math.min(60, Number((dragStartRef.current.initialPanY + deltaY * sensitivity).toFixed(1))));

    setSettings((prev) => ({
      ...prev,
      panX: newPanX,
      panY: newPanY,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile / touch devices
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      dragStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        initialPanX: settings.panX || 0,
        initialPanY: settings.panY || 0,
      };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartRef.current.x;
    const deltaY = touch.clientY - dragStartRef.current.y;

    const sensitivity = 0.45;
    const newPanX = Math.max(-60, Math.min(60, Number((dragStartRef.current.initialPanX + deltaX * sensitivity).toFixed(1))));
    const newPanY = Math.max(-60, Math.min(60, Number((dragStartRef.current.initialPanY + deltaY * sensitivity).toFixed(1))));

    setSettings((prev) => ({
      ...prev,
      panX: newPanX,
      panY: newPanY,
    }));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Wheel to Zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    const newZoom = Math.max(1, Math.min(3, Number(((settings.zoom || 1) + delta).toFixed(2))));
    updateSetting("zoom", newZoom);
  };

  // Reset framing (center and 1x zoom)
  const handleResetFraming = () => {
    setSettings((prev) => ({
      ...prev,
      zoom: 1,
      panX: 0,
      panY: 0,
    }));
    toast.success("Framing reset to center");
  };

  // Photo upload from within modal
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setResume((prev) => ({
          ...prev,
          personalInfo: {
            ...(prev.personalInfo || {}),
            photo: reader.result,
          },
        }));
        // Reset pan & zoom for the new photo
        setSettings((prev) => ({
          ...prev,
          zoom: 1,
          panX: 0,
          panY: 0,
        }));
        toast.success("Photo uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setResume((prev) => ({
      ...prev,
      personalInfo: {
        ...(prev.personalInfo || {}),
        photo: "",
      },
    }));
    toast.success("Photo removed");
    onClose();
  };

  // Save changes to resume state
  const handleSave = () => {
    setResume((prev) => ({
      ...prev,
      photoSettings: { ...settings },
    }));
    toast.success("Profile photo styling saved!");
    onClose();
  };

  // Border color calculation
  const borderColor =
    settings.borderColor === "primary"
      ? themePrimaryColor
      : settings.borderColor === "neutral"
      ? "#E5E7EB"
      : settings.borderColor || themePrimaryColor;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] overflow-hidden"
        >
          {/* ── Modal Header ── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shadow-xs">
                <Camera size={18} className="text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 tracking-tight">Photo Editor & Framing</h3>
                <p className="text-xs text-gray-500">Shape, border ring, B&W filter, and in-browser pan & zoom</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-black rounded-xl hover:bg-gray-100 transition cursor-pointer"
              title="Close window"
            >
              <X size={18} />
            </button>
          </div>

          {/* ── Modal Body (Scrollable) ── */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* ── 1. Interactive Framing Canvas / Viewport ── */}
            <div className="flex flex-col items-center">
              {currentPhoto ? (
                <div className="space-y-3 flex flex-col items-center w-full">
                  <div
                    ref={viewportRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onWheel={handleWheel}
                    className={`relative w-60 h-60 bg-gray-900 rounded-3xl overflow-hidden cursor-grab shadow-inner select-none flex items-center justify-center ${
                      isDragging ? "cursor-grabbing" : ""
                    }`}
                    style={{ touchAction: "none" }}
                    title="Click and drag to pan image • Scroll to zoom"
                  >
                    {/* The draggable, scalable Image */}
                    <img
                      src={currentPhoto}
                      alt="Framing preview"
                      className="max-w-none w-full h-full object-cover pointer-events-none select-none transition-transform duration-75"
                      style={{
                        transform: `scale(${settings.zoom || 1}) translate(${settings.panX || 0}%, ${settings.panY || 0}%)`,
                        transformOrigin: "center center",
                        filter: settings.grayscale ? "grayscale(100%) contrast(105%)" : "none",
                      }}
                      draggable={false}
                    />

                    {/* Framing Mask Guide Overlay */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div
                        className="transition-all duration-200"
                        style={{
                          width: "180px",
                          height: "180px",
                          borderRadius:
                            settings.shape === "circle"
                              ? "50%"
                              : settings.shape === "rounded"
                              ? "22%"
                              : "0px",
                          borderWidth: `${Math.max(2, settings.borderWidth)}px`,
                          borderStyle: "solid",
                          borderColor: settings.borderWidth > 0 ? borderColor : "rgba(255, 255, 255, 0.8)",
                          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.45)",
                        }}
                      />
                    </div>

                    {/* Drag helper hint badge */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 pointer-events-none">
                      <Move size={10} />
                      <span>Drag to pan • Wheel to zoom</span>
                    </div>
                  </div>

                  {/* Zoom Bar & Quick Actions */}
                  <div className="w-full max-w-sm space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                      <span className="flex items-center gap-1.5">
                        <ZoomIn size={13} className="text-gray-500" />
                        <span>Zoom</span>
                      </span>
                      <span className="font-mono text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                        {Math.round((settings.zoom || 1) * 100)}%
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateSetting("zoom", Math.max(1, Number(((settings.zoom || 1) - 0.1).toFixed(2))))
                        }
                        className="p-1.5 rounded-lg border border-gray-200 hover:border-black text-gray-600 hover:text-black transition cursor-pointer"
                        title="Zoom out"
                      >
                        <ZoomOut size={14} />
                      </button>

                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.05"
                        value={settings.zoom || 1}
                        onChange={(e) => updateSetting("zoom", Number(e.target.value))}
                        className="flex-1 accent-black cursor-pointer"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          updateSetting("zoom", Math.min(3, Number(((settings.zoom || 1) + 0.1).toFixed(2))))
                        }
                        className="p-1.5 rounded-lg border border-gray-200 hover:border-black text-gray-600 hover:text-black transition cursor-pointer"
                        title="Zoom in"
                      >
                        <ZoomIn size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={handleResetFraming}
                        className="p-1.5 rounded-lg border border-gray-200 hover:border-black text-gray-600 hover:text-black transition cursor-pointer ml-1"
                        title="Center & reset framing"
                      >
                        <RotateCcw size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full py-10 px-6 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-center space-y-3 bg-gray-50/50">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <Camera size={28} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">No Photo Uploaded</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Upload a headshot to customize shapes, borders, and framing.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
                  >
                    <Upload size={14} />
                    <span>Upload Photo</span>
                  </button>
                </div>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            {/* ── 2. Shape Picker ── */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-700">Shape</label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: "circle", label: "Circle", previewClass: "rounded-full" },
                  { id: "rounded", label: "Rounded", previewClass: "rounded-xl" },
                  { id: "square", label: "Square", previewClass: "rounded-none" },
                ].map((s) => {
                  const isSelected = (settings.shape || "circle") === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => updateSetting("shape", s.id)}
                      className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-2 transition cursor-pointer ${
                        isSelected
                          ? "border-black bg-gray-50 ring-1 ring-black shadow-2xs font-bold text-black"
                          : "border-gray-200 hover:border-gray-300 bg-white text-gray-600"
                      }`}
                    >
                      <div className={`w-8 h-8 bg-gray-900 border-2 border-gray-400/50 ${s.previewClass}`} />
                      <span className="text-xs">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── 3. Border Width & Primary Ring ── */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-gray-700">Border Width</label>
                  <span className="text-[11px] text-gray-400">Ring thickness around the photo</span>
                </div>
                <span className="text-xs font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                  {settings.borderWidth !== undefined ? settings.borderWidth : 2}px
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {[0, 1, 2, 3, 4].map((bw) => {
                  const isSelected = (settings.borderWidth !== undefined ? settings.borderWidth : 2) === bw;
                  return (
                    <button
                      key={bw}
                      type="button"
                      onClick={() => updateSetting("borderWidth", bw)}
                      className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                        isSelected
                          ? "bg-black text-white border-black shadow-xs"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {bw === 0 ? "None" : `${bw}px`}
                    </button>
                  );
                })}
              </div>

              {/* Ring Color Choices */}
              {(settings.borderWidth !== undefined ? settings.borderWidth : 2) > 0 && (
                <div className="space-y-1.5 pt-1">
                  <label className="block text-[11px] font-semibold text-gray-600">Ring Color</label>
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Primary Color Ring (matches theme) */}
                    <button
                      type="button"
                      onClick={() => updateSetting("borderColor", "primary")}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                        settings.borderColor === "primary" || !settings.borderColor
                          ? "border-black bg-gray-100 text-black ring-1 ring-black"
                          : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                      }`}
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: themePrimaryColor }}
                      />
                      <span>Primary Ring</span>
                    </button>

                    {/* Neutral Ring */}
                    <button
                      type="button"
                      onClick={() => updateSetting("borderColor", "neutral")}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                        settings.borderColor === "neutral"
                          ? "border-black bg-gray-100 text-black ring-1 ring-black"
                          : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                      }`}
                    >
                      <div className="w-3.5 h-3.5 rounded-full bg-gray-300 border border-gray-400/30" />
                      <span>Neutral Gray</span>
                    </button>

                    {/* Dark Slate Ring */}
                    <button
                      type="button"
                      onClick={() => updateSetting("borderColor", "#1e293b")}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                        settings.borderColor === "#1e293b"
                          ? "border-black bg-gray-100 text-black ring-1 ring-black"
                          : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                      }`}
                    >
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-800" />
                      <span>Dark Slate</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── 4. B&W / Grayscale Filter Toggle ── */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 p-4 rounded-2xl">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} className={settings.grayscale ? "text-amber-500" : "text-gray-400"} />
                    <span className="text-xs font-bold text-gray-900">B&W / Grayscale Filter</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Classic black-and-white look standard in corporate, legal & executive resumes.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
                  <input
                    type="checkbox"
                    checked={Boolean(settings.grayscale)}
                    onChange={(e) => updateSetting("grayscale", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black" />
                </label>
              </div>
            </div>

            {/* ── 5. Actions: Change Photo / Delete ── */}
            {currentPhoto && (
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-black py-2 px-3 rounded-xl border border-gray-200 hover:border-gray-400 bg-white transition cursor-pointer"
                >
                  <Upload size={13} />
                  <span>Replace Photo</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 py-2 px-3 rounded-xl border border-red-200 hover:border-red-300 bg-red-50/50 hover:bg-red-50 transition cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>Remove Photo</span>
                </button>
              </div>
            )}
          </div>

          {/* ── Modal Footer ── */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-black rounded-xl hover:bg-gray-100 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
            >
              <Check size={14} />
              <span>Apply & Save</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default PhotoEditorModal;
