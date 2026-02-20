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
        <div className="min-h-screen bg-slate-50 flex font-sans">
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-[440px] space-y-8">
                    <div className="text-center space-y-4">
                        <Logo size="lg" />
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900">Hardening Security</h1>
                            <p className="text-slate-500 text-base">Please set a high-entropy password to protect your marketer assets</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Secure Password</Label>
                            <div className="relative group">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min. 8 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-11 pr-11 h-13 rounded-xl border-slate-200 focus:ring-4 focus:ring-primary/10 transition-all"
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

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Verify Password</Label>
                            <div className="relative group">
                                <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Repeat new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-11 pr-11 h-13 rounded-xl border-slate-200 focus:ring-4 focus:ring-primary/10 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {password && confirmPassword && password !== confirmPassword && (
                                <p className="text-xs font-medium text-red-500 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                                    Passwords do not match
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            variant="gradient"
                            className="w-full h-13 rounded-xl text-lg font-bold shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all"
                            disabled={!canSubmit || isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Hardening...
                                </span>
                            ) : "Harden Account"}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-slate-400">
                        Account protection managed by AdLaunch Security Protocol
                    </p>
                </div>
            </div>

            <div className="hidden lg:flex flex-1 bg-[#1a1a1a] relative overflow-hidden items-center justify-center p-20">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-transparent pointer-events-none" />
                <div className="relative z-10 max-w-lg space-y-8">
                    <div className="h-16 w-16 bg-white/10 rounded-2xl backdrop-blur-3xl flex items-center justify-center border border-white/10 shadow-2xl">
                        <Lock className="h-8 w-8 text-orange-500" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black text-white leading-tight">Zero-Trust Architecture</h2>
                        <p className="text-lg text-slate-400 leading-relaxed">
                            We implement industry-leading encryption standards to ensure your marketer credentials and campaign data remain strictly private and tamper-proof.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 pt-8">
                        <div className="space-y-1">
                            <p className="text-3xl font-black text-white">256-bit</p>
                            <p className="text-sm text-slate-500 uppercase font-bold tracking-widest">AES Encryption</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-black text-white">100%</p>
                            <p className="text-sm text-slate-500 uppercase font-bold tracking-widest">Data Sovereignty</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
