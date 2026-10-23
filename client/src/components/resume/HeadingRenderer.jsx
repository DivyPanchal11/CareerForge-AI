import React from "react";
import { getContrastTextColor } from "../../utils/themeStyles";

export function HeadingRenderer({
  title,
  icon: Icon,
  theme = {},
  headingTextColor = "#111827",
  headingBorderColor = "#E5E7EB",
  className = "",
}) {
  const headingStyle = theme.headingStyle || "line-bottom"; // 'line-bottom' | 'left-bar' | 'pill' | 'minimal'
  const capitalization = theme.capitalization === "capitalize" ? "capitalize" : "uppercase";
  const iconMode = theme.headingIcons || "none"; // 'none' | 'outline' | 'filled'
  const accentColor = theme.primaryColor || "#000000";
  const contrastColor = getContrastTextColor(accentColor);

  const renderIcon = () => {
    if (!Icon || iconMode === "none") return null;
    if (iconMode === "filled") {
      return (
        <span
          className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mr-1.5 shadow-2xs"
          style={{ backgroundColor: accentColor, color: contrastColor }}
        >
          <Icon size={11} strokeWidth={2.5} />
        </span>
      );
    }
    // outline
    return (
      <span className="shrink-0 mr-1.5" style={{ color: accentColor }}>
        <Icon size={14} strokeWidth={2.2} />
      </span>
    );
  };

  // 1. Left Bar Accent Style (FlowCV favorite)
  if (headingStyle === "left-bar") {
    return (
      <div
        className={`resume-heading-block flex items-center pl-2.5 py-0.5 border-l-4 mb-2.5 ${className}`}
        style={{ borderLeftColor: accentColor }}
      >
        {renderIcon()}
        <h2
          className={`text-xs font-bold tracking-wider ${capitalization}`}
          style={{ color: headingTextColor }}
        >
          {title}
        </h2>
      </div>
    );
  }

  // 2. Solid Pill / Badge Accent Style
  if (headingStyle === "pill") {
    return (
      <div className={`resume-heading-block mb-2.5 ${className}`}>
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold shadow-2xs"
          style={{ backgroundColor: accentColor, color: contrastColor }}
        >
          {Icon && iconMode !== "none" && <Icon size={12} strokeWidth={2.5} />}
          <span className={capitalization}>{title}</span>
        </div>
      </div>
    );
  }

  // 3. Minimal Clean Text Style (no lines or pills)
  if (headingStyle === "minimal") {
    return (
      <div className={`resume-heading-block flex items-center mb-1.5 ${className}`}>
        {renderIcon()}
        <h2
          className={`text-xs font-extrabold tracking-wider ${capitalization}`}
          style={{ color: headingTextColor }}
        >
          {title}
        </h2>
      </div>
    );
  }

  // 4. Default: Line Bottom (Underline across width)
  return (
    <div
      className={`resume-heading-block flex items-center border-b pb-1 mb-2.5 ${className}`}
      style={{ borderBottomColor: headingBorderColor }}
    >
      {renderIcon()}
      <h2
        className={`text-xs font-bold tracking-wider ${capitalization}`}
        style={{ color: headingTextColor }}
      >
        {title}
      </h2>
    </div>
  );
}

export default HeadingRenderer;
