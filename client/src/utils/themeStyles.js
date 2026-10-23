/**
 * Theme Spacing & Typography Helper
 *
 * Translates theme micro-controls (sectionSpacing, entrySpacing, fontScale, lineHeight, pageMargin)
 * into reactive inline styles and Tailwind classes across all resume templates.
 */

export function getThemeSpacingStyles(theme = {}) {
  // 1. Section vertical margin (in px, default 20px)
  const sectionSpacingVal =
    typeof theme.sectionSpacing === "number" ? theme.sectionSpacing : 20;

  // 2. Entry vertical spacing between jobs/schools/projects (in px, default 14px)
  const entrySpacingVal =
    typeof theme.entrySpacing === "number" ? theme.entrySpacing : 14;

  // 3. Body Font Size Scale (Compact 9pt / Normal 10pt / Spacious 11pt)
  let fontScaleClass = "text-[12.5px]";
  let headingBaseClass = "text-xs";
  if (theme.fontScale === "compact") {
    fontScaleClass = "text-[11px]";
    headingBaseClass = "text-[11px]";
  } else if (theme.fontScale === "spacious") {
    fontScaleClass = "text-[14px]";
    headingBaseClass = "text-sm";
  }

  // 4. Line Height
  let lineHeightClass = "leading-normal";
  if (theme.lineHeight === "tight") {
    lineHeightClass = "leading-tight";
  } else if (theme.lineHeight === "relaxed") {
    lineHeightClass = "leading-relaxed";
  } else if (theme.lineHeight === "loose") {
    lineHeightClass = "leading-loose";
  }

  // 5. Outer Page Margin
  let pageMarginClass = "p-8 sm:p-12";
  if (theme.pageMargin === "compact") {
    pageMarginClass = "p-5 sm:p-7";
  } else if (theme.pageMargin === "spacious") {
    pageMarginClass = "p-10 sm:p-16";
  }

  return {
    sectionSpacingVal,
    entrySpacingVal,
    sectionStyle: { marginBottom: `${sectionSpacingVal}px` },
    entryStyle: { marginBottom: `${entrySpacingVal}px` },
    entryGapStyle: { gap: `${entrySpacingVal}px` },
    fontScaleClass,
    headingBaseClass,
    lineHeightClass,
    pageMarginClass,
  };
}

/**
 * Pre-defined spacing presets
 */
export const SPACING_PRESETS = {
  fitToOnePage: {
    fontScale: "compact", // 9pt
    lineHeight: "tight", // 1.25
    sectionSpacing: 12, // 12px
    entrySpacing: 8, // 8px
    pageMargin: "compact", // 15mm
  },
  defaultBalanced: {
    fontScale: "normal", // 10pt
    lineHeight: "normal", // 1.45
    sectionSpacing: 20, // 20px
    entrySpacing: 14, // 14px
    pageMargin: "normal", // 20mm
  },
  spacious: {
    fontScale: "spacious", // 11pt
    lineHeight: "relaxed", // 1.65
    sectionSpacing: 26, // 26px
    entrySpacing: 18, // 18px
    pageMargin: "spacious", // 25mm
  },
};

/**
 * Calculate dynamic contrast text color (dark charcoal or pure white) based on background hex
 * Uses standard ITU-R BT.709 / YIQ relative luminance formula
 */
export function getContrastTextColor(hexColor) {
  if (!hexColor || typeof hexColor !== "string") return "#FFFFFF";
  let cleanHex = hexColor.replace("#", "").trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (cleanHex.length !== 6) return "#FFFFFF";

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) return "#FFFFFF";

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 160 ? "#111827" : "#FFFFFF";
}

