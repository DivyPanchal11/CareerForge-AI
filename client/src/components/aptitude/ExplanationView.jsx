import { useState, useMemo } from "react";
import {
  BookOpen,
  MessageSquare,
  Copy,
  Check,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

/**
 * Stacked vertical fraction component (e.g. 50 over 3)
 */
function StackedFraction({ num, den }) {
  return (
    <span className="inline-flex flex-col items-center justify-center align-middle mx-1 text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
      <span className="border-b border-gray-800 px-1 pb-0.5 text-center whitespace-nowrap">
        {num}
      </span>
      <span className="pt-0.5 px-1 text-center whitespace-nowrap">
        {den}
      </span>
    </span>
  );
}

/**
 * Parenthesized container with tall math brackets that vertically fit stacked fractions
 */
function MathParentheses({ children }) {
  return (
    <span className="inline-flex items-center align-middle mx-1">
      <span className="text-2xl sm:text-3xl font-light text-gray-600 select-none leading-none -mr-0.5">
        (
      </span>
      <span className="inline-flex items-center px-0.5 text-sm sm:text-base font-medium text-gray-900">
        {children}
      </span>
      <span className="text-2xl sm:text-3xl font-light text-gray-600 select-none leading-none -ml-0.5">
        )
      </span>
    </span>
  );
}

/**
 * Parses expression inside parentheses and renders embedded fractions
 */
function renderParenExpression(expr) {
  // Check if expression contains a fraction like "60 x 5/18" or "50/3 x 9" or "450 / 600"
  const fracMatch = expr.match(/^(.*?)([\w\s\d.-]+?)\s*\/\s*([\w\s\d.-]+?)(.*)$/);
  if (!fracMatch) {
    return expr;
  }

  const prefix = fracMatch[1];
  const num = fracMatch[2].trim();
  const den = fracMatch[3].trim();
  const suffix = fracMatch[4];

  return (
    <>
      {prefix && <span>{prefix}</span>}
      <StackedFraction num={num} den={den} />
      {suffix && <span>{suffix}</span>}
    </>
  );
}

/**
 * Renders a single math / explanation line with fractions and symbols
 */
function MathLine({ line }) {
  // If line contains parenthesized expressions: ( ... )
  const parenRegex = /\(([^()]+)\)/g;
  let lastIndex = 0;
  let match;
  const nodes = [];

  while ((match = parenRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        <span key={`text-${lastIndex}`}>
          {line.slice(lastIndex, match.index)}
        </span>
      );
    }

    const inner = match[1];
    if (inner.includes("/")) {
      nodes.push(
        <MathParentheses key={`paren-${match.index}`}>
          {renderParenExpression(inner)}
        </MathParentheses>
      );
    } else {
      nodes.push(
        <span key={`raw-paren-${match.index}`} className="font-medium text-gray-900">
          ({inner})
        </span>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < line.length) {
    nodes.push(
      <span key={`text-${lastIndex}`}>
        {line.slice(lastIndex)}
      </span>
    );
  }

  return (
    <div className="flex items-center flex-wrap gap-y-2 text-sm sm:text-base text-gray-900 leading-relaxed font-normal">
      {nodes.length > 0 ? nodes : <span>{line}</span>}
    </div>
  );
}

/**
 * Splits explanation into natural step-by-step lines matching IndiaBIX / classic textbook style
 */
function splitExplanationToLines(text) {
  if (!text) return [];
  const clean = text.trim();

  // 1. Chained equations: e.g. "Percentage = (Marks Scored / Total Marks) × 100 = (450 / 600) × 100 = 0.75 × 100 = 75%."
  const eqCount = (clean.match(/=/g) || []).length;
  if (eqCount >= 2 && !clean.includes("\n") && !/[.!?]\s+[A-Z]/.test(clean)) {
    const parts = clean.split(/\s*=\s*/);
    if (parts.length >= 3) {
      const lines = [];
      lines.push(`${parts[0]} = ${parts[1]}`);

      for (let i = 2; i < parts.length; i++) {
        const isLast = i === parts.length - 1;
        const val = parts[i].replace(/\.$/, "").trim();
        if (isLast) {
          lines.push(`∴ ${parts[0]} = ${val}.`);
        } else {
          lines.push(`= ${val}`);
        }
      }
      return lines;
    }
  }

  // 2. Multi-sentence / multi-line explanations
  const sentences = clean
    .split(/(?<=[.!?])\s+(?=[A-Z0-9\u2234])|\n+/g)
    .map((s) => s.trim())
    .filter(Boolean);

  // If a sentence contains a chained equation, split it
  const finalLines = [];
  sentences.forEach((sentence) => {
    const sEqCount = (sentence.match(/=/g) || []).length;
    if (sEqCount >= 2) {
      const parts = sentence.split(/\s*=\s*/);
      if (parts.length >= 3) {
        finalLines.push(`${parts[0]} = ${parts[1]}`);
        for (let j = 2; j < parts.length; j++) {
          const isLast = j === parts.length - 1;
          const val = parts[j].replace(/\.$/, "").trim();
          if (isLast) {
            finalLines.push(`∴ ${parts[0]} = ${val}.`);
          } else {
            finalLines.push(`= ${val}`);
          }
        }
        return;
      }
    }
    finalLines.push(sentence);
  });

  return finalLines;
}

/**
 * Authentic IndiaBIX / Placement Textbook style explanation view
 */
function ExplanationView({
  explanation,
  correctOptionId,
  correctOptionText,
}) {
  const [copied, setCopied] = useState(false);

  const lines = useMemo(() => splitExplanationToLines(explanation), [explanation]);

  if (!explanation) return null;

  const handleCopy = () => {
    const textToCopy = `Explanation:\n${lines.join("\n")}${
      correctOptionId ? `\nCorrect Option: (${correctOptionId}) ${correctOptionText || ""}` : ""
    }`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Explanation copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleActionToast = (actionName) => {
    toast(`${actionName} recorded.`, { icon: "ℹ️" });
  };

  return (
    <div className="mt-4 pt-3 pb-2 text-left bg-white font-sans">
      {/* Green Header */}
      <h4 className="text-[#2e7d32] font-bold text-sm sm:text-base mb-4 tracking-normal">
        Explanation:
      </h4>

      {/* Step by Step Lines */}
      <div className="space-y-4 text-gray-900 mb-6 pl-0.5">
        {lines.map((line, idx) => (
          <MathLine key={idx} line={line} />
        ))}
      </div>

      {/* Bottom Action Icon Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={() => handleActionToast("Added to Study List")}
          className="w-8 h-8 rounded-md border border-gray-300 bg-white flex items-center justify-center text-gray-600 hover:border-gray-500 hover:text-black transition shadow-2xs"
          title="Read concept notes"
        >
          <BookOpen size={15} />
        </button>

        <button
          type="button"
          onClick={() => handleActionToast("Community discussions")}
          className="w-8 h-8 rounded-md border border-gray-300 bg-white flex items-center justify-center text-gray-600 hover:border-gray-500 hover:text-black transition shadow-2xs"
          title="View Discussion"
        >
          <MessageSquare size={15} />
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="w-8 h-8 rounded-md border border-gray-300 bg-white flex items-center justify-center text-gray-600 hover:border-gray-500 hover:text-black transition shadow-2xs"
          title="Copy explanation"
        >
          {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
        </button>

        <button
          type="button"
          onClick={() => handleActionToast("Question reported")}
          className="w-8 h-8 rounded-md border border-gray-300 bg-white flex items-center justify-center text-gray-600 hover:border-gray-500 hover:text-black transition shadow-2xs"
          title="Report issue"
        >
          <AlertTriangle size={15} />
        </button>
      </div>
    </div>
  );
}

export default ExplanationView;
