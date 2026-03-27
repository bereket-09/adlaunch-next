"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { analyticsAPI } from "@/services/api";
import { Eye, TrendingUp, DollarSign, Target, Zap, Activity, Clock, Users } from "lucide-react";
import MarketerLayout from "@/components/MarketerLayout";
import KPICard from "@/components/analytics/KPICard";
import FunnelChart from "@/components/analytics/FunnelChart";
import HeatmapChart from "@/components/analytics/HeatmapChart";
import RealTimeIndicator from "@/components/analytics/RealTimeIndicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ComposedChart, AreaChart, Area, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend, Bar,
} from "recharts";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const DEVICE_COLORS = ["hsl(24,100%,50%)", "hsl(24,100%,70%)", "hsl(224,70%,60%)"];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-card border border-border/60 rounded-xl px-3.5 py-2.5 shadow-xl text-xs">
            <p className="font-semibold text-foreground mb-1.5">{label}</p>
            {payload.map((p: any, i: number) => (
                <div key={i} className="flex items-center gap-2 mb-0.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-muted-foreground">{p.name}:</span>
                    <span className="font-bold text-foreground">{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
                </div>
            ))}
        </div>
    );
};

export default function MarketerDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const marketerID = typeof window !== 'undefined' ? localStorage.getItem("marketer_id") : null;
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

        if (!marketerID || !token) {
            router.push("/marketer/login");
            return;
        }

        analyticsAPI.getMarketerAnalysis(marketerID)
            .then(setData)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [router]);

    if (loading) {
        return (
            <MarketerLayout title="Dashboard">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-5">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl animate-pulse"
                                 style={{ background: 'linear-gradient(135deg, hsl(24,100%,50%), hsl(34,100%,55%))' }} />
                            <div className="absolute inset-0 rounded-2xl animate-ping opacity-20"
                                 style={{ background: 'linear-gradient(135deg, hsl(24,100%,50%), hsl(34,100%,55%))' }} />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading your analytics...</p>
                    </div>
                </div>
            </MarketerLayout>
        );
    }

    if (error || !data) {
        return (
            <MarketerLayout title="Dashboard">
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
                        <Activity className="h-7 w-7 text-red-400" />
                    </div>
                    <div className="text-center">
                        <p className="font-semibold text-foreground">Failed to load analytics</p>
                        <p className="text-sm text-muted-foreground mt-1">Check your connection and try again.</p>
                    </div>
                    <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="rounded-xl">
                        Retry
                    </Button>
                </div>
            </MarketerLayout>
        );
    }

    const { analytics, budget, total_views, completed_views, completion_rate } = data;
    const deviceDataWithColors = (analytics?.deviceData || []).map((d: any, i: number) => ({
        ...d, color: DEVICE_COLORS[i % DEVICE_COLORS.length]
    }));

    return (
        <MarketerLayout title="Analytics Overview">
            <div className="page-container">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1">
                            <h1 className="text-2xl font-bold text-foreground">Campaign Intelligence</h1>
                            <Badge className="badge-orange">Live Data</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Real-time performance across all your campaigns</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <RealTimeIndicator />
                        <Link href="/marketer/upload">
                            <Button size="sm" className="rounded-xl h-9 px-4 gap-2 font-semibold text-xs text-white"
                                    style={{ background: 'linear-gradient(135deg, hsl(24,100%,50%), hsl(34,100%,55%))' }}>
                                <Zap className="h-4 w-4" /> New Campaign
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Primary KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard title="Total Impressions" value={total_views} icon={Eye} trend="up" accent />
                    <KPICard title="Completions" value={completed_views} icon={Target} trend="up" />
                    <KPICard title="Completion Rate" value={`${((completion_rate || 0) * 100).toFixed(1)}%`} icon={TrendingUp} trend="up" />
                    <KPICard title="Total Spend" value={`${(budget?.spent || 0).toFixed(2)} Br.`} icon={DollarSign} trend="down" accent />
                </div>

                {/* Secondary KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard title="Avg. Cost/View" value={`${(((budget?.spent || 0) / (completed_views || 1))).toFixed(3)} Br.`} icon={Zap} size="sm" />
                    <KPICard title="Active Campaigns" value={data?.adCount || 0} icon={Users} size="sm" />
                    <KPICard title="Reward Rate" value={`${analytics?.reward_success_rate || 100}%`} icon={Activity} size="sm" />
                    <KPICard title="Avg. Watch Time" value={analytics?.avg_watch_time || "N/A"} icon={Clock} size="sm" />
                </div>

                {/* Budget Progress */}
                <Card className="card-elevated border-0">
                    <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <DollarSign className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-bold text-foreground text-sm">Budget Utilization</p>
                                    <p className="text-xs text-muted-foreground">{(budget?.usage_percent || 0).toFixed(1)}% of total budget used</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                                <div className="text-center">
                                    <p className="font-black text-foreground tabular-nums">{(budget?.spent || 0).toLocaleString()} Br.</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Spent</p>
                                </div>
                                <div className="w-px h-8 bg-border/60" />
                                <div className="text-center">
                                    <p className="font-black text-primary tabular-nums">{(budget?.remaining_budget || 0).toLocaleString()} Br.</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Remaining</p>
                                </div>
                                <div className="w-px h-8 bg-border/60" />
                                <div className="text-center">
                                    <p className="font-black text-foreground tabular-nums">{(budget?.total_budget || 0).toLocaleString()} Br.</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Total</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="h-2 rounded-full bg-secondary overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000"
                                    style={{
                                        width: `${Math.min(budget?.usage_percent || 0, 100)}%`,
                                        background: 'linear-gradient(90deg, hsl(24,100%,50%), hsl(34,100%,55%))'
                                    }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs: Charts */}
                <Tabs defaultValue="overview" className="space-y-5">
                    <div className="flex items-center justify-between">
                        <TabsList className="bg-secondary/80 rounded-xl p-1 gap-1">
                            <TabsTrigger value="overview" className="rounded-lg text-xs font-semibold px-4">Performance</TabsTrigger>
                            <TabsTrigger value="funnel" className="rounded-lg text-xs font-semibold px-4">Funnel</TabsTrigger>
                            <TabsTrigger value="heatmap" className="rounded-lg text-xs font-semibold px-4">Heatmap</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="overview" className="space-y-5 mt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {/* Daily Performance */}
                            <Card className="card-elevated border-0">
                                <CardHeader className="pb-3 pt-5 px-5 border-b border-border/40">
                                    <CardTitle className="text-sm font-bold">Daily Performance</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[260px] pt-4 px-4 pb-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart data={analytics?.dailyData || []} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                                            <defs>
                                                <linearGradient id="marketerViews" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="hsl(24,100%,50%)" stopOpacity={0.15} />
                                                    <stop offset="95%" stopColor="hsl(24,100%,50%)" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false}
                                                   tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} dy={6} />
                                            <YAxis axisLine={false} tickLine={false}
                                                   tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area type="monotone" dataKey="views" fill="url(#marketerViews)"
                                                  stroke="hsl(24,100%,50%)" strokeWidth={2.5} dot={false} name="Views"
                                                  activeDot={{ r: 4, fill: 'hsl(24,100%,50%)', stroke: '#fff', strokeWidth: 2 }} />
                                            <Line type="monotone" dataKey="completions" stroke="hsl(217,91%,55%)"
                                                  strokeWidth={2} dot={false} name="Completions" />
                                            <Bar dataKey="spend" fill="hsl(24,100%,88%)" name="Spend (Br)" radius={[3,3,0,0]} />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Device Distribution */}
                            <Card className="card-elevated border-0">
                                <CardHeader className="pb-3 pt-5 px-5 border-b border-border/40">
                                    <CardTitle className="text-sm font-bold">Device Distribution</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[260px] pt-4 px-4 pb-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie data={deviceDataWithColors} cx="50%" cy="50%"
                                                 innerRadius={60} outerRadius={90} paddingAngle={4}
                                                 cornerRadius={4} dataKey="value"
                                                 label={({ name, value }) => `${name}: ${value}%`}
                                                 labelLine={false}>
                                                {deviceDataWithColors.map((entry: any, index: number) => (
                                                    <Cell key={index} fill={entry.color} stroke="none" />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
                                            <Legend iconType="circle" iconSize={8}
                                                    wrapperStyle={{ fontSize: '11px', fontWeight: '600' }} />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Hourly */}
                        <Card className="card-elevated border-0">
                            <CardHeader className="pb-3 pt-5 px-5 border-b border-border/40">
                                <CardTitle className="text-sm font-bold">Hourly Engagement</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[220px] pt-4 px-4 pb-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={analytics?.hourlyData || []} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                                        <defs>
                                            <linearGradient id="hourViews" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(24,100%,50%)" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="hsl(24,100%,50%)" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="hourComp" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(217,91%,55%)" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="hsl(217,91%,55%)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                                        <XAxis dataKey="hour" axisLine={false} tickLine={false}
                                               tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} interval={3} dy={6} />
                                        <YAxis axisLine={false} tickLine={false}
                                               tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="views" stroke="hsl(24,100%,50%)"
                                              fill="url(#hourViews)" strokeWidth={2} dot={false} name="Views" />
                                        <Area type="monotone" dataKey="completions" stroke="hsl(217,91%,55%)"
                                              fill="url(#hourComp)" strokeWidth={2} dot={false} name="Completions" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="funnel" className="mt-0">
                        <Card className="card-elevated border-0">
                            <CardHeader className="pb-3 pt-5 px-5 border-b border-border/40">
                                <CardTitle className="text-sm font-bold">Conversion Funnel</CardTitle>
                            </CardHeader>
                            <CardContent className="p-5">
                                <FunnelChart data={analytics?.funnelData || []} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="heatmap" className="mt-0">
                        <Card className="card-elevated border-0">
                            <CardHeader className="pb-3 pt-5 px-5 border-b border-border/40">
                                <CardTitle className="text-sm font-bold">Engagement Heatmap</CardTitle>
                            </CardHeader>
                            <CardContent className="p-5">
                                <HeatmapChart data={analytics?.heatmapData} title="Views by Day & Hour" />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

            </div>
        </MarketerLayout>
    );
}
