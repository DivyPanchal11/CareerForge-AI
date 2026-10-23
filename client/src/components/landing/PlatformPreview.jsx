import { useState } from "react";
import {
  Video,
  Brain,
  FileText,
  UserCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";

function PlatformPreview() {
  const [activeTab, setActiveTab] = useState("interview");

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-800 mb-3">
            <span>Inside the Application</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            A Closer Look at the CareerForge-AI Interface
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Explore the authentic interfaces designed to help university students
            practice effectively for technical placements.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-center mb-8 overflow-x-auto pb-2">
          <div
            role="tablist"
            aria-label="Application Module Previews"
            className="inline-flex p-1.5 bg-gray-100 rounded-xl max-w-full space-x-1 sm:space-x-2"
          >
            <button
              type="button"
              role="tab"
              id="tab-interview"
              aria-selected={activeTab === "interview"}
              aria-controls="panel-interview"
              onClick={() => setActiveTab("interview")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                activeTab === "interview"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Video size={15} />
              <span>Interview Session</span>
            </button>

            <button
              type="button"
              role="tab"
              id="tab-aptitude"
              aria-selected={activeTab === "aptitude"}
              aria-controls="panel-aptitude"
              onClick={() => setActiveTab("aptitude")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                activeTab === "aptitude"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Brain size={15} />
              <span>Aptitude Practice</span>
            </button>

            <button
              type="button"
              role="tab"
              id="tab-resume"
              aria-selected={activeTab === "resume"}
              aria-controls="panel-resume"
              onClick={() => setActiveTab("resume")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                activeTab === "resume"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FileText size={15} />
              <span>Resume Builder</span>
            </button>

            <button
              type="button"
              role="tab"
              id="tab-dashboard"
              aria-selected={activeTab === "dashboard"}
              aria-controls="panel-dashboard"
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                activeTab === "dashboard"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <UserCheck size={15} />
              <span>Profile & Readiness</span>
            </button>
          </div>
        </div>

        {/* Tab Preview Display Window */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Mock Browser Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gray-300" />
              <span className="w-3 h-3 rounded-full bg-gray-300" />
              <span className="w-3 h-3 rounded-full bg-gray-300" />
              <span className="ml-3 font-mono text-xs text-gray-500 hidden sm:inline">
                careerforge.ai/{activeTab === "interview" ? "interviews" : activeTab === "aptitude" ? "aptitude" : activeTab === "resume" ? "resumes" : "dashboard"}
              </span>
            </div>
            <span className="text-xs font-medium text-gray-600">
              Live Application Mockup
            </span>
          </div>

          {/* Tab 1: Interview Preview */}
          {activeTab === "interview" && (
            <div
              role="tabpanel"
              id="panel-interview"
              aria-labelledby="tab-interview"
              tabIndex={0}
              className="p-6 sm:p-8 bg-gray-50/40 space-y-6 focus-visible:outline-none"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Question 2 of 5
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">
                    Frontend Developer Technical Assessment
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-gray-200 text-xs font-medium text-gray-700">
                    <Clock size={13} />
                    <span>02:45 remaining</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-black text-white text-xs font-semibold">
                    <Sparkles size={13} />
                    <span>AI Evaluation</span>
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Question Prompt
                </p>
                <p className="text-sm font-medium text-gray-900 leading-relaxed">
                  "Explain how the Virtual DOM works in React, and how React 19's new compiler optimizations change reconciliation compared to standard DOM operations."
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-xs text-gray-500">Evaluation Criteria</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    Technical Depth & Clarity
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-xs text-gray-500">Role Context</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    Full-Stack / Frontend SDE
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-xs text-gray-500">Feedback Type</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    Instant AI Review & Scoring
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Aptitude Preview */}
          {activeTab === "aptitude" && (
            <div
              role="tabpanel"
              id="panel-aptitude"
              aria-labelledby="tab-aptitude"
              tabIndex={0}
              className="p-6 sm:p-8 bg-gray-50/40 space-y-6 focus-visible:outline-none"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Aptitude Syllabus
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">
                    Quantitative, Logical & Verbal Modules
                  </h3>
                </div>
                <Link
                  to="/aptitude"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-900 hover:text-black"
                >
                  <span>Browse Topics</span>
                  <ChevronRight size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-900 mb-3">
                    <Brain size={16} />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">Quantitative</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Percentages, Profit & Loss, Time & Work, Speed & Distance
                  </p>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                    <span>16 Topics</span>
                    <span className="font-semibold text-gray-900">Formulas + Tests</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-900 mb-3">
                    <Award size={16} />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">Logical Reasoning</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Syllogisms, Blood Relations, Seating Arrangements, Puzzles
                  </p>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                    <span>14 Topics</span>
                    <span className="font-semibold text-gray-900">Step Explanations</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-900 mb-3">
                    <BookOpen size={16} />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">Verbal Ability</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Sentence Correction, Reading Comprehension, Para Jumbles
                  </p>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                    <span>12 Topics</span>
                    <span className="font-semibold text-gray-900">Timed Practice</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Resume Preview */}
          {activeTab === "resume" && (
            <div
              role="tabpanel"
              id="panel-resume"
              aria-labelledby="tab-resume"
              tabIndex={0}
              className="p-6 sm:p-8 bg-gray-50/40 space-y-6 focus-visible:outline-none"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Resume Builder
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">
                    ATS-Optimized Formatting & Real-Time Preview
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                    ATS Ready
                  </span>
                  <span className="px-3 py-1 rounded-md bg-white border border-gray-200 text-xs font-medium text-gray-700">
                    PDF Export
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs">
                <div className="max-w-xl mx-auto space-y-4 text-left border-l-2 border-black pl-4">
                  <div>
                    <h4 className="text-base font-bold text-gray-900">
                      Sarthak Mehta
                    </h4>
                    <p className="text-xs text-gray-600">
                      Full-Stack Software Engineer • Placement Candidate
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Education & Core Skills
                    </p>
                    <p className="text-xs text-gray-700 mt-0.5">
                      B.Tech Computer Science | React, Node.js, Express, MongoDB, Tailwind CSS
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Featured Project
                    </p>
                    <p className="text-xs text-gray-700 mt-0.5">
                      CareerForge-AI: Comprehensive placement preparation platform featuring AI interview mock evaluations, structured aptitude tests, and resume compilation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Dashboard Preview */}
          {activeTab === "dashboard" && (
            <div
              role="tabpanel"
              id="panel-dashboard"
              aria-labelledby="tab-dashboard"
              tabIndex={0}
              className="p-6 sm:p-8 bg-gray-50/40 space-y-6 focus-visible:outline-none"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Centralized Hub
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">
                    Student Career Overview & Readiness
                  </h3>
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-gray-100 rounded-md text-gray-800">
                  Target: Campus Drives
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-500">
                      Profile Completion
                    </span>
                    <span className="text-xs font-bold text-gray-900">85%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-black rounded-full w-[85%]" />
                  </div>
                  <p className="text-xs text-gray-600">
                    Personal, academic records, and career preferences saved.
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-500">
                      Preparation Milestones
                    </span>
                    <CheckCircle2 size={16} className="text-gray-900" />
                  </div>
                  <ul className="text-xs text-gray-600 space-y-1.5">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Quantitative Aptitude Practice</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Technical Mock Session Completed</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Resume Generated and Verified</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default PlatformPreview;
