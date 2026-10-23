import { useState } from "react";
import { Briefcase, Plus, Trash2, Edit3, Loader2, X, Calendar, Building, Info } from "lucide-react";
import toast from "react-hot-toast";
import { updateProfile } from "../../services/profileService";

function ExperienceSection({ user, onProfileUpdated }) {
  const experienceList = user?.experience || [];
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    company: "",
    employmentType: "Full-time",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
    technologies: "",
  });
  const [errors, setErrors] = useState({});

  const handleOpenAdd = () => {
    setForm({
      title: "",
      company: "",
      employmentType: "Full-time",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
      technologies: "",
    });
    setErrors({});
    setEditingIndex(null);
    setIsEditing(true);
  };

  const handleOpenEdit = (index) => {
    const item = experienceList[index];
    setForm({
      title: item.title || "",
      company: item.company || "",
      employmentType: item.employmentType || "Full-time",
      startDate: item.startDate || "",
      endDate: item.endDate || "",
      isCurrent: Boolean(item.isCurrent),
      description: item.description || "",
      technologies: Array.isArray(item.technologies) ? item.technologies.join(", ") : "",
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
    if (!form.title.trim()) errs.title = "Job title is required.";
    if (!form.company.trim()) errs.company = "Company name is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const updatedList = [...experienceList];
      const parsedTech = form.technologies
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const entryData = {
        title: form.title.trim(),
        company: form.company.trim(),
        employmentType: form.employmentType,
        startDate: form.startDate.trim(),
        endDate: form.isCurrent ? "" : form.endDate.trim(),
        isCurrent: form.isCurrent,
        description: form.description.trim(),
        technologies: parsedTech,
      };

      if (editingIndex !== null) {
        updatedList[editingIndex] = entryData;
      } else {
        updatedList.push(entryData);
      }

      const res = await updateProfile({ experience: updatedList });
      toast.success(editingIndex !== null ? "Experience updated!" : "Experience added!");
      if (onProfileUpdated) onProfileUpdated(res.user, res.completion);
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save experience.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Are you sure you want to remove this experience?")) return;

    setLoading(true);
    try {
      const updatedList = experienceList.filter((_, i) => i !== index);
      const res = await updateProfile({ experience: updatedList });
      toast.success("Experience entry removed.");
      if (onProfileUpdated) onProfileUpdated(res.user, res.completion);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete experience.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-gray-100 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white">
            <Briefcase size={19} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Work & Internship Experience
            </h2>
            <p className="text-xs text-gray-500">
              Detail your professional history, company roles, internships, or freelance work.
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
            Add Experience
          </button>
        )}
      </div>

      {/* Fresher note */}
      <div className="mt-4 p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-start gap-2.5 text-xs text-gray-600">
        <Info size={16} className="text-gray-400 shrink-0 mt-0.5" />
        <span>
          <strong>For Freshers & Students:</strong> Formal job experience is completely optional. Highlighting your personal projects and certifications enables you to reach 100% profile completion.
        </span>
      </div>

      {/* Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="my-6 p-5 bg-gray-50/70 border border-gray-200 rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              {editingIndex !== null ? "Edit Experience Entry" : "New Experience Entry"}
            </h3>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-700 p-1"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Software Engineer Intern / Frontend Developer"
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
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="e.g. Acme Corp / Google"
                className={`w-full h-9 rounded-lg border ${
                  errors.company ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white"
                } px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-gray-400`}
              />
              {errors.company && (
                <p className="mt-1 text-[11px] text-red-500">{errors.company}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">
                Employment Type
              </label>
              <select
                name="employmentType"
                value={form.employmentType}
                onChange={handleChange}
                className="w-full h-9 rounded-lg border border-gray-200 bg-white px-2.5 text-xs text-gray-800 outline-none transition focus:border-gray-400"
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">
                Start Date (e.g. Jun 2023)
              </label>
              <input
                type="text"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                placeholder="e.g. June 2023"
                className="w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-gray-400"
              />
            </div>

            {!form.isCurrent ? (
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="text"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  placeholder="e.g. Dec 2023"
                  className="w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-gray-400"
                />
              </div>
            ) : (
              <div className="h-9 flex items-center text-xs font-medium text-gray-600">
                Present
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="isCurrent"
                checked={form.isCurrent}
                onChange={handleChange}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              I am currently working in this role
            </label>
          </div>

          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Role Description & Key Accomplishments
            </label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your core responsibilities, key features developed, and quantitative outcomes..."
              className="w-full rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-gray-400 resize-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Technologies / Tools (Comma-separated)
            </label>
            <input
              type="text"
              name="technologies"
              value={form.technologies}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, GraphQL, PostgreSQL"
              className="w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-gray-400"
            />
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
              {loading ? "Saving..." : "Save Experience"}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="mt-5 space-y-3">
        {experienceList.length === 0 ? (
          <div className="text-center py-10 px-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <Briefcase size={28} className="mx-auto text-gray-400 mb-2" />
            <h4 className="text-xs font-semibold text-gray-700">No experience added yet</h4>
            <p className="text-[11px] text-gray-500 mt-1 max-w-sm mx-auto">
              If you have completed internships, co-ops, or prior positions, add them here to highlight your professional track record.
            </p>
          </div>
        ) : (
          experienceList.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition bg-white space-y-2 shadow-2xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-900">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                      {item.employmentType || "Full-time"}
                    </span>
                    {item.isCurrent && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black text-white">
                        Current
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-medium text-gray-700 flex items-center gap-1.5 mt-0.5">
                    <Building size={13} className="text-gray-400" />
                    {item.company}
                  </p>

                  {(item.startDate || item.endDate) && (
                    <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <Calendar size={12} />
                      {item.startDate} {item.endDate ? `- ${item.endDate}` : item.isCurrent ? "- Present" : ""}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-start">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(idx)}
                    disabled={loading}
                    className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition"
                    title="Edit entry"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(idx)}
                    disabled={loading}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                    title="Remove entry"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {item.description && (
                <p className="text-xs text-gray-600 leading-relaxed pt-1">
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

export default ExperienceSection;
