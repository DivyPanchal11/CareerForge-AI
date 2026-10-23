/**
 * Real-Time Resume Quality & Consistency Linter
 *
 * Implements 4 key quality and consistency audits:
 * 1. Inconsistent Punctuation: Flags bullet points ending with a period when others don't.
 * 2. Inconsistent Dates: Detects mismatched date styles (e.g. "Jan 2023" vs "03/2023" vs "March 2023").
 * 3. Repetitive Action Verbs: Alerts when action verbs ("Led", "Managed", "Built") are repeated 3+ times, offering diverse alternatives.
 * 4. Passive Voice & Weak Phrases: Highlights phrases like "was responsible for" and suggests active alternatives.
 */

// Categorized high-impact action verbs and their diverse alternatives
export const ACTION_VERB_ALTERNATIVES = {
  led: ["Spearheaded", "Directed", "Orchestrated", "Guided", "Championed", "Steered", "Mobilized"],
  managed: ["Supervised", "Administered", "Governed", "Coordinated", "Navigated", "Oversaw"],
  built: ["Architected", "Engineered", "Constructed", "Fabricated", "Devised", "Crafted"],
  developed: ["Engineered", "Pioneered", "Devised", "Formulated", "Programmed", "Implemented"],
  created: ["Authored", "Generated", "Initiated", "Invented", "Originated", "Designed"],
  worked: ["Collaborated", "Contributed", "Partnered", "Engaged", "Executed"],
  assisted: ["Facilitated", "Bolstered", "Supported", "Expedited", "Aided"],
  helped: ["Empowered", "Facilitated", "Advised", "Boosted", "Streamlined"],
  implemented: ["Executed", "Enacted", "Deployed", "Integrated", "Instituted"],
  handled: ["Resolved", "Executed", "Dispatched", "Administered", "Operated"],
  improved: ["Optimized", "Enhanced", "Elevated", "Upgraded", "Refined", "Amplified"],
  organized: ["Structured", "Systematized", "Arranged", "Cataloged", "Centralized"],
  maintained: ["Sustained", "Preserved", "Audited", "Monitored", "Consolidated"],
  analyzed: ["Evaluated", "Investigated", "Interpreted", "Assessed", "Audited"],
  increased: ["Amplified", "Boosted", "Maximized", "Elevated", "Multiplied"],
  reduced: ["Decreased", "Curtailed", "Minimized", "Trimmed", "Mitigated"],
};

// Common passive and weak phrases with strong active replacements
export const PASSIVE_WEAK_PATTERNS = [
  {
    regex: /\b(?:was|were)\s+responsible\s+for\b/gi,
    phrase: "was responsible for",
    alternatives: ["Spearheaded", "Directed", "Managed", "Owned"],
    replacementPrefix: true,
  },
  {
    regex: /\bresponsible\s+for\b/gi,
    phrase: "responsible for",
    alternatives: ["Directed", "Managed", "Led", "Delivered"],
    replacementPrefix: true,
  },
  {
    regex: /\b(?:was|were)\s+tasked\s+with\b/gi,
    phrase: "was tasked with",
    alternatives: ["Assigned to lead", "Executed", "Delivered"],
    replacementPrefix: true,
  },
  {
    regex: /\btasked\s+with\b/gi,
    phrase: "tasked with",
    alternatives: ["Led the execution of", "Executed", "Delivered"],
    replacementPrefix: true,
  },
  {
    regex: /\bduties\s+included\b/gi,
    phrase: "duties included",
    alternatives: ["Executed", "Led", "Administered"],
    replacementPrefix: true,
  },
  {
    regex: /\b(?:was|were)\s+involved\s+in\b/gi,
    phrase: "was involved in",
    alternatives: ["Partnered in", "Co-developed", "Spearheaded"],
    replacementPrefix: true,
  },
  {
    regex: /\bworked\s+on\b/gi,
    phrase: "worked on",
    alternatives: ["Engineered", "Architected", "Designed", "Built"],
    replacementPrefix: true,
  },
  {
    regex: /\bhelped\s+with\b/gi,
    phrase: "helped with",
    alternatives: ["Facilitated", "Collaborated on", "Supported"],
    replacementPrefix: true,
  },
  {
    regex: /\bhelped\s+to\b/gi,
    phrase: "helped to",
    alternatives: ["Empowered", "Facilitated", "Accelerated"],
    replacementPrefix: true,
  },
  {
    regex: /\bassisted\s+(?:in|with)\b/gi,
    phrase: "assisted with",
    alternatives: ["Bolstered", "Expedited", "Streamlined"],
    replacementPrefix: true,
  },
  {
    regex: /\bserving\s+as|served\s+as\b/gi,
    phrase: "served as",
    alternatives: ["Acted as", "Led as", "Operated as"],
    replacementPrefix: true,
  },
  {
    regex: /\b(?:was|were)\s+able\s+to\b/gi,
    phrase: "was able to",
    alternatives: ["Successfully delivered", "Achieved", "Accomplished"],
    replacementPrefix: true,
  },
];

