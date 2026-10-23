import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useResume } from "../../../context/ResumeContext";
import InputField from "../../auth/InputField";

export function PublicationsEditor() {
  const { resume, setResume } = useResume();
  const publications = resume.publications || [];

  const handleAdd = () => {
    const newPub = {
      id: `pub_${Date.now()}`,
      title: "",
      publisher: "",
      date: "",
      link: "",
      description: "",
    };
    setResume((prev) => ({ ...prev, publications: [...(prev.publications || []), newPub] }));
  };

  const handleUpdate = (id, field, value) => {
    setResume((prev) => ({
      ...prev,
      publications: (prev.publications || []).map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleDelete = (id) => {
    setResume((prev) => ({
      ...prev,
      publications: (prev.publications || []).filter((item) => item.id !== id),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Publications & Research</h2>
          <p className="text-xs text-gray-500">Showcase research papers, journal articles, or books published.</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-xs transition cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Publication</span>
        </button>
      </div>

      {publications.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
          <p className="text-sm text-gray-500 font-medium">No publications added yet.</p>
          <button onClick={handleAdd} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-black hover:underline cursor-pointer">
            <Plus size={14} /> Add Publication
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {publications.map((item) => (
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
                  name="title"
                  placeholder="Paper / Publication Title"
                  value={item.title}
                  onChange={(e) => handleUpdate(item.id, "title", e.target.value)}
                />
                <InputField
                  name="publisher"
                  placeholder="Publisher / Journal / Conference"
                  value={item.publisher}
                  onChange={(e) => handleUpdate(item.id, "publisher", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputField
                  name="date"
                  placeholder="Publication Date / Year"
                  value={item.date}
                  onChange={(e) => handleUpdate(item.id, "date", e.target.value)}
                />
                <InputField
                  name="link"
                  placeholder="URL / DOI Link"
                  value={item.link}
                  onChange={(e) => handleUpdate(item.id, "link", e.target.value)}
                />
              </div>

              <textarea
                rows={2}
                placeholder="Brief summary or key findings..."
                value={item.description}
                onChange={(e) => handleUpdate(item.id, "description", e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3 text-xs text-gray-900 focus:border-black outline-none bg-white"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PublicationsEditor;
