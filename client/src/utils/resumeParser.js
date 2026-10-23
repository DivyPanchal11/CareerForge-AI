import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// Set worker source for Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Extracts plain text from an uploaded PDF File or ArrayBuffer using pdfjs-dist.
 * Preserves vertical lines (Y positions) and horizontal reading order (X positions).
 */
export async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const lines = [];
      let currentY = null;
      let currentLine = "";

      for (const item of textContent.items) {
        if (!item.str && !item.hasEOL) continue;
        const y = item.transform ? Math.round(item.transform[5]) : null;

        // Threshold of 3px detects line changes in standard PDF layouts
        if (currentY !== null && y !== null && Math.abs(y - currentY) > 3) {
          if (currentLine.trim()) lines.push(currentLine.trim());
          currentLine = item.str || "";
          currentY = y;
        } else {
          if (currentLine && item.str && !currentLine.endsWith(" ") && !item.str.startsWith(" ")) {
            currentLine += " " + item.str;
          } else {
            currentLine += item.str || "";
          }
          if (currentY === null && y !== null) currentY = y;
        }

        if (item.hasEOL) {
          if (currentLine.trim()) lines.push(currentLine.trim());
          currentLine = "";
          currentY = null;
        }
      }

      if (currentLine.trim()) lines.push(currentLine.trim());
      fullText += lines.join("\n") + "\n";
    }

    return fullText.trim();
  } catch (error) {
    console.error("PDF Extraction Error:", error);
    throw new Error("Failed to extract text from PDF file. Please ensure it is a valid document.");
  }
}

/**
 * Parses raw text (from PDF or OCR) into structured resume fields and preserves exact layout structure.
 */
