import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Award,
  Languages,
  Heart,
  FileCode,
  Check,
  UserCheck,
  FileCheck2,
  BookOpen,
  Building2,
  Trophy,
} from "lucide-react";
import { useResume } from "../../../context/ResumeContext";

const optionalSections = [
  { id: "certifications", title: "Certifications & Licenses", icon: Award, desc: "Professional certificates, AWS, Scrum, etc." },
  { id: "languages", title: "Languages", icon: Languages, desc: "Showcase multilingual capabilities & proficiency" },
  { id: "interests", title: "Interests & Hobbies", icon: Heart, desc: "Personal activities, sports, or open source" },
  { id: "references", title: "References", icon: UserCheck, desc: "Professional contacts & recommendations" },
  { id: "declaration", title: "Declaration / Signature", icon: FileCheck2, desc: "Formal declaration statement & place/date" },
  { id: "publications", title: "Publications & Research", icon: BookOpen, desc: "Academic papers, journal publications & articles" },
  { id: "organizations", title: "Organizations & Volunteering", icon: Building2, desc: "Non-profit work, memberships & volunteer roles" },
  { id: "awards", title: "Awards & Honors", icon: Trophy, desc: "Competitions, hackathons, and recognitions" },
  { id: "custom", title: "Custom Section", icon: FileCode, desc: "Create dynamic custom sections with key-value items" },
];

export function AddContentModal({ isOpen, onClose, onAddSection }) {
  const { resume, setResume, setActiveSection } = useResume();
  const hidden = resume.hiddenSections || [];
  const order = resume.sectionOrder || [];

  if (!isOpen) return null;

  const isAdded = (secId) => {
    return order.includes(secId) && !hidden.includes(secId);
  };

  const handleToggle = (secId) => {
    const currentlyAdded = isAdded(secId);

    setResume((prev) => {
      const curHidden = prev.hiddenSections || [];
      const curOrder = prev.sectionOrder || [];

      if (currentlyAdded) {
        return {
          ...prev,
          hiddenSections: curHidden.includes(secId) ? curHidden : [...curHidden, secId],
        };
      } else {
        return {
          ...prev,
          hiddenSections: curHidden.filter((id) => id !== secId),
          sectionOrder: curOrder.includes(secId) ? curOrder : [...curOrder, secId],
        };
      }
    });

    if (!currentlyAdded) {
      setActiveSection(secId);
      if (onAddSection) onAddSection(secId);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 p-6 max-h-[85vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Add Content / Section</h3>
              <p className="text-xs text-gray-500">Choose a section to add to your professional resume.</p>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded cursor-pointer">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-2.5">
            {optionalSections.map((item) => {
              const Icon = item.icon;
              const added = isAdded(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => handleToggle(item.id)}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:border-black bg-gray-50/50 hover:bg-gray-50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
                      <Icon size={17} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{item.title}</h4>
                      <p className="text-[11px] text-gray-500">{item.desc}</p>
                    </div>
                  </div>

                  <div className="text-xs font-semibold shrink-0">
                    {added ? (
                      <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2.5 py-1 rounded-lg border border-green-200">
                        <Check size={12} /> Added
                      </span>
                    ) : (
                      <span className="bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition">
                        + Add
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default AddContentModal;
