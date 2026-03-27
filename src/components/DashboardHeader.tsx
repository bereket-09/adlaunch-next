"use client";

import { Menu, Bell, Search, LogOut, User, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface DashboardHeaderProps {
  title: string;
  onMenuClick: () => void;
  userType: "marketer" | "admin";
}

const DashboardHeader = ({ title, onMenuClick, userType }: DashboardHeaderProps) => {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const info = localStorage.getItem("userInfo");
        if (info) {
          const parsed = JSON.parse(info);
          setUserName(parsed.name || parsed.email || "User");
        }
      } catch (_) {}
    }
    // Live clock
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push(userType === "admin" ? "/admin/login" : "/marketer/login");
  };

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : userType === "admin" ? "AD" : "MK";

  return (
    <header className="sticky top-0 z-30 border-b border-border/60"
            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px) saturate(1.8)' }}>
      <div className="flex items-center justify-between px-4 lg:px-6 h-14">
        {/* Left */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9 rounded-xl"
            onClick={onMenuClick}
          >
            <Menu className="h-4.5 w-4.5" />
          </Button>
          <div className="hidden sm:flex flex-col">
            <h1 className="text-sm font-bold text-foreground tracking-tight leading-none">{title}</h1>
            <p className="text-[10px] text-muted-foreground mt-0.5 hidden md:block">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-secondary">
              <Bell className="h-4 w-4" />
            </Button>
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary animate-[pulse-orange_2.5s_ease-in-out_infinite]" />
          </div>

          {/* Time chip */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary border border-border/50">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[11px] font-semibold text-muted-foreground tabular-nums">{time}</span>
          </div>

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-secondary transition-colors duration-200 border border-border/50 hover:border-border group">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                     style={{ background: 'linear-gradient(135deg, hsl(24, 100%, 50%), hsl(34, 100%, 55%))' }}>
                  {initials}
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-[11px] font-semibold text-foreground leading-none">{userName || (userType === "admin" ? "Admin" : "Marketer")}</span>
                  <span className="text-[9px] text-muted-foreground capitalize leading-none mt-0.5">{userType}</span>
                </div>
                <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-2xl border-border/60 shadow-xl p-1.5">
              <div className="px-2 py-1.5 mb-1">
                <p className="text-xs font-semibold text-foreground truncate">{userName || userType}</p>
                <p className="text-[10px] text-muted-foreground capitalize">{userType} account</p>
              </div>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem className="rounded-xl text-xs font-medium">
                <User className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="rounded-xl text-xs font-medium text-destructive focus:text-destructive focus:bg-red-50"
              >
                <LogOut className="h-3.5 w-3.5 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
