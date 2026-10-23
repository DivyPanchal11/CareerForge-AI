import {
  Home,
  LayoutDashboard,
  FileText,
  Briefcase,
  Brain,
  User,
  Rocket,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logoutUser } from "../../services/authService";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/login");
  };
  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: Home,
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Resumes",
      path: "/resumes",
      icon: FileText,
    },
    {
      name: "Interviews",
      path: "/interviews",
      icon: Briefcase,
    },
    {
      name: "Aptitude",
      path: "/aptitude",
      icon: Brain,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  return (
    <nav className="w-full bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-3"
        >
          <div className="bg-black p-2 rounded-lg">
            <Rocket className="text-white w-5 h-5" />
          </div>

          <h1 className="text-2xl font-bold">
            CareerForge-AI
          </h1>
        </NavLink>

        <div className="flex items-center gap-6">
          {/* Navigation */}
          <ul className="hidden md:flex items-center gap-8 text-gray-600">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 cursor-pointer transition ${
                        isActive
                          ? "text-black border-b-2 border-black pb-1"
                          : "hover:text-black"
                      }`
                    }
                  >
                    <Icon size={18} />
                    {item.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* Log Out Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 text-xs font-semibold transition cursor-pointer"
            title="Log Out"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;