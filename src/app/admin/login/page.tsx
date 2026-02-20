"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulation for now
        setTimeout(() => {
            if (email && password) {
                toast({
                    title: "Welcome back, Commander",
                    description: "Encrypted admin session established.",
                });
                router.push("/admin/dashboard");
            } else {
                toast({
                    title: "Access Denied",
                    description: "Invalid secure credentials provided.",
                    variant: "destructive",
                });
            }
            setIsLoading(false);
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex font-sans overflow-hidden relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
                <div className="w-full max-w-[420px] space-y-10">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-3xl border border-primary/20 shadow-2xl shadow-primary/20 animate-pulse">
                            <Shield className="h-10 w-10 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">Command Center</h1>
                            <p className="text-slate-400 text-sm font-medium">Restricted access for platform administrators only</p>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl shadow-black">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">Admin Identity</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@adlaunch.ai"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-slate-900/50 border-slate-800 text-white pl-12 h-14 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" title="Standard Admin Password" className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">Secure Passkey</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-slate-900/50 border-slate-800 text-white pl-12 pr-12 h-14 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="gradient"
                                className="w-full h-14 rounded-2xl text-lg font-black tracking-widest uppercase italic shadow-orange-glow active:scale-[0.98] transition-all"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-3">
                                        <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Bypassing...
                                    </span>
                                ) : (
                                    "Initiate Access"
                                )}
                            </Button>
                        </form>
                    </div>

                    <div className="flex flex-col items-center gap-6">
                        <Link
                            href="/marketer/login"
                            className="text-xs font-bold text-slate-500 hover:text-primary uppercase tracking-widest transition-all"
                        >
                            ← Switch to Marketer Portal
                        </Link>
                        <Logo size="sm" className="opacity-50 grayscale hover:grayscale-0 transition-all" />
                    </div>
                </div>
            </div>

            <div className="hidden xl:flex flex-1 items-center justify-center p-20 bg-[url('/grid.svg')] bg-center bg-no-repeat bg-contain">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                    <div className="relative border border-white/10 bg-slate-900/50 backdrop-blur-3xl p-12 rounded-[3.5rem] max-w-lg space-y-6">
                        <div className="h-2 w-24 bg-gradient-to-r from-primary to-orange-600 rounded-full" />
                        <h2 className="text-4xl font-black text-white leading-tight">Platform Governance & Global Oversight</h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Real-time monitoring of marketer activity, budget distribution, and MSISDN interactions across the entire network.
                        </p>
                        <div className="grid grid-cols-2 gap-8 pt-6">
                            <div className="space-y-1">
                                <p className="text-2xl font-black text-white">99.9%</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Uptime</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-black text-white">10M+</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active MSISDNs</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
