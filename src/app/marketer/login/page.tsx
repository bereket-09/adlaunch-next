"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS } from "@/config/api";

export default function MarketerLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(API_ENDPOINTS.MARKETER.LOGIN, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok || !data.status) {
                toast({
                    title: "Authentication Failed",
                    description: data.error || "Please verify your credentials.",
                    variant: "destructive",
                });
                return;
            }

            const marketerStatus = data.marketer?.status;
            localStorage.setItem("token", data.token);
            localStorage.setItem("marketer_id", data.marketer.id);
            localStorage.setItem("userInfo", JSON.stringify(data.marketer));
            localStorage.setItem("status", marketerStatus);

            if (marketerStatus === "pendingPassChange") {
                router.push("/marketer/update-password");
            } else if (marketerStatus === "active") {
                toast({
                    title: `Welcome back, ${data.marketer.name}!`,
                    description: "Your dashboard is ready.",
                });
                router.push("/marketer/dashboard");
            } else {
                toast({
                    title: "Access Restricted",
                    description: `Your account is ${marketerStatus}. Contact support.`,
                    variant: "destructive",
                });
            }
        } catch (err) {
            toast({
                title: "Connection Error",
                description: "Failed to reach the authentication server.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex font-sans">
            {/* Left side - Dynamic Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
                <div className="w-full max-w-[400px] space-y-10">
                    <div className="text-center space-y-4">
                        <Logo size="lg" className="mx-auto" />
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900">Marketer Portal</h1>
                            <p className="text-slate-500 font-medium">Powering video excellence at scale</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-semibold text-slate-700">Business Email</Label>
                            <div className="relative group">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="marketer@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-11 h-13 rounded-2xl border-slate-200 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password" title="Standard AdLaunch Password" className="font-semibold text-slate-700">Password</Label>
                                <a href="#" className="text-xs font-bold text-primary hover:text-orange-600 transition-colors">Forgot Passkey?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-11 pr-11 h-13 rounded-2xl border-slate-200 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="gradient"
                            className="w-full h-13 rounded-2xl text-lg font-bold shadow-lg shadow-orange-500/10 active:scale-[0.98] transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Authenticating...
                                </span>
                            ) : "Sign Into Dashboard"}
                        </Button>
                    </form>

                    <div className="space-y-6 pt-4">
                        <p className="text-center text-sm font-medium text-slate-500">
                            New brand partner? <a href="#" className="text-primary font-bold hover:underline">Apply for Access</a>
                        </p>

                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-slate-100" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">System Gateway</span>
                            <div className="h-px flex-1 bg-slate-100" />
                        </div>

                        <div className="text-center">
                            <Link
                                href="/admin/login"
                                className="group inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-all bg-slate-50 px-6 py-2.5 rounded-full border border-slate-100"
                            >
                                Go to Admin Portal <Sparkles className="h-3 w-3 text-slate-300 group-hover:text-primary transition-colors" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Visual Showcase */}
            <div className="hidden lg:flex flex-1 bg-slate-950 relative overflow-hidden items-center justify-center p-20">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/20 via-primary/10 to-transparent" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-repeat opacity-20" />

                <div className="relative z-10 max-w-lg space-y-10">
                    <div className="space-y-6">
                        <div className="h-14 w-14 bg-white/5 backdrop-blur-3xl rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
                            <Sparkles className="h-7 w-7 text-orange-500" />
                        </div>
                        <h2 className="text-6xl font-black text-white leading-[1.1] tracking-tighter">
                            The Next Gen <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-primary">Video Core.</span>
                        </h2>
                        <p className="text-xl text-slate-400 leading-relaxed font-medium">
                            Join elite brands leveraging our hyper-targeted video engine to deliver rewards and drive meaningful engagement.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-10 border-t border-white/5 pt-10">
                        <div className="space-y-2">
                            <p className="text-4xl font-black text-white tracking-tighter">98.4%</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Comp. Rate Avg</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-4xl font-black text-white tracking-tighter">2M+</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Daily Impressions</p>
                        </div>
                    </div>
                </div>

                {/* Floating Accent */}
                <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />
            </div>
        </div>
    );
}
