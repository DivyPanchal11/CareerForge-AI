import React, { useState } from "react";
import { Sparkles, Camera, Check, Plus, Link2, X, Lightbulb, ChevronDown, ChevronUp, Sliders } from "lucide-react";
import toast from "react-hot-toast";
import { useResume } from "../../../context/ResumeContext";
import PhotoDisplay from "../PhotoDisplay";
import PhotoEditorModal from "../modals/PhotoEditorModal";

const PERSONAL_INFO_TIPS = [
  {
    title: "Full Name",
    tip: "Use your legal name or the name you go by professionally. Avoid nicknames unless they're widely recognized in your industry.",
    icon: "👤",
  },
  {
    title: "Professional Title",
    tip: "Match your title to the role you're applying for. Use keywords from the job description. E.g., \"Full Stack Developer\" instead of just \"Developer\".",
    icon: "💼",
  },
  {
    title: "Email Address",
    tip: "Use a professional email (firstname.lastname@email.com). Avoid informal addresses like coolguy99@email.com.",
    icon: "📧",
  },
  {
    title: "Phone Number",
    tip: "Include country code if applying internationally. Use a number where you can be easily reached.",
    icon: "📱",
  },
  {
    title: "Location",
    tip: "City and country is sufficient. Full address is not needed. If you're open to relocation, mention it in your summary.",
    icon: "📍",
  },
  {
    title: "LinkedIn & GitHub",
    tip: "Ensure your LinkedIn URL is customized (linkedin.com/in/yourname). For tech roles, an active GitHub profile with pinned projects adds credibility.",
    icon: "🔗",
  },
  {
    title: "Photo",
    tip: "Use a professional headshot with good lighting and a neutral background. Keep file size under 2MB. Note: In some countries, photos on resumes are discouraged.",
    icon: "📸",
  },
];

