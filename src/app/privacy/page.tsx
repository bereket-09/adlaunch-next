"use client";

import Logo from "@/components/Logo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
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
                <div className="container mx-auto max-w-4xl space-y-12">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter">Privacy Policy</h1>
                        <p className="text-slate-500 font-medium tracking-widest text-xs uppercase">Effective from March 2026</p>
                    </div>

                    <div className="prose prose-slate max-w-none space-y-8 text-slate-600 font-medium leading-loose">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-slate-900 uppercase italic">1. Introduction</h2>
                            <p>AdRewards is committed to protecting your privacy in the Ethiopian digital advertising space. This policy outlines how we handle data from both Ethiopian viewers and marketers.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-slate-900 uppercase italic">2. Information Collection</h2>
                            <p>For viewers, we collect minimal data required for reward fulfillment, such as mobile numbers and engagement status. Marketers provide information necessary for account management and compliance with Ethiopian business laws.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-slate-900 uppercase italic">3. Data Usage</h2>
                            <p>Data is primarily used to ensure accurate reward distribution and to provide marketers with engagement insights. We do not sell personally identifiable information to third parties.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-slate-900 uppercase italic">4. Security Measures</h2>
                            <p>AdRewards uses industry-standard encryption protocols (AES-256) to secure all data within our Ethiopian servers. Our systems are continuously monitored for unauthorized access or anomalies.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-slate-900 uppercase italic">5. Your Rights</h2>
                            <p>Users have the right to request access to their stored data or deletion of their account records. Please contact our support desk for any privacy-related concerns.</p>
                        </section>
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
