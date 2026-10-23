/**
 * Keyword Matcher Utility
 *
 * Extracts meaningful keywords from a job description, then computes
 * which ones appear in the resume and which are missing.
 */

// Common stop-words to exclude from keyword extraction
const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of",
  "with", "by", "from", "as", "is", "was", "are", "were", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "shall", "can", "need", "must",
  "that", "this", "these", "those", "it", "its", "we", "our", "you", "your",
  "they", "their", "them", "he", "she", "his", "her", "i", "me", "my",
  "not", "no", "nor", "if", "then", "than", "so", "very", "too", "also",
  "just", "about", "up", "out", "into", "over", "after", "before", "between",
  "through", "during", "above", "below", "such", "each", "every", "all",
  "both", "few", "more", "most", "other", "some", "any", "only", "own",
  "same", "well", "back", "even", "still", "new", "now", "much", "many",
  "way", "who", "what", "when", "where", "how", "why", "which",
  "etc", "e.g", "i.e", "per", "via",
  // Job posting filler words
  "role", "position", "candidate", "apply", "application", "company",
  "team", "work", "working", "job", "opportunity", "responsibilities",
  "requirements", "qualifications", "preferred", "required", "minimum",
  "years", "year", "experience", "strong", "ability", "able", "including",
  "within", "across", "using", "based", "related", "relevant", "plus",
  "ideal", "looking", "join", "part", "full", "time",
]);

/**
 * Extract meaningful keywords and phrases from a job description.
 * Handles both single words and common multi-word technical terms.
 *
 * @param {string} jobDescription - The pasted job description text
 * @returns {string[]} - Array of unique lowercase keywords/phrases
 */
export function extractKeywords(jobDescription) {
  if (!jobDescription || typeof jobDescription !== "string") return [];

  const text = jobDescription.toLowerCase();

  // 1. Extract multi-word technical phrases first (2-3 word combos)
  const multiWordPatterns = [
    // Tech stacks & frameworks
    /\b(machine learning|deep learning|natural language processing|computer vision)\b/g,
    /\b(react native|node\.?js|next\.?js|vue\.?js|angular\.?js|express\.?js)\b/g,
    /\b(ruby on rails|spring boot|asp\.?net|\.net core)\b/g,
    /\b(amazon web services|google cloud|microsoft azure)\b/g,
    /\b(ci\s*\/?\s*cd|dev\s*ops|rest\s*(?:ful)?\s*api|graphql api)\b/g,
    /\b(data science|data engineering|data analysis|data visualization)\b/g,
    /\b(project management|product management|agile methodology)\b/g,
    /\b(unit testing|integration testing|test driven|end to end)\b/g,
    /\b(version control|source control|code review)\b/g,
    /\b(user experience|user interface|ui\s*\/?\s*ux)\b/g,
    /\b(problem solving|critical thinking|cross functional)\b/g,
    /\b(full stack|front end|back end|mobile development|web development)\b/g,
    /\b(cloud computing|micro\s*services|distributed systems|system design)\b/g,
    /\b(continuous integration|continuous deployment|continuous delivery)\b/g,
    /\b(object oriented|functional programming|design patterns)\b/g,
    /\b(sql server|no\s*sql|postgre\s*sql|my\s*sql|mongo\s*db)\b/g,
    /\b(power\s*bi|tab\s*leau|data\s*bricks|snow\s*flake)\b/g,
    /\b(type\s*script|java\s*script|python|golang|rust|kotlin|swift)\b/g,
  ];

  const phrases = new Set();
  for (const pattern of multiWordPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach((m) => phrases.add(m.trim().replace(/\s+/g, " ")));
    }
  }

  // 2. Extract single-word keywords (3+ chars, not stop words)
  const words = text
    .replace(/[^a-z0-9#+.\/\-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w))
    .filter((w) => !/^\d+$/.test(w)); // exclude pure numbers

  // Count frequency — higher freq = more important
  const freq = {};
  for (const word of words) {
    freq[word] = (freq[word] || 0) + 1;
  }

  // Sort by frequency (most mentioned first) and take meaningful ones
  const sortedWords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);

  // Combine phrases + single words, dedup
  const allKeywords = [...phrases];
  for (const word of sortedWords) {
    // Skip if word is already part of an extracted phrase
    const isPartOfPhrase = [...phrases].some((p) => p.includes(word));
    if (!isPartOfPhrase) {
      allKeywords.push(word);
    }
  }

  // Cap at 50 keywords max to keep highlighting readable
  return allKeywords.slice(0, 50);
}

/**
 * Collect all text content from a resume object into a single lowercase string.
 *
 * @param {Object} resume - The resume data object
 * @returns {string} - Concatenated lowercase text
 */
function collectResumeText(resume) {
  const parts = [];

  // Personal info
  const pi = resume.personalInfo || {};
  parts.push(pi.fullName, pi.jobTitle, pi.email, pi.location);

  // Summary
  parts.push(resume.summary);

  // Experience
  (resume.experience || []).forEach((exp) => {
    parts.push(exp.jobTitle, exp.company, exp.location, exp.description);
  });

  // Education
  (resume.education || []).forEach((edu) => {
    parts.push(edu.degree, edu.institution, edu.description, edu.field);
  });

  // Skills
  (resume.skills || []).forEach((s) => {
    parts.push(s.name, s.category);
  });

  // Projects
  (resume.projects || []).forEach((p) => {
    parts.push(p.title, p.description, p.technologies);
  });

  // Certifications
  (resume.certifications || []).forEach((c) => {
    parts.push(c.name, c.issuer);
  });

  // Languages
  (resume.languages || []).forEach((l) => {
    parts.push(l.language, l.proficiency);
  });

  // Awards
  (resume.awards || []).forEach((a) => {
    parts.push(a.title, a.issuer, a.description);
  });

  // Publications
  (resume.publications || []).forEach((p) => {
    parts.push(p.title, p.publisher, p.description);
  });

  // Organizations
  (resume.organizations || []).forEach((o) => {
    parts.push(o.name, o.role, o.description);
  });

  // Interests
  (resume.interests || []).forEach((i) => {
    parts.push(typeof i === "string" ? i : i.name);
  });

  // Custom sections
  (resume.customSections || []).forEach((sec) => {
    parts.push(sec.title);
    (sec.items || []).forEach((item) => {
      parts.push(item.title, item.subtitle, item.description);
    });
  });

  // Declaration
  if (resume.declaration) {
    parts.push(resume.declaration.statement);
  }

  // References
  (resume.references || []).forEach((r) => {
    parts.push(r.name, r.relationship, r.company);
  });

  return parts.filter(Boolean).join(" ").toLowerCase();
}

/**
 * Analyze a job description against a resume and return matched/missing keywords.
 *
 * @param {string} jobDescription - The job description text
 * @param {Object} resume - The resume data object
 * @returns {{ keywords: string[], matched: string[], missing: string[] }}
 */
export function analyzeKeywords(jobDescription, resume) {
  const keywords = extractKeywords(jobDescription);
  if (keywords.length === 0) return { keywords: [], matched: [], missing: [] };

  const resumeText = collectResumeText(resume);

  const matched = [];
  const missing = [];

  for (const kw of keywords) {
    if (resumeText.includes(kw)) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  }

  return { keywords, matched, missing };
}
