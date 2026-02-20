"use client";

import { useEffect, useState } from "react";
import { analyticsAPI } from "@/services/api";
import {
    Eye,
    TrendingUp,
    DollarSign,
    Target,
    Zap,
    Activity,
    Clock,
    Users
} from "lucide-react";
import MarketerLayout from "@/components/MarketerLayout";
import KPICard from "@/components/analytics/KPICard";
import FunnelChart from "@/components/analytics/FunnelChart";
import HeatmapChart from "@/components/analytics/HeatmapChart";
import RealTimeIndicator from "@/components/analytics/RealTimeIndicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ComposedChart,
    AreaChart,
    Area,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart as RePieChart,
    Pie,
    Cell,
    Legend,
    Bar,
} from "recharts";
import { useRouter } from "next/navigation";

export default function MarketerDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const marketerID = typeof window !== 'undefined' ? localStorage.getItem("marketer_id") : null;
                if (!marketerID) {
                    router.push("/marketer/login");
                    return;
                }
                const res = await analyticsAPI.getMarketerAnalysis(marketerID);
                setData(res);
            } catch (err) {
                console.error("Failed to fetch marketer analysis:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, []);

    if (loading) {
        return (
            <MarketerLayout title="Dashboard">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-muted-foreground animate-pulse">Loading analytics...</div>
                </div>
            </MarketerLayout>
        );
    }

    if (!data) {
        return (
            <MarketerLayout title="Dashboard">
                <div className="text-center py-20 text-red-500">
                    Failed to load data. Please check your connection.
                </div>
            </MarketerLayout>
        );
    }

    const {
        analytics,
        budget,
        total_views,
        completed_views,
        completion_rate,
    } = data;

    return (
        <MarketerLayout title="Marketer Intelligence">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Analytics Overview</h1>
                        <p className="text-muted-foreground">Real-time performance across all your campaigns</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <RealTimeIndicator />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard title="Total Impressions" value={total_views} icon={Eye} trend="up" />
                    <KPICard title="Total Completions" value={completed_views} icon={Target} trend="up" />
                    <KPICard title="Completion Rate" value={`${(completion_rate * 100).toFixed(1)}%`} icon={TrendingUp} trend="up" />
                    <KPICard title="Total Spend" value={`${budget?.spent?.toFixed(2) || 0} Br.`} icon={DollarSign} trend="down" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard title="Average CPC" value={`${((budget?.spent || 0) / (completed_views || 1)).toFixed(2)} Br.`} icon={Zap} size="sm" />
                    <KPICard title="Active Ads" value={data?.adCount || 0} icon={Users} size="sm" />
                    <KPICard title="Reward Success" value={`${analytics?.reward_success_rate || "100"}%`} icon={Activity} size="sm" />
                    <KPICard title="Avg. Watch Time" value={analytics?.avg_watch_time || "16 sec"} icon={Clock} size="sm" />
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="bg-secondary/50">
                        <TabsTrigger value="overview">Performance Trend</TabsTrigger>
                        <TabsTrigger value="funnel">Funnel Analysis</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="card-elevated">
                                <CardHeader><CardTitle className="text-lg">Daily Performance</CardTitle></CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart data={analytics?.dailyData || []}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                            <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                            <Tooltip />
                                            <Legend />
                                            <Area yAxisId="left" type="monotone" dataKey="views" fill="hsl(var(--primary)/.1)" stroke="hsl(var(--primary))" name="Views" />
                                            <Line yAxisId="left" type="monotone" dataKey="completions" stroke="hsl(var(--orange-600))" strokeWidth={2} name="Completions" />
                                            <Bar yAxisId="right" dataKey="spend" fill="hsl(var(--gray-300))" name="Spend (Br)" radius={[4, 4, 0, 0]} />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="card-elevated">
                                <CardHeader><CardTitle className="text-lg">Device Distribution</CardTitle></CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie
                                                data={analytics?.deviceData || []}
                                                cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value"
                                                label={({ name, value }) => `${name}: ${value}%`}
                                            >
                                                {analytics?.deviceData?.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="card-elevated">
                            <CardHeader><CardTitle className="text-lg">Engagement Heatmap</CardTitle></CardHeader>
                            <CardContent>
                                <HeatmapChart data={analytics?.heatmapData} title="Completions by Day & Hour" />
                            </CardContent>
                        </Card>

                        <Card className="card-elevated">
                            <CardHeader><CardTitle className="text-lg">Hourly Momentum (Today)</CardTitle></CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={analytics?.hourlyData || []}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                        <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={10} interval={2} />
                                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="views" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/.2)" name="Views" />
                                        <Area type="monotone" dataKey="completions" stackId="2" stroke="hsl(var(--orange-600))" fill="hsl(var(--orange-600)/.2)" name="Completions" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="funnel">
                        <Card className="card-elevated">
                            <CardHeader><CardTitle className="text-lg font-semibold">Conversion Funnel</CardTitle></CardHeader>
                            <CardContent>
                                <FunnelChart data={analytics?.funnelData || []} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </MarketerLayout>
    );
}
