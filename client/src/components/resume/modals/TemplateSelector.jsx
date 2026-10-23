import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Star, Layout, Layers, Wand2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useResume } from "../../../context/ResumeContext";
import { getDemoDataForTemplate } from "../../../utils/templateDemoData";
import {
  ClassicClearPreview,
  AtlanticPreview,
  MercuryPreview,
  TrueBluePreview,
  EditorialPreview,
  SaffronPreview,
  SteadyPreview,
  HunterPreview,
  QuicksilverPreview,
  PrecisionPreview,
  CobaltPreview,
  SilverBannerPreview,
  ClassicSerifPreview,
  RefinedPreview,
  CondensedPreview,
} from "../templates/TemplatePreviews";

export const FLOWCV_TEMPLATES_MODAL = [
  // ── Row 1 ──
  {
    id: "classic-clear",
    name: "Classic Clear",
    displayName: "CLASSIC CLEAR",
    category: "simple",
    popular: true,
    previewComponent: ClassicClearPreview,
  },
  {
    id: "atlantic-blue",
    name: "Atlantic Blue",
    displayName: "ATLANTIC BLUE",
    category: "modern",
    popular: true,
    previewComponent: AtlanticPreview,
  },
  {
    id: "mercury-flow",
    name: "Mercury Flow",
    displayName: "MERCURY FLOW",
    category: "modern",
    popular: true,
    previewComponent: MercuryPreview,
  },
  {
    id: "true-blue",
    name: "True Blue",
    displayName: "TRUE BLUE",
    category: "modern",
    popular: true,
    previewComponent: TrueBluePreview,
  },

  // ── Row 2 ──
  {
    id: "editorial-rule",
    name: "Editorial Rule",
    displayName: "EDITORIAL RULE",
    category: "simple",
    popular: false,
    previewComponent: EditorialPreview,
  },
  {
    id: "saffron-line",
    name: "Saffron Line",
    displayName: "SAFFRON LINE",
    category: "creative",
    popular: true,
    previewComponent: SaffronPreview,
  },
  {
    id: "steady-form",
    name: "Steady Form",
    displayName: "STEADY FORM",
    category: "creative",
    popular: false,
    previewComponent: SteadyPreview,
  },
  {
    id: "hunter-green",
    name: "Hunter Green",
    displayName: "HUNTER GREEN",
    category: "creative",
    popular: false,
    previewComponent: HunterPreview,
  },

  // ── Row 3 ──
  {
    id: "quicksilver",
    name: "Quicksilver",
    displayName: "QUICKSILVER",
    category: "creative",
    popular: false,
    previewComponent: QuicksilverPreview,
  },
  {
    id: "precision-line",
    name: "Precision Line",
    displayName: "PRECISION LINE",
    category: "simple",
    popular: false,
    previewComponent: PrecisionPreview,
  },
  {
    id: "cobalt-edge",
    name: "Cobalt Edge",
    displayName: "COBALT EDGE",
    category: "modern",
    popular: true,
    previewComponent: CobaltPreview,
  },
  {
    id: "silver-banner",
    name: "Silver Banner",
    displayName: "SILVER BANNER",
    category: "creative",
    popular: false,
    previewComponent: SilverBannerPreview,
  },

  // ── Row 4 ──
  {
    id: "classic-serif",
    name: "Classic Serif",
    displayName: "CLASSIC SERIF",
    category: "simple",
    popular: false,
    previewComponent: ClassicSerifPreview,
  },
  {
    id: "refined",
    name: "Refined",
    displayName: "REFINED",
    category: "creative",
    popular: false,
    previewComponent: RefinedPreview,
  },
  {
    id: "condensed-rule",
    name: "Condensed Rule",
    displayName: "CONDENSED RULE",
    category: "simple",
    popular: false,
    previewComponent: CondensedPreview,
  },
  {
    id: "modern",
    name: "Modern Standard",
    displayName: "MODERN STANDARD",
    category: "modern",
    popular: true,
    previewComponent: TrueBluePreview,
  },
];

export function TemplateSelector({ isOpen, onClose }) {
  const { resume, setTemplate } = useResume();
  const [activeCategory, setActiveCategory] = useState("all");

  if (!isOpen) return null;

  const categories = [
    { id: "all", label: "All Templates" },
    { id: "popular", label: "Popular", icon: Star },
    { id: "simple", label: "Simple", icon: Layout },
    { id: "modern", label: "Modern", icon: Layers },
    { id: "creative", label: "Creative", icon: Wand2 },
  ];

  const filteredTemplates = FLOWCV_TEMPLATES_MODAL.filter((tpl) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "popular") return tpl.popular;
    return tpl.category === activeCategory;
  });

  const handleSelectTemplate = (templateId, templateName) => {
    setTemplate(templateId);
    toast.success(`Applied ${templateName} template!`);
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 sm:p-6"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="relative w-full max-w-5xl max-h-[88vh] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 sm:px-8 pt-6 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Apply a design template
            </h2>
            <button
              onClick={onClose}
              aria-label="Close template modal"
              className="w-8 h-8 rounded-lg border border-gray-200 hover:border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              <X size={17} />
            </button>
          </div>

          {/* Filter Pills matching FlowCV */}
          <div className="flex flex-wrap items-center gap-2 px-6 sm:px-8 pb-4 border-b border-gray-100">
            {categories.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-medium transition cursor-pointer ${
                    isActive
                      ? "bg-white border border-gray-300 text-gray-900 shadow-2xs font-semibold"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70 border border-transparent"
                  }`}
                >
                  {Icon && (
                    <Icon
                      size={13}
                      className={isActive ? "text-gray-900 fill-current" : "text-gray-500"}
                    />
                  )}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 4-Column Grid */}
          <div className="p-6 sm:p-8 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {filteredTemplates.map((tpl) => {
                const PreviewComp = tpl.previewComponent;
                const isSelected = resume?.template === tpl.id;

                return (
                  <div
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl.id, tpl.name)}
                    className="group flex flex-col cursor-pointer select-none"
                  >
                    {/* A4 Sheet Thumbnail */}
                    <div
                      className={`relative aspect-[1/1.414] bg-white rounded-xl overflow-hidden border transition-all duration-200 shadow-xs group-hover:shadow-lg ${
                        isSelected
                          ? "border-black ring-2 ring-black shadow-md"
                          : "border-gray-200 group-hover:border-gray-400"
                      }`}
                    >
                      <PreviewComp />

                      {/* Active Checkmark Pill */}
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 bg-black text-white p-1 rounded-full shadow-md z-10">
                          <Check size={11} strokeWidth={3} />
                        </div>
                      )}

                      {/* Hover Subtle Tint */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
                    </div>

                    {/* Template Name in Uppercase Bold below card */}
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[11px] font-bold tracking-wider text-gray-700 uppercase group-hover:text-black">
                        {tpl.displayName}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-emerald-600">Active</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default TemplateSelector;
