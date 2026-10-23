import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, FileText, Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";
import { updateProfile } from "../../services/profileService";

function PersonalInfo({ user, onProfileUpdated }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        city: user.location?.city || "",
        state: user.location?.state || "",
        country: user.location?.country || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = "Full name is required.";
    }
    if (formData.phone && formData.phone.trim().length > 0) {
      const phoneRegex = /^[+0-9\s\-()]{7,20}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        errs.phone = "Please enter a valid phone number.";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        location: {
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: formData.country.trim(),
        },
        bio: formData.bio.trim(),
      };

      const res = await updateProfile(payload);
      toast.success("Personal information updated successfully!");
      if (onProfileUpdated) {
        onProfileUpdated(res.user, res.completion);
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to update personal information.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm">
      <div className="flex items-center gap-3 pb-5 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white">
          <User size={19} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Personal Information
          </h2>
          <p className="text-xs text-gray-500">
            Update your basic details, contact information, and public profile bio.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block mb-1.5 text-xs font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Alex Morgan"
                className={`w-full h-9 rounded-lg border ${
                  errors.name ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-gray-50"
                } px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-gray-400 focus:ring-1 focus:ring-gray-200`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-[11px] text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email Address (Read-only) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-gray-700">
                Email Address
              </label>
              <span className="text-[10px] text-gray-400 font-medium">Account Email (Verified)</span>
            </div>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full h-9 rounded-lg border border-gray-200 bg-gray-100/70 px-3 text-xs text-gray-500 cursor-not-allowed outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phone */}
          <div>
            <label className="block mb-1.5 text-xs font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +1 (555) 000-1234"
              className={`w-full h-9 rounded-lg border ${
                errors.phone ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-gray-50"
              } px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-gray-400 focus:ring-1 focus:ring-gray-200`}
            />
            {errors.phone && (
              <p className="mt-1 text-[11px] text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block mb-1.5 text-xs font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. San Francisco / Bengaluru"
              className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* State */}
          <div>
            <label className="block mb-1.5 text-xs font-medium text-gray-700">
              State / Province
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g. California / Karnataka"
              className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block mb-1.5 text-xs font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="e.g. United States / India"
              className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-gray-700">
              Professional Bio
            </label>
            <span className="text-[10px] text-gray-400">
              {formData.bio.length}/500 characters
            </span>
          </div>
          <textarea
            name="bio"
            rows={3}
            maxLength={500}
            value={formData.bio}
            onChange={handleChange}
            placeholder="A brief summary of your background, career focus, and aspirations..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-gray-400 focus:ring-1 focus:ring-gray-200 resize-none"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-black text-white rounded-lg text-xs font-semibold hover:bg-gray-900 transition flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {loading ? "Saving Changes..." : "Save Personal Info"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PersonalInfo;
