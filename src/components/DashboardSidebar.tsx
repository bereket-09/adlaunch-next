"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LucideIcon, X, LayoutDashboard, Users, Video, BarChart3, 
  Shield, DollarSign, SmartphoneCharging, Upload, Smartphone, 
  Settings, ShieldBan, Zap, History as HistoryIcon, Activity as ActivityIcon 
} from "lucide-react";
import { Button } from "./ui/button";

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface DashboardSidebarProps {
  items: SidebarItem[];
  isOpen: boolean;
  onClose: () => void;
  userType: "marketer" | "admin";
}

const NavItem = ({ item, pathname, onClose }: { item: { icon: LucideIcon; label: string; href: string }, pathname: string, onClose: () => void }) => {
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
  return (
    <Link
      key={item.href}
      href={item.href}
      onClick={onClose}
      className={cn(
        "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 group relative",
        isActive
          ? "text-white font-semibold shadow-[0_4px_12px_rgba(255,109,0,0.3)]"
          : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-medium"
      )}
      style={isActive ? { background: 'linear-gradient(135deg, hsl(24, 100%, 50%) 0%, hsl(34, 100%, 55%) 100%)' } : undefined}
    >
      {isActive && (
        <div className="absolute inset-0 rounded-xl opacity-20" 
             style={{ background: 'radial-gradient(circle at 30% 50%, white 0%, transparent 70%)' }} />
      )}
      <item.icon className={cn(
        "h-4 w-4 shrink-0 transition-transform duration-200 relative z-10",
        isActive ? "" : "group-hover:scale-110"
      )} />
      <span className="tracking-tight relative z-10 truncate">{item.label}</span>
      {isActive && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70 relative z-10" />
      )}
    </Link>
  );
};

const DashboardSidebar = ({ items, isOpen, onClose, userType }: DashboardSidebarProps) => {
  const pathname = usePathname();

  const adminGroups = [
    {
      label: "Core Operations",
      items: [
        { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
        { icon: Users, label: "Marketer Central", href: "/admin/marketers" },
        { icon: Video, label: "Active Campaigns", href: "/admin/campaigns" },
        { icon: BarChart3, label: "Performance", href: "/admin/analytics" },
      ]
    },
    {
      label: "Assets & Security",
      items: [
        { icon: Shield, label: "Fraud Shield", href: "/admin/fraud" },
        { icon: ShieldBan, label: "Blacklist", href: "/admin/blacklist" },
        { icon: DollarSign, label: "Billing Models", href: "/admin/budget" },
        { icon: SmartphoneCharging, label: "Subscriber Lookup", href: "/admin/lookup" },
      ]
    },
    {
      label: "System Tools",
      items: [
        { icon: Upload, label: "New Campaign", href: "/admin/upload" },
        { icon: Smartphone, label: "Link Simulator", href: "/admin/simulator" },
        { icon: HistoryIcon, label: "Audit Logs", href: "/admin/audit" },
        { icon: Settings, label: "App Config", href: "/admin/settings" },
      ]
    }
  ];

  const marketerGroups = [
    {
      label: "Market Intelligence",
      items: [
        { icon: LayoutDashboard, label: "Overview", href: "/marketer/dashboard" },
        { icon: BarChart3, label: "Analytics", href: "/marketer/reports" },
      ]
    },
    {
      label: "Media Assets",
      items: [
        { icon: Video, label: "Ad Inventory", href: "/marketer/campaigns" },
        { icon: Upload, label: "Launch Campaign", href: "/marketer/upload" },
      ]
    },
    {
      label: "Preferences",
      items: [
        { icon: Settings, label: "Account Settings", href: "/marketer/settings" },
      ]
    }
  ];

  const groups = userType === "admin" ? adminGroups : marketerGroups;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 flex flex-col transition-transform duration-300 ease-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ background: 'hsl(var(--sidebar-background))', borderRight: '1px solid hsl(var(--sidebar-border))' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-black"
                 style={{ background: 'linear-gradient(135deg, hsl(24, 100%, 50%), hsl(34, 100%, 55%))' }}>
              A
            </div>
            <div>
              <p className="text-sm font-black text-foreground tracking-tight leading-none">ADLaunch</p>
              <p className="text-[9px] font-semibold text-primary uppercase tracking-widest leading-none mt-0.5">
                {userType === "admin" ? "Admin Console" : "Marketer Hub"}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8 rounded-xl" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Nav */}
        <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {groups.map((group) => (
            <div key={group.label} className="space-y-1">
              <p className="section-label">{group.label}</p>
              {group.items.map((item) => (
                <NavItem key={item.href} item={item} pathname={pathname} onClose={onClose} />
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-sidebar-border">
          <div className="rounded-2xl p-4 relative overflow-hidden"
               style={{ background: 'linear-gradient(135deg, hsl(24 100% 97%) 0%, hsl(34 100% 95%) 100%)', border: '1px solid hsl(24 100% 88%)' }}>
            <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full opacity-20"
                 style={{ background: 'hsl(24 100% 50%)' }} />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1.5">
                <Zap className="h-3.5 w-3.5 text-primary" />
                <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Support</p>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed mb-3">
                Need help? Our engineers are standing by.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-7 rounded-lg text-[10px] font-bold uppercase tracking-wider border-primary/30 text-primary hover:bg-primary hover:text-white transition-all duration-200"
                asChild
              >
                <a href="mailto:support@adlaunch.com">Contact Desk</a>
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
