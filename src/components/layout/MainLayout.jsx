import React from "react";
import { LayoutProvider, useLayout } from "../../context/LayoutContext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { cn } from "../../lib/utils/utils";
import { useLocation } from "react-router-dom";
import { MenuItems } from "../../lib/utils/menu";
import Meta from "../common/Meta";

const MainLayoutInner = ({ children }) => {
    const { isOpen } = useLayout();
    const location = useLocation();

    const getPageTitle = (pathname) => {
        const findInMenu = (items) => {
            for (const item of items) {
                if (item.url === pathname) return item.title;
                if (item.subItems) {
                    const subMatch = findInMenu(item.subItems);
                    if (subMatch) return subMatch;
                }
            }
            return null;
        };

        const titleFromMenu = findInMenu(MenuItems);
        if (titleFromMenu) return titleFromMenu;

        const segments = pathname.split('/').filter(Boolean);

        if (segments.includes('add')) {
            const baseSegment = segments[0];
            const parentTitle = MenuItems.find(i => i.url.includes(baseSegment))?.title || baseSegment;
            const singularTitle = parentTitle.endsWith('s') ? parentTitle.slice(0, -1) : parentTitle;
            return `Add ${singularTitle}`;
        }

        if (segments.includes('edit')) {
            const baseSegment = segments[0];
            const parentTitle = MenuItems.find(i => i.url.includes(baseSegment))?.title || baseSegment;
            const singularTitle = parentTitle.endsWith('s') ? parentTitle.slice(0, -1) : parentTitle;
            return `Edit ${singularTitle}`;
        }

        if (segments.length > 0) {
            const title = segments[0]
                .replace(/-/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            return title;
        }

        return "Dashboard";
    };

    const pageTitle = getPageTitle(location.pathname);

    return (
        <div className="relative flex h-[100dvh] w-full overflow-hidden bg-slate-50 text-slate-900">
            <Meta title={pageTitle} />
            {/* Light Theme Mesh Gradient Background */}
            <div
                className="absolute inset-0 -z-10 bg-slate-50"
                style={{
                    backgroundImage: `
                        radial-gradient(at 0% 0%, rgba(69, 209, 211, 0.15) 0, transparent 40%), 
                        radial-gradient(at 100% 0%, rgba(0, 75, 121, 0.08) 0, transparent 50%), 
                        radial-gradient(at 100% 100%, rgba(69, 209, 211, 0.1) 0, transparent 40%),
                        radial-gradient(at 0% 100%, rgba(0, 75, 121, 0.05) 0, transparent 50%)
                    `,
                }}
            />

            <Sidebar />

            <main
                className={cn(
                    "flex-1 flex flex-col transition-all duration-300 min-w-0 h-full overflow-y-auto relative",
                    isOpen ? "md:pl-64" : "md:pl-20",
                    "pl-0"
                )}
            >
                <div className="sticky top-0 z-30">
                    <Navbar />
                </div>

                <div className="flex-1 p-4 sm:p-6 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

const MainLayout = ({ children }) => {
    return (
        <LayoutProvider>
            <MainLayoutInner>{children}</MainLayoutInner>
        </LayoutProvider>
    );
};

export default MainLayout;
