"use client";

import { useEffect, useState } from "react";
import {
    Users, Eye, Activity, Target, Zap, DollarSign, Globe, CheckCircle2,
    BarChart3, PieChart as PieChartIcon, TrendingUp, Filter, Download
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import KPICard from "@/components/analytics/KPICard";
import FunnelChart from "@/components/analytics/FunnelChart";
import RealTimeIndicator from "@/components/analytics/RealTimeIndicator";
import ExportButton from "@/components/analytics/ExportButton";
import AnalyticsFilters from "@/components/analytics/AnalyticsFilters";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    AreaChart, Area, Line, Bar,
    XAxis, YAxis, CartesianGrid,
    Tooltip as RechartsTooltip, ResponsiveContainer, Legend, ComposedChart
} from "recharts";

import { API_ENDPOINTS } from "@/config/api";
import { analyticsAPI } from "@/services/api";

type AdminDashboardResponse = {
    status: boolean;
    platform: {
        total_views: number;
        daily_active_users: number;
        completion_rate: number;
        total_revenue: number;
        avg_latency: number;
        system_uptime: number;
    };
    trends: {
        name: string;
        views: number;
        completions: number;
    }[];
    funnel: {
        label: string;
        value: number;
    }[];
    marketer_performance: {
        name: string;
        campaigns: number;
        views: number;
        spend: number;
        efficiency: number;
    }[];
};