const MONTH_NAMES_SHORT = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "sept", "oct", "nov", "dec"
];

const MONTH_NAMES_FULL = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december"
];

/**
 * Classifies a date string into a standard format category
 */
export function classifyDateFormat(rawDate) {
  if (!rawDate || typeof rawDate !== "string") return null;
  const d = rawDate.trim();
  if (!d) return null;

  // Ignore present/current
  if (/^(present|current|now|ongoing)$/i.test(d)) return null;

  // 1. Month Short + Year (e.g. "Jan 2023", "Sept 2021", "Dec. 2022")
  const shortMonthRegex = new RegExp(`^(${MONTH_NAMES_SHORT.join("|")})\\.?\\s+(\\d{4})$`, "i");
  if (shortMonthRegex.test(d)) {
    return { format: "short_month_year", label: "Short Month (e.g., Jan 2023)", sample: d };
  }

  // 2. Month Full + Year (e.g. "January 2023", "September 2021")
  const fullMonthRegex = new RegExp(`^(${MONTH_NAMES_FULL.join("|")})\\s+(\\d{4})$`, "i");
  if (fullMonthRegex.test(d)) {
    return { format: "full_month_year", label: "Full Month (e.g., January 2023)", sample: d };
  }

  // 3. Numeric MM/YYYY (e.g. "03/2023", "12/2021")
  if (/^\d{1,2}\/\d{4}$/.test(d)) {
    return { format: "numeric_slash", label: "Numeric Slash (e.g., 03/2023)", sample: d };
  }

  // 4. Numeric YYYY-MM (e.g. "2023-03")
  if (/^\d{4}-\d{1,2}$/.test(d)) {
    return { format: "numeric_dash", label: "ISO Dash (e.g., 2023-03)", sample: d };
  }

  // 5. Year only (e.g. "2023")
  if (/^\d{4}$/.test(d)) {
    return { format: "year_only", label: "Year Only (e.g., 2023)", sample: d };
  }

  return { format: "custom", label: "Custom Format", sample: d };
}

/**
 * Parses multiline description into bullet points
 */
function extractBulletsFromDescription(text) {
  if (!text || typeof text !== "string") return [];
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((raw) => {
      // Remove leading bullet characters
      const clean = raw.replace(/^[•\-\*\s]+/, "").trim();
      return { raw, clean };
    })
    .filter((b) => b.clean.length > 0);
}

/**
 * Main Linter Engine
 * Returns an object with overall qualityScore and 4 lint categories.
 */
