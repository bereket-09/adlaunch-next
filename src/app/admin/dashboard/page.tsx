"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import {
    Users, Video, DollarSign, TrendingUp, Activity, Eye,
    ChevronRight, ArrowUpRight, Zap, ShieldCheck, Target,
    BarChart3, Globe, Wallet, Percent
} from "lucide-react";
import KPICard from "@/components/analytics/KPICard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip as RechartsTooltip, PieChart, Pie, Cell,
} from "recharts";
import { analyticsAPI } from "@/services/api";
import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import RealTimeIndicator from "@/components/analytics/RealTimeIndicator";
import { Separator } from "@/components/ui/separator";

const RATE_COLORS = ["hsl(24,100%,50%)", "hsl(24,100%,65%)", "hsl(24,100%,80%)"];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-card border border-border/60 rounded-xl px-3.5 py-2.5 shadow-xl text-xs">
            <p className="font-semibold text-foreground mb-1.5">{label}</p>
            {payload.map((p: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-muted-foreground">{p.name}:</span>
                    <span className="font-bold text-foreground">{p.value?.toLocaleString()}</span>
                </div>
            ))}
        </div>
    );
};

export default function AdminDashboardPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        analyticsAPI.getAdminDashboard()
            .then((json) => { if (json.status) setData(json); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <AdminLayout title="System Overview">
                <div className="flex items-center justify-center h-[70vh]">
                    <div className="flex flex-col items-center gap-5">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-2xl animate-pulse"
                                 style={{ background: 'linear-gradient(135deg, hsl(24,100%,50%), hsl(34,100%,55%))' }} />
                            <div className="absolute inset-0 rounded-2xl animate-ping opacity-20"
                                 style={{ background: 'linear-gradient(135deg, hsl(24,100%,50%), hsl(34,100%,55%))' }} />
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-foreground">Loading Platform Overview</p>
                            <p className="text-sm text-muted-foreground mt-1">Fetching real-time statistics…</p>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const platform = data?.platform || {};
    const viewsData = data?.trends?.monthly_views || [];
    const pieData = (data?.rate_distribution || []).map((r: any, i: number) => ({
        ...r, color: RATE_COLORS[i % RATE_COLORS.length]
    }));
    const topCampaigns = data?.top_campaigns || [];

    return (
        <AdminLayout title="Platform Overview">
            <div className="page-container">

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Platform Overview
                            </h1>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
                                  style={{ background: 'linear-gradient(135deg, hsl(24,100%,50%), hsl(34,100%,55%))' }}>
                                <Activity className="h-3 w-3" /> LIVE
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Real-time monitoring of campaigns, revenue, and system health.
                        </p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <RealTimeIndicator label="Connected" />
                        <Link href="/admin/analytics">
                            <Button variant="outline" size="sm" className="rounded-xl h-9 px-4 gap-2 font-semibold text-xs border-border/60 hover:border-primary/40 hover:text-primary transition-all">
                                <BarChart3 className="h-4 w-4" /> Deep Analytics
                            </Button>
                        </Link>
                        <Link href="/admin/upload">
                            <Button size="sm" className="rounded-xl h-9 px-4 gap-2 font-semibold text-xs text-white transition-all"
                                    style={{ background: 'linear-gradient(135deg, hsl(24,100%,50%), hsl(34,100%,55%))' }}>
                                <Zap className="h-4 w-4" /> New Campaign
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* KPIs — top row (orange accents for 2 key ones) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
                    <KPICard title="Total Views" value={platform.views?.toLocaleString() || "0"} icon={Eye} trend="up" change={12.4} accent />
                    <KPICard title="Active Marketers" value={platform.active_marketers || 0} icon={Users} trend="neutral" />
                    <KPICard title="Active Campaigns" value={platform.active_campaigns || 0} icon={Zap} trend="up" change={5.2} />
                    <KPICard title="Total Revenue" value={`${(platform.total_revenue || 0).toLocaleString()} Br.`} icon={DollarSign} trend="up" change={8.1} accent />
                    <KPICard title="Engagement Rate" value={`${platform.engagement_rate || 0}%`} icon={TrendingUp} trend="up" change={2.4} />
                    <KPICard title="System Health" value={`${platform.system_health || 99.9}%`} icon={ShieldCheck} trend="neutral" />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Traffic Area Chart */}
                    <Card className="lg:col-span-2 card-elevated border-0 rounded-2xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-4 pt-5 px-6 border-b border-border/40">
                            <div>
                                <CardTitle className="text-base font-bold">Traffic Distribution</CardTitle>
                                <CardDescription className="text-xs mt-0.5">Monthly view trends across the platform</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge className="badge-green text-[10px]">+12.4% MoM</Badge>
                                <div className="p-1.5 rounded-lg bg-secondary">
                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-5 px-4 pb-4">
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={viewsData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(24,100%,50%)" stopOpacity={0.18} />
                                                <stop offset="95%" stopColor="hsl(24,100%,50%)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false}
                                               tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 500 }} dy={8} />
                                        <YAxis axisLine={false} tickLine={false}
                                               tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 500 }} dx={-4} />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="views" stroke="hsl(24,100%,50%)"
                                              fill="url(#gradViews)" strokeWidth={2.5} dot={false}
                                              activeDot={{ r: 5, fill: 'hsl(24,100%,50%)', strokeWidth: 2, stroke: '#fff' }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Revenue Pie */}
                    <Card className="card-elevated border-0 rounded-2xl overflow-hidden flex flex-col">
                        <CardHeader className="pb-4 pt-5 px-6 border-b border-border/40">
                            <CardTitle className="text-base font-bold">Revenue by Tier</CardTitle>
                            <CardDescription className="text-xs mt-0.5">Campaign pricing distribution</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center flex-1 p-5">
                            <div className="h-[180px] w-full relative">
                                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none z-10">
                                    <span className="text-3xl font-black text-foreground tabular-nums">
                                        {pieData.reduce((acc: number, cur: any) => acc + (cur.value || 0), 0)}
                                    </span>
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Campaigns</span>
                                </div>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} dataKey="value" innerRadius={58} outerRadius={76}
                                             paddingAngle={3} cornerRadius={4} animationDuration={800}>
                                            {pieData.map((p: any, i: number) => (
                                                <Cell key={i} fill={p.color} stroke="none" className="hover:opacity-80 transition-opacity cursor-pointer" />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip contentStyle={{ borderRadius: '12px', fontSize: '11px', border: '1px solid hsl(var(--border))' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-full space-y-2 mt-2">
                                {pieData.map((p: any, i: number) => (
                                    <div key={p.name} className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-secondary/50 transition-all cursor-default">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                                            <span className="text-xs font-semibold text-foreground">{p.name}</span>
                                        </div>
                                        <span className="text-xs font-bold text-primary">{p.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Platform health quick stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: "Avg. CPV", value: `${platform.avg_cpv || "0.05"} Br.`, icon: DollarSign, color: "text-orange-500", bg: "bg-orange-50" },
                        { label: "Completion Rate", value: `${platform.completion_rate || 0}%`, icon: Percent, color: "text-blue-500", bg: "bg-blue-50" },
                        { label: "Total Budget", value: `${(platform.total_budget || 0).toLocaleString()} Br.`, icon: Wallet, color: "text-violet-500", bg: "bg-violet-50" },
                        { label: "Total Campaigns", value: platform.total_campaigns || 0, icon: Target, color: "text-green-500", bg: "bg-green-50" },
                    ].map((s) => (
                        <div key={s.label} className="card-elevated flex items-center gap-4 p-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
                                <s.icon className={`h-5 w-5 ${s.color}`} />
                            </div>
                            <div>
                                <p className="text-base font-black text-foreground leading-none">{s.value}</p>
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mt-1">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Top Campaigns */}
                <Card className="card-elevated border-0 rounded-2xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-border/40">
                        <div>
                            <CardTitle className="text-base font-bold text-gradient bg-clip-text" style={{background:'linear-gradient(135deg,hsl(24,100%,50%),hsl(34,100%,55%))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                                Top Performing Campaigns
                            </CardTitle>
                            <CardDescription className="text-xs mt-0.5">Ranked by views and revenue efficiency</CardDescription>
                        </div>
                        <Link href="/admin/campaigns">
                            <Button variant="ghost" size="sm" className="h-8 px-3 gap-1.5 rounded-xl text-xs font-semibold text-primary hover:bg-primary/10">
                                View All <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-4">
                        {topCampaigns.length === 0 ? (
                            <div className="py-16 flex flex-col items-center gap-3 text-muted-foreground">
                                <BarChart3 className="h-10 w-10 opacity-20" />
                                <p className="text-sm font-medium opacity-50">No campaign data yet</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {topCampaigns.map((c: any, i: number) => (
                                    <div key={i}
                                         className="group flex justify-between items-center p-4 rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300 bg-card cursor-pointer">
                                        <div className="flex gap-3 items-center min-w-0">
                                            <div className="w-9 h-9 flex items-center justify-center rounded-xl text-white text-sm font-black shrink-0"
                                                 style={{ background: i === 0 ? 'linear-gradient(135deg,hsl(24,100%,50%),hsl(34,100%,55%))' : 'hsl(var(--secondary))' }}>
                                                <span className={i === 0 ? 'text-white' : 'text-muted-foreground'}>{i + 1}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">{c.name}</p>
                                                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider truncate">{c.marketer}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-5 text-right shrink-0 ml-3">
                                            <div>
                                                <p className="text-sm font-bold text-foreground tabular-nums">{c.views?.toLocaleString()}</p>
                                                <p className="text-[9px] text-muted-foreground font-bold uppercase">Views</p>
                                            </div>
                                            <Separator orientation="vertical" className="h-8 self-center" />
                                            <div>
                                                <p className="text-sm font-bold text-primary tabular-nums">{c.revenue?.toLocaleString()}</p>
                                                <p className="text-[9px] text-primary/60 font-bold uppercase">Revenue</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>
        </AdminLayout>
    );
}
