"use client";

import { 
    Clock, 
    AlertCircle, 
    ShieldCheck, 
    FileText, 
    ChevronRight,
    ArrowUpRight,
    Activity,
    ShieldAlert,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MarketerStatusViewProps {
    status: string;
}

export default function MarketerStatusView({ status }: MarketerStatusViewProps) {
    const isRejected = status === "rejected";
    const isPending = status === "pending" || status === "unverified";

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 font-sans">
            <div className="w-full max-w-2xl space-y-12 text-center relative">
                {/* Visual Background Element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="space-y-6 relative z-10">
                    <div className="inline-flex items-center justify-center p-8 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 animate-fade-in-up">
                        {isRejected ? (
                            <ShieldAlert className="h-16 w-16 text-rose-500" />
                        ) : (
                            <Clock className="h-16 w-16 text-amber-500 animate-pulse" />
                        )}
                    </div>

                    <div className="space-y-3">
                        <Badge variant="outline" className={`px-4 py-1.5 rounded-full font-black uppercase tracking-[0.2em] italic text-[10px] ${
                            isRejected ? "bg-rose-50 border-rose-200 text-rose-700" : "bg-amber-50 border-amber-200 text-amber-700"
                        }`}>
                            {isRejected ? "Action Required: Rejected" : "Review in Progress"}
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 italic uppercase">
                            {isRejected ? "Profile Verification Failed" : "Awaiting Authorization"}
                        </h1>
                        <p className="text-slate-500 font-medium text-lg max-w-md mx-auto">
                            {isRejected 
                                ? "Our compliance team identified inconsistencies in your submission. Please review and update your credentials." 
                                : "Your agency's credentials have been safely received and are currently undergoing institutional vetting."
                            }
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <Card className="rounded-[2rem] border-0 bg-slate-900 text-white shadow-2xl shadow-slate-900/20 group hover:-translate-y-1 transition-all">
                        <CardContent className="p-8 text-left space-y-4">
                            <div className="p-3 bg-white/10 rounded-2xl w-fit">
                                <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black uppercase italic tracking-tighter">Identity & KYC</h3>
                                <p className="text-slate-400 text-xs mt-1 font-medium leading-relaxed">Update your TIN certificate, business license, or contact info to expedite review.</p>
                            </div>
                            <Button asChild className="w-full bg-white text-slate-900 hover:bg-slate-100 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] italic">
                                <Link href="/marketer/kyc">
                                    Manage Documents <ChevronRight className="h-4 w-4 ml-2" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 group hover:-translate-y-1 transition-all">
                        <CardContent className="p-8 text-left space-y-4">
                            <div className="p-3 bg-emerald-50 rounded-2xl w-fit">
                                <Activity className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black uppercase italic tracking-tighter text-slate-900">Live Support</h3>
                                <p className="text-slate-500 text-xs mt-1 font-medium leading-relaxed">Need help with your application? Our support desk is ready to assist you.</p>
                            </div>
                            <Button variant="outline" className="w-full border-slate-200 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] italic hover:bg-slate-900 hover:text-white">
                                Contact AdRewards <ArrowUpRight className="h-4 w-4 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="pt-8 space-y-4 relative z-10">
                    <div className="flex items-center justify-center gap-6">
                        {[
                            { label: 'Transmission', done: true },
                            { label: 'Compliance Review', done: false, active: true },
                            { label: 'Account Activation', done: false }
                        ].map((step, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${step.done ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : step.active ? 'bg-amber-500 animate-pulse' : 'bg-slate-200'}`} />
                                <span className={`text-[8px] font-black uppercase tracking-widest ${step.done || step.active ? 'text-slate-900' : 'text-slate-300'}`}>{step.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
