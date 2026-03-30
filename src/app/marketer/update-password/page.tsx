"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS } from "@/config/api";

export default function MarketerUpdatePasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);

    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        setCanSubmit(
            password.length >= 8 &&
            confirmPassword.length > 0 &&
            password === confirmPassword
        );
    }, [password, confirmPassword]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = localStorage.getItem("marketer_id");

        if (!userId) {
            toast({ title: "Session Error", description: "Identity context missing. Please login again.", variant: "destructive" });
            return;
        }

        if (!canSubmit) return;

        setIsLoading(true);
        try {
            const res = await fetch(API_ENDPOINTS.MARKETER.UPDATE_PASSWORD, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast({ title: "Update Failed", description: data.error || "Credential update rejected", variant: "destructive" });
                return;
            }

            toast({ title: "Security Updated", description: "Your credentials have been hardened successfully." });
            router.push("/marketer/dashboard");
        } catch (err) {
            toast({ title: "Network Error", description: "Failed to sync with security server.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex font-sans overflow-hidden">
            <div className="flex-1 flex items-center justify-center p-8 sm:p-16 relative z-10">
                {/* Subtle Geometric Background */}
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/bg-pattern.svg')] opacity-[0.03] pointer-events-none" />

                <div className="w-full max-w-[440px] space-y-12">
                    <div className="text-center space-y-6">
                        <div className="animate-fade-in-up">
                            <Logo size="lg" className="mx-auto" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black tracking-tight text-slate-900 italic uppercase">Secure Your Access</h1>
                            <p className="text-slate-500 font-medium text-lg leading-relaxed">Let's set up a new password to keep your campaign data safe</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 bg-slate-50/50 p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
                        <div className="space-y-3">
                            <Label htmlFor="password" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">New Password</Label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Security Key"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-12 pr-12 h-14 rounded-2xl border-slate-100 bg-white focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-slate-300 shadow-sm"
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

                        <div className="space-y-3">
                            <Label htmlFor="confirmPassword" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Confirm Identity</Label>
                            <div className="relative group">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Verify password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-12 pr-12 h-14 rounded-2xl border-slate-100 bg-white focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-slate-300 shadow-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                >
                                    {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {password && confirmPassword && password !== confirmPassword && (
                                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2 pl-1 animate-in fade-in slide-in-from-top-1">
                                    Passwords do not match
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            variant="gradient"
                            className="w-full h-16 rounded-[1.5rem] text-xl font-black tracking-widest uppercase italic shadow-2xl active:scale-[0.98] transition-all hover:opacity-95"
                            disabled={!canSubmit || isLoading}
                            size="lg"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-3">
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Syncing...
                                </span>
                            ) : "Secure Account"}
                        </Button>
                    </form>

                    <div className="flex flex-col items-center gap-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">AdRewards Security Node</p>
                    </div>
                </div>
            </div>

            {/* Right side - Visual Assurance */}
            <div className="hidden lg:flex flex-1 bg-slate-50 relative overflow-hidden items-center justify-center p-24">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,109,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,109,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
                
                {/* Floating Glow Orbs */}
                <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[20%] left-[20%] w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 max-w-lg space-y-12">
                    <div className="h-20 w-20 bg-white rounded-[2.5rem] flex items-center justify-center border border-slate-100 shadow-2xl shadow-slate-200/50 animate-fade-in">
                        <Lock className="h-10 w-10 text-orange-500" />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-6xl font-black text-slate-900 leading-[0.95] tracking-tighter italic uppercase text-slate-900">
                            Sovereign <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-primary italic">Identity.</span>
                        </h2>
                        <p className="text-xl text-slate-500 leading-relaxed font-medium">
                            Protecting the integrity of the Ethiopian digital advertising ecosystem through advanced security.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-12 border-t border-slate-100 pt-12">
                        <div className="space-y-2">
                            <p className="text-4xl font-black text-slate-900 tracking-tighter italic">256-bit</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Encrypted <br />Tunneling</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-4xl font-black text-slate-900 tracking-tighter italic">100%</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Data <br />Confidentiality</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
