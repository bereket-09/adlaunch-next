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
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 space-y-8 max-w-lg">
                    <Logo size="lg" className="mx-auto" />

                    <div className="inline-flex items-center justify-center p-6 bg-amber-500/10 rounded-full border border-amber-500/20 shadow-2xl shadow-amber-500/20 animate-pulse">
                        <Hammer className="h-12 w-12 text-amber-500" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">System Maintenance</h1>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            We're currently upgrading our core engine to provide a better experience.
                            The platform will be back online shortly.
                        </p>
                    </div>

                    <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-4 text-left group hover:bg-white/10 transition-all">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Temporary Downtime</p>
                            <p className="text-xs text-slate-500">Scheduled maintenance in progress</p>
                        </div>
                    </div>

                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">AdLaunch Network Operations Center</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
