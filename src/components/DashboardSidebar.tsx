"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { LucideIcon, X, LayoutDashboard, Users, Video, BarChart3, Shield, DollarSign, SmartphoneCharging, Upload, Smartphone, Settings, FileText, TrendingUp, ShieldCheck, Zap, Activity, Clock, ShieldBan } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

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

const DashboardSidebar = ({
  items,
  isOpen,
  onClose,
  userType,
}: DashboardSidebarProps) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
          <Logo size="sm" />
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar">
          {userType === "admin" ? (
            <>
              {/* Admin: Operations */}
              <div className="space-y-1">
                <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 opacity-50">Core Operations</p>
                {[
                  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
                  { icon: Users, label: "Marketer Central", href: "/admin/marketers" },
                  { icon: Video, label: "Active Campaigns", href: "/admin/campaigns" },
                  { icon: BarChart3, label: "Performance", href: "/admin/analytics" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 group",
                      pathname === item.href
                        ? "bg-primary text-white shadow-lg shadow-primary/20 font-bold"
                        : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 transition-transform", pathname === item.href ? "scale-110" : "group-hover:scale-110")} />
                    <span className="tracking-tight">{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Admin: Security & Finance */}
              <div className="space-y-1">
                <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 opacity-50">Assets & Security</p>
                {[
                  { icon: Shield, label: "Fraud Shield", href: "/admin/fraud" },
                  { icon: ShieldBan, label: "Blacklist", href: "/admin/blacklist" },
                  { icon: DollarSign, label: "Budgeting", href: "/admin/budget" },
                  { icon: SmartphoneCharging, label: "Subscriber Lookup", href: "/admin/lookup" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 group",
                      pathname === item.href
                        ? "bg-primary text-white shadow-lg shadow-primary/20 font-bold"
                        : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 transition-transform", pathname === item.href ? "scale-110" : "group-hover:scale-110")} />
                    <span className="tracking-tight">{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Admin: Tools & Config */}
              <div className="space-y-1">
                <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 opacity-50">System Tools</p>
                {[
                  { icon: Upload, label: "New Campaign", href: "/admin/upload" },
                  { icon: Smartphone, label: "Link Simulator", href: "/admin/simulator" },
                  { icon: Settings, label: "App Config", href: "/admin/settings" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 group",
                      pathname === item.href
                        ? "bg-primary text-white shadow-lg shadow-primary/20 font-bold"
                        : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 transition-transform", pathname === item.href ? "scale-110" : "group-hover:scale-110")} />
                    <span className="tracking-tight">{item.label}</span>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Marketer: Performance */}
              <div className="space-y-1">
                <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 opacity-50">Market Intelligence</p>
                {[
                  { icon: LayoutDashboard, label: "Overview", href: "/marketer/dashboard" },
                  { icon: BarChart3, label: "Analytics", href: "/marketer/reports" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 group",
                      pathname === item.href
                        ? "bg-primary text-white shadow-lg shadow-primary/20 font-bold"
                        : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 transition-transform", pathname === item.href ? "scale-110" : "group-hover:scale-110")} />
                    <span className="tracking-tight">{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Marketer: Campaigns */}
              <div className="space-y-1">
                <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 opacity-50">Media Assets</p>
                {[
                  { icon: Video, label: "Ad Inventory", href: "/marketer/campaigns" },
                  { icon: Upload, label: "Launch Campaign", href: "/marketer/upload" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 group",
                      pathname === item.href
                        ? "bg-primary text-white shadow-lg shadow-primary/20 font-bold"
                        : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 transition-transform", pathname === item.href ? "scale-110" : "group-hover:scale-110")} />
                    <span className="tracking-tight">{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Marketer: Account */}
              <div className="space-y-1">
                <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 opacity-50">Preferences</p>
                {[
                  { icon: Settings, label: "Account Settings", href: "/marketer/settings" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 group",
                      pathname === item.href
                        ? "bg-primary text-white shadow-lg shadow-primary/20 font-bold"
                        : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 transition-transform", pathname === item.href ? "scale-110" : "group-hover:scale-110")} />
                    <span className="tracking-tight">{item.label}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-6 border-t border-sidebar-border bg-secondary/10">
          <div className="p-4 rounded-2xl bg-white/50 border border-border/50 shadow-sm">
            <p className="text-[11px] font-bold text-foreground mb-1 uppercase tracking-wider">
              System Support
            </p>
            <p className="text-[10px] text-muted-foreground leading-relaxed mb-4">
              Need technical assistance? Our engineers are online.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full h-8 rounded-lg text-[10px] font-bold uppercase tracking-wider border-primary/20 text-primary hover:bg-primary/5 transition-all"
              asChild
            >
              <a href="mailto:support@adpro.com">Contact Desk</a>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
