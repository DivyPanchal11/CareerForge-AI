import React from "react";
import { useResume } from "../../../context/ResumeContext";
import InputField from "../../auth/InputField";

export function DeclarationEditor() {
  const { resume, setResume } = useResume();
  const declaration = resume.declaration || {
    statement: "I hereby declare that all information provided above is true and correct to the best of my knowledge and belief.",
    place: "",
    date: "",
    signatureName: resume.personalInfo?.fullName || "",
  };

  const handleUpdate = (field, value) => {
    setResume((prev) => ({
      ...prev,
      declaration: {
        ...(prev.declaration || declaration),
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200 pb-3 mb-4">
        <h2 className="text-lg font-bold text-gray-900">Declaration & Signature</h2>
        <p className="text-xs text-gray-500">Formal statement affirming authenticity of provided information.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Declaration Statement</label>
          <textarea
            rows={3}
            value={declaration.statement}
            onChange={(e) => handleUpdate("statement", e.target.value)}
            placeholder="e.g. I hereby declare that the details furnished above are true..."
            className="w-full rounded-xl border border-gray-300 p-3 text-sm text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none transition"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <InputField
            name="place"
            placeholder="Place (e.g. New York, USA)"
            value={declaration.place}
            onChange={(e) => handleUpdate("place", e.target.value)}
          />
          <InputField
            name="date"
            placeholder="Date (e.g. DD/MM/YYYY)"
            value={declaration.date}
            onChange={(e) => handleUpdate("date", e.target.value)}
          />
          <InputField
            name="signatureName"
            placeholder="Signature Name"
            value={declaration.signatureName}
            onChange={(e) => handleUpdate("signatureName", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default DeclarationEditor;
