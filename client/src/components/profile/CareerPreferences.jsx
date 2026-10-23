import { useState, useEffect } from "react";
import { Compass, Target, Building2, MapPin, Briefcase, Sparkles, Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";
import { updateProfile } from "../../services/profileService";

const COMMON_ROLES = [
  "Full Stack Developer", "Frontend Developer", "Backend Developer",
  "Software Engineer", "DevOps Engineer", "Data Scientist",
  "Machine Learning Engineer", "Cloud Engineer", "Mobile App Developer",
  "Product Manager", "QA / Test Automation Engineer"
];

const COMMON_DOMAINS = [
  "Web Development", "Artificial Intelligence & ML", "Cloud Computing & DevOps",
  "Cybersecurity", "Fintech & Banking", "Mobile Development (iOS/Android)",
  "Data Engineering", "HealthTech", "E-commerce"
];

function CareerPreferences({ user, onProfileUpdated }) {
  const [formData, setFormData] = useState({
    targetRole: "",
    preferredDomain: "",
    targetCompany: "",
    experienceLevel: "Fresher / Entry-level (0-1 yrs)",
    preferredLocation: "Remote / Hybrid",
    employmentType: "Full-time",
    targetSkills: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.careerPreferences) {
      const cp = user.careerPreferences;
      setFormData({
        targetRole: cp.targetRole || "",
        preferredDomain: cp.preferredDomain || "",
        targetCompany: cp.targetCompany || "",
        experienceLevel: cp.experienceLevel || "Fresher / Entry-level (0-1 yrs)",
        preferredLocation: cp.preferredLocation || "Remote / Hybrid",
        employmentType: cp.employmentType || "Full-time",
        targetSkills: Array.isArray(cp.targetSkills) ? cp.targetSkills.join(", ") : "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectRole = (role) => {
    setFormData((prev) => ({ ...prev, targetRole: role }));
  };

  const handleSelectDomain = (domain) => {
    setFormData((prev) => ({ ...prev, preferredDomain: domain }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const parsedSkills = formData.targetSkills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const payload = {
        careerPreferences: {
          targetRole: formData.targetRole.trim(),
          preferredDomain: formData.preferredDomain.trim(),
          targetCompany: formData.targetCompany.trim(),
          experienceLevel: formData.experienceLevel,
          preferredLocation: formData.preferredLocation.trim(),
          employmentType: formData.employmentType,
          targetSkills: parsedSkills,
        },
      };

      const res = await updateProfile(payload);
      toast.success("Career preferences saved successfully!");
      if (onProfileUpdated) onProfileUpdated(res.user, res.completion);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update career preferences.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm">
      <div className="flex items-center gap-3 pb-5 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white">
          <Compass size={19} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Career Preferences & Goals
          </h2>
          <p className="text-xs text-gray-500">
            Configure target job roles, preferred work environments, and career direction.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Target Job Role */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-gray-700">
              Target Job Role
            </label>
            <span className="text-[10px] text-gray-400">Used for AI interview tailoring</span>
          </div>
          <input
            type="text"
            name="targetRole"
            value={formData.targetRole}
            onChange={handleChange}
            placeholder="e.g. Full Stack Developer"
            className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
          />

          {/* Quick role suggestions */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {COMMON_ROLES.slice(0, 6).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleSelectRole(role)}
                className={`text-[10px] px-2.5 py-1 rounded-md transition ${
                  formData.targetRole.toLowerCase() === role.toLowerCase()
                    ? "bg-black text-white font-medium"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Domain */}
        <div>
          <label className="block mb-1.5 text-xs font-medium text-gray-700">
            Preferred Technical Domain / Industry
          </label>
          <input
            type="text"
            name="preferredDomain"
            value={formData.preferredDomain}
            onChange={handleChange}
            placeholder="e.g. Web Development / Cloud & DevOps"
            className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {COMMON_DOMAINS.slice(0, 5).map((domain) => (
              <button
                key={domain}
                type="button"
                onClick={() => handleSelectDomain(domain)}
                className={`text-[10px] px-2.5 py-1 rounded-md transition ${
                  formData.preferredDomain.toLowerCase() === domain.toLowerCase()
                    ? "bg-black text-white font-medium"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Experience Level */}
          <div>
            <label className="block mb-1.5 text-xs font-medium text-gray-700">
              Experience Level
            </label>
            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 px-2.5 text-xs text-gray-800 outline-none transition focus:bg-white focus:border-gray-400"
            >
              <option value="Fresher / Entry-level (0-1 yrs)">Fresher / Entry-level (0-1 yrs)</option>
              <option value="Junior (1-2 yrs)">Junior (1-2 yrs)</option>
              <option value="Mid-level (3-5 yrs)">Mid-level (3-5 yrs)</option>
              <option value="Senior (5+ yrs)">Senior (5+ yrs)</option>
              <option value="Lead / Architect (8+ yrs)">Lead / Architect (8+ yrs)</option>
            </select>
          </div>

          {/* Preferred Employment Type */}
          <div>
            <label className="block mb-1.5 text-xs font-medium text-gray-700">
              Preferred Employment Type
            </label>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 px-2.5 text-xs text-gray-800 outline-none transition focus:bg-white focus:border-gray-400"
            >
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract / Freelance">Contract / Freelance</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Target Company */}
          <div>
            <label className="block mb-1.5 text-xs font-medium text-gray-700">
              Target Companies (Optional)
            </label>
            <input
              type="text"
              name="targetCompany"
              value={formData.targetCompany}
              onChange={handleChange}
              placeholder="e.g. Google, Microsoft, Tech Startups"
              className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
            />
          </div>

          {/* Preferred Location */}
          <div>
            <label className="block mb-1.5 text-xs font-medium text-gray-700">
              Preferred Work Location
            </label>
            <input
              type="text"
              name="preferredLocation"
              value={formData.preferredLocation}
              onChange={handleChange}
              placeholder="e.g. Remote, Bengaluru, San Francisco"
              className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
            />
          </div>
        </div>

        {/* Target Skills to Learn */}
        <div>
          <label className="block mb-1.5 text-xs font-medium text-gray-700">
            Skills to Learn or Master Next (Comma-separated)
          </label>
          <input
            type="text"
            name="targetSkills"
            value={formData.targetSkills}
            onChange={handleChange}
            placeholder="e.g. System Design, Kubernetes, GraphQL, Next.js"
            className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-black text-white rounded-lg text-xs font-semibold hover:bg-gray-900 transition flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {loading ? "Saving Preferences..." : "Save Career Preferences"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CareerPreferences;
