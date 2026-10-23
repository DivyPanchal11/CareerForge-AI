import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach Authorization Token to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Resume CRUD
export const getResumes = () => API.get("/resumes");
export const getResumeById = (id) => API.get(`/resumes/${id}`);
export const createResume = (data) => API.post("/resumes", data);
export const updateResume = (id, data) => API.put(`/resumes/${id}`, data);
export const deleteResume = (id) => API.delete(`/resumes/${id}`);
export const duplicateResume = (id) => API.post(`/resumes/${id}/duplicate`);

// AI Resume Tools
export const generateSummary = (resumeData) => API.post("/ai/resume/summary", { resumeData });
export const improveWriting = (text, context) => API.post("/ai/resume/improve", { text, context });
export const improveExperience = (description) => API.post("/ai/resume/improve-experience", { description });
export const improveProject = (description) => API.post("/ai/resume/improve-project", { description });
export const checkGrammar = (text) => API.post("/ai/resume/grammar", { text });
export const suggestSkills = (resumeData) => API.post("/ai/resume/skills", { resumeData });
export const analyzeATS = (resumeData) => API.post("/ai/resume/ats", { resumeData });
export const matchJobDescription = (resumeData, jobDescription) => API.post("/ai/resume/job-match", { resumeData, jobDescription });
export const polishBulletPoint = (bullet, mode) => API.post("/ai/resume/polish-bullet", { bullet, mode });
export const tailorResumeForJob = (resumeData, jobDescription, companyName, jobUrl) =>
  API.post("/ai/resume/tailor-job", { resumeData, jobDescription, companyName, jobUrl });
export const forkAndTailorResume = (resumeId, jobDescription, companyName, jobUrl) =>
  API.post("/ai/resume/fork-tailor", { resumeId, jobDescription, companyName, jobUrl });
export const generateInterviewPrepKit = (resumeData) => API.post("/ai/resume/interview-prep", { resumeData });
export const generateCoverLetter = (resumeData, jobDescription, companyName, tone) =>
  API.post("/ai/resume/cover-letter", { resumeData, jobDescription, companyName, tone });

// Public Sharing & Analytics
export const getPublicResume = (id) => API.get(`/resumes/public/${id}`);
export const trackPublicDownload = (id) => API.post(`/resumes/public/${id}/track-download`);
export const togglePublicStatus = (id, isPublic) => API.put(`/resumes/${id}/share`, { isPublic });
export const getResumeAnalytics = (id) => API.get(`/resumes/${id}/analytics`);
