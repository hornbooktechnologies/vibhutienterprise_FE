import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, ChevronRight, LayoutDashboard, Users, ShieldAlert, History, User } from "lucide-react";
import { cn } from "../../lib/utils/utils";
import { MenuItems } from "../../lib/utils/menu";
import { useAuth } from "../../context/AuthContext";
import { useLayout } from "../../context/LayoutContext";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../ui/Tooltip";
import { toast } from "sonner";

const iconMap = {
  LayoutDashboard,
  Users,
  ShieldAlert,
  History,
  User,
};

const TooltipWrapper = ({ isOpen, title, children }) => {
  if (isOpen) return children;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side="right"
        className="font-medium bg-white text-slate-900 border-slate-200 shadow-md"
      >
        {title}
      </TooltipContent>
    </Tooltip>
  );
};

const Sidebar = () => {
  const { isOpen, setIsOpen } = useLayout();
  const location = useLocation();
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (title) => {
    setExpandedMenus((prev) => {
      const isCurrentlyOpen = prev[title];
      return { [title]: !isCurrentlyOpen };
    });
  };

  const visibleItems = MenuItems.filter((item) => {
    if (item.permission) {
      return hasPermission(item.permission);
    }
    return true;
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logged out successfully");
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const isLinkActive = useCallback((url, siblings = []) => {
    if (url === "/dashboard") {
      return location.pathname === "/dashboard";
    }

    const isBaseMatch =
      location.pathname === url || location.pathname.startsWith(`${url}/`);
    if (!isBaseMatch) return false;

    const hasBetterMatch = siblings.some((siblingUrl) => {
      if (!siblingUrl || siblingUrl === url) return false;
      return (
        siblingUrl.length > url.length &&
        (location.pathname === siblingUrl ||
          location.pathname.startsWith(`${siblingUrl}/`))
      );
    });

    return !hasBetterMatch;
  }, [location.pathname]);

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen transition-all duration-500 ease-in-out z-50 flex flex-col bg-white shadow-[4px_0_24px_rgba(0,45,85,0.06)] z-[60]",
          isOpen
            ? "w-64 translate-x-0"
            : "w-64 -translate-x-full md:w-20 md:translate-x-0 md:overflow-hidden",
        )}
      >
        <TooltipProvider delayDuration={200}>
          <Link
            to="/dashboard"
            className="flex items-center justify-center py-6 hover:opacity-80 transition-opacity cursor-pointer gap-2 mb-4"
          >
            {/* The logo image MUST be saved as public/logo.png */}
            <img src="/logo.png" alt="Vibhuti Logo" className="h-12 w-auto object-contain" />
          </Link>

          <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            {visibleItems.map((item) => {
              const Icon = iconMap[item.icon] || LayoutDashboard;
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedMenus[item.title];

              const topLevelUrls = visibleItems.map((i) => i.url);
              const subItemUrls = item.subItems?.map((i) => i.url) || [];

              const isParentActive =
                hasSubItems &&
                item.subItems.some((sub) => isLinkActive(sub.url, subItemUrls));
              const isActive =
                !hasSubItems && isLinkActive(item.url, topLevelUrls);

              const handleNavClick = () => {
                if (!hasSubItems) {
                  setExpandedMenus({});
                }
                if (window.innerWidth < 768 && !hasSubItems) {
                  setIsOpen(false);
                }
              };

              return (
                <div key={item.title}>
                  {hasSubItems ? (
                    <TooltipWrapper title={item.title} isOpen={isOpen}>
                      <div
                        onClick={() => {
                          if (!isOpen) setIsOpen(true);
                          toggleMenu(item.title);
                        }}
                        className={cn(
                          "flex items-center py-3 rounded-xl transition-all duration-200 group relative cursor-pointer select-none",
                          isOpen
                            ? "px-4 gap-3 justify-between"
                            : "justify-center",
                          isActive || isParentActive
                            ? "bg-gradient-to-r from-primary-700 to-secondary-500 text-white shadow-lg shadow-primary-500/20"
                            : "text-slate-600 hover:bg-white hover:shadow-sm hover:text-primary-700 hover:translate-x-1",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={cn(
                              "transition-all duration-200 shrink-0",
                              isActive || isParentActive ? "text-white" : "text-slate-500 group-hover:text-primary-500"
                            )}
                            size={20}
                          />
                          {isOpen && (
                            <span className="text-sm font-medium transition-all duration-200 whitespace-nowrap">
                              {item.title}
                            </span>
                          )}
                        </div>
                        {isOpen && (
                          <div
                            className={cn(
                              "transition-transform duration-300",
                              isExpanded ? "rotate-90" : "rotate-0",
                              isActive || isParentActive ? "text-white" : "text-slate-500 group-hover:text-primary-500"
                            )}
                          >
                            <ChevronRight size={14} />
                          </div>
                        )}
                      </div>
                    </TooltipWrapper>
                  ) : (
                    <TooltipWrapper title={item.title} isOpen={isOpen}>
                      <Link
                        to={item.url}
                        onClick={handleNavClick}
                        className={cn(
                          "flex items-center py-3 rounded-xl transition-all duration-200 group relative",
                          isOpen ? "px-4 gap-3 justify-start" : "justify-center",
                          isActive
                            ? "bg-gradient-to-r from-primary-700 to-secondary-500 text-white shadow-lg shadow-primary-500/20"
                            : "text-slate-600 hover:bg-white hover:shadow-sm hover:text-primary-700 hover:translate-x-1",
                        )}
                      >
                        <Icon
                          className={cn(
                            "transition-all duration-200 shrink-0",
                            isActive ? "text-white" : "text-slate-500 group-hover:text-primary-500"
                          )}
                          size={20}
                        />
                        {isOpen && (
                          <span
                            className={cn(
                              "text-sm transition-all duration-200 whitespace-nowrap",
                              isActive ? "font-semibold" : "font-medium"
                            )}
                          >
                            {item.title}
                          </span>
                        )}
                      </Link>
                    </TooltipWrapper>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="p-4 mt-auto">
            <TooltipWrapper title="Logout" isOpen={isOpen}>
              <button
                onClick={handleLogout}
                className={cn(
                  "flex items-center py-3 rounded-xl transition-all duration-200 w-full group",
                  isOpen ? "px-4 gap-3 justify-start" : "justify-center",
                  "text-slate-600 hover:bg-red-950/20 hover:text-red-400",
                )}
              >
                <LogOut
                  className="text-slate-500 group-hover:text-red-400 transition-colors shrink-0"
                  size={20}
                />
                {isOpen && (
                  <span className="font-medium text-sm transition-colors whitespace-nowrap">
                    Logout
                  </span>
                )}
              </button>
            </TooltipWrapper>
          </div>
        </TooltipProvider>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-50/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
