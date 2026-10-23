import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Video,
  Brain,
  FileText,
  UserCheck,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

function HeroSection() {
  const scrollToFeatures = () => {
    const element = document.getElementById("features");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative bg-white pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline and Call-to-Actions */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Value Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Placement Preparation Platform</span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-600 font-normal">All-in-One Toolkit</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.12]">
              Prepare Smarter. <br className="hidden sm:inline" />
              <span className="text-gray-900">Interview Better.</span> <br />
              <span className="text-gray-600">Build Your Career.</span>
            </h1>

            {/* Supporting Text */}
            <p className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg text-gray-600 leading-relaxed">
              Everything you need to prepare for placements in one place. Practice
              aptitude, improve your interview skills, and build a professional
              resume with CareerForge-AI.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <Link
                to="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-black hover:bg-gray-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all duration-150 active:scale-98"
              >
                <span>Get Started</span>
                <ArrowRight size={16} />
              </Link>

              <button
                type="button"
                onClick={scrollToFeatures}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm rounded-xl border border-gray-200 shadow-2xs transition-colors cursor-pointer"
              >
                <span>Explore Features</span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            </div>

            {/* Trust highlights */}
            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-gray-900" />
                <span>AI-guided Mock Interviews</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-gray-900" />
                <span>Topic-wise Aptitude Tests</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-gray-900" />
                <span>ATS Resume Builder</span>
              </div>
            </div>
          </div>

          {/* Right Column: Platform Preview Mockup */}
          <div className="lg:col-span-5 w-full">
            <div className="mx-auto max-w-lg lg:max-w-none">
              {/* Main Preview Container */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Window Top Bar */}
                <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                    <span className="ml-2 text-[11px] font-mono text-gray-500">
                      app.careerforge.ai/dashboard
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-gray-200 text-[10px] font-medium text-gray-600">
                    <Sparkles size={11} className="text-gray-900" />
                    <span>AI Ready</span>
                  </div>
                </div>

                {/* Simulated Dashboard Content */}
                <div className="p-4 sm:p-5 space-y-3.5 bg-gray-50/50">
                  {/* Student Welcome Header Banner */}
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-900">
                        Placement Readiness Hub
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Track, practice, and prepare for upcoming drives
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-[10px] font-semibold text-gray-800">
                        Active Prep
                      </span>
                    </div>
                  </div>

                  {/* 2-Column Mini Cards: Interview & Aptitude */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Interview Readiness Card */}
                    <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center text-white">
                          <Video size={14} />
                        </div>
                        <span className="text-xs font-bold text-gray-900">
                          72%
                        </span>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-gray-900">
                          Interview Readiness
                        </div>
                        <p className="text-[10px] text-gray-500">
                          Technical & HR Mock
                        </p>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-black rounded-full w-[72%]" />
                      </div>
                    </div>

                    {/* Aptitude Mastery Card */}
                    <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center text-white">
                          <Brain size={14} />
                        </div>
                        <span className="text-xs font-bold text-gray-900">
                          68%
                        </span>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-gray-900">
                          Aptitude Progress
                        </div>
                        <p className="text-[10px] text-gray-500">
                          Quant, Logic, Verbal
                        </p>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-800 rounded-full w-[68%]" />
                      </div>
                    </div>
                  </div>

                  {/* Resume & Profile Mini Previews */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Resume Card */}
                    <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-800 shrink-0">
                        <FileText size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-gray-900 truncate">
                          ATS Resume
                        </p>
                        <p className="text-[10px] text-emerald-600 font-medium">
                          Score: 84 / 100
                        </p>
                      </div>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-800 shrink-0">
                        <UserCheck size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-gray-900 truncate">
                          Profile Status
                        </p>
                        <p className="text-[10px] text-gray-500">
                          Complete & Ready
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mini Activity Bar */}
                  <div className="bg-gray-100/80 rounded-lg p-2.5 flex items-center justify-between text-[11px] text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp size={13} className="text-gray-900" />
                      <span>Regular Practice Boosts Placement Confidence</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
