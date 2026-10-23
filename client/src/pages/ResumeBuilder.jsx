import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  LayoutGrid,
  FileText,
  Sliders,
  Sparkles,
  Download,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Languages,
  Heart,
  FileCode,
  Plus,
  Upload,
  Eye,
  EyeOff,
  Pencil,
  CheckCircle,
  RefreshCw,
  Copy,
  Trash2,
  Target,
  Mail,
  Phone,
  MapPin,
  Camera,
  UserCheck,
  FileCheck2,
  BookOpen,
  Building2,
  Trophy,
  GripVertical,
  Settings,
  X,
  Check,
  Lightbulb,
  ShieldCheck,
  Share2,
  RotateCw,
  RotateCcw,
  History,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import { ResumeProvider, useResume, initialResumeState } from "../context/ResumeContext";
import { getResumeById, createResume, deleteResume, duplicateResume } from "../services/resumeService";
import { downloadResumePDF } from "../utils/pdfExport";

import ResumePreview from "../components/resume/templates/ResumePreview";
import CustomizePanel from "../components/resume/panels/CustomizePanel";
import AIToolsPanel from "../components/resume/panels/AIToolsPanel";

import PersonalInfoEditor from "../components/resume/editors/PersonalInfoEditor";
import SummaryEditor from "../components/resume/editors/SummaryEditor";
import ExperienceEditor from "../components/resume/editors/ExperienceEditor";
import EducationEditor from "../components/resume/editors/EducationEditor";
import SkillsEditor from "../components/resume/editors/SkillsEditor";
import ProjectsEditor from "../components/resume/editors/ProjectsEditor";
import CertificationsEditor from "../components/resume/editors/CertificationsEditor";
import LanguagesEditor from "../components/resume/editors/LanguagesEditor";
import InterestsEditor from "../components/resume/editors/InterestsEditor";
import CustomSectionEditor from "../components/resume/editors/CustomSectionEditor";
import ReferencesEditor from "../components/resume/editors/ReferencesEditor";
import DeclarationEditor from "../components/resume/editors/DeclarationEditor";
import PublicationsEditor from "../components/resume/editors/PublicationsEditor";
import OrganizationsEditor from "../components/resume/editors/OrganizationsEditor";
import AwardsEditor from "../components/resume/editors/AwardsEditor";

import AddContentModal from "../components/resume/modals/AddContentModal";
import ATSAnalysisModal from "../components/resume/modals/ATSAnalysisModal";
import JobMatchModal from "../components/resume/modals/JobMatchModal";
import TemplateSelector from "../components/resume/modals/TemplateSelector";
import ImportResumeModal from "../components/resume/modals/ImportResumeModal";
import QualityLinterModal from "../components/resume/modals/QualityLinterModal";
import PhotoEditorModal from "../components/resume/modals/PhotoEditorModal";
import ExportResumeModal from "../components/resume/modals/ExportResumeModal";
import ShareResumeModal from "../components/resume/modals/ShareResumeModal";
import VersionHistoryModal from "../components/resume/modals/VersionHistoryModal";
import InterviewPrepModal from "../components/resume/modals/InterviewPrepModal";
import CoverLetterModal from "../components/resume/modals/CoverLetterModal";
import PhotoDisplay from "../components/resume/PhotoDisplay";
import { exportResumeBackup } from "../utils/resumeParser";
import { lintResume } from "../utils/resumeLinter";

const sectionMeta = {
  summary: { label: "Summary", icon: FileText },
  experience: { label: "Professional Experience", icon: Briefcase },
  education: { label: "Education", icon: GraduationCap },
  skills: { label: "Skills", icon: Wrench },
  languages: { label: "Languages", icon: Languages },
  certifications: { label: "Certifications & Licenses", icon: Award },
  awards: { label: "Awards & Honors", icon: Trophy },
  projects: { label: "Projects", icon: FolderGit2 },
  interests: { label: "Interests", icon: Heart },
  references: { label: "References", icon: UserCheck },
  declaration: { label: "Declaration", icon: FileCheck2 },
  publications: { label: "Publications & Research", icon: BookOpen },
  organizations: { label: "Organizations & Volunteering", icon: Building2 },
  custom: { label: "Custom Section", icon: FileCode },
};

const SECTION_TIPS = {
  summary: [
    "Keep your summary between 3-4 impactful sentences.",
    "Highlight total experience, core tech stack, and key career achievements.",
    "Use strong keywords matching target job descriptions for ATS screeners.",
  ],
  experience: [
    "Start each bullet point with a strong action verb (e.g. Spearheaded, Built, Optimized).",
    "Quantify your accomplishments with measurable metrics (e.g., 'reduced latency by 35%').",
    "Focus on high-impact outcomes rather than daily duties.",
  ],
  education: [
    "Include degree title, field of study, school name, and graduation dates.",
    "Add notable honors, relevant capstones, or high GPA (if > 3.5).",
  ],
  skills: [
    "Categorize skills logically (Languages, Frameworks, Cloud, Databases).",
    "List target position key competencies first.",
  ],
  projects: [
    "Describe what you built, tech stack used, and the problem it solved.",
    "Add live project links or GitHub repository URLs.",
  ],
  languages: [
    "Specify your speaking and writing proficiency level clearly.",
  ],
  certifications: [
    "Include recognized industry certifications (AWS, GCP, PMP, Scrum).",
  ],
};

