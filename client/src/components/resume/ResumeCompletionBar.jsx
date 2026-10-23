import React from "react";
import { useResume } from "../../context/ResumeContext";

export function ResumeCompletionBar() {
  const { calculateCompletion } = useResume();
  const percentage = calculateCompletion();

  return (
    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-xs">
      <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">
        Completion: <strong className="text-black font-bold">{percentage}%</strong>
      </span>
      <div className="w-28 h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
        <div
          style={{ width: `${percentage}%` }}
          className="h-full bg-black rounded-full transition-all duration-500"
        />
      </div>
    </div>
  );
}

export default ResumeCompletionBar;
