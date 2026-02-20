"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Eye,
    TrendingUp,
    Play,
    Target,
    Smartphone,
    CheckCircle2,
    Clock,
} from "lucide-react";
import MarketerLayout from "@/components/MarketerLayout";
import KPICard from "@/components/analytics/KPICard";
import FunnelChart from "@/components/analytics/FunnelChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
} from "recharts";
import { analyticsAPI, Ad, AdUser } from "@/services/api";
import { API_ENDPOINTS } from "@/config/api";
import {
    Dialog,
    DialogContent,
    DialogOverlay,
} from "@/components/ui/dialog";
import VideoThumbnail from "@/components/VideoThumbnail";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function MarketerCampaignDetailPage({ params }: PageProps) {
    const { id } = use(params);

    const [campaign, setCampaign] = useState<Ad | null>(null);
    const [adDetail, setAdDetail] = useState<any>(null);
    const [viewers, setViewers] = useState<AdUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [videoSrc, setVideoSrc] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchCampaignData();
        }
    }, [id]);

    const fetchCampaignData = async () => {
        try {
            setLoading(true);
            const detailRes = await analyticsAPI.getAdDetail(id);
            if (detailRes.status) {
                setAdDetail(detailRes);
                setCampaign(detailRes.adInfo);
            }

            const usersRes = await analyticsAPI.getAdUsers(id);
            if (usersRes.status) {
                setViewers(usersRes.users);
            }
        } catch (error) {
            console.error("Error fetching campaign data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlay = (adID: string) => {
        const videoUrl = API_ENDPOINTS.AD.VIDEO(adID);
        setVideoSrc(videoUrl);
        setPreviewOpen(true);
    };

    const getViewerStatusBadge = (status: string) => {
        switch (status) {
            case "completed": return <Badge className="bg-green-100 text-green-700 font-bold"><CheckCircle2 className="h-3 w-3 mr-1" />COMPLETED</Badge>;
            case "started": return <Badge className="bg-yellow-100 text-yellow-700 font-bold"><Clock className="h-3 w-3 mr-1" />STARTED</Badge>;
            case "opened": return <Badge className="bg-blue-100 text-blue-700 font-bold"><Eye className="h-3 w-3 mr-1" />OPENED</Badge>;
            default: return <Badge variant="secondary">{status?.toUpperCase()}</Badge>;
        }
    };

    if (loading) {
        return (
            <MarketerLayout title="Campaign Details">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-muted-foreground animate-pulse">Analyzing campaign data...</div>
                </div>
            </MarketerLayout>
        );
    }

    return (
        <MarketerLayout title="Campaign Intelligence">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/marketer/campaigns">
                            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-foreground">{campaign?.title}</h1>
                                <Badge className={campaign?.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                                    {campaign?.status?.toUpperCase()}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">{campaign?.campaign_name} • ID: {id}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="card-elevated lg:col-span-2">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-full md:w-64 flex-shrink-0">
                                    <div className="aspect-video bg-secondary rounded-xl overflow-hidden relative cursor-pointer group" onClick={() => campaign && handlePlay(campaign._id)}>
                                        <VideoThumbnail videoSrc={API_ENDPOINTS.AD.VIDEO(campaign?._id || "")} />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="p-3 rounded-full bg-white text-black shadow-xl"><Play className="h-6 w-6" /></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4">
                                    <h2 className="text-xl font-bold">{campaign?.title}</h2>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div><p className="text-muted-foreground">CPC Rate</p><p className="font-bold text-primary">{campaign?.cost_per_view?.toFixed(2)} Br.</p></div>
                                        <div><p className="text-muted-foreground">Started On</p><p className="font-semibold">{campaign ? new Date(campaign.start_date).toLocaleDateString() : "-"}</p></div>
                                        <div><p className="text-muted-foreground">Expiry Date</p><p className="font-semibold">{campaign ? new Date(campaign.end_date).toLocaleDateString() : "-"}</p></div>
                                        <div><p className="text-muted-foreground">Audience Size</p><p className="font-semibold">{viewers.length} Users</p></div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-elevated">
                        <CardHeader><CardTitle className="text-lg">Budget Execution</CardTitle></CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs uppercase tracking-tighter">
                                    <span className="text-muted-foreground">Executed Spend</span>
                                    <span className="font-bold">{adDetail?.budget?.spent?.toLocaleString()} Br.</span>
                                </div>
                                <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500" style={{ width: `${adDetail?.budget?.usage_percent || 0}%` }} />
                                </div>
                            </div>
                            <div className="flex justify-between items-end pt-4 border-t border-border">
                                <div><p className="text-[10px] text-muted-foreground uppercase">Remaining</p><p className="text-xl font-bold text-primary">{adDetail?.budget?.remaining_budget?.toLocaleString()} Br.</p></div>
                                <div className="text-right"><p className="text-[10px] text-muted-foreground uppercase">Total Alloc</p><p className="font-semibold">{adDetail?.budget?.budget_allocation?.toLocaleString()} Br.</p></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard title="Impressions" value={adDetail?.total_views || 0} icon={Eye} />
                    <KPICard title="Net Completions" value={adDetail?.completed_views || 0} icon={Target} />
                    <KPICard title="Efficiency" value={`${((adDetail?.completion_rate || 0) * 100).toFixed(1)}%`} icon={TrendingUp} />
                    <KPICard title="Unique Reach" value={viewers.length} icon={Smartphone} />
                </div>

                <Tabs defaultValue="performance" className="space-y-6">
                    <TabsList className="bg-secondary/50 p-1">
                        <TabsTrigger value="performance" className="px-6">Daily Momentum</TabsTrigger>
                        <TabsTrigger value="funnel" className="px-6">Funnel Leakage</TabsTrigger>
                        <TabsTrigger value="viewers" className="px-6">Activity Log</TabsTrigger>
                    </TabsList>

                    <TabsContent value="performance" className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle className="text-base">Views vs Conversions</CardTitle></CardHeader>
                            <CardContent className="h-[320px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={adDetail?.analytics?.dailyData || []}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/.05)" strokeWidth={2} name="Views" />
                                        <Area type="monotone" dataKey="completions" stroke="hsl(var(--orange-600))" fill="hsl(var(--orange-600)/.05)" strokeWidth={2} name="Completions" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="funnel">
                        <Card className="min-h-[400px]">
                            <CardHeader><CardTitle className="text-base text-center">Conversion Pathway</CardTitle></CardHeader>
                            <CardContent><FunnelChart data={adDetail?.analytics?.funnelData || []} /></CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="viewers">
                        <Card>
                            <CardHeader><CardTitle className="text-base">Recent Interactions</CardTitle></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader><TableRow><TableHead>Subscriber Hash</TableHead><TableHead>Interaction</TableHead><TableHead>Timestamp</TableHead><TableHead>Handset</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {viewers.slice(0, 10).map((viewer, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell className="font-mono text-xs text-muted-foreground">{viewer.msisdn.replace(/(\d{5})\d{3}(\d{3})/, '$1***$2')}</TableCell>
                                                <TableCell>{getViewerStatusBadge(viewer.status)}</TableCell>
                                                <TableCell className="text-xs">{viewer.started_at ? new Date(viewer.started_at).toLocaleString() : "-"}</TableCell>
                                                <TableCell className="text-xs">{viewer.device_info ? `${viewer.device_info.brand} ${viewer.device_info.model}` : "Generic Handset"}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                    <DialogOverlay className="z-[999] bg-black/80 backdrop-blur-sm" />
                    <DialogContent className="max-w-4xl p-0 border-none bg-transparent shadow-none z-[1000]">
                        <div className="relative group">
                            <video controls className="w-full aspect-video rounded-2xl shadow-2xl" autoPlay>
                                {videoSrc && <source src={videoSrc} type="video/mp4" />}
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </MarketerLayout>
    );
}
