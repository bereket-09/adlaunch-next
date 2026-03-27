"use client";

import { useState, useEffect } from "react";
import { analyticsAPI } from "@/services/api";
import {
    FileText,
    Download,
    BarChart3,
    PieChart,
    TrendingUp,
    RefreshCw,
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

import { toast } from "sonner";

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
    const [generating, setGenerating] = useState<number | null>(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const marketerId = typeof window !== 'undefined' ? localStorage.getItem("marketer_id") || "" : "";
                if (!marketerId) return;

                const data = await analyticsAPI.getMarketerReports(marketerId, selectedPeriod);

                // Mapping Logic - Daily trends for the chart
                const weeklyTrend = data.analytics?.dailyData?.map((d: any, i: number) => ({
                    week: d.name || `Day ${i + 1}`,
                    views: d.views || 0,
                    spend: d.spend || 0,
                })) || [];

                // Campaign breakdown data specifically for campaign tab
                const performanceData = data.analytics?.campaignData?.map((d: any) => ({
                    campaign: d.name,
                    impressions: d.impressions || 0,
                    completions: d.completions || 0,
                    spend: d.spend || 0,
                })) || [];

                const rewardDataMapped = data.analytics?.deviceData?.map((d: any) => ({
                    name: d.name,
                    value: d.value,
                    color: d.color || "hsl(var(--primary))",
                })) || [];

                const summary = {
                    totalImpressions: data.total_views || 0,
                    totalCompletions: data.completed_views || 0,
                    completionRate: data.completion_rate ? Math.round(data.completion_rate * 10) / 10 : 0,
                    totalSpend: data.budget?.spent || 0,
                };

                setReportData({ 
                    performanceData, 
                    weeklyTrend, 
                    rewardData: rewardDataMapped, 
                    summary,
                    campaigns: data.ads || [] // Store actual campaign list
                });
            } catch (err) {
                console.error(err);
                toast.error("Failed to load report data.");
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [selectedPeriod]);

    const handleGenerate = (id: number, name: string) => {
        setGenerating(id);
        
        // Mocking a real file generation based on template type
        setTimeout(() => {
            try {
                const template = reportTemplates.find(t => t.id === id);
                let content = "";
                let filename = `${name.toLowerCase().replace(/ /g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;

                if (template?.type === 'performance') {
                    content = "Campaign,Impressions,Completions,Spend(Br)\n" + 
                        reportData.performanceData.map((d: any) => `${d.campaign},${d.impressions},${d.completions},${d.spend}`).join("\n");
                } else if (template?.type === 'daily') {
                    content = "Date,Views,Spend(Br)\n" + 
                        reportData.weeklyTrend.map((d: any) => `${d.week},${d.views},${d.spend}`).join("\n");
                } else {
                    content = `Report: ${name}\nGenerated on: ${new Date().toLocaleString()}\nPeriod: Last ${selectedPeriod} days\nSummary: ${JSON.stringify(reportData.summary)}`;
                }

                const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                setGenerating(null);
                toast.success(`${name} exported!`, {
                    description: "The file has been saved to your downloads.",
                });
            } catch (err) {
                setGenerating(null);
                toast.error("Failed to generate report file.");
            }
        }, 1200);
    };

    if (loading || !reportData) {
        return (
            <MarketerLayout title="Reports">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-muted-foreground animate-pulse">Gathering intelligence...</div>
                </div>
            </MarketerLayout>
        );
    }

    const { performanceData, weeklyTrend, rewardData, summary, campaigns } = reportData;

    return (
        <MarketerLayout title="Business Intelligence">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Advanced Reporting</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">Deep-dive into your campaign performance data</p>
                    </div>
                    <Select value={`last-${selectedPeriod}`} onValueChange={(val) => setSelectedPeriod(Number(val.replace("last-", "")))}>
                        <SelectTrigger className="w-[180px] h-10 rounded-xl border-border/60 font-semibold text-xs">
                            <SelectValue>{periods.find((p) => p.value === selectedPeriod)?.label}</SelectValue>
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-border/60 shadow-xl">
                            {periods.map((p) => (
                                <SelectItem key={p.value} value={`last-${p.value}`} className="rounded-xl text-xs font-medium cursor-pointer">
                                    {p.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="bg-secondary/80 rounded-xl p-1 gap-1 h-auto w-full sm:w-auto overflow-x-auto justify-start">
                        <TabsTrigger value="overview" className="rounded-lg px-5 py-2 gap-2 text-xs font-semibold transition-all whitespace-nowrap">Executive Summary</TabsTrigger>
                        <TabsTrigger value="campaigns" className="rounded-lg px-5 py-2 gap-2 text-xs font-semibold transition-all whitespace-nowrap">Performance Details</TabsTrigger>
                        <TabsTrigger value="templates" className="rounded-lg px-5 py-2 gap-2 text-xs font-semibold transition-all whitespace-nowrap">Saved Templates</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="card-elevated border-0 rounded-2xl overflow-hidden">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <BarChart3 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Impressions</p>
                                        <p className="text-2xl font-black text-foreground tabular-nums tracking-tight">{summary.totalImpressions.toLocaleString()}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="card-elevated border-0 rounded-2xl overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 opacity-[0.03]" />
                                <CardContent className="p-5 flex items-center gap-4 relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                                        <TrendingUp className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Completions</p>
                                        <p className="text-2xl font-black text-foreground tabular-nums tracking-tight">{summary.totalCompletions.toLocaleString()}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="card-elevated border-0 rounded-2xl overflow-hidden">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                        <PieChart className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Conv. Rate</p>
                                        <p className="text-2xl font-black text-foreground tabular-nums tracking-tight">{summary.completionRate}%</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="card-elevated border-0 rounded-2xl overflow-hidden" 
                                  style={{ background: 'linear-gradient(135deg, hsl(24,100%,50%), hsl(34,100%,55%))' }}>
                                <CardContent className="p-5 flex items-center gap-4 text-white">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0 backdrop-blur-md">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Net Spend</p>
                                        <p className="text-2xl font-black tabular-nums tracking-tight">{summary.totalSpend.toFixed(2)} Br.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            <Card className="card-elevated border-0 rounded-2xl">
                                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40 py-4 px-6">
                                    <CardTitle className="text-sm font-bold">Daily Trends</CardTitle>
                                    <ExportButton filename="daily-trend" />
                                </CardHeader>
                                <CardContent className="h-[320px] p-6 pt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={weeklyTrend}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                            <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                                            <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                                            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                                            <Line yAxisId="left" type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={3} name="Views" dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                                            <Line yAxisId="right" type="monotone" dataKey="spend" stroke="hsl(var(--orange-600))" strokeWidth={3} name="Spend" dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="card-elevated border-0 rounded-2xl">
                                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40 py-4 px-6">
                                    <CardTitle className="text-sm font-bold">Audience Device Breakdown</CardTitle>
                                    <ExportButton filename="device-split" />
                                </CardHeader>
                                <CardContent className="h-[320px] p-6 pt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie data={rewardData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={2} dataKey="value" stroke="none" label={({ name, value }) => `${name}: ${value}%`}>
                                                {rewardData.map((entry: any, index: number) => <Cell key={index} fill={entry.color} style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))' }} />)}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="campaigns">
                        <Card className="card-elevated border-0 rounded-2xl overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40 py-4 px-6">
                                <CardTitle className="text-sm font-bold">Performance by Campaign</CardTitle>
                                <ExportButton filename="campaign-breakdown" />
                            </CardHeader>
                            <CardContent className="p-6">
                                <AnalyticsFilters campaigns={campaigns} config={{ campaign: true, dateRange: true, status: true }} />
                                <div className="mt-8 h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={performanceData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                                            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                                            <YAxis dataKey="campaign" type="category" width={100} stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} cursor={{ fill: 'hsl(var(--primary)/0.03)' }} />
                                            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 600 }} />
                                            <Bar dataKey="impressions" fill="hsl(var(--primary))" name="Impressions" radius={[0, 4, 4, 0]} barSize={12} />
                                            <Bar dataKey="completions" fill="hsl(var(--orange-500))" name="Completions" radius={[0, 4, 4, 0]} barSize={12} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="templates" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {reportTemplates.map((template) => (
                            <Card key={template.id} className="card-elevated border-0 rounded-2xl group cursor-pointer hover:bg-primary/[0.01] transition-all">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="h-8 gap-2 rounded-lg border-border/60 text-xs font-semibold group-hover:border-primary group-hover:text-primary transition-colors"
                                            onClick={() => handleGenerate(template.id, template.name)}
                                            disabled={generating === template.id}
                                        >
                                            {generating === template.id ? (
                                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                            ) : (
                                                <Download className="h-3.5 w-3.5" />
                                            )} 
                                            {generating === template.id ? "Generating..." : "Generate"}
                                        </Button>
                                    </div>
                                    <h3 className="font-bold text-sm text-foreground mb-1 group-hover:underline underline-offset-4 decoration-primary/30">{template.name}</h3>
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
