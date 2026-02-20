import { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  Video,
  BarChart3,
  Settings,
  Eye,
  DollarSign,
  TrendingUp,
  Activity,
  CheckCircle,
  Shield,
  Smartphone,
  SmartphoneCharging,
  Upload,
  ShieldBan,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Marketers", href: "/admin/marketers" },
  { icon: Video, label: "Campaigns", href: "/admin/campaigns" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Shield, label: "Security", href: "/admin/fraud" },
  { icon: ShieldBan, label: "Blacklist", href: "/admin/blacklist" },
  { icon: DollarSign, label: "Budget", href: "/admin/budget" },
  { icon: SmartphoneCharging, label: "User Search", href: "/admin/lookup" },
  { icon: Upload, label: "Upload Ad", href: "/admin/upload" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
  { icon: Smartphone, label: "Simulator", href: "/admin/simulator" },
];

interface Props {
  children: ReactNode;
  title?: string;
}

const AdminLayout = ({ children, title = "Admin Dashboard" }: Props) => {
  return (
    <DashboardLayout title={title} sidebarItems={sidebarItems} userType="admin">
      {children}
    </DashboardLayout>
  );
};

export default AdminLayout;