export function lintResume(resume = {}) {
  const allBullets = []; // { section, entryId, title, bulletIndex, clean, raw }
  const allDates = []; // { section, entryId, title, field, value, format }

  // ── 1. Gather Experience entries ──
  (resume.experience || []).forEach((exp) => {
    if (exp.hidden) return;
    const title = `${exp.jobTitle || "Role"} at ${exp.company || "Company"}`;
    const bullets = extractBulletsFromDescription(exp.description);
    bullets.forEach((b, idx) => {
      allBullets.push({
        section: "experience",
        entryId: exp.id,
        title,
        bulletIndex: idx,
        clean: b.clean,
        raw: b.raw,
      });
    });

    if (exp.startDate) allDates.push({ section: "experience", entryId: exp.id, title, field: "startDate", value: exp.startDate });
    if (exp.endDate && !exp.currentlyWorking) allDates.push({ section: "experience", entryId: exp.id, title, field: "endDate", value: exp.endDate });
  });

  // ── 2. Gather Education entries ──
  (resume.education || []).forEach((edu) => {
    if (edu.hidden) return;
    const title = `${edu.degree || "Degree"} - ${edu.institution || "School"}`;
    const bullets = extractBulletsFromDescription(edu.description);
    bullets.forEach((b, idx) => {
      allBullets.push({
        section: "education",
        entryId: edu.id,
        title,
        bulletIndex: idx,
        clean: b.clean,
        raw: b.raw,
      });
    });

    if (edu.startDate) allDates.push({ section: "education", entryId: edu.id, title, field: "startDate", value: edu.startDate });
    if (edu.endDate) allDates.push({ section: "education", entryId: edu.id, title, field: "endDate", value: edu.endDate });
  });

  // ── 3. Gather Projects entries ──
  (resume.projects || []).forEach((proj) => {
    if (proj.hidden) return;
    const title = proj.title || "Project";
    const bullets = extractBulletsFromDescription(proj.description);
    bullets.forEach((b, idx) => {
      allBullets.push({
        section: "projects",
        entryId: proj.id,
        title,
        bulletIndex: idx,
        clean: b.clean,
        raw: b.raw,
      });
    });

    if (proj.startDate) allDates.push({ section: "projects", entryId: proj.id, title, field: "startDate", value: proj.startDate });
    if (proj.endDate) allDates.push({ section: "projects", entryId: proj.id, title, field: "endDate", value: proj.endDate });
  });

  // ── 4. Gather Certifications ──
  (resume.certifications || []).forEach((cert) => {
    if (cert.hidden) return;
    const title = cert.name || "Certification";
    const dateVal = cert.date || cert.issueDate;
    if (dateVal) allDates.push({ section: "certifications", entryId: cert.id, title, field: "date", value: dateVal });
  });

  // ── 5. Gather Awards ──
  (resume.awards || []).forEach((aw) => {
    if (aw.hidden) return;
    const title = aw.title || "Award";
    if (aw.date) allDates.push({ section: "awards", entryId: aw.id, title, field: "date", value: aw.date });
  });

  // ── 6. Gather Publications ──
  (resume.publications || []).forEach((pub) => {
    if (pub.hidden) return;
    const title = pub.title || "Publication";
    const bullets = extractBulletsFromDescription(pub.description);
    bullets.forEach((b, idx) => {
      allBullets.push({
        section: "publications",
        entryId: pub.id,
        title,
        bulletIndex: idx,
        clean: b.clean,
        raw: b.raw,
      });
    });
    if (pub.date) allDates.push({ section: "publications", entryId: pub.id, title, field: "date", value: pub.date });
  });

  // ── 7. Gather Organizations ──
  (resume.organizations || []).forEach((org) => {
    if (org.hidden) return;
    const title = org.name || "Organization";
    const bullets = extractBulletsFromDescription(org.description);
    bullets.forEach((b, idx) => {
      allBullets.push({
        section: "organizations",
        entryId: org.id,
        title,
        bulletIndex: idx,
        clean: b.clean,
        raw: b.raw,
      });
    });
    if (org.startDate) allDates.push({ section: "organizations", entryId: org.id, title, field: "startDate", value: org.startDate });
    if (org.endDate) allDates.push({ section: "organizations", entryId: org.id, title, field: "endDate", value: org.endDate });
  });

  // ── 8. Gather Custom Sections ──
  (resume.customSections || []).forEach((sec) => {
    if (sec.hidden) return;
    (sec.items || []).forEach((item) => {
      const title = item.title || sec.title || "Custom Entry";
      const bullets = extractBulletsFromDescription(item.description);
      bullets.forEach((b, idx) => {
        allBullets.push({
          section: "custom",
          entryId: item.id,
          title,
          bulletIndex: idx,
          clean: b.clean,
          raw: b.raw,
        });
      });
      if (item.date) allDates.push({ section: "custom", entryId: item.id, title, field: "date", value: item.date });
    });
  });

  // ── AUDIT 1: Inconsistent Punctuation ──
  const punctuationAudit = (() => {
    const withPeriod = [];
    const withoutPeriod = [];

    allBullets.forEach((b) => {
      const endsWithPeriod = /[.!?]$/.test(b.clean);
      if (endsWithPeriod) {
        withPeriod.push(b);
      } else {
        withoutPeriod.push(b);
      }
    });

    const isMixed = withPeriod.length > 0 && withoutPeriod.length > 0;
    const majority = withPeriod.length >= withoutPeriod.length ? "period" : "no_period";

    return {
      id: "punctuation",
      hasIssue: isMixed,
      totalBullets: allBullets.length,
      withPeriodCount: withPeriod.length,
      withoutPeriodCount: withoutPeriod.length,
      majorityStyle: majority,
      withPeriodItems: withPeriod,
      withoutPeriodItems: withoutPeriod,
      message: isMixed
        ? `${withPeriod.length} bullet${withPeriod.length > 1 ? "s" : ""} end with a period, while ${withoutPeriod.length} do not.`
        : "Consistent punctuation across all bullet points.",
      suggestion: isMixed
        ? `Pick one style: standardizing on ${majority === "period" ? "periods" : "no periods"} will look cleaner.`
        : null,
    };
  })();

  // ── AUDIT 2: Inconsistent Dates ──
  const dateAudit = (() => {
    const formatGroups = {}; // formatKey -> { label, count, samples: [] }

    allDates.forEach((d) => {
      const classified = classifyDateFormat(d.value);
      if (!classified) return;
      const key = classified.format;
      if (!formatGroups[key]) {
        formatGroups[key] = {
          key,
          label: classified.label,
          count: 0,
          entries: [],
        };
      }
      formatGroups[key].count += 1;
      formatGroups[key].entries.push({ ...d, classifiedSample: classified.sample });
    });

    const formatsFound = Object.values(formatGroups);
    // Ignore year_only if combined with another format like short_month_year
    const nonYearFormats = formatsFound.filter((f) => f.key !== "year_only");
    const hasInconsistency = nonYearFormats.length > 1;

    // Pick majority format
    const dominantFormat = formatsFound.sort((a, b) => b.count - a.count)[0] || null;

    return {
      id: "dates",
      hasIssue: hasInconsistency,
      totalDates: allDates.length,
      formatsFound,
      dominantFormat,
      message: hasInconsistency
        ? `Detected ${formatsFound.length} different date formats across your entries.`
        : "Date formatting is consistent across all sections.",
      suggestion: hasInconsistency
        ? `Standardize on "${dominantFormat?.label || "Short Month (e.g., Jan 2023)"}" across all jobs and schools.`
        : null,
    };
  })();

  // ── AUDIT 3: Repetitive Action Verbs ──
  const verbAudit = (() => {
    const verbCounts = {}; // normalizedVerb -> { count, entries: [], alternatives: [] }

    allBullets.forEach((b) => {
      // Get the first word
      const match = b.clean.match(/^[A-Za-z]+/);
      if (!match) return;
      const firstWord = match[0];
      const lower = firstWord.toLowerCase();

      // Skip common non-verbs
      if (["the", "a", "an", "in", "for", "with", "at", "to", "and", "by"].includes(lower)) return;

      if (!verbCounts[lower]) {
        // Find pre-mapped alternatives or fallback
        const alts = ACTION_VERB_ALTERNATIVES[lower] || [
          "Spearheaded",
          "Architected",
          "Accelerated",
          "Streamlined",
          "Executed",
        ];
        verbCounts[lower] = {
          word: firstWord,
          normalized: lower,
          count: 0,
          bullets: [],
          alternatives: alts,
        };
      }

      verbCounts[lower].count += 1;
      verbCounts[lower].bullets.push(b);
    });

    // Find verbs repeated 3 or more times (>= 3)
    const repetitiveVerbs = Object.values(verbCounts)
      .filter((v) => v.count >= 3)
      .sort((a, b) => b.count - a.count);

    const hasIssue = repetitiveVerbs.length > 0;

    return {
      id: "repetitive_verbs",
      hasIssue,
      repetitiveVerbs,
      message: hasIssue
        ? `${repetitiveVerbs.length} action verb${repetitiveVerbs.length > 1 ? "s are" : " is"} repeated 3 or more times.`
        : "Great variety of action verbs! No verb is overused.",
      suggestion: hasIssue
        ? `Vary repetitive verbs like "${repetitiveVerbs.map((v) => v.word).join('", "')}" to keep recruiters engaged.`
        : null,
    };
  })();

  // ── AUDIT 4: Passive Voice & Weak Phrases ──
  const passiveVoiceAudit = (() => {
    const detectedIssues = []; // { phrase, alternatives, bullet, matchedText }

    allBullets.forEach((b) => {
      for (const pattern of PASSIVE_WEAK_PATTERNS) {
        const matches = b.clean.match(pattern.regex);
        if (matches && matches.length > 0) {
          detectedIssues.push({
            phrase: pattern.phrase,
            matchedSnippet: matches[0],
            alternatives: pattern.alternatives,
            bullet: b,
          });
          break; // Break on longest/first matching pattern to avoid overlapping duplicates
        }
      }
    });

    const hasIssue = detectedIssues.length > 0;

    return {
      id: "passive_voice",
      hasIssue,
      totalDetected: detectedIssues.length,
      detectedIssues,
      message: hasIssue
        ? `Found ${detectedIssues.length} passive or weak phrase${detectedIssues.length > 1 ? "s" : ""} (e.g., "was responsible for").`
        : "Strong active voice used across all achievements.",
      suggestion: hasIssue
        ? "Replace passive phrasing with punchy, high-ownership verbs like Spearheaded, Engineered, or Orchestrated."
        : null,
    };
  })();

  // ── Calculate Overall Quality Score (0-100) ──
  let qualityScore = 100;
  if (punctuationAudit.hasIssue) qualityScore -= 15;
  if (dateAudit.hasIssue) qualityScore -= 15;
  if (verbAudit.hasIssue) {
    const penalty = Math.min(25, verbAudit.repetitiveVerbs.length * 8);
    qualityScore -= penalty;
  }
  if (passiveVoiceAudit.hasIssue) {
    const penalty = Math.min(25, passiveVoiceAudit.totalDetected * 7);
    qualityScore -= penalty;
  }
  qualityScore = Math.max(0, Math.min(100, qualityScore));

  const issuesCount =
    (punctuationAudit.hasIssue ? 1 : 0) +
    (dateAudit.hasIssue ? 1 : 0) +
    (verbAudit.hasIssue ? 1 : 0) +
    (passiveVoiceAudit.hasIssue ? 1 : 0);

  let qualityGrade = "Excellent";
  let gradeColor = "text-green-600 bg-green-50 border-green-200";
  if (qualityScore < 60) {
    qualityGrade = "Needs Polish";
    gradeColor = "text-red-600 bg-red-50 border-red-200";
  } else if (qualityScore < 85) {
    qualityGrade = "Good";
    gradeColor = "text-amber-600 bg-amber-50 border-amber-200";
  }

  return {
    qualityScore,
    qualityGrade,
    gradeColor,
    issuesCount,
    allChecksPassed: issuesCount === 0,
    punctuation: punctuationAudit,
    dates: dateAudit,
    repetitiveVerbs: verbAudit,
    passiveVoice: passiveVoiceAudit,
  };
}