export function PersonalInfoEditor({ onDone }) {
  const { resume, setResume } = useResume();
  const info = resume.personalInfo || {};

  // Extra optional fields state
  const [showWebsite, setShowWebsite] = useState(Boolean(info.portfolio));
  const [showNationality, setShowNationality] = useState(Boolean(info.nationality));
  const [showDob, setShowDob] = useState(Boolean(info.dob));
  const [showVisa, setShowVisa] = useState(Boolean(info.visa));
  const [showPassport, setShowPassport] = useState(Boolean(info.passport));

  // Photo Editor Modal state
  const [isPhotoEditorOpen, setIsPhotoEditorOpen] = useState(false);

  // Tips panel state
  const [showTips, setShowTips] = useState(false);
  const [expandedTip, setExpandedTip] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResume((prev) => ({
      ...prev,
      personalInfo: {
        ...(prev.personalInfo || {}),
        [name]: value,
      },
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setResume((prev) => ({
          ...prev,
          personalInfo: {
            ...(prev.personalInfo || {}),
            photo: reader.result,
          },
        }));
        toast.success("Photo uploaded! Frame and style your headshot.");
        setIsPhotoEditorOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setResume((prev) => ({
      ...prev,
      personalInfo: {
        ...(prev.personalInfo || {}),
        photo: "",
      },
    }));
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* ── Top Header Bar ── */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Edit Personal Details</h2>

        <button
          type="button"
          onClick={() => setShowTips((prev) => !prev)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
            showTips
              ? "text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100"
              : "text-gray-600 hover:text-black bg-gray-50 hover:bg-gray-100 border-gray-200"
          }`}
        >
          <Sparkles size={13} className="text-amber-500" />
          <span>{showTips ? "Hide Tips" : "Get Tips"}</span>
        </button>
      </div>

      {/* ── Tips Panel (Expandable) ── */}
      {showTips && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={16} className="text-amber-600" />
            <h3 className="text-sm font-bold text-amber-800">Tips for Personal Details</h3>
          </div>

          <div className="space-y-1">
            {PERSONAL_INFO_TIPS.map((item, idx) => (
              <div key={idx} className="bg-white/80 rounded-lg border border-amber-100 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedTip(expandedTip === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-amber-50/50 transition cursor-pointer"
                >
                  <span className="flex items-center gap-2 text-xs font-semibold text-gray-800">
                    <span>{item.icon}</span>
                    {item.title}
                  </span>
                  {expandedTip === idx ? (
                    <ChevronUp size={14} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={14} className="text-gray-400" />
                  )}
                </button>
                {expandedTip === idx && (
                  <div className="px-3 pb-3 pt-0">
                    <p className="text-xs text-gray-600 leading-relaxed pl-6">{item.tip}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowTips(false)}
            className="mt-2 text-[10px] font-semibold text-amber-700 hover:text-amber-900 transition cursor-pointer"
          >
            ✕ Close tips
          </button>
        </div>
      )}

      {/* ── Top Form Grid: Name & Title on Left, Photo on Right ── */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-5 pt-1">
        {/* Left: Full Name & Professional Title */}
        <div className="flex-1 w-full space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Full name</label>
            <input
              type="text"
              name="fullName"
              placeholder="e.g. Sarthak Mehta"
              value={info.fullName || ""}
              onChange={handleChange}
              className="w-full text-xs font-medium p-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:border-black focus:bg-white outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Professional title</label>
            <input
              type="text"
              name="jobTitle"
              placeholder="Target position or current role"
              value={info.jobTitle || ""}
              onChange={handleChange}
              className="w-full text-xs font-medium p-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:border-black focus:bg-white outline-none transition"
            />
          </div>
        </div>

        {/* Right: Photo Upload & Framing Controls (FlowCV Style) */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 self-center sm:self-start">
          <label className="text-[11px] font-bold text-gray-600 mb-0.5">Photo</label>
          <div className="relative group">
            {info.photo ? (
              <div
                onClick={() => setIsPhotoEditorOpen(true)}
                className="cursor-pointer group relative"
                title="Click to frame & style photo"
              >
                <PhotoDisplay
                  photo={info.photo}
                  photoSettings={resume.photoSettings}
                  primaryColor={resume.theme?.primaryColor}
                  sizeOverride={96}
                  className="shadow-2xs transition-transform group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold rounded-[inherit] pointer-events-none">
                  <Sliders size={16} />
                  <span className="mt-0.5">Edit</span>
                </div>
              </div>
            ) : (
              <label className="w-24 h-24 rounded-full bg-gray-100 border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200/80 transition overflow-hidden shadow-2xs">
                <div className="flex flex-col items-center text-gray-400">
                  <Camera size={24} />
                  <span className="text-[9px] font-bold mt-1 text-gray-500">Upload</span>
                </div>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            )}

            {info.photo && (
              <button
                type="button"
                onClick={removePhoto}
                className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition z-10"
                title="Remove photo"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {info.photo && (
            <button
              type="button"
              onClick={() => setIsPhotoEditorOpen(true)}
              className="flex items-center gap-1 text-[10px] font-bold text-gray-700 hover:text-black bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-lg border border-gray-200 transition cursor-pointer"
            >
              <Sliders size={11} />
              <span>Frame & Style</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Contact Inputs Stack ── */}
      <div className="space-y-3 pt-2">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="alex.johnson@example.com"
            value={info.email || ""}
            onChange={handleChange}
            className="w-full text-xs font-medium p-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:border-black focus:bg-white outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            placeholder="+1 (555) 234-5678"
            value={info.phone || ""}
            onChange={handleChange}
            className="w-full text-xs font-medium p-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:border-black focus:bg-white outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            placeholder="City, Country"
            value={info.location || ""}
            onChange={handleChange}
            className="w-full text-xs font-medium p-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:border-black focus:bg-white outline-none transition"
          />
        </div>

        {/* LinkedIn with Link Badge */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">LinkedIn</label>
          <div className="relative flex items-center">
            <input
              type="text"
              name="linkedin"
              placeholder="linkedin.com/in/sarthakmehta03"
              value={info.linkedin || ""}
              onChange={handleChange}
              className="w-full text-xs font-medium p-3 pr-16 bg-gray-50/80 border border-gray-200 rounded-xl focus:border-black focus:bg-white outline-none transition"
            />
            <span className="absolute right-2 flex items-center gap-1 bg-gray-200/70 text-gray-600 px-2 py-1 rounded-lg text-[10px] font-bold">
              <Link2 size={11} /> Link
            </span>
          </div>
        </div>

        {/* GitHub with Link Badge */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">GitHub</label>
          <div className="relative flex items-center">
            <input
              type="text"
              name="github"
              placeholder="github.com/SarthakMehta03"
              value={info.github || ""}
              onChange={handleChange}
              className="w-full text-xs font-medium p-3 pr-16 bg-gray-50/80 border border-gray-200 rounded-xl focus:border-black focus:bg-white outline-none transition"
            />
            <span className="absolute right-2 flex items-center gap-1 bg-gray-200/70 text-gray-600 px-2 py-1 rounded-lg text-[10px] font-bold">
              <Link2 size={11} /> Link
            </span>
          </div>
        </div>

        {/* Extra Optional Fields */}
        {showWebsite && (
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Website / Portfolio</label>
            <input
              type="text"
              name="portfolio"
              placeholder="alexjohnson.dev"
              value={info.portfolio || ""}
              onChange={handleChange}
              className="w-full text-xs font-medium p-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:border-black focus:bg-white outline-none transition"
            />
          </div>
        )}

        {showNationality && (
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Nationality</label>
            <input
              type="text"
              name="nationality"
              placeholder="e.g. American / Indian"
              value={info.nationality || ""}
              onChange={handleChange}
              className="w-full text-xs font-medium p-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:border-black focus:bg-white outline-none transition"
            />
          </div>
        )}

        {showDob && (
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Date of Birth</label>
            <input
              type="text"
              name="dob"
              placeholder="e.g. DD/MM/YYYY"
              value={info.dob || ""}
              onChange={handleChange}
              className="w-full text-xs font-medium p-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:border-black focus:bg-white outline-none transition"
            />
          </div>
        )}

        {showVisa && (
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Visa / Work Authorization</label>
            <input
              type="text"
              name="visa"
              placeholder="e.g. Green Card / H-1B / Authorized to work"
              value={info.visa || ""}
              onChange={handleChange}
              className="w-full text-xs font-medium p-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:border-black focus:bg-white outline-none transition"
            />
          </div>
        )}

        {showPassport && (
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Passport / ID</label>
            <input
              type="text"
              name="passport"
              placeholder="e.g. Passport Number / ID"
              value={info.passport || ""}
              onChange={handleChange}
              className="w-full text-xs font-medium p-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:border-black focus:bg-white outline-none transition"
            />
          </div>
        )}
      </div>

      {/* ── "Add details" Pill Buttons (FlowCV Style) ── */}
      <div className="pt-2 border-t border-gray-100">
        <label className="block text-xs font-bold text-gray-700 mb-2">Add details</label>
        <div className="flex flex-wrap gap-2">
          {!showWebsite && (
            <button
              type="button"
              onClick={() => setShowWebsite(true)}
              className="flex items-center gap-1 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition cursor-pointer border border-gray-200"
            >
              <Plus size={13} /> Website
            </button>
          )}

          {!showNationality && (
            <button
              type="button"
              onClick={() => setShowNationality(true)}
              className="flex items-center gap-1 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition cursor-pointer border border-gray-200"
            >
              <Plus size={13} /> Nationality
            </button>
          )}

          {!showDob && (
            <button
              type="button"
              onClick={() => setShowDob(true)}
              className="flex items-center gap-1 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition cursor-pointer border border-gray-200"
            >
              <Plus size={13} /> Date of Birth
            </button>
          )}

          {!showVisa && (
            <button
              type="button"
              onClick={() => setShowVisa(true)}
              className="flex items-center gap-1 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3.5 py-1.5 rounded-xl transition cursor-pointer border border-gray-200"
            >
              <Plus size={13} /> Visa
            </button>
          )}

          {!showPassport && (
            <button
              type="button"
              onClick={() => setShowPassport(true)}
              className="flex items-center gap-1 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3.5 py-1.5 rounded-xl transition cursor-pointer border border-gray-200"
            >
              <Plus size={13} /> Passport or ID
            </button>
          )}
        </div>
      </div>

      {/* ── Done Button (FlowCV Style) ── */}
      <div className="pt-3">
        <button
          type="button"
          onClick={onDone}
          className="w-full py-3.5 bg-black hover:bg-gray-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
        >
          <Check size={16} />
          <span>Done</span>
        </button>
      </div>

      {/* ── Profile Photo Editor & Styling Modal ── */}
      <PhotoEditorModal
        isOpen={isPhotoEditorOpen}
        onClose={() => setIsPhotoEditorOpen(false)}
      />
    </div>
  );
}

export default PersonalInfoEditor;
