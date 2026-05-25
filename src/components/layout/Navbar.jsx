import React, { useState } from "react";
import { Menu, LogOut, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLayout } from "../../context/LayoutContext";

const Navbar = () => {
  const { toggleSidebar } = useLayout();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getInitials = () => {
    const firstInitial = user?.first_name?.[0] || "U";
    const lastInitial = user?.last_name?.[0] || "S";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center py-2 px-3 sm:py-3 sm:px-6 mt-4 mx-4 rounded-2xl bg-white/50 backdrop-blur-xl border border-slate-200 shadow-xl relative">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600 active:bg-slate-200"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex flex-col">
          <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            Welcome back, <span className="text-primary-400">{user?.first_name || "User"}</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 relative">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-900 leading-none mb-1">
            {user?.first_name} {user?.last_name}
          </p>
          <p className="text-[10px] text-primary-400 font-semibold uppercase bg-primary-950/50 border border-primary-800/30 px-2 py-0.5 rounded-full inline-block">
            {user?.role}
          </p>
        </div>

        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-slate-800 hover:scale-105 transition-all"
        >
          <span>{getInitials()}</span>
        </button>

        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute right-0 top-12 mt-2 w-48 rounded-xl border border-slate-850 bg-white p-2 shadow-2xl z-20 animate-in fade-in-50 slide-in-from-top-1">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate("/profile");
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-white transition-colors"
              >
                <UserIcon className="h-4 w-4 text-primary-400" />
                <span>My Profile</span>
              </button>
              <div className="my-1 border-t border-slate-200" />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-950/20 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
