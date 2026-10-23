const User = require('../models/User');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { calculateProfileCompletion } = require('../utils/profileCompletion');
const { getUserCreditSummary } = require('../services/creditService');

/**
 * URL validation helper
 */
const isValidUrl = (str) => {
  if (!str || typeof str !== 'string') return true; // empty is allowed
  const trimmed = str.trim();
  if (trimmed === '') return true;
  try {
    const url = new URL(trimmed);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

/**
 * GET /api/profile
 * Retrieve current user's profile, completion metrics, and weekly credit allowance
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    const completion = calculateProfileCompletion(user);

    let credits = null;
    try {
      credits = await getUserCreditSummary(user._id);
    } catch (creditErr) {
      console.warn("Could not load credit summary for profile:", creditErr.message);
    }

    res.status(200).json({
      success: true,
      user,
      completion,
      credits,
    });
  } catch (error) {
    console.error('getProfile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile data',
    });
  }
};

/**
 * PUT /api/profile
 * Update allowed profile fields
 */
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    const {
      name,
      phone,
      location,
      bio,
      education,
      technicalSkills,
      softSkills,
      projects,
      certifications,
      experience,
      careerPreferences,
      avatar,
    } = req.body;

    // Validate name
    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Full name cannot be empty',
        });
      }
      user.name = name.trim();
    }

    // Phone
    if (phone !== undefined) {
      user.phone = typeof phone === 'string' ? phone.trim() : '';
    }

    // Location
    if (location && typeof location === 'object') {
      user.location = {
        city: typeof location.city === 'string' ? location.city.trim() : '',
        state: typeof location.state === 'string' ? location.state.trim() : '',
        country: typeof location.country === 'string' ? location.country.trim() : '',
      };
    }

    // Bio
    if (bio !== undefined) {
      user.bio = typeof bio === 'string' ? bio.trim() : '';
    }

    // Education
    if (education !== undefined) {
      if (!Array.isArray(education)) {
        return res.status(400).json({
          success: false,
          message: 'Education must be an array',
        });
      }

      for (let i = 0; i < education.length; i++) {
        const item = education[i];
        if (!item.institution || !item.institution.trim()) {
          return res.status(400).json({
            success: false,
            message: `Education #${i + 1}: Institution name is required`,
          });
        }
        if (!item.degree || !item.degree.trim()) {
          return res.status(400).json({
            success: false,
            message: `Education #${i + 1}: Degree is required`,
          });
        }
      }

      user.education = education.map((e) => ({
        institution: e.institution.trim(),
        degree: e.degree.trim(),
        fieldOfStudy: typeof e.fieldOfStudy === 'string' ? e.fieldOfStudy.trim() : '',
        graduationYear: typeof e.graduationYear === 'string' ? e.graduationYear.trim() : String(e.graduationYear || ''),
        status: e.status || 'Completed',
        grade: typeof e.grade === 'string' ? e.grade.trim() : String(e.grade || ''),
      }));
    }

    // Technical Skills
    if (technicalSkills !== undefined) {
      if (!Array.isArray(technicalSkills)) {
        return res.status(400).json({
          success: false,
          message: 'Technical skills must be an array',
        });
      }
      // Trim, lowercase deduplicate while preserving display case
      const seen = new Set();
      const cleanTech = [];
      for (const skill of technicalSkills) {
        if (typeof skill === 'string' && skill.trim()) {
          const lower = skill.trim().toLowerCase();
          if (!seen.has(lower)) {
            seen.add(lower);
            cleanTech.push(skill.trim());
          }
        }
      }
      user.technicalSkills = cleanTech;
    }

    // Soft Skills
    if (softSkills !== undefined) {
      if (!Array.isArray(softSkills)) {
        return res.status(400).json({
          success: false,
          message: 'Soft skills must be an array',
        });
      }
      const seen = new Set();
      const cleanSoft = [];
      for (const skill of softSkills) {
        if (typeof skill === 'string' && skill.trim()) {
          const lower = skill.trim().toLowerCase();
          if (!seen.has(lower)) {
            seen.add(lower);
            cleanSoft.push(skill.trim());
          }
        }
      }
      user.softSkills = cleanSoft;
    }

    // Projects
    if (projects !== undefined) {
      if (!Array.isArray(projects)) {
        return res.status(400).json({
          success: false,
          message: 'Projects must be an array',
        });
      }

      for (let i = 0; i < projects.length; i++) {
        const item = projects[i];
        if (!item.title || !item.title.trim()) {
          return res.status(400).json({
            success: false,
            message: `Project #${i + 1}: Project title is required`,
          });
        }
        if (item.liveUrl && !isValidUrl(item.liveUrl)) {
          return res.status(400).json({
            success: false,
            message: `Project #${i + 1}: Invalid Project URL format`,
          });
        }
        if (item.githubUrl && !isValidUrl(item.githubUrl)) {
          return res.status(400).json({
            success: false,
            message: `Project #${i + 1}: Invalid GitHub URL format`,
          });
        }
      }

      user.projects = projects.map((p) => ({
        title: p.title.trim(),
        description: typeof p.description === 'string' ? p.description.trim() : '',
        technologies: Array.isArray(p.technologies)
          ? p.technologies.filter((t) => typeof t === 'string' && t.trim()).map((t) => t.trim())
          : [],
        liveUrl: typeof p.liveUrl === 'string' ? p.liveUrl.trim() : '',
        githubUrl: typeof p.githubUrl === 'string' ? p.githubUrl.trim() : '',
        startDate: typeof p.startDate === 'string' ? p.startDate.trim() : '',
        endDate: typeof p.endDate === 'string' ? p.endDate.trim() : '',
        isCurrent: Boolean(p.isCurrent),
      }));
    }

    // Certifications
    if (certifications !== undefined) {
      if (!Array.isArray(certifications)) {
        return res.status(400).json({
          success: false,
          message: 'Certifications must be an array',
        });
      }

      for (let i = 0; i < certifications.length; i++) {
        const item = certifications[i];
        if (!item.name || !item.name.trim()) {
          return res.status(400).json({
            success: false,
            message: `Certification #${i + 1}: Certification name is required`,
          });
        }
        if (!item.issuer || !item.issuer.trim()) {
          return res.status(400).json({
            success: false,
            message: `Certification #${i + 1}: Issuing organization is required`,
          });
        }
        if (item.credentialUrl && !isValidUrl(item.credentialUrl)) {
          return res.status(400).json({
            success: false,
            message: `Certification #${i + 1}: Invalid credential URL format`,
          });
        }
      }

      user.certifications = certifications.map((c) => ({
        name: c.name.trim(),
        issuer: c.issuer.trim(),
        issueDate: typeof c.issueDate === 'string' ? c.issueDate.trim() : '',
        expiryDate: typeof c.expiryDate === 'string' ? c.expiryDate.trim() : '',
        credentialId: typeof c.credentialId === 'string' ? c.credentialId.trim() : '',
        credentialUrl: typeof c.credentialUrl === 'string' ? c.credentialUrl.trim() : '',
      }));
    }

    // Experience
    if (experience !== undefined) {
      if (!Array.isArray(experience)) {
        return res.status(400).json({
          success: false,
          message: 'Experience must be an array',
        });
      }

      for (let i = 0; i < experience.length; i++) {
        const item = experience[i];
        if (!item.title || !item.title.trim()) {
          return res.status(400).json({
            success: false,
            message: `Experience #${i + 1}: Job title is required`,
          });
        }
        if (!item.company || !item.company.trim()) {
          return res.status(400).json({
            success: false,
            message: `Experience #${i + 1}: Company name is required`,
          });
        }
      }

      user.experience = experience.map((exp) => ({
        title: exp.title.trim(),
        company: exp.company.trim(),
        employmentType: exp.employmentType || 'Full-time',
        startDate: typeof exp.startDate === 'string' ? exp.startDate.trim() : '',
        endDate: typeof exp.endDate === 'string' ? exp.endDate.trim() : '',
        isCurrent: Boolean(exp.isCurrent),
        description: typeof exp.description === 'string' ? exp.description.trim() : '',
        technologies: Array.isArray(exp.technologies)
          ? exp.technologies.filter((t) => typeof t === 'string' && t.trim()).map((t) => t.trim())
          : [],
      }));
    }

    // Career Preferences
    if (careerPreferences && typeof careerPreferences === 'object') {
      user.careerPreferences = {
        targetRole: typeof careerPreferences.targetRole === 'string' ? careerPreferences.targetRole.trim() : '',
        preferredDomain: typeof careerPreferences.preferredDomain === 'string' ? careerPreferences.preferredDomain.trim() : '',
        targetCompany: typeof careerPreferences.targetCompany === 'string' ? careerPreferences.targetCompany.trim() : '',
        experienceLevel: typeof careerPreferences.experienceLevel === 'string' ? careerPreferences.experienceLevel.trim() : '',
        preferredLocation: typeof careerPreferences.preferredLocation === 'string' ? careerPreferences.preferredLocation.trim() : '',
        employmentType: typeof careerPreferences.employmentType === 'string' ? careerPreferences.employmentType.trim() : '',
        targetSkills: Array.isArray(careerPreferences.targetSkills)
          ? careerPreferences.targetSkills.filter((s) => typeof s === 'string' && s.trim()).map((s) => s.trim())
          : [],
      };
    }

    // Avatar if provided as URL string
    if (avatar !== undefined && typeof avatar === 'string') {
      user.avatar = avatar.trim();
    }

    await user.save();

    const sanitizedUser = await User.findById(user._id).select('-password');
    const completion = calculateProfileCompletion(sanitizedUser);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: sanitizedUser,
      completion,
    });
  } catch (error) {
    console.error('updateProfile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
};

/**
 * POST /api/profile/avatar
 * Upload or update profile avatar
 */
const uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { image, avatarUrl } = req.body;

    if (avatarUrl && typeof avatarUrl === 'string') {
      if (!isValidUrl(avatarUrl)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid image URL',
        });
      }
      user.avatar = avatarUrl.trim();
      await user.save();

      const sanitizedUser = await User.findById(user._id).select('-password');
      return res.status(200).json({
        success: true,
        message: 'Profile picture updated successfully',
        avatar: user.avatar,
        user: sanitizedUser,
        completion: calculateProfileCompletion(sanitizedUser),
      });
    }

    if (!image || typeof image !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid image file or URL',
      });
    }

    // Match base64 data URL
    const matches = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image format. Expected JPEG, PNG, WEBP, or GIF.',
      });
    }

    const mimeExt = matches[1].toLowerCase();
    const allowedExts = ['jpeg', 'jpg', 'png', 'webp', 'gif'];
    const safeExt = mimeExt === 'jpeg' ? 'jpg' : mimeExt;

    if (!allowedExts.includes(safeExt)) {
      return res.status(400).json({
        success: false,
        message: 'Unsupported image type. Please upload JPG, PNG, WEBP, or GIF.',
      });
    }

    const buffer = Buffer.from(matches[2], 'base64');
    // Max 2.5MB
    if (buffer.length > 2.5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Image size exceeds maximum limit of 2.5MB',
      });
    }

    const uploadDir = path.join(__dirname, '..', 'uploads', 'avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `avatar_${user._id}_${Date.now()}.${safeExt}`;
    const filePath = path.join(uploadDir, filename);

    await fs.promises.writeFile(filePath, buffer);

    const relativeUrl = `/uploads/avatars/${filename}`;
    user.avatar = relativeUrl;
    await user.save();

    const sanitizedUser = await User.findById(user._id).select('-password');
    const completion = calculateProfileCompletion(sanitizedUser);

    res.status(200).json({
      success: true,
      message: 'Profile photo uploaded successfully',
      avatar: user.avatar,
      user: sanitizedUser,
      completion,
    });
  } catch (error) {
    console.error('uploadAvatar Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile picture',
    });
  }
};

/**
 * PUT /api/profile/change-password
 * Secure password change for authenticated users
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'This account was signed in with Google. Password change is not supported.',
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password does not match',
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('changePassword Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
};
