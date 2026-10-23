import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserRound, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getProfile } from "../../services/profileService";

function ProfileCompletion() {
  const [completion, setCompletion] = useState(82);

  useEffect(() => {
    let isMounted = true;
    getProfile()
      .then((data) => {
        if (isMounted && data?.completion?.percentage !== undefined) {
          setCompletion(data.completion.percentage);
        }
      })
      .catch((err) => {
        console.warn("Could not load dynamic completion:", err.message);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
    >
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center">
            <UserRound size={21} className="text-white" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Profile Completion
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Complete your profile for better AI recommendations.
            </p>
          </div>
        </div>

        {/* Percentage */}
        <span className="text-2xl font-bold text-gray-900">
          {completion}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-5">
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-black rounded-full"
          />
        </div>
      </div>

      {/* Action */}
      <Link
        to="/profile"
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:gap-3 transition-all"
      >
        Complete Profile
        <ArrowRight size={16} />
      </Link>
    </motion.div>
  );
}

export default ProfileCompletion;