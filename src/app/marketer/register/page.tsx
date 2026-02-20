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
                description: "Your KYC details are under review.",
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
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 space-y-8 max-w-md">
                    <Logo size="lg" className="mx-auto" />

                    <div className="inline-flex items-center justify-center p-6 bg-emerald-500/10 rounded-full border border-emerald-500/20 shadow-2xl shadow-emerald-500/20">
                        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-3xl font-black text-white uppercase italic">Application Pending</h1>
                        <p className="text-slate-400 leading-relaxed font-medium">
                            Thank you for applying to become a brand partner. Our compliance team is currently reviewing your KYC documentation.
                        </p>
                        <p className="text-slate-500 text-sm">
                            Estimated review time: <span className="text-white font-bold">24-48 hours</span>
                        </p>
                    </div>

                    <Button asChild variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 h-12 rounded-2xl font-bold">
                        <Link href="/marketer/login">Return to Login</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex font-sans">
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

                <div className="w-full max-w-[600px] space-y-10 relative z-10 py-12">
                    <div className="text-center space-y-4">
                        <Logo size="lg" className="mx-auto" />
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">Partner Onboarding</h1>
                            <p className="text-slate-400 font-medium">Complete your KYC to access the AdLaunch Engine</p>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">Full Name</Label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="name"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="bg-slate-900 border-slate-800 text-white pl-12 h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">Work Email</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="john@company.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="bg-slate-900 border-slate-800 text-white pl-12 h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" title="Standard AdLaunch Password" className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">Account Passkey</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="bg-slate-900 border-slate-800 text-white pl-12 h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="company_name" className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">Company Name</Label>
                                    <div className="relative group">
                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="company_name"
                                            placeholder="Company Ltd."
                                            value={formData.company_name}
                                            onChange={handleChange}
                                            className="bg-slate-900 border-slate-800 text-white pl-12 h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="business_reg_number" className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">Registration #</Label>
                                    <div className="relative group">
                                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="business_reg_number"
                                            placeholder="REG-123456"
                                            value={formData.business_reg_number}
                                            onChange={handleChange}
                                            className="bg-slate-900 border-slate-800 text-white pl-12 h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="business_address" className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">Headquarters Address</Label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-4 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                    <Textarea
                                        id="business_address"
                                        placeholder="Enter full business address..."
                                        value={formData.business_address}
                                        onChange={handleChange}
                                        className="bg-slate-900 border-slate-800 text-white pl-12 min-h-[100px] rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-medium py-3"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contact_info" className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">Phone / Secondary Contact</Label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="contact_info"
                                        placeholder="+251 900 000 000"
                                        value={formData.contact_info}
                                        onChange={handleChange}
                                        className="bg-slate-900 border-slate-800 text-white pl-12 h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="gradient"
                                className="w-full h-14 rounded-2xl text-lg font-black tracking-widest uppercase italic shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
                                disabled={isLoading}
                            >
                                {isLoading ? "Submitting Application..." : "Submit for Review"}
                            </Button>
                        </form>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/marketer/login"
                            className="text-xs font-bold text-slate-500 hover:text-primary uppercase tracking-widest transition-all"
                        >
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
