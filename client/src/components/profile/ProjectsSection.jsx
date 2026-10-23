import { useState } from "react";
import { FolderGit2, Plus, Trash2, Edit3, Loader2, X, ExternalLink, GitBranch, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { updateProfile } from "../../services/profileService";

function ProjectsSection({ user, onProfileUpdated }) {
  const projectsList = user?.projects || [];
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    technologies: "",
    liveUrl: "",
    githubUrl: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
  });
  const [errors, setErrors] = useState({});

  const handleOpenAdd = () => {
    setForm({
      title: "",
      description: "",
      technologies: "",
      liveUrl: "",
      githubUrl: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
    });
    setErrors({});
    setEditingIndex(null);
    setIsEditing(true);
  };

  const handleOpenEdit = (index) => {
    const item = projectsList[index];
    setForm({
      title: item.title || "",
      description: item.description || "",
      technologies: Array.isArray(item.technologies) ? item.technologies.join(", ") : "",
      liveUrl: item.liveUrl || "",
      githubUrl: item.githubUrl || "",
      startDate: item.startDate || "",
      endDate: item.endDate || "",
      isCurrent: Boolean(item.isCurrent),
    });
    setErrors({});
    setEditingIndex(index);
    setIsEditing(true);
  };

  const handleClose = () => {
    setIsEditing(false);
    setEditingIndex(null);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Project title is required.";

    const urlRegex = /^https?:\/\/.+/i;
    if (form.liveUrl.trim() && !urlRegex.test(form.liveUrl.trim())) {
      errs.liveUrl = "Please enter a valid URL starting with http:// or https://";
    }
    if (form.githubUrl.trim() && !urlRegex.test(form.githubUrl.trim())) {
      errs.githubUrl = "Please enter a valid GitHub URL starting with http:// or https://";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const updatedList = [...projectsList];
      const parsedTech = form.technologies
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const entryData = {
        title: form.title.trim(),
        description: form.description.trim(),
        technologies: parsedTech,
        liveUrl: form.liveUrl.trim(),
        githubUrl: form.githubUrl.trim(),
        startDate: form.startDate.trim(),
        endDate: form.isCurrent ? "" : form.endDate.trim(),
        isCurrent: form.isCurrent,
      };

      if (editingIndex !== null) {
        updatedList[editingIndex] = entryData;
      } else {
        updatedList.push(entryData);
      }

      const res = await updateProfile({ projects: updatedList });
      toast.success(editingIndex !== null ? "Project updated!" : "Project added!");
      if (onProfileUpdated) onProfileUpdated(res.user, res.completion);
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save project.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    setLoading(true);
    try {
      const updatedList = projectsList.filter((_, i) => i !== index);
      const res = await updateProfile({ projects: updatedList });
      toast.success("Project removed.");
      if (onProfileUpdated) onProfileUpdated(res.user, res.completion);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-gray-100 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white">
            <FolderGit2 size={19} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Projects & Portfolios
            </h2>
            <p className="text-xs text-gray-500">
              Showcase technical projects, repositories, live URLs, and tools used.
            </p>
          </div>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:bg-gray-900 transition self-start sm:self-auto active:scale-95"
          >
            <Plus size={14} />
            Add Project
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="my-6 p-5 bg-gray-50/70 border border-gray-200 rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              {editingIndex !== null ? "Edit Project" : "New Project"}
            </h3>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-700 p-1"
            >
              <X size={16} />
            </button>
          </div>

          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. AI-Powered Resume Analyzer"
              className={`w-full h-9 rounded-lg border ${
                errors.title ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white"
              } px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-gray-400`}
            />
            {errors.title && (
              <p className="mt-1 text-[11px] text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              placeholder="What problem does this project solve? What were key accomplishments and architecture?"
              className="w-full rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-gray-400 resize-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Technologies Used (Comma-separated)
            </label>
            <input
              type="text"
              name="technologies"
              value={form.technologies}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, Express, MongoDB, Tailwind CSS"
              className="w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">
                Live Demo URL (optional)
              </label>
              <input
                type="url"
                name="liveUrl"
                value={form.liveUrl}
                onChange={handleChange}
                placeholder="https://myproject.com"
                className={`w-full h-9 rounded-lg border ${
                  errors.liveUrl ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white"
                } px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-gray-400`}
              />
              {errors.liveUrl && (
                <p className="mt-1 text-[11px] text-red-500">{errors.liveUrl}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">
                GitHub Repository URL (optional)
              </label>
              <input
                type="url"
                name="githubUrl"
                value={form.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/username/repo"
                className={`w-full h-9 rounded-lg border ${
                  errors.githubUrl ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white"
                } px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-gray-400`}
              />
              {errors.githubUrl && (
                <p className="mt-1 text-[11px] text-red-500">{errors.githubUrl}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">
                Start Date (optional)
              </label>
              <input
                type="text"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                placeholder="e.g. Jan 2024"
                className="w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-gray-400"
              />
            </div>

            {!form.isCurrent && (
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700">
                  End Date (optional)
                </label>
                <input
                  type="text"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  placeholder="e.g. May 2024"
                  className="w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-gray-400"
                />
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="isCurrent"
                  checked={form.isCurrent}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-black focus:ring-black"
                />
                Currently working on this project
              </label>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:bg-gray-900 transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              {loading && <Loader2 size={13} className="animate-spin" />}
              {loading ? "Saving..." : "Save Project"}
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      <div className="mt-5 space-y-3">
        {projectsList.length === 0 ? (
          <div className="text-center py-10 px-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <FolderGit2 size={28} className="mx-auto text-gray-400 mb-2" />
            <h4 className="text-xs font-semibold text-gray-700">No projects added yet</h4>
            <p className="text-[11px] text-gray-500 mt-1 max-w-sm mx-auto">
              Showcasing practical projects significantly strengthens your profile and gives recruiters real proof of skills.
            </p>
          </div>
        ) : (
          projectsList.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition bg-white space-y-2.5 shadow-2xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-900">
                      {item.title}
                    </h4>
                    {item.isCurrent && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black text-white">
                        In Progress
                      </span>
                    )}
                  </div>

                  {(item.startDate || item.endDate) && (
                    <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <Calendar size={12} />
                      {item.startDate} {item.endDate ? `- ${item.endDate}` : item.isCurrent ? "- Present" : ""}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start">
                  {item.liveUrl && (
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition flex items-center gap-1 text-[11px]"
                      title="Live Demo"
                    >
                      <ExternalLink size={14} />
                      <span className="hidden sm:inline">Demo</span>
                    </a>
                  )}

                  {item.githubUrl && (
                    <a
                      href={item.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition flex items-center gap-1 text-[11px]"
                      title="GitHub Repository"
                    >
                      <GitBranch size={14} />
                      <span className="hidden sm:inline">Code</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(idx)}
                    disabled={loading}
                    className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition"
                    title="Edit project"
                  >
                    <Edit3 size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(idx)}
                    disabled={loading}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                    title="Delete project"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {item.description && (
                <p className="text-xs text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              )}

              {Array.isArray(item.technologies) && item.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.technologies.map((t, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProjectsSection;
