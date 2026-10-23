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
import HeadingRenderer from "../HeadingRenderer";
import SkillsRenderer from "../SkillsRenderer";

/**
 * FlowCV Template: Cobalt Edge
 * Features a bold top hero banner with white text and circular avatar on the right,
 * followed by a clean, single-column body with accent borders.
 */
export function CobaltTemplate({ resume, highlightKeywords = [] }) {
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

  const bannerColor = theme.primaryColor && theme.primaryColor !== "#000000"
    ? theme.primaryColor
    : "#0B3B60"; // Deep Cobalt Blue

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

  const renderSection = (secKey) => {
    switch (secKey) {
      case "summary":
        return summary ? (
          <div key="summary" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Summary"
              theme={{ ...theme, headingStyle: "left-bar", primaryColor: bannerColor }}
              headingTextColor="#0F172A"
            />
            <p className="text-gray-700 text-xs leading-relaxed whitespace-pre-line">{H(summary)}</p>
          </div>
        ) : null;

      case "experience":
        const activeExp = experience.filter((e) => !e.hidden);
        return activeExp.length > 0 ? (
          <div key="experience" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Professional Experience"
              theme={{ ...theme, headingStyle: "left-bar", primaryColor: bannerColor }}
              headingTextColor="#0F172A"
            />
            <div className="space-y-4">
              {activeExp.map((exp) => (
                <div key={exp.id || Math.random()} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-gray-900">
                    <span className="text-[12.5px]">{exp.jobTitle}</span>
                    <span className="text-[11px] text-gray-400 font-semibold">
                      {exp.startDate} {exp.startDate && exp.endDate ? "–" : ""} {exp.currentlyWorking ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 font-semibold mt-0.5 text-[11px]">
                    <span style={{ color: bannerColor }}>{exp.company}</span>
                    {exp.location && <span>• {exp.location}</span>}
                  </div>
                  {exp.description && (
                    <div className="text-gray-600 text-xs whitespace-pre-line mt-1.5 leading-relaxed">
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
            <HeadingRenderer
              title="Education"
              theme={{ ...theme, headingStyle: "left-bar", primaryColor: bannerColor }}
              headingTextColor="#0F172A"
            />
            <div className="space-y-3">
              {activeEdu.map((edu) => (
                <div key={edu.id || Math.random()} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-gray-900">
                    <span>{edu.degree || "Degree"}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}</span>
                    <span className="text-[11px] text-gray-400 font-semibold">
                      {edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium text-[11px] mt-0.5">
                    {edu.institution} {edu.grade ? `• Grade: ${edu.grade}` : ""}
                  </p>
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
            <HeadingRenderer
              title="Skills"
              theme={{ ...theme, headingStyle: "left-bar", primaryColor: bannerColor }}
              headingTextColor="#0F172A"
            />
            <SkillsRenderer skills={activeSkills} theme={{ ...theme, primaryColor: bannerColor }} highlightKeywords={highlightKeywords} />
          </div>
        ) : null;

      case "projects":
        const activeProjects = projects.filter((p) => !p.hidden);
        return activeProjects.length > 0 ? (
          <div key="projects" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Projects"
              theme={{ ...theme, headingStyle: "left-bar", primaryColor: bannerColor }}
              headingTextColor="#0F172A"
            />
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
            <HeadingRenderer
              title="Certificates"
              theme={{ ...theme, headingStyle: "left-bar", primaryColor: bannerColor }}
              headingTextColor="#0F172A"
            />
            <div className="space-y-2">
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
            <HeadingRenderer
              title="Languages"
              theme={{ ...theme, headingStyle: "left-bar", primaryColor: bannerColor }}
              headingTextColor="#0F172A"
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {activeLangs.map((lang) => (
                <div key={lang.id || Math.random()} className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <p className="font-bold text-gray-900">{H(lang.language)}</p>
                  <p className="text-[10.5px] text-gray-500 mt-0.5">{lang.proficiency || "Fluent"}</p>
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
      className={`w-full bg-white flex flex-col ${fontFamilyClass} ${styles.fontScaleClass} ${styles.lineHeightClass} text-gray-900 overflow-hidden`}
      style={{ minHeight: `${minPageHeight}px` }}
    >
      {/* ── TOP HERO BANNER (Full Bleed) ── */}
      <div className="w-full p-8 text-white flex items-center justify-between shadow-xs" style={{ backgroundColor: bannerColor }}>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {personalInfo.fullName || "Your Name"}
          </h1>
          {personalInfo.jobTitle && (
            <p className="text-sm font-semibold text-white/80 uppercase tracking-widest">
              {personalInfo.jobTitle}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/90 pt-2">
            {personalInfo.email && (
              <span className="flex items-center gap-1.5">
                <Mail size={13} className="text-white/70" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1.5">
                <Phone size={13} className="text-white/70" />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={13} className="text-white/70" />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1.5">
                <LinkIcon size={13} className="text-white/70" />
                {personalInfo.linkedin}
              </span>
            )}
          </div>
        </div>

        {/* Circular Avatar / Photo */}
        {personalInfo.photo && (
          <div className="shrink-0 ml-6">
            <PhotoDisplay
              photo={personalInfo.photo}
              photoSettings={resume.photoSettings}
              primaryColor="#FFFFFF"
            />
          </div>
        )}
      </div>

      {/* ── BODY CONTENT ── */}
      <div className="flex-1 p-8 sm:p-10 space-y-5">
        {activeOrder.map((key) => renderSection(key))}
      </div>
    </div>
  );
}

export default CobaltTemplate;
