"use client";

import { useState, ReactNode, useEffect } from "react";
import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    const role = typeof window !== 'undefined' ? localStorage.getItem("role") : null;

    if (!token) {
      console.warn("[DashboardLayout] No token found, redirecting to login. UserType:", userType);
      router.push(userType === "admin" ? "/admin/login" : "/marketer/login");
    } else if (role !== userType) {
      console.warn("[DashboardLayout] Role mismatch, redirecting to login. Role:", role, "Expected:", userType);
      router.push(userType === "admin" ? "/admin/login" : "/marketer/login");
    } else {
      console.log("[DashboardLayout] Auth verified. Role:", role);
    }
  }, [router, userType]);

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