export function parseResumeText(rawText) {
  if (!rawText) return {};

  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const result = {
    personalInfo: {
      fullName: "",
      jobTitle: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    awards: [],
    interests: [],
    publications: [],
    organizations: [],
    references: [],
    declaration: {},
    customSections: [],
    sectionOrder: [],
    hiddenSections: [],
    template: "modern",
  };

  const SECTION_KEYWORDS = {
    summary: /^(summary|professional summary|executive summary|about me|profile|career objective|objective)\b/i,
    experience: /^(experience|work experience|employment history|work history|professional experience|career history)\b/i,
    education: /^(education|academic background|academics|qualifications|education & credentials|academic history)\b/i,
    skills: /^(skills|technical skills|core competencies|competencies|skills & expertise|technologies|areas of expertise|key skills)\b/i,
    projects: /^(projects|strategic projects|key projects|personal projects|technical projects|academic projects)\b/i,
    certifications: /^(certifications|certifications & accreditations|licenses|certifications & licenses|accreditations|credentials)\b/i,
    languages: /^(languages|language proficiencies|languages known)\b/i,
    awards: /^(awards|honors|awards & honors|achievements|key achievements|honors & awards)\b/i,
    publications: /^(publications|publications & research|research|papers)\b/i,
    organizations: /^(organizations|volunteering|volunteer work|leadership & volunteering|organizations & volunteering)\b/i,
    interests: /^(interests|hobbies|activities|extracurricular activities)\b/i,
    references: /^(references|professional references)\b/i,
    declaration: /^(declaration)\b/i,
  };

  // Find where the first section begins to separate header contacts from body
  let firstSecIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    for (const regex of Object.values(SECTION_KEYWORDS)) {
      if (regex.test(lines[i])) {
        firstSecIdx = i;
        break;
      }
    }
    if (firstSecIdx !== -1) break;
  }

  const headerLines = firstSecIdx !== -1 ? lines.slice(0, firstSecIdx) : lines.slice(0, 5);
  const bodyLines = firstSecIdx !== -1 ? lines.slice(firstSecIdx) : [];

  // 1. Email extraction
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    result.personalInfo.email = emailMatch[0];
  }

  // 2. Phone extraction
  const phoneMatch = rawText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) {
    result.personalInfo.phone = phoneMatch[0].trim();
  }

  // 3. LinkedIn & GitHub & Portfolio
  const linkedinMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?(?:linkedin\.com\/in\/[a-zA-Z0-9_-]+|linked\.com)/i);
  if (linkedinMatch) {
    result.personalInfo.linkedin = linkedinMatch[0];
  }
  const githubMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  if (githubMatch) {
    result.personalInfo.github = githubMatch[0];
  }

  // 4. Name, Job Title & Location from Header Lines
  const remainingHeaderLines = [];
  for (const line of headerLines) {
    if (
      line.includes("@") ||
      (phoneMatch && line.includes(phoneMatch[0])) ||
      line.toLowerCase().includes("linkedin") ||
      line.toLowerCase().includes("linked.com") ||
      line.toLowerCase().includes("github.com")
    ) {
      continue;
    }
    remainingHeaderLines.push(line);
  }

  if (remainingHeaderLines.length > 0) {
    result.personalInfo.fullName = remainingHeaderLines[0];
  }
  for (let i = 1; i < remainingHeaderLines.length; i++) {
    const l = remainingHeaderLines[i];
    if (/,/.test(l) && !result.personalInfo.location) {
      result.personalInfo.location = l;
    } else if (!result.personalInfo.jobTitle) {
      result.personalInfo.jobTitle = l;
    }
  }

  // 5. Segment Body by Sections
  let currentSection = null;
  const detectedOrder = [];
  const sectionContent = {};
  Object.keys(SECTION_KEYWORDS).forEach((k) => {
    sectionContent[k] = [];
  });

  for (const line of bodyLines) {
    let matchedSec = null;
    for (const [secKey, regex] of Object.entries(SECTION_KEYWORDS)) {
      if (regex.test(line)) {
        matchedSec = secKey;
        break;
      }
    }

    if (matchedSec) {
      currentSection = matchedSec;
      if (!detectedOrder.includes(matchedSec)) {
        detectedOrder.push(matchedSec);
      }
      continue;
    }

    if (currentSection) {
      sectionContent[currentSection].push(line);
    }
  }

  // Process Summary
  if (sectionContent.summary.length > 0) {
    result.summary = sectionContent.summary.join(" ");
  }

  const dateRangeRegex = /(?:(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{2,4}|\d{4}))\s*[-–—to\s]+\s*(Present|Current|\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{2,4}|\d{4})/i;
  const singleDateRegex = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}|\b(19\d\d|20\d\d)\b/i;

  // Process Experience
  if (sectionContent.experience.length > 0) {
    const expLines = sectionContent.experience;
    const blocks = [];
    let curBlock = [];

    for (const line of expLines) {
      const hasDate = dateRangeRegex.test(line) || singleDateRegex.test(line);
      const isHeader = line.includes("—") || line.includes(" - ");
      if ((hasDate || isHeader) && curBlock.length > 0 && curBlock.length >= 2) {
        blocks.push([...curBlock]);
        curBlock = [line];
      } else {
        curBlock.push(line);
      }
    }
    if (curBlock.length > 0) blocks.push(curBlock);

    result.experience = blocks.map((blk, idx) => {
      let jobTitle = "";
      let company = "";
      let startDate = "";
      let endDate = "";
      let currentlyWorking = false;
      let location = "";
      const descLines = [];

      const firstLine = blk[0] || "";
      const dateMatch = firstLine.match(dateRangeRegex);
      let titleCompanyStr = firstLine;

      if (dateMatch) {
        startDate = dateMatch[1]?.trim() || "";
        endDate = dateMatch[2]?.trim() || "";
        currentlyWorking = /present|current/i.test(endDate);
        titleCompanyStr = firstLine.replace(dateMatch[0], "").trim();
      }

      if (titleCompanyStr.includes("—")) {
        const parts = titleCompanyStr.split("—");
        company = parts[0]?.trim() || "";
        jobTitle = parts[1]?.trim() || "";
      } else if (titleCompanyStr.includes(" - ")) {
        const parts = titleCompanyStr.split(" - ");
        company = parts[0]?.trim() || "";
        jobTitle = parts[1]?.trim() || "";
      } else {
        company = titleCompanyStr;
        jobTitle = "Role";
      }

      for (let i = 1; i < blk.length; i++) {
        const l = blk[i];
        if (i === 1 && /,/.test(l) && !l.startsWith("•") && !l.startsWith("-")) {
          location = l;
        } else {
          descLines.push(l);
        }
      }

      return {
        id: `exp_${Date.now()}_${idx}`,
        jobTitle,
        company,
        location,
        startDate,
        endDate,
        currentlyWorking,
        description: descLines.join("\n"),
      };
    });
  }

  // Process Education
  if (sectionContent.education.length > 0) {
    const eduLines = sectionContent.education;
    const blocks = [];
    let curBlock = [];

    for (const l of eduLines) {
      const hasDate = dateRangeRegex.test(l) || singleDateRegex.test(l);
      if (hasDate && curBlock.length > 0) {
        blocks.push([...curBlock]);
        curBlock = [l];
      } else {
        curBlock.push(l);
      }
    }
    if (curBlock.length > 0) blocks.push(curBlock);

    result.education = blocks.map((blk, idx) => {
      const firstLine = blk[0] || "";
      let institution = "";
      let degree = "";
      let startDate = "";
      let endDate = "";
      let fieldOfStudy = "";
      let grade = "";
      let description = "";

      const dateMatch = firstLine.match(dateRangeRegex);
      let rest = firstLine;
      if (dateMatch) {
        startDate = dateMatch[1]?.trim() || "";
        endDate = dateMatch[2]?.trim() || "";
        rest = firstLine.replace(dateMatch[0], "").trim();
      }

      if (rest.includes("—")) {
        const parts = rest.split("—");
        institution = parts[0]?.trim() || "";
        degree = parts[1]?.trim() || "";
      } else if (rest.includes(" - ")) {
        const parts = rest.split(" - ");
        institution = parts[0]?.trim() || "";
        degree = parts[1]?.trim() || "";
      } else {
        institution = rest;
        degree = "Degree";
      }

      for (let i = 1; i < blk.length; i++) {
        const l = blk[i];
        const fieldMatch = l.match(/Field:\s*([^•\n]+)/i);
        const gradeMatch = l.match(/Grade:\s*([^•\n]+)/i);
        if (fieldMatch) fieldOfStudy = fieldMatch[1]?.trim();
        if (gradeMatch) grade = gradeMatch[1]?.trim();
        if (!fieldMatch && !gradeMatch) {
          description = description ? `${description}\n${l}` : l;
        }
      }

      return {
        id: `edu_${Date.now()}_${idx}`,
        institution,
        degree,
        fieldOfStudy,
        startDate,
        endDate,
        grade,
        description,
      };
    });
  }

  // Process Skills
  if (sectionContent.skills.length > 0) {
    const text = sectionContent.skills.join(" ");
    const levels = ["Beginner", "Intermediate", "Advanced", "Expert", "Master"];
    const foundSkills = [];

    const parts = text.split(/[•,|·]/).map((s) => s.trim()).filter(Boolean);
    for (let p of parts) {
      let lvl = "Intermediate";
      for (const l of levels) {
        const regex = new RegExp(`\\b${l}\\b`, "i");
        if (regex.test(p)) {
          lvl = l;
          p = p.replace(regex, "").trim();
          break;
        }
      }
      if (p.length > 1 && p.length < 35) {
        foundSkills.push({
          id: `skill_${Date.now()}_${foundSkills.length}`,
          name: p,
          category: "Technical",
          level: lvl,
        });
      }
    }
    result.skills = foundSkills;
  }

  // Process Projects
  if (sectionContent.projects.length > 0) {
    const projLines = sectionContent.projects;
    const blocks = [];
    let curBlock = [];

    for (const l of projLines) {
      if ((l.startsWith("•") || l.startsWith("-") || l.startsWith("*")) && curBlock.length > 0) {
        curBlock.push(l);
      } else if (curBlock.length === 0 || curBlock.length > 3) {
        if (curBlock.length > 0) blocks.push([...curBlock]);
        curBlock = [l];
      } else {
        curBlock.push(l);
      }
    }
    if (curBlock.length > 0) blocks.push(curBlock);

    result.projects = blocks.map((blk, idx) => {
      const title = blk[0] || `Project ${idx + 1}`;
      let technologies = "";
      const desc = [];

      for (let i = 1; i < blk.length; i++) {
        const l = blk[i];
        if (/^(Scope\s*\/\s*Technologies|Technologies|Tech Stack|Built with|Tools):/i.test(l)) {
          technologies = l.replace(
            /^(Scope\s*\/\s*Technologies|Technologies|Tech Stack|Built with|Tools):/i,
            ""
          ).trim();
        } else {
          desc.push(l);
        }
      }

      return {
        id: `proj_${Date.now()}_${idx}`,
        title,
        technologies,
        description: desc.join("\n"),
        projectLink: "",
        githubLink: "",
      };
    });
  }

  // Process Certifications
  if (sectionContent.certifications.length > 0) {
    result.certifications = sectionContent.certifications
      .filter((l) => l.length > 2)
      .map((line, idx) => {
        let name = line;
        let issuer = "";
        let issueDate = "";

        const dateMatch = line.match(
          /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}|\b(19\d\d|20\d\d)\b/i
        );
        let rest = line;
        if (dateMatch) {
          issueDate = dateMatch[0];
          rest = line.replace(dateMatch[0], "").trim();
        }

        if (rest.includes("—")) {
          const parts = rest.split("—");
          name = parts[0]?.trim() || "";
          issuer = parts[1]?.trim() || "";
        } else if (rest.includes(" - ")) {
          const parts = rest.split(" - ");
          name = parts[0]?.trim() || "";
          issuer = parts[1]?.trim() || "";
        }

        return {
          id: `cert_${Date.now()}_${idx}`,
          name,
          issuer,
          issueDate,
        };
      });
  }

  // Process Languages
  if (sectionContent.languages.length > 0) {
    const raw = sectionContent.languages.join(" ");
    const langPairs = [];
    const regex = /([A-Za-z]+)\s*[:\-\(]\s*(Native|Fluent|Advanced|Intermediate|Beginner)\)?/gi;
    let match;
    while ((match = regex.exec(raw)) !== null) {
      langPairs.push({
        id: `lang_${Date.now()}_${langPairs.length}`,
        language: match[1]?.trim(),
        proficiency: match[2]?.trim(),
      });
    }

    if (langPairs.length > 0) {
      result.languages = langPairs;
    } else {
      const tokens = raw.split(/[,•|·]/).map((l) => l.trim()).filter(Boolean);
      result.languages = tokens.map((t, idx) => ({
        id: `lang_${Date.now()}_${idx}`,
        language: t,
        proficiency: "Fluent",
      }));
    }
  }

  // Template & Layout Structure Auto-Detection
  const rawLower = rawText.toLowerCase();
  const allSectionHeadings = bodyLines
    .filter((l) => {
      for (const regex of Object.values(SECTION_KEYWORDS)) {
        if (regex.test(l)) return true;
      }
      return false;
    })
    .join(" ")
    .toLowerCase();

  if (
    allSectionHeadings.includes("executive summary") ||
    allSectionHeadings.includes("core competencies") ||
    allSectionHeadings.includes("strategic projects") ||
    allSectionHeadings.includes("education & credentials") ||
    allSectionHeadings.includes("certifications & accreditations")
  ) {
    result.template = "professional";
  } else if (
    rawLower.includes("curriculum vitae") ||
    rawLower.includes("publications") ||
    rawLower.includes("ph.d") ||
    rawLower.includes("juris")
  ) {
    result.template = "classic";
  } else if (result.skills.length >= 6 && result.languages.length >= 2) {
    result.template = "sidebar";
  } else {
    result.template = "modern";
  }

  // Section Order & Hidden Sections - Preserve exact source layout
  const ALL_SECTIONS = [
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
  ];

  const presentSections = detectedOrder;
  const missingSections = ALL_SECTIONS.filter((s) => !presentSections.includes(s));

  result.sectionOrder = ["personalInfo", ...presentSections, ...missingSections];
  result.hiddenSections = [];

  return result;
}

