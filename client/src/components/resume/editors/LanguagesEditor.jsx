import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useResume } from "../../../context/ResumeContext";
import InputField from "../../auth/InputField";

export function LanguagesEditor() {
  const { resume, setResume } = useResume();
  const languages = resume.languages || [];

  const handleAdd = () => {
    const newLang = {
      id: `lang_${Date.now()}`,
      language: "",
      proficiency: "Fluent",
    };
    setResume((prev) => ({ ...prev, languages: [...(prev.languages || []), newLang] }));
  };

  const handleUpdate = (id, field, value) => {
    setResume((prev) => ({
      ...prev,
      languages: (prev.languages || []).map((lang) =>
        lang.id === id ? { ...lang, [field]: value } : lang
      ),
    }));
  };

  const handleDelete = (id) => {
    setResume((prev) => ({
      ...prev,
      languages: (prev.languages || []).filter((lang) => lang.id !== id),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Languages</h2>
          <p className="text-xs text-gray-500">Add languages you speak and your proficiency levels.</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Language</span>
        </button>
      </div>

      {languages.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
          <p className="text-sm text-gray-500 font-medium">No languages added yet.</p>
          <button onClick={handleAdd} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-black hover:underline cursor-pointer">
            <Plus size={14} /> Add Language
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {languages.map((lang) => (
            <div key={lang.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
              <div className="flex-1">
                <InputField
                  name="language"
                  placeholder="e.g. English, Spanish, German"
                  value={lang.language}
                  onChange={(e) => handleUpdate(lang.id, "language", e.target.value)}
                />
              </div>

              <div className="w-40">
                <select
                  value={lang.proficiency}
                  onChange={(e) => handleUpdate(lang.id, "proficiency", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-xs text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none transition bg-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Native">Native</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(lang.id)}
                className="p-2 text-gray-400 hover:text-red-600 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguagesEditor;
