const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: function () {
                return !this.googleId;
            },
            minlength: [6, 'Password must be at least 6 characters long'],
        },
        googleId: {
            type: String,
            default: null,
        },
        avatar: {
            type: String,
            default: '',
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        resetPasswordToken: {
            type: String,
            default: null,
        },
        resetPasswordExpire: {
            type: Date,
            default: null,
        },
        phone: {
            type: String,
            default: '',
            trim: true,
        },
        location: {
            city: { type: String, default: '', trim: true },
            state: { type: String, default: '', trim: true },
            country: { type: String, default: '', trim: true },
        },
        bio: {
            type: String,
            default: '',
            trim: true,
        },
        education: [
            {
                institution: { type: String, required: true, trim: true },
                degree: { type: String, required: true, trim: true },
                fieldOfStudy: { type: String, default: '', trim: true },
                graduationYear: { type: String, default: '', trim: true },
                status: { type: String, default: 'Completed', trim: true },
                grade: { type: String, default: '', trim: true },
            }
        ],
        technicalSkills: [
            { type: String, trim: true }
        ],
        softSkills: [
            { type: String, trim: true }
        ],
        projects: [
            {
                title: { type: String, required: true, trim: true },
                description: { type: String, default: '', trim: true },
                technologies: [{ type: String, trim: true }],
                liveUrl: { type: String, default: '', trim: true },
                githubUrl: { type: String, default: '', trim: true },
                startDate: { type: String, default: '', trim: true },
                endDate: { type: String, default: '', trim: true },
                isCurrent: { type: Boolean, default: false },
            }
        ],
        certifications: [
            {
                name: { type: String, required: true, trim: true },
                issuer: { type: String, required: true, trim: true },
                issueDate: { type: String, default: '', trim: true },
                expiryDate: { type: String, default: '', trim: true },
                credentialId: { type: String, default: '', trim: true },
                credentialUrl: { type: String, default: '', trim: true },
            }
        ],
        experience: [
            {
                title: { type: String, required: true, trim: true },
                company: { type: String, required: true, trim: true },
                employmentType: { type: String, default: 'Full-time', trim: true },
                startDate: { type: String, default: '', trim: true },
                endDate: { type: String, default: '', trim: true },
                isCurrent: { type: Boolean, default: false },
                description: { type: String, default: '', trim: true },
                technologies: [{ type: String, trim: true }],
            }
        ],
        careerPreferences: {
            targetRole: { type: String, default: '', trim: true },
            preferredDomain: { type: String, default: '', trim: true },
            targetCompany: { type: String, default: '', trim: true },
            experienceLevel: { type: String, default: '', trim: true },
            preferredLocation: { type: String, default: '', trim: true },
            employmentType: { type: String, default: '', trim: true },
            targetSkills: [{ type: String, trim: true }],
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);