import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useResume } from "../../../context/ResumeContext";
import InputField from "../../auth/InputField";

export function CertificationsEditor() {
  const { resume, setResume } = useResume();
  const certifications = resume.certifications || [];

  const handleAdd = () => {
    const newCert = {
      id: `cert_${Date.now()}`,
      name: "",
      issuer: "",
      issueDate: "",
      expiryDate: "",
      credentialId: "",
      credentialUrl: "",
    };
    setResume((prev) => ({ ...prev, certifications: [...(prev.certifications || []), newCert] }));
  };

  const handleUpdate = (id, field, value) => {
    setResume((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    }));
  };

  const handleDelete = (id) => {
    setResume((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).filter((cert) => cert.id !== id),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Certifications</h2>
          <p className="text-xs text-gray-500">Add professional licenses, certificates, and credentials.</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Certification</span>
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
          <p className="text-sm text-gray-500 font-medium">No certifications added yet.</p>
          <button onClick={handleAdd} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-black hover:underline cursor-pointer">
            <Plus size={14} /> Add Certification
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {certifications.map((cert) => (
            <div key={cert.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative space-y-3">
              <button
                type="button"
                onClick={() => handleDelete(cert.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-600 p-1 rounded"
              >
                <Trash2 size={16} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                <InputField
                  name="name"
                  label="Certification Name"
                  placeholder="e.g. AWS Certified Solutions Architect"
                  value={cert.name}
                  onChange={(e) => handleUpdate(cert.id, "name", e.target.value)}
                />

                <InputField
                  name="issuer"
                  label="Issuing Organization"
                  placeholder="e.g. Amazon Web Services"
                  value={cert.issuer}
                  onChange={(e) => handleUpdate(cert.id, "issuer", e.target.value)}
                />

                <InputField
                  name="issueDate"
                  label="Issue Date"
                  placeholder="e.g. Aug 2023"
                  value={cert.issueDate}
                  onChange={(e) => handleUpdate(cert.id, "issueDate", e.target.value)}
                />

                <InputField
                  name="credentialUrl"
                  label="Credential URL"
                  placeholder="https://verify.aws/..."
                  value={cert.credentialUrl}
                  onChange={(e) => handleUpdate(cert.id, "credentialUrl", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CertificationsEditor;