// ── Interactive Quick-Fix Helpers ──

/**
 * 1-Click Punctuation Fix: Adds or removes trailing periods from all bullet points in resume
 */
export function fixResumePunctuation(resume, mode = "add") {
  const fixText = (desc) => {
    if (!desc || typeof desc !== "string") return desc;
    return desc
      .split(/\r?\n/)
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return line;

        // Strip existing trailing period/colon if present
        if (mode === "remove") {
          return line.replace(/[.]+$/, "");
        } else {
          // Add period if it doesn't end with one
          if (!/[.!?]$/.test(trimmed)) {
            return `${line}.`;
          }
          return line;
        }
      })
      .join("\n");
  };

  const updated = JSON.parse(JSON.stringify(resume));

  if (updated.experience) {
    updated.experience = updated.experience.map((e) => ({ ...e, description: fixText(e.description) }));
  }
  if (updated.education) {
    updated.education = updated.education.map((e) => ({ ...e, description: fixText(e.description) }));
  }
  if (updated.projects) {
    updated.projects = updated.projects.map((p) => ({ ...p, description: fixText(p.description) }));
  }
  if (updated.publications) {
    updated.publications = updated.publications.map((p) => ({ ...p, description: fixText(p.description) }));
  }
  if (updated.organizations) {
    updated.organizations = updated.organizations.map((o) => ({ ...o, description: fixText(o.description) }));
  }
  if (updated.customSections) {
    updated.customSections = updated.customSections.map((sec) => ({
      ...sec,
      items: (sec.items || []).map((item) => ({ ...item, description: fixText(item.description) })),
    }));
  }

  return updated;
}

