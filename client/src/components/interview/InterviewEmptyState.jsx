import { Inbox } from "lucide-react";

function InterviewEmptyState({
  icon: Icon = Inbox,
  title = "No data found",
  description = "Get started by taking your first interview.",
  actionButton = null,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center max-w-lg mx-auto shadow-sm">
      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto text-gray-500 mb-3">
        <Icon size={22} />
      </div>

      <h3 className="text-sm font-semibold text-gray-900">
        {title}
      </h3>

      <p className="text-xs text-gray-500 mt-1 mb-5 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>

      {actionButton && <div>{actionButton}</div>}
    </div>
  );
}

export default InterviewEmptyState;
