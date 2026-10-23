import { useState } from "react";
import { Code2, Users, Plus, X, Loader2, Save, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { updateProfile } from "../../services/profileService";

const POPULAR_TECH_SKILLS = [
  "JavaScript", "React", "Node.js", "Python", "TypeScript",
  "HTML5 & CSS3", "MongoDB", "Express.js", "SQL", "Git & GitHub",
  "Tailwind CSS", "Docker", "RESTful APIs", "Next.js", "AWS"
];

const POPULAR_SOFT_SKILLS = [
  "Communication", "Problem Solving", "Teamwork & Collaboration",
  "Critical Thinking", "Adaptability", "Time Management",
  "Leadership", "Work Ethic", "Attention to Detail"
];

function SkillsSection({ user, onProfileUpdated }) {
  const [technicalSkills, setTechnicalSkills] = useState(user?.technicalSkills || []);
  const [softSkills, setSoftSkills] = useState(user?.softSkills || []);
  const [techInput, setTechInput] = useState("");
  const [softInput, setSoftInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync if user prop updates
  const syncFromUser = () => {
    setTechnicalSkills(user?.technicalSkills || []);
    setSoftSkills(user?.softSkills || []);
  };

  const handleAddTech = (skillToAdd) => {
    const val = (skillToAdd || techInput).trim();
    if (!val) return;

    const lower = val.toLowerCase();
    if (technicalSkills.some((s) => s.toLowerCase() === lower)) {
      toast.error(`"${val}" is already in your technical skills.`);
      return;
    }

    setTechnicalSkills([...technicalSkills, val]);
    setTechInput("");
  };

  const handleRemoveTech = (indexToRemove) => {
    setTechnicalSkills(technicalSkills.filter((_, i) => i !== indexToRemove));
  };

  const handleAddSoft = (skillToAdd) => {
    const val = (skillToAdd || softInput).trim();
    if (!val) return;

    const lower = val.toLowerCase();
    if (softSkills.some((s) => s.toLowerCase() === lower)) {
      toast.error(`"${val}" is already in your soft skills.`);
      return;
    }

    setSoftSkills([...softSkills, val]);
    setSoftInput("");
  };

  const handleRemoveSoft = (indexToRemove) => {
    setSoftSkills(softSkills.filter((_, i) => i !== indexToRemove));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await updateProfile({
        technicalSkills,
        softSkills,
      });
      toast.success("Skills updated successfully!");
      if (onProfileUpdated) onProfileUpdated(res.user, res.completion);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update skills.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-gray-100 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white">
            <Code2 size={19} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Technical & Soft Skills
            </h2>
            <p className="text-xs text-gray-500">
              Highlight your technical stack, programming competencies, and interpersonal skills.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:bg-gray-900 transition self-start sm:self-auto active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {loading ? "Saving..." : "Save Skills"}
        </button>
      </div>

      {/* 1. Technical Skills */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 size={16} className="text-gray-700" />
            <h3 className="text-sm font-semibold text-gray-900">
              Technical Skills
            </h3>
            <span className="text-xs font-medium text-gray-400">
              ({technicalSkills.length})
            </span>
          </div>
          <span className="text-[11px] text-gray-400">
            Press Enter or click Add
          </span>
        </div>

        {/* Input bar */}
        <div className="flex gap-2">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTech();
              }
            }}
            placeholder="Add a technical skill (e.g. React, PostgreSQL, Docker)..."
            className="flex-1 h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
          />
          <button
            type="button"
            onClick={() => handleAddTech()}
            className="px-4 h-9 bg-black text-white rounded-lg text-xs font-medium hover:bg-gray-900 transition flex items-center gap-1"
          >
            <Plus size={14} />
            Add
          </button>
        </div>

        {/* Badges */}
        <div className="min-h-12 p-3 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-wrap gap-2 items-center">
          {technicalSkills.length === 0 ? (
            <span className="text-xs text-gray-400 italic">
              No technical skills added yet. Add your programming languages, frameworks, or tools.
            </span>
          ) : (
            technicalSkills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-800 border border-gray-200 shadow-2xs group"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTech(index)}
                  className="text-gray-400 hover:text-red-500 rounded-full transition"
                  title={`Remove ${skill}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))
          )}
        </div>

        {/* Quick Suggestions */}
        <div>
          <p className="text-[11px] font-medium text-gray-500 mb-2 flex items-center gap-1">
            <Sparkles size={12} className="text-gray-400" />
            Quick suggestions:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_TECH_SKILLS.filter(
              (s) => !technicalSkills.some((ts) => ts.toLowerCase() === s.toLowerCase())
            ).slice(0, 8).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleAddTech(suggestion)}
                className="text-[11px] px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black transition"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* 2. Soft Skills */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-700" />
            <h3 className="text-sm font-semibold text-gray-900">
              Soft & Professional Skills
            </h3>
            <span className="text-xs font-medium text-gray-400">
              ({softSkills.length})
            </span>
          </div>
          <span className="text-[11px] text-gray-400">
            Press Enter or click Add
          </span>
        </div>

        {/* Input bar */}
        <div className="flex gap-2">
          <input
            type="text"
            value={softInput}
            onChange={(e) => setSoftInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSoft();
              }
            }}
            placeholder="Add a soft skill (e.g. Problem Solving, Leadership)..."
            className="flex-1 h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
          />
          <button
            type="button"
            onClick={() => handleAddSoft()}
            className="px-4 h-9 bg-black text-white rounded-lg text-xs font-medium hover:bg-gray-900 transition flex items-center gap-1"
          >
            <Plus size={14} />
            Add
          </button>
        </div>

        {/* Badges */}
        <div className="min-h-12 p-3 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-wrap gap-2 items-center">
          {softSkills.length === 0 ? (
            <span className="text-xs text-gray-400 italic">
              No soft skills added yet. Add interpersonal and behavioral qualities.
            </span>
          ) : (
            softSkills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-800 border border-gray-200 shadow-2xs group"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSoft(index)}
                  className="text-gray-400 hover:text-red-500 rounded-full transition"
                  title={`Remove ${skill}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))
          )}
        </div>

        {/* Quick Suggestions */}
        <div>
          <p className="text-[11px] font-medium text-gray-500 mb-2 flex items-center gap-1">
            <Sparkles size={12} className="text-gray-400" />
            Quick suggestions:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SOFT_SKILLS.filter(
              (s) => !softSkills.some((ss) => ss.toLowerCase() === s.toLowerCase())
            ).slice(0, 6).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleAddSoft(suggestion)}
                className="text-[11px] px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black transition"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillsSection;
