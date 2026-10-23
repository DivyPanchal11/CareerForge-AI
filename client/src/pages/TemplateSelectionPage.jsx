import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  ArrowRight,
  Layout,
  Layers,
  Wand2,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/auth/Navbar";
import { createResume } from "../services/resumeService";
import ImportResumeModal from "../components/resume/modals/ImportResumeModal";
import { getDemoDataForTemplate } from "../utils/templateDemoData";
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
} from "../components/resume/templates/TemplatePreviews";

// ─────────────────────────────────────────────────────────────
// Master Templates Catalog (Exact FlowCV order & categorization)
// ─────────────────────────────────────────────────────────────
export const FLOWCV_TEMPLATES = [
  // ── Row 1 ──
  {
    id: "classic-clear",
    name: "Classic Clear",
    displayName: "CLASSIC CLEAR",
    category: "simple",
    previewComponent: ClassicClearPreview,
  },
  {
    id: "atlantic-blue",
    name: "Atlantic Blue",
    displayName: "ATLANTIC BLUE",
    category: "modern",
    previewComponent: AtlanticPreview,
  },
  {
    id: "mercury-flow",
    name: "Mercury Flow",
    displayName: "MERCURY FLOW",
    category: "modern",
    previewComponent: MercuryPreview,
  },

  // ── Row 2 ──
  {
    id: "true-blue",
    name: "True Blue",
    displayName: "TRUE BLUE",
    category: "modern",
    previewComponent: TrueBluePreview,
  },
  {
    id: "editorial-rule",
    name: "Editorial Rule",
    displayName: "EDITORIAL RULE",
    category: "simple",
    previewComponent: EditorialPreview,
  },
  {
    id: "saffron-line",
    name: "Saffron Line",
    displayName: "SAFFRON LINE",
    category: "creative",
    previewComponent: SaffronPreview,
  },

  // ── Row 3 ──
  {
    id: "steady-form",
    name: "Steady Form",
    displayName: "STEADY FORM",
    category: "creative",
    previewComponent: SteadyPreview,
  },
  {
    id: "hunter-green",
    name: "Hunter Green",
    displayName: "HUNTER GREEN",
    category: "creative",
    previewComponent: HunterPreview,
  },
  {
    id: "quicksilver",
    name: "Quicksilver",
    displayName: "QUICKSILVER",
    category: "creative",
    previewComponent: QuicksilverPreview,
  },

  // ── Row 4 ──
  {
    id: "precision-line",
    name: "Precision Line",
    displayName: "PRECISION LINE",
    category: "simple",
    previewComponent: PrecisionPreview,
  },
  {
    id: "cobalt-edge",
    name: "Cobalt Edge",
    displayName: "COBALT EDGE",
    category: "modern",
    previewComponent: CobaltPreview,
  },
  {
    id: "silver-banner",
    name: "Silver Banner",
    displayName: "SILVER BANNER",
    category: "creative",
    previewComponent: SilverBannerPreview,
  },

  // ── Row 5 ──
  {
    id: "classic-serif",
    name: "Classic Serif",
    displayName: "CLASSIC SERIF",
    category: "simple",
    previewComponent: ClassicSerifPreview,
  },
  {
    id: "refined",
    name: "Refined",
    displayName: "REFINED",
    category: "creative",
    previewComponent: RefinedPreview,
  },
  {
    id: "condensed-rule",
    name: "Condensed Rule",
    displayName: "CONDENSED RULE",
    category: "simple",
    previewComponent: CondensedPreview,
  },

  // ── Row 6 ──
  {
    id: "modern",
    name: "Modern Standard",
    displayName: "MODERN STANDARD",
    category: "modern",
    previewComponent: TrueBluePreview,
  },
  {
    id: "sidebar",
    name: "Two-Column Sidebar",
    displayName: "TWO-COLUMN SIDEBAR",
    category: "modern",
    previewComponent: AtlanticPreview,
  },
];

