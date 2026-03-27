"use client";
export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Phone, CheckCircle2, ShieldCheck, History, ArrowRight, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AdminLayout from "@/components/AdminLayout";

const normalizeEthiopianMsisdn = (value: string): string | null => {
    const v = value.trim();

    // 07XXXXXXXX/09XXXXXXXX → 251XXXXXXXX
    if (/^(07|09)\d{8}$/.test(v)) {
        return `251${v.slice(1)}`;
    }

    // 2517XXXXXXXX/2519XXXXXXXX
    if (/^251(7|9)\d{8}$/.test(v)) {
        return v;
    }

    return null;
};

export default function AdminLookupPage() {
    const router = useRouter();
    const [msisdn, setMsisdn] = useState("");
    const [error, setError] = useState("");

    const handleSearch = () => {
        const normalized = normalizeEthiopianMsisdn(msisdn);

        if (!normalized) {
            setError("Invalid phone number format. Please use 09 or 07 format (10 digits).");
            return;
        }

        setError("");
        router.push(`/admin/lookup/${normalized}`);
    };

    return (
        <AdminLayout title="User Search">
            <div className="max-w-3xl mx-auto space-y-8 py-8 animate-in fade-in duration-500">
                <div className="text-center space-y-3">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-none gap-2 px-3 font-bold text-[10px]">
                        <ShieldCheck className="h-3.5 w-3.5" /> SYSTEM AUDIT
                    </Badge>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">User Search</h1>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">
                        Search for users to view engagement metrics, reward fulfillment status, and security logs.
                    </p>
                </div>

                <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-secondary/10 border-b border-border/50 text-center py-6">
                        <CardTitle className="text-lg font-bold">User Finder</CardTitle>
                        <CardDescription className="text-xs">Enter a phone number to view detailed user data.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="flex flex-col sm:flex-row items-stretch gap-3">
                            <div className="relative flex-1">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={msisdn}
                                    onChange={(e) => {
                                        setMsisdn(e.target.value);
                                        if (error) setError("");
                                    }}
                                    placeholder="09XXXXXXXX"
                                    className="pl-10 h-12 text-lg font-mono rounded-xl bg-secondary/20 border-border/50"
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                />
                            </div>

                            <Button
                                onClick={handleSearch}
                                className="h-12 px-8 rounded-xl font-bold gap-2"
                            >
                                <Search className="h-4 w-4" />
                                Search User
                            </Button>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-100 text-red-600 animate-in slide-in-from-top-1">
                                <Activity className="h-4 w-4" />
                                <p className="text-xs font-bold">{error}</p>
                            </div>
                        )}

                        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                <div className="w-1 h-1 rounded-full bg-primary/40" />
                                Supports 09xx
                            </div>
                            <Separator orientation="vertical" className="h-3 bg-border/50" />
                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                <div className="w-1 h-1 rounded-full bg-primary/40" />
                                Supports 07xx
                            </div>
                            <Separator orientation="vertical" className="h-3 bg-border/50" />
                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                <div className="w-1 h-1 rounded-full bg-primary/40" />
                                Country Code (251)
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-secondary/5 border border-border/50 hover:bg-secondary/10 transition-all">
                        <div className="flex gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl h-fit">
                                <History className="h-5 w-5 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-sm">Event History</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    View every event in the user lifecycle, from link generation to final conversion.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-secondary/5 border border-border/50 hover:bg-secondary/10 transition-all">
                        <div className="flex gap-4">
                            <div className="p-3 bg-emerald-50 rounded-xl h-fit">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-sm">Reward Status</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Check reward fulfillment status and protocol validation through the BSS gateway.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
