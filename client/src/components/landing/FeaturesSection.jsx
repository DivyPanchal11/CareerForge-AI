import { Link } from "react-router-dom";
import {
  Video,
  Brain,
  FileText,
  User,
  ArrowRight,
  Check,
} from "lucide-react";

const FEATURES = [
  {
    id: "interview-prep",
    title: "Interview Preparation",
    description:
      "Practice interview questions and review your answers to improve your technical and communication skills.",
    icon: Video,
    route: "/interviews",
    cta: "Explore Interview Prep",
    highlights: [
      "Role-tailored technical & behavioral questions",
      "Realistic interview flow with timer management",
      "Detailed answer evaluation and feedback",
    ],
    tag: "AI Assisted",
  },
  {
    id: "aptitude-prep",
    title: "Aptitude Preparation",
    description:
      "Learn important concepts, review formulas, practise questions, and evaluate your performance.",
    icon: Brain,
    route: "/aptitude",
    cta: "Explore Aptitude",
    highlights: [
      "Quantitative, Logical, and Verbal reasoning",
      "Formula cheat sheets and topic-by-topic tutorials",
      "Practice drills and timed assessment tests",
    ],
    tag: "Core Syllabus",
  },
  {
    id: "resume-builder",
    title: "Resume Builder",
    description:
      "Create and organize your professional resume using the resume building capabilities available in CareerForge-AI.",
    icon: FileText,
    route: "/resumes",
    cta: "Build Your Resume",
    highlights: [
      "Clean, modern, ATS-friendly templates",
      "Live side-by-side editing and preview",
      "Direct PDF download and sharing link generation",
    ],
    tag: "Career Ready",
  },
  {
    id: "career-profile",
    title: "Your Career Profile",
    description:
      "Organize your personal, educational, and career preference information in one place.",
    icon: User,
    route: "/profile",
    cta: "Complete Your Profile",
    highlights: [
      "Academic records, project showcase, and skill inventory",
      "Target roles, preferred locations, and industry domains",
      "Trackable profile completeness meter",
    ],
    tag: "Centralized",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-800 mb-3">
            <span>Modular Toolkit</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            Comprehensive Career Preparation Features
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-600">
            Each module is tailored to address the core phases of placement recruitment,
            giving you the structure needed to succeed.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs hover:border-gray-400 transition-all duration-200 flex flex-col justify-between h-full"
              >
                <div className="flex-1 flex flex-col">
                  {/* Top Bar inside card */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
                      <Icon size={22} />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-gray-100 text-gray-700">
                      {feature.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2.5">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* Feature Highlights List */}
                  <ul className="space-y-2.5 mb-8 border-t border-gray-100 pt-5 mt-auto">
                    {feature.highlights.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600">
                        <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5 text-gray-900">
                          <Check size={11} strokeWidth={3} />
                        </div>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card CTA Link */}
                <div className="pt-4 border-t border-gray-100">
                  <Link
                    to={feature.route}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-black group-hover:translate-x-0.5 transition-all"
                  >
                    <span>{feature.cta}</span>
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
