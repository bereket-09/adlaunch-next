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
import { usePathname, useRouter } from "next/navigation";
import MarketerStatusView from "@/components/marketer/MarketerStatusView";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/marketer/dashboard", activeOnly: true },
  { icon: Video, label: "Ad Campaigns", href: "/marketer/campaigns", activeOnly: true },
  { icon: FileText, label: "Reports", href: "/marketer/reports", activeOnly: true },
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
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedStatus = localStorage.getItem("status");
      setStatus(storedStatus);
    }
  }, []);

  const isActive = status === "active";
  const isKycPage = pathname === "/marketer/kyc";
  const isSettingsPage = pathname === "/marketer/settings";

  // Filter sidebar items based on status
  const accessibleSidebarItems = sidebarItems.map(item => ({
    ...item,
    disabled: (item as any).activeOnly && !isActive
  }));

  return (
    <DashboardLayout
      title={title}
      sidebarItems={accessibleSidebarItems}
      userType="marketer"
    >
      <div className="relative flex-1">
        {isActive || isKycPage || isSettingsPage ? (
          children
        ) : (
          <MarketerStatusView status={status || "pending"} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default MarketerLayout;
