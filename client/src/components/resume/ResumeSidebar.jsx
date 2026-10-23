import React from "react";
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Languages,
  Heart,
  Plus,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Target,
  FileCode,
} from "lucide-react";
import { useResume } from "../../context/ResumeContext";

const sectionMeta = {
  personalInfo: { label: "Personal Information", icon: User },
  summary: { label: "Professional Summary", icon: FileText },
  experience: { label: "Work Experience", icon: Briefcase },
  education: { label: "Education", icon: GraduationCap },
  skills: { label: "Skills", icon: Wrench },
  projects: { label: "Projects", icon: FolderGit2 },
  certifications: { label: "Certifications", icon: Award },
  languages: { label: "Languages", icon: Languages },
  interests: { label: "Interests & Hobbies", icon: Heart },
  custom: { label: "Custom Sections", icon: FileCode },
};

export function ResumeSidebar({ onOpenAddContent, onOpenATSModal, onOpenJobMatchModal, onOpenTemplateSelector }) {
  const { resume, activeSection, setActiveSection, toggleSectionVisibility, reorderSections } = useResume();
  const order = resume.sectionOrder || Object.keys(sectionMeta);
  const hidden = resume.hiddenSections || [];

  const handleMove = (index, direction) => {
    const newOrder = [...order];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);
    reorderSections(newOrder);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col justify-between h-full">
      <div className="space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">Resume Structure</h2>
        </div>

        {/* Section List */}
        <div className="space-y-1">
          {order.map((secKey, index) => {
            const meta = sectionMeta[secKey] || { label: secKey, icon: FileCode };
            const Icon = meta.icon;
            const isSelected = activeSection === secKey;
            const isHidden = hidden.includes(secKey);

            return (
              <div
                key={secKey}
                onClick={() => setActiveSection(secKey)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition text-xs font-medium ${
                  isSelected
                    ? "bg-black text-white font-bold shadow-xs"
                    : isHidden
                    ? "bg-gray-50 text-gray-600"
                    : "text-gray-700 hover:bg-gray-100 hover:text-black"
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <Icon size={16} className={isSelected ? "text-white" : "text-gray-500"} />
                  <span className="truncate">{meta.label}</span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSectionVisibility(secKey);
                    }}
                    className={`p-1 rounded ${isSelected ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}
                    title={isHidden ? "Show Section" : "Hide Section"}
                  >
                    {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>

                  {index > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMove(index, "up");
                      }}
                      className={`p-0.5 rounded ${isSelected ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}
                    >
                      <ChevronUp size={13} />
                    </button>
                  )}

                  {index < order.length - 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMove(index, "down");
                      }}
                      className={`p-0.5 rounded ${isSelected ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}
                    >
                      <ChevronDown size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Content Button */}
        <button
          type="button"
          onClick={onOpenAddContent}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-dashed border-gray-300 hover:border-black text-xs font-semibold text-gray-700 hover:text-black bg-gray-50/50 hover:bg-gray-50 transition cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Content / Section</span>
        </button>
      </div>

      {/* AI Tools Quick Launcher */}
      <div className="pt-4 border-t border-gray-100 space-y-2 mt-4">
        <button
          type="button"
          onClick={onOpenTemplateSelector}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-900 border border-gray-200 transition cursor-pointer"
        >
          <span>Template Style</span>
          <span className="capitalize text-gray-500">{resume.template}</span>
        </button>

        <button
          type="button"
          onClick={onOpenATSModal}
          className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-semibold transition cursor-pointer shadow-xs"
        >
          <Sparkles size={15} />
          <span>Run ATS Analysis</span>
        </button>

        <button
          type="button"
          onClick={onOpenJobMatchModal}
          className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-semibold border border-gray-200 transition cursor-pointer"
        >
          <Target size={15} />
          <span>Match Job Description</span>
        </button>
      </div>
    </div>
  );
}

export default ResumeSidebar;