function ResumeBuilderContent({ resumeId }) {
  const navigate = useNavigate();
  const {
    resume,
    setResume,
    activeSection,
    setActiveSection,
    saveStatus,
    setTitle,
    toggleSectionVisibility,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useResume();

  // Real-time resume linter calculation
  const lintResults = lintResume(resume);

  // track which specific entry is being edited
  const [editingEntry, setEditingEntry] = useState(null);
  const [showModalTips, setShowModalTips] = useState(false);

  // Section heading editing state
  const [editingHeading, setEditingHeading] = useState(null); // secKey or null
  const [sectionHeadings, setSectionHeadings] = useState({});

  // Active navigation tab: 'content' | 'customize' | 'ai'
  const [activeTab, setActiveTab] = useState("content");

  // Modals state
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [isATSModalOpen, setIsATSModalOpen] = useState(false);
  const [isJobMatchModalOpen, setIsJobMatchModalOpen] = useState(false);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isQualityModalOpen, setIsQualityModalOpen] = useState(false);
  const [isPhotoEditorOpen, setIsPhotoEditorOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isInterviewPrepOpen, setIsInterviewPrepOpen] = useState(false);
  const [isCoverLetterOpen, setIsCoverLetterOpen] = useState(false);
  const [coverLetterPrefill, setCoverLetterPrefill] = useState({ companyName: "", jobDescription: "" });

  // Expanded sections state in content editor (accordion: opening one closes others)
  // Starts collapsed by default for clean FlowCV layout
  const [expandedSections, setExpandedSections] = useState({});

  // Top bar dropdown menu open state
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const optionsMenuRef = useRef(null);

  // Mobile active tab ('content', 'preview')
  const [mobileTab, setMobileTab] = useState("content");

  // Drag and Drop state for section reordering
  const [draggedSectionIndex, setDraggedSectionIndex] = useState(null);
  const [dragOverSectionIndex, setDragOverSectionIndex] = useState(null);

  // Drag and Drop state for entry reordering within sections
  const [draggedEntry, setDraggedEntry] = useState(null); // { secKey: string, index: number } | null
  const [dragOverEntryIndex, setDragOverEntryIndex] = useState(null);
  const dragIsActiveRef = useRef(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
        setIsOptionsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSectionExpand = (secKey) => {
    // Single-section accordion: opening one closes all other sections
    setExpandedSections((prev) => (prev[secKey] ? {} : { [secKey]: true }));
    setActiveSection(secKey);
  };

  // ── Drag & Drop Handlers for Section Reordering ──
  const handleSectionDragStart = (e, index) => {
    e.stopPropagation();
    dragIsActiveRef.current = true;
    setDraggedSectionIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `section_${index}`);
  };

  const handleSectionDragOver = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedSectionIndex === null || draggedSectionIndex === index) return;
    setDragOverSectionIndex(index);
    e.dataTransfer.dropEffect = "move";
  };

  const handleSectionDrop = (e, targetIndex) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedSectionIndex === null || draggedSectionIndex === targetIndex) {
      setDraggedSectionIndex(null);
      setDragOverSectionIndex(null);
      setTimeout(() => { dragIsActiveRef.current = false; }, 120);
      return;
    }

    const currentOrder = [...order];
    const [movedSec] = currentOrder.splice(draggedSectionIndex, 1);
    currentOrder.splice(targetIndex, 0, movedSec);

    // Keep personalInfo pinned at the top in full order
    const fullOrder = ["personalInfo", ...currentOrder];
    setResume((prev) => ({
      ...prev,
      sectionOrder: fullOrder,
    }));

    setDraggedSectionIndex(null);
    setDragOverSectionIndex(null);
    setTimeout(() => { dragIsActiveRef.current = false; }, 120);
    toast.success("Section reordered");
  };

  const handleSectionDragEnd = () => {
    setDraggedSectionIndex(null);
    setDragOverSectionIndex(null);
    setTimeout(() => { dragIsActiveRef.current = false; }, 120);
  };

  // ── Drag & Drop Handlers for Entry Reordering ──
  const handleEntryDragStart = (e, secKey, index) => {
    e.stopPropagation();
    dragIsActiveRef.current = true;
    setDraggedEntry({ secKey, index });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `entry_${secKey}_${index}`);
  };

  const handleEntryDragOver = (e, secKey, index) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedEntry || draggedEntry.secKey !== secKey || draggedEntry.index === index) return;
    setDragOverEntryIndex(index);
    e.dataTransfer.dropEffect = "move";
  };

  const handleEntryDrop = (e, secKey, targetIndex) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedEntry || draggedEntry.secKey !== secKey || draggedEntry.index === targetIndex) {
      setDraggedEntry(null);
      setDragOverEntryIndex(null);
      setTimeout(() => { dragIsActiveRef.current = false; }, 120);
      return;
    }

    const sourceIndex = draggedEntry.index;
    setResume((prev) => {
      const list = [...(prev[secKey] || [])];
      if (sourceIndex < 0 || sourceIndex >= list.length || targetIndex < 0 || targetIndex >= list.length) {
        return prev;
      }
      const [movedItem] = list.splice(sourceIndex, 1);
      list.splice(targetIndex, 0, movedItem);
      return {
        ...prev,
        [secKey]: list,
      };
    });

    setDraggedEntry(null);
    setDragOverEntryIndex(null);
    setTimeout(() => { dragIsActiveRef.current = false; }, 120);
    toast.success("Entry reordered");
  };

  const handleEntryDragEnd = () => {
    setDraggedEntry(null);
    setDragOverEntryIndex(null);
    setTimeout(() => { dragIsActiveRef.current = false; }, 120);
  };

  const handleDuplicate = async () => {
    try {
      const res = await duplicateResume(resumeId);
      if (res.data.success && res.data.resume) {
        toast.success("Resume duplicated!");
        navigate(`/resume/${res.data.resume._id}/edit`);
      }
    } catch (err) {
      toast.error("Failed to duplicate resume");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await deleteResume(resumeId);
      toast.success("Resume deleted");
      navigate("/resumes");
    } catch (err) {
      toast.error("Failed to delete resume");
    }
  };

  const handleDownloadPDF = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    await downloadResumePDF("resume-preview-content", resume);
    setIsDownloading(false);
  };

  const handleImportData = (importedData) => {
    setResume((prev) => ({
      ...prev,
      title: importedData.title || prev.title,
      template: importedData.template || prev.template,
      personalInfo: {
        ...(prev.personalInfo || {}),
        ...(importedData.personalInfo || {}),
      },
      summary: importedData.summary !== undefined ? importedData.summary : prev.summary,
      experience: importedData.experience !== undefined ? importedData.experience : prev.experience,
      education: importedData.education !== undefined ? importedData.education : prev.education,
      skills: importedData.skills !== undefined ? importedData.skills : prev.skills,
      projects: importedData.projects !== undefined ? importedData.projects : prev.projects,
      certifications: importedData.certifications !== undefined ? importedData.certifications : prev.certifications,
      languages: importedData.languages !== undefined ? importedData.languages : prev.languages,
      awards: importedData.awards !== undefined ? importedData.awards : prev.awards,
      publications: importedData.publications !== undefined ? importedData.publications : prev.publications,
      organizations: importedData.organizations !== undefined ? importedData.organizations : prev.organizations,
      references: importedData.references !== undefined ? importedData.references : prev.references,
      declaration: importedData.declaration?.statement ? importedData.declaration : prev.declaration,
      interests: importedData.interests !== undefined ? importedData.interests : prev.interests,
      customSections: importedData.customSections !== undefined ? importedData.customSections : prev.customSections,
      theme: importedData.theme ? { ...prev.theme, ...importedData.theme } : prev.theme,
      sectionOrder: importedData.sectionOrder || prev.sectionOrder,
      hiddenSections: [], // always reset hidden sections on import — don't carry over visibility state from external files
    }));
    toast.success("Resume data and layout structure imported successfully!");
  };

  const renderSectionEditor = (secKey) => {
    switch (secKey) {
      case "personalInfo":
        return <PersonalInfoEditor />;
      case "summary":
        return <SummaryEditor />;
      case "experience":
        return <ExperienceEditor />;
      case "education":
        return <EducationEditor />;
      case "skills":
        return <SkillsEditor />;
      case "projects":
        return <ProjectsEditor />;
      case "certifications":
        return <CertificationsEditor />;
      case "awards":
        return <AwardsEditor />;
      case "languages":
        return <LanguagesEditor />;
      case "interests":
        return <InterestsEditor />;
      case "references":
        return <ReferencesEditor />;
      case "declaration":
        return <DeclarationEditor />;
      case "publications":
        return <PublicationsEditor />;
      case "organizations":
        return <OrganizationsEditor />;
      case "custom":
        return <CustomSectionEditor />;
      default:
        return null;
    }
  };

  const getEntries = (secKey) => {
    if (secKey === "summary") {
      return resume.summary ? [{ id: "summary_0", content: resume.summary }] : [];
    }
    if (secKey === "declaration") {
      return resume.declaration?.statement || resume.declaration?.place || resume.declaration?.signatureName
        ? [{ id: "declaration_0", ...resume.declaration }]
        : [];
    }
    return resume[secKey] || [];
  };

  const getEntryLabel = (secKey, entry, index) => {
    if (secKey === "summary") {
      const text = typeof entry === "string" ? entry : entry.content || resume.summary || "";
      if (!text) return "New Entry";
      return text.length > 60 ? text.substring(0, 60) + "..." : text;
    }
    if (secKey === "declaration") {
      return entry.signatureName ? `Declaration (${entry.signatureName})` : "Declaration Statement";
    }
    if (secKey === "experience")
      return entry.company && entry.jobTitle
        ? `${entry.company}, ${entry.jobTitle}`
        : entry.company || entry.jobTitle || "New Entry";
    if (secKey === "education")
      return entry.institution && entry.degree
        ? `${entry.institution}, ${entry.degree}`
        : entry.institution || entry.degree || "New Entry";
    if (secKey === "skills") return entry.name || "New Skill";
    if (secKey === "languages") return entry.language || "New Language";
    if (secKey === "projects") return entry.title || "New Project";
    if (secKey === "certifications") return entry.name || "New Certification";
    if (secKey === "awards") return entry.title || "New Award";
    if (secKey === "interests") return entry.name || "New Interest";
    if (secKey === "references") return entry.name ? `${entry.name} (${entry.company || "Reference"})` : "New Reference";
    if (secKey === "publications") return entry.title || "New Publication";
    if (secKey === "organizations") return entry.name ? `${entry.name}, ${entry.role || "Volunteer"}` : "New Organization";
    if (secKey === "custom") return entry.title || "New Entry";
    return "New Entry";
  };

  const handleAddEntry = (secKey) => {
    // If section was flagged hidden, automatically unhide it when user adds an entry
    if (hidden.includes(secKey)) {
      toggleSectionVisibility(secKey);
    }
    if (secKey === "summary") {
      setEditingEntry({ section: "summary", entryId: "summary_0" });
      return;
    }
    if (secKey === "declaration") {
      setEditingEntry({ section: "declaration", entryId: "declaration_0" });
      return;
    }
    const timestamp = Date.now();
    const newEntries = {
      experience: { id: `exp_${timestamp}`, jobTitle: "", company: "", location: "", startDate: "", endDate: "", currentlyWorking: false, description: "" },
      education: { id: `edu_${timestamp}`, institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", grade: "", description: "" },
      skills: { id: `skill_${timestamp}`, name: "", category: "Technical", level: "Intermediate" },
      languages: { id: `lang_${timestamp}`, language: "", proficiency: "Fluent" },
      projects: { id: `proj_${timestamp}`, title: "", description: "", technologies: "", link: "" },
      certifications: { id: `cert_${timestamp}`, name: "", issuer: "", date: "", link: "" },
      awards: { id: `award_${timestamp}`, title: "", issuer: "", date: "", description: "" },
      interests: { id: `int_${timestamp}`, name: "" },
      references: { id: `ref_${timestamp}`, name: "", relationship: "", company: "", email: "", phone: "" },
      publications: { id: `pub_${timestamp}`, title: "", publisher: "", date: "", link: "", description: "" },
      organizations: { id: `org_${timestamp}`, name: "", role: "", startDate: "", endDate: "", description: "" },
      custom: { id: `custom_${timestamp}`, title: "", content: "" },
    };
    const newEntry = newEntries[secKey];
    if (!newEntry) return;

    setResume((prev) => ({
      ...prev,
      [secKey]: [...(prev[secKey] || []), newEntry],
    }));
    setEditingEntry({ section: secKey, entryId: newEntry.id });
  };

  const handleDeleteEntry = (secKey, entryId) => {
    setResume((prev) => ({
      ...prev,
      [secKey]: (prev[secKey] || []).filter((e) => e.id !== entryId),
    }));
    if (editingEntry?.entryId === entryId) setEditingEntry(null);
  };

  const toggleEntryVisibility = (secKey, entryId) => {
    if (secKey === "summary") {
      toggleSectionVisibility("summary");
      return;
    }
    setResume((prev) => {
      const list = prev[secKey] || [];
      return {
        ...prev,
        [secKey]: list.map((item) =>
          item.id === entryId ? { ...item, hidden: !item.hidden } : item
        ),
      };
    });
  };

  const handleDeleteSection = (secKey) => {
    if (!window.confirm(`Are you sure you want to clear entries from the ${sectionMeta[secKey]?.label || secKey} section?`)) return;
    if (secKey === "summary") {
      setResume((prev) => ({ ...prev, summary: "" }));
      toast.success("Summary cleared");
      return;
    }
    setResume((prev) => ({ ...prev, [secKey]: [] }));
    toast.success(`${sectionMeta[secKey]?.label || secKey} cleared`);
  };

  const order = (resume.sectionOrder || Object.keys(sectionMeta)).filter((key) => key !== "personalInfo");
  const hidden = resume.hiddenSections || [];
  const personalInfo = resume.personalInfo || {};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      {/* ── FlowCV Sleek Workspace Header ── */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-2.5 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left Cluster: Back to Resumes + Inline Title + Cloud Save status */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => navigate("/resumes")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl transition cursor-pointer"
              title="Back to all resumes"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Resumes</span>
            </button>

            <div className="h-4 w-px bg-gray-200" />

            <div className="flex items-center gap-2">
              {isTitleEditing ? (
                <input
                  type="text"
                  autoFocus
                  value={resume.title || "My Resume"}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => setIsTitleEditing(false)}
                  onKeyDown={(e) => e.key === "Enter" && setIsTitleEditing(false)}
                  className="text-xs font-bold text-gray-900 bg-gray-50 border border-black rounded-lg px-2.5 py-1 outline-none w-36 sm:w-48"
                />
              ) : (
                <button
                  onClick={() => setIsTitleEditing(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-900 hover:bg-gray-100 px-2 py-1 rounded-lg transition group cursor-pointer"
                  title="Click to rename resume"
                >
                  <span className="truncate max-w-[120px] sm:max-w-[180px]">{resume.title || "Untitled Resume"}</span>
                  <Pencil size={11} className="text-gray-400 group-hover:text-black shrink-0" />
                </button>
              )}

              {/* Subtle Save Status */}
              {saveStatus === "saving" && (
                <span className="text-[11px] text-gray-400 flex items-center gap-1 ml-0.5" title="Saving changes...">
                  <RefreshCw size={11} className="animate-spin text-gray-500" />
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="hidden md:flex items-center gap-1 text-[11px] text-emerald-600 font-medium ml-0.5" title="All changes saved to cloud">
                  <CheckCircle size={12} />
                  <span>Saved</span>
                </span>
              )}
            </div>
          </div>

          {/* Center Cluster: Segmented Control Pill */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200/80 shrink-0">
            {/* Content Tab */}
            <button
              onClick={() => setActiveTab("content")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                activeTab === "content"
                  ? "bg-white text-black shadow-2xs"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              <FileText size={14} />
              <span>Content</span>
            </button>

            {/* Customize Tab */}
            <button
              onClick={() => setActiveTab("customize")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                activeTab === "customize"
                  ? "bg-white text-black shadow-2xs"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              <Sliders size={14} />
              <span>Customize</span>
            </button>

            {/* AI Tools Tab */}
            <button
              onClick={() => setActiveTab("ai")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                activeTab === "ai"
                  ? "bg-white text-black shadow-2xs"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              <Sparkles size={14} className={activeTab === "ai" ? "text-amber-500" : "text-amber-600"} />
              <span>AI Tools</span>
              {lintResults.issuesCount > 0 && (
                <span
                  className="text-[10px] px-1.5 py-0.2 rounded-full font-extrabold bg-amber-400 text-black pointer-events-none"
                  title={`${lintResults.issuesCount} consistency issue(s) detected`}
                >
                  {lintResults.issuesCount}
                </span>
              )}
            </button>
          </div>

          {/* Right Cluster: History, Score, Share, Export & Overflow */}
          <div className="flex items-center gap-2 shrink-0">
            {/* History Undo / Redo & Snapshots */}
            <div className="hidden lg:flex items-center gap-0.5 bg-gray-100 rounded-xl p-0.5 border border-gray-200">
              <button
                type="button"
                onClick={undo}
                disabled={!canUndo}
                className="p-1.5 rounded-lg text-gray-700 hover:text-black hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition cursor-pointer"
                title="Undo (Ctrl+Z)"
              >
                <RotateCcw size={13} />
              </button>
              <button
                type="button"
                onClick={redo}
                disabled={!canRedo}
                className="p-1.5 rounded-lg text-gray-700 hover:text-black hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition cursor-pointer"
                title="Redo (Ctrl+Y)"
              >
                <RotateCw size={13} />
              </button>
              <div className="w-[1px] h-3 bg-gray-300 mx-0.5" />
              <button
                type="button"
                onClick={() => setIsVersionModalOpen(true)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-gray-700 hover:text-black hover:bg-white transition cursor-pointer"
                title="Resume Versions & Snapshots"
              >
                <History size={12} className="text-indigo-600" />
                <span className="hidden xl:inline">Versions</span>
                {resume.versions && resume.versions.length > 0 && (
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1 rounded-full font-bold">
                    {resume.versions.length}
                  </span>
                )}
              </button>
            </div>

            {/* Quality Score Pill */}
            <button
              onClick={() => setIsQualityModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 px-2.5 py-1.5 rounded-xl border border-gray-200 shadow-2xs transition cursor-pointer"
              title="Resume Quality & Consistency Linter (Click to audit)"
            >
              <ShieldCheck size={14} className={lintResults.allChecksPassed ? "text-green-600" : "text-amber-500"} />
              <span className="hidden sm:inline">Score</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                  lintResults.allChecksPassed
                    ? "bg-green-100 text-green-900"
                    : "bg-amber-100 text-amber-900"
                }`}
              >
                {lintResults.qualityScore}%
              </span>
            </button>

            {/* Share & Analytics Button */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs transition cursor-pointer"
              title="Share Link & Recruiter View Analytics"
            >
              <Share2 size={13} className={resume.isPublic ? "text-emerald-600" : "text-gray-500"} />
              <span>Share</span>
              {resume.isPublic && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Public Link Active" />
              )}
            </button>

            {/* Export Primary CTA Button */}
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl transition cursor-pointer shadow-xs"
              title="Export Resume (PDF, Word .docx, ATS Plain-Text .txt)"
            >
              <Download size={13} />
              <span>Export</span>
            </button>

            {/* Options Three-Dot Menu */}
            <div className="relative" ref={optionsMenuRef}>
              <button
                onClick={() => setIsOptionsMenuOpen(!isOptionsMenuOpen)}
                className="p-1.5 text-gray-600 hover:text-black rounded-xl hover:bg-gray-100 transition cursor-pointer border border-gray-200"
                title="More Options"
              >
                <MoreVertical size={16} />
              </button>

              {isOptionsMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-200 py-1.5 z-50 animate-in fade-in duration-150">
                  <button
                    onClick={() => {
                      setIsOptionsMenuOpen(false);
                      handleDuplicate();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <Copy size={14} className="text-gray-500" />
                    <span>Duplicate Resume</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsOptionsMenuOpen(false);
                      setIsTemplateSelectorOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <LayoutGrid size={14} className="text-gray-500" />
                    <span>Change Template</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsOptionsMenuOpen(false);
                      navigate(`/resume/${resumeId}/preview`);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <Eye size={14} className="text-gray-500" />
                    <span>Full Page Preview</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsOptionsMenuOpen(false);
                      setIsImportModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <Upload size={14} className="text-gray-500" />
                    <span>Import (PDF / JSON)</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsOptionsMenuOpen(false);
                      exportResumeBackup(resume);
                      toast.success("Resume JSON backup exported!");
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <FileCode size={14} className="text-gray-500" />
                    <span>Export JSON Backup</span>
                  </button>
                  <div className="my-1 border-t border-gray-100 mx-2" />
                  <button
                    onClick={() => {
                      setIsOptionsMenuOpen(false);
                      handleDelete();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
                  >
                    <Trash2 size={14} />
                    <span>Delete Resume</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Toggle Bar */}
      <div className="md:hidden flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setMobileTab("content")}
          className={`flex-1 py-3 text-xs font-bold ${
            mobileTab === "content" ? "border-b-2 border-black text-black" : "text-gray-500"
          }`}
        >
          Editor View
        </button>
        <button
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-3 text-xs font-bold ${
            mobileTab === "preview" ? "border-b-2 border-black text-black" : "text-gray-500"
          }`}
        >
          Live Preview
        </button>
      </div>

      {/* ── Main Workspace ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* ── Left Column: Active Tab Panel (6 Cols Desktop) ── */}
          <div className={`md:col-span-6 ${mobileTab === "preview" ? "hidden md:block" : "block"}`}>
            {/* CONTENT TAB VIEW */}
            {activeTab === "content" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* 1. Sleek Personal Information Header Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden transition-all">
                  <div className="p-4 sm:p-5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      {/* Compact Profile Avatar / Photo */}
                      {personalInfo.photo ? (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsPhotoEditorOpen(true);
                          }}
                          className="cursor-pointer group relative shrink-0"
                          title="Click to frame & style profile photo"
                        >
                          <PhotoDisplay
                            photo={personalInfo.photo}
                            photoSettings={resume.photoSettings}
                            primaryColor={resume.theme?.primaryColor}
                            sizeOverride={52}
                            className="rounded-full shadow-2xs ring-2 ring-gray-100 group-hover:scale-105 transition-transform"
                          />
                        </div>
                      ) : (
                        <div
                          onClick={() => toggleSectionExpand("personalInfo")}
                          className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0 cursor-pointer hover:bg-gray-200 hover:text-gray-600 transition"
                          title="Click to add photo & details"
                        >
                          <User size={22} />
                        </div>
                      )}

                      {/* Name & Contact Info Chips */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight truncate">
                            {personalInfo.fullName || "Your Full Name"}
                          </h2>
                        </div>

                        {/* Contact Chips */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1.5 text-xs">
                          {personalInfo.email && (
                            <span className="inline-flex items-center gap-1 text-gray-600 bg-gray-50 border border-gray-200/80 px-2 py-0.5 rounded-md font-medium">
                              <Mail size={11} className="text-gray-400" />
                              <span className="truncate max-w-[150px] sm:max-w-[200px]">{personalInfo.email}</span>
                            </span>
                          )}
                          {personalInfo.phone && (
                            <span className="inline-flex items-center gap-1 text-gray-600 bg-gray-50 border border-gray-200/80 px-2 py-0.5 rounded-md font-medium">
                              <Phone size={11} className="text-gray-400" />
                              <span>{personalInfo.phone}</span>
                            </span>
                          )}
                          {personalInfo.location && (
                            <span className="inline-flex items-center gap-1 text-gray-600 bg-gray-50 border border-gray-200/80 px-2 py-0.5 rounded-md font-medium">
                              <MapPin size={11} className="text-gray-400" />
                              <span className="truncate max-w-[130px]">{personalInfo.location}</span>
                            </span>
                          )}
                          {!personalInfo.email && !personalInfo.phone && !personalInfo.location && (
                            <span className="text-xs text-gray-400 italic">No contact info added yet</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Edit Profile Button */}
                    <button
                      type="button"
                      onClick={() => toggleSectionExpand("personalInfo")}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                        expandedSections.personalInfo
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 hover:text-black hover:bg-gray-100 border-gray-200"
                      }`}
                      title="Edit Personal Information"
                    >
                      <Pencil size={12} />
                      <span>{expandedSections.personalInfo ? "Close" : "Edit"}</span>
                    </button>
                  </div>

                  {expandedSections.personalInfo && (
                    <div className="border-t border-gray-100 p-5 bg-gray-50/50">
                      <PersonalInfoEditor onDone={() => setExpandedSections(prev => ({ ...prev, personalInfo: false }))} />
                    </div>
                  )}
                </div>

                {/* 2. Accordion Cards for Content Sections */}
                <div className="space-y-2.5">
                  {order.map((secKey, secIdx) => {
                    const meta = sectionMeta[secKey] || { label: secKey, icon: FileCode };
                    const Icon = meta.icon;
                    const isExpanded = expandedSections[secKey];
                    const isHidden = hidden.includes(secKey);
                    const entries = getEntries(secKey);
                    const isDraggedSection = draggedSectionIndex === secIdx;
                    const isSectionDragOver = dragOverSectionIndex === secIdx && draggedSectionIndex !== secIdx;

                    return (
                      <div
                        key={secKey}
                        onDragOver={(e) => handleSectionDragOver(e, secIdx)}
                        onDrop={(e) => handleSectionDrop(e, secIdx)}
                        className={`bg-white rounded-xl border transition-all shadow-2xs overflow-hidden ${
                          isSectionDragOver
                            ? "border-t-4 border-t-black ring-2 ring-black/10 scale-[1.01]"
                            : isExpanded
                            ? "border-gray-800 border-l-4"
                            : "border-gray-200 hover:border-gray-300"
                        } ${isDraggedSection ? "opacity-35 scale-[0.99] border-dashed border-gray-400" : ""}`}
                      >
                        <div
                          onClick={() => {
                            if (dragIsActiveRef.current) return;
                            toggleSectionExpand(secKey);
                          }}
                          className="px-4 py-3 sm:py-3.5 flex items-center justify-between cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            {/* GripVertical Section Drag Handle */}
                            <div
                              draggable
                              onDragStart={(e) => handleSectionDragStart(e, secIdx)}
                              onDragEnd={handleSectionDragEnd}
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 text-gray-300 hover:text-black hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing transition-colors shrink-0"
                              title="Drag handle to reorder section"
                            >
                              <GripVertical size={16} />
                            </div>

                            <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-800 flex items-center justify-center shrink-0">
                              <Icon size={16} />
                            </div>

                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              {editingHeading === secKey ? (
                                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="text"
                                    autoFocus
                                    value={sectionHeadings[secKey] ?? meta.label}
                                    onChange={(e) => setSectionHeadings({ ...sectionHeadings, [secKey]: e.target.value })}
                                    onKeyDown={(e) => e.key === "Enter" && setEditingHeading(null)}
                                    className="text-xs font-bold text-gray-900 bg-gray-100 border border-black rounded-lg px-2 py-0.5 outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setEditingHeading(null)}
                                    className="p-1 text-white bg-black hover:bg-gray-800 rounded-md transition cursor-pointer"
                                    title="Save heading"
                                  >
                                    <Check size={12} />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <h3 className="text-sm font-bold truncate text-gray-900">
                                    {sectionHeadings[secKey] || meta.label}
                                  </h3>
                                  <span className="text-[10px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                                    {entries.length === 0
                                      ? "Empty"
                                      : secKey === "skills"
                                      ? `${entries.length} skills`
                                      : `${entries.length} ${entries.length === 1 ? "entry" : "entries"}`}
                                  </span>
                                  {isExpanded && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingHeading(secKey);
                                      }}
                                      className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-black bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded-md transition cursor-pointer ml-auto sm:ml-0"
                                    >
                                      <Pencil size={10} />
                                      <span className="hidden sm:inline">Rename</span>
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            <div className="p-1 text-gray-400 hover:text-black">
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="border-t border-gray-100">
                            <div className="divide-y divide-gray-100">
                              {entries.map((entry, idx) => {
                                const isEntryHidden = Boolean(entry.hidden) || (secKey === "summary" && hidden.includes("summary"));
                                const isDraggedEntry = draggedEntry?.secKey === secKey && draggedEntry?.index === idx;
                                const isEntryDragOver = dragOverEntryIndex === idx && draggedEntry?.secKey === secKey && draggedEntry?.index !== idx;
                                const canDragEntry = secKey !== "summary" && secKey !== "declaration" && entries.length > 1;

                                return (
                                  <div
                                    key={entry.id || idx}
                                    onDragOver={(e) => canDragEntry && handleEntryDragOver(e, secKey, idx)}
                                    onDrop={(e) => canDragEntry && handleEntryDrop(e, secKey, idx)}
                                    onClick={() => {
                                      if (dragIsActiveRef.current) return;
                                      setEditingEntry({ section: secKey, entryId: entry.id || "summary_0", index: idx });
                                    }}
                                    className={`flex items-center gap-3 px-5 py-3 hover:bg-gray-50 cursor-pointer group transition-all ${
                                      isEntryDragOver
                                        ? "border-t-2 border-black bg-gray-100/80"
                                        : isDraggedEntry
                                        ? "opacity-35 bg-gray-100 border-dashed border-gray-300"
                                        : ""
                                    } ${isEntryHidden ? "opacity-50 bg-gray-50/50" : ""}`}
                                  >
                                    {canDragEntry ? (
                                      <div
                                        draggable
                                        onDragStart={(e) => handleEntryDragStart(e, secKey, idx)}
                                        onDragEnd={handleEntryDragEnd}
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-1 text-gray-300 hover:text-black hover:bg-gray-200 rounded cursor-grab active:cursor-grabbing transition shrink-0"
                                        title="Drag handle to reorder entry"
                                      >
                                        <GripVertical size={16} />
                                      </div>
                                    ) : (
                                      <div className="p-1 text-gray-200 shrink-0">
                                        <GripVertical size={16} />
                                      </div>
                                    )}
                                    <span className={`flex-1 text-sm ${isEntryHidden ? "text-gray-400" : "text-gray-700"} truncate`}>
                                      {getEntryLabel(secKey, entry, idx)}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleEntryVisibility(secKey, entry.id || "summary_0");
                                      }}
                                      className="p-1 text-gray-400 hover:text-black rounded-lg hover:bg-gray-100 transition cursor-pointer"
                                      title={isEntryHidden ? "Show entry" : "Hide entry"}
                                    >
                                      {isEntryHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                  </div>
                                );
                              })}

                              {/* New Entry row for all sections (matching FlowCV) */}
                              <div
                                onClick={() => handleAddEntry(secKey)}
                                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 cursor-pointer group"
                              >
                                <GripVertical size={16} className="text-gray-300 shrink-0" />
                                <span className="flex-1 text-sm text-gray-400 italic">New Entry</span>
                                <div className="p-1 text-gray-300">
                                  <Eye size={16} />
                                </div>
                              </div>
                            </div>

                            {/* Bottom action bar for all sections (matching FlowCV) */}
                            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                              <div className="flex-1 flex justify-center">
                                <button
                                  type="button"
                                  onClick={() => handleAddEntry(secKey)}
                                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-black border border-gray-200 hover:border-gray-400 px-4 py-2 rounded-xl transition cursor-pointer"
                                >
                                  <Plus size={14} />
                                  <span>Add Entry</span>
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteSection(secKey)}
                                className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                                title="Delete section content"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 3. Add Section & Import Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddContentOpen(true)}
                    className="flex-1 py-3.5 px-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-black bg-white hover:bg-gray-50 text-gray-700 hover:text-black font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                  >
                    <Plus size={16} />
                    <span>Add Section</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsImportModalOpen(true)}
                    className="flex-1 py-3.5 px-4 rounded-2xl border border-gray-200 hover:border-black bg-white hover:bg-gray-50 text-gray-700 hover:text-black font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                  >
                    <Upload size={16} />
                    <span>Import Resume (PDF / JSON)</span>
                  </button>
                </div>
              </div>
            )}

            {/* CUSTOMIZE TAB VIEW */}
            {activeTab === "customize" && <CustomizePanel />}

            {/* AI TOOLS TAB VIEW */}
            {activeTab === "ai" && (
              <AIToolsPanel
                onOpenQualityModal={() => setIsQualityModalOpen(true)}
                onOpenJobMatch={() => setIsJobMatchModalOpen(true)}
                onOpenInterviewPrep={() => setIsInterviewPrepOpen(true)}
                onOpenCoverLetter={() => {
                  setCoverLetterPrefill({ companyName: "", jobDescription: "" });
                  setIsCoverLetterOpen(true);
                }}
              />
            )}
          </div>

          {/* ── Right Column: Live Resume Preview (6 Cols Desktop) ── */}
          <div className={`md:col-span-6 ${mobileTab === "content" ? "hidden md:block" : "block"}`}>
            <ResumePreview resume={resume} />
          </div>
        </div>
      </main>

      {/* ── Centered Edit Entry Modal Window (FlowCV Style) ── */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
              <h3 className="text-lg font-bold text-gray-900">Edit Entry</h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowModalTips((prev) => !prev)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                    showModalTips
                      ? "text-amber-700 bg-amber-50 border-amber-200"
                      : "text-gray-600 hover:text-black bg-gray-50 hover:bg-gray-100 border-gray-200"
                  }`}
                >
                  <Sparkles size={13} className="text-amber-500" />
                  <span>{showModalTips ? "Hide Tips" : "Get Tips"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="p-2 text-gray-400 hover:text-black rounded-xl hover:bg-gray-100 transition cursor-pointer"
                  title="Close window"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {showModalTips && (
                <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 mb-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <Lightbulb size={16} className="text-amber-600" />
                    <span>Tips for {sectionMeta[editingEntry.section]?.label || "this section"}</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-amber-800 space-y-1.5 leading-relaxed pl-1">
                    {(SECTION_TIPS[editingEntry.section] || [
                      "Keep description clear and relevant to target positions.",
                    ]).map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {renderSectionEditor(editingEntry.section)}
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-3 border-t border-gray-100 bg-white shrink-0 space-y-3">
              <button
                type="button"
                onClick={() => setEditingEntry(null)}
                className="w-full py-3.5 bg-black hover:bg-gray-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Check size={16} />
                <span>Done</span>
              </button>
              <div className="flex justify-center">
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition cursor-pointer"
                >
                  <Settings size={13} />
                  <span>Show customizations for this section</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      <AddContentModal
        isOpen={isAddContentOpen}
        onClose={() => setIsAddContentOpen(false)}
        onAddSection={(secId) => setExpandedSections({ [secId]: true })}
      />

      <ATSAnalysisModal
        isOpen={isATSModalOpen}
        onClose={() => setIsATSModalOpen(false)}
      />

      <JobMatchModal
        isOpen={isJobMatchModalOpen}
        onClose={() => setIsJobMatchModalOpen(false)}
        resumeId={resumeId || resume._id}
        onOpenCoverLetter={(data) => {
          setIsJobMatchModalOpen(false);
          setCoverLetterPrefill(data || { companyName: "", jobDescription: "" });
          setIsCoverLetterOpen(true);
        }}
      />

      <TemplateSelector
        isOpen={isTemplateSelectorOpen}
        onClose={() => setIsTemplateSelectorOpen(false)}
      />

      <QualityLinterModal
        isOpen={isQualityModalOpen}
        onClose={() => setIsQualityModalOpen(false)}
      />

      <ImportResumeModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportData={handleImportData}
      />

      <PhotoEditorModal
        isOpen={isPhotoEditorOpen}
        onClose={() => setIsPhotoEditorOpen(false)}
      />

      <ExportResumeModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        resume={resume}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      <ShareResumeModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        resumeId={resumeId}
        initialPublic={resume.isPublic}
      />

      <VersionHistoryModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
      />

      <InterviewPrepModal
        isOpen={isInterviewPrepOpen}
        onClose={() => setIsInterviewPrepOpen(false)}
        resume={resume}
      />

      <CoverLetterModal
        isOpen={isCoverLetterOpen}
        onClose={() => setIsCoverLetterOpen(false)}
        initialCompany={coverLetterPrefill.companyName}
        initialJobDesc={coverLetterPrefill.jobDescription}
      />
    </div>
  );
}

export function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(Boolean(id && id !== "new"));
  const [resumeId, setResumeId] = useState(id && id !== "new" ? id : null);

  useEffect(() => {
    if (id === "new") {
      handleCreateNew();
    } else if (id) {
      loadResume(id);
    }
  }, [id]);

  const handleCreateNew = async () => {
    try {
      setLoading(true);
      const res = await createResume({ title: "My Resume", template: "modern" });
      if (res.data.success && res.data.resume) {
        setInitialData(res.data.resume);
        setResumeId(res.data.resume._id);
        navigate(`/resume/${res.data.resume._id}/edit`, { replace: true });
      }
    } catch (err) {
      toast.error("Failed to create resume");
      navigate("/resumes");
    } finally {
      setLoading(false);
    }
  };

  const loadResume = async (resId) => {
    try {
      setLoading(true);
      const res = await getResumeById(resId);
      if (res.data.success && res.data.resume) {
        setInitialData(res.data.resume);
      }
    } catch (err) {
      toast.error("Failed to load resume");
      navigate("/resumes");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={32} className="animate-spin text-black" />
          <p className="text-sm font-medium text-gray-600">Loading Resume Builder Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <ResumeProvider initialData={initialData} resumeId={resumeId}>
      <ResumeBuilderContent resumeId={resumeId} />
    </ResumeProvider>
  );
}

export default ResumeBuilder;
