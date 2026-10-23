import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useResume } from "../../../context/ResumeContext";
import InputField from "../../auth/InputField";

export function ReferencesEditor() {
  const { resume, setResume } = useResume();
  const references = resume.references || [];

  const handleAdd = () => {
    const newRef = {
      id: `ref_${Date.now()}`,
      name: "",
      relationship: "",
      company: "",
      email: "",
      phone: "",
    };
    setResume((prev) => ({ ...prev, references: [...(prev.references || []), newRef] }));
  };

  const handleUpdate = (id, field, value) => {
    setResume((prev) => ({
      ...prev,
      references: (prev.references || []).map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleDelete = (id) => {
    setResume((prev) => ({
      ...prev,
      references: (prev.references || []).filter((item) => item.id !== id),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">References</h2>
          <p className="text-xs text-gray-500">Add professional references or mentors who can vouch for your work.</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-xs transition cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Reference</span>
        </button>
      </div>

      {references.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
          <p className="text-sm text-gray-500 font-medium">No references added yet.</p>
          <button onClick={handleAdd} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-black hover:underline cursor-pointer">
            <Plus size={14} /> Add Reference
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {references.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs relative space-y-3">
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-600 p-1 rounded"
              >
                <Trash2 size={16} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-6">
                <InputField
                  name="name"
                  placeholder="Full Name (e.g. Dr. Sarah Jenkins)"
                  value={item.name}
                  onChange={(e) => handleUpdate(item.id, "name", e.target.value)}
                />
                <InputField
                  name="relationship"
                  placeholder="Role / Title (e.g. Senior Tech Lead)"
                  value={item.relationship}
                  onChange={(e) => handleUpdate(item.id, "relationship", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <InputField
                  name="company"
                  placeholder="Company / Organization"
                  value={item.company}
                  onChange={(e) => handleUpdate(item.id, "company", e.target.value)}
                />
                <InputField
                  name="email"
                  placeholder="Email Address"
                  value={item.email}
                  onChange={(e) => handleUpdate(item.id, "email", e.target.value)}
                />
                <InputField
                  name="phone"
                  placeholder="Phone Number"
                  value={item.phone}
                  onChange={(e) => handleUpdate(item.id, "phone", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReferencesEditor;
