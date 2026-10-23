import { useState, useEffect } from "react";
import {
  User,
  GraduationCap,
  Code2,
  FolderGit2,
  Briefcase,
  Award,
  Compass,
  Layers,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "../components/auth/Navbar";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileCompletionCard from "../components/profile/ProfileCompletionCard";
import ProfileCreditCard from "../components/profile/ProfileCreditCard";
import PersonalInfo from "../components/profile/PersonalInfo";
import EducationInfo from "../components/profile/EducationInfo";
import SkillsSection from "../components/profile/SkillsSection";
import ProjectsSection from "../components/profile/ProjectsSection";
import ExperienceSection from "../components/profile/ExperienceSection";
import CertificationsSection from "../components/profile/CertificationsSection";
import CareerPreferences from "../components/profile/CareerPreferences";

import { getProfile } from "../services/profileService";
import { getCurrentUser } from "../services/authService";

const SECTIONS = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "preferences", label: "Preferences", icon: Compass },
  { id: "all", label: "View All", icon: Layers },
];

function Profile() {
  const [user, setUser] = useState(null);
  const [completion, setCompletion] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");

  const loadProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProfile();
      if (data.success && data.user) {
        setUser(data.user);
        setCompletion(data.completion);
        if (data.credits) setCredits(data.credits);
      } else {
        throw new Error(data.message || "Could not retrieve profile.");
      }
    } catch (err) {
      console.error("Profile load error:", err);
      // Fallback to local storage if network glitch
      const cached = getCurrentUser();
      if (cached) {
        setUser(cached);
      }
      setError(
        err.response?.data?.message ||
          "Unable to load profile from the server. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const handleProfileUpdated = (updatedUser, updatedCompletion) => {
    if (updatedUser) setUser(updatedUser);
    if (updatedCompletion) {
      setCompletion(updatedCompletion);
    } else {
      // Re-fetch to get recalculated metrics
      getProfile()
        .then((data) => {
          if (data.user) setUser(data.user);
          if (data.completion) setCompletion(data.completion);
        })
        .catch(console.error);
    }
  };

  const handleQuickEditClick = () => {
    setActiveTab("personal");
    window.scrollTo({ top: 380, behavior: "smooth" });
  };

  const handleNavigateSection = (sectionId) => {
    setActiveTab(sectionId);
    window.scrollTo({ top: 380, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Loading State */}
        {loading && !user ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <div className="w-9 h-9 border-3 border-black border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-gray-500">
              Loading your profile details...
            </p>
          </div>
        ) : error && !user ? (
          /* Error State */
          <div className="bg-white border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Failed to Load Profile
              </h2>
              <p className="text-xs text-gray-500 mt-1">{error}</p>
            </div>
            <button
              type="button"
              onClick={loadProfileData}
              className="px-4 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:bg-gray-900 transition flex items-center gap-2 mx-auto active:scale-95"
            >
              <RefreshCw size={13} />
              Try Again
            </button>
          </div>
        ) : (
          /* Main Profile View */
          <>
            {/* Header */}
            <ProfileHeader
              user={user}
              completion={completion}
              onProfileUpdated={handleProfileUpdated}
              onQuickEditClick={handleQuickEditClick}
            />

            {/* Profile Completion Overview */}
            <ProfileCompletionCard
              completion={completion}
              onNavigateSection={handleNavigateSection}
            />

            {/* Aptitude Weekly Practice Credits */}
            {credits && <ProfileCreditCard credits={credits} />}

            {/* Section Tabs Navigation */}
            <div className="bg-white border border-gray-200 rounded-xl p-1.5 shadow-2xs overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-1 min-w-max">
                {SECTIONS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                        isActive
                          ? "bg-black text-white shadow-xs"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                      }`}
                    >
                      <Icon size={14} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Content Sections */}
            <div className="space-y-6">
              {(activeTab === "personal" || activeTab === "all") && (
                <PersonalInfo
                  user={user}
                  onProfileUpdated={handleProfileUpdated}
                />
              )}

              {(activeTab === "education" || activeTab === "all") && (
                <EducationInfo
                  user={user}
                  onProfileUpdated={handleProfileUpdated}
                />
              )}

              {(activeTab === "skills" || activeTab === "all") && (
                <SkillsSection
                  user={user}
                  onProfileUpdated={handleProfileUpdated}
                />
              )}

              {(activeTab === "projects" || activeTab === "all") && (
                <ProjectsSection
                  user={user}
                  onProfileUpdated={handleProfileUpdated}
                />
              )}

              {(activeTab === "experience" || activeTab === "all") && (
                <ExperienceSection
                  user={user}
                  onProfileUpdated={handleProfileUpdated}
                />
              )}

              {(activeTab === "certifications" || activeTab === "all") && (
                <CertificationsSection
                  user={user}
                  onProfileUpdated={handleProfileUpdated}
                />
              )}

              {(activeTab === "preferences" || activeTab === "all") && (
                <CareerPreferences
                  user={user}
                  onProfileUpdated={handleProfileUpdated}
                />
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Profile;