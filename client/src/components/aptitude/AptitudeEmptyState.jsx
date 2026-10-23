import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

function AptitudeEmptyState({
  title = "No Aptitude Activity Yet",
  description = "Start practicing topic-wise questions or take a timed assessment to build your performance profile.",
  actionText = "Browse Topics",
  actionLink = "/aptitude/topics",
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 text-center shadow-sm flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 mb-3.5">
        <HelpCircle size={22} />
      </div>

      <h3 className="text-base font-bold text-gray-900">
        {title}
      </h3>

      <p className="text-xs text-gray-500 mt-1 max-w-md leading-relaxed">
        {description}
      </p>

      {actionLink && (
        <Link
          to={actionLink}
          className="mt-5 px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-900 text-xs font-semibold transition active:scale-95 shadow-xs"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}

export default AptitudeEmptyState;
