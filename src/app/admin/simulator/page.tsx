"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
    AlertTriangle, Send, Phone, MessageSquare, Wifi, Battery,
    MoreHorizontal, Smartphone, Zap, RefreshCcw, ExternalLink,
    ChevronRight, ShieldCheck, Activity, Cpu, MonitorSmartphone,
    XCircle, CheckCircle2, Terminal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import RealTimeIndicator from "@/components/analytics/RealTimeIndicator";

interface LinkResponse {
    status: boolean;
    token: string;
    watch_url: string;
    state: string;
    createdStatus: string;
}

export default function SimulatorPage() {
    const [msisdn, setMsisdn] = useState("");
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<LinkResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const simulateSMS = async () => {
        if (!msisdn) return;
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const res = await fetch("/api/proxy/link/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ msisdn: `251${msisdn}` }),
            });

            if (!res.ok) {
                throw new Error(`CORE_GATEWAY_REJECT: HTTP ${res.status}`);
            }

            const data: LinkResponse = await res.json();
            setResponse(data);
        } catch (err: any) {
            setError(err.message || "Simulation protocol failed. Check system orchestration.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && msisdn.length === 9 && !loading) {
            simulateSMS();
        }
    };

    return (
        <AdminLayout title="Link Simulator">
            <div className="space-y-8 animate-in fade-in duration-1000">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-0.5">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            Campaign Link Simulator
                            <Badge className="bg-primary shadow-lg shadow-primary/10 text-white border-none py-0.5 px-2 font-bold tracking-widest text-[9px]">TESTING_TOOL</Badge>
                        </h1>
                        <p className="text-muted-foreground font-medium text-sm">Test and validate campaign redirection links for mobile subscribers.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white/40 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-sm">
                        <RealTimeIndicator label="SERVICE: ONLINE" />
                        <Separator orientation="vertical" className="h-6" />
                        <Badge variant="outline" className="h-8 rounded-lg bg-blue-500/10 text-blue-600 border-blue-500/20 flex items-center gap-2 px-3 font-bold uppercase text-[9px] tracking-widest">
                            <MonitorSmartphone className="h-3.5 w-3.5" /> EMULATOR: ACTIVE
                        </Badge>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Control Panel */}
                    <div className="lg:w-[40%] space-y-8">
                        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-secondary/10 border-b border-border/50 p-6">
                                <CardTitle className="flex items-center gap-3 text-lg font-bold uppercase tracking-tight">
                                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                        <Zap className="h-5 w-5" />
                                    </div>
                                    Generate Link
                                </CardTitle>
                                <CardDescription className="text-xs font-semibold">Create a test redirection link for a specific phone number.</CardDescription>
                            </CardHeader>

                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-primary/70 ml-2">Phone Number (MSISDN)</label>
                                    <div className="flex items-center gap-0 group">
                                        <div className="font-bold font-mono px-4 h-11 flex items-center bg-secondary/30 rounded-l-xl border-2 border-r-0 border-border/40 text-muted-foreground select-none text-sm">+251</div>
                                        <Input
                                            type="tel"
                                            placeholder="9XXXXXXXX"
                                            value={msisdn}
                                            maxLength={9}
                                            onChange={(e) => setMsisdn(e.target.value.replace(/\D/g, ""))}
                                            className="flex-1 h-11 rounded-none rounded-r-xl text-base font-bold bg-secondary/10 border-2 border-border/40 focus-visible:ring-primary/30 transition-all px-4 font-mono"
                                            onKeyDown={handleKeyPress}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-xl border border-border/20">
                                        <Terminal className="h-4 w-4 text-primary opacity-50" />
                                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest italic">Target: Ethiopia (Standard 9-Digit)</p>
                                    </div>
                                </div>

                                <Button
                                    onClick={simulateSMS}
                                    disabled={loading || msisdn.length !== 9}
                                    className="w-full h-12 text-base font-bold rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 gap-2 group hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden"
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCcw className="h-5 w-5 animate-spin" />
                                            GENERATING...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            SEND TEST SMS
                                        </>
                                    )}
                                </Button>


                                {error && (
                                    <div className="flex items-start gap-4 p-6 bg-rose-500/10 rounded-2xl border-2 border-rose-500/20 text-rose-600 animate-in slide-in-from-top-4 duration-500">
                                        <XCircle className="h-6 w-6 mt-1 flex-shrink-0" />
                                        <div className="space-y-1">
                                            <p className="font-black uppercase tracking-widest text-sm">Error generating link</p>
                                            <p className="text-sm font-bold opacity-80 italic">"{error}"</p>
                                        </div>
                                    </div>
                                )}

                                {response && !error && (
                                    <div className="p-6 bg-emerald-500/5 rounded-2xl border-2 border-emerald-500/20 text-emerald-700 animate-in slide-in-from-top-4 duration-500">
                                        <div className="flex items-center gap-4">
                                            <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping" />
                                            <div className="space-y-0.5">
                                                <p className="font-black uppercase tracking-widest text-sm">Link Generated Successfully</p>
                                                <p className="text-[10px] font-black opacity-60 font-mono tracking-tighter uppercase whitespace-pre">TOKEN: {response.token.slice(0, 24)}...</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="p-6 bg-secondary/5 rounded-2xl border border-border/50 space-y-4">
                            <h3 className="font-bold text-foreground uppercase tracking-wider flex items-center gap-2 text-[10px]">
                                <Cpu className="h-4 w-4 text-primary" />
                                Simulator Features
                            </h3>
                            <Separator className="bg-border/50" />
                            <ul className="space-y-3">
                                {[
                                    "Bypasses physical SMS gateway for local development.",
                                    "Simulates real-time tracking and redirection logic.",
                                    "Validates end-to-end user flow before deployment.",
                                    "Directly injects the test link into the virtual handset."
                                ].map((spec, i) => (
                                    <li key={i} className="flex gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                        <span className="text-[11px] font-medium text-muted-foreground leading-relaxed">{spec}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-4 flex items-center justify-between border-t border-white/5">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Kernel_Version</p>
                                    <p className="text-xs font-black text-white font-mono uppercase tracking-tighter italic">V4.STABLE_BUILD</p>
                                </div>
                                <ShieldCheck className="h-10 w-10 text-primary opacity-20" />
                            </div>
                        </div>
                    </div>

                    {/* Virtual Handset Emulator */}
                    <div className="lg:flex-1 flex flex-col items-center justify-center p-12 bg-secondary/5 rounded-[3rem] border-4 border-dashed border-border/40 relative overflow-hidden min-h-[850px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />

                        <div className="relative z-10 scale-[0.85] xl:scale-100 transition-all duration-700">
                            {response ? (
                                <div className="relative w-[380px] h-[780px] bg-black rounded-[70px] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.6)] border-[12px] border-zinc-900 overflow-hidden ring-4 ring-white/5 ring-inset">
                                    {/* Sensors & Notch */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-44 h-10 bg-zinc-900 rounded-b-[35px] z-50 flex items-center justify-center gap-4">
                                        <div className="w-3 h-3 rounded-full bg-zinc-800 shadow-inner" />
                                        <div className="w-14 h-1.5 bg-zinc-800 rounded-full" />
                                    </div>

                                    {/* Screen Fabric */}
                                    <div className="absolute inset-0 bg-[#0c0c0e] flex flex-col pt-16 pb-12">
                                        {/* Temporal Lockscreen / Header */}
                                        <div className="flex justify-between items-center px-10 mb-10 z-20">
                                            <span className="text-white text-sm font-black tracking-tighter">12:45 <span className="text-[10px] opacity-40 italic">ST</span></span>
                                            <div className="flex items-center gap-2.5">
                                                <Wifi className="h-4 w-4 text-white opacity-80" />
                                                <div className="w-7 h-3.5 border-2 border-white/30 rounded-[5px] p-[2px] flex justify-start">
                                                    <div className="w-[85%] h-full bg-emerald-500 rounded-[2px]" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto space-y-6 px-6 custom-scrollbar">
                                            <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
                                                <div className="bg-[#1c1c1e] text-white p-6 rounded-[32px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/10 border border-white/5 relative overflow-hidden group">
                                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />

                                                    <div className="flex items-start gap-5">
                                                        <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0 border border-primary/30 shadow-xl">
                                                            <MessageSquare className="h-7 w-7 text-primary" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <p className="text-[11px] text-primary font-black uppercase tracking-[0.3em]">New Ad Message</p>
                                                                <span className="text-[10px] text-zinc-500 font-bold uppercase italic">JUST_NOW</span>
                                                            </div>
                                                            <p className="text-[15px] leading-relaxed mb-6 font-bold text-zinc-200 tracking-tight">
                                                                Click the link below to view the exclusive offer from AdLaunch. Enjoy your reward!
                                                            </p>

                                                            <div className="bg-black/50 p-5 rounded-2xl border border-white/5 group-hover:border-primary/40 transition-all duration-300">
                                                                <a
                                                                    href={response.watch_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-primary text-[12px] font-black break-all flex items-center gap-3 hover:underline group/link"
                                                                >
                                                                    <div className="flex-1 overflow-hidden truncate">{response.watch_url}</div>
                                                                    <ExternalLink className="h-4 w-4 flex-shrink-0 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                                                </a>
                                                            </div>

                                                            <div className="flex items-center justify-between mt-6">
                                                                <Badge className="bg-primary/20 text-primary border border-primary/20 py-1 px-4 h-6 text-[10px] font-black uppercase tracking-widest italic rounded-lg">AD_CAMPAIGN</Badge>
                                                                <div className="flex -space-x-2">
                                                                    <div className="w-3 h-3 rounded-full bg-primary/30 border border-black/40" />
                                                                    <div className="w-3 h-3 rounded-full bg-primary/50 border border-black/40" />
                                                                    <div className="w-3 h-3 rounded-full bg-primary/70 border border-black/40" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* OS Dock Layer */}
                                        <div className="mt-auto px-8 pt-6 pb-4 flex justify-between items-center bg-zinc-900/40 backdrop-blur-3xl border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                                            <div className="w-14 h-14 bg-zinc-800/80 rounded-[22px] flex items-center justify-center text-white/30 border border-white/5"><Phone className="h-7 w-7" /></div>
                                            <div className="w-16 h-16 bg-primary rounded-[24px] flex items-center justify-center shadow-3xl shadow-primary/40 text-white transform hover:scale-105 active:scale-95 transition-all"><MessageSquare className="h-8 w-8" /></div>
                                            <div className="w-14 h-14 bg-zinc-800/80 rounded-[22px] flex items-center justify-center text-white/30 border border-white/5"><MoreHorizontal className="h-7 w-7" /></div>
                                        </div>
                                    </div>

                                    {/* Swipe Handle */}
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-40 h-2 bg-white/20 rounded-full z-50 shadow-inner" />
                                </div>
                            ) : (
                                <div className="w-[380px] h-[780px] bg-background/20 backdrop-blur-xl rounded-[70px] border-[5px] border-dashed border-border/40 flex flex-col items-center justify-center p-16 text-center gap-10 group relative transition-all duration-700 hover:border-primary/40">
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[65px]" />
                                    <div className="w-24 h-24 bg-secondary/20 rounded-[35px] flex items-center justify-center shadow-2xl border border-white/10 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-primary/10 transition-all duration-700 relative z-10">
                                        <MonitorSmartphone className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="space-y-3 relative z-10">
                                        <h3 className="text-2xl font-bold text-foreground uppercase tracking-wider leading-none">VIRTUAL_PHONE</h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed font-bold italic opacity-60">
                                            Awaiting test link generation. Enter a phone number and click "Send Test SMS" to see how the message appears on a user's device.
                                        </p>
                                    </div>
                                    <div className="flex gap-3 relative z-10">
                                        <div className="w-2 h-2 rounded-full bg-primary/20 animate-pulse" />
                                        <div className="w-2 h-2 rounded-full bg-primary/30 animate-pulse delay-100" />
                                        <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse delay-200" />
                                    </div>

                                    <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/5 rounded-3xl border border-white/5 opacity-40 group-hover:opacity-100 transition-opacity">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] leading-tight">ORCHESTRATION_STBY_MODE_4</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
