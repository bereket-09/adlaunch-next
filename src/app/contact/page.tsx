"use client";

import Logo from "@/components/Logo";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-3xl border-b border-slate-100">
                <div className="container mx-auto px-8 h-20 flex items-center justify-between">
                    <Logo />
                    <Link href="/">
                        <Button variant="ghost" className="text-slate-500 hover:text-primary gap-2">
                            <ArrowLeft className="h-4 w-4" /> Back to Home
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="pt-32 pb-20 px-8">
                <div className="container mx-auto max-w-6xl space-y-20">
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                            <Zap className="h-3 w-3 fill-current" />
                            Global Support Operations
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.85]">
                            Contact our <br />
                            <span className="text-primary italic">Support Desk.</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                            Our team of Ethiopian engineers and support specialists are standing by 24/7 to assist you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="bg-slate-50/50 border border-slate-100 p-12 rounded-[3.5rem] space-y-8 group hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                            <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                                <Mail className="h-8 w-8" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Email Portal</p>
                                <p className="text-xl font-black italic text-slate-900 uppercase">support@adrewards.et</p>
                            </div>
                        </div>

                        <div className="bg-slate-50/50 border border-slate-100 p-12 rounded-[3.5rem] space-y-8 group hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                            <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                                <Phone className="h-8 w-8" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Direct Lineline</p>
                                <p className="text-xl font-black italic text-slate-900 uppercase">+251 900 000 000</p>
                            </div>
                        </div>

                        <div className="bg-slate-50/50 border border-slate-100 p-12 rounded-[3.5rem] space-y-8 group hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                            <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                                <MapPin className="h-8 w-8" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">NOC HQ</p>
                                <p className="text-xl font-black italic text-slate-900 uppercase italic">Addis Ababa, Ethiopia</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-12 border-t border-slate-100 bg-slate-50/50">
                <div className="container mx-auto px-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                    © 2026 AdRewards Ethiopia Group.
                </div>
            </footer>
        </div>
    );
}
