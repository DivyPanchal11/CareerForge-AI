import { useState } from "react";
import { GraduationCap, Plus, Trash2, Edit3, Loader2, X, Check, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { updateProfile } from "../../services/profileService";

function EducationInfo({ user, onProfileUpdated }) {
  const educationList = user?.education || [];
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    graduationYear: "",
    status: "Completed",
    grade: "",
  });
  const [errors, setErrors] = useState({});

  const handleOpenAdd = () => {
    setForm({
      institution: "",
      degree: "",
      fieldOfStudy: "",
      graduationYear: "",
      status: "Completed",
      grade: "",
    });
    setErrors({});
    setEditingIndex(null);
    setIsEditing(true);
  };

  const handleOpenEdit = (index) => {
    const item = educationList[index];
    setForm({
      institution: item.institution || "",
      degree: item.degree || "",
      fieldOfStudy: item.fieldOfStudy || "",
      graduationYear: item.graduationYear || "",
      status: item.status || "Completed",
      grade: item.grade || "",
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
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.institution.trim()) errs.institution = "Institution name is required.";
    if (!form.degree.trim()) errs.degree = "Degree is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const updatedList = [...educationList];
      const entryData = {
        institution: form.institution.trim(),
        degree: form.degree.trim(),
        fieldOfStudy: form.fieldOfStudy.trim(),
        graduationYear: form.graduationYear.trim(),
        status: form.status,
        grade: form.grade.trim(),
      };

      if (editingIndex !== null) {
        updatedList[editingIndex] = entryData;
      } else {
        updatedList.push(entryData);
      }

      const res = await updateProfile({ education: updatedList });
      toast.success(editingIndex !== null ? "Education updated!" : "Education added!");
      if (onProfileUpdated) onProfileUpdated(res.user, res.completion);
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save education.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Are you sure you want to remove this education entry?")) return;

    setLoading(true);
    try {
      const updatedList = educationList.filter((_, i) => i !== index);
      const res = await updateProfile({ education: updatedList });
      toast.success("Education entry removed.");
      if (onProfileUpdated) onProfileUpdated(res.user, res.completion);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete education entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-gray-100 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white">
            <GraduationCap size={19} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Education Information
            </h2>
            <p className="text-xs text-gray-500">
              Add your university, college, degrees, and academic specializations.
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
            Add Education
          </button>
        )}
      </div>

      {/* Inline Form / Modal for Add or Edit */}
      {isEditing && (
        <form onSubmit={handleSave} className="my-6 p-5 bg-gray-50/70 border border-gray-200 rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              {editingIndex !== null ? "Edit Education Entry" : "New Education Entry"}
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
                Institution Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="institution"
                value={form.institution}
                onChange={handleChange}
                placeholder="e.g. Stanford University / IIT Delhi"
                className={`w-full h-9 rounded-lg border ${
                  errors.institution ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white"
                } px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-gray-400`}
              />
              {errors.institution && (
                <p className="mt-1 text-[11px] text-red-500">{errors.institution}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">
                Degree <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="degree"
                value={form.degree}
                onChange={handleChange}
                placeholder="e.g. Bachelor of Technology / B.S."
                className={`w-full h-9 rounded-lg border ${
                  errors.degree ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white"
                } px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-gray-400`}
              />
              {errors.degree && (
                <p className="mt-1 text-[11px] text-red-500">{errors.degree}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">
                Field of Study / Branch
              </label>
              <input
                type="text"
                name="fieldOfStudy"
                value={form.fieldOfStudy}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
                className="w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-gray-400"
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">
                Graduation Year
              </label>
              <input
                type="text"
                name="graduationYear"
                value={form.graduationYear}
                onChange={handleChange}
                placeholder="e.g. 2025"
                className="w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-gray-400"
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">
                Study Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full h-9 rounded-lg border border-gray-200 bg-white px-2.5 text-xs text-gray-800 outline-none transition focus:border-gray-400"
              >
                <option value="Completed">Completed</option>
                <option value="Pursuing">Pursuing / In Progress</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">
                CGPA or Percentage
              </label>
              <input
                type="text"
                name="grade"
                value={form.grade}
                onChange={handleChange}
                placeholder="e.g. 3.8 / 4.0 or 85%"
                className="w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-gray-400"
              />
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
              {loading ? "Saving..." : "Save Education"}
            </button>
          </div>
        </form>
      )}

      {/* List of Education Entries */}
      <div className="mt-5 space-y-3">
        {educationList.length === 0 ? (
          <div className="text-center py-10 px-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <BookOpen size={28} className="mx-auto text-gray-400 mb-2" />
            <h4 className="text-xs font-semibold text-gray-700">No education entries added yet</h4>
            <p className="text-[11px] text-gray-500 mt-1 max-w-sm mx-auto">
              Adding your university or college details boosts your profile completion and provides relevant mock interview questions.
            </p>
          </div>
        ) : (
          educationList.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-bold text-gray-900">
                    {item.institution}
                  </h4>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                    {item.status || "Completed"}
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-700">
                  {item.degree} {item.fieldOfStudy ? `in ${item.fieldOfStudy}` : ""}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500 pt-0.5">
                  {item.graduationYear && <span>Class of {item.graduationYear}</span>}
                  {item.grade && <span>Grade: {item.grade}</span>}
                </div>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(idx)}
                  disabled={loading}
                  className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition"
                  title="Edit entry"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  disabled={loading}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                  title="Remove entry"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default EducationInfo;
