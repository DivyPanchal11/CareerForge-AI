import React, { useState } from "react";
import { Plus, Trash2, Sparkles, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import { useResume } from "../../../context/ResumeContext";
import InputField from "../../auth/InputField";
import { improveProject } from "../../../services/resumeService";
import BulletPointAssistant from "./BulletPointAssistant";

export function ProjectsEditor() {
  const { resume, setResume } = useResume();
  const projects = resume.projects || [];
  const [expandedId, setExpandedId] = useState(projects[0]?.id || null);
  const [loadingId, setLoadingId] = useState(null);

  const handleAdd = () => {
    const newId = `proj_${Date.now()}`;
    const newProj = {
      id: newId,
      title: "",
      description: "",
      technologies: "",
      projectLink: "",
      githubLink: "",
      startDate: "",
      endDate: "",
    };
    setResume((prev) => ({ ...prev, projects: [...(prev.projects || []), newProj] }));
    setExpandedId(newId);
  };

  const handleUpdate = (id, field, value) => {
    setResume((prev) => ({
      ...prev,
      projects: (prev.projects || []).map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    }));
  };

  const handleDelete = (id) => {
    setResume((prev) => ({
      ...prev,
      projects: (prev.projects || []).filter((proj) => proj.id !== id),
    }));
  };

  const handleAIImprove = async (proj) => {
    if (!proj.description) {
      toast.error("Please add a project description to improve.");
      return;
    }
    try {
      setLoadingId(proj.id);
      const res = await improveProject(proj.description);
      if (res.data.success && res.data.result) {
        handleUpdate(proj.id, "description", res.data.result);
        toast.success("Project description improved with technical impact!");
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
          <h2 className="text-lg font-bold text-gray-900">Projects</h2>
          <p className="text-xs text-gray-500">Showcase software, research, or personal projects.</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
          <p className="text-sm text-gray-500 font-medium">No projects added yet.</p>
          <button
            onClick={handleAdd}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-black hover:underline cursor-pointer"
          >
            <Plus size={14} /> Add a project
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((proj, index) => {
            const isExpanded = expandedId === proj.id;
            return (
              <div key={proj.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : proj.id)}
                >
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {proj.title || `Project #${index + 1}`}
                    </h3>
                    <p className="text-xs text-gray-500">{proj.technologies || "Technologies"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(proj.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
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
                        name="title"
                        label="Project Title"
                        placeholder="e.g. CareerForge AI Platform"
                        value={proj.title}
                        onChange={(e) => handleUpdate(proj.id, "title", e.target.value)}
                      />

                      <InputField
                        name="technologies"
                        label="Technologies Used"
                        placeholder="e.g. React, Node.js, MongoDB, Tailwind"
                        value={proj.technologies}
                        onChange={(e) => handleUpdate(proj.id, "technologies", e.target.value)}
                      />

                      <InputField
                        name="projectLink"
                        label="Live Demo Link"
                        placeholder="https://myproject.com"
                        value={proj.projectLink}
                        onChange={(e) => handleUpdate(proj.id, "projectLink", e.target.value)}
                      />

                      <InputField
                        name="githubLink"
                        label="GitHub Code Link"
                        placeholder="https://github.com/user/project"
                        value={proj.githubLink}
                        onChange={(e) => handleUpdate(proj.id, "githubLink", e.target.value)}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-gray-700">Project Description & Achievements</label>
                        <button
                          type="button"
                          onClick={() => handleAIImprove(proj)}
                          disabled={loadingId === proj.id}
                          className="flex items-center gap-1 text-xs text-black hover:underline font-bold"
                        >
                          {loadingId === proj.id ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                          <span>Improve All (AI)</span>
                        </button>
                      </div>

                      <BulletPointAssistant
                        value={proj.description}
                        onChange={(val) => handleUpdate(proj.id, "description", val)}
                        placeholder="• Architected full-stack web application featuring real-time state synchronization...&#10;• Implemented JWT authentication..."
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

export default ProjectsEditor;
