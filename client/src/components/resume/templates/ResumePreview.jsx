import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Zap,
  Check,
  Lock,
  Unlock,
} from "lucide-react";
import toast from "react-hot-toast";
import ModernTemplate from "./ModernTemplate";
import ClassicTemplate from "./ClassicTemplate";
import MinimalTemplate from "./MinimalTemplate";
import ProfessionalTemplate from "./ProfessionalTemplate";
import SidebarTemplate from "./SidebarTemplate";
import AtlanticTemplate from "./AtlanticTemplate";
import CobaltTemplate from "./CobaltTemplate";
import MercuryTemplate from "./MercuryTemplate";
import SaffronTemplate from "./SaffronTemplate";
import EditorialTemplate from "./EditorialTemplate";
import { useResume } from "../../../context/ResumeContext";

const A4_HEIGHT_PX = 1123; // Standard A4 height at 96 DPI CSS pixels

export function ResumePreview({ resume }) {
  const {
    highlightKeywords = [],
    missingKeywords = [],
    autoFitToOnePage,
    setPageCountLock,
  } = useResume();
  const [isMissingBadgeOpen, setIsMissingBadgeOpen] = useState(false);

  // ── Canvas Zoom & Fit State ──
  const [zoom, setZoom] = useState(1);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const containerRef = useRef(null);

  // ── Real-Time Page Boundary & Overflow Measurements ──
  const [contentHeight, setContentHeight] = useState(A4_HEIGHT_PX);
  const [pageOffsets, setPageOffsets] = useState([0]);
  const [overflowStats, setOverflowStats] = useState({
    isOverflown: false,
    overflowPx: 0,
    overflowLines: 0,
    totalPages: 1,
  });

  useEffect(() => {
    const measureSheet = () => {
      const probe = document.getElementById("resume-measure-probe");
      if (!probe) return;
      const realH = probe.scrollHeight;
      setContentHeight(realH);
      const isOver = realH > A4_HEIGHT_PX + 4; // allow 4px subpixel rounding tolerance
      const overPx = Math.max(0, realH - A4_HEIGHT_PX);
      const lines = Math.max(1, Math.ceil(overPx / 20));

      const computedPages = Math.max(1, Math.ceil((realH - 4) / A4_HEIGHT_PX));
      const offsets = Array.from({ length: computedPages }).map((_, i) => i * A4_HEIGHT_PX);
      setPageOffsets(offsets);

      setOverflowStats({
        isOverflown: isOver,
        overflowPx: overPx,
        overflowLines: lines,
        totalPages: computedPages,
      });
    };

    measureSheet();
    const timer = setTimeout(measureSheet, 120);
    return () => clearTimeout(timer);
  }, [resume, zoom]);

  // Template renderer — passes minPageHeight so templates fill the full page background
  const renderTemplate = (isProbe = false) => {
    const totalPagesNow = overflowStats.totalPages || 1;
    const minPageHeight = isProbe ? A4_HEIGHT_PX : totalPagesNow * A4_HEIGHT_PX;
    const resumeForRender = { ...resume, minPageHeight };

    switch (resume?.template) {
      // ── FlowCV Templates ──
      case "atlantic-blue":
        return <AtlanticTemplate resume={resumeForRender} variant="atlantic" highlightKeywords={highlightKeywords} />;
      case "hunter-green":
        return <AtlanticTemplate resume={resumeForRender} variant="hunter" highlightKeywords={highlightKeywords} />;
      case "cobalt-edge":
        return <CobaltTemplate resume={resumeForRender} highlightKeywords={highlightKeywords} />;
      case "mercury-flow":
        return <MercuryTemplate resume={resumeForRender} variant="mercury" highlightKeywords={highlightKeywords} />;
      case "steady-form":
        return <MercuryTemplate resume={resumeForRender} variant="steady" highlightKeywords={highlightKeywords} />;
      case "silver-banner":
        return <MercuryTemplate resume={resumeForRender} variant="silver" highlightKeywords={highlightKeywords} />;
      case "saffron-line":
        return <SaffronTemplate resume={resumeForRender} variant="saffron" highlightKeywords={highlightKeywords} />;
      case "quicksilver":
        return <SaffronTemplate resume={resumeForRender} variant="quicksilver" highlightKeywords={highlightKeywords} />;
      case "editorial-rule":
        return <EditorialTemplate resume={resumeForRender} variant="editorial" highlightKeywords={highlightKeywords} />;
      case "classic-clear":
        return <EditorialTemplate resume={resumeForRender} variant="classic-clear" highlightKeywords={highlightKeywords} />;
      case "true-blue":
        return <EditorialTemplate resume={resumeForRender} variant="true-blue" highlightKeywords={highlightKeywords} />;
      case "precision-line":
        return <EditorialTemplate resume={resumeForRender} variant="precision-line" highlightKeywords={highlightKeywords} />;
      case "condensed-rule":
        return <EditorialTemplate resume={resumeForRender} variant="condensed-rule" highlightKeywords={highlightKeywords} />;
      case "refined":
        return <EditorialTemplate resume={resumeForRender} variant="refined" highlightKeywords={highlightKeywords} />;
      case "classic-serif":
        return <EditorialTemplate resume={resumeForRender} variant="classic-serif" highlightKeywords={highlightKeywords} />;

      // ── Built-in Templates ──
      case "sidebar":
        return <SidebarTemplate resume={resumeForRender} highlightKeywords={highlightKeywords} />;
      case "classic":
        return <ClassicTemplate resume={resumeForRender} highlightKeywords={highlightKeywords} />;
      case "minimal":
        return <MinimalTemplate resume={resumeForRender} highlightKeywords={highlightKeywords} />;
      case "professional":
        return <ProfessionalTemplate resume={resumeForRender} highlightKeywords={highlightKeywords} />;
      case "modern":
      default:
        if (resume?.theme?.columns === "two") {
          return <SidebarTemplate resume={resumeForRender} highlightKeywords={highlightKeywords} />;
        }
        return <ModernTemplate resume={resumeForRender} highlightKeywords={highlightKeywords} />;
    }
  };

  // ── Calculate "Fit to Screen" scale ──
  const handleFitToScreen = () => {
    if (isFocusMode) {
      // Fit both width and height in focus mode
      const availableWidth = window.innerWidth - 64;
      const availableHeight = window.innerHeight - 120;
      const scaleW = availableWidth / 794;
      const scaleH = availableHeight / 1123;
      const fitScale = Math.min(scaleW, scaleH, 1.1);
      setZoom(Math.max(0.4, Math.round(fitScale * 100) / 100));
    } else if (containerRef.current) {
      // Fit container width
      const containerWidth = containerRef.current.clientWidth - 32;
      const fitScale = containerWidth / 794;
      setZoom(Math.max(0.4, Math.min(1.0, Math.round(fitScale * 100) / 100)));
    }
  };

  // Zoom in / out steps
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(1.6, Math.round((prev + 0.1) * 10) / 10));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.4, Math.round((prev - 0.1) * 10) / 10));
  };

  // Auto-fit on initial mount if screen is smaller than A4 sheet (794px + padding)
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      if (containerWidth > 0 && containerWidth < 820) {
        const fitScale = (containerWidth - 28) / 794;
        setZoom(Math.max(0.4, Math.min(1.0, Math.round(fitScale * 100) / 100)));
      }
    }
  }, []);

  // Escape key listener for Focus Mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFocusMode) {
        setIsFocusMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocusMode]);

  // Physical gap between consecutive pages in pixels (FlowCV / Google Docs style)
  const PAGE_GAP_PX = 32;
  const totalPages =
    resume.pageCountLock === 1 ? 1 : Math.max(1, overflowStats.totalPages);

  // Scaled height for parent container so scrolling behaves smoothly
  const totalUnscaledHeight =
    totalPages === 1
      ? A4_HEIGHT_PX
      : totalPages * A4_HEIGHT_PX + (totalPages - 1) * PAGE_GAP_PX;
  const scaledHeight = totalUnscaledHeight * zoom;

  // ── Floating Zoom Dock Component (Shared between normal and focus mode) ──
  const renderZoomDock = (inFocus = false) => (
    <div
      className={`no-print flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-gray-200/90 shadow-xl rounded-full px-3 py-1.5 transition-all text-xs z-30 ${
        inFocus ? "fixed bottom-6 left-1/2 -translate-x-1/2" : "sticky bottom-4 mx-auto"
      }`}
    >
      {/* Zoom Out Button */}
      <button
        type="button"
        onClick={handleZoomOut}
        disabled={zoom <= 0.4}
        title="Zoom Out (-10%)"
        className="w-6 h-6 rounded-full flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 disabled:opacity-30 transition cursor-pointer"
      >
        <ZoomOut size={13} />
      </button>

      {/* Percentage / Fit toggle */}
      <button
        type="button"
        onClick={handleFitToScreen}
        title="Click to Fit to Screen"
        className="text-[11px] font-semibold text-gray-700 hover:text-black hover:bg-gray-100 px-2 py-0.5 rounded-md transition cursor-pointer"
      >
        {Math.round(zoom * 100)}%
      </button>

      {/* Zoom In Button */}
      <button
        type="button"
        onClick={handleZoomIn}
        disabled={zoom >= 1.6}
        title="Zoom In (+10%)"
        className="w-6 h-6 rounded-full flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 disabled:opacity-30 transition cursor-pointer"
      >
        <ZoomIn size={13} />
      </button>

      <div className="w-[1px] h-3.5 bg-gray-200 mx-0.5" />

      {/* 1-Click Auto-Fit to 1 Page Button */}
      <button
        type="button"
        onClick={() => {
          autoFitToOnePage();
          toast.success("Auto-fitted spacing onto 1 page!", { icon: "⚡" });
        }}
        title="1-Click Auto-Fit onto Page 1"
        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition cursor-pointer"
      >
        <Zap size={11} className="text-amber-500" />
        <span>Auto-Fit 1P</span>
      </button>

      {/* Page Lock Toggle */}
      <button
        type="button"
        onClick={() => {
          const next = resume.pageCountLock === 1 ? null : 1;
          setPageCountLock(next);
          toast.success(next === 1 ? "Locked to strictly 1 Page" : "Page lock removed (Fluid)");
        }}
        className={`p-1.5 rounded-full transition cursor-pointer ${
          resume.pageCountLock === 1
            ? "bg-black text-white"
            : "text-gray-500 hover:text-black hover:bg-gray-100"
        }`}
        title={resume.pageCountLock === 1 ? "Page count locked to 1 Page (Click to unlock)" : "Lock preview strictly to 1 Page"}
      >
        {resume.pageCountLock === 1 ? <Lock size={12} /> : <Unlock size={12} />}
      </button>

      {/* Fullscreen / Focus Mode Toggle */}
      <button
        type="button"
        onClick={() => {
          setIsFocusMode(!isFocusMode);
          if (!isFocusMode) {
            setTimeout(handleFitToScreen, 50);
          }
        }}
        title={isFocusMode ? "Exit Focus Mode (Esc)" : "Full-Screen Focus Mode"}
        className={`p-1.5 rounded-full transition cursor-pointer ${
          isFocusMode
            ? "bg-black text-white"
            : "text-gray-500 hover:text-black hover:bg-gray-100"
        }`}
      >
        {isFocusMode ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
      </button>
    </div>
  );

  // ── Missing Keywords Floating Drawer ──
  const renderMissingKeywords = () =>
    missingKeywords.length > 0 && (
      <div className="no-print mt-4 w-full max-w-[794px]">
        <div className="bg-white border border-amber-200 rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <button
            type="button"
            onClick={() => setIsMissingBadgeOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-amber-50/50 transition"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-500" />
              <span className="text-xs font-bold text-amber-800">
                {missingKeywords.length} Missing Keyword{missingKeywords.length !== 1 ? "s" : ""}
              </span>
              <span className="text-[10px] text-gray-500">— add to improve job match</span>
            </div>
            {isMissingBadgeOpen ? (
              <ChevronDown size={14} className="text-gray-400" />
            ) : (
              <ChevronUp size={14} className="text-gray-400" />
            )}
          </button>

          {/* Expanded List */}
          {isMissingBadgeOpen && (
            <div className="px-4 pb-3 border-t border-amber-100">
              <div className="flex flex-wrap gap-1.5 pt-2.5">
                {missingKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center relative">
      {/* ── Page Count Info removed per user request ── */}

      {/* ── Standard View ── */}
      <div
        className="zoom-container w-full flex justify-center transition-transform duration-150"
        style={{
          minHeight: `${scaledHeight}px`,
        }}
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            width: "794px",
          }}
          className="resume-scale-wrapper shrink-0 transition-transform duration-100"
        >
          {/* ── Multi-Page Sheet Layout (FlowCV / Google Docs Style) ── */}
          <div
            id="resume-preview-content"
            className="flex flex-col items-center"
          >
            {Array.from({ length: totalPages }).map((_, pageIndex) => {
              const startOffset = pageOffsets[pageIndex] ?? pageIndex * A4_HEIGHT_PX;
              const nextOffset = pageOffsets[pageIndex + 1];
              const sliceHeight = nextOffset != null ? Math.min(A4_HEIGHT_PX, nextOffset - startOffset) : A4_HEIGHT_PX;

              return (
                <div
                  key={`page-sheet-${pageIndex}`}
                  data-page-index={pageIndex + 1}
                  className="resume-page-sheet relative w-[794px] h-[1123px] bg-white rounded-md shadow-md border border-gray-200/80 text-black overflow-hidden mb-8 last:mb-0 transition-all select-text print:shadow-none print:border-none print:mb-0 print:rounded-none"
                  style={{
                    height: `${A4_HEIGHT_PX}px`,
                    maxHeight: `${A4_HEIGHT_PX}px`,
                  }}
                >
                  {/* Sliced Content Window for this page - strictly clipped so pushed content never repeats on prior page */}
                  <div
                    style={{
                      height: `${sliceHeight}px`,
                      overflow: "hidden",
                    }}
                    className="w-[794px]"
                  >
                    <div
                      style={{
                        marginTop: `-${startOffset}px`,
                      }}
                      className="w-[794px]"
                    >
                      {renderTemplate()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hidden off-screen measurement probe for exact subpixel scrollHeight calculation */}
      <div
        id="resume-measure-probe"
        aria-hidden="true"
        className="pointer-events-none select-none text-black bg-white"
        style={{
          position: "fixed",
          top: 0,
          left: "-99999px",
          width: "794px",
          visibility: "hidden",
          opacity: 0,
          zIndex: -100,
        }}
      >
        {renderTemplate(true)}
      </div>

      {/* Floating Missing Keywords Badge */}
      {renderMissingKeywords()}

      {/* Floating Zoom & Fit Dock */}
      {renderZoomDock(false)}

      {/* ── Full-Screen Focus Mode Overlay ── */}
      {isFocusMode && (
        <div className="fixed inset-0 z-50 bg-neutral-900/95 overflow-y-auto flex flex-col items-center py-8 px-4 no-print animate-in fade-in duration-200">
          {/* Top Bar with exit shortcut */}
          <div className="w-full max-w-5xl flex items-center justify-between pb-4 mb-2 text-white/80 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white">Full-Screen Focus Mode</span>
              <span className="text-[11px] text-white/40">Press Esc to exit</span>
            </div>
            <button
              type="button"
              onClick={() => setIsFocusMode(false)}
              className="flex items-center gap-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl transition cursor-pointer"
            >
              <Minimize2 size={13} />
              <span>Exit Focus</span>
            </button>
          </div>

          {/* Centered Scaled Sheet */}
          <div
            className="flex justify-center my-auto transition-transform duration-150"
            style={{
              minHeight: `${scaledHeight}px`,
            }}
          >
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
                width: "794px",
              }}
              className="flex flex-col items-center"
            >
              {Array.from({ length: totalPages }).map((_, pageIndex) => {
                const startOffset = pageOffsets[pageIndex] ?? pageIndex * A4_HEIGHT_PX;
                const nextOffset = pageOffsets[pageIndex + 1];
                const sliceHeight = nextOffset != null ? Math.min(A4_HEIGHT_PX, nextOffset - startOffset) : A4_HEIGHT_PX;

                return (
                  <div
                    key={`focus-sheet-${pageIndex}`}
                    className="resume-page-sheet relative w-[794px] h-[1123px] bg-white rounded-md shadow-2xl border border-gray-200/80 text-black overflow-hidden mb-8 last:mb-0"
                    style={{
                      height: `${A4_HEIGHT_PX}px`,
                      maxHeight: `${A4_HEIGHT_PX}px`,
                    }}
                  >
                    <div
                      style={{
                        height: `${sliceHeight}px`,
                        overflow: "hidden",
                      }}
                      className="w-[794px]"
                    >
                      <div
                        style={{
                          marginTop: `-${startOffset}px`,
                        }}
                        className="w-[794px]"
                      >
                        {renderTemplate()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Floating Zoom Dock in Focus Mode */}
          {renderZoomDock(true)}
        </div>
      )}
    </div>
  );
}

export default ResumePreview;
