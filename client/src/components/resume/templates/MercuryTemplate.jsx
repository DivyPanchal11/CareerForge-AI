import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Link as LinkIcon,
  Briefcase,
  GraduationCap,
  Wrench,
  Languages,
  Award,
  FolderGit2,
} from "lucide-react";
import { HighlightText } from "../HighlightText";
import { getThemeSpacingStyles } from "../../../utils/themeStyles";
import PhotoDisplay from "../PhotoDisplay";
import SkillsRenderer from "../SkillsRenderer";

/**
 * FlowCV Template: Mercury Flow, Steady Form, Silver Banner
 * Features soft-tinted section banner bands and a structured 2-column date-on-left subgrid.
 */
export function MercuryTemplate({ resume, highlightKeywords = [], variant = "mercury" }) {
  const {
    personalInfo = {},
    summary,
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    awards = [],
    hiddenSections = [],
    sectionOrder = [
      "summary",
      "experience",
      "education",
      "skills",
      "projects",
      "certifications",
      "languages",
      "awards",
    ],
    theme = {},
    minPageHeight = 1123,
  } = resume;

  const isSteady = variant === "steady" || resume.template === "steady-form";
  const isSilver = variant === "silver" || resume.template === "silver-banner";

  const bannerBg = isSilver
    ? "#E2E8F0" // Silver slate-200
    : isSteady
    ? "#F1F5F9" // Slate-100
    : "#F3F4F6"; // Gray-100 Mercury

  const bannerText = "#1E293B";

  const fontFamilyClass =
    theme.fontFamily === "serif"
      ? "font-serif"
      : theme.fontFamily === "mono"
      ? "font-mono"
      : "font-sans";

  const isVisible = (sec) => !hiddenSections.includes(sec);
  const H = (text) => <HighlightText text={text} keywords={highlightKeywords} />;
  const styles = getThemeSpacingStyles(theme);

  const activeOrder = sectionOrder.filter((k) => k !== "personalInfo" && isVisible(k));

  const SectionBanner = ({ title }) => (
    <div
      className="resume-heading-block w-full py-1 px-3 rounded-md mb-3 font-extrabold uppercase tracking-wider text-[11px] flex items-center justify-between"
      style={{ backgroundColor: bannerBg, color: bannerText }}
    >
      <span>{title}</span>
    </div>
  );

  const renderSection = (secKey) => {
    switch (secKey) {
      case "summary":
        return summary ? (
          <div key="summary" style={styles.sectionStyle}>
            <SectionBanner title="Summary" />
            <p className="text-gray-700 text-xs leading-relaxed px-1 whitespace-pre-line">{H(summary)}</p>
          </div>
        ) : null;

      case "experience":
        const activeExp = experience.filter((e) => !e.hidden);
        return activeExp.length > 0 ? (
          <div key="experience" style={styles.sectionStyle}>
            <SectionBanner title="Professional Experience" />
            <div className="space-y-4 px-1">
              {activeExp.map((exp) => (
                <div key={exp.id || Math.random()} className="grid grid-cols-12 gap-4 text-xs">
                  {/* Left Column: Dates & Location */}
                  <div className="col-span-4 text-gray-500 font-medium">
                    <p className="font-semibold text-gray-700">
                      {exp.startDate} {exp.startDate && exp.endDate ? "–" : ""} {exp.currentlyWorking ? "Present" : exp.endDate}
                    </p>
                    {exp.location && <p className="text-[10.5px] text-gray-400 mt-0.5">{exp.location}</p>}
                  </div>

                  {/* Right Column: Title, Company & Achievements */}
                  <div className="col-span-8">
                    <div className="font-bold text-gray-900 text-[12px]">
                      {exp.company}
                      {exp.jobTitle && <span className="font-normal text-gray-600 block text-[11px] mt-0.5">{exp.jobTitle}</span>}
                    </div>
                    {exp.description && (
                      <div className="text-gray-600 text-xs whitespace-pre-line mt-1 leading-relaxed">
                        {H(exp.description)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "education":
        const activeEdu = education.filter((e) => !e.hidden);
        return activeEdu.length > 0 ? (
          <div key="education" style={styles.sectionStyle}>
            <SectionBanner title="Education" />
            <div className="space-y-3 px-1">
              {activeEdu.map((edu) => (
                <div key={edu.id || Math.random()} className="grid grid-cols-12 gap-4 text-xs">
                  <div className="col-span-4 text-gray-500">
                    <p className="font-semibold text-gray-700">
                      {edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}
                    </p>
                  </div>
                  <div className="col-span-8">
                    <p className="font-bold text-gray-900">
                      {edu.institution}
                      {edu.degree && <span className="font-normal text-gray-600 block text-[11px] mt-0.5">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}</span>}
                    </p>
                    {edu.grade && <p className="text-[10.5px] text-gray-500 mt-0.5">Grade: {edu.grade}</p>}
                    {edu.description && <p className="text-gray-500 mt-1">{H(edu.description)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "skills":
        const activeSkills = skills.filter((s) => !s.hidden);
        return activeSkills.length > 0 ? (
          <div key="skills" style={styles.sectionStyle}>
            <SectionBanner title="Skills" />
            <div className="px-1">
              <SkillsRenderer skills={activeSkills} theme={theme} highlightKeywords={highlightKeywords} />
            </div>
          </div>
        ) : null;

      case "projects":
        const activeProjects = projects.filter((p) => !p.hidden);
        return activeProjects.length > 0 ? (
          <div key="projects" style={styles.sectionStyle}>
            <SectionBanner title="Projects" />
            <div className="space-y-3 px-1">
              {activeProjects.map((proj) => (
                <div key={proj.id || Math.random()} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-gray-900">
                    <span>{H(proj.title)}</span>
                    {proj.endDate && <span className="text-[11px] text-gray-400 font-normal">{proj.endDate}</span>}
                  </div>
                  {proj.technologies && (
                    <p className="text-[10.5px] font-semibold text-gray-500 mt-0.5">
                      Scope / Technologies: {H(proj.technologies)}
                    </p>
                  )}
                  {proj.description && (
                    <div className="text-gray-600 text-xs whitespace-pre-line mt-1 leading-relaxed">
                      {H(proj.description)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "certifications":
        const activeCerts = certifications.filter((c) => !c.hidden);
        return activeCerts.length > 0 ? (
          <div key="certifications" style={styles.sectionStyle}>
            <SectionBanner title="Certificates" />
            <div className="space-y-2 px-1">
              {activeCerts.map((cert) => (
                <div key={cert.id || Math.random()} className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-gray-900">
                    {H(cert.name)} {cert.issuer && <span className="font-normal text-gray-600">— {H(cert.issuer)}</span>}
                  </span>
                  {(cert.issueDate || cert.date) && (
                    <span className="text-[11px] text-gray-400 font-medium">{cert.issueDate || cert.date}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "languages":
        const activeLangs = languages.filter((l) => !l.hidden);
        return activeLangs.length > 0 ? (
          <div key="languages" style={styles.sectionStyle}>
            <SectionBanner title="Languages" />
            <div className="flex flex-wrap gap-4 text-xs px-1">
              {activeLangs.map((lang) => (
                <div key={lang.id || Math.random()} className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{H(lang.language)}:</span>
                  <span className="text-gray-600">{lang.proficiency || "Fluent"}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div
      className={`w-full bg-white p-8 sm:p-10 flex flex-col ${fontFamilyClass} ${styles.fontScaleClass} ${styles.lineHeightClass} text-gray-900 overflow-hidden`}
      style={{ minHeight: `${minPageHeight}px` }}
    >
      {/* ── HEADER ── */}
      {isSteady ? (
        /* Steady Form 2x3 Contact Grid Header */
        <div className="flex items-start justify-between gap-6 pb-6 border-b border-gray-200 mb-6">
          <div className="space-y-3 flex-1">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                {personalInfo.fullName || "Your Name"}
              </h1>
              {personalInfo.jobTitle && (
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-0.5">
                  {personalInfo.jobTitle}
                </p>
              )}
            </div>

            {/* 2x3 Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 max-w-lg">
              {personalInfo.email && (
                <div className="p-1.5 rounded bg-gray-50 border border-gray-100 flex items-center gap-1.5 truncate">
                  <Mail size={12} className="shrink-0 text-gray-400" />
                  <span className="truncate">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="p-1.5 rounded bg-gray-50 border border-gray-100 flex items-center gap-1.5 truncate">
                  <Phone size={12} className="shrink-0 text-gray-400" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="p-1.5 rounded bg-gray-50 border border-gray-100 flex items-center gap-1.5 truncate">
                  <MapPin size={12} className="shrink-0 text-gray-400" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="p-1.5 rounded bg-gray-50 border border-gray-100 flex items-center gap-1.5 truncate">
                  <LinkIcon size={12} className="shrink-0 text-gray-400" />
                  <span className="truncate">{personalInfo.linkedin}</span>
                </div>
              )}
            </div>
          </div>

          {/* Photo on Top Right */}
          {personalInfo.photo && (
            <div className="shrink-0">
              <PhotoDisplay
                photo={personalInfo.photo}
                photoSettings={resume.photoSettings}
                primaryColor="#000000"
              />
            </div>
          )}
        </div>
      ) : (
        /* Mercury Flow Classic Avatar + Header */
        <div className="flex items-center gap-6 pb-6 border-b border-gray-200 mb-6">
          {personalInfo.photo && (
            <div className="shrink-0">
              <PhotoDisplay
                photo={personalInfo.photo}
                photoSettings={resume.photoSettings}
                primaryColor="#000000"
              />
            </div>
          )}

          <div className="flex-1 space-y-1">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              {personalInfo.fullName || "Your Name"}
            </h1>
            {personalInfo.jobTitle && (
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                {personalInfo.jobTitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 pt-1">
              {personalInfo.email && (
                <span className="flex items-center gap-1">
                  <Mail size={12} className="text-gray-400" />
                  {personalInfo.email}
                </span>
              )}
              {personalInfo.phone && (
                <span className="flex items-center gap-1">
                  <Phone size={12} className="text-gray-400" />
                  {personalInfo.phone}
                </span>
              )}
              {personalInfo.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-gray-400" />
                  {personalInfo.location}
                </span>
              )}
              {personalInfo.linkedin && (
                <span className="flex items-center gap-1">
                  <LinkIcon size={12} className="text-gray-400" />
                  {personalInfo.linkedin}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── SECTIONS ── */}
      <div className="space-y-5 flex-1">
        {activeOrder.map((key) => renderSection(key))}
      </div>
    </div>
  );
}

export default MercuryTemplate;
