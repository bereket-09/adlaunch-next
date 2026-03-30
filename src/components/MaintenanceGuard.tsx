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
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center overflow-hidden">
                {/* Modern Ambient Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />
                
                <div className="relative z-10 space-y-12 max-w-2xl w-full">
                    <div className="animate-fade-in-up">
                        <Logo size="lg" className="mx-auto" forceWhite />
                    </div>

                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black tracking-[0.3em] uppercase animate-pulse">
                            <Hammer className="h-4 w-4" />
                            Refining Excellence
                        </div>
                        
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-none italic uppercase">
                                Elevating <br /> <span className="text-primary italic">The Infrastructure.</span>
                            </h1>
                            <p className="text-slate-400 text-xl font-medium max-w-lg mx-auto leading-relaxed">
                                We are currently enhancing the platform for a better experience.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
                        <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4 text-center group hover:scale-[1.02] transition-all duration-500 backdrop-blur-xl">
                            <div className="h-14 w-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
                                <AlertTriangle className="h-6 w-6 text-amber-500" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-black text-white uppercase italic leading-tight">Improving</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-tight">Syncing Modules</p>
                            </div>
                        </div>
                        
                        <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4 text-center group hover:scale-[1.02] transition-all duration-500 backdrop-blur-xl">
                            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                                <div className="h-6 w-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-black text-white uppercase italic leading-tight">Soon</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-tight">Returning Online</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 opacity-40 italic">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">AdRewards Platform Excellence</p>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
