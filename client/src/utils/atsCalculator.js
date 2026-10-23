/**
 * Client-side heuristic calculation of ATS resume score and recommendations.
 * Used as an instant evaluator and fallback if network/auth issues occur.
 */
export function calculateClientATS(resumeData = {}) {
  let score = 50;
  const strengths = [];
  const weaknesses = [];
  const recommendations = [];

  // Personal Info Check
  if (resumeData.personalInfo?.fullName) score += 5;
  if (resumeData.personalInfo?.email) score += 5;
  if (resumeData.personalInfo?.phone) score += 5;
  if (resumeData.personalInfo?.linkedin) {
    score += 5;
    strengths.push("LinkedIn profile included for recruiter verification.");
  } else {
    weaknesses.push("Missing LinkedIn profile link.");
    recommendations.push("Add your LinkedIn URL to increase contact and verification options.");
  }

  // Summary Check
  if (resumeData.summary && resumeData.summary.length > 50) {
    score += 10;
    strengths.push("Professional summary present and descriptive.");
  } else {
    weaknesses.push("Summary section is empty or too brief.");
    recommendations.push("Add a 3-4 sentence professional summary highlighting your key background.");
  }

  // Experience Check
  if (resumeData.experience && resumeData.experience.length > 0) {
    score += 15;
    strengths.push(`Includes ${resumeData.experience.length} work experience entry/entries.`);
    const hasBullets = resumeData.experience.some(
      (e) => e.description?.includes("•") || e.description?.includes("-") || e.description?.includes("*")
    );
    if (hasBullets) {
      score += 5;
      strengths.push("Action-oriented bullet points used in experience descriptions.");
    } else {
      recommendations.push("Format work experience descriptions using bullet points (e.g. • Developed...).");
    }
  } else {
    weaknesses.push("No work experience added yet.");
    recommendations.push("Add relevant work, internship, freelance, or leadership experience.");
  }

  // Education Check
  if (resumeData.education && resumeData.education.length > 0) {
    score += 10;
    strengths.push("Education background clearly documented.");
  } else {
    weaknesses.push("Missing education details.");
    recommendations.push("Add your degree, field of study, and institution details.");
  }

  // Skills Check
  if (resumeData.skills && resumeData.skills.length >= 5) {
    score += 10;
    strengths.push(`Strong skills section with ${resumeData.skills.length} skills listed.`);
  } else {
    weaknesses.push("Skills section has fewer than 5 items.");
    recommendations.push("List at least 6-8 core technical and job-specific skills.");
  }

  // Projects Check
  if (resumeData.projects && resumeData.projects.length > 0) {
    score += 10;
    strengths.push("Projects section included to demonstrate practical applications.");
  } else {
    recommendations.push("Add key technical or practical projects to highlight tangible accomplishments.");
  }

  const finalScore = Math.min(Math.max(score, 40), 98);

  return {
    success: true,
    atsScore: finalScore,
    strengths,
    weaknesses,
    recommendations,
    missingKeywords: ["CI/CD", "System Architecture", "Performance Optimization", "Agile/Scrum"],
    formattingIssues: [
      "Ensure font sizes are consistent (10-12pt for body text).",
      "Keep section headers bold and standardized for ATS parsers.",
    ],
  };
}
