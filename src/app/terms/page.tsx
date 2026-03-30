"use client";

import Logo from "@/components/Logo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
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
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter">Terms & Conditions</h1>
                        <p className="text-slate-500 font-medium tracking-widest text-xs uppercase">Effective from March 2026</p>
                    </div>

                    <div className="prose prose-slate max-w-none space-y-8 text-slate-600 font-medium leading-loose">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-slate-900 uppercase italic">1. Acceptance of Terms</h2>
                            <p>By accessing and using AdRewards, the leading Ethiopian digital advertising network, you agree to be bound by these Terms and Conditions. Our platform connects brands with Ethiopian mobile audiences through high-impact video engagement.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-slate-900 uppercase italic">2. User Conduct</h2>
                            <p>Users participating in the reward program must be based in Ethiopia and use valid mobile credentials. Any attempt to circumvent security protocols, including view fraud or bot activity, will result in immediate termination of access and forfeiture of all accumulated rewards.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-slate-900 uppercase italic">3. Marketer Responsibilities</h2>
                            <p>Marketers are responsible for ensuring that all campaign content complies with Ethiopian advertising regulations and cultural standards. AdRewards reserves the right to remove any content that is deemed inappropriate, offensive, or technically non-compliant.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-slate-900 uppercase italic">4. Reward Distribution</h2>
                            <p>Rewards, including airtime and data bundles, are distributed through our partner Ethiopian telecom networks. While we strive for immediate fulfillment, technical delays may occur during peak network operations.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-slate-900 uppercase italic">5. Data Privacy</h2>
                            <p>Your privacy is paramount. Please refer to our Privacy Policy for more details on how we protect your data while delivering the best advertising experience in Ethiopia.</p>
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
