"use client";

import { useState, ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  sidebarItems: SidebarItem[];
  userType: "marketer" | "admin";
}

const DashboardLayout = ({ children, title, sidebarItems, userType }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-secondary/30 flex w-full">
      <DashboardSidebar
        items={sidebarItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userType={userType}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
          userType={userType}
        />

        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
