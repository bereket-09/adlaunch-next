"use client";

import { useEffect, useState } from "react";
import {
    Users,
    Video,
    DollarSign,
    TrendingUp,
    Activity,
    Eye,
    ChevronRight,
    ArrowUpRight,
    LayoutDashboard,
    Zap,
    ShieldCheck,
    Cpu,
    Target,
    BarChart3,
    MousePointer2,
    Layers,
    Clock,
    Globe
} from "lucide-react";
import KPICard from "@/components/analytics/KPICard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { API_ENDPOINTS } from "@/config/api";
import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import RealTimeIndicator from "@/components/analytics/RealTimeIndicator";
import { Separator } from "@/components/ui/separator";

const RATE_COLORS: Record<string, string> = {
    Premium: "hsl(var(--primary))",
    Standard: "hsl(var(--primary) / 0.6)",
    Free: "hsl(var(--primary) / 0.3)",
};

export default function AdminDashboardPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const res = await fetch(API_ENDPOINTS.ANALYTICS.ADMIN_DASHBOARD);
                const json = await res.json();

                if (json.status) {
                    setData(json);
                }
            } catch (err) {
                console.error("Failed to load admin dashboard", err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <AdminLayout title="System Overview">
                <div className="flex items-center justify-center h-[70vh]">
                    <div className="flex flex-col items-center gap-4 text-center px-6">
                        <div className="relative">
                            <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold tracking-tight text-foreground uppercase">Loading Overview</h2>
                            <p className="text-muted-foreground text-sm animate-pulse italic">Retrieving platform statistics...</p>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const platform = data?.platform || {};
    const viewsData = data?.trends?.monthly_views || [];
    const pieData =
        data?.rate_distribution?.map((r: any) => ({
            ...r,
            color: RATE_COLORS[r.name] || "hsl(0, 0%, 70%)",
        })) || [];
    const topCampaigns = data?.top_campaigns || [];

    return (
        <AdminLayout title="Admin Dashboard">
            <div className="space-y-6 animate-in fade-in duration-500">
                {/* Header Sub-Nav */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            Platform Overview
                            <Badge className="bg-primary text-white border-none py-0.5 px-2 font-bold text-[10px]">
                                <Activity className="h-3 w-3 mr-1" /> LIVE
                            </Badge>
                        </h1>
                        <p className="text-muted-foreground text-sm">Real-time monitoring of campaign performance, revenue, and system health.</p>
                    </div>
                    <div className="flex gap-3 items-center bg-background/60 backdrop-blur-md p-2 rounded-2xl border border-border/50 shadow-sm">
                        <RealTimeIndicator label="Status: Connected" />
                        <Separator orientation="vertical" className="h-6" />
                        <Link href="/admin/analytics">
                            <Button variant="outline" size="sm" className="rounded-xl font-bold h-8 px-4 gap-2 border-border/50 hover:bg-secondary">
                                <BarChart3 className="h-4 w-4" /> Analytics
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    <KPICard title="Total Views" value={platform.views?.toLocaleString() || "0"} icon={Eye} trend="up" change={12.4} />
                    <KPICard title="Active Marketers" value={platform.active_marketers || 0} icon={Users} trend="neutral" />
                    <KPICard title="Active Campaigns" value={platform.active_campaigns || 0} icon={Zap} trend="up" change={5.2} />
                    <KPICard title="Total Revenue" value={`${platform.total_revenue?.toLocaleString() || 0} Br.`} icon={DollarSign} trend="up" change={8.1} />
                    <KPICard title="Engagement Rate" value={`${platform.engagement_rate || 0}%`} icon={TrendingUp} trend="up" change={2.4} />
                    <KPICard title="System Health" value={`${platform.system_health || 99.9}%`} icon={ShieldCheck} trend="neutral" />
                </div>

                {/* Insights Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Traffic Distribution */}
                    <Card className="lg:col-span-2 border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                        <CardHeader className="border-b border-border/50 bg-secondary/10 py-4 px-6 flex flex-row items-center justify-between">
                            <div className="space-y-0.5">
                                <CardTitle className="text-lg font-bold">Traffic Distribution</CardTitle>
                                <CardDescription className="text-xs">Views across integrated mobile networks over time.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-none py-0.5 px-2 font-bold text-[10px]">REAL-TIME</Badge>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><Globe className="h-4 w-4" /></Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 px-4 pb-4">
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={viewsData}>
                                        <defs>
                                            <linearGradient id="dashboardViews" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 500 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 500 }}
                                            dx={-10}
                                        />
                                        <RechartsTooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--background))',
                                                borderColor: 'hsl(var(--border))',
                                                borderRadius: '12px',
                                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                                fontSize: '12px'
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="views"
                                            stroke="hsl(var(--primary))"
                                            fill="url(#dashboardViews)"
                                            strokeWidth={2}
                                            animationDuration={1000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Revenue Tier Distribution */}
                    <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden flex flex-col">
                        <CardHeader className="border-b border-border/50 bg-secondary/10 py-4 px-6">
                            <CardTitle className="text-lg font-bold">Revenue by Tier</CardTitle>
                            <CardDescription className="text-xs">Campaign distribution across pricing tiers.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center flex-1 p-6">
                            <div className="h-[220px] w-full relative">
                                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                    <span className="text-2xl font-bold text-foreground leading-none">{pieData.reduce((acc: number, cur: any) => acc + cur.value, 0)}</span>
                                    <span className="text-[10px] font-medium text-muted-foreground uppercase mt-1">Campaigns</span>
                                </div>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            dataKey="value"
                                            innerRadius={65}
                                            outerRadius={85}
                                            paddingAngle={4}
                                            cornerRadius={4}
                                            animationDuration={1000}
                                        >
                                            {pieData.map((p: any, i: number) => (
                                                <Cell key={i} fill={p.color} stroke="none" className="hover:opacity-80 transition-opacity" />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--background))',
                                                borderColor: 'hsl(var(--border))',
                                                borderRadius: '8px',
                                                fontSize: '11px'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="w-full space-y-2 mt-6">
                                {pieData.map((p: any) => (
                                    <div key={p.name} className="flex items-center justify-between p-2 rounded-xl bg-secondary/20 hover:bg-secondary/30 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: p.color }}
                                            />
                                            <span className="text-xs font-semibold text-foreground uppercase">{p.name}</span>
                                        </div>
                                        <Badge variant="outline" className="font-mono text-[10px] bg-background border-none">{p.value}%</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Campaigns Table */}
                <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                    <CardHeader className="border-b border-border/50 bg-secondary/10 py-5 px-6 flex flex-row items-center justify-between">
                        <div className="space-y-0.5">
                            <CardTitle className="text-lg font-bold text-primary">Top Performing Campaigns</CardTitle>
                            <CardDescription className="text-xs">Based on views and revenue efficiency.</CardDescription>
                        </div>
                        <Link href="/admin/campaigns">
                            <Button variant="ghost" className="h-9 px-4 rounded-xl gap-2 font-bold text-primary hover:bg-primary/5 text-xs">
                                All Campaigns <ChevronRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {topCampaigns.map((c: any, i: number) => (
                                <div
                                    key={i}
                                    className="group relative flex justify-between items-center p-4 rounded-xl bg-background border border-border/50 hover:border-primary/30 transition-all duration-300 shadow-sm"
                                >
                                    <div className="flex gap-4 items-center">
                                        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{c.name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge className="bg-secondary text-secondary-foreground border-none font-bold text-[9px] px-2 py-0">MARKETER: {c.marketer?.toUpperCase() || ""}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 text-right">
                                        <div className="space-y-0.5 text-center">
                                            <p className="text-lg font-bold font-mono tracking-tight text-foreground">
                                                {c.views.toLocaleString()}
                                            </p>
                                            <p className="text-[9px] text-muted-foreground font-bold uppercase">Views</p>
                                        </div>
                                        <Separator orientation="vertical" className="h-8" />
                                        <div className="space-y-0.5 text-center">
                                            <p className="text-lg font-bold font-mono tracking-tight text-primary">
                                                {c.revenue.toLocaleString()}
                                            </p>
                                            <p className="text-[9px] text-primary/60 font-bold uppercase">Revenue</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {topCampaigns.length === 0 && (
                                <div className="col-span-2 py-16 flex flex-col items-center justify-center gap-4 text-muted-foreground bg-secondary/5 rounded-xl border border-dashed border-border/50">
                                    <LayoutDashboard className="h-12 w-12 opacity-20" />
                                    <p className="text-sm font-medium opacity-50 uppercase">No data available</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
