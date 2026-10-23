import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";

function LandingFooter() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2.5 focus:outline-hidden"
            >
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
                <Rocket size={16} />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                CareerForge-AI
              </span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
              A comprehensive placement preparation platform helping university
              students sharpen problem-solving skills, rehearse technical & HR
              interviews, and craft professional ATS resumes.
            </p>
          </div>

          {/* Platform Preparation Links */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Preparation Modules
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/interviews"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  Interview Preparation
                </Link>
              </li>
              <li>
                <Link
                  to="/aptitude"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  Aptitude Preparation
                </Link>
              </li>
              <li>
                <Link
                  to="/resumes"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  Your Career Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  Student Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="text-gray-600 hover:text-black transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("features")}
                  className="text-gray-600 hover:text-black transition-colors cursor-pointer"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-gray-600 hover:text-black transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Access / Account */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Account
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  Log In
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Dynamic Year */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            &copy; {currentYear} CareerForge-AI. All rights reserved.
          </p>
          <p className="text-gray-400">
            Dedicated to student placement readiness.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
