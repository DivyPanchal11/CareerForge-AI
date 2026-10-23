import React, { useState, useRef, useEffect } from "react";
import {
  Wand2,
  Sparkles,
  Zap,
  Plus,
  Trash2,
  RefreshCw,
  ChevronDown,
  Check,
  Type,
  List,
} from "lucide-react";
import toast from "react-hot-toast";
import { polishBulletPoint } from "../../../services/resumeService";

const ACTION_VERB_CATEGORIES = [
  {
    category: "Technical & Engineering",
    verbs: ["Architected", "Engineered", "Automated", "Deployed", "Developed", "Refactored"],
  },
  {
    category: "Leadership & Strategy",
    verbs: ["Spearheaded", "Orchestrated", "Championed", "Directed", "Mentored", "Founded"],
  },
  {
    category: "Impact & Optimization",
    verbs: ["Accelerated", "Streamlined", "Scaled", "Optimized", "Reduced", "Maximized"],
  },
  {
    category: "Execution & Delivery",
    verbs: ["Implemented", "Overhauled", "Delivered", "Pioneered", "Executed", "Standardized"],
  },
];

export function BulletPointAssistant({ value = "", onChange, placeholder }) {
  // Mode: "bullets" | "raw"
  const [mode, setMode] = useState("bullets");

  // Track active popover for Wand menu: index or null
  const [activeWandIndex, setActiveWandIndex] = useState(null);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null); // 'quantify' | 'action_verb' | 'polish'
  const [isVerbsDropdownOpen, setIsVerbsDropdownOpen] = useState(false);
  const [focusedBulletIndex, setFocusedBulletIndex] = useState(0);

  const verbsDropdownRef = useRef(null);
  const wandMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (verbsDropdownRef.current && !verbsDropdownRef.current.contains(e.target)) {
        setIsVerbsDropdownOpen(false);
      }
      if (wandMenuRef.current && !wandMenuRef.current.contains(e.target)) {
        setActiveWandIndex(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Parse raw text into bullets
  const parseBullets = (text) => {
    if (!text || !text.trim()) return [""];
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.replace(/^[•\-\*\s]+/, "").trim())
      .filter((l) => l.length > 0);
    return lines.length > 0 ? lines : [""];
  };

  const bullets = parseBullets(value);

  // Update description from bullets array
  const emitBullets = (newBullets) => {
    const valid = newBullets.filter((b) => b.trim().length > 0);
    if (valid.length === 0) {
      onChange("");
    } else {
      onChange(valid.map((b) => `• ${b.trim()}`).join("\n"));
    }
  };

  const handleBulletChange = (index, newText) => {
    const updated = [...bullets];
    updated[index] = newText;
    emitBullets(updated);
  };

  const handleAddBullet = () => {
    const updated = [...bullets, ""];
    emitBullets(updated);
    setFocusedBulletIndex(updated.length - 1);
  };

  const handleDeleteBullet = (index) => {
    if (bullets.length <= 1) {
      onChange("");
      return;
    }
    const updated = bullets.filter((_, i) => i !== index);
    emitBullets(updated);
    setFocusedBulletIndex(Math.max(0, index - 1));
  };

  // Insert or replace opening verb in the active bullet
  const handleInsertVerb = (verb) => {
    setIsVerbsDropdownOpen(false);
    const targetIdx = focusedBulletIndex >= 0 && focusedBulletIndex < bullets.length ? focusedBulletIndex : 0;
    const currentBullet = bullets[targetIdx] || "";

    // Replace first word if already an action verb or prepend
    let updatedBullet = "";
    if (!currentBullet.trim()) {
      updatedBullet = `${verb} `;
    } else {
      // Check if current bullet starts with a verb, replace it, else prepend
      const words = currentBullet.trim().split(" ");
      if (words.length > 0) {
        words[0] = verb;
        updatedBullet = words.join(" ");
      } else {
        updatedBullet = `${verb} ${currentBullet}`;
      }
    }

    const updated = [...bullets];
    updated[targetIdx] = updatedBullet;
    emitBullets(updated);
    toast.success(`Applied "${verb}" to bullet ${targetIdx + 1}`);
  };

  // Polish single bullet point via AI service
  const handlePolish = async (index, polishMode) => {
    const bulletText = bullets[index];
    if (!bulletText || !bulletText.trim()) {
      toast.error("Please write some bullet text first to polish.");
      setActiveWandIndex(null);
      return;
    }

    try {
      setLoadingIndex(index);
      setLoadingAction(polishMode);
      const res = await polishBulletPoint(bulletText, polishMode);

      if (res.data.success && res.data.result) {
        const updated = [...bullets];
        updated[index] = res.data.result;
        emitBullets(updated);
        toast.success(
          polishMode === "quantify"
            ? "Added quantifiable impact!"
            : polishMode === "action_verb"
            ? "Action verb applied!"
            : "Bullet point polished!"
        );
      } else {
        toast.error("Could not polish bullet point");
      }
    } catch (err) {
      toast.error("AI polish request failed");
    } finally {
      setLoadingIndex(null);
      setLoadingAction(null);
      setActiveWandIndex(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
        <div className="flex items-center gap-2">
          {/* Action Verb Suggester Dropdown */}
          <div className="relative" ref={verbsDropdownRef}>
            <button
              type="button"
              onClick={() => setIsVerbsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 transition shadow-2xs cursor-pointer"
              title="Pick a high-impact action verb"
            >
              <Zap size={13} className="text-amber-500" />
              <span>Action Verbs</span>
              <ChevronDown size={12} className="text-gray-400" />
            </button>

            {isVerbsDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-30 animate-in fade-in zoom-in-95 duration-100">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                  High-Impact Resume Verbs
                </div>
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {ACTION_VERB_CATEGORIES.map((cat) => (
                    <div key={cat.category}>
                      <span className="text-[10px] font-semibold text-gray-500 px-1">{cat.category}</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {cat.verbs.map((verb) => (
                          <button
                            key={verb}
                            type="button"
                            onClick={() => handleInsertVerb(verb)}
                            className="text-xs bg-gray-50 hover:bg-black hover:text-white border border-gray-200 px-2 py-0.5 rounded-md font-medium text-gray-800 transition cursor-pointer"
                          >
                            {verb}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <span className="text-[11px] text-gray-400 font-medium hidden sm:inline">
            Click wand <Wand2 size={11} className="inline text-purple-600 mx-0.5" /> next to any bullet to rewrite
          </span>
        </div>

        {/* View Mode Toggle (Bullets vs Raw) */}
        <div className="flex items-center border border-gray-200 rounded-lg p-0.5 bg-gray-50">
          <button
            type="button"
            onClick={() => setMode("bullets")}
            className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md transition cursor-pointer ${
              mode === "bullets" ? "bg-white text-black shadow-2xs" : "text-gray-500 hover:text-black"
            }`}
          >
            <List size={12} />
            <span>Bullets</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("raw")}
            className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md transition cursor-pointer ${
              mode === "raw" ? "bg-white text-black shadow-2xs" : "text-gray-500 hover:text-black"
            }`}
          >
            <Type size={12} />
            <span>Raw Text</span>
          </button>
        </div>
      </div>

      {/* Bullets Interactive Mode */}
      {mode === "bullets" ? (
        <div className="space-y-2.5">
          {bullets.map((bullet, idx) => {
            const isLoading = loadingIndex === idx;
            const isMenuOpen = activeWandIndex === idx;

            return (
              <div
                key={idx}
                className="group relative flex items-start gap-2 bg-gray-50/60 hover:bg-white border border-gray-200 focus-within:border-black focus-within:ring-1 focus-within:ring-black rounded-xl p-2.5 transition"
              >
                {/* Bullet indicator */}
                <span className="text-gray-400 font-bold select-none pt-1 text-sm">•</span>

                {/* Textarea for bullet */}
                <textarea
                  rows={2}
                  value={bullet}
                  onFocus={() => setFocusedBulletIndex(idx)}
                  onChange={(e) => handleBulletChange(idx, e.target.value)}
                  placeholder={
                    idx === 0
                      ? "e.g. Engineered REST APIs reducing latency by 35%..."
                      : "Add another impactful achievement..."
                  }
                  className="flex-1 bg-transparent text-xs text-gray-900 outline-none resize-none leading-relaxed placeholder:text-gray-400"
                />

                {/* Actions: Wand AI Assistant & Delete */}
                <div className="flex items-center gap-1 shrink-0 pt-0.5">
                  {/* Wand AI Popover Trigger */}
                  <div className="relative">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => setActiveWandIndex(isMenuOpen ? null : idx)}
                      className={`p-1.5 rounded-lg border transition cursor-pointer ${
                        isMenuOpen
                          ? "bg-black text-white border-black"
                          : "bg-white hover:bg-purple-50 text-purple-600 hover:text-purple-700 border-purple-200/80 shadow-2xs"
                      }`}
                      title="AI Bullet Polish Assistant"
                    >
                      {isLoading ? (
                        <RefreshCw size={13} className="animate-spin text-purple-600" />
                      ) : (
                        <Wand2 size={13} />
                      )}
                    </button>

                    {/* Wand Popover Menu */}
                    {isMenuOpen && (
                      <div
                        ref={wandMenuRef}
                        className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-30 animate-in fade-in zoom-in-95 duration-100 space-y-1"
                      >
                        <div className="px-2 py-1 border-b border-gray-100">
                          <p className="text-[11px] font-bold text-gray-900">AI Bullet Point Polish</p>
                          <p className="text-[10px] text-gray-500">Transform this bullet with career AI</p>
                        </div>

                        {/* Option 1: Add quantifiable impact */}
                        <button
                          type="button"
                          onClick={() => handlePolish(idx, "quantify")}
                          className="w-full flex items-start gap-2.5 p-2 rounded-xl hover:bg-gray-50 text-left transition cursor-pointer group/opt"
                        >
                          <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                            <Sparkles size={13} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900 group-hover/opt:text-black">
                              Add quantifiable impact
                            </p>
                            <p className="text-[10px] text-gray-500 leading-tight">
                              e.g., "Built API" → "Engineered REST APIs reducing latency by 35%"
                            </p>
                          </div>
                        </button>

                        {/* Option 2: Start with strong action verb */}
                        <button
                          type="button"
                          onClick={() => handlePolish(idx, "action_verb")}
                          className="w-full flex items-start gap-2.5 p-2 rounded-xl hover:bg-gray-50 text-left transition cursor-pointer group/opt"
                        >
                          <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                            <Zap size={13} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900 group-hover/opt:text-black">
                              Start with strong action verb
                            </p>
                            <p className="text-[10px] text-gray-500 leading-tight">
                              Rewrite passive phrases with powerful leadership verbs
                            </p>
                          </div>
                        </button>

                        {/* Option 3: Polish clarity & tone */}
                        <button
                          type="button"
                          onClick={() => handlePolish(idx, "polish")}
                          className="w-full flex items-start gap-2.5 p-2 rounded-xl hover:bg-gray-50 text-left transition cursor-pointer group/opt"
                        >
                          <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                            <Wand2 size={13} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900 group-hover/opt:text-black">
                              Polish tone & grammar
                            </p>
                            <p className="text-[10px] text-gray-500 leading-tight">
                              Fix phrasing and maximize professional impact
                            </p>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Delete Bullet Button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteBullet(idx)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                    title="Delete bullet"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add Bullet Button */}
          <button
            type="button"
            onClick={handleAddBullet}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-black border border-dashed border-gray-300 hover:border-black rounded-xl px-3 py-2 w-full justify-center transition cursor-pointer bg-white hover:bg-gray-50"
          >
            <Plus size={13} />
            <span>Add Bullet Point</span>
          </button>
        </div>
      ) : (
        /* Raw Multiline Textarea Mode */
        <div>
          <textarea
            rows={5}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={
              placeholder ||
              "• Spearheaded backend architecture optimization reducing API latency by 35%...\n• Led a team of 4 engineers delivering microservices..."
            }
            className="w-full rounded-xl border border-gray-300 p-3 text-xs text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none transition leading-relaxed"
          />
          <p className="text-[11px] text-gray-400 mt-1">
            Lines starting with • or newlines will be automatically converted into bullets.
          </p>
        </div>
      )}
    </div>
  );
}

export default BulletPointAssistant;
