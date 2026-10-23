import React, { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useResume } from "../../../context/ResumeContext";
import InputField from "../../auth/InputField";

export function EducationEditor() {
  const { resume, setResume } = useResume();
  const education = resume.education || [];
  const [expandedId, setExpandedId] = useState(education[0]?.id || null);

  const handleAdd = () => {
    const newId = `edu_${Date.now()}`;
    const newEdu = {
      id: newId,
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      grade: "",
      description: "",
    };
    setResume((prev) => ({ ...prev, education: [...(prev.education || []), newEdu] }));
    setExpandedId(newId);
  };

  const handleUpdate = (id, field, value) => {
    setResume((prev) => ({
      ...prev,
      education: (prev.education || []).map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const handleDelete = (id) => {
    setResume((prev) => ({
      ...prev,
      education: (prev.education || []).filter((edu) => edu.id !== id),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Education</h2>
          <p className="text-xs text-gray-500">List your academic degrees, certifications, or coursework.</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Education</span>
        </button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
          <p className="text-sm text-gray-500 font-medium">No education entries added yet.</p>
          <button
            onClick={handleAdd}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-black hover:underline cursor-pointer"
          >
            <Plus size={14} /> Add Education
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {education.map((edu, index) => {
            const isExpanded = expandedId === edu.id;
            return (
              <div key={edu.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : edu.id)}
                >
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {edu.degree ? `${edu.degree} ${edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}` : `Education #${index + 1}`}
                    </h3>
                    <p className="text-xs text-gray-500">{edu.institution || "School/University"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(edu.id);
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
                        name="institution"
                        label="Institution / University"
                        placeholder="e.g. Stanford University"
                        value={edu.institution}
                        onChange={(e) => handleUpdate(edu.id, "institution", e.target.value)}
                      />

                      <InputField
                        name="degree"
                        label="Degree"
                        placeholder="e.g. Bachelor of Science"
                        value={edu.degree}
                        onChange={(e) => handleUpdate(edu.id, "degree", e.target.value)}
                      />

                      <InputField
                        name="fieldOfStudy"
                        label="Field of Study"
                        placeholder="e.g. Computer Science"
                        value={edu.fieldOfStudy}
                        onChange={(e) => handleUpdate(edu.id, "fieldOfStudy", e.target.value)}
                      />

                      <InputField
                        name="grade"
                        label="Grade / CGPA"
                        placeholder="e.g. 3.8 / 4.0"
                        value={edu.grade}
                        onChange={(e) => handleUpdate(edu.id, "grade", e.target.value)}
                      />

                      <InputField
                        name="startDate"
                        label="Start Date"
                        placeholder="e.g. Sep 2018"
                        value={edu.startDate}
                        onChange={(e) => handleUpdate(edu.id, "startDate", e.target.value)}
                      />

                      <InputField
                        name="endDate"
                        label="End Date"
                        placeholder="e.g. May 2022"
                        value={edu.endDate}
                        onChange={(e) => handleUpdate(edu.id, "endDate", e.target.value)}
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

export default EducationEditor;
