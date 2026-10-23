import React, { useState } from "react";
import { Plus, X, Sparkles, RefreshCw, Layers, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { useResume } from "../../../context/ResumeContext";
import { suggestSkills } from "../../../services/resumeService";

const PRESET_CATEGORIES = [
  "Languages",
  "Frameworks & Libraries",
  "Backend & Cloud",
  "Databases",
  "DevOps & Tools",
  "Soft Skills",
];

const PROFICIENCY_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

export function SkillsEditor() {
  const { resume, setResume } = useResume();
  const skills = resume.skills || [];
  const theme = resume.theme || {};
  const isCategorized = theme.skillGrouping === "categorized" || theme.groupSkillsByCategory;

  const [newSkill, setNewSkill] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Languages");
  const [selectedLevel, setSelectedLevel] = useState("Intermediate");
  const [customCategory, setCustomCategory] = useState("");
  const [isCustomCat, setIsCustomCat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendedSkills, setRecommendedSkills] = useState([]);

  const activeCategory = isCustomCat && customCategory.trim() ? customCategory.trim() : selectedCategory;

  const handleAddSkill = (skillName, categoryOverride) => {
    const name = skillName || newSkill.trim();
    if (!name) return;

    if (skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      toast.error("Skill already added!");
      return;
    }

    const newSkillObj = {
      id: `skill_${Date.now()}_${Math.random()}`,
      name: name,
      category: categoryOverride || activeCategory || "Technical",
      level: selectedLevel || "Intermediate",
    };

    setResume((prev) => ({ ...prev, skills: [...(prev.skills || []), newSkillObj] }));
    setRecommendedSkills((prev) => prev.filter((s) => s.toLowerCase() !== name.toLowerCase()));
    setNewSkill("");
  };

  const handleRemoveSkill = (id) => {
    setResume((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((s) => s.id !== id),
    }));
  };

  const handleUpdateSkillCategory = (id, newCat) => {
    setResume((prev) => ({
      ...prev,
      skills: (prev.skills || []).map((s) => (s.id === id ? { ...s, category: newCat } : s)),
    }));
  };

  const handleUpdateSkillLevel = (id, newLvl) => {
    setResume((prev) => ({
      ...prev,
      skills: (prev.skills || []).map((s) => (s.id === id ? { ...s, level: newLvl } : s)),
    }));
  };

  const toggleCategorizedMatrix = () => {
    const nextVal = !isCategorized;
    setResume((prev) => ({
      ...prev,
      theme: {
        ...(prev.theme || {}),
        skillGrouping: nextVal ? "categorized" : "flat",
        groupSkillsByCategory: nextVal,
      },
    }));
    toast.success(nextVal ? "Categorized Skills Matrix enabled!" : "Flat skill list enabled");
  };

  const handleGetSkillSuggestions = async () => {
    try {
      setLoading(true);
      const res = await suggestSkills(resume);
      if (res.data.success && res.data.suggestions) {
        setRecommendedSkills(res.data.suggestions);
        toast.success("AI skills recommendations ready!");
      }
    } catch (err) {
      toast.error("Failed to fetch skill suggestions");
    } finally {
      setLoading(false);
    }
  };

  // Group skills by category for preview
  const groupedSkills = {};
  skills.forEach((s) => {
    const cat = s.category && s.category.trim() ? s.category.trim() : "Other / Core";
    if (!groupedSkills[cat]) groupedSkills[cat] = [];
    groupedSkills[cat].push(s);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-200 pb-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>Skills & Competencies</span>
            {isCategorized && (
              <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Matrix Mode
              </span>
            )}
          </h2>
          <p className="text-xs text-gray-500">Add technical skills, tools, frameworks, and group into categories.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleCategorizedMatrix}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition cursor-pointer ${
              isCategorized
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
            }`}
            title="Toggle Grouped Skills Matrix on Resume"
          >
            <Layers size={13} />
            <span>{isCategorized ? "Matrix View: Active" : "Group by Category"}</span>
          </button>
          <button
            type="button"
            onClick={handleGetSkillSuggestions}
            disabled={loading}
            className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} />}
            <span>AI Suggest</span>
          </button>
        </div>
      </div>

      {/* Category & Level Selector for New Skill */}
      <div className="space-y-2 bg-gray-50 border border-gray-200 p-3.5 rounded-xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-gray-700">Assign to Category:</span>
          <button
            type="button"
            onClick={() => setIsCustomCat(!isCustomCat)}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition"
          >
            {isCustomCat ? "Choose from presets" : "+ Custom Category"}
          </button>
        </div>

        {isCustomCat ? (
          <input
            type="text"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="Type custom category (e.g. AI & Machine Learning, Mobile...)"
            className="w-full text-xs bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-gray-900 focus:border-black outline-none"
          />
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {PRESET_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition cursor-pointer font-medium ${
                  selectedCategory === cat
                    ? "bg-black text-white border-black font-semibold"
                    : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 pt-1 border-t border-gray-200/60 mt-2">
          <span className="text-[11px] font-medium text-gray-500">Proficiency:</span>
          <div className="flex gap-1">
            {PROFICIENCY_LEVELS.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={`text-[10.5px] px-2 py-0.5 rounded border transition cursor-pointer ${
                  selectedLevel === lvl
                    ? "bg-gray-800 text-white border-gray-800 font-semibold"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Box */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
          placeholder={`Add skill to "${activeCategory}" (e.g. React, PostgreSQL, Docker)...`}
          className="flex-1 rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none transition"
        />
        <button
          type="button"
          onClick={() => handleAddSkill()}
          className="bg-black hover:bg-gray-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer shrink-0"
        >
          Add Skill
        </button>
      </div>

      {/* Existing Skills */}
      <div>
        <div className="flex justify-between items-center mb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Existing Skills ({skills.length})
          </h3>
          {skills.length > 0 && (
            <span className="text-[11px] text-gray-500">
              {Object.keys(groupedSkills).length} {Object.keys(groupedSkills).length === 1 ? "category" : "categories"}
            </span>
          )}
        </div>

        {skills.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No skills added yet. Type above or click AI suggestions.</p>
        ) : isCategorized ? (
          /* Categorized Matrix Layout in Editor */
          <div className="space-y-4">
            {Object.keys(groupedSkills).map((catName) => (
              <div key={catName} className="border border-gray-200 bg-gray-50/50 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between border-b border-gray-200/80 pb-1.5">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-tight">{catName}</span>
                  <span className="text-[10.5px] font-medium text-gray-400">{groupedSkills[catName].length} skills</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {groupedSkills[catName].map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-900 pl-2.5 pr-1.5 py-1 rounded-lg text-xs font-semibold shadow-xs"
                    >
                      <span>{s.name}</span>
                      <select
                        value={s.level || "Intermediate"}
                        onChange={(e) => handleUpdateSkillLevel(s.id, e.target.value)}
                        className="text-[10px] font-normal text-gray-500 bg-gray-100 rounded px-1 py-0.5 border-none outline-none cursor-pointer"
                        title="Change proficiency level"
                      >
                        {PROFICIENCY_LEVELS.map((lvl) => (
                          <option key={lvl} value={lvl}>
                            {lvl}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s.id)}
                        className="text-gray-400 hover:text-red-600 transition p-0.5"
                        title="Delete skill"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Flat list layout */
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-gray-900 pl-2.5 pr-1.5 py-1 rounded-lg text-xs font-semibold shadow-xs"
              >
                <span>{s.name}</span>
                {s.category && (
                  <span className="text-[10px] text-gray-500 bg-gray-200/70 px-1.5 py-0.2 rounded font-normal">
                    {s.category}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(s.id)}
                  className="text-gray-400 hover:text-red-600 transition p-0.5"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Skills */}
      {recommendedSkills.length > 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-amber-50/30 border border-amber-200/70 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Recommended Skills for your Role
            </h3>
          </div>
          <p className="text-xs text-amber-700 mb-3">
            Click any skill below to add it to your resume under "{activeCategory}":
          </p>

          <div className="flex flex-wrap gap-2">
            {recommendedSkills.map((recSkill) => (
              <button
                key={recSkill}
                type="button"
                onClick={() => handleAddSkill(recSkill)}
                className="flex items-center gap-1 bg-white border border-amber-300 hover:border-amber-500 hover:bg-amber-50 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shadow-xs"
              >
                <Plus size={13} className="text-amber-600" />
                <span>{recSkill}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillsEditor;
