import toast from "react-hot-toast";

/**
 * Generates an ultra-clean, UTF-8 plain text version of the resume.
 * Specifically formatted for legacy and enterprise Applicant Tracking Systems
 * (Taleo, Workday, BrassRing, iCIMS, Greenhouse) that parse raw text boxes.
 *
 * @param {object} resume - Resume data object
 * @returns {string} - Clean plain text
 */
export function generateAtsPlainText(resume = {}) {
  const p = resume.personalInfo || {};
  const sections = [];

  const lineBreak = "============================================================";
  const subDivider = "------------------------------------------------------------";

  // 1. Header (Name, Title, Contacts)
  const headerLines = [];
  if (p.fullName) {
    headerLines.push(p.fullName.toUpperCase());
  }
  if (p.jobTitle) {
    headerLines.push(p.jobTitle);
  }

  const contacts = [
    p.email,
    p.phone,
    p.location,
    p.linkedin,
    p.github,
    p.portfolio,
  ].filter(Boolean);

  if (contacts.length > 0) {
    headerLines.push(contacts.join(" | "));
  }

  sections.push(headerLines.join("\n"));

  // 2. Professional Summary
  if (resume.summary && resume.summary.trim()) {
    sections.push(
      [
        lineBreak,
        "PROFESSIONAL SUMMARY",
        lineBreak,
        resume.summary.trim(),
      ].join("\n")
    );
  }

  // 3. Work Experience
  const activeExp = (resume.experience || []).filter((e) => !e.hidden);
  if (activeExp.length > 0) {
    const expLines = [lineBreak, "PROFESSIONAL EXPERIENCE", lineBreak];

    activeExp.forEach((item, idx) => {
      const titleLine = [item.jobTitle, item.company].filter(Boolean).join(" | ");
      const dateRange = [item.startDate, item.currentlyWorking ? "Present" : item.endDate]
        .filter(Boolean)
        .join(" - ");
      const metaLine = [dateRange, item.location].filter(Boolean).join(" | ");

      if (titleLine) expLines.push(titleLine);
      if (metaLine) expLines.push(metaLine);

      if (item.description) {
        // Break description into lines and ensure clean bullet points
        const descLines = item.description
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);

        descLines.forEach((line) => {
          const cleanLine = line.replace(/^[•\-\*]\s*/, "");
          expLines.push(`- ${cleanLine}`);
        });
      }

      if (idx < activeExp.length - 1) {
        expLines.push("");
      }
    });

    sections.push(expLines.join("\n"));
  }

  // 4. Education
  const activeEdu = (resume.education || []).filter((e) => !e.hidden);
  if (activeEdu.length > 0) {
    const eduLines = [lineBreak, "EDUCATION", lineBreak];

    activeEdu.forEach((item, idx) => {
      const degreeLine = [item.degree, item.fieldOfStudy].filter(Boolean).join(" in ");
      const mainLine = [degreeLine, item.institution].filter(Boolean).join(" | ");
      const dateRange = [item.startDate, item.endDate].filter(Boolean).join(" - ");
      const metaLine = [dateRange, item.grade ? `Grade: ${item.grade}` : null].filter(Boolean).join(" | ");

      if (mainLine) eduLines.push(mainLine);
      if (metaLine) eduLines.push(metaLine);
      if (item.description) eduLines.push(item.description.trim());

      if (idx < activeEdu.length - 1) {
        eduLines.push("");
      }
    });

    sections.push(eduLines.join("\n"));
  }

  // 5. Skills
  const activeSkills = (resume.skills || []).filter((s) => !s.hidden);
  if (activeSkills.length > 0) {
    const skillLines = [lineBreak, "TECHNICAL & PROFESSIONAL SKILLS", lineBreak];

    // Group by category if categories exist
    const categories = {};
    activeSkills.forEach((s) => {
      const cat = s.category || "General";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(s.name);
    });

    const categoryKeys = Object.keys(categories);
    if (categoryKeys.length > 1) {
      categoryKeys.forEach((cat) => {
        skillLines.push(`${cat}: ${categories[cat].join(", ")}`);
      });
    } else {
      skillLines.push(activeSkills.map((s) => s.name).join(", "));
    }

    sections.push(skillLines.join("\n"));
  }

  // 6. Projects
  const activeProj = (resume.projects || []).filter((p) => !p.hidden);
  if (activeProj.length > 0) {
    const projLines = [lineBreak, "KEY PROJECTS", lineBreak];

    activeProj.forEach((item, idx) => {
      const titleLine = [item.title, item.technologies ? `[${item.technologies}]` : null]
        .filter(Boolean)
        .join(" ");
      const dateRange = [item.startDate, item.endDate].filter(Boolean).join(" - ");
      const linkLine = [dateRange, item.projectLink || item.githubLink].filter(Boolean).join(" | ");

      if (titleLine) projLines.push(titleLine);
      if (linkLine) projLines.push(linkLine);

      if (item.description) {
        const descLines = item.description
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);

        descLines.forEach((line) => {
          const cleanLine = line.replace(/^[•\-\*]\s*/, "");
          projLines.push(`- ${cleanLine}`);
        });
      }

      if (idx < activeProj.length - 1) {
        projLines.push("");
      }
    });

    sections.push(projLines.join("\n"));
  }

  // 7. Certifications
  const activeCerts = (resume.certifications || []).filter((c) => !c.hidden);
  if (activeCerts.length > 0) {
    const certLines = [lineBreak, "CERTIFICATIONS & LICENSES", lineBreak];

    activeCerts.forEach((item) => {
      const certLine = [item.name, item.issuer, item.issueDate || item.date].filter(Boolean).join(" | ");
      if (certLine) certLines.push(`- ${certLine}`);
    });

    sections.push(certLines.join("\n"));
  }

  // 8. Languages
  const activeLangs = (resume.languages || []).filter((l) => !l.hidden);
  if (activeLangs.length > 0) {
    const langLines = [lineBreak, "LANGUAGES", lineBreak];
    const langStr = activeLangs
      .map((l) => (l.proficiency ? `${l.language} (${l.proficiency})` : l.language))
      .join(", ");
    langLines.push(langStr);
    sections.push(langLines.join("\n"));
  }

  // 9. Awards
  const activeAwards = (resume.awards || []).filter((a) => !a.hidden);
  if (activeAwards.length > 0) {
    const awardLines = [lineBreak, "AWARDS & HONORS", lineBreak];
    activeAwards.forEach((item) => {
      const awardLine = [item.title, item.issuer, item.date].filter(Boolean).join(" | ");
      if (awardLine) awardLines.push(`- ${awardLine}`);
    });
    sections.push(awardLines.join("\n"));
  }

  // 10. Interests
  const activeInt = (resume.interests || []).filter((i) => !i.hidden);
  if (activeInt.length > 0) {
    const intLines = [lineBreak, "INTERESTS & ACTIVITIES", lineBreak];
    intLines.push(activeInt.map((i) => (typeof i === "string" ? i : i.name)).join(", "));
    sections.push(intLines.join("\n"));
  }

  // 11. Declaration
  if (resume.declaration && (resume.declaration.statement || resume.declaration.signatureName)) {
    const dec = resume.declaration;
    const decLines = [lineBreak, "DECLARATION", lineBreak];
    if (dec.statement) decLines.push(dec.statement);
    const sigLine = [dec.place ? `Place: ${dec.place}` : null, dec.signatureName ? `Signed by: ${dec.signatureName}` : null]
      .filter(Boolean)
      .join(" | ");
    if (sigLine) decLines.push(sigLine);
    sections.push(decLines.join("\n"));
  }

  return sections.join("\n\n");
}

/**
 * Triggers a browser download of the pure plain-text resume
 * @param {object} resume
 */
export function downloadAtsPlainText(resume = {}) {
  try {
    const text = generateAtsPlainText(resume);
    const fullName = resume?.personalInfo?.fullName?.trim() || "Resume";
    const cleanFilename = `${fullName.replace(/\s+/g, "_")}_ATS_Plain_Text.txt`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = cleanFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${cleanFilename}!`, { icon: "📋" });
    return true;
  } catch (err) {
    console.error("Plain text export error:", err);
    toast.error("Failed to export plain text resume");
    return false;
  }
}

/**
 * Copies the ATS plain text directly to candidate's clipboard
 * @param {object} resume
 */
export async function copyAtsPlainTextToClipboard(resume = {}) {
  try {
    const text = generateAtsPlainText(resume);
    await navigator.clipboard.writeText(text);
    toast.success("ATS Plain-Text copied to clipboard! Ready to paste into Workday / Taleo.", {
      duration: 3500,
      icon: "📋",
    });
    return true;
  } catch (err) {
    console.error("Clipboard copy error:", err);
    toast.error("Failed to copy to clipboard");
    return false;
  }
}
