import { useState } from "react";
import { Award, Plus, Trash2, Edit3, Loader2, X, ExternalLink, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { updateProfile } from "../../services/profileService";

function CertificationsSection({ user, onProfileUpdated }) {
  const certificationsList = user?.certifications || [];
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    credentialId: "",
    credentialUrl: "",
  });
  const [errors, setErrors] = useState({});

  const handleOpenAdd = () => {
    setForm({
      name: "",
      issuer: "",
      issueDate: "",
      expiryDate: "",
      credentialId: "",
      credentialUrl: "",
    });
    setErrors({});
    setEditingIndex(null);
    setIsEditing(true);
  };

  const handleOpenEdit = (index) => {
    const item = certificationsList[index];
    setForm({
      name: item.name || "",
      issuer: item.issuer || "",
      issueDate: item.issueDate || "",
      expiryDate: item.expiryDate || "",
      credentialId: item.credentialId || "",
      credentialUrl: item.credentialUrl || "",
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
    if (!form.name.trim()) errs.name = "Certification name is required.";
    if (!form.issuer.trim()) errs.issuer = "Issuing organization is required.";

    const urlRegex = /^https?:\/\/.+/i;
    if (form.credentialUrl.trim() && !urlRegex.test(form.credentialUrl.trim())) {
      errs.credentialUrl = "Please enter a valid URL starting with http:// or https://";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const updatedList = [...certificationsList];
      const entryData = {
        name: form.name.trim(),
        issuer: form.issuer.trim(),
        issueDate: form.issueDate.trim(),
        expiryDate: form.expiryDate.trim(),
        credentialId: form.credentialId.trim(),
        credentialUrl: form.credentialUrl.trim(),
      };

      if (editingIndex !== null) {
        updatedList[editingIndex] = entryData;
      } else {
        updatedList.push(entryData);
      }

      const res = await updateProfile({ certifications: updatedList });
      toast.success(editingIndex !== null ? "Certification updated!" : "Certification added!");
      if (onProfileUpdated) onProfileUpdated(res.user, res.completion);
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save certification.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Are you sure you want to delete this certification?")) return;

    setLoading(true);
    try {
      const updatedList = certificationsList.filter((_, i) => i !== index);
      const res = await updateProfile({ certifications: updatedList });
      toast.success("Certification removed.");
      if (onProfileUpdated) onProfileUpdated(res.user, res.completion);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete certification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-gray-100 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white">
            <Award size={19} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Certifications & Credentials
            </h2>
            <p className="text-xs text-gray-500">
              Add professional certifications from AWS, Google, Coursera, Meta, etc.
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
            Add Certification
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="my-6 p-5 bg-gray-50/70 border border-gray-200 rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              {editingIndex !== null ? "Edit Certification" : "New Certification"}
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
                Certification Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. AWS Certified Solutions Architect"
                className={`w-full h-9 rounded-lg border ${
                  errors.name ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white"
                } px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-gray-400`}
              />
              {errors.name && (
                <p className="mt-1 text-[11px] text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">
                Issuing Organization <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="issuer"
                value={form.issuer}
                onChange={handleChange}
                placeholder="e.g. Amazon Web Services / Coursera"
                className={`w-full h-9 rounded-lg border ${
                  errors.issuer ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white"
                } px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-gray-400`}
              />
              {errors.issuer && (
                <p className="mt-1 text-[11px] text-red-500">{errors.issuer}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">
                Issue Date (optional)
              </label>
              <input
                type="text"
                name="issueDate"
                value={form.issueDate}
                onChange={handleChange}
                placeholder="e.g. March 2024"
                className="w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-gray-400"
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">
                Expiration Date (optional)
              </label>
              <input
                type="text"
                name="expiryDate"
                value={form.expiryDate}
                onChange={handleChange}
                placeholder="e.g. March 2027 or No Expiry"
                className="w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">
                Credential ID (optional)
              </label>
              <input
                type="text"
                name="credentialId"
                value={form.credentialId}
                onChange={handleChange}
                placeholder="e.g. ABC-12345-XYZ"
                className="w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-gray-400"
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">
                Credential URL (optional)
              </label>
              <input
                type="url"
                name="credentialUrl"
                value={form.credentialUrl}
                onChange={handleChange}
                placeholder="https://cert.org/verify/123"
                className={`w-full h-9 rounded-lg border ${
                  errors.credentialUrl ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white"
                } px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-gray-400`}
              />
              {errors.credentialUrl && (
                <p className="mt-1 text-[11px] text-red-500">{errors.credentialUrl}</p>
              )}
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
              {loading ? "Saving..." : "Save Certification"}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="mt-5 space-y-3">
        {certificationsList.length === 0 ? (
          <div className="text-center py-10 px-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <Award size={28} className="mx-auto text-gray-400 mb-2" />
            <h4 className="text-xs font-semibold text-gray-700">No certifications added yet</h4>
            <p className="text-[11px] text-gray-500 mt-1 max-w-sm mx-auto">
              Add course certificates, cloud certifications, or specialized bootcamps to demonstrate continuous learning.
            </p>
          </div>
        ) : (
          certificationsList.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-bold text-gray-900">
                    {item.name}
                  </h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 flex items-center gap-1">
                    <ShieldCheck size={11} />
                    {item.issuer}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500 pt-0.5">
                  {item.issueDate && <span>Issued: {item.issueDate}</span>}
                  {item.expiryDate && <span>Expires: {item.expiryDate}</span>}
                  {item.credentialId && <span>ID: {item.credentialId}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {item.credentialUrl && (
                  <a
                    href={item.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition flex items-center gap-1 text-[11px]"
                    title="View Credential"
                  >
                    <ExternalLink size={14} />
                    <span className="hidden sm:inline">Verify</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => handleOpenEdit(idx)}
                  disabled={loading}
                  className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition"
                  title="Edit certification"
                >
                  <Edit3 size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  disabled={loading}
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                  title="Delete certification"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CertificationsSection;
