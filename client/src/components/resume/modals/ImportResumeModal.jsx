import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  FileText,
  FileCode,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { extractTextFromPDF, parseResumeText, parseResumeJSON } from "../../../utils/resumeParser";

export function ImportResumeModal({ isOpen, onClose, onImportData }) {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null); // 'json' | 'pdf'
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setFile(null);
    setFileType(null);
    setParsedData(null);
    setSelectedTemplate("modern");
    setIsParsing(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const processFile = async (uploadedFile) => {
    if (!uploadedFile) return;

    const extension = uploadedFile.name.split(".").pop().toLowerCase();
    if (extension !== "pdf" && extension !== "json") {
      toast.error("Please upload a valid .pdf or .json resume file.");
      return;
    }

    setFile(uploadedFile);
    setFileType(extension);
    setIsParsing(true);
    setParsedData(null);

    try {
      if (extension === "json") {
        const text = await uploadedFile.text();
        const jsonResult = parseResumeJSON(text);
        setParsedData(jsonResult);
        setSelectedTemplate(jsonResult.template || "modern");
        toast.success("JSON backup file parsed successfully!");
      } else if (extension === "pdf") {
        const pdfText = await extractTextFromPDF(uploadedFile);
        if (!pdfText || pdfText.trim().length === 0) {
          throw new Error("Could not extract any text from this PDF. It might be an image scan.");
        }
        const extracted = parseResumeText(pdfText);
        setParsedData(extracted);
        setSelectedTemplate(extracted.template || "modern");
        toast.success("Full resume structure extracted from PDF!");
      }
    } catch (err) {
      console.error("Resume Import Error:", err);
      toast.error(err.message || "Failed to process resume file");
      setParsedData(null);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (!parsedData) return;
    onImportData({
      ...parsedData,
      template: selectedTemplate,
    });
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gray-100 text-black flex items-center justify-center">
              <Upload size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Import Resume</h3>
              <p className="text-[11px] text-gray-500">Auto-populate from an existing PDF or JSON backup</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-black rounded-xl hover:bg-gray-100 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {!file ? (
            /* Upload Dropzone */
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? "border-black bg-gray-50 scale-[1.01]"
                  : "border-gray-300 hover:border-black hover:bg-gray-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.json"
                onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                className="hidden"
              />

              <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-700 mx-auto flex items-center justify-center mb-3">
                <Upload size={24} />
              </div>

              <h4 className="text-sm font-bold text-gray-900 mb-1">
                Drop your resume here or browse
              </h4>
              <p className="text-xs text-gray-500 mb-3">
                Supports <strong>.PDF</strong> (existing resume) and <strong>.JSON</strong> (CareerForge backup)
              </p>

              <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-black text-white rounded-xl shadow-xs">
                <span>Select File</span>
              </div>
            </div>
          ) : (
            /* Selected File & Preview State */
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0">
                    {fileType === "json" ? (
                      <FileCode size={20} className="text-amber-600" />
                    ) : (
                      <FileText size={20} className="text-blue-600" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-gray-900 truncate max-w-[200px] sm:max-w-[260px]">
                      {file.name}
                    </p>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">
                      {(file.size / 1024).toFixed(1)} KB • {fileType}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-gray-500 hover:text-black font-semibold px-2.5 py-1 rounded-lg hover:bg-gray-200 transition cursor-pointer"
                >
                  Change
                </button>
              </div>

              {/* Parsing Indicator */}
              {isParsing && (
                <div className="p-6 text-center space-y-2">
                  <RefreshCw size={24} className="animate-spin text-black mx-auto" />
                  <p className="text-xs font-semibold text-gray-700">Extracting and parsing resume data...</p>
                </div>
              )}

              {/* Parsed Summary Preview */}
              {parsedData && (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-green-700">
                      <CheckCircle size={15} />
                      <span>Whole Resume Extracted Successfully</span>
                    </div>
                    {parsedData.sectionOrder && parsedData.sectionOrder.length > 0 && (
                      <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full">
                        Original Order Preserved
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                      <span className="text-[10px] text-gray-400 font-semibold uppercase">Candidate Name</span>
                      <p className="font-bold text-gray-900 truncate">
                        {parsedData.personalInfo?.fullName || "Not found"}
                      </p>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                      <span className="text-[10px] text-gray-400 font-semibold uppercase">Job Title</span>
                      <p className="font-bold text-gray-900 truncate">
                        {parsedData.personalInfo?.jobTitle || "Professional"}
                      </p>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                      <span className="text-[10px] text-gray-400 font-semibold uppercase">Contact Email</span>
                      <p className="font-bold text-gray-900 truncate">
                        {parsedData.personalInfo?.email || "Not found"}
                      </p>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                      <span className="text-[10px] text-gray-400 font-semibold uppercase">Phone / Location</span>
                      <p className="font-bold text-gray-900 truncate">
                        {parsedData.personalInfo?.phone || parsedData.personalInfo?.location || "Detected"}
                      </p>
                    </div>
                  </div>

                  {/* Detected Sections Checklist */}
                  <div className="bg-white p-3 rounded-xl border border-gray-100 space-y-1.5">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                      Sections Parsed & Ready to Edit:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {parsedData.summary && (
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle size={10} /> Summary
                        </span>
                      )}
                      {parsedData.experience?.length > 0 && (
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle size={10} /> Experience ({parsedData.experience.length})
                        </span>
                      )}
                      {parsedData.education?.length > 0 && (
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle size={10} /> Education ({parsedData.education.length})
                        </span>
                      )}
                      {parsedData.skills?.length > 0 && (
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle size={10} /> Skills ({parsedData.skills.length})
                        </span>
                      )}
                      {parsedData.projects?.length > 0 && (
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle size={10} /> Projects ({parsedData.projects.length})
                        </span>
                      )}
                      {parsedData.certifications?.length > 0 && (
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle size={10} /> Certifications ({parsedData.certifications.length})
                        </span>
                      )}
                      {parsedData.languages?.length > 0 && (
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle size={10} /> Languages ({parsedData.languages.length})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Layout Format Selection */}
                  <div className="bg-white p-3 rounded-xl border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                        Resume Layout Format:
                      </span>
                      <span className="text-[10px] text-gray-400">
                        Auto-detected: <strong className="text-gray-800 capitalize">{selectedTemplate}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto p-0.5">
                      {[
                        { id: "atlantic-blue", label: "Atlantic Blue" },
                        { id: "cobalt-edge", label: "Cobalt Edge" },
                        { id: "mercury-flow", label: "Mercury Flow" },
                        { id: "saffron-line", label: "Saffron Line" },
                        { id: "editorial-rule", label: "Editorial Rule" },
                        { id: "true-blue", label: "True Blue" },
                        { id: "hunter-green", label: "Hunter Green" },
                        { id: "classic-clear", label: "Classic Clear" },
                        { id: "modern", label: "Modern" },
                        { id: "sidebar", label: "Two-Column" },
                        { id: "professional", label: "Executive" },
                        { id: "minimal", label: "Minimal" },
                      ].map((tpl) => (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => setSelectedTemplate(tpl.id)}
                          className={`py-1 px-2 text-[10.5px] font-bold rounded-lg border transition cursor-pointer text-center truncate ${
                            selectedTemplate === tpl.id
                              ? "bg-black text-white border-black shadow-xs"
                              : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                          }`}
                        >
                          {tpl.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-black transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!parsedData || isParsing}
            onClick={handleConfirmImport}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Import Into Resume</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImportResumeModal;
