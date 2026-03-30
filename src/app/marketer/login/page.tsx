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
import { useEffect } from "react";

export default function MarketerLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const status = localStorage.getItem("status");
        const role = localStorage.getItem("role");

        if (token && role === "marketer") {
            if (status === "active") {
                router.push("/marketer/dashboard");
            } else if (status === "pendingPassChange") {
                router.push("/marketer/update-password");
            }
        }
    }, [router]);

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
            localStorage.setItem("role", "marketer");
            localStorage.setItem("marketer_id", data.marketer.id);
            localStorage.setItem("userInfo", JSON.stringify(data.marketer));
            localStorage.setItem("status", marketerStatus);

            if (marketerStatus === "pendingPassChange") {
                router.push("/marketer/update-password");
            } else {
                // For active, pending, or rejected - we allow entry. 
                // The MarketerLayout will handle restricting features for non-active users.
                toast({
                    title: `Session Established`,
                    description: marketerStatus === 'active' 
                        ? `Welcome back, ${data.marketer.name}!` 
                        : "Redirecting to your application status hub.",
                });
                router.push("/marketer/dashboard");
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
        <div className="min-h-screen bg-white flex font-sans overflow-hidden">
            {/* Left side - Elegant Form */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-16 bg-white relative z-10">
                <div className="w-full max-w-[400px] space-y-12">
                    <div className="text-center space-y-6">
                        <div className="animate-fade-in-up">
                            <Logo size="lg" className="mx-auto" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-4xl font-black tracking-tight text-slate-900 italic uppercase">Marketer Hub</h1>
                            <p className="text-slate-500 font-medium">Elevate your brand presence</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address</Label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="marketer@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-slate-300 shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <Label htmlFor="password" title="Your Account Password" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</Label>
                                <a href="#" className="text-xs font-bold text-primary hover:text-orange-600 transition-colors uppercase tracking-widest">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-12 pr-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-slate-300 shadow-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="gradient"
                            className="w-full h-14 rounded-2xl text-lg font-black tracking-widest uppercase italic shadow-orange-glow active:scale-[0.98] transition-all hover:opacity-95"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-3">
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing In...
                                </span>
                            ) : "Sign In"}
                        </Button>
                    </form>

                    <div className="space-y-8 pt-4">
                        <p className="text-center text-sm font-semibold text-slate-400">
                            New partner? <Link href="/marketer/register" className="text-primary font-black hover:underline decoration-2 underline-offset-4">Apply for Access</Link>
                        </p>

                        <div className="flex items-center gap-6">
                            <div className="h-px flex-1 bg-slate-100" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Switch Hubs</span>
                            <div className="h-px flex-1 bg-slate-100" />
                        </div>

                        <div className="text-center">
                            <Link
                                href="/admin/login"
                                className="group inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-[0.2em] transition-all px-8 py-3 rounded-full border border-slate-100 hover:border-primary/20 hover:bg-primary/5 shadow-sm"
                            >
                                Admin Portal <Sparkles className="h-3 w-3 text-slate-200 group-hover:text-primary transition-colors" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Visual Luxury (Returned to Dark) */}
            <div className="hidden lg:flex flex-1 bg-[#050505] relative overflow-hidden items-center justify-center p-24">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/[0.05] via-primary/[0.03] to-transparent" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-repeat opacity-[0.03]" />
                
                {/* Modern Blur Orbs */}
                <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 max-w-lg space-y-12">
                    <div className="space-y-8">
                        <div className="h-16 w-16 bg-white/[0.03] backdrop-blur-3xl rounded-[2rem] flex items-center justify-center border border-white/10 shadow-2xl animate-fade-in">
                            <Sparkles className="h-8 w-8 text-orange-500" />
                        </div>
                        <h2 className="text-7xl font-black text-white leading-[0.95] tracking-tighter italic uppercase">
                            Reach <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-primary">Ethiopia.</span>
                        </h2>
                        <p className="text-xl text-slate-400 leading-relaxed font-medium max-w-md">
                            Join elite brands leveraging the leading digital advertising infrastructure in the region.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-12 border-t border-white/5 pt-12">
                        <div className="space-y-2">
                            <p className="text-4xl font-black text-white tracking-tighter italic">98.4%</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] leading-tight">Viewer <br />Engagement</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-4xl font-black text-white tracking-tighter italic">100k+</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] leading-tight">Regional <br />Network Reach</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
