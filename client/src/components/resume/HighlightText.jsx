import React from "react";

/**
 * HighlightText Component
 *
 * Renders text with keyword matches highlighted in green.
 * When no keywords are provided, renders the text as-is with zero overhead.
 *
 * @param {Object} props
 * @param {string} props.text - The text to render
 * @param {string[]} props.keywords - Array of lowercase keywords to highlight
 */
export function HighlightText({ text, keywords }) {
  // Fast path: no text or no keywords — render plain text
  if (!text || !keywords || keywords.length === 0) {
    return text || null;
  }

  // Build a single regex that matches any keyword (longest first for greedy match)
  const sorted = [...keywords].sort((a, b) => b.length - a.length);
  const escaped = sorted.map((kw) => kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");

  const parts = text.split(pattern);
  if (parts.length === 1) return text; // No matches found

  return (
    <>
      {parts.map((part, i) => {
        const isMatch = keywords.includes(part.toLowerCase());
        return isMatch ? (
          <mark
            key={i}
            className="bg-green-200/70 text-green-900 rounded-[2px] px-[1px]"
            style={{ textDecoration: "none" }}
          >
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        );
      })}
    </>
  );
}

export default HighlightText;
