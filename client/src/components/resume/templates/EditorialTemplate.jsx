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
import SkillsRenderer from "../SkillsRenderer";

/**
 * FlowCV Template: Editorial Rule, Classic Clear, True Blue, Precision Line, Condensed Rule, Refined, Classic Serif
 * Covers single-column precision layouts with custom rule dividers and typography.
 */
export function EditorialTemplate({ resume, highlightKeywords = [], variant = "editorial" }) {
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

  const tpl = resume.template || variant;
  const isTrueBlue = tpl === "true-blue";
  const isEditorial = tpl === "editorial-rule";
  const isClassicClear = tpl === "classic-clear";
  const isPrecision = tpl === "precision-line";
  const isCondensed = tpl === "condensed-rule";
  const isRefined = tpl === "refined";
  const isClassicSerif = tpl === "classic-serif";

  // Accent color selection
  const accentColor = theme.primaryColor && theme.primaryColor !== "#000000"
    ? theme.primaryColor
    : isTrueBlue
    ? "#1D4ED8" // Royal Blue
    : "#111827"; // Dark Charcoal / Black

  const fontFamilyClass =
    isEditorial || isClassicClear || isClassicSerif
      ? "font-serif"
      : theme.fontFamily === "mono"
      ? "font-mono"
      : "font-sans";

  const isVisible = (sec) => !hiddenSections.includes(sec);
  const H = (text) => <HighlightText text={text} keywords={highlightKeywords} />;
  const styles = getThemeSpacingStyles(theme);

  const activeOrder = sectionOrder.filter((k) => k !== "personalInfo" && isVisible(k));

  // Section Heading Divider Styles
  const SectionHeader = ({ title }) => {
    if (isEditorial) {
      return (
        <div className="resume-heading-block w-full border-t border-b border-gray-900 py-1 mb-3 mt-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 text-left">
            {title}
          </h2>
        </div>
      );
    }

    if (isPrecision) {
      return (
        <div className="resume-heading-block w-full border-b-2 border-double border-gray-800 pb-1 mb-2.5">
          <h2 className="text-xs font-black uppercase tracking-wider text-gray-900">
            {title}
          </h2>
        </div>
      );
    }

    if (isTrueBlue) {
      return (
        <div className="resume-heading-block w-full border-b-2 pb-1 mb-3" style={{ borderColor: accentColor }}>
          <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
            {title}
          </h2>
        </div>
      );
    }

    if (isRefined) {
      return (
        <div className="resume-heading-block w-full flex items-center gap-2 pb-1 mb-3 border-b border-gray-200">
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-black text-white">
            {title}
          </span>
        </div>
      );
    }

    // Default (Classic Clear / Condensed Rule / Classic Serif)
    return (
      <div className="resume-heading-block w-full border-b border-gray-300 pb-1 mb-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900">
          {title}
        </h2>
      </div>
    );
  };

  const renderSection = (secKey) => {
    switch (secKey) {
      case "summary":
        return summary ? (
          <div key="summary" style={styles.sectionStyle}>
            <SectionHeader title="Summary" />
            <p className="text-gray-700 text-xs leading-relaxed whitespace-pre-line">{H(summary)}</p>
          </div>
        ) : null;

      case "experience":
        const activeExp = experience.filter((e) => !e.hidden);
        return activeExp.length > 0 ? (
          <div key="experience" style={styles.sectionStyle}>
            <SectionHeader title="Professional Experience" />
            <div className={isCondensed ? "space-y-3" : "space-y-4"}>
              {activeExp.map((exp) => (
                <div key={exp.id || Math.random()} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-gray-900">
                    <span className="text-[12px]">
                      {exp.company}
                      {exp.jobTitle && <span className="font-semibold text-gray-700">, {exp.jobTitle}</span>}
                    </span>
                    <span className="text-[11px] text-gray-500 font-semibold">
                      {exp.startDate} {exp.startDate && exp.endDate ? "–" : ""} {exp.currentlyWorking ? "Present" : exp.endDate}
                      {exp.location && <span> | {exp.location}</span>}
                    </span>
                  </div>
                  {exp.description && (
                    <div className="text-gray-600 text-xs whitespace-pre-line mt-1 leading-relaxed">
                      {H(exp.description)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "education":
        const activeEdu = education.filter((e) => !e.hidden);
        return activeEdu.length > 0 ? (
          <div key="education" style={styles.sectionStyle}>
            <SectionHeader title="Education" />
            <div className={isCondensed ? "space-y-2.5" : "space-y-3"}>
              {activeEdu.map((edu) => (
                <div key={edu.id || Math.random()} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-gray-900">
                    <span>
                      {edu.institution}
                      {edu.degree && <span className="font-normal text-gray-700"> — {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}</span>}
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium">
                      {edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}
                    </span>
                  </div>
                  {edu.grade && <p className="text-[10.5px] text-gray-500 mt-0.5">Grade: {edu.grade}</p>}
                  {edu.description && <p className="text-gray-500 mt-1">{H(edu.description)}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "skills":
        const activeSkills = skills.filter((s) => !s.hidden);
        return activeSkills.length > 0 ? (
          <div key="skills" style={styles.sectionStyle}>
            <SectionHeader title="Skills" />
            {isEditorial || isCondensed ? (
              /* Inline pipe-delimited format as in Editorial Rule screenshot */
              <div className="text-xs text-gray-800 leading-relaxed">
                {activeSkills.map((s, idx) => (
                  <span key={s.id || idx}>
                    <span className="font-medium">{H(s.name)}</span>
                    {idx < activeSkills.length - 1 && <span className="text-gray-400 font-bold mx-2">|</span>}
                  </span>
                ))}
              </div>
            ) : (
              <SkillsRenderer skills={activeSkills} theme={theme} highlightKeywords={highlightKeywords} />
            )}
          </div>
        ) : null;

      case "projects":
        const activeProjects = projects.filter((p) => !p.hidden);
        return activeProjects.length > 0 ? (
          <div key="projects" style={styles.sectionStyle}>
            <SectionHeader title="Projects" />
            <div className="space-y-3">
              {activeProjects.map((proj) => (
                <div key={proj.id || Math.random()} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-gray-900">
                    <span>{H(proj.title)}</span>
                    {proj.endDate && <span className="text-[11px] text-gray-400 font-normal">{proj.endDate}</span>}
                  </div>
                  {proj.technologies && (
                    <p className="text-[10.5px] font-semibold text-gray-500 mt-0.5">
                      Tech: {H(proj.technologies)}
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
            <SectionHeader title="Certificates" />
            <div className="space-y-1.5">
              {activeCerts.map((cert) => (
                <div key={cert.id || Math.random()} className="flex justify-between items-baseline text-xs">
                  <span className="font-semibold text-gray-900">
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
            <SectionHeader title="Languages" />
            {isEditorial ? (
              <div className="text-xs text-gray-800 leading-relaxed">
                {activeLangs.map((l, idx) => (
                  <span key={l.id || idx}>
                    <span className="font-semibold">{H(l.language)}</span> ({l.proficiency || "Fluent"})
                    {idx < activeLangs.length - 1 && <span className="text-gray-400 font-bold mx-2">|</span>}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-4 text-xs">
                {activeLangs.map((lang) => (
                  <div key={lang.id || Math.random()} className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-900">{H(lang.language)}:</span>
                    <span className="text-gray-600">{lang.proficiency || "Fluent"}</span>
                  </div>
                ))}
              </div>
            )}
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
      {isEditorial || isClassicClear || isClassicSerif ? (
        /* FlowCV Centered Header */
        <div className="text-center pb-5 mb-5 border-b border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-gray-900">
            {personalInfo.fullName || "Your Name"}
          </h1>
          {personalInfo.jobTitle && (
            <p className="text-xs font-semibold text-gray-600 mt-1 uppercase tracking-wider">
              {personalInfo.jobTitle}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-gray-500 pt-2.5">
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.email && <span>• {personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          </div>
        </div>
      ) : (
        /* FlowCV Left-Aligned Header */
        <div className="pb-5 mb-5 border-b border-gray-200">
          <h1
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: isTrueBlue ? accentColor : "#111827" }}
          >
            {personalInfo.fullName || "Your Name"}
          </h1>
          {personalInfo.jobTitle && (
            <p className="text-xs font-semibold text-gray-600 mt-0.5 uppercase tracking-wider">
              {personalInfo.jobTitle}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 pt-2">
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
      )}

      {/* ── BODY SECTIONS ── */}
      <div className={isCondensed ? "space-y-4 flex-1" : "space-y-5 flex-1"}>
        {activeOrder.map((key) => renderSection(key))}
      </div>
    </div>
  );
}

export default EditorialTemplate;
