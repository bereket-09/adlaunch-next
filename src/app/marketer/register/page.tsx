"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Mail, Lock, Building, FileText, MapPin, Phone, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS } from "@/config/api";

export default function MarketerRegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        company_name: "",
        business_reg_number: "",
        business_address: "",
        contact_info: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(API_ENDPOINTS.MARKETER.REGISTER, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok || !data.status) {
                toast({
                    title: "Registration Failed",
                    description: data.error || "Please check your information and try again.",
                    variant: "destructive",
                });
                return;
            }

            setIsSubmitted(true);
            toast({
                title: "Application Submitted",
                description: "Your account details are under review.",
            });
        } catch (err) {
            toast({
                title: "Connection Error",
                description: "Failed to reach the server.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 text-center overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

                <div className="relative z-10 space-y-12 max-w-xl w-full">
                    <div className="animate-fade-in-up">
                        <Logo size="lg" className="mx-auto" />
                    </div>

                    <div className="inline-flex items-center justify-center p-8 bg-emerald-500/10 rounded-[2.5rem] border border-emerald-500/20 shadow-2xl shadow-emerald-500/20 animate-fade-in">
                        <CheckCircle2 className="h-14 w-14 text-emerald-500" />
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-5xl font-black text-white italic uppercase tracking-tight">Application Received</h1>
                        <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-md mx-auto">
                            Thank you for your interest in joining our network. Our team is currently reviewing your account details.
                        </p>
                        <div className="pt-4">
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em]">
                                Expected review within <span className="text-white">24-48 hours</span>
                            </p>
                        </div>
                    </div>

                    <Button asChild variant="outline" className="w-full max-w-xs mx-auto border-white/5 bg-white/[0.02] text-white hover:bg-white/5 h-14 rounded-2xl font-black uppercase tracking-widest transition-all">
                        <Link href="/marketer/login">Return to Hub</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] flex font-sans overflow-x-hidden">
            <div className="flex-1 flex items-center justify-center p-8 sm:p-16 relative overflow-y-auto">
                {/* Modern Ambient Background */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="w-full max-w-[650px] space-y-12 relative z-10 py-16">
                    <div className="text-center space-y-6">
                        <div className="animate-fade-in-up">
                            <Logo size="lg" className="mx-auto" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black tracking-tight text-white italic uppercase">Partner Enrollment</h1>
                            <p className="text-slate-400 font-medium text-lg">Enter your details to join the AdRewards advertising network</p>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-1">Full Name</Label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="name"
                                            placeholder="Your Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="bg-black/40 border-white/5 text-white pl-12 h-14 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium placeholder:text-slate-800"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-1">Business Email</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="email@company.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="bg-black/40 border-white/5 text-white pl-12 h-14 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium placeholder:text-slate-800"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" title="Your Account Password" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-1">Choose Password</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="bg-black/40 border-white/5 text-white pl-12 h-14 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium placeholder:text-slate-800"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <Label htmlFor="company_name" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-1">Company Name</Label>
                                    <div className="relative group">
                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="company_name"
                                            placeholder="Your Organization"
                                            value={formData.company_name}
                                            onChange={handleChange}
                                            className="bg-black/40 border-white/5 text-white pl-12 h-14 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium placeholder:text-slate-800"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="business_reg_number" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-1">Business License ID</Label>
                                    <div className="relative group">
                                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="business_reg_number"
                                            placeholder="ID-123456"
                                            value={formData.business_reg_number}
                                            onChange={handleChange}
                                            className="bg-black/40 border-white/5 text-white pl-12 h-14 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium placeholder:text-slate-800"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="business_address" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-1">Company Address</Label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-4 h-5 w-5 text-slate-600 group-focus-within:text-primary transition-colors" />
                                    <Textarea
                                        id="business_address"
                                        placeholder="Full business address..."
                                        value={formData.business_address}
                                        onChange={handleChange}
                                        className="bg-black/40 border-white/5 text-white pl-12 min-h-[120px] rounded-[1.5rem] focus:ring-4 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium py-4 placeholder:text-slate-800 resize-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contact_info" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-1">Primary Contact Number</Label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="contact_info"
                                        placeholder="+251 ..."
                                        value={formData.contact_info}
                                        onChange={handleChange}
                                        className="bg-black/40 border-white/5 text-white pl-12 h-14 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium placeholder:text-slate-800"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="gradient"
                                className="w-full h-16 rounded-[1.5rem] text-xl font-black tracking-widest uppercase italic shadow-orange-glow active:scale-[0.98] transition-all hover:opacity-95"
                                disabled={isLoading}
                                size="lg"
                            >
                                {isLoading ? "Processing..." : "Submit Application"}
                            </Button>
                        </form>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/marketer/login"
                            className="text-xs font-black text-slate-500 hover:text-primary uppercase tracking-[0.3em] transition-all"
                        >
                            ← Back to hub
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