/**
 * Replace a specific repetitive verb in a bullet
 */
export function replaceVerbInBullet(resume, { section, entryId, bulletIndex, newVerb }) {
  const updated = JSON.parse(JSON.stringify(resume));

  const updateDesc = (desc) => {
    if (!desc) return desc;
    const lines = desc.split(/\r?\n/);
    let activeBulletIdx = 0;
    const newLines = lines.map((line) => {
      const clean = line.replace(/^[•\-\*\s]+/, "").trim();
      if (!clean) return line;

      if (activeBulletIdx === bulletIndex) {
        activeBulletIdx++;
        // Replace the first word of this bullet
        return line.replace(/^([•\-\*\s]*)[A-Za-z]+/, `$1${newVerb}`);
      }
      activeBulletIdx++;
      return line;
    });
    return newLines.join("\n");
  };

  if (section === "experience" && updated.experience) {
    const exp = updated.experience.find((e) => e.id === entryId);
    if (exp) exp.description = updateDesc(exp.description);
  } else if (section === "projects" && updated.projects) {
    const proj = updated.projects.find((p) => p.id === entryId);
    if (proj) proj.description = updateDesc(proj.description);
  } else if (section === "education" && updated.education) {
    const edu = updated.education.find((e) => e.id === entryId);
    if (edu) edu.description = updateDesc(edu.description);
  } else if (section === "custom" && updated.customSections) {
    updated.customSections.forEach((sec) => {
      const item = (sec.items || []).find((i) => i.id === entryId);
      if (item) item.description = updateDesc(item.description);
    });
  }

  return updated;
}

/**
 * Replace a passive/weak phrase in a bullet
 */
export function replaceWeakPhraseInBullet(resume, { section, entryId, targetPhrase, newWord }) {
  const updated = JSON.parse(JSON.stringify(resume));

  const updateDesc = (desc) => {
    if (!desc) return desc;
    // Build a case-insensitive regex for the target phrase
    const escaped = targetPhrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    return desc.replace(regex, newWord);
  };

  if (section === "experience" && updated.experience) {
    const exp = updated.experience.find((e) => e.id === entryId);
    if (exp) exp.description = updateDesc(exp.description);
  } else if (section === "projects" && updated.projects) {
    const proj = updated.projects.find((p) => p.id === entryId);
    if (proj) proj.description = updateDesc(proj.description);
  } else if (section === "education" && updated.education) {
    const edu = updated.education.find((e) => e.id === entryId);
    if (edu) edu.description = updateDesc(edu.description);
  } else if (section === "custom" && updated.customSections) {
    updated.customSections.forEach((sec) => {
      const item = (sec.items || []).find((i) => i.id === entryId);
      if (item) item.description = updateDesc(item.description);
    });
  }

  return updated;
}
