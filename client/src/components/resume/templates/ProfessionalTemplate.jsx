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

export function ProfessionalTemplate({ resume, highlightKeywords = [] }) {
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
    publications = [],
    organizations = [],
    references = [],
    declaration = {},
    customSections = [],
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

  // Keyword highlighting helper
  const H = (text) => <HighlightText text={text} keywords={highlightKeywords} />;

  // Accent Targets
  const targets = theme.accentTargets || {
    name: true,
    jobTitle: true,
    headings: true,
    headingLine: true,
  };

  const nameColor = targets.name ? accentColor : "#111827";
  const jobTitleColor = targets.jobTitle ? accentColor : "#4B5563";
  const headingTextColor = targets.headings !== false ? accentColor : "#111827";
  const headingBorderColor = targets.headingLine !== false ? accentColor : "#111827";

  const headingTransformClass =
    theme.capitalization === "capitalize" ? "capitalize" : "uppercase";

  const headerAlignClass =
    theme.headerAlign === "center"
      ? "text-center items-center justify-center"
      : theme.headerAlign === "right"
      ? "text-right items-end justify-end"
      : "text-left items-start justify-start";

  const isCentered = theme.headerAlign === "center";

  const delimiterSymbol =
    theme.headerDelimiter === "bar" ? "|" : theme.headerDelimiter === "icon" ? "" : "•";

  const renderSection = (secKey) => {
    switch (secKey) {
      case "summary":
        return summary && theme.showSummaryHeading !== false ? (
          <div
            key="summary"
            style={{ ...styles.sectionStyle, borderLeftColor: accentColor }}
            className="bg-gray-50/80 p-4 rounded-lg border-l-4"
          >
            <HeadingRenderer
              title="Executive Summary"
              icon={FileText}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <p className="text-gray-700 leading-relaxed text-xs">{H(summary)}</p>
          </div>
        ) : null;

      case "experience":
        const activeExp = (experience || []).filter((e) => !e.hidden);
        return activeExp.length > 0 ? (
          <div key="experience" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Professional Experience"
              icon={Briefcase}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <div className="flex flex-col" style={styles.entryGapStyle}>
              {activeExp.map((exp) => (
                <div key={exp.id || Math.random()}>
                  <div className="flex justify-between items-baseline font-bold text-gray-900">
                    <span className="text-xs">
                      {theme.expTitleOrder === "title_employer"
                        ? `${exp.jobTitle || ""} — ${exp.company || ""}`
                        : `${exp.company || ""}${exp.jobTitle ? ` — ${exp.jobTitle}` : ""}`}
                    </span>
                    <span className="text-[11px] text-gray-500 font-semibold">
                      {exp.startDate} {exp.startDate && exp.endDate ? "–" : ""} {exp.currentlyWorking ? "Present" : exp.endDate}
                    </span>
                  </div>
                  {exp.location && (
                    <p className="text-[11px] font-medium text-gray-500 mb-0.5">{exp.location}</p>
                  )}
                  {exp.description && (
                    <div className="text-xs text-gray-600 whitespace-pre-line mt-1 leading-relaxed">
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
              title="Education & Credentials"
              icon={GraduationCap}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <div className="flex flex-col" style={styles.entryGapStyle}>
              {activeEdu.map((edu) => (
                <div key={edu.id || Math.random()} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-gray-900">
                    <span>
                      {theme.eduTitleOrder === "degree_school"
                        ? `${edu.degree || ""}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}`
                        : `${edu.institution || ""}${edu.degree ? ` — ${edu.degree}` : ""}`}
                    </span>
                    <span className="text-[11px] text-gray-500 font-normal">
                      {edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-700 font-medium">
                    {theme.eduTitleOrder === "degree_school" ? edu.institution : (edu.fieldOfStudy ? `Field: ${edu.fieldOfStudy}` : "")}
                    {edu.grade ? ` • Grade: ${edu.grade}` : ""}
                  </p>
                  {edu.description && <p className="text-gray-600 mt-0.5 leading-relaxed">{H(edu.description)}</p>}
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
              title="Core Competencies"
              icon={Wrench}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <SkillsRenderer skills={activeSkills} theme={theme} highlightKeywords={highlightKeywords} />
          </div>
        ) : null;

      case "projects":
        const activeProj = (projects || []).filter((p) => !p.hidden);
        return activeProj.length > 0 ? (
          <div key="projects" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Strategic Projects"
              icon={FolderGit2}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <div className="flex flex-col" style={styles.entryGapStyle}>
              {activeProj.map((proj) => (
                <div key={proj.id || Math.random()}>
                  <div className="flex justify-between items-baseline font-bold text-gray-900 text-xs">
                    <span>{H(proj.title)}</span>
                    <span className="text-[11px] text-gray-500 font-normal">
                      {proj.startDate} {proj.startDate && proj.endDate ? "–" : ""} {proj.endDate}
                    </span>
                  </div>
                  {proj.technologies && (
                    <p className="text-[10.5px] font-semibold text-gray-500 mb-0.5">
                      Scope / Technologies: {H(proj.technologies)}
                    </p>
                  )}
                  {proj.description && (
                    <div className="text-xs text-gray-600 whitespace-pre-line leading-relaxed">
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
              title="Certifications & Accreditations"
              icon={Award}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <div className="flex flex-col" style={styles.entryGapStyle}>
              {activeCerts.map((cert) => (
                <div key={cert.id || Math.random()} className="flex justify-between items-baseline text-xs">
                  <span>
                    <strong className="text-gray-900">{H(cert.name)}</strong>
                    {cert.issuer && <span className="text-gray-600"> — {H(cert.issuer)}</span>}
                  </span>
                  {(cert.date || cert.issueDate) && (
                    <span className="text-[11px] text-gray-500 font-medium">
                      {cert.date || cert.issueDate}
                    </span>
                  )}
                </div>
              ))}
            </div>
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
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {activeLang.map((l) => (
                <span key={l.id || Math.random()} className="text-gray-800">
                  <strong>{H(l.language)}:</strong> <span className="text-gray-600">{l.proficiency}</span>
                </span>
              ))}
            </div>
          </div>
        ) : null;

      case "awards":
        const activeAwards = (awards || []).filter((a) => !a.hidden);
        return activeAwards.length > 0 ? (
          <div key="awards" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Honors & Recognition"
              icon={Trophy}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <div className="flex flex-col" style={styles.entryGapStyle}>
              {activeAwards.map((item) => (
                <div key={item.id || Math.random()} className="flex justify-between items-baseline text-xs">
                  <span>
                    <strong className="text-gray-900">{H(item.title)}</strong>
                    {item.issuer && <span className="text-gray-600 ml-1">({H(item.issuer)})</span>}
                  </span>
                  {item.date && <span className="text-[11px] text-gray-500 font-medium">{item.date}</span>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "publications":
        const activePubs = (publications || []).filter((p) => !p.hidden);
        return activePubs.length > 0 ? (
          <div key="publications" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Publications & Thought Leadership"
              icon={BookOpen}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <div className="flex flex-col" style={styles.entryGapStyle}>
              {activePubs.map((pub) => (
                <div key={pub.id || Math.random()} className="text-xs">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>{H(pub.title)}</span>
                    {pub.date && <span className="text-[11px] text-gray-500 font-normal">{pub.date}</span>}
                  </div>
                  {pub.publisher && <p className="text-[11px] text-gray-600 italic">{H(pub.publisher)}</p>}
                  {pub.description && <p className="text-gray-600 mt-0.5 leading-relaxed">{H(pub.description)}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "organizations":
        const activeOrgs = (organizations || []).filter((o) => !o.hidden);
        return activeOrgs.length > 0 ? (
          <div key="organizations" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Board Memberships & Affiliations"
              icon={Building2}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <div className="flex flex-col" style={styles.entryGapStyle}>
              {activeOrgs.map((org) => (
                <div key={org.id || Math.random()} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-gray-900">
                    <span>{H(org.name)}</span>
                    <span className="text-[11px] text-gray-500 font-normal">
                      {org.startDate} {org.startDate && org.endDate ? "–" : ""} {org.endDate || (org.startDate ? "Present" : "")}
                    </span>
                  </div>
                  {org.role && <p className="text-[11px] font-semibold text-gray-700">{H(org.role)}</p>}
                  {org.description && <p className="text-gray-600 mt-0.5 leading-relaxed">{H(org.description)}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "references":
        const activeRefs = (references || []).filter((r) => !r.hidden);
        return activeRefs.length > 0 ? (
          <div key="references" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Professional References"
              icon={UserCheck}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <div className="grid grid-cols-2 gap-3 text-xs">
              {activeRefs.map((ref) => (
                <div key={ref.id || Math.random()} className="bg-gray-50 p-2.5 rounded border border-gray-200/80">
                  <p className="font-bold text-gray-900">{H(ref.name)}</p>
                  <p className="text-gray-600 text-[11px]">{ref.relationship}{ref.company ? ` at ${H(ref.company)}` : ""}</p>
                  {ref.email && <p className="text-gray-500 text-[11px]">{ref.email}</p>}
                  {ref.phone && <p className="text-gray-500 text-[11px]">{ref.phone}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "declaration":
        const dec = declaration;
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
            <p className="text-xs text-gray-700 leading-relaxed italic">{H(dec.statement)}</p>
            <div className={`mt-4 flex justify-between text-xs text-gray-800 ${theme.declarationPosition === "left" ? "flex-row-reverse" : "flex-row"}`}>
              <div>
                {dec.place && <p>Place: {dec.place}</p>}
                {dec.date && <p>Date: {dec.date}</p>}
              </div>
              <div className="text-right">
                {theme.signatureLine !== "none" && <div className="w-36 border-b border-gray-400 mb-1 ml-auto" />}
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
              title="Interests & Engagements"
              icon={Heart}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <p className="text-xs text-gray-700">
              {activeInt.map((i) => H(typeof i === "object" ? i.name : i)).reduce((prev, curr) => [prev, " • ", curr])}
            </p>
          </div>
        ) : null;

      case "custom":
        return customSections && customSections.length > 0 ? (
          <div key="custom" className="flex flex-col" style={styles.entryGapStyle}>
            {customSections.map((cSec) => (
              <div key={cSec.id} style={styles.sectionStyle}>
                <HeadingRenderer
                  title={cSec.title}
                  icon={FileCode}
                  theme={theme}
                  headingTextColor={headingTextColor}
                  headingBorderColor={headingBorderColor}
                />
                <div className="flex flex-col" style={styles.entryGapStyle}>
                  {(cSec.items || []).map((item) => (
                    <div key={item.id} className="text-xs">
                      <div className="flex justify-between font-bold text-gray-900">
                        <span>{H(item.title)}</span>
                        <span className="text-gray-500 font-normal text-[11px]">{item.date}</span>
                      </div>
                      {item.subtitle && <p className="text-gray-700 font-medium">{H(item.subtitle)}</p>}
                      {item.description && <p className="text-gray-600 mt-0.5 leading-relaxed">{H(item.description)}</p>}
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
    <div
      className={`w-full ${fontFamilyClass} ${styles.pageMarginClass} ${styles.fontScaleClass} ${styles.lineHeightClass} text-gray-900 border-t-8`}
      style={{ borderTopColor: accentColor, minHeight: `${minPageHeight}px` }}
    >
      {/* Header */}
      {isCentered ? (
        <div className="text-center pb-5 border-b border-gray-200" style={styles.sectionStyle}>
          {personalInfo?.photo && (
            <div className="flex justify-center mb-3">
              <PhotoDisplay
                photo={personalInfo.photo}
                photoSettings={resume.photoSettings}
                primaryColor={accentColor}
              />
            </div>
          )}
          <h1 className="text-3xl font-black tracking-tight" style={{ color: nameColor }}>
            {personalInfo?.fullName || "Your Name"}
          </h1>
          {personalInfo?.jobTitle ? (
            <p className="text-sm font-semibold uppercase tracking-wider mt-1" style={{ color: jobTitleColor }}>
              {personalInfo.jobTitle}
            </p>
          ) : null}
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs text-gray-600 mt-2.5">
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
      ) : (
        <div className="flex justify-between items-start border-b border-gray-200 pb-5" style={styles.sectionStyle}>
          <div className="flex items-center gap-4">
            {personalInfo?.photo && (
              <PhotoDisplay
                photo={personalInfo.photo}
                photoSettings={resume.photoSettings}
                primaryColor={accentColor}
              />
            )}
            <div>
              <h1 className="text-3xl font-black tracking-tight" style={{ color: nameColor }}>
                {personalInfo?.fullName || "Your Name"}
              </h1>
              {personalInfo?.jobTitle ? (
                <p className="text-sm font-semibold uppercase tracking-wider mt-1" style={{ color: jobTitleColor }}>
                  {personalInfo.jobTitle}
                </p>
              ) : null}
            </div>
          </div>
          <div className="text-right text-xs text-gray-600 space-y-1">
            {personalInfo?.email && (
              <p className="flex items-center justify-end gap-1.5">
                <span>{personalInfo.email}</span>
                <Mail size={12} style={{ color: accentColor }} />
              </p>
            )}
            {personalInfo?.phone && (
              <p className="flex items-center justify-end gap-1.5">
                <span>{personalInfo.phone}</span>
                <Phone size={12} style={{ color: accentColor }} />
              </p>
            )}
            {personalInfo?.location && (
              <p className="flex items-center justify-end gap-1.5">
                <span>{personalInfo.location}</span>
                <MapPin size={12} style={{ color: accentColor }} />
              </p>
            )}
            {personalInfo?.linkedin && (
              <p className="flex items-center justify-end gap-1.5 font-medium text-black">
                <span>{personalInfo.linkedin}</span>
                <LinkIcon size={12} style={{ color: accentColor }} />
              </p>
            )}
            {personalInfo?.portfolio && (
              <p className="flex items-center justify-end gap-1.5">
                <span>{personalInfo.portfolio}</span>
                <Globe size={12} style={{ color: accentColor }} />
              </p>
            )}
          </div>
        </div>
      )}

      {/* Render All Active Sections */}
      {activeOrder.map((secKey) => renderSection(secKey))}
    </div>
  );
}

export default ProfessionalTemplate;
