import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Link as LinkIcon,
  Award,
  Languages,
  Trophy,
  Briefcase,
  GraduationCap,
  FolderGit2,
  BookOpen,
  Building2,
  UserCheck,
  FileCheck2,
  Wrench,
  User,
} from "lucide-react";
import { HighlightText } from "../HighlightText";
import { getThemeSpacingStyles } from "../../../utils/themeStyles";
import PhotoDisplay from "../PhotoDisplay";
import SkillsRenderer from "../SkillsRenderer";

/**
 * FlowCV Template: Atlantic Blue & Hunter Green
 * Features a continuous full-bleed dark sidebar on the left and a crisp white content canvas on the right.
 */
export function AtlanticTemplate({ resume, highlightKeywords = [], variant = "atlantic" }) {
  const {
    personalInfo = {},
    summary,
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    interests = [],
    awards = [],
    references = [],
    declaration = {},
    publications = [],
    organizations = [],
    customSections = [],
    hiddenSections = [],
    theme = {},
    minPageHeight = 1123,
  } = resume;

  // Variant color: Atlantic Blue (navy) or Hunter Green (forest)
  const isHunter = variant === "hunter" || resume.template === "hunter-green";
  const sidebarBg = theme.primaryColor && theme.primaryColor !== "#000000"
    ? theme.primaryColor
    : isHunter
    ? "#23372F" // Hunter Green
    : "#1E293B"; // Atlantic Blue Slate-800

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
  const activeAwards = awards.filter((a) => !a.hidden);
  const activeInterests = interests.filter((i) => !i.hidden);

  return (
    <div
      className={`w-full bg-white flex ${fontFamilyClass} ${styles.fontScaleClass} ${styles.lineHeightClass} text-gray-900 overflow-hidden`}
      style={{ minHeight: `${minPageHeight}px` }}
    >
      {/* ── LEFT DARK SIDEBAR (34% width) ── */}
      <div
        className="w-[34%] p-6 text-white flex flex-col shrink-0"
        style={{ backgroundColor: sidebarBg, minHeight: `${minPageHeight}px` }}
      >
        <div className="space-y-6">
          {/* Avatar / Photo */}
          {personalInfo.photo ? (
            <div className="flex justify-center mb-3">
              <PhotoDisplay
                photo={personalInfo.photo}
                photoSettings={resume.photoSettings}
                primaryColor="#FFFFFF"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-white/10 mx-auto flex items-center justify-center text-xl font-bold text-white mb-3 border-2 border-white/20">
              {(personalInfo.fullName || "CV")
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
          )}

          {/* Name & Title */}
          <div className="text-center">
            <h1 className="text-xl font-extrabold tracking-tight text-white leading-tight">
              {personalInfo.fullName || "Your Name"}
            </h1>
            {personalInfo.jobTitle && (
              <p className="text-xs font-medium text-white/80 mt-1 uppercase tracking-wider">
                {personalInfo.jobTitle}
              </p>
            )}
          </div>

          {/* Contact Details */}
          <div className="space-y-2 text-[11px] text-white/90 pt-2 border-t border-white/15">
            {personalInfo.email && (
              <div className="flex items-center gap-2 break-all">
                <Mail size={13} className="shrink-0 text-white/70" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone size={13} className="shrink-0 text-white/70" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin size={13} className="shrink-0 text-white/70" />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-2 break-all">
                <LinkIcon size={13} className="shrink-0 text-white/70" />
                <span>{personalInfo.linkedin}</span>
              </div>
            )}
            {personalInfo.portfolio && (
              <div className="flex items-center gap-2 break-all">
                <Globe size={13} className="shrink-0 text-white/70" />
                <span>{personalInfo.portfolio}</span>
              </div>
            )}
          </div>

          {/* Profile / Summary */}
          {summary && isVisible("summary") && (
            <div className="pt-2 border-t border-white/15">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white mb-2">
                <User size={13} className="text-white/70" />
                <span>Profile</span>
              </div>
              <p className="text-[11px] text-white/80 leading-relaxed whitespace-pre-line">
                {H(summary)}
              </p>
            </div>
          )}

          {/* Languages with 5-dot rating meters */}
          {activeLangs.length > 0 && isVisible("languages") && (
            <div className="pt-2 border-t border-white/15">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white mb-2.5">
                <Languages size={13} className="text-white/70" />
                <span>Languages</span>
              </div>
              <div className="space-y-2">
                {activeLangs.map((lang) => {
                  const dots =
                    lang.proficiency === "Native"
                      ? 5
                      : lang.proficiency === "Fluent"
                      ? 5
                      : lang.proficiency === "Advanced"
                      ? 4
                      : lang.proficiency === "Intermediate"
                      ? 3
                      : 2;

                  return (
                    <div key={lang.id || Math.random()} className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-white/90">{H(lang.language)}</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              i <= dots ? "bg-white" : "bg-white/20"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Awards */}
          {activeAwards.length > 0 && isVisible("awards") && (
            <div className="pt-2 border-t border-white/15">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white mb-2">
                <Trophy size={13} className="text-white/70" />
                <span>Awards</span>
              </div>
              <div className="space-y-2">
                {activeAwards.map((award) => (
                  <div key={award.id || Math.random()} className="text-[10.5px]">
                    <p className="font-bold text-white">{H(award.title)}</p>
                    <p className="text-white/70">{H(award.issuer)}{award.date ? ` • ${award.date}` : ""}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT MAIN CANVAS (66% width) ── */}
      <div className="flex-1 p-8 flex flex-col justify-between" style={styles.entryGapStyle}>
        <div className="space-y-6">
          {/* Work Experience */}
          {activeExp.length > 0 && isVisible("experience") && (
            <div>
              <div className="flex items-center gap-2 border-b-2 pb-1 mb-3" style={{ borderColor: sidebarBg }}>
                <span className="p-1 rounded bg-gray-100 text-gray-800">
                  <Briefcase size={14} />
                </span>
                <h2 className="resume-heading-block text-xs font-extrabold uppercase tracking-wider text-gray-900">
                  Work Experience
                </h2>
              </div>

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
                      <span>{exp.company}</span>
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
          )}

          {/* Education */}
          {activeEdu.length > 0 && isVisible("education") && (
            <div>
              <div className="flex items-center gap-2 border-b-2 pb-1 mb-3" style={{ borderColor: sidebarBg }}>
                <span className="p-1 rounded bg-gray-100 text-gray-800">
                  <GraduationCap size={14} />
                </span>
                <h2 className="resume-heading-block text-xs font-extrabold uppercase tracking-wider text-gray-900">
                  Education
                </h2>
              </div>

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

          {/* Skills */}
          {activeSkills.length > 0 && isVisible("skills") && (
            <div>
              <div className="flex items-center gap-2 border-b-2 pb-1 mb-3" style={{ borderColor: sidebarBg }}>
                <span className="p-1 rounded bg-gray-100 text-gray-800">
                  <Wrench size={14} />
                </span>
                <h2 className="resume-heading-block text-xs font-extrabold uppercase tracking-wider text-gray-900">
                  Skills
                </h2>
              </div>
              <SkillsRenderer skills={activeSkills} theme={theme} highlightKeywords={highlightKeywords} />
            </div>
          )}

          {/* Projects */}
          {activeProjects.length > 0 && isVisible("projects") && (
            <div>
              <div className="flex items-center gap-2 border-b-2 pb-1 mb-3" style={{ borderColor: sidebarBg }}>
                <span className="p-1 rounded bg-gray-100 text-gray-800">
                  <FolderGit2 size={14} />
                </span>
                <h2 className="resume-heading-block text-xs font-extrabold uppercase tracking-wider text-gray-900">
                  Projects
                </h2>
              </div>
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

          {/* Certifications */}
          {activeCerts.length > 0 && isVisible("certifications") && (
            <div>
              <div className="flex items-center gap-2 border-b-2 pb-1 mb-3" style={{ borderColor: sidebarBg }}>
                <span className="p-1 rounded bg-gray-100 text-gray-800">
                  <Award size={14} />
                </span>
                <h2 className="resume-heading-block text-xs font-extrabold uppercase tracking-wider text-gray-900">
                  Certificates
                </h2>
              </div>
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
          )}
        </div>
      </div>
    </div>
  );
}

export default AtlanticTemplate;