/**
 * Validates and parses JSON resume backup data.
 */
export function parseResumeJSON(jsonStringOrObj) {
  try {
    const data =
      typeof jsonStringOrObj === "string" ? JSON.parse(jsonStringOrObj) : jsonStringOrObj;

    if (!data || typeof data !== "object") {
      throw new Error("Invalid JSON: Expected a JSON object.");
    }

    return {
      title: data.title || "Imported Resume",
      template: data.template || "modern",
      personalInfo: {
        fullName: data.personalInfo?.fullName || "",
        jobTitle: data.personalInfo?.jobTitle || "",
        email: data.personalInfo?.email || "",
        phone: data.personalInfo?.phone || "",
        location: data.personalInfo?.location || "",
        linkedin: data.personalInfo?.linkedin || "",
        github: data.personalInfo?.github || "",
        portfolio: data.personalInfo?.portfolio || "",
        photo: data.personalInfo?.photo || "",
      },
      summary: data.summary || "",
      experience: Array.isArray(data.experience) ? data.experience : [],
      education: Array.isArray(data.education) ? data.education : [],
      skills: Array.isArray(data.skills) ? data.skills : [],
      projects: Array.isArray(data.projects) ? data.projects : [],
      certifications: Array.isArray(data.certifications) ? data.certifications : [],
      languages: Array.isArray(data.languages) ? data.languages : [],
      awards: Array.isArray(data.awards) ? data.awards : [],
      publications: Array.isArray(data.publications) ? data.publications : [],
      organizations: Array.isArray(data.organizations) ? data.organizations : [],
      references: Array.isArray(data.references) ? data.references : [],
      declaration: data.declaration || {},
      interests: Array.isArray(data.interests) ? data.interests : [],
      customSections: Array.isArray(data.customSections) ? data.customSections : [],
      theme: data.theme || {},
      sectionOrder: Array.isArray(data.sectionOrder) ? data.sectionOrder : undefined,
      hiddenSections: Array.isArray(data.hiddenSections) ? data.hiddenSections : [],
    };
  } catch (err) {
    throw new Error(`Invalid JSON format: ${err.message}`);
  }
}

/**
 * Exports current resume data as a clean JSON backup file.
 */
export function exportResumeBackup(resume) {
  if (!resume) return;

  const exportData = {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    title: resume.title || "My Resume",
    template: resume.template || "modern",
    personalInfo: resume.personalInfo || {},
    summary: resume.summary || "",
    experience: resume.experience || [],
    education: resume.education || [],
    skills: resume.skills || [],
    projects: resume.projects || [],
    certifications: resume.certifications || [],
    languages: resume.languages || [],
    awards: resume.awards || [],
    publications: resume.publications || [],
    organizations: resume.organizations || [],
    references: resume.references || [],
    declaration: resume.declaration || {},
    interests: resume.interests || [],
    customSections: resume.customSections || [],
    theme: resume.theme || {},
    sectionOrder: resume.sectionOrder || [],
    hiddenSections: resume.hiddenSections || [],
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(exportData, null, 2)
  )}`;

  const candidateName = (resume.personalInfo?.fullName || "Candidate").replace(
    /[^a-zA-Z0-9_-]/g,
    "_"
  );
  const filename = `${candidateName}_Resume_Backup.json`;

  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", jsonString);
  downloadAnchor.setAttribute("download", filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
