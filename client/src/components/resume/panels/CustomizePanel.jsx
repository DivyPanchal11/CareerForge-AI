import React, { useState, useRef } from "react";
import {
  Check,
  Palette,
  Type,
  Layout,
  Sliders,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  GripVertical,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
  Briefcase,
  GraduationCap,
  Wrench,
  Languages,
  Trophy,
  FolderGit2,
  Heart,
  UserCheck,
  FileCheck2,
  BookOpen,
  Building2,
  FileCode,
  User,
  FileText,
  Camera,
  Link2,
  Sparkles,
  RotateCcw,
  Zap,
  Upload,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useResume, defaultPhotoSettings } from "../../../context/ResumeContext";
import { SPACING_PRESETS } from "../../../utils/themeStyles";
import PhotoDisplay from "../PhotoDisplay";
import PhotoEditorModal from "../modals/PhotoEditorModal";
import TemplateSelector from "../modals/TemplateSelector";

const subNavItems = [
  { id: "document", label: "Document" },
  { id: "templates", label: "Templates" },
  { id: "layout", label: "Layout" },
  { id: "fontSize", label: "Font Size" },
  { id: "spacing", label: "Spacing" },
  { id: "entries", label: "Entries" },
  { id: "headings", label: "Headings" },
  { id: "font", label: "Font" },
  { id: "colors", label: "Colors" },
  { id: "header", label: "Header" },
  { id: "photo", label: "Photo" },
  { id: "links", label: "Links" },
  { id: "footer", label: "Footer" },
  { id: "sections", label: "Sections" },
];

const templates = [
  { id: "modern", name: "Modern", desc: "Clean, dark headers, structured single-column layout. Great for Tech & Design.", tag: "Popular" },
  { id: "sidebar", name: "Two-Column Sidebar", desc: "FlowCV-style 30/70 split. Skills, contact & languages in left rail, experience on right.", tag: "FlowCV Style" },
  { id: "classic", name: "Classic", desc: "Traditional serif typography. Ideal for Finance, Law & Academia.", tag: "Traditional" },
  { id: "minimal", name: "Minimal", desc: "Ultra-sleek single column layout with generous white space.", tag: "Clean" },
  { id: "professional", name: "Professional", desc: "Executive header with competencies grid. Perfect for Management.", tag: "Executive" },
];

const fontsList = [
  "Source Serif Pro",
  "Inter (Sans-Serif)",
  "Roboto",
  "Garamond (Serif)",
  "Fira Code (Monospace)",
  "Open Sans",
  "Lato",
  "Playfair Display",
  "Montserrat",
];

const colorPalettes = [
  { id: "#000000", bg: "bg-black" },
  { id: "#334155", bg: "bg-slate-700" },
  { id: "#0f766e", bg: "bg-teal-700" },
  { id: "#0284c7", bg: "bg-sky-600" },
  { id: "#1d4ed8", bg: "bg-blue-700" },
  { id: "#4338ca", bg: "bg-indigo-700" },
  { id: "#6b21a8", bg: "bg-purple-800" },
  { id: "#be185d", bg: "bg-pink-700" },
  { id: "#b91c1c", bg: "bg-red-700" },
  { id: "#c2410c", bg: "bg-orange-700" },
  { id: "#15803d", bg: "bg-green-700" },
];

const sectionIcons = {
  personalInfo: User,
  summary: FileText,
  experience: Briefcase,
  education: GraduationCap,
  skills: Wrench,
  languages: Languages,
  awards: Trophy,
  projects: FolderGit2,
  interests: Heart,
  references: UserCheck,
  declaration: FileCheck2,
  publications: BookOpen,
  organizations: Building2,
  custom: FileCode,
};

const sectionLabels = {
  personalInfo: "Personal Details",
  summary: "Professional Summary",
  experience: "Professional Experience",
  education: "Education",
  skills: "Skills",
  languages: "Languages",
  awards: "Awards & Honors",
  projects: "Projects",
  interests: "Interests",
  references: "References",
  declaration: "Declaration",
  publications: "Publications",
  organizations: "Organizations",
  custom: "Custom Sections",
};

