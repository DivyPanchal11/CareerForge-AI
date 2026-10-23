import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, User as UserIcon, Mail, Briefcase, Award, ShieldCheck, KeyRound, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { getAvatarUrl } from "../../services/profileService";
import { logoutUser } from "../../services/authService";
import AvatarModal from "./AvatarModal";
import PasswordChangeModal from "./PasswordChangeModal";

function ProfileHeader({ user, completion, onProfileUpdated, onQuickEditClick }) {
  const navigate = useNavigate();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const avatarUrl = getAvatarUrl(user?.avatar);
  const completionPercentage = completion?.percentage ?? 0;
  const targetRole = user?.careerPreferences?.targetRole || "Career Aspirant";

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left: Avatar + Details */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left w-full md:w-auto">
            {/* Avatar container */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-100 border-2 border-gray-200 shadow-sm flex items-center justify-center">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user?.name || "Profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black text-white text-2xl font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={36} />}
                  </div>
                )}
              </div>

              {/* Change photo overlay button */}
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                title="Change Photo"
                className="absolute -bottom-2 -right-2 p-2 bg-black text-white rounded-xl shadow-md hover:bg-gray-800 transition active:scale-95 border-2 border-white"
              >
                <Camera size={15} />
              </button>
            </div>

            {/* User Meta */}
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  {user?.name || "Student"}
                </h1>
                {user?.role === "admin" && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-gray-900 text-white px-2 py-0.5 rounded-md">
                    <ShieldCheck size={12} />
                    Admin
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-1 gap-x-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Mail size={14} className="text-gray-400" />
                  {user?.email || "No email"}
                </span>

                <span className="flex items-center gap-1.5">
                  <Briefcase size={14} className="text-gray-400" />
                  <span className="font-medium text-gray-700">{targetRole}</span>
                </span>
              </div>

              {user?.bio && (
                <p className="text-xs text-gray-600 line-clamp-2 max-w-xl pt-1">
                  {user.bio}
                </p>
              )}
            </div>
          </div>

          {/* Right: Actions & Completion Badge */}
          <div className="flex flex-col sm:flex-row md:flex-col items-center sm:items-end gap-3 w-full md:w-auto shrink-0">
            {/* Completion Pill */}
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200">
              <Award size={18} className="text-black" />
              <div className="text-right">
                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                  Profile Strength
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {completionPercentage}% Complete
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition"
              >
                Change Photo
              </button>

              {!user?.googleId && (
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition flex items-center gap-1.5"
                  title="Change Password"
                >
                  <KeyRound size={13} />
                  <span className="hidden sm:inline">Password</span>
                </button>
              )}

              {onQuickEditClick && (
                <button
                  type="button"
                  onClick={onQuickEditClick}
                  className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg bg-black text-white hover:bg-gray-900 transition active:scale-95"
                >
                  Edit Profile
                </button>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 transition flex items-center gap-1.5 cursor-pointer"
                title="Log Out"
              >
                <LogOut size={13} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={user?.avatar}
        onAvatarUpdated={onProfileUpdated}
      />

      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
}

export default ProfileHeader;
