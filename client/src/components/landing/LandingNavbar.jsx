import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Rocket, Menu, X, ArrowRight, LayoutDashboard, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { getCurrentUser, logoutUser } from "../../services/authService";

function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(() => getCurrentUser());
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-150 ${
        isScrolled
          ? "bg-white shadow-xs border-b border-gray-200"
          : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 group focus:outline-hidden focus:ring-2 focus:ring-black rounded-lg p-1"
            aria-label="CareerForge-AI Home"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-black rounded-xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <Rocket className="text-white w-5 h-5" aria-hidden="true" />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
              CareerForge-AI
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors cursor-pointer"
            >
              How It Works
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <LayoutDashboard size={16} />
                  <span>Go to Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-red-600 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50/50 transition-colors cursor-pointer"
                  title="Log Out"
                >
                  <LogOut size={15} />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-black transition-colors rounded-lg hover:bg-gray-100"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-semibold rounded-lg shadow-xs transition-all duration-150 active:scale-98"
                >
                  <span>Get Started</span>
                  <ArrowRight size={15} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="px-2.5 py-1.5 bg-black text-white text-xs font-semibold rounded-md"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-2 py-1.5 border border-gray-200 text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 text-xs font-semibold rounded-md flex items-center gap-1 cursor-pointer"
                  title="Log Out"
                >
                  <LogOut size={13} />
                  <span className="hidden xs:inline">Log Out</span>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-black hover:bg-gray-100 focus:outline-hidden focus:ring-2 focus:ring-black"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-left py-2 px-3 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("features")}
              className="text-left py-2 px-3 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("how-it-works")}
              className="text-left py-2 px-3 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg"
            >
              How It Works
            </button>
          </div>

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/dashboard");
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-black text-white font-semibold text-sm rounded-lg shadow-xs cursor-pointer"
                >
                  <LayoutDashboard size={16} />
                  <span>Go to Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 font-semibold text-sm rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-black text-white text-sm font-semibold rounded-lg shadow-xs"
                >
                  <span>Get Started</span>
                  <ArrowRight size={15} />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default LandingNavbar;
