import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Link as LinkIcon,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  Languages,
  Trophy,
  Award,
  FolderGit2,
  BookOpen,
  Building2,
  Heart,
  UserCheck,
  FileCheck2,
  FileCode,
} from "lucide-react";
import { HighlightText } from "../HighlightText";
import { getThemeSpacingStyles } from "../../../utils/themeStyles";
import PhotoDisplay from "../PhotoDisplay";
import HeadingRenderer from "../HeadingRenderer";
import SkillsRenderer from "../SkillsRenderer";

export function ModernTemplate({ resume, highlightKeywords = [] }) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    interests,
    customSections,
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
      "publications",
      "organizations",
      "interests",
      "references",
      "declaration",
      "custom",
    ],
    theme = {},
    minPageHeight = 1123,
  } = resume;

  const isVisible = (sec) => !hiddenSections.includes(sec);

  const accentColor = theme.primaryColor || "#000000";
  const fontFamilyClass =
    theme.fontFamily === "serif"
      ? "font-serif"
      : theme.fontFamily === "mono"
      ? "font-mono"
      : "font-sans";

  const activeOrder = sectionOrder.filter((key) => key !== "personalInfo" && isVisible(key));

  // Reactive theme micro-spacing & typography styles
  const styles = getThemeSpacingStyles(theme);

  // Keyword highlighting helper — wraps text in HighlightText when keywords are active
  const H = (text) => <HighlightText text={text} keywords={highlightKeywords} />;

  // Accent Targets
  const targets = theme.accentTargets || {
    name: true,
    jobTitle: true,
    headings: true,
    headingLine: true,
  };

  const nameColor = targets.name ? accentColor : "#111827";
  const jobTitleColor = targets.jobTitle ? accentColor : "#374151";
  const headingTextColor = targets.headings !== false ? accentColor : "#111827";
  const headingBorderColor = targets.headingLine !== false ? accentColor : "#E5E7EB";

  const headingTransformClass =
    theme.capitalization === "capitalize" ? "capitalize" : "uppercase";

  const isCentered = theme.headerAlign === "center";
  const headerAlignClass =
    theme.headerAlign === "center" ? "text-center justify-center" : "text-left justify-start";

  const delimiterSymbol =
    theme.headerDelimiter === "bar" ? "|" : theme.headerDelimiter === "icon" ? "" : "•";

  const renderSection = (secKey) => {
    switch (secKey) {
      case "summary":
        return summary && theme.showSummaryHeading !== false ? (
          <div key="summary" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Professional Summary"
              icon={FileText}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <p className="text-gray-700 whitespace-pre-line">{H(summary)}</p>
          </div>
        ) : null;

      case "experience":
        const activeExp = (experience || []).filter((e) => !e.hidden);
        return activeExp.length > 0 ? (
          <div key="experience" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Work Experience"
              icon={Briefcase}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <div className="flex flex-col" style={styles.entryGapStyle}>
              {activeExp.map((exp) => (
                <div key={exp.id || Math.random()}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900 text-xs">
                      {theme.expTitleOrder === "title_employer"
                        ? `${exp.jobTitle} – ${exp.company}`
                        : `${exp.company}${exp.jobTitle ? ` – ${exp.jobTitle}` : ""}`}
                    </h3>
                    <span className="text-[11px] text-gray-500 font-medium">
                      {exp.startDate} {exp.startDate && exp.endDate ? "–" : ""} {exp.currentlyWorking ? "Present" : exp.endDate}
                    </span>
                  </div>
                  {exp.location && <div className="text-[11px] font-semibold text-gray-500">{exp.location}</div>}
                  {exp.description && (
                    <div className="text-xs text-gray-600 whitespace-pre-line mt-0.5">
                      {H(exp.description)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "education":
        const activeEdu = (education || []).filter((e) => !e.hidden);
        return activeEdu.length > 0 ? (
          <div key="education" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Education"
              icon={GraduationCap}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <div className="flex flex-col" style={styles.entryGapStyle}>
              {activeEdu.map((edu) => (
                <div key={edu.id || Math.random()}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900 text-xs">
                      {theme.eduTitleOrder === "degree_school"
                        ? `${edu.degree}${edu.institution ? `, ${edu.institution}` : ""}`
                        : `${edu.institution}${edu.degree ? `, ${edu.degree}` : ""}`}
                    </h3>
                    <span className="text-[11px] text-gray-500">{edu.startDate} {edu.endDate ? `– ${edu.endDate}` : ""}</span>
                  </div>
                  {edu.grade && <p className="text-[11px] font-medium text-gray-600">Grade: {edu.grade}</p>}
                  {edu.description && <p className="text-xs text-gray-600 mt-0.5">{H(edu.description)}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "skills":
        const activeSkills = (skills || []).filter((s) => !s.hidden);
        return activeSkills.length > 0 ? (
          <div key="skills" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Skills & Expertise"
              icon={Wrench}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <SkillsRenderer
              skills={activeSkills}
              theme={theme}
              highlightKeywords={highlightKeywords}
            />
          </div>
        ) : null;

      case "languages":
        const activeLang = (languages || []).filter((l) => !l.hidden);
        return activeLang.length > 0 ? (
          <div key="languages" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Languages"
              icon={Languages}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
              {activeLang.map((lang) => (
                <span key={lang.id || Math.random()} className="text-gray-800">
                  <strong className="text-gray-900">{H(lang.language)}:</strong> {lang.proficiency}
                </span>
              ))}
            </div>
          </div>
        ) : null;

      case "awards":
        const activeAwards = (resume.awards || []).filter((a) => !a.hidden);
        return activeAwards.length > 0 ? (
          <div key="awards" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Awards & Honors"
              icon={Trophy}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <div className="space-y-1.5">
              {activeAwards.map((item) => (
                <div key={item.id || Math.random()} className="text-[11px]">
                  <span className="font-bold text-gray-900">{H(item.title)}</span>
                  {item.issuer && <span className="text-gray-600 ml-1">({H(item.issuer)}{item.date ? `, ${item.date}` : ""})</span>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "publications":
        const activePubs = (resume.publications || []).filter((p) => !p.hidden);
        return activePubs.length > 0 ? (
          <div key="publications" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Publications & Research"
              icon={BookOpen}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <div className="space-y-2">
              {activePubs.map((pub) => (
                <div key={pub.id || Math.random()} className="text-[11px]">
                  <div className="flex justify-between items-baseline font-bold text-gray-900">
                    <span>{H(pub.title)}</span>
                    {pub.date && <span className="text-gray-500 font-normal">{pub.date}</span>}
                  </div>
                  {pub.publisher && <p className="text-gray-600 italic">{H(pub.publisher)}</p>}
                  {pub.description && <p className="text-gray-600 mt-0.5 whitespace-pre-line">{H(pub.description)}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "organizations":
        const activeOrgs = (resume.organizations || []).filter((o) => !o.hidden);
        return activeOrgs.length > 0 ? (
          <div key="organizations" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Organizations & Volunteering"
              icon={Building2}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <div className="space-y-2.5">
              {activeOrgs.map((org) => (
                <div key={org.id || Math.random()} className="text-[11px]">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-gray-900">{H(org.name)}</span>
                    <span className="text-gray-500">{org.startDate} {org.startDate && org.endDate ? "–" : ""} {org.endDate || (org.startDate ? "Present" : "")}</span>
                  </div>
                  {org.role && <p className="text-gray-700 font-medium">{H(org.role)}</p>}
                  {org.description && <p className="text-gray-600 mt-0.5 whitespace-pre-line">{H(org.description)}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "projects":
        const activeProj = (projects || []).filter((p) => !p.hidden);
        return activeProj.length > 0 ? (
          <div key="projects" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Key Projects"
              icon={FolderGit2}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <div className="flex flex-col" style={styles.entryGapStyle}>
              {activeProj.map((proj) => (
                <div key={proj.id || Math.random()}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900 text-xs">{H(proj.title)}</h3>
                    <span className="text-[11px] text-gray-500">{proj.startDate} {proj.endDate ? `– ${proj.endDate}` : ""}</span>
                  </div>
                  {proj.technologies && (
                    <p className="text-[10px] font-medium text-gray-500 mb-0.5">
                      Technologies: {H(proj.technologies)}
                    </p>
                  )}
                  {proj.description && (
                    <div className="text-xs text-gray-600 whitespace-pre-line">
                      {H(proj.description)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "certifications":
        const activeCerts = (certifications || []).filter((c) => !c.hidden);
        return activeCerts.length > 0 ? (
          <div key="certifications" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Certifications & Licenses"
              icon={Award}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <div className="space-y-1.5">
              {activeCerts.map((cert) => (
                <div key={cert.id || Math.random()} className="text-[11px]">
                  <span className="font-bold text-gray-900">{H(cert.name)}</span>
                  {cert.issuer && <span className="text-gray-600 ml-1">({H(cert.issuer)}{cert.date ? `, ${cert.date}` : ""})</span>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "references":
        const activeRefs = (resume.references || []).filter((r) => !r.hidden);
        return activeRefs.length > 0 ? (
          <div key="references" style={styles.sectionStyle}>
            <HeadingRenderer
              title="References"
              icon={UserCheck}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              {activeRefs.map((ref) => (
                <div key={ref.id || Math.random()}>
                  <p className="font-bold text-gray-900">{H(ref.name)}</p>
                  <p className="text-gray-600">{H(ref.relationship)} {ref.company ? `at ${H(ref.company)}` : ""}</p>
                  {ref.email && <p className="text-gray-500">{ref.email}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "declaration":
        const dec = resume.declaration;
        return dec && (dec.statement || dec.signatureName) ? (
          <div key="declaration" style={styles.sectionStyle}>
            {theme.showDeclarationHeading !== false && (
              <HeadingRenderer
                title="Declaration"
                icon={FileCheck2}
                theme={theme}
                headingTextColor={headingTextColor}
                headingBorderColor={headingBorderColor}
              />
            )}
            <p className="text-xs text-gray-700 italic">{H(dec.statement)}</p>
            <div className={`mt-3 flex justify-between text-xs text-gray-800 ${theme.declarationPosition === "left" ? "flex-row-reverse" : "flex-row"}`}>
              <div>
                {dec.place && <p>Place: {dec.place}</p>}
                {dec.date && <p>Date: {dec.date}</p>}
              </div>
              <div className="text-right">
                {theme.signatureLine !== "none" && <div className="w-32 border-b border-gray-400 mb-1 ml-auto" />}
                <p className="font-bold">{dec.signatureName}</p>
              </div>
            </div>
          </div>
        ) : null;

      case "interests":
        const activeInt = (interests || []).filter((i) => !i.hidden);
        return activeInt.length > 0 ? (
          <div key="interests" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Interests & Hobbies"
              icon={Heart}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <p className="text-[11px] text-gray-700">{activeInt.map((i) => H(i.name || i)).reduce((prev, curr) => [prev, " • ", curr])}</p>
          </div>
        ) : null;

      case "custom":
        return customSections && customSections.length > 0 ? (
          <div key="custom" className="space-y-3">
            {customSections.map((cSec) => (
              <div key={cSec.id} className="mb-4">
                <HeadingRenderer
                  title={cSec.title}
                  icon={FileCode}
                  theme={theme}
                  headingTextColor={headingTextColor}
                  headingBorderColor={headingBorderColor}
                />
                <div className="space-y-2">
                  {(cSec.items || []).map((item) => (
                    <div key={item.id} className="text-[11px]">
                      <div className="flex justify-between font-bold text-gray-900">
                        <span>{H(item.title)}</span>
                        <span className="text-gray-500 font-normal">{item.date}</span>
                      </div>
                      {item.subtitle && <p className="text-gray-700 font-medium">{H(item.subtitle)}</p>}
                      {item.description && <p className="text-gray-600 mt-0.5">{H(item.description)}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className={`w-full ${fontFamilyClass} ${styles.pageMarginClass} ${styles.fontScaleClass} ${styles.lineHeightClass} text-gray-900`} style={{ minHeight: `${minPageHeight}px` }}>
      {/* Header */}
      <div className="pb-4 mb-5" style={{ borderBottom: `2px solid ${headingBorderColor}` }}>
        <div className={`flex items-start gap-4 ${isCentered ? "flex-col items-center text-center justify-center" : "justify-between"}`}>
          <div className={isCentered ? "flex flex-col items-center" : ""}>
            <h1 className="text-3xl font-extrabold uppercase tracking-tight" style={{ color: nameColor }}>
              {personalInfo?.fullName || "Your Name"}
            </h1>
            {personalInfo?.jobTitle ? (
              <p className="text-sm font-semibold mt-0.5 uppercase tracking-wide" style={{ color: jobTitleColor }}>
                {personalInfo.jobTitle}
              </p>
            ) : null}

            <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5 text-xs text-gray-600 ${headerAlignClass}`}>
              {personalInfo?.email && (
                <span className="flex items-center gap-1">
                  <Mail size={12} style={{ color: accentColor }} />
                  {personalInfo.email}
                </span>
              )}
              {personalInfo?.phone && (
                <span className="flex items-center gap-1">
                  {delimiterSymbol && <span className="text-gray-300 mr-1">{delimiterSymbol}</span>}
                  <Phone size={12} style={{ color: accentColor }} />
                  {personalInfo.phone}
                </span>
              )}
              {personalInfo?.location && (
                <span className="flex items-center gap-1">
                  {delimiterSymbol && <span className="text-gray-300 mr-1">{delimiterSymbol}</span>}
                  <MapPin size={12} style={{ color: accentColor }} />
                  {personalInfo.location}
                </span>
              )}
              {personalInfo?.linkedin && (
                <span className="flex items-center gap-1">
                  {delimiterSymbol && <span className="text-gray-300 mr-1">{delimiterSymbol}</span>}
                  <LinkIcon size={12} style={{ color: accentColor }} />
                  {personalInfo.linkedin}
                </span>
              )}
              {personalInfo?.github && (
                <span className="flex items-center gap-1">
                  {delimiterSymbol && <span className="text-gray-300 mr-1">{delimiterSymbol}</span>}
                  <LinkIcon size={12} style={{ color: accentColor }} />
                  {personalInfo.github}
                </span>
              )}
              {personalInfo?.portfolio && (
                <span className="flex items-center gap-1">
                  {delimiterSymbol && <span className="text-gray-300 mr-1">{delimiterSymbol}</span>}
                  <Globe size={12} style={{ color: accentColor }} />
                  {personalInfo.portfolio}
                </span>
              )}
            </div>
          </div>

          {personalInfo?.photo && (
            <PhotoDisplay
              photo={personalInfo.photo}
              photoSettings={resume.photoSettings}
              primaryColor={accentColor}
            />
          )}
        </div>
      </div>

      {/* Render All Active Sections Directly on A4 Sheet */}
      {activeOrder.map((secKey) => renderSection(secKey))}
    </div>
  );
}

export default ModernTemplate;
