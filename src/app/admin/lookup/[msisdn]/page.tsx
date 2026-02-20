"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft, Eye, TrendingUp, Gift, Smartphone, Clock, CheckCircle2, XCircle,
    Star, Calendar, AlertTriangle, ShieldCheck, Activity, Download, ChevronRight,
    MapPin, Zap, User, Fingerprint
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import KPICard from "@/components/analytics/KPICard";
import ExportButton from "@/components/analytics/ExportButton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from "recharts";
import { analyticsAPI, UserAnalytics, AuditLog } from "@/services/api";

interface PageProps {
    params: Promise<{ msisdn: string }>;
}

export default function MSISDNDetailPage({ params }: PageProps) {
    const { msisdn } = use(params);
    const [userData, setUserData] = useState<UserAnalytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (msisdn) {
            fetchUserData();
        }
    }, [msisdn]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await analyticsAPI.getUserDetail(msisdn);
            if (response.status) {
                setUserData(response);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            // Fallback for demo
            setUserData({
                status: true,
                msisdn: msisdn || "+25191****234",
                total_ads_watched: 12,
                total_rewards: 8,
                ads: [
                    { ad_id: "AD-7721", status: "completed", completed_at: "2024-05-16T14:32:05Z", reward_granted: true },
                    { ad_id: "AD-9910", status: "completed", completed_at: "2024-05-16T10:15:22Z", reward_granted: true },
                    { ad_id: "AD-4456", status: "started", completed_at: null, reward_granted: false },
                ],
                audit_logs: [
                    { type: 'link_created', timestamp: '2024-05-16T14:30:00Z', ip: '196.188.12.44', fraud_detected: false },
                    { type: 'completed_at', timestamp: '2024-05-16T14:32:05Z', ip: '196.188.12.44', fraud_detected: false },
                ],
            } as any);
        } finally {
            setLoading(false);
        }
    };

    const getRewardBadge = (status: string) => {
        switch (status) {
            case "completed": return <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-bold">COMPLETED</Badge>;
            case "started": return <Badge className="bg-amber-500/10 text-amber-600 border-none font-bold">STARTED</Badge>;
            case "opened": return <Badge className="bg-blue-500/10 text-blue-600 border-none font-bold">OPENED</Badge>;
            default: return <Badge variant="secondary" className="font-bold">{status?.toUpperCase()}</Badge>;
        }
    };

    const getEventTypeBadge = (type: string) => {
        const typeConfig: Record<string, { color: string; label: string; icon: any }> = {
            'link_created': { color: 'bg-blue-500/10 text-blue-600', label: 'Link Created', icon: Zap },
            'opened': { color: 'bg-cyan-500/10 text-cyan-600', label: 'App Opened', icon: Eye },
            'started_at': { color: 'bg-amber-500/10 text-amber-600', label: 'Ad Started', icon: Play },
            'completed_at': { color: 'bg-emerald-500/10 text-emerald-600', label: 'Ad Completed', icon: CheckCircle2 },
            'fraud_attempt_completion_without_start': { color: 'bg-rose-500/10 text-rose-600', label: 'Suspicious Activity', icon: AlertTriangle },
        };
        const config = typeConfig[type] || { color: 'bg-gray-500/10 text-gray-600', label: type, icon: Activity };
        return (
            <Badge className={`${config.color} border-none font-bold gap-1.5 py-0.5 px-2 text-[10px]`}>
                <config.icon className="h-3 w-3" />
                {config.label}
            </Badge>
        );
    };

    const engagementData = userData?.ads.reduce((acc: any[], ad) => {
        if (ad.completed_at) {
            const date = new Date(ad.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const existing = acc.find(d => d.date === date);
            if (existing) {
                existing.ads += 1;
            } else {
                acc.push({ date, ads: 1 });
            }
        }
        return acc;
    }, []) || [];

    const completionRate = userData ? (userData.total_rewards / userData.total_ads_watched * 100) : 0;
    const isHighValue = userData && userData.total_ads_watched >= 10 && completionRate >= 80;

    if (loading) {
        return (
            <AdminLayout title="User Profile">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary/20 border-t-primary" />
                        <p className="text-muted-foreground text-sm font-medium">Loading profile...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="User Profile Details">
            <div className="space-y-6 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/lookup">
                            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl hover:bg-secondary/50 border-border/50">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold font-mono text-foreground">{userData?.msisdn}</h1>
                                {isHighValue && (
                                    <Badge className="bg-primary/10 text-primary border-none py-0.5 px-2 font-bold text-[10px]">
                                        HIGH VALUE USER
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                <span className="flex items-center gap-1"><Fingerprint className="h-3 w-3" /> ID: {msisdn.slice(-4)}</span>
                                <Separator orientation="vertical" className="h-2.5" />
                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Ethiopia</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ExportButton filename={`user-${msisdn}-data`} />
                        <Button className="h-10 rounded-xl font-bold gap-2">
                            Update Registry <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard title="Ads Viewed" value={userData?.total_ads_watched || 0} icon={Eye} trend="up" change={2} />
                    <KPICard title="Total Rewards" value={userData?.total_rewards || 0} icon={Gift} trend="neutral" />
                    <KPICard title="Completion Rate" value={`${completionRate.toFixed(1)}%`} icon={TrendingUp} trend={completionRate > 50 ? "up" : "down"} />
                    <KPICard title="Active Days" value={new Set(userData?.ads.map(a => a.completed_at?.split('T')[0])).size || 0} icon={Calendar} trend="neutral" />
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Chart */}
                        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-secondary/10 border-b border-border/50 py-4 px-6">
                                <CardTitle className="text-base font-bold">Activity Overview</CardTitle>
                                <CardDescription className="text-xs">Ads completed over time.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[250px] pt-6 pr-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={engagementData}>
                                        <defs>
                                            <linearGradient id="engGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                        />
                                        <RechartsTooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--background))',
                                                borderColor: 'hsl(var(--border))',
                                                borderRadius: '8px',
                                                fontSize: '11px'
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="ads"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={2}
                                            fill="url(#engGradient)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Recent Activity Table */}
                        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-secondary/10 border-b border-border/50 py-4 px-6">
                                <CardTitle className="text-base font-bold">Campaign Interactions</CardTitle>
                                <CardDescription className="text-xs">History of ads viewed and rewards granted.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-secondary/5 border-none">
                                                <TableHead className="py-3 pl-6 text-[10px] font-bold uppercase text-muted-foreground">Ad ID</TableHead>
                                                <TableHead className="py-3 text-[10px] font-bold uppercase text-muted-foreground">Status</TableHead>
                                                <TableHead className="py-3 text-[10px] font-bold uppercase text-muted-foreground">Timestamp</TableHead>
                                                <TableHead className="py-3 pr-6 text-right text-[10px] font-bold uppercase text-muted-foreground">Reward</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {userData?.ads.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground italic text-xs">No activity records found.</TableCell>
                                                </TableRow>
                                            ) : (
                                                userData?.ads.map((ad, index) => (
                                                    <TableRow key={index} className="border-b border-border/50 hover:bg-secondary/10 transition-colors">
                                                        <TableCell className="py-3 pl-6 font-mono text-xs font-bold">
                                                            {ad.ad_id}
                                                        </TableCell>
                                                        <TableCell className="py-3">{getRewardBadge(ad.status)}</TableCell>
                                                        <TableCell className="py-3 text-muted-foreground text-[11px] font-mono">
                                                            {ad.completed_at ? new Date(ad.completed_at).toLocaleString('en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                                                        </TableCell>
                                                        <TableCell className="py-3 pr-6 text-right">
                                                            {ad.reward_granted ? (
                                                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px]">VERIFIED</Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="bg-rose-50 text-rose-600 border-none font-bold text-[10px]">FAILED</Badge>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        {/* Stats Summary */}
                        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-secondary/10 border-b border-border/50 py-4 px-6">
                                <CardTitle className="text-base font-bold">Account Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4">
                                {[
                                    { label: "Phone Number", value: userData?.msisdn, icon: User, sub: "Primary Identity" },
                                    { label: "Total Rewards", value: `${userData?.total_rewards}`, icon: Gift, sub: "Voucher History" },
                                    { label: "Completion Rate", value: `${completionRate.toFixed(1)}%`, icon: TrendingUp, sub: "Task Efficiency" },
                                    { label: "Last Activity", value: "2h ago", icon: Clock, sub: "Recent Sync" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/10 border border-border/30">
                                        <div className="p-2 rounded-lg bg-background text-primary shadow-sm border border-border/50">
                                            <item.icon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{item.label}</p>
                                            <p className="text-sm font-bold font-mono">{item.value}</p>
                                            <p className="text-[9px] text-muted-foreground font-medium">{item.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Security Logs */}
                        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-rose-50/50 border-b border-rose-100 py-3 px-6">
                                <CardTitle className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                                    <ShieldCheck className="h-4 w-4" /> Security Logs
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                {userData?.audit_logs && userData.audit_logs.length > 0 ? (
                                    userData.audit_logs.map((log: AuditLog, index: number) => (
                                        <div key={index} className="flex flex-col gap-1 p-3 rounded-xl bg-background/50 border border-border/50">
                                            <div className="flex items-center justify-between">
                                                {getEventTypeBadge(log.type)}
                                                {log.fraud_detected ? (
                                                    <Badge className="bg-rose-500 text-white border-none font-bold text-[9px]">ALERT</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-[9px] font-bold border-emerald-500/30 text-emerald-600">PASSED</Badge>
                                                )}
                                            </div>
                                            <div className="flex justify-between items-end mt-1">
                                                <div className="text-[10px]">
                                                    <p className="text-muted-foreground font-medium">IP Address</p>
                                                    <p className="font-mono font-bold">{log.ip || '0.0.0.0'}</p>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground font-mono">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 flex flex-col items-center justify-center text-center gap-2 opacity-50">
                                        <ShieldCheck className="h-8 w-8 text-muted-foreground" />
                                        <p className="text-[10px] font-bold uppercase tracking-wider">No Violations Found</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function Play(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
    )
}
