import React, { useState } from "react";
import { Plus, Trash2, Sparkles, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import { useResume } from "../../../context/ResumeContext";
import InputField from "../../auth/InputField";
import { improveExperience } from "../../../services/resumeService";
import BulletPointAssistant from "./BulletPointAssistant";

export function ExperienceEditor() {
  const { resume, setResume } = useResume();
  const experience = resume.experience || [];
  const [expandedId, setExpandedId] = useState(experience[0]?.id || null);
  const [loadingId, setLoadingId] = useState(null);

  const handleAdd = () => {
    const newId = `exp_${Date.now()}`;
    const newExp = {
      id: newId,
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      description: "",
    };
    setResume((prev) => ({ ...prev, experience: [...(prev.experience || []), newExp] }));
    setExpandedId(newId);
  };

  const handleUpdate = (id, field, value) => {
    setResume((prev) => ({
      ...prev,
      experience: (prev.experience || []).map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const handleDelete = (id) => {
    setResume((prev) => ({
      ...prev,
      experience: (prev.experience || []).filter((exp) => exp.id !== id),
    }));
  };

  const handleAIImprove = async (exp) => {
    if (!exp.description) {
      toast.error("Please add a description to improve.");
      return;
    }
    try {
      setLoadingId(exp.id);
      const res = await improveExperience(exp.description);
      if (res.data.success && res.data.result) {
        handleUpdate(exp.id, "description", res.data.result);
        toast.success("Experience description improved with action bullets!");
      }
    } catch (err) {
      toast.error("AI improvement failed");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Work Experience</h2>
          <p className="text-xs text-gray-500">List your professional work history starting from your most recent role.</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Experience</span>
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
          <p className="text-sm text-gray-500 font-medium">No work experience entries added yet.</p>
          <button
            onClick={handleAdd}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-black hover:underline cursor-pointer"
          >
            <Plus size={14} /> Add your first experience
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {experience.map((exp, index) => {
            const isExpanded = expandedId === exp.id;
            return (
              <div
                key={exp.id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm transition"
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                >
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {exp.jobTitle || `Experience #${index + 1}`}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {exp.company ? `${exp.company} • ` : ""}{exp.startDate || "Date"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(exp.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 rounded transition"
                      title="Delete Entry"
                    >
                      <Trash2 size={16} />
                    </button>
                    {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        name="jobTitle"
                        label="Job Title"
                        placeholder="e.g. Senior Software Engineer"
                        value={exp.jobTitle}
                        onChange={(e) => handleUpdate(exp.id, "jobTitle", e.target.value)}
                      />

                      <InputField
                        name="company"
                        label="Company / Organization"
                        placeholder="e.g. Google / Acme Corp"
                        value={exp.company}
                        onChange={(e) => handleUpdate(exp.id, "company", e.target.value)}
                      />

                      <InputField
                        name="location"
                        label="Location"
                        placeholder="e.g. New York, NY (Remote)"
                        value={exp.location}
                        onChange={(e) => handleUpdate(exp.id, "location", e.target.value)}
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <InputField
                          name="startDate"
                          label="Start Date"
                          placeholder="e.g. Jan 2022"
                          value={exp.startDate}
                          onChange={(e) => handleUpdate(exp.id, "startDate", e.target.value)}
                        />

                        <InputField
                          name="endDate"
                          label="End Date"
                          placeholder="e.g. Present"
                          disabled={exp.currentlyWorking}
                          value={exp.currentlyWorking ? "Present" : exp.endDate}
                          onChange={(e) => handleUpdate(exp.id, "endDate", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`current_${exp.id}`}
                        checked={exp.currentlyWorking}
                        onChange={(e) => handleUpdate(exp.id, "currentlyWorking", e.target.checked)}
                        className="rounded border-gray-300 text-black focus:ring-black"
                      />
                      <label htmlFor={`current_${exp.id}`} className="text-xs text-gray-700 font-medium cursor-pointer">
                        I currently work here
                      </label>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-gray-700">
                          Description & Key Achievements
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAIImprove(exp)}
                          disabled={loadingId === exp.id}
                          className="flex items-center gap-1 text-xs text-black hover:underline font-bold"
                        >
                          {loadingId === exp.id ? (
                            <RefreshCw size={12} className="animate-spin" />
                          ) : (
                            <Sparkles size={12} />
                          )}
                          <span>Improve All (AI Bullets)</span>
                        </button>
                      </div>

                      <BulletPointAssistant
                        value={exp.description}
                        onChange={(val) => handleUpdate(exp.id, "description", val)}
                        placeholder="• Spearheaded backend architecture optimization reducing API latency by 35%...&#10;• Led a team of 4 engineers delivering microservices..."
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ExperienceEditor;