export default function AdminAnalyticsPage() {
    const [data, setData] = useState<AdminDashboardResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const json = await analyticsAPI.getAdminAnalysis();
                setData(json);
            } catch (err) {
                console.error("Failed to load admin analytics", err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <AdminLayout title="Analytics">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary/20 border-t-primary" />
                        <p className="text-muted-foreground text-sm font-medium">Loading analytics data...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (!data || !data.platform) {
        return (
            <AdminLayout title="Analytics">
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                    <div className="p-4 bg-rose-50 rounded-full">
                        <Activity className="h-8 w-8 text-rose-500" />
                    </div>
                    <h2 className="text-xl font-bold">Analytics Data Error</h2>
                    <p className="text-muted-foreground text-sm">Could not load analytics data from the server.</p>
                    <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="rounded-xl h-9">Retry Connection</Button>
                </div>
            </AdminLayout>
        );
    }

    const { platform, trends, funnel, marketer_performance } = data;

    const platformTrend = trends.map(t => ({
        date: t.name,
        views: t.views,
        completions: t.completions,
        revenue: platform.total_revenue / trends.length
    }));

    return (
        <AdminLayout title="Platform Analytics">
            <div className="space-y-6 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics Overview</h1>
                        <p className="text-muted-foreground text-sm">Cross-platform performance metrics and conversion flow analysis.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <RealTimeIndicator />
                        <ExportButton filename="platform-analytics" />
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                    <KPICard title="Total Impressions" value={platform.total_views} icon={Eye} trend="up" change={15} />
                    <KPICard title="Daily Users" value={platform.daily_active_users} icon={Users} trend="up" change={8} />
                    <KPICard title="Conversion Rate" value={`${platform.completion_rate}%`} icon={Target} trend="up" change={2.1} />
                    <KPICard title="Total Revenue" value={`${platform.total_revenue} Br.`} icon={DollarSign} trend="up" change={10} />
                    <KPICard title="Avg Latency" value={`${platform.avg_latency}ms`} icon={Zap} trend="neutral" />
                    <KPICard title="System Uptime" value={`${platform.system_uptime}%`} icon={Activity} trend="neutral" />
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <div className="bg-background/50 backdrop-blur-sm p-2 rounded-2xl border border-border/50 shadow-sm overflow-x-auto">
                        <TabsList className="bg-secondary/20 p-1 rounded-xl h-auto flex gap-1">
                            <TabsTrigger value="overview" className="rounded-lg px-6 py-2.5 gap-2 text-xs font-bold transition-all">
                                <BarChart3 className="h-4 w-4" /> Performance Trend
                            </TabsTrigger>
                            <TabsTrigger value="funnel" className="rounded-lg px-6 py-2.5 gap-2 text-xs font-bold transition-all">
                                <TrendingUp className="h-4 w-4" /> Conversion Funnel
                            </TabsTrigger>
                            <TabsTrigger value="marketers" className="rounded-lg px-6 py-2.5 gap-2 text-xs font-bold transition-all">
                                <Users className="h-4 w-4" /> Marketers
                            </TabsTrigger>
                            <TabsTrigger value="system" className="rounded-lg px-6 py-2.5 gap-2 text-xs font-bold transition-all">
                                <Activity className="h-4 w-4" /> System Health
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="overview" className="animate-in fade-in slide-in-from-bottom-2">
                        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-secondary/10 border-b border-border/50 py-4 px-6">
                                <CardTitle className="text-lg font-bold">Traffic & Engagement</CardTitle>
                                <CardDescription className="text-xs">Impressions and conversions over time.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px] pt-6 pr-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={platformTrend}>
                                        <defs>
                                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
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
                                        <Legend verticalAlign="top" align="right" height={36} wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                                        <Area
                                            name="Impressions"
                                            type="monotone"
                                            dataKey="views"
                                            fill="url(#areaGradient)"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={2}
                                        />
                                        <Line
                                            name="Conversions"
                                            type="monotone"
                                            dataKey="completions"
                                            stroke="#f97316"
                                            strokeWidth={2}
                                            dot={{ fill: '#f97316', strokeWidth: 1, r: 3 }}
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="funnel" className="animate-in fade-in slide-in-from-bottom-2">
                        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden max-w-2xl mx-auto">
                            <CardHeader className="bg-secondary/10 border-b border-border/50 py-4 px-6">
                                <CardTitle className="text-lg font-bold text-center">Conversion Funnel</CardTitle>
                                <CardDescription className="text-xs text-center">User journey from view to engagement.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-center py-10">
                                <FunnelChart data={funnel} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="marketers" className="animate-in fade-in slide-in-from-bottom-2">
                        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-secondary/10 border-b border-border/50 flex flex-row items-center justify-between py-4 px-6">
                                <div className="space-y-0.5">
                                    <CardTitle className="text-lg font-bold">Marketer Performance</CardTitle>
                                    <CardDescription className="text-xs">Ranking by active campaigns and spend.</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" className="h-8 gap-2 rounded-lg text-xs font-bold">
                                    <Filter className="h-3 w-3" /> High Volume
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-secondary/5 border-none">
                                                <TableHead className="py-3 pl-6 uppercase text-[10px] font-bold text-muted-foreground text-left">Entity Name</TableHead>
                                                <th className="text-center py-3 text-[10px] font-bold uppercase text-muted-foreground">Campaigns</th>
                                                <th className="text-center py-3 text-[10px] font-bold uppercase text-muted-foreground">Impressions</th>
                                                <th className="text-right py-3 text-[10px] font-bold uppercase text-muted-foreground">Total Spend</th>
                                                <th className="text-right py-3 pr-6 text-[10px] font-bold uppercase text-muted-foreground">ROI</th>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {marketer_performance.map(m => (
                                                <TableRow key={m.name} className="hover:bg-secondary/10 transition-colors border-b border-border/50">
                                                    <TableCell className="py-3 pl-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                                {m.name.charAt(0)}
                                                            </div>
                                                            <span className="text-sm font-bold">{m.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <td className="py-3 text-center text-xs font-medium">{m.campaigns}</td>
                                                    <td className="py-3 text-center text-xs font-mono">{m.views.toLocaleString()}</td>
                                                    <td className="py-3 text-right text-xs font-bold text-primary">{m.spend.toLocaleString()} Br.</td>
                                                    <td className="py-3 pr-6 text-right">
                                                        <Badge variant="outline" className="font-bold text-[10px] bg-emerald-50 text-emerald-600 border-none">
                                                            {m.efficiency}%
                                                        </Badge>
                                                    </td>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="system" className="animate-in fade-in slide-in-from-bottom-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: "API Status", val: "Operational", sub: "Latency: 24ms", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
                                { label: "Database Cluster", val: "Optimized", sub: "Sync: Normal", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
                                { label: "CDN Health", val: "Active", sub: "99.9% Cache Hit", icon: Globe, color: "text-emerald-500", bg: "bg-emerald-50" },
                                { label: "Core Engine", val: "Stable", sub: "Peak: 450 req/s", icon: Zap, color: "text-primary", bg: "bg-primary/10" },
                            ].map((s, i) => (
                                <Card key={i} className="border border-border/50 shadow-sm rounded-2xl overflow-hidden bg-background/50 hover:bg-background transition-colors">
                                    <CardContent className="p-5 flex items-start gap-4">
                                        <div className={`p-2.5 rounded-xl ${s.bg}`}>
                                            <s.icon className={`h-5 w-5 ${s.color}`} />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{s.label}</p>
                                            <p className={`text-lg font-bold ${s.color}`}>{s.val}</p>
                                            <p className="text-[10px] text-muted-foreground font-medium">{s.sub}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
}
