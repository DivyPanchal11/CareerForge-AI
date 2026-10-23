import { useState, useRef } from "react";
import { X, Upload, Link as LinkIcon, Camera, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { uploadAvatar, getAvatarUrl } from "../../services/profileService";

function AvatarModal({ isOpen, onClose, currentAvatar, onAvatarUpdated }) {
  const [activeTab, setActiveTab] = useState("upload"); // "upload" | "url"
  const [preview, setPreview] = useState(getAvatarUrl(currentAvatar) || "");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, WEBP, or GIF image.");
      return;
    }

    // Validate size (max 2.5MB)
    if (file.size > 2.5 * 1024 * 1024) {
      setError("Image size must be less than 2.5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveUpload = async () => {
    if (!preview) {
      setError("Please select an image first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await uploadAvatar({ image: preview });
      toast.success("Profile photo updated successfully!");
      if (onAvatarUpdated) onAvatarUpdated(res.user);
      onClose();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to upload image. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUrl = async () => {
    if (!imageUrl.trim()) {
      setError("Please provide a valid image URL.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await uploadAvatar({ avatarUrl: imageUrl.trim() });
      toast.success("Profile photo updated successfully!");
      if (onAvatarUpdated) onAvatarUpdated(res.user);
      onClose();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to update profile image.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePhoto = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await uploadAvatar({ avatarUrl: "" });
      toast.success("Profile photo removed.");
      if (onAvatarUpdated) onAvatarUpdated(res.user);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove profile photo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white">
              <Camera size={18} />
            </div>
            <h3 className="text-base font-semibold text-gray-900">
              Update Profile Photo
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 px-6 pt-2">
          <button
            type="button"
            onClick={() => { setActiveTab("upload"); setError(""); }}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 transition border-b-2 ${
              activeTab === "upload"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Upload size={14} />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("url"); setError(""); }}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 transition border-b-2 ${
              activeTab === "url"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <LinkIcon size={14} />
            Image URL
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === "upload" ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center">
                {preview ? (
                  <div className="relative group w-28 h-28 rounded-full overflow-hidden border-2 border-gray-200 shadow-inner">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                    <Camera size={32} />
                    <span className="text-[11px] mt-1 text-gray-500">No Image</span>
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                >
                  Choose New File
                </button>
                {currentAvatar && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={loading}
                    className="px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    Remove Current
                  </button>
                )}
              </div>
              <p className="text-[11px] text-center text-gray-400">
                Supports JPG, PNG, WEBP, or GIF (max 2.5 MB)
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700">
                  Direct Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
                />
              </div>
              {imageUrl.trim() && (
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200">
                    <img
                      src={imageUrl}
                      alt="URL Preview"
                      onError={() => setError("Could not load image from this URL.")}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={activeTab === "upload" ? handleSaveUpload : handleSaveUrl}
            className="px-4 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:bg-gray-900 transition flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {loading && <Loader2 size={13} className="animate-spin" />}
            {loading ? "Saving..." : "Save Photo"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AvatarModal;
