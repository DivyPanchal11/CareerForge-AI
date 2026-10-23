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
  FolderGit2,
  Award,
  Languages,
  Heart,
  Users,
  FileCheck,
  BookOpen,
  Building,
} from "lucide-react";
import { HighlightText } from "../HighlightText";
import { getThemeSpacingStyles } from "../../../utils/themeStyles";
import PhotoDisplay from "../PhotoDisplay";
import HeadingRenderer from "../HeadingRenderer";
import SkillsRenderer from "../SkillsRenderer";

export function MinimalTemplate({ resume, highlightKeywords = [] }) {
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
  const jobTitleColor = targets.jobTitle ? accentColor : "#6B7280";
  const headingTextColor = targets.headings !== false ? accentColor : "#9CA3AF";
  const headingBorderColor = targets.headingLine !== false ? accentColor : "#F3F4F6";

  const headingTransformClass =
    theme.capitalization === "capitalize" ? "capitalize" : "uppercase";

  const isCentered = theme.headerAlign === "center";
  const headerAlignClass =
    theme.headerAlign === "center"
      ? "text-center items-center justify-center"
      : theme.headerAlign === "right"
      ? "text-right items-end justify-end"
      : "text-left items-start justify-start";

  const delimiterSymbol =
    theme.headerDelimiter === "bar" ? "/" : theme.headerDelimiter === "icon" ? "" : "•";

  const renderSection = (secKey) => {
    switch (secKey) {
      case "summary":
        return summary && theme.showSummaryHeading !== false ? (
          <div key="summary" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Summary"
              icon={FileText}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <p className="text-gray-600 text-xs leading-relaxed">{H(summary)}</p>
          </div>
        ) : null;

      case "experience":
        const activeExp = (experience || []).filter((e) => !e.hidden);
        return activeExp.length > 0 ? (
          <div key="experience" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Experience"
              icon={Briefcase}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <div className="flex flex-col" style={styles.entryGapStyle}>
              {activeExp.map((exp) => (
                <div key={exp.id || Math.random()}>
                  <div className="flex justify-between items-baseline font-medium text-black">
                    <span className="text-xs">
                      {theme.expTitleOrder === "title_employer"
                        ? `${exp.jobTitle || ""} / ${exp.company || ""}`
                        : `${exp.company || ""}${exp.jobTitle ? ` / ${exp.jobTitle}` : ""}`}
                    </span>
                    <span className="text-[11px] text-gray-400 font-normal">
                      {exp.startDate} {exp.startDate && exp.endDate ? "–" : ""} {exp.currentlyWorking ? "Present" : exp.endDate}
                    </span>
                  </div>
                  {exp.location && <div className="text-[11px] text-gray-400">{exp.location}</div>}
                  {exp.description && (
                    <div className="text-xs text-gray-600 mt-1 whitespace-pre-line leading-relaxed">
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
                <div key={edu.id || Math.random()} className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-medium text-black">
                      {theme.eduTitleOrder === "degree_school"
                        ? `${edu.degree || ""}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}${edu.institution ? `, ${edu.institution}` : ""}`
                        : `${edu.institution || ""}${edu.degree ? ` — ${edu.degree}` : ""}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}`}
                    </span>
                    {edu.grade && <p className="text-[11px] text-gray-400">Grade: {edu.grade}</p>}
                    {edu.description && <p className="text-gray-500 mt-0.5">{H(edu.description)}</p>}
                  </div>
                  <span className="text-[11px] text-gray-400 whitespace-nowrap ml-4">
                    {edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}
                  </span>
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
              title="Skills"
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

      case "projects":
        const activeProj = (projects || []).filter((p) => !p.hidden);
        return activeProj.length > 0 ? (
          <div key="projects" style={styles.sectionStyle}>
            <HeadingRenderer
              title="Projects"
              icon={FolderGit2}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <div className="flex flex-col" style={styles.entryGapStyle}>
              {activeProj.map((proj) => (
                <div key={proj.id || Math.random()}>
                  <div className="flex justify-between font-medium text-black text-xs">
                    <span>{H(proj.title)}</span>
                    <span className="text-[11px] text-gray-400 font-normal">
                      {proj.startDate} {proj.startDate && proj.endDate ? "–" : ""} {proj.endDate}
                    </span>
                  </div>
                  {proj.technologies && (
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {H(proj.technologies)}
                    </p>
                  )}
                  {proj.description && (
                    <div className="text-xs text-gray-600 mt-1 whitespace-pre-line leading-relaxed">
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
              title="Certifications"
              icon={Award}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <div className="flex flex-col" style={styles.entryGapStyle}>
              {activeCerts.map((cert) => (
                <div key={cert.id || Math.random()} className="flex justify-between items-baseline text-xs">
                  <span className="text-gray-800 font-medium">
                    {H(cert.name)}
                    {cert.issuer && <span className="text-gray-400 font-normal"> — {H(cert.issuer)}</span>}
                  </span>
                  {(cert.date || cert.issueDate) && (
                    <span className="text-[11px] text-gray-400 font-normal">
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
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
              {activeLang.map((l) => (
                <span key={l.id || Math.random()}>
                  <span className="font-medium text-black">{H(l.language)}</span>
                  {l.proficiency && <span className="text-gray-400"> ({l.proficiency})</span>}
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
              title="Awards & Honors"
              icon={Award}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <div className="flex flex-col" style={styles.entryGapStyle}>
              {activeAwards.map((item) => (
                <div key={item.id || Math.random()} className="flex justify-between items-baseline text-xs">
                  <span className="font-medium text-black">
                    {H(item.title)}
                    {item.issuer && <span className="text-gray-400 font-normal ml-1">({H(item.issuer)})</span>}
                  </span>
                  {item.date && <span className="text-[11px] text-gray-400">{item.date}</span>}
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
              title="Publications & Research"
              icon={BookOpen}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <div className="flex flex-col" style={styles.entryGapStyle}>
              {activePubs.map((pub) => (
                <div key={pub.id || Math.random()} className="text-xs">
                  <div className="flex justify-between font-medium text-black">
                    <span>{H(pub.title)}</span>
                    {pub.date && <span className="text-[11px] text-gray-400 font-normal">{pub.date}</span>}
                  </div>
                  {pub.publisher && <p className="text-[11px] text-gray-400">{H(pub.publisher)}</p>}
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
              title="Organizations & Volunteering"
              icon={Building}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <div className="flex flex-col" style={styles.entryGapStyle}>
              {activeOrgs.map((org) => (
                <div key={org.id || Math.random()} className="text-xs">
                  <div className="flex justify-between items-baseline font-medium text-black">
                    <span>{H(org.name)}</span>
                    <span className="text-[11px] text-gray-400 font-normal">
                      {org.startDate} {org.startDate && org.endDate ? "–" : ""} {org.endDate || (org.startDate ? "Present" : "")}
                    </span>
                  </div>
                  {org.role && <p className="text-[11px] text-gray-500">{H(org.role)}</p>}
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
              title="References"
              icon={Users}
              theme={theme}
              headingTextColor={headingTextColor}
              headingBorderColor={headingBorderColor}
            />
            <div className="grid grid-cols-2 gap-3 text-xs">
              {activeRefs.map((ref) => (
                <div key={ref.id || Math.random()}>
                  <p className="font-medium text-black">{H(ref.name)}</p>
                  <p className="text-gray-500">{ref.relationship}{ref.company ? ` at ${H(ref.company)}` : ""}</p>
                  {ref.email && <p className="text-gray-400 text-[11px]">{ref.email}</p>}
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
                icon={FileCheck}
                theme={theme}
                headingTextColor={headingTextColor}
                headingBorderColor={headingBorderColor}
              />
            )}
            <p className="text-xs text-gray-600 leading-relaxed italic">{H(dec.statement)}</p>
            <div className={`mt-4 flex justify-between text-xs text-gray-700 ${theme.declarationPosition === "left" ? "flex-row-reverse" : "flex-row"}`}>
              <div>
                {dec.place && <p>Place: {dec.place}</p>}
                {dec.date && <p>Date: {dec.date}</p>}
              </div>
              <div className="text-right">
                {theme.signatureLine !== "none" && <div className="w-32 border-b border-gray-300 mb-1 ml-auto" />}
                <p className="font-medium text-black">{dec.signatureName}</p>
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
            <p className="text-xs text-gray-600">
              {activeInt.map((i) => H(typeof i === "object" ? i.name : i)).reduce((prev, curr) => [prev, " / ", curr])}
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
                  theme={theme}
                  headingTextColor={headingTextColor}
                  headingBorderColor={headingBorderColor}
                />
                <div className="flex flex-col" style={styles.entryGapStyle}>
                  {(cSec.items || []).map((item) => (
                    <div key={item.id} className="text-xs">
                      <div className="flex justify-between font-medium text-black">
                        <span>{H(item.title)}</span>
                        <span className="text-gray-400 font-normal text-[11px]">{item.date}</span>
                      </div>
                      {item.subtitle && <p className="text-gray-500">{H(item.subtitle)}</p>}
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
    <div className={`w-full ${fontFamilyClass} ${styles.pageMarginClass} ${styles.fontScaleClass} ${styles.lineHeightClass} text-gray-900`} style={{ minHeight: `${minPageHeight}px` }}>
      {/* Top Header Minimal */}
      <div className={`flex flex-col ${headerAlignClass}`} style={styles.sectionStyle}>
        <div className={`flex items-center gap-4 w-full ${isCentered ? "flex-col text-center justify-center" : "justify-between"}`}>
          <div className={headerAlignClass}>
            <h1 className="text-3xl font-light tracking-tight" style={{ color: nameColor }}>
              {personalInfo?.fullName || "Your Name"}
            </h1>
            {personalInfo?.jobTitle ? (
              <p className="text-xs uppercase font-medium tracking-widest mt-1" style={{ color: jobTitleColor }}>
                {personalInfo.jobTitle}
              </p>
            ) : null}
          </div>

          {personalInfo?.photo && (
            <PhotoDisplay
              photo={personalInfo.photo}
              photoSettings={resume.photoSettings}
              primaryColor={accentColor}
            />
          )}
        </div>

        <div
          className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-3 pt-3 border-t w-full ${headerAlignClass}`}
          style={{ borderColor: headingBorderColor }}
        >
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

      {/* Render All Active Sections */}
      {activeOrder.map((secKey) => renderSection(secKey))}
    </div>
  );
}

export default MinimalTemplate;
