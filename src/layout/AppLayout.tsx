// 📁 src/layout/AppLayout.tsx
import React, { memo } from "react";
import { SidebarProvider } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import OptimizedSidebar from "./OptimizedSidebar";
/* ------------------------------
 * 🎯 LayoutContent Component
 * Optimized for responsive design and performance
 * ------------------------------ */
const LayoutContent: React.FC = memo(() => {
  return (
    <div className="min-h-screen w-full flex lg:grid lg:grid-cols-[auto_1fr] transition-all duration-300 ease-in-out"
    >
      {/* 🧭 Sidebar Section */}
      <aside className="relative h-screen">
        <OptimizedSidebar />
        <Backdrop />
      </aside>
      {/* 📄 Main Content Area */}
      <main className="grid grid-rows-[auto_1fr] h-screen overflow-hidden w-full">
        {/* 🔝 Header */}
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <AppHeader />
        </header>
        {/* 🧩 Page Content */}
        <section className="overflow-y-auto overflow-x-hidden p-2 sm:p-4 md:p-6 bg-gray-25 dark:bg-gray-900">
          <div className="max-w-full mx-auto px-2 sm:px-0">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
});
LayoutContent.displayName = 'LayoutContent';
/* ------------------------------
 * ⚙️ AppLayout Component
 * Wraps LayoutContent with SidebarProvider
 * ------------------------------ */
const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};
export default AppLayout;
