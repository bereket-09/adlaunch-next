"use client";

import { useState, useEffect } from "react";
import { analyticsAPI } from "@/services/api";
import {
    FileText,
    Download,
    BarChart3,
    PieChart,
    TrendingUp,
} from "lucide-react";
import MarketerLayout from "@/components/MarketerLayout";
import ExportButton from "@/components/analytics/ExportButton";
import AnalyticsFilters from "@/components/analytics/AnalyticsFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart as RePieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { API_ENDPOINTS } from "@/config/api";

const periods = [
    { label: "Last 7 days", value: 7 },
    { label: "Last 30 days", value: 30 },
    { label: "Last 90 days", value: 90 },
];

const reportTemplates = [
    { id: 1, name: "Campaign Performance Summary", description: "Overview of all campaign metrics", type: "performance" },
    { id: 2, name: "Funnel Analysis Report", description: "Detailed conversion funnel breakdown", type: "funnel" },
    { id: 3, name: "MSISDN Activity Report", description: "Per-user engagement details", type: "msisdn" },
    { id: 4, name: "Budget Utilization Report", description: "Spend analysis and ROI metrics", type: "budget" },
    { id: 5, name: "Daily Engagement Summary", description: "Day-by-day performance metrics", type: "daily" },
];

export default function MarketerReportsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState(30);
    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const marketerId = typeof window !== 'undefined' ? localStorage.getItem("marketer_id") || "" : "";
                if (!marketerId) return;

                const data = await analyticsAPI.getMarketerReports(marketerId, selectedPeriod);

                // Mapping Logic
                const performanceData = data.analytics?.dailyData?.map((d: any, i: number) => ({
                    campaign: `Campaign ${i + 1}`,
                    impressions: d.views,
                    completions: d.completions,
                    spend: d.spend,
                })) || [];

                const weeklyTrend = data.analytics?.dailyData?.map((d: any, i: number) => ({
                    week: `Day ${i + 1}`,
                    views: d.views,
                    spend: d.spend,
                })) || [];

                const rewardDataMapped = data.analytics?.deviceData?.map((d: any) => ({
                    name: d.name,
                    value: d.value,
                    color: d.color || "hsl(var(--primary))",
                })) || [
                        { name: "Mobile", value: 85, color: "hsl(var(--primary))" },
                        { name: "Tablet", value: 10, color: "hsl(var(--orange-600))" },
                        { name: "Desktop", value: 5, color: "hsl(var(--gray-400))" },
                    ];

                const summary = {
                    totalImpressions: performanceData.reduce((sum: number, d: any) => sum + d.impressions, 0),
                    totalCompletions: performanceData.reduce((sum: number, d: any) => sum + d.completions, 0),
                    completionRate: performanceData.length
                        ? Math.round((performanceData.reduce((sum: number, d: any) => sum + d.completions, 0) /
                            performanceData.reduce((sum: number, d: any) => sum + d.impressions, 1)) * 1000) / 10
                        : 0,
                    totalSpend: performanceData.reduce((sum: number, d: any) => sum + d.spend, 0),
                };

                setReportData({ performanceData, weeklyTrend, rewardData: rewardDataMapped, summary });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [selectedPeriod]);

    if (loading || !reportData) {
        return (
            <MarketerLayout title="Reports">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-muted-foreground animate-pulse">Generating reports...</div>
                </div>
            </MarketerLayout>
        );
    }

    const { performanceData, weeklyTrend, rewardData, summary } = reportData;

    return (
        <MarketerLayout title="Business Intelligence">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Advanced Reporting</h1>
                        <p className="text-muted-foreground">Deep-dive into your campaign performance data</p>
                    </div>
                    <Select value={`last-${selectedPeriod}`} onValueChange={(val) => setSelectedPeriod(Number(val.replace("last-", "")))}>
                        <SelectTrigger className="w-[200px] h-11">
                            <SelectValue>{periods.find((p) => p.value === selectedPeriod)?.label}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {periods.map((p) => <SelectItem key={p.value} value={`last-${p.value}`}>{p.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="bg-secondary/50">
                        <TabsTrigger value="overview">Executive Summary</TabsTrigger>
                        <TabsTrigger value="campaigns">Performance Details</TabsTrigger>
                        <TabsTrigger value="templates">Saved Templates</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="card-elevated">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-primary/10 text-primary"><BarChart3 className="h-5 w-5" /></div>
                                        <div><p className="text-xs text-muted-foreground">Impressions</p><p className="text-xl font-bold">{summary.totalImpressions}</p></div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="card-elevated">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-green-100 text-green-600"><TrendingUp className="h-5 w-5" /></div>
                                        <div><p className="text-xs text-muted-foreground">Completions</p><p className="text-xl font-bold">{summary.totalCompletions}</p></div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="card-elevated">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-orange-100 text-orange-600"><PieChart className="h-5 w-5" /></div>
                                        <div><p className="text-xs text-muted-foreground">Conv. Rate</p><p className="text-xl font-bold">{summary.completionRate}%</p></div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="card-elevated">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-blue-100 text-blue-600"><FileText className="h-5 w-5" /></div>
                                        <div><p className="text-xs text-muted-foreground">Net Spend</p><p className="text-xl font-bold">{summary.totalSpend.toFixed(2)} Br.</p></div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-base">Daily Trends</CardTitle><ExportButton filename="daily-trend" /></CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={weeklyTrend}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                            <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                                            <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                                            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                                            <Tooltip />
                                            <Line yAxisId="left" type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} name="Views" dot={false} />
                                            <Line yAxisId="right" type="monotone" dataKey="spend" stroke="hsl(var(--orange-600))" strokeWidth={2} name="Spend" dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-base">Audience Device Breakdown</CardTitle><ExportButton filename="device-split" /></CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie data={rewardData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                                                {rewardData.map((entry: any, index: number) => <Cell key={index} fill={entry.color} />)}
                                            </Pie>
                                            <Tooltip />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="campaigns">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Performance by Campaign</CardTitle><ExportButton filename="campaign-breakdown" /></CardHeader>
                            <CardContent>
                                <AnalyticsFilters config={{ campaign: true, dateRange: true, status: true }} />
                                <div className="mt-8 h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={performanceData} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                                            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                            <YAxis dataKey="campaign" type="category" width={120} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="impressions" fill="hsl(var(--primary))" name="Impressions" radius={[0, 4, 4, 0]} />
                                            <Bar dataKey="completions" fill="hsl(var(--orange-600))" name="Completions" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="templates" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {reportTemplates.map((template) => (
                            <Card key={template.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 rounded-lg bg-primary/5 text-primary"><FileText className="h-5 w-5" /></div>
                                        <Button variant="outline" size="sm" className="h-8 gap-2"><Download className="h-3.5 w-3.5" />Generate</Button>
                                    </div>
                                    <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                                    <p className="text-xs text-muted-foreground">{template.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>
                </Tabs>
            </div>
        </MarketerLayout>
    );
}
