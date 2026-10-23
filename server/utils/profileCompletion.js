/**
 * Calculate user profile completion percentage and actionable missing items.
 * Designed to not penalize freshers who may not have full-time work experience.
 */
function calculateProfileCompletion(user) {
  if (!user) return { percentage: 0, breakdown: {}, missingSteps: [] };

  let personalScore = 0;
  const missingSteps = [];

  // 1. Personal Information (Max 20%)
  if (user.name && user.name.trim().length > 0) personalScore += 5;
  else missingSteps.push("Add your full name");

  if (user.bio && user.bio.trim().length > 0) personalScore += 5;
  else missingSteps.push("Write a professional bio");

  if (user.phone && user.phone.trim().length > 0) personalScore += 5;
  else missingSteps.push("Add a contact phone number");

  const hasLocation = user.location && (user.location.city || user.location.state || user.location.country);
  if (hasLocation) personalScore += 5;
  else missingSteps.push("Add your location details");

  // 2. Education (Max 20%)
  let educationScore = 0;
  const validEducation = Array.isArray(user.education) && user.education.some(
    (e) => e.institution && e.institution.trim() && e.degree && e.degree.trim()
  );
  if (validEducation) {
    educationScore = 20;
  } else {
    missingSteps.push("Add your education details");
  }

  // 3. Skills (Max 20%)
  let skillsScore = 0;
  const techCount = Array.isArray(user.technicalSkills) ? user.technicalSkills.filter(s => s && s.trim()).length : 0;
  const softCount = Array.isArray(user.softSkills) ? user.softSkills.filter(s => s && s.trim()).length : 0;

  if (techCount >= 2) skillsScore += 10;
  else if (techCount === 1) skillsScore += 5;
  else missingSteps.push("Add at least 2 technical skills");

  if (softCount >= 1) skillsScore += 10;
  else missingSteps.push("Add at least 1 soft skill");

  // 4. Projects (Max 20%)
  let projectsScore = 0;
  const validProjects = Array.isArray(user.projects) && user.projects.some(
    (p) => p.title && p.title.trim()
  );
  if (validProjects) {
    projectsScore = 20;
  } else {
    missingSteps.push("Add at least one project");
  }

  // 5. Career Preferences (Max 10%)
  let preferencesScore = 0;
  if (user.careerPreferences?.targetRole && user.careerPreferences.targetRole.trim().length > 0) {
    preferencesScore += 5;
  } else {
    missingSteps.push("Set your target career role");
  }

  if (
    (user.careerPreferences?.preferredDomain && user.careerPreferences.preferredDomain.trim().length > 0) ||
    (user.careerPreferences?.experienceLevel && user.careerPreferences.experienceLevel.trim().length > 0)
  ) {
    preferencesScore += 5;
  } else {
    missingSteps.push("Specify your preferred domain or experience level");
  }

  // 6. Practical Credentials (Max 10% - Certifications OR Experience OR Avatar)
  // Ensures freshers with no formal job experience can easily reach 100% via certifications or profile picture.
  let credentialScore = 0;
  const hasExperience = Array.isArray(user.experience) && user.experience.some(e => e.title && e.title.trim());
  const hasCertifications = Array.isArray(user.certifications) && user.certifications.some(c => c.name && c.name.trim());
  const hasAvatar = Boolean(user.avatar && user.avatar.trim().length > 0);

  if (hasExperience || hasCertifications || hasAvatar) {
    credentialScore = 10;
  } else {
    missingSteps.push("Add an internship/experience, certification, or profile photo");
  }

  const total = Math.min(100, personalScore + educationScore + skillsScore + projectsScore + preferencesScore + credentialScore);

  return {
    percentage: Math.round(total),
    breakdown: {
      personalInfo: personalScore, // max 20
      education: educationScore,   // max 20
      skills: skillsScore,         // max 20
      projects: projectsScore,     // max 20
      preferences: preferencesScore, // max 10
      credentials: credentialScore, // max 10
    },
    missingSteps,
  };
}

module.exports = { calculateProfileCompletion };
