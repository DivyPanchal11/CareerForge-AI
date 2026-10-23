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
} from "lucide-react";
import { HighlightText } from "../HighlightText";
import { getThemeSpacingStyles } from "../../../utils/themeStyles";
import PhotoDisplay from "../PhotoDisplay";
import SkillsRenderer from "../SkillsRenderer";

/**
 * FlowCV Template: Saffron Line & Quicksilver
 * Features an asymmetric 35/65 dual-column layout with warm saffron or silver accent lines.
 */
export function SaffronTemplate({ resume, highlightKeywords = [], variant = "saffron" }) {
  const {
    personalInfo = {},
    summary,
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    hiddenSections = [],
    theme = {},
    minPageHeight = 1123,
  } = resume;

  const isQuicksilver = variant === "quicksilver" || resume.template === "quicksilver";
  const accentColor = theme.primaryColor && theme.primaryColor !== "#000000"
    ? theme.primaryColor
    : isQuicksilver
    ? "#475569" // Quicksilver slate
    : "#D97706"; // Saffron Amber-600

  const sidebarBg = isQuicksilver ? "#F8FAFC" : "transparent";

  const fontFamilyClass =
    theme.fontFamily === "serif"
      ? "font-serif"
      : theme.fontFamily === "mono"
      ? "font-mono"
      : "font-sans";

  const isVisible = (sec) => !hiddenSections.includes(sec);
  const H = (text) => <HighlightText text={text} keywords={highlightKeywords} />;
  const styles = getThemeSpacingStyles(theme);

  const activeExp = experience.filter((e) => !e.hidden);
  const activeEdu = education.filter((e) => !e.hidden);
  const activeSkills = skills.filter((s) => !s.hidden);
  const activeProjects = projects.filter((p) => !p.hidden);
  const activeCerts = certifications.filter((c) => !c.hidden);
  const activeLangs = languages.filter((l) => !l.hidden);

  return (
    <div
      className={`w-full bg-white p-8 sm:p-10 flex flex-col ${fontFamilyClass} ${styles.fontScaleClass} ${styles.lineHeightClass} text-gray-900 overflow-hidden`}
      style={{ minHeight: `${minPageHeight}px` }}
    >
      {/* ── HEADER ── */}
      <div className="flex items-center gap-6 pb-6 border-b-2 mb-6" style={{ borderColor: accentColor }}>
        {personalInfo.photo && (
          <div className="shrink-0">
            <PhotoDisplay
              photo={personalInfo.photo}
              photoSettings={resume.photoSettings}
              primaryColor={accentColor}
            />
          </div>
        )}

        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <h1 className="text-2xl font-serif font-black text-gray-900 tracking-tight">
              {personalInfo.fullName || "Your Name"}
            </h1>
            {personalInfo.jobTitle && (
              <span className="text-sm font-medium text-gray-600">
                {personalInfo.jobTitle}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 pt-1">
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail size={12} style={{ color: accentColor }} />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone size={12} style={{ color: accentColor }} />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin size={12} style={{ color: accentColor }} />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                <LinkIcon size={12} style={{ color: accentColor }} />
                {personalInfo.linkedin}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── ASYMMETRIC DUAL-COLUMN BODY (35% Left / 65% Right) ── */}
      <div className="grid grid-cols-12 gap-8 flex-1">
        {/* Left Column (35% width) */}
        <div className={`col-span-4 space-y-6 ${isQuicksilver ? "p-4 rounded-xl" : "pr-2"}`} style={{ backgroundColor: sidebarBg }}>
          {/* Summary */}
          {summary && isVisible("summary") && (
            <div>
              <h2
                className="resume-heading-block text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                Summary
              </h2>
              <p className="text-[11px] text-gray-700 leading-relaxed whitespace-pre-line">{H(summary)}</p>
            </div>
          )}

          {/* Skills */}
          {activeSkills.length > 0 && isVisible("skills") && (
            <div>
              <h2
                className="resume-heading-block text-xs font-bold uppercase tracking-wider pb-1 mb-2.5 border-b"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                Skills
              </h2>
              <SkillsRenderer skills={activeSkills} theme={{ ...theme, primaryColor: accentColor }} highlightKeywords={highlightKeywords} />
            </div>
          )}

          {/* Languages */}
          {activeLangs.length > 0 && isVisible("languages") && (
            <div>
              <h2
                className="resume-heading-block text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                Languages
              </h2>
              <div className="space-y-1.5">
                {activeLangs.map((lang) => (
                  <div key={lang.id || Math.random()} className="text-[11px] flex justify-between">
                    <span className="font-semibold text-gray-800">{H(lang.language)}</span>
                    <span className="text-gray-500">{lang.proficiency || "Fluent"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates */}
          {activeCerts.length > 0 && isVisible("certifications") && (
            <div>
              <h2
                className="resume-heading-block text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                Certificates
              </h2>
              <div className="space-y-2">
                {activeCerts.map((cert) => (
                  <div key={cert.id || Math.random()} className="text-[11px]">
                    <p className="font-bold text-gray-900 leading-snug">{H(cert.name)}</p>
                    {cert.issuer && <p className="text-[10px] text-gray-500">{H(cert.issuer)}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (65% width) */}
        <div className="col-span-8 space-y-6">
          {/* Professional Experience */}
          {activeExp.length > 0 && isVisible("experience") && (
            <div>
              <h2
                className="resume-heading-block text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b flex items-center gap-1.5"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                <Briefcase size={13} />
                <span>Professional Experience</span>
              </h2>

              <div className="space-y-4">
                {activeExp.map((exp) => (
                  <div key={exp.id || Math.random()} className="text-xs">
                    <div className="flex justify-between items-baseline font-bold text-gray-900">
                      <span className="text-[12px]">{exp.jobTitle}</span>
                      <span className="text-[11px] text-gray-400 font-semibold">
                        {exp.startDate} {exp.startDate && exp.endDate ? "–" : ""} {exp.currentlyWorking ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 font-medium mt-0.5">
                      {exp.company}{exp.location ? ` | ${exp.location}` : ""}
                    </p>
                    {exp.description && (
                      <div className="text-gray-600 text-xs whitespace-pre-line mt-1.5 leading-relaxed">
                        {H(exp.description)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {activeEdu.length > 0 && isVisible("education") && (
            <div>
              <h2
                className="resume-heading-block text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b flex items-center gap-1.5"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                <GraduationCap size={13} />
                <span>Education</span>
              </h2>

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
          )}

          {/* Projects */}
          {activeProjects.length > 0 && isVisible("projects") && (
            <div>
              <h2
                className="resume-heading-block text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                Projects
              </h2>
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
          )}
        </div>
      </div>
    </div>
  );
}

export default SaffronTemplate;

