"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { useState } from "react";
import MaintenanceGuard from "./MaintenanceGuard";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <MaintenanceGuard>
                    {children}
                </MaintenanceGuard>
                <Toaster />
                <Sonner />
            </TooltipProvider>
        </QueryClientProvider>
    );
}
