import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useResume } from "../../../context/ResumeContext";
import InputField from "../../auth/InputField";

export function CustomSectionEditor() {
  const { resume, setResume } = useResume();
  const customSections = resume.customSections || [];

  const handleAddSection = () => {
    const newSec = {
      id: `custom_${Date.now()}`,
      title: "Custom Section",
      items: [],
    };
    setResume((prev) => ({ ...prev, customSections: [...(prev.customSections || []), newSec] }));
  };

  const handleAddItem = (sectionId) => {
    const newItem = {
      id: `item_${Date.now()}`,
      title: "",
      subtitle: "",
      date: "",
      description: "",
      link: "",
    };
    setResume((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).map((sec) =>
        sec.id === sectionId ? { ...sec, items: [...(sec.items || []), newItem] } : sec
      ),
    }));
  };

  const handleUpdateSectionTitle = (sectionId, title) => {
    setResume((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).map((sec) =>
        sec.id === sectionId ? { ...sec, title } : sec
      ),
    }));
  };

  const handleUpdateItem = (sectionId, itemId, field, value) => {
    setResume((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              items: (sec.items || []).map((item) =>
                item.id === itemId ? { ...item, [field]: value } : item
              ),
            }
          : sec
      ),
    }));
  };

  const handleDeleteSection = (sectionId) => {
    setResume((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).filter((sec) => sec.id !== sectionId),
    }));
  };

  const handleDeleteItem = (sectionId, itemId) => {
    setResume((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).map((sec) =>
        sec.id === sectionId
          ? { ...sec, items: (sec.items || []).filter((item) => item.id !== itemId) }
          : sec
      ),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-200 pb-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Custom Sections</h2>
          <p className="text-xs text-gray-500">Create personalized sections like Achievements, Publications, or Awards.</p>
        </div>
        <button
          type="button"
          onClick={handleAddSection}
          className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Custom Section</span>
        </button>
      </div>

      {customSections.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
          <p className="text-sm text-gray-500 font-medium">No custom sections added yet.</p>
          <button onClick={handleAddSection} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-black hover:underline cursor-pointer">
            <Plus size={14} /> Add Custom Section
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {customSections.map((sec) => (
            <div key={sec.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center gap-4 border-b border-gray-100 pb-3">
                <input
                  type="text"
                  value={sec.title}
                  onChange={(e) => handleUpdateSectionTitle(sec.id, e.target.value)}
                  className="text-base font-bold text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:border-black outline-none px-1 py-0.5"
                  placeholder="Section Title (e.g. Achievements)"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddItem(sec.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-black hover:underline"
                  >
                    <Plus size={13} /> Add Item
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSection(sec.id)}
                    className="text-gray-400 hover:text-red-600 p-1 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {sec.items.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No items in this section. Click "+ Add Item".</p>
              ) : (
                <div className="space-y-3">
                  {sec.items.map((item) => (
                    <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 relative space-y-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(sec.id, item.id)}
                        className="absolute top-2.5 right-2.5 text-gray-400 hover:text-red-600 p-1"
                      >
                        <Trash2 size={14} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pr-6">
                        <InputField
                          name="title"
                          placeholder="Title / Name"
                          value={item.title}
                          onChange={(e) => handleUpdateItem(sec.id, item.id, "title", e.target.value)}
                        />
                        <InputField
                          name="date"
                          placeholder="Date / Year"
                          value={item.date}
                          onChange={(e) => handleUpdateItem(sec.id, item.id, "date", e.target.value)}
                        />
                      </div>

                      <textarea
                        rows={2}
                        placeholder="Description..."
                        value={item.description}
                        onChange={(e) => handleUpdateItem(sec.id, item.id, "description", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-2 text-xs text-gray-900 focus:border-black outline-none bg-white"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomSectionEditor;
