import { Award, CheckCircle2, XCircle, HelpCircle, Clock, Percent } from "lucide-react";
import { formatTime } from "../../utils/aptitudeScoring";

function TestSummary({ result }) {
  if (!result) return null;

  const {
    totalQuestions = 0,
    attempted = 0,
    correct = 0,
    incorrect = 0,
    unanswered = 0,
    score = 0,
    scorePercentage = 0,
    accuracy = 0,
    timeSpentSeconds = 0,
  } = result;

  const stats = [
    {
      label: "Score",
      value: `${score} / ${totalQuestions}`,
      icon: Award,
      subtext: `${scorePercentage}% of total marks`,
      color: "text-gray-900",
    },
    {
      label: "Accuracy",
      value: `${accuracy}%`,
      icon: Percent,
      subtext: `${correct} of ${attempted} attempted`,
      color: "text-emerald-700",
    },
    {
      label: "Time Taken",
      value: formatTime(timeSpentSeconds),
      icon: Clock,
      subtext: "Total test duration",
      color: "text-gray-900",
    },
    {
      label: "Correct",
      value: correct,
      icon: CheckCircle2,
      subtext: "+1 mark each",
      color: "text-emerald-600",
    },
    {
      label: "Incorrect",
      value: incorrect,
      icon: XCircle,
      subtext: "0 marks each",
      color: "text-rose-600",
    },
    {
      label: "Unanswered",
      value: unanswered,
      icon: HelpCircle,
      subtext: "0 marks each",
      color: "text-gray-500",
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-gray-100 gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Performance Overview
          </span>
          <h2 className="text-xl font-bold text-gray-900 mt-0.5">
            Test Score & Accuracy
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-800">
            Formula: Accuracy = (Correct / Attempted) × 100
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mt-5">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[11px] font-medium">{item.label}</span>
                <Icon size={14} className={item.color} />
              </div>
              <div className="mt-2">
                <p className={`text-xl font-bold tracking-tight ${item.color}`}>
                  {item.value}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {item.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TestSummary;
