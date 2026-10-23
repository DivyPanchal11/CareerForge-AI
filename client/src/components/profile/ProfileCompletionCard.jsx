import { motion } from "framer-motion";
import { UserRound, CheckCircle2, ChevronRight, AlertCircle } from "lucide-react";

function ProfileCompletionCard({ completion, onNavigateSection }) {
  const percentage = completion?.percentage ?? 0;
  const breakdown = completion?.breakdown || {};
  const missingSteps = completion?.missingSteps || [];

  const categories = [
    { key: "personalInfo", label: "Personal Info", current: breakdown.personalInfo ?? 0, max: 20, section: "personal" },
    { key: "education", label: "Education", current: breakdown.education ?? 0, max: 20, section: "education" },
    { key: "skills", label: "Skills", current: breakdown.skills ?? 0, max: 20, section: "skills" },
    { key: "projects", label: "Projects", current: breakdown.projects ?? 0, max: 20, section: "projects" },
    { key: "preferences", label: "Preferences", current: breakdown.preferences ?? 0, max: 10, section: "preferences" },
    { key: "credentials", label: "Credentials", current: breakdown.credentials ?? 0, max: 10, section: "experience" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center">
            <UserRound size={21} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Profile Completion Status
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Complete your profile to optimize AI interview simulations and career matching.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-bold text-gray-900">
            {percentage}%
          </span>
          <p className="text-[11px] text-gray-400">Total Score</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5">
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-black rounded-full"
          />
        </div>
      </div>

      {/* Categories Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-5">
        {categories.map((cat) => {
          const isComplete = cat.current >= cat.max;
          return (
            <button
              type="button"
              key={cat.key}
              onClick={() => onNavigateSection && onNavigateSection(cat.section)}
              className="text-left bg-gray-50 hover:bg-gray-100/80 p-3 rounded-xl border border-gray-100 transition group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-medium text-gray-500">
                  {cat.label}
                </span>
                {isComplete ? (
                  <CheckCircle2 size={13} className="text-gray-900" />
                ) : (
                  <span className="text-[10px] font-bold text-gray-400">
                    {cat.current}/{cat.max}
                  </span>
                )}
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((cat.current / cat.max) * 100)}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Actionable Next Steps */}
      {missingSteps.length > 0 && (
        <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <AlertCircle size={15} className="text-gray-400 shrink-0" />
            <span>
              <strong>Recommended next step:</strong> {missingSteps[0]}
            </span>
          </div>

          {missingSteps.length > 1 && (
            <span className="text-[11px] text-gray-400">
              +{missingSteps.length - 1} more suggestions available
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default ProfileCompletionCard;
