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
import { API_ENDPOINTS } from "@/config/api";
import { useEffect } from "react";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (token && role === "admin") {
            router.push("/admin/dashboard");
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(API_ENDPOINTS.ADMIN.LOGIN, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok || !data.status) {
                toast({
                    title: "Access Denied",
                    description: data.error || "Invalid secure credentials provided.",
                    variant: "destructive",
                });
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", "admin");
            localStorage.setItem("user", JSON.stringify(data.user));

            toast({
                title: "Welcome back, Commander",
                description: "Encrypted admin session established.",
            });
            router.push("/admin/dashboard");
        } catch (err) {
            toast({
                title: "Connection Error",
                description: "Failed to connect to the command center.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex font-sans overflow-hidden relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
                <div className="w-full max-w-[420px] space-y-10">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center p-4 bg-white/[0.03] backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl animate-fade-in">
                            <Shield className="h-10 w-10 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">Admin Portal</h1>
                            <p className="text-slate-400 text-sm font-medium">Please sign in to manage the platform</p>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] pl-1">Email Address</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@adrewards.et"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-black/40 border-white/5 text-white pl-12 h-14 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-slate-700"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" title="Your Security Passkey" className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] pl-1">Password</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-black/40 border-white/5 text-white pl-12 pr-12 h-14 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-slate-700"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="gradient"
                                className="w-full h-14 rounded-2xl text-lg font-black tracking-widest uppercase italic shadow-orange-glow active:scale-[0.98] transition-all hover:opacity-90"
                                disabled={isLoading}
                                size="lg"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-3">
                                        <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Checking...
                                    </span>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    </div>

                    <div className="flex flex-col items-center gap-6">
                        <Link
                            href="/marketer/login"
                            className="text-xs font-bold text-slate-500 hover:text-primary uppercase tracking-[0.2em] transition-all"
                        >
                            ← Switch to Marketer Hub
                        </Link>
                        <Logo size="sm" className="opacity-30 grayscale hover:grayscale-0 transition-all" />
                    </div>
                </div>
            </div>

            <div className="hidden xl:flex flex-1 items-center justify-center p-20 bg-[url('/grid.svg')] bg-center bg-no-repeat bg-contain relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-orange-600/5" />
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="relative border border-white/10 bg-black/40 backdrop-blur-3xl p-16 rounded-[4rem] max-w-xl space-y-8 shadow-2xl">
                        <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-orange-600 rounded-full" />
                        <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tight">Manage with <span className="text-primary italic">Confidence</span></h2>
                        <p className="text-slate-400 text-xl font-medium leading-relaxed">
                            A comprehensive dashboard for oversight and strategic management of the network.
                        </p>
                        <div className="grid grid-cols-2 gap-12 pt-8">
                            <div className="space-y-2">
                                <p className="text-3xl font-black text-white">99.9%</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">System Reliability</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-3xl font-black text-white">10M+</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Live Interactions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
