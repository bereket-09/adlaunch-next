"use client";

import { ReactNode, useState, useEffect } from "react";
import { 
    LayoutDashboard, 
    Video, 
    FileText, 
    Settings, 
    ShieldCheck, 
    AlertCircle,
    ChevronRight,
    Loader2
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/marketer/dashboard" },
  { icon: Video, label: "Ad Campaigns", href: "/marketer/campaigns" },
  { icon: FileText, label: "Reports", href: "/marketer/reports" },
  { icon: ShieldCheck, label: "Compliance (KYC)", href: "/marketer/kyc" },
  { icon: Settings, label: "Settings", href: "/marketer/settings" },
];

interface Props {
  children: ReactNode;
  title?: string;
}

const MarketerLayout = ({
  children,
  title = "Marketer Console",
}: Props) => {
  const [status, setStatus] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedStatus = localStorage.getItem("status");
      setStatus(storedStatus);
    }
  }, []);

  const isPending = status === "pending" || status === "unverified";
  const isKycPage = pathname === "/marketer/kyc";

  return (
    <DashboardLayout
      title={title}
      sidebarItems={sidebarItems}
      userType="marketer"
    >
      <div className="relative flex-1">
        {isPending && !isKycPage && (
          <div className="mx-auto max-w-5xl mb-6 px-4">
             <div className="group relative bg-orange-50 border border-orange-200 p-4 rounded-2xl flex items-center justify-between gap-4 overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
                <div className="flex items-center gap-4 relative z-10">
                   <div className="p-2.5 bg-orange-100 rounded-xl text-orange-600">
                      <AlertCircle className="h-5 w-5 animate-pulse" />
                   </div>
                   <div>
                      <p className="font-black text-xs text-orange-800 uppercase tracking-widest">Account Under Review</p>
                      <p className="text-xs text-orange-700/70 font-medium">Please complete your KYC details to unlock full campaign features.</p>
                   </div>
                </div>
                <Link href="/marketer/kyc">
                   <button className="flex items-center gap-2 px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95">
                      Verify Identity <ChevronRight className="h-4 w-4" />
                   </button>
                </Link>
             </div>
          </div>
        )}
        {children}
      </div>
    </DashboardLayout>
  );
};

export default MarketerLayout;
