import React from "react";
import { HighlightText } from "./HighlightText";
import { getContrastTextColor } from "../../utils/themeStyles";

const LEVEL_MAP = {
  Beginner: { dots: 2, percent: 35 },
  Intermediate: { dots: 3, percent: 60 },
  Advanced: { dots: 4, percent: 85 },
  Expert: { dots: 5, percent: 100 },
  Master: { dots: 5, percent: 100 },
};

export function SkillsRenderer({ skills = [], theme = {}, highlightKeywords = [] }) {
  if (!skills || skills.length === 0) return null;

  const style = theme.skillDisplay || theme.skillStyle || "pills"; // 'pills' | 'dots' | 'bars' | 'text' | 'compact'
  const primaryColor = theme.primaryColor || "#000000";
  const delimiter = theme.skillDelimiter || "pipe"; // 'pipe' | 'bullet' | 'comma'
  const isCategorized = theme.skillGrouping === "categorized" || theme.groupSkillsByCategory;
  const isFilledPill = theme.skillBadgeStyle === "filled" || theme.accentTargets?.skills;
  const contrastColor = getContrastTextColor(primaryColor);

  const H = (text) => <HighlightText text={text} keywords={highlightKeywords} />;

  // Helper to render skills for a single group or flat list
  const renderSkillList = (list) => {
    // 1. Proficiency Dots
    if (style === "dots") {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 pt-0.5">
          {list.map((skill) => {
            const lvl = LEVEL_MAP[skill.level] || { dots: 3, percent: 60 };
            return (
              <div
                key={skill.id || Math.random()}
                className="flex items-center justify-between text-[11px] py-0.5 border-b border-gray-100"
              >
                <span className="font-semibold text-gray-900 truncate mr-2">
                  {H(skill.name)}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  {[1, 2, 3, 4, 5].map((i) => {
                    const isFilled = i <= lvl.dots;
                    return (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full transition-colors"
                        style={{
                          backgroundColor: isFilled ? primaryColor : "#E5E7EB",
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // 2. Progress Bars
    if (style === "bars") {
      return (
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 pt-0.5">
          {list.map((skill) => {
            const lvl = LEVEL_MAP[skill.level] || { dots: 3, percent: 60 };
            return (
              <div key={skill.id || Math.random()} className="space-y-1 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 truncate">
                    {H(skill.name)}
                  </span>
                  <span className="text-[10px] text-gray-400 shrink-0 font-medium ml-1">
                    {skill.level || "Intermediate"}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${lvl.percent}%`,
                      backgroundColor: primaryColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // 3. Clean Text / Delimited list
    if (style === "text" || style === "compact" || style === "pipe") {
      const sep = delimiter === "bullet" ? " • " : delimiter === "comma" ? ", " : " | ";
      return (
        <div className="text-[11.5px] leading-relaxed text-gray-800">
          {list.map((skill, index) => (
            <React.Fragment key={skill.id || Math.random()}>
              <span className="font-medium text-gray-900">{H(skill.name)}</span>
              {skill.level && skill.level !== "Intermediate" && (
                <span className="text-gray-400 text-[10px] ml-0.5">({skill.level})</span>
              )}
              {index < list.length - 1 && (
                <span className="text-gray-400 font-bold mx-1.5 select-none">{sep}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      );
    }

    // 4. Default: Tag Pills (with dynamic contrast if filled with primary accent)
    return (
      <div className="flex flex-wrap gap-1.5 pt-0.5">
        {list.map((skill) => (
          <span
            key={skill.id || Math.random()}
            className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium inline-flex items-center gap-1 shadow-2xs transition-colors ${
              isFilledPill ? "" : "bg-gray-100/90 border border-gray-200/90 text-gray-800"
            }`}
            style={
              isFilledPill
                ? {
                    backgroundColor: primaryColor,
                    color: contrastColor,
                  }
                : {}
            }
          >
            <span>{H(skill.name)}</span>
            {theme.showSkillLevel && skill.level && (
              <span
                className={`text-[9px] font-normal ${
                  isFilledPill ? "opacity-80" : "text-gray-400"
                }`}
              >
                • {skill.level}
              </span>
            )}
          </span>
        ))}
      </div>
    );
  };

  // Grouped / Categorized Skills Rendering
  if (isCategorized) {
    // Group skills by category
    const groups = {};
    skills.forEach((skill) => {
      const cat = skill.category && skill.category.trim() ? skill.category.trim() : "Other / Core";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(skill);
    });

    const categoryNames = Object.keys(groups);

    return (
      <div className="space-y-2.5 pt-0.5">
        {categoryNames.map((category) => (
          <div key={category} className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-900 tracking-tight">
                {category}
              </span>
              <div className="flex-1 h-[1px] bg-gray-100" />
            </div>
            {renderSkillList(groups[category])}
          </div>
        ))}
      </div>
    );
  }

  // Flat rendering (default)
  return renderSkillList(skills);
}

export default SkillsRenderer;