export default function TemplateSelectionPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [creatingTemplateId, setCreatingTemplateId] = useState(null);

  const categories = [
    { id: "all", label: "All Templates" },
    { id: "simple", label: "Simple", icon: Layout },
    { id: "modern", label: "Modern", icon: Layers },
    { id: "creative", label: "Creative", icon: Wand2 },
  ];

  const filteredTemplates = FLOWCV_TEMPLATES.filter((tpl) => {
    if (activeCategory === "all") return true;
    return tpl.category === activeCategory;
  });

  const handleSelectTemplate = async (templateId, templateName) => {
    try {
      setCreatingTemplateId(templateId);
      const res = await createResume({
        title: "My Resume",
        template: templateId,
      });

      if (res.data.success && res.data.resume) {
        toast.success(`Created new resume with ${templateName} template!`);
        navigate(`/resume/${res.data.resume._id}/edit`);
      }
    } catch (err) {
      toast.error("Failed to create resume");
    } finally {
      setCreatingTemplateId(null);
    }
  };

  const handleImportData = async (importedData) => {
    try {
      const data = {
        title: importedData.title || `${importedData.personalInfo?.fullName || "Imported"} Resume`,
        template: importedData.template || "modern",
        sectionOrder: importedData.sectionOrder || [
          "personalInfo",
          "summary",
          "experience",
          "education",
          "skills",
          "projects",
          "certifications",
          "languages",
          "awards",
          "publications",
          "organizations",
          "interests",
          "references",
          "declaration",
          "custom",
        ],
        ...importedData,
        hiddenSections: [],
      };
      const res = await createResume(data);

      if (res.data.success && res.data.resume) {
        toast.success("Resume imported successfully with full layout and structure!");
        navigate(`/resume/${res.data.resume._id}/edit`);
      }
    } catch (err) {
      toast.error("Failed to import resume data");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Back Link */}
        <div className="mb-4">
          <button
            onClick={() => navigate("/resumes")}
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-black px-2 py-1 rounded-md hover:bg-gray-200/60 transition cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to All Resumes</span>
          </button>
        </div>

        {/* Header matching FlowCV */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Start building your resume
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 font-normal">
            Choose a design you like. You can customize or switch it later.
          </p>
        </div>

        {/* Filter Pills and Import Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* FlowCV Filter Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            {categories.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
                    isActive
                      ? "bg-white border border-gray-400 text-gray-900 shadow-2xs font-semibold"
                      : "bg-white/70 border border-gray-200/90 text-gray-600 hover:text-gray-900 hover:bg-white"
                  }`}
                >
                  {Icon && (
                    <Icon
                      size={14}
                      className={isActive ? "text-gray-900" : "text-gray-500"}
                    />
                  )}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* FlowCV 'Import existing resume' Button */}
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-white border border-gray-900 text-gray-900 text-sm font-bold hover:bg-gray-50 transition cursor-pointer shadow-2xs"
          >
            <Upload size={15} />
            <span>Import existing resume</span>
          </button>
        </div>

        {/* FlowCV 3-Column Pure A4 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
          {filteredTemplates.map((template) => {
            const PreviewComp = template.previewComponent;
            const isCreating = creatingTemplateId === template.id;

            return (
              <div
                key={template.id}
                onClick={() => !isCreating && handleSelectTemplate(template.id, template.name)}
                className="group cursor-pointer select-none flex flex-col"
              >
                {/* FlowCV A4 Sheet Thumbnail */}
                <div className="relative aspect-[1/1.414] bg-white rounded-xl shadow-xs border border-gray-200/80 overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1.5">
                  <PreviewComp />

                  {/* FlowCV Centered Hover Action Button */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-6">
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
                      <span>{isCreating ? "Creating..." : "Use This Template"}</span>
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>

                {/* FlowCV Label Below: UPPERCASE BOLD */}
                <div className="mt-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 group-hover:text-black">
                    {template.displayName || template.name.toUpperCase()}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Import Resume Modal */}
      <ImportResumeModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportData={handleImportData}
      />
    </div>
  );
}
