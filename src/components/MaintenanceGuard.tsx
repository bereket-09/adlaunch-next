"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/config/api";
import { Hammer, AlertTriangle } from "lucide-react";
import Logo from "./Logo";

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
    const [isMaintenance, setIsMaintenance] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkMaintenance = async () => {
            try {
                // If it's the admin dashboard, we might want to allow access if logged in
                const isAdminPath = window.location.pathname.startsWith('/admin');
                const token = localStorage.getItem('token');
                const role = localStorage.getItem('role');

                if (isAdminPath && token && role === 'admin') {
                    setIsLoading(false);
                    return;
                }

                const res = await fetch(API_ENDPOINTS.SYSTEM_CONFIG.MAINTENANCE_STATUS);
                const data = await res.json();

                if (data.status && data.maintenance_mode) {
                    setIsMaintenance(true);
                }
            } catch (err) {
                console.error("Maintenance check failed", err);
            } finally {
                setIsLoading(false);
            }
        };

        checkMaintenance();
    }, []);

    if (isLoading) return null; // Or a simple loader

    if (isMaintenance) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 text-center overflow-hidden">
                {/* Modern Ambient Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />
                
                <div className="relative z-10 space-y-12 max-w-2xl w-full">
                    <div className="animate-fade-in-up">
                        <Logo size="lg" className="mx-auto" />
                    </div>

                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md text-amber-500 text-sm font-bold tracking-[0.2em] uppercase animate-pulse">
                            <Hammer className="h-4 w-4" />
                            Refining Excellence
                        </div>
                        
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-none italic uppercase">
                                Elevating Your <span className="text-primary">Experience</span>
                            </h1>
                            <p className="text-slate-400 text-xl font-medium max-w-lg mx-auto leading-relaxed">
                                We are currently introducing new refinements to the platform to ensure you have the best tools at your fingertips.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
                        <div className="p-6 bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-[2rem] flex flex-col items-center gap-4 text-center group hover:bg-white/[0.04] transition-all duration-500">
                            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
                                <AlertTriangle className="h-6 w-6 text-amber-500" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-bold text-white">Temporary Pause</p>
                                <p className="text-sm text-slate-500 font-medium leading-tight">We're making some quick improvements</p>
                            </div>
                        </div>
                        
                        <div className="p-6 bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-[2rem] flex flex-col items-center gap-4 text-center group hover:bg-white/[0.04] transition-all duration-500">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                                <div className="h-6 w-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-bold text-white">Returning Soon</p>
                                <p className="text-sm text-slate-500 font-medium leading-tight">Everything will be back online shortly</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 opacity-40">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">AdRewards Platform Excellence</p>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