export function CustomizePanel() {
  const { resume, setResume, setTemplate, reorderSections, toggleSectionVisibility } = useResume();
  const [activeSubNav, setActiveSubNav] = useState("document");
  const [isSectionCustomizationsOpen, setIsSectionCustomizationsOpen] = useState(true);

  // Photo Editor Modal state & helpers
  const [isPhotoEditorOpen, setIsPhotoEditorOpen] = useState(false);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const photoInputRef = useRef(null);
  const photo = resume.personalInfo?.photo || "";
  const photoSettings = { ...defaultPhotoSettings, ...(resume.photoSettings || {}) };

  const updatePhotoSetting = (key, val) => {
    setResume((prev) => ({
      ...prev,
      photoSettings: {
        ...defaultPhotoSettings,
        ...(prev.photoSettings || {}),
        [key]: val,
      },
    }));
  };

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
        toast.success("Photo uploaded! Frame and style your headshot.");
        setIsPhotoEditorOpen(true);
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
  };

  const order = resume.sectionOrder || [
    "personalInfo",
    "summary",
    "experience",
    "education",
    "skills",
    "languages",
    "awards",
    "projects",
    "interests",
    "references",
    "declaration",
    "publications",
    "custom",
  ];
  const hidden = resume.hiddenSections || [];

  const theme = resume.theme || {
    language: "English (UK)",
    dateFormat: "DD/MM/YYYY",
    pageFormat: "A4",
    columns: "one",
    baseFontSize: 9.5,
    nameFontSize: 14,
    headingFontSize: 2,
    entryHeaderSize: 0,
    lineHeight: 1.35,
    spacing: 3,
    marginHorizontal: 18,
    marginVertical: 18,
    entryStructure: "full",
    datePosition: "right",
    headerSplit: "auto",
    headingStyle: "line-bottom",
    capitalization: "uppercase",
    headingIcons: "none",
    bodyFont: "Source Serif Pro",
    nameFont: "Same as body font",
    primaryColor: "#000000",
    colorMode: "full",
    headerAlign: "center",
    headerDelimiter: "bullet",
    linkUnderline: false,
    linkBlue: false,
    linkIcon: true,
    footerPageNumbers: false,
    footerEmail: false,
    footerName: false,
    expTitleOrder: "employer_title",
    eduTitleOrder: "school_degree",
    skillStyle: "pipe",
    skillSubinfoStyle: "bracket",
    accentTargets: {
      name: true,
      jobTitle: true,
      headings: true,
      headingLine: true,
      headerIcons: false,
      dots: false,
      dates: false,
      entryTitle: false,
      entrySubtitle: false,
      linkIcons: false,
    },
  };

  const updateTheme = (key, val) => {
    setResume((prev) => ({
      ...prev,
      theme: {
        ...(prev.theme || {}),
        [key]: val,
      },
    }));
  };

  const updateThemeNum = (key, delta, min = 0, max = 50, step = 0.5) => {
    const current = (theme[key] !== undefined ? theme[key] : min);
    const next = Math.min(max, Math.max(min, Number((current + delta).toFixed(2))));
    updateTheme(key, next);
  };

  const applyThemeBatch = (batchObj) => {
    setResume((prev) => ({
      ...prev,
      theme: {
        ...(prev.theme || {}),
        ...batchObj,
      },
    }));
  };

  const toggleAccentTarget = (targetKey) => {
    setResume((prev) => {
      const curTargets = prev.theme?.accentTargets || {};
      return {
        ...prev,
        theme: {
          ...(prev.theme || {}),
          accentTargets: {
            ...curTargets,
            [targetKey]: !curTargets[targetKey],
          },
        },
      };
    });
  };

  const handleMove = (index, direction) => {
    const newOrder = [...order];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex <= 0 || targetIndex >= newOrder.length) return;

    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);
    reorderSections(newOrder);
  };

  // Drag & drop state for CustomizePanel section ordering
  const [draggedPanelIndex, setDraggedPanelIndex] = useState(null);
  const [dragOverPanelIndex, setDragOverPanelIndex] = useState(null);

  const handlePanelDragStart = (e, realIndex) => {
    e.stopPropagation();
    setDraggedPanelIndex(realIndex);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `panel_sec_${realIndex}`);
  };

  const handlePanelDragOver = (e, realIndex) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedPanelIndex === null || draggedPanelIndex === realIndex) return;
    setDragOverPanelIndex(realIndex);
    e.dataTransfer.dropEffect = "move";
  };

  const handlePanelDrop = (e, targetRealIndex) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedPanelIndex === null || draggedPanelIndex === targetRealIndex) {
      setDraggedPanelIndex(null);
      setDragOverPanelIndex(null);
      return;
    }

    const newOrder = [...order];
    const [moved] = newOrder.splice(draggedPanelIndex, 1);
    newOrder.splice(targetRealIndex, 0, moved);
    reorderSections(newOrder);

    setDraggedPanelIndex(null);
    setDragOverPanelIndex(null);
    toast.success("Section reordered");
  };

  const handlePanelDragEnd = () => {
    setDraggedPanelIndex(null);
    setDragOverPanelIndex(null);
  };

  const scrollToSection = (secId) => {
    setActiveSubNav(secId);
    const elem = document.getElementById(`customize-sec-${secId}`);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex items-start gap-4 animate-in fade-in duration-200">
      {/* ── FlowCV Left Vertical Sub-Navigation Sidebar ── */}
      <div className="w-36 shrink-0 bg-white border border-gray-200 rounded-2xl p-3 shadow-xs sticky top-20 space-y-1 text-xs">
        {subNavItems.map((item) => {
          const isActive = activeSubNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className={`w-full text-left px-3 py-2 rounded-xl font-semibold transition cursor-pointer flex items-center justify-between ${
                isActive
                  ? "bg-black text-white shadow-xs font-bold"
                  : "text-gray-600 hover:text-black hover:bg-gray-100"
              }`}
            >
              <span>{item.label}</span>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
          );
        })}
      </div>

      {/* ── Main Customization Cards Column ── */}
      <div className="flex-1 space-y-6 min-w-0">
        {/* 1. Document Settings Card */}
        <div id="customize-sec-document" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Document Settings</h2>

          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Language</label>
              <select
                value={theme.language || "English (UK)"}
                onChange={(e) => updateTheme("language", e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white transition cursor-pointer"
              >
                <option value="English (UK)">English (UK)</option>
                <option value="English (US)">English (US)</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Hindi">Hindi</option>
                <option value="Gujarati">Gujarati</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Date Format</label>
              <select
                value={theme.dateFormat || "DD/MM/YYYY"}
                onChange={(e) => updateTheme("dateFormat", e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white transition cursor-pointer"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="Month YYYY">Month YYYY (e.g. May 2024)</option>
                <option value="MMM YYYY">MMM YYYY (e.g. 05/2024)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Page Format</label>
              <select
                value={theme.pageFormat || "A4"}
                onChange={(e) => updateTheme("pageFormat", e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white transition cursor-pointer"
              >
                <option value="A4">A4 (Standard 210 × 297 mm)</option>
                <option value="US Letter">US Letter (8.5 × 11 in)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Design Templates Card (FlowCV Style) */}
        <div id="customize-sec-templates" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Design Templates</h2>
              <p className="text-xs text-gray-500 mt-0.5">Update your entire resume design with one click 🎨</p>
            </div>
            {resume.template && (
              <span className="text-[11px] font-bold px-3 py-1 bg-gray-100 text-gray-800 rounded-full border border-gray-200 capitalize">
                Active: {resume.template.replace(/-/g, " ")}
              </span>
            )}
          </div>

          {/* FlowCV Visual Banner with "Browse templates" button */}
          <div className="relative rounded-2xl border border-gray-200 bg-gray-50/80 overflow-hidden p-8 flex flex-col items-center justify-center text-center group">
            {/* Background fanned preview cards */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-20 pointer-events-none select-none scale-105 filter blur-[0.4px]">
              <div className="w-20 h-28 bg-white rounded-md shadow-xs border border-gray-300 p-1 flex flex-col gap-1 -rotate-6">
                <div className="h-1 bg-slate-800 rounded w-1/2" />
                <div className="h-0.5 bg-gray-300 rounded w-full" />
                <div className="h-0.5 bg-gray-200 rounded w-3/4" />
                <div className="h-0.5 bg-gray-200 rounded w-5/6" />
              </div>
              <div className="w-20 h-28 bg-white rounded-md shadow-xs border border-gray-300 p-1 flex flex-col gap-1 -rotate-3">
                <div className="h-3 bg-blue-900 rounded-xs w-full" />
                <div className="h-0.5 bg-gray-300 rounded w-3/4" />
                <div className="h-0.5 bg-gray-200 rounded w-full" />
              </div>
              <div className="w-22 h-30 bg-white rounded-md shadow-sm border border-gray-400 p-1.5 flex flex-col gap-1 z-10 scale-105">
                <div className="h-1.5 bg-black rounded w-2/3" />
                <div className="h-0.5 bg-gray-400 rounded w-full" />
                <div className="h-0.5 bg-gray-200 rounded w-4/5" />
                <div className="h-0.5 bg-gray-200 rounded w-3/4" />
              </div>
              <div className="w-20 h-28 bg-white rounded-md shadow-xs border border-gray-300 p-1 flex overflow-hidden rotate-3">
                <div className="w-1/3 bg-slate-800 h-full" />
                <div className="flex-1 p-1 space-y-1">
                  <div className="h-0.5 bg-gray-300 rounded w-full" />
                  <div className="h-0.5 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
              <div className="w-20 h-28 bg-white rounded-md shadow-xs border border-gray-300 p-1 flex flex-col gap-1 rotate-6">
                <div className="h-1 bg-amber-600 rounded w-1/2" />
                <div className="h-0.5 bg-gray-300 rounded w-full" />
                <div className="h-0.5 bg-gray-200 rounded w-4/5" />
              </div>
            </div>

            {/* Centered Actions */}
            <div className="relative z-10 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setIsTemplateSelectorOpen(true)}
                className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Browse templates
              </button>
            </div>
          </div>
        </div>

        {/* 3. Layout Options Card (FlowCV Style) */}
        <div id="customize-sec-layout" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Layout</h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2.5">Columns</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => updateTheme("columns", "one")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition cursor-pointer ${
                  (theme.columns || "one") === "one"
                    ? "border-black bg-gray-50 ring-1 ring-black"
                    : "border-gray-200 hover:border-gray-400 bg-white"
                }`}
              >
                <div className="w-8 h-6 bg-gray-200 rounded flex flex-col gap-1 p-1">
                  <div className="w-full h-1 bg-black rounded-xs" />
                  <div className="w-full h-1 bg-gray-500 rounded-xs" />
                  <div className="w-full h-1 bg-gray-500 rounded-xs" />
                </div>
                <span className="text-xs font-semibold text-gray-800">One</span>
              </button>

              <button
                type="button"
                onClick={() => updateTheme("columns", "two")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition cursor-pointer ${
                  theme.columns === "two"
                    ? "border-black bg-gray-50 ring-1 ring-black"
                    : "border-gray-200 hover:border-gray-400 bg-white"
                }`}
              >
                <div className="w-8 h-6 bg-gray-200 rounded flex gap-1 p-1">
                  <div className="w-2.5 h-full bg-black rounded-xs" />
                  <div className="flex-1 h-full bg-gray-500 rounded-xs" />
                </div>
                <span className="text-xs font-semibold text-gray-800">Two</span>
              </button>

              <button
                type="button"
                onClick={() => updateTheme("columns", "mix")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition cursor-pointer ${
                  theme.columns === "mix"
                    ? "border-black bg-gray-50 ring-1 ring-black"
                    : "border-gray-200 hover:border-gray-400 bg-white"
                }`}
              >
                <div className="w-8 h-6 bg-gray-200 rounded flex flex-col justify-between p-1">
                  <div className="w-full h-1.5 bg-black rounded-xs" />
                  <div className="flex gap-1 h-2">
                    <div className="w-2 h-full bg-gray-500 rounded-xs" />
                    <div className="flex-1 h-full bg-gray-500 rounded-xs" />
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-800">Mix</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2.5">Change Section Layout Order</label>
            <div className="space-y-2">
              <div className="bg-gray-100/70 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-700 flex items-center justify-center gap-2">
                <User size={15} />
                <span>Personal Details</span>
              </div>

              {order
                .filter((key) => key !== "personalInfo")
                .map((secKey, idx) => {
                  const Icon = sectionIcons[secKey] || FileText;
                  const isHidden = hidden.includes(secKey);
                  const realIndex = order.indexOf(secKey);

                  const isDragged = draggedPanelIndex === realIndex;
                  const isDragOver = dragOverPanelIndex === realIndex && draggedPanelIndex !== realIndex;

                  return (
                    <div
                      key={secKey}
                      onDragOver={(e) => handlePanelDragOver(e, realIndex)}
                      onDrop={(e) => handlePanelDrop(e, realIndex)}
                      className={`flex items-center justify-between p-3 bg-gray-50 border rounded-xl text-xs font-semibold transition-all ${
                        isDragOver
                          ? "border-t-2 border-black bg-gray-100 ring-1 ring-black/20"
                          : "border-gray-200"
                      } ${isDragged ? "opacity-35 bg-gray-100 border-dashed border-gray-400" : ""} ${
                        isHidden ? "opacity-40 line-through" : "text-gray-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          draggable
                          onDragStart={(e) => handlePanelDragStart(e, realIndex)}
                          onDragEnd={handlePanelDragEnd}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 text-gray-300 hover:text-black hover:bg-gray-200 rounded cursor-grab active:cursor-grabbing transition shrink-0"
                          title="Drag to reorder section"
                        >
                          <GripVertical size={16} />
                        </div>
                        <Icon size={15} className="text-gray-700 shrink-0" />
                        <span>{sectionLabels[secKey] || secKey}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => toggleSectionVisibility(secKey)}
                          className="p-1 text-gray-400 hover:text-black rounded transition"
                          title={isHidden ? "Show Section" : "Hide Section"}
                        >
                          {isHidden ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMove(realIndex, "up")}
                          disabled={realIndex <= 1}
                          className="p-1 text-gray-400 hover:text-black rounded transition disabled:opacity-30"
                          title="Move Up"
                        >
                          <ArrowUp size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMove(realIndex, "down")}
                          disabled={realIndex >= order.length - 1}
                          className="p-1 text-gray-400 hover:text-black rounded transition disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* 4. Font Size & Scale Card */}
        <div id="customize-sec-fontSize" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Font Size & Scale</h2>
            <p className="text-xs text-gray-500 mt-0.5">Control body font scale and line height across the entire resume.</p>
          </div>

          {/* Body Font Scale (Signature FlowCV Control) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800">Body Font Scale</label>
              <span className="text-[11px] font-mono text-gray-500">
                {(theme.fontScale || "normal") === "compact"
                  ? "9pt (Compact)"
                  : (theme.fontScale || "normal") === "spacious"
                  ? "11pt (Spacious)"
                  : "10pt (Normal)"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "compact", label: "Compact", pt: "9pt", desc: "Best for 1-page" },
                { id: "normal", label: "Normal", pt: "10pt", desc: "Standard" },
                { id: "spacious", label: "Spacious", pt: "11pt", desc: "Readable" },
              ].map((scale) => {
                const isActive = (theme.fontScale || "normal") === scale.id;
                return (
                  <button
                    key={scale.id}
                    type="button"
                    onClick={() => updateTheme("fontScale", scale.id)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      isActive
                        ? "border-black bg-black text-white shadow-xs"
                        : "border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800"
                    }`}
                  >
                    <span className="block text-xs font-bold">{scale.label}</span>
                    <span className={`block text-[10px] mt-0.5 ${isActive ? "text-gray-300" : "text-gray-500"}`}>
                      {scale.pt} • {scale.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Line Height Selector */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800">Line Height (Leading)</label>
              <span className="text-[11px] font-mono text-gray-500">
                {(theme.lineHeight || "normal") === "tight"
                  ? "Tight (1.25)"
                  : (theme.lineHeight || "normal") === "relaxed"
                  ? "Relaxed (1.65)"
                  : "Normal (1.45)"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "tight", label: "Tight", desc: "Saves lines" },
                { id: "normal", label: "Normal", desc: "Balanced" },
                { id: "relaxed", label: "Relaxed", desc: "Airy" },
              ].map((lh) => {
                const isActive = (theme.lineHeight || "normal") === lh.id;
                return (
                  <button
                    key={lh.id}
                    type="button"
                    onClick={() => updateTheme("lineHeight", lh.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition cursor-pointer ${
                      isActive
                        ? "border-black bg-black text-white shadow-xs"
                        : "border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div>{lh.label}</div>
                    <div className={`text-[10px] ${isActive ? "text-gray-300" : "text-gray-500"}`}>{lh.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Steppers for Heading & Name Sizing */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-gray-900">Full Name</span>
                <span className="text-[11px] text-gray-500 font-mono">+{(theme.nameFontSize || 14)}pt</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => updateThemeNum("nameFontSize", -1, 8, 24, 1)}
                  className="w-8 h-8 rounded-lg border border-gray-300 hover:border-black flex items-center justify-center text-gray-700 hover:text-black transition cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => updateThemeNum("nameFontSize", 1, 8, 24, 1)}
                  className="w-8 h-8 rounded-lg border border-gray-300 hover:border-black flex items-center justify-center text-gray-700 hover:text-black transition cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-gray-900">Section Headings</span>
                <span className="text-[11px] text-gray-500 font-mono">+{(theme.headingFontSize || 2)}pt</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => updateThemeNum("headingFontSize", -0.5, 0, 10, 0.5)}
                  className="w-8 h-8 rounded-lg border border-gray-300 hover:border-black flex items-center justify-center text-gray-700 hover:text-black transition cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => updateThemeNum("headingFontSize", 0.5, 0, 10, 0.5)}
                  className="w-8 h-8 rounded-lg border border-gray-300 hover:border-black flex items-center justify-center text-gray-700 hover:text-black transition cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Spacing Card (One-Page Fitting Powerhouse) */}
        <div id="customize-sec-spacing" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Spacing & Page Fitting</h2>
            <p className="text-xs text-gray-500 mt-0.5">Eliminate accidental page spillover by fine-tuning section and entry gaps.</p>
          </div>

          {/* ⚡ One-Click "Fit to One Page" Helper */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Zap size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-amber-950">Fit Content onto One Page</h3>
                <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                  Content spilling 2-3 lines onto page 2? Automatically optimize spacing, margins, and font scale to fit onto a single sheet.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  applyThemeBatch(SPACING_PRESETS.fitToOnePage);
                  toast.success("Spacing & font scale optimized for 1 page!", { icon: "⚡" });
                }}
                className="flex-1 flex items-center justify-center gap-1.5 bg-black hover:bg-gray-800 text-white text-xs font-bold py-2 rounded-xl transition cursor-pointer shadow-xs"
              >
                <Zap size={13} className="text-amber-400" />
                <span>Fit to One Page</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  applyThemeBatch(SPACING_PRESETS.defaultBalanced);
                  toast.success("Reset to balanced default spacing");
                }}
                className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-amber-300/80 bg-white hover:bg-amber-100/50 text-amber-950 text-xs font-semibold transition cursor-pointer"
                title="Reset to default spacing"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Section Gap Slider */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-gray-800">Section Gap</label>
                <span className="text-[11px] text-gray-400">Vertical margin between sections</span>
              </div>
              <span className="text-xs font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                {(theme.sectionSpacing !== undefined ? theme.sectionSpacing : 20)}px
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="32"
              step="2"
              value={theme.sectionSpacing !== undefined ? theme.sectionSpacing : 20}
              onChange={(e) => updateTheme("sectionSpacing", Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>8px (Tight)</span>
              <span>20px (Default)</span>
              <span>32px (Spacious)</span>
            </div>
          </div>

          {/* Entry Gap Slider */}
          <div className="space-y-2 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-gray-800">Entry Gap</label>
                <span className="text-[11px] text-gray-400">Space between jobs, projects, schools</span>
              </div>
              <span className="text-xs font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                {(theme.entrySpacing !== undefined ? theme.entrySpacing : 14)}px
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="24"
              step="2"
              value={theme.entrySpacing !== undefined ? theme.entrySpacing : 14}
              onChange={(e) => updateTheme("entrySpacing", Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>4px (Tight)</span>
              <span>14px (Default)</span>
              <span>24px (Spacious)</span>
            </div>
          </div>

          {/* Page Margins Segmented Selector */}
          <div className="space-y-2 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800">Outer Page Margins</label>
              <span className="text-[11px] font-mono text-gray-500">
                {(theme.pageMargin || "normal") === "compact"
                  ? "15mm (Compact)"
                  : (theme.pageMargin || "normal") === "spacious"
                  ? "25mm (Spacious)"
                  : "20mm (Normal)"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "compact", label: "Compact", mm: "15mm" },
                { id: "normal", label: "Normal", mm: "20mm" },
                { id: "spacious", label: "Spacious", mm: "25mm" },
              ].map((margin) => {
                const isActive = (theme.pageMargin || "normal") === margin.id;
                return (
                  <button
                    key={margin.id}
                    type="button"
                    onClick={() => updateTheme("pageMargin", margin.id)}
                    className={`py-2 px-3 rounded-xl border text-center transition cursor-pointer ${
                      isActive
                        ? "border-black bg-black text-white shadow-xs"
                        : "border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800"
                    }`}
                  >
                    <span className="block text-xs font-bold">{margin.label}</span>
                    <span className={`block text-[10px] ${isActive ? "text-gray-300" : "text-gray-500"}`}>
                      {margin.mm}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 6. Entry Layout Card */}
        <div id="customize-sec-entries" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Entry Layout</h2>

          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Structure</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateTheme("entryStructure", "full")}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                    (theme.entryStructure || "full") === "full"
                      ? "border-black bg-gray-50 ring-1 ring-black font-bold"
                      : "border-gray-200 hover:border-gray-400 bg-white"
                  }`}
                >
                  <span className="text-xs text-gray-900">Full Width</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateTheme("entryStructure", "columns")}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                    theme.entryStructure === "columns"
                      ? "border-black bg-gray-50 ring-1 ring-black font-bold"
                      : "border-gray-200 hover:border-gray-400 bg-white"
                  }`}
                >
                  <span className="text-xs text-gray-900">Columns</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Date & Location Position</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateTheme("datePosition", "right")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    (theme.datePosition || "right") === "right"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                  }`}
                >
                  Right
                </button>
                <button
                  type="button"
                  onClick={() => updateTheme("datePosition", "below")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    theme.datePosition === "below"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                  }`}
                >
                  Below Title
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Section Headings Card */}
        <div id="customize-sec-headings" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Section Headings</h2>

          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Heading Accent Style</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {[
                  { id: "line-bottom", label: "Underline", preview: "border-b-2 border-black pb-0.5" },
                  { id: "left-bar", label: "Left Bar", preview: "border-l-4 border-black pl-1.5" },
                  { id: "pill", label: "Solid Pill", preview: "bg-black text-white px-2 py-0.5 rounded-md" },
                  { id: "minimal", label: "Minimal", preview: "font-extrabold" },
                ].map((s) => {
                  const isActive = (theme.headingStyle || "line-bottom") === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => updateTheme("headingStyle", s.id)}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-between gap-1.5 ${
                        isActive
                          ? "border-black bg-gray-50 ring-1 ring-black"
                          : "border-gray-200 hover:border-gray-400 bg-white"
                      }`}
                    >
                      <div className={`text-[10px] ${s.preview}`}>Title</div>
                      <span className="text-xs font-semibold text-gray-800">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Capitalization</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateTheme("capitalization", "capitalize")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    theme.capitalization === "capitalize"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                  }`}
                >
                  Capitalize
                </button>
                <button
                  type="button"
                  onClick={() => updateTheme("capitalization", "uppercase")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    (theme.capitalization || "uppercase") === "uppercase"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                  }`}
                >
                  UPPERCASE
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Heading Icons</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => updateTheme("headingIcons", "none")}
                  className={`p-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    (theme.headingIcons || "none") === "none"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                  }`}
                >
                  None
                </button>
                <button
                  type="button"
                  onClick={() => updateTheme("headingIcons", "outline")}
                  className={`p-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    theme.headingIcons === "outline"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                  }`}
                >
                  Outline
                </button>
                <button
                  type="button"
                  onClick={() => updateTheme("headingIcons", "filled")}
                  className={`p-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    theme.headingIcons === "filled"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                  }`}
                >
                  Filled
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 8. Font Card */}
        <div id="customize-sec-font" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Font</h2>

          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Body Font</label>
              <select
                value={theme.bodyFont || "Source Serif Pro"}
                onChange={(e) => updateTheme("bodyFont", e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white transition cursor-pointer"
              >
                {fontsList.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Name Font</label>
              <select
                value={theme.nameFont || "Same as body font"}
                onChange={(e) => updateTheme("nameFont", e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white transition cursor-pointer"
              >
                <option value="Same as body font">Same as body font</option>
                {fontsList.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 9. Colors Card (FlowCV Target Checkboxes) */}
        <div id="customize-sec-colors" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Colors</h2>

          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2.5">Accent Color Palette</label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                {colorPalettes.map((c) => {
                  const isSelected = (theme.primaryColor || "#000000") === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => updateTheme("primaryColor", c.id)}
                      className={`w-9 h-9 rounded-full ${c.bg} flex items-center justify-center transition cursor-pointer shadow-xs ${
                        isSelected ? "ring-2 ring-black ring-offset-2 scale-105" : "hover:scale-105"
                      }`}
                    >
                      {isSelected && <Check size={16} className="text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-700 mb-2.5">Apply Accent Color To</label>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                {[
                  { key: "name", label: "Name" },
                  { key: "jobTitle", label: "Job title" },
                  { key: "headings", label: "Headings" },
                  { key: "headingLine", label: "Headings line" },
                  { key: "headerIcons", label: "Header icons" },
                  { key: "dots", label: "Dots/bars/bubbles" },
                  { key: "dates", label: "Dates" },
                  { key: "entryTitle", label: "Entry title" },
                ].map((tgt) => {
                  const checked = Boolean(theme.accentTargets?.[tgt.key]);
                  return (
                    <label key={tgt.key} className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAccentTarget(tgt.key)}
                        className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                      />
                      <span>{tgt.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 10. Header Card */}
        <div id="customize-sec-header" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Header Alignment & Delimiters</h2>

          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Text Alignment</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateTheme("headerAlign", "left")}
                  className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    theme.headerAlign === "left"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                  }`}
                >
                  Left
                </button>
                <button
                  type="button"
                  onClick={() => updateTheme("headerAlign", "center")}
                  className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    (theme.headerAlign || "center") === "center"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                  }`}
                >
                  Center
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Contact Delimiter</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => updateTheme("headerDelimiter", "bullet")}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    (theme.headerDelimiter || "bullet") === "bullet"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                  }`}
                >
                  • Bullet
                </button>
                <button
                  type="button"
                  onClick={() => updateTheme("headerDelimiter", "bar")}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    theme.headerDelimiter === "bar"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                  }`}
                >
                  | Bar
                </button>
                <button
                  type="button"
                  onClick={() => updateTheme("headerDelimiter", "icon")}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    theme.headerDelimiter === "icon"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                  }`}
                >
                  Icon
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 11. Profile Photo & Styling Card */}
        <div id="customize-sec-photo" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Photo & Styling</h2>
              <p className="text-xs text-gray-500 mt-0.5">Customize photo shape, border ring, grayscale filter, and framing.</p>
            </div>
            {photo && (
              <button
                type="button"
                onClick={() => setIsPhotoEditorOpen(true)}
                className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition cursor-pointer"
              >
                <Sliders size={13} />
                <span>Crop & Frame</span>
              </button>
            )}
          </div>

          {photo ? (
            <div className="space-y-5">
              {/* Live Preview & Quick Actions */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => setIsPhotoEditorOpen(true)}
                    className="cursor-pointer group relative"
                    title="Click to frame face"
                  >
                    <PhotoDisplay
                      photo={photo}
                      photoSettings={photoSettings}
                      primaryColor={theme.primaryColor || "#000000"}
                      sizeOverride={68}
                      className="shadow-2xs transition-transform group-hover:scale-105"
                    />
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Current Headshot</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Shape: <span className="font-semibold text-gray-700 capitalize">{photoSettings.shape || "circle"}</span> •{" "}
                      Border: <span className="font-semibold text-gray-700">{photoSettings.borderWidth !== undefined ? photoSettings.borderWidth : 2}px</span>
                      {photoSettings.grayscale && <span className="ml-1 text-amber-600 font-bold">• B&W Active</span>}
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsPhotoEditorOpen(true)}
                      className="text-xs font-bold text-black hover:underline mt-1 flex items-center gap-1 cursor-pointer"
                    >
                      <Sliders size={11} /> Open Pan & Zoom Editor
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded-xl transition cursor-pointer"
                    title="Replace photo"
                  >
                    <Upload size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition cursor-pointer"
                    title="Remove photo"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* 1. Shape Picker */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">Photo Shape</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: "circle", label: "Circle", previewClass: "rounded-full" },
                    { id: "rounded", label: "Rounded", previewClass: "rounded-xl" },
                    { id: "square", label: "Square", previewClass: "rounded-none" },
                  ].map((s) => {
                    const isSelected = (photoSettings.shape || "circle") === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => updatePhotoSetting("shape", s.id)}
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

              {/* 2. Border Width & Ring Color */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-gray-700">Border Width</label>
                    <span className="text-[11px] text-gray-400">Ring thickness around the photo</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                    {photoSettings.borderWidth !== undefined ? photoSettings.borderWidth : 2}px
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {[0, 1, 2, 3, 4].map((bw) => {
                    const isSelected = (photoSettings.borderWidth !== undefined ? photoSettings.borderWidth : 2) === bw;
                    return (
                      <button
                        key={bw}
                        type="button"
                        onClick={() => updatePhotoSetting("borderWidth", bw)}
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
                {(photoSettings.borderWidth !== undefined ? photoSettings.borderWidth : 2) > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-[11px] font-semibold text-gray-600">Ring Color</label>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updatePhotoSetting("borderColor", "primary")}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                          photoSettings.borderColor === "primary" || !photoSettings.borderColor
                            ? "border-black bg-gray-100 text-black ring-1 ring-black"
                            : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                        }`}
                      >
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-black/20"
                          style={{ backgroundColor: theme.primaryColor || "#000000" }}
                        />
                        <span>Primary Ring</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updatePhotoSetting("borderColor", "neutral")}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                          photoSettings.borderColor === "neutral"
                            ? "border-black bg-gray-100 text-black ring-1 ring-black"
                            : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                        }`}
                      >
                        <div className="w-3.5 h-3.5 rounded-full bg-gray-300 border border-gray-400/30" />
                        <span>Neutral Gray</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updatePhotoSetting("borderColor", "#1e293b")}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                          photoSettings.borderColor === "#1e293b"
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

              {/* 3. B&W / Grayscale Filter */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 p-4 rounded-2xl">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles size={15} className={photoSettings.grayscale ? "text-amber-500" : "text-gray-400"} />
                      <span className="text-xs font-bold text-gray-900">B&W / Grayscale Filter</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Classic black-and-white headshot standard in corporate, legal & executive resumes.
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
                    <input
                      type="checkbox"
                      checked={Boolean(photoSettings.grayscale)}
                      onChange={(e) => updatePhotoSetting("grayscale", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black" />
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 space-y-3">
              <Camera size={26} className="mx-auto text-gray-400" />
              <div>
                <h4 className="text-sm font-bold text-gray-900">No Photo Uploaded Yet</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Upload a headshot to customize shapes, borders, B&W filters, and in-browser face framing.
                </p>
              </div>
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-xs"
              >
                <Upload size={13} />
                <span>Upload Photo</span>
              </button>
            </div>
          )}

          {/* Hidden file input for CustomizePanel photo uploads */}
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>

        {/* 12. Links Card */}
        <div id="customize-sec-links" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Link Styling</h2>

          <div className="space-y-2 text-xs text-gray-700">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={Boolean(theme.linkUnderline)}
                onChange={(e) => updateTheme("linkUnderline", e.target.checked)}
                className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
              />
              <span>Underline links</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={Boolean(theme.linkBlue)}
                onChange={(e) => updateTheme("linkBlue", e.target.checked)}
                className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
              />
              <span>Blue link color</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={theme.linkIcon !== false}
                onChange={(e) => updateTheme("linkIcon", e.target.checked)}
                className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
              />
              <span>Display link icon</span>
            </label>
          </div>
        </div>

        {/* 13. Footer Card */}
        <div id="customize-sec-footer" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Footer</h2>

          <div className="space-y-2 text-xs text-gray-700">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={Boolean(theme.footerPageNumbers)}
                onChange={(e) => updateTheme("footerPageNumbers", e.target.checked)}
                className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
              />
              <span>Page numbers</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={Boolean(theme.footerEmail)}
                onChange={(e) => updateTheme("footerEmail", e.target.checked)}
                className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
              />
              <span>Email in footer</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={Boolean(theme.footerName)}
                onChange={(e) => updateTheme("footerName", e.target.checked)}
                className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
              />
              <span>Name in footer</span>
            </label>
          </div>
        </div>

        {/* 14. Section Customizations Collapsible Accordion */}
        <div id="customize-sec-sections" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div
            onClick={() => setIsSectionCustomizationsOpen((prev) => !prev)}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Section Customizations</h2>
            <div className="p-1 text-gray-400 hover:text-black">
              {isSectionCustomizationsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>

          {isSectionCustomizationsOpen && (
            <div className="space-y-6 pt-2 border-t border-gray-100">
              {/* Summary Customizations */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                <h3 className="text-xs font-bold text-gray-900">Summary</h3>
                <div className="space-y-2 text-xs text-gray-700">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(theme.summaryInHeader)}
                      onChange={(e) => updateTheme("summaryInHeader", e.target.checked)}
                      className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                    />
                    <span>Display summary as part of header</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={theme.showSummaryHeading !== false}
                      onChange={(e) => updateTheme("showSummaryHeading", e.target.checked)}
                      className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                    />
                    <span>Show summary heading</span>
                  </label>
                </div>
              </div>

              {/* Work Experience Customizations */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-gray-900">Work Experience</h3>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Title / Subtitle Order</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateTheme("expTitleOrder", "title_employer")}
                      className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                        theme.expTitleOrder === "title_employer"
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                      }`}
                    >
                      Job Title – Employer
                    </button>
                    <button
                      type="button"
                      onClick={() => updateTheme("expTitleOrder", "employer_title")}
                      className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                        (theme.expTitleOrder || "employer_title") === "employer_title"
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                      }`}
                    >
                      Employer – Job Title
                    </button>
                  </div>
                </div>
              </div>

              {/* Education Customizations */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-gray-900">Education</h3>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Title & Subtitle Order</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateTheme("eduTitleOrder", "degree_school")}
                      className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                        theme.eduTitleOrder === "degree_school"
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                      }`}
                    >
                      Degree, School
                    </button>
                    <button
                      type="button"
                      onClick={() => updateTheme("eduTitleOrder", "school_degree")}
                      className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                        (theme.eduTitleOrder || "school_degree") === "school_degree"
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                      }`}
                    >
                      School, Degree
                    </button>
                  </div>
                </div>
              </div>

              {/* Skills Customizations */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-gray-900">Skills</h3>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-2">Skill Display Style</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "pills", label: "Tag Pills", preview: "px-2 py-0.5 bg-gray-100 rounded" },
                      { id: "dots", label: "Proficiency Dots", preview: "•••••" },
                      { id: "bars", label: "Progress Bars", preview: "━━━━" },
                      { id: "text", label: "Clean Text", preview: "React | Node" },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => {
                          updateTheme("skillDisplay", st.id);
                          updateTheme("skillStyle", st.id);
                        }}
                        className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-between gap-1 ${
                          (theme.skillDisplay || theme.skillStyle || "pills") === st.id
                            ? "border-black bg-gray-50 ring-1 ring-black"
                            : "border-gray-200 hover:border-gray-400 bg-white"
                        }`}
                      >
                        <div className="text-[10px] text-gray-700 font-mono">{st.preview}</div>
                        <span className="text-xs font-semibold text-gray-900">{st.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Delimiter Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["bullet", "pipe", "comma"].map((del) => (
                      <button
                        key={del}
                        type="button"
                        onClick={() => updateTheme("skillDelimiter", del)}
                        className={`p-2 rounded-lg border text-xs font-medium capitalize transition cursor-pointer ${
                          (theme.skillDelimiter || "pipe") === del
                            ? "border-black bg-black text-white font-bold"
                            : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                        }`}
                      >
                        {del}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Subinfo Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "colon", label: ": Colon" },
                      { id: "dash", label: "– Dash" },
                      { id: "bracket", label: "() Bracket" },
                    ].map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => updateTheme("skillSubinfo", sub.id)}
                        className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                          (theme.skillSubinfo || "bracket") === sub.id
                            ? "border-black bg-black text-white font-bold"
                            : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Grouping Layout</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateTheme("skillGrouping", "flat");
                        updateTheme("groupSkillsByCategory", false);
                      }}
                      className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                        theme.skillGrouping !== "categorized" && !theme.groupSkillsByCategory
                          ? "border-black bg-black text-white font-bold"
                          : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                      }`}
                    >
                      Flat List
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateTheme("skillGrouping", "categorized");
                        updateTheme("groupSkillsByCategory", true);
                      }}
                      className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1.5 ${
                        theme.skillGrouping === "categorized" || theme.groupSkillsByCategory
                          ? "border-black bg-black text-white font-bold"
                          : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                      }`}
                    >
                      <span>Categorized Matrix</span>
                      <span className="text-[10px] bg-amber-400 text-black px-1.5 py-0.2 rounded font-bold">PRO</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Pill Badge Color</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateTheme("skillBadgeStyle", "neutral")}
                      className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                        theme.skillBadgeStyle !== "filled"
                          ? "border-black bg-black text-white font-bold"
                          : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                      }`}
                    >
                      Neutral Gray
                    </button>
                    <button
                      type="button"
                      onClick={() => updateTheme("skillBadgeStyle", "filled")}
                      className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                        theme.skillBadgeStyle === "filled"
                          ? "border-black bg-black text-white font-bold"
                          : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                      }`}
                    >
                      Accent Fill (Auto-Contrast)
                    </button>
                  </div>
                </div>
              </div>

              {/* Languages Customizations */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-gray-900">Languages</h3>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Display Layout</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {["grid", "rows", "compact", "bubble", "level"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => updateTheme("langStyle", st)}
                        className={`p-2 rounded-lg border text-xs font-medium capitalize transition cursor-pointer ${
                          (theme.langStyle || "compact") === st
                            ? "border-black bg-black text-white font-bold"
                            : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Delimiter Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["bullet", "pipe", "comma"].map((del) => (
                      <button
                        key={del}
                        type="button"
                        onClick={() => updateTheme("langDelimiter", del)}
                        className={`p-2 rounded-lg border text-xs font-medium capitalize transition cursor-pointer ${
                          (theme.langDelimiter || "pipe") === del
                            ? "border-black bg-black text-white font-bold"
                            : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                        }`}
                      >
                        {del}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Certificates Customizations */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-gray-900">Certificates & Licenses</h3>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Display Layout</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["grid", "rows", "compact", "bubble"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => updateTheme("certStyle", st)}
                        className={`p-2 rounded-lg border text-xs font-medium capitalize transition cursor-pointer ${
                          (theme.certStyle || "compact") === st
                            ? "border-black bg-black text-white font-bold"
                            : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Delimiter Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["bullet", "pipe", "comma"].map((del) => (
                      <button
                        key={del}
                        type="button"
                        onClick={() => updateTheme("certDelimiter", del)}
                        className={`p-2 rounded-lg border text-xs font-medium capitalize transition cursor-pointer ${
                          (theme.certDelimiter || "pipe") === del
                            ? "border-black bg-black text-white font-bold"
                            : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                        }`}
                      >
                        {del}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Subinfo Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "colon", label: ": Colon" },
                      { id: "dash", label: "– Dash" },
                      { id: "bracket", label: "() Bracket" },
                    ].map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => updateTheme("certSubinfo", sub.id)}
                        className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                          (theme.certSubinfo || "bracket") === sub.id
                            ? "border-black bg-black text-white font-bold"
                            : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interests Customizations */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-gray-900">Interests</h3>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Display Layout</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["grid", "rows", "compact", "bubble"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => updateTheme("interestStyle", st)}
                        className={`p-2 rounded-lg border text-xs font-medium capitalize transition cursor-pointer ${
                          (theme.interestStyle || "compact") === st
                            ? "border-black bg-black text-white font-bold"
                            : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Declaration Customizations */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-gray-900">Declaration</h3>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800 select-none">
                  <input
                    type="checkbox"
                    checked={theme.showDeclarationHeading !== false}
                    onChange={(e) => updateTheme("showDeclarationHeading", e.target.checked)}
                    className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                  />
                  <span>Show section heading</span>
                </label>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Position</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateTheme("declarationPosition", "left")}
                      className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                        theme.declarationPosition === "left"
                          ? "border-black bg-black text-white font-bold"
                          : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                      }`}
                    >
                      Left
                    </button>
                    <button
                      type="button"
                      onClick={() => updateTheme("declarationPosition", "right")}
                      className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                        (theme.declarationPosition || "right") === "right"
                          ? "border-black bg-black text-white font-bold"
                          : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                      }`}
                    >
                      Right
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Signature Line</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateTheme("signatureLine", "none")}
                      className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                        theme.signatureLine === "none"
                          ? "border-black bg-black text-white font-bold"
                          : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                      }`}
                    >
                      None
                    </button>
                    <button
                      type="button"
                      onClick={() => updateTheme("signatureLine", "solid")}
                      className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                        (theme.signatureLine || "solid") === "solid"
                          ? "border-black bg-black text-white font-bold"
                          : "border-gray-200 hover:border-gray-400 bg-white text-gray-800"
                      }`}
                    >
                      Solid
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Photo Editor & Framing Modal */}
      <PhotoEditorModal
        isOpen={isPhotoEditorOpen}
        onClose={() => setIsPhotoEditorOpen(false)}
      />

      {/* FlowCV Template Selector Modal */}
      <TemplateSelector
        isOpen={isTemplateSelectorOpen}
        onClose={() => setIsTemplateSelectorOpen(false)}
      />
    </div>
  );
}

export default CustomizePanel;
