import React from "react";
import { Mail, Phone, MapPin, Globe, Link as LinkIcon, Award, Languages, Trophy, Heart, FileText, Briefcase, GraduationCap, FolderGit2, BookOpen, Building2, UserCheck, FileCheck2, Wrench, User } from "lucide-react";
import { HighlightText } from "../HighlightText";
import { getThemeSpacingStyles } from "../../../utils/themeStyles";
import PhotoDisplay from "../PhotoDisplay";
import HeadingRenderer from "../HeadingRenderer";
import SkillsRenderer from "../SkillsRenderer";

export function SidebarTemplate({ resume, highlightKeywords = [] }) {
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

  const accentColor = theme.primaryColor || "#000000";
  const fontFamilyClass =
    theme.fontFamily === "serif"
      ? "font-serif"
      : theme.fontFamily === "mono"
      ? "font-mono"
      : "font-sans";

  const isVisible = (sec) => !hiddenSections.includes(sec);

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

  // Keyword highlighting helper
  const H = (text) => <HighlightText text={text} keywords={highlightKeywords} />;

  // Reactive theme micro-spacing & typography styles
  const styles = getThemeSpacingStyles(theme);

  const activeExp = experience.filter((e) => !e.hidden);
  const activeEdu = education.filter((e) => !e.hidden);
  const activeSkills = skills.filter((s) => !s.hidden);
  const activeProjects = projects.filter((p) => !p.hidden);
  const activeCerts = certifications.filter((c) => !c.hidden);
  const activeLangs = languages.filter((l) => !l.hidden);
  const activeAwards = awards.filter((a) => !a.hidden);
  const activeInterests = interests.filter((i) => !i.hidden);
  const activeRefs = references.filter((r) => !r.hidden);
  const activePubs = publications.filter((p) => !p.hidden);
  const activeOrgs = organizations.filter((o) => !o.hidden);

  return (
  <div className="w-full text-gray-900" style={{ minHeight: "1000px" }}>
    {/* Top Banner / Header (Full Width) */}
    <div
      className="pb-5 border-b border-gray-200"
      style={{
        ...styles.sectionStyle,
        borderBottomColor: headingBorderColor,
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-extrabold uppercase tracking-tight"
            style={{ color: nameColor }}
          >
            {personalInfo.fullName || "Your Name"}
          </h1>

          {personalInfo.jobTitle && (
            <p
              className="text-sm font-semibold mt-0.5 uppercase tracking-wide"
              style={{ color: jobTitleColor }}
            >
              {personalInfo.jobTitle}
            </p>
          )}
        </div>

        {personalInfo.photo && (
          <PhotoDisplay
            photo={personalInfo.photo}
            photoSettings={resume.photoSettings}
            primaryColor={accentColor}
          />
        )}
      </div>
    </div>

    {/* 30/70 Split Grid */}
    <div className="grid grid-cols-12 gap-7 items-start">
      {/* LEFT SIDEBAR (Col 4 - 33% Width) */}
      <div
        className="col-span-4 flex flex-col pr-3 border-r border-gray-100"
        style={styles.entryGapStyle}
      >
        {/* Contact Information */}
        <div>
          <h2
            className={`resume-heading-block text-xs font-bold tracking-wider border-b pb-1 mb-2.5 ${headingTransformClass}`}
            style={{
              color: headingTextColor,
              borderColor: headingBorderColor,
            }}
          >
            Contact
          </h2>

          <div className="space-y-2 text-[11px] text-gray-700">
            {personalInfo.email && (
              <div className="flex items-start gap-2 break-all">
                <Mail
                  size={12}
                  className="shrink-0 mt-0.5"
                  style={{ color: accentColor }}
                />
                <span>{personalInfo.email}</span>
              </div>
            )}

            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone
                  size={12}
                  className="shrink-0"
                  style={{ color: accentColor }}
                />
                <span>{personalInfo.phone}</span>
              </div>
            )}

            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin
                  size={12}
                  className="shrink-0"
                  style={{ color: accentColor }}
                />
                <span>{personalInfo.location}</span>
              </div>
            )}

            {personalInfo.linkedin && (
              <div className="flex items-center gap-2 break-all">
                <LinkIcon
                  size={12}
                  className="shrink-0"
                  style={{ color: accentColor }}
                />
                <span>{personalInfo.linkedin}</span>
              </div>
            )}

            {personalInfo.github && (
              <div className="flex items-center gap-2 break-all">
                <LinkIcon
                  size={12}
                  className="shrink-0"
                  style={{ color: accentColor }}
                />
                <span>{personalInfo.github}</span>
              </div>
            )}

            {personalInfo.portfolio && (
              <div className="flex items-center gap-2 break-all">
                <Globe
                  size={12}
                  className="shrink-0"
                  style={{ color: accentColor }}
                />
                <span>{personalInfo.portfolio}</span>
              </div>
            )}
          </div>
        </div>

              {/* Skills */}
              {isVisible("skills") && activeSkills.length > 0 && (
                <div>
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
              )}

              {/* Languages */}
              {isVisible("languages") && activeLangs.length > 0 && (
                <div>
                  <h2
                    className={`resume-heading-block text-xs font-bold tracking-wider border-b pb-1 mb-2.5 ${headingTransformClass}`}
                    style={{ color: headingTextColor, borderColor: headingBorderColor }}
                  >
                    Languages
                  </h2>
                  <div className="flex flex-col" style={styles.entryGapStyle}>
                    {activeLangs.map((lang) => (
                      <div key={lang.id || Math.random()} className="flex justify-between items-center text-[11px]">
                        <span className="font-semibold text-gray-800">{H(lang.language)}</span>
                        {lang.proficiency && (
                          <span className="text-[10px] text-gray-500 font-medium">{lang.proficiency}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {isVisible("certifications") && activeCerts.length > 0 && (
                <div>
                  <h2
                    className={`resume-heading-block text-xs font-bold tracking-wider border-b pb-1 mb-2.5 ${headingTransformClass}`}
                    style={{ color: headingTextColor, borderColor: headingBorderColor }}
                  >
                    Certifications
                  </h2>
                  <div className="flex flex-col" style={styles.entryGapStyle}>
                    {activeCerts.map((cert) => (
                      <div key={cert.id || Math.random()} className="text-[11px]">
                        <p className="font-semibold text-gray-900 leading-snug">{H(cert.name)}</p>
                        {cert.issuer && (
                          <p className="text-[10px] text-gray-500">{H(cert.issuer)}{cert.date ? ` • ${cert.date}` : ""}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Awards */}
              {isVisible("awards") && activeAwards.length > 0 && (
                <div>
                  <h2
                    className={`resume-heading-block text-xs font-bold tracking-wider border-b pb-1 mb-2.5 ${headingTransformClass}`}
                    style={{ color: headingTextColor, borderColor: headingBorderColor }}
                  >
                    Awards & Honors
                  </h2>
                  <div className="flex flex-col" style={styles.entryGapStyle}>
                    {activeAwards.map((award) => (
                      <div key={award.id || Math.random()} className="text-[11px]">
                        <p className="font-semibold text-gray-900">{H(award.title)}</p>
                        {award.issuer && (
                          <p className="text-[10px] text-gray-500">{H(award.issuer)}{award.date ? ` • ${award.date}` : ""}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interests */}
              {isVisible("interests") && activeInterests.length > 0 && (
                <div>
                  <h2
                    className={`resume-heading-block text-xs font-bold tracking-wider border-b pb-1 mb-2 ${headingTransformClass}`}
                    style={{ color: headingTextColor, borderColor: headingBorderColor }}
                  >
                    Interests
                  </h2>
                  <p className="text-[11px] text-gray-700 leading-relaxed">
                    {activeInterests.map((i) => H(i.name || i)).reduce((prev, curr) => [prev, " • ", curr])}
                  </p>
                </div>
              )}
            </div>

            {/* ── RIGHT MAIN COLUMN (Col 8 - 67% Width) ── */}
            <div className="col-span-8 flex flex-col" style={styles.entryGapStyle}>
              {/* Summary */}
              {isVisible("summary") && summary && (
                <div>
                  <h2
                    className={`resume-heading-block text-xs font-bold tracking-wider border-b pb-1 mb-2 ${headingTransformClass}`}
                    style={{ color: headingTextColor, borderColor: headingBorderColor }}
                  >
                    Professional Summary
                  </h2>
                  <p className="text-[12px] text-gray-700 leading-relaxed whitespace-pre-line">{H(summary)}</p>
                </div>
              )}

              {/* Experience */}
              {isVisible("experience") && activeExp.length > 0 && (
                <div>
                  <h2
                    className={`resume-heading-block text-xs font-bold tracking-wider border-b pb-1 mb-3 ${headingTransformClass}`}
                    style={{ color: headingTextColor, borderColor: headingBorderColor }}
                  >
                    Professional Experience
                  </h2>
                  <div className="flex flex-col" style={styles.entryGapStyle}>
                    {activeExp.map((exp) => (
                      <div key={exp.id || Math.random()}>
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-gray-900 text-xs">
                            {theme.expTitleOrder === "title_employer"
                              ? `${exp.jobTitle} – ${exp.company}`
                              : `${exp.company}${exp.jobTitle ? ` – ${exp.jobTitle}` : ""}`}
                          </h3>
                          <span className="text-[10.5px] text-gray-500 font-medium">
                            {exp.startDate} {exp.startDate && exp.endDate ? "–" : ""} {exp.currentlyWorking ? "Present" : exp.endDate}
                          </span>
                        </div>
                        {exp.location && <div className="text-[10.5px] font-semibold text-gray-500">{exp.location}</div>}
                        {exp.description && (
                          <div className="text-[11.5px] text-gray-600 whitespace-pre-line mt-1 leading-relaxed">
                            {H(exp.description)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {isVisible("education") && activeEdu.length > 0 && (
                <div>
                  <h2
                    className={`resume-heading-block text-xs font-bold tracking-wider border-b pb-1 mb-3 ${headingTransformClass}`}
                    style={{ color: headingTextColor, borderColor: headingBorderColor }}
                  >
                    Education
                  </h2>
                  <div className="flex flex-col" style={styles.entryGapStyle}>
                    {activeEdu.map((edu) => (
                      <div key={edu.id || Math.random()}>
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-gray-900 text-xs">
                            {theme.eduTitleOrder === "degree_school"
                              ? `${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""} – ${edu.institution}`
                              : `${edu.institution}${edu.degree ? ` – ${edu.degree}` : ""}`}
                          </h3>
                          <span className="text-[10.5px] text-gray-500 font-medium">
                            {edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}
                          </span>
                        </div>
                        {edu.grade && <div className="text-[10.5px] text-gray-500">GPA / Grade: {edu.grade}</div>}
                        {edu.description && <div className="text-[11.5px] text-gray-600 mt-0.5">{H(edu.description)}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {isVisible("projects") && activeProjects.length > 0 && (
                <div>
                  <h2
                    className={`resume-heading-block text-xs font-bold tracking-wider border-b pb-1 mb-3 ${headingTransformClass}`}
                    style={{ color: headingTextColor, borderColor: headingBorderColor }}
                  >
                    Key Projects
                  </h2>
                  <div className="flex flex-col" style={styles.entryGapStyle}>
                    {activeProjects.map((proj) => (
                      <div key={proj.id || Math.random()}>
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-gray-900 text-xs">{H(proj.title)}</span>
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noreferrer" className="text-[10.5px] text-blue-600 hover:underline">
                              Live Project ↗
                            </a>
                          )}
                        </div>
                        {proj.technologies && (
                          <p className="text-[10.5px] font-semibold text-gray-500 mt-0.5">Stack: {H(proj.technologies)}</p>
                        )}
                        {proj.description && (
                          <div className="text-[11.5px] text-gray-600 whitespace-pre-line mt-0.5 leading-relaxed">
                            {H(proj.description)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Publications */}
              {isVisible("publications") && activePubs.length > 0 && (
                <div>
                  <h2
                    className={`resume-heading-block text-xs font-bold tracking-wider border-b pb-1 mb-2.5 ${headingTransformClass}`}
                    style={{ color: headingTextColor, borderColor: headingBorderColor }}
                  >
                    Publications
                  </h2>
                  <div className="flex flex-col" style={styles.entryGapStyle}>
                    {activePubs.map((pub) => (
                      <div key={pub.id || Math.random()} className="text-[11.5px]">
                        <p className="font-bold text-gray-900">{H(pub.title)}</p>
                        <p className="text-gray-500 text-[10.5px]">{H(pub.publisher)}{pub.date ? `, ${pub.date}` : ""}</p>
                        {pub.description && <p className="text-gray-600 mt-0.5">{H(pub.description)}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Organizations / Volunteering */}
              {isVisible("organizations") && activeOrgs.length > 0 && (
                <div>
                  <h2
                    className={`resume-heading-block text-xs font-bold tracking-wider border-b pb-1 mb-2.5 ${headingTransformClass}`}
                    style={{ color: headingTextColor, borderColor: headingBorderColor }}
                  >
                    Organizations & Volunteering
                  </h2>
                  <div className="flex flex-col" style={styles.entryGapStyle}>
                    {activeOrgs.map((org) => (
                      <div key={org.id || Math.random()} className="text-[11.5px]">
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-gray-900">{H(org.name)}</span>
                          <span className="text-[10.5px] text-gray-500">{org.startDate} – {org.endDate || "Present"}</span>
                        </div>
                        {org.role && <p className="text-[11px] font-semibold text-gray-700">{H(org.role)}</p>}
                        {org.description && <p className="text-gray-600 mt-0.5">{H(org.description)}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* References */}
              {isVisible("references") && activeRefs.length > 0 && (
                <div>
                  <h2
                    className={`resume-heading-block text-xs font-bold tracking-wider border-b pb-1 mb-2.5 ${headingTransformClass}`}
                    style={{ color: headingTextColor, borderColor: headingBorderColor }}
                  >
                    References
                  </h2>
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    {activeRefs.map((ref) => (
                      <div key={ref.id || Math.random()} className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="font-bold text-gray-900">{H(ref.name)}</p>
                        <p className="text-gray-600 text-[10.5px]">{ref.relationship} {ref.company ? `at ${H(ref.company)}` : ""}</p>
                        {ref.email && <p className="text-gray-500 text-[10px]">{ref.email}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Declaration */}
              {isVisible("declaration") && declaration && (declaration.statement || declaration.signatureName) && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-[11px] text-gray-700 italic">{H(declaration.statement)}</p>
                  <div className="mt-3 flex justify-between text-[10.5px] text-gray-800">
                    <div>
                      {declaration.place && <p>Place: {declaration.place}</p>}
                      {declaration.date && <p>Date: {declaration.date}</p>}
                    </div>
                    <div className="text-right">
                      <div className="w-28 border-b border-gray-400 mb-1 ml-auto" />
                      <p className="font-bold">{declaration.signatureName}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
    </div>
  );
}

export default SidebarTemplate;

