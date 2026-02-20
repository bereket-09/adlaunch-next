"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Eye,
    TrendingUp,
    Play,
    Pause,
    Target,
    Clock,
    Smartphone,
    CheckCircle2,
    Calendar,
    BarChart3,
    ArrowUpRight,
    MousePointer2,
    Layers,
    ShieldCheck,
    ChevronRight,
    ExternalLink,
    Zap,
    Download,
    MonitorSmartphone,
    MapPin,
    History,
    XCircle,
    Globe
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import KPICard from "@/components/analytics/KPICard";
import FunnelChart from "@/components/analytics/FunnelChart";
import HeatmapChart from "@/components/analytics/HeatmapChart";
import ExportButton from "@/components/analytics/ExportButton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { analyticsAPI, adAPI, Ad, AdUser } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS } from "@/config/api";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogOverlay,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import VideoThumbnail from "@/components/VideoThumbnail";
import RealTimeIndicator from "@/components/analytics/RealTimeIndicator";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function AdminCampaignDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const { toast } = useToast();

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
            // Demo fallback
            setCampaign({
                _id: id,
                marketer_id: { _id: "m1", name: "Demo Marketer" } as any,
                campaign_name: "Summer Sale 2024",
                title: "Summer Promo Ad",
                cost_per_view: 0.15,
                budget_allocation: 5000,
                remaining_budget: 2660,
                video_file_path: "ads/video.mp4",
                start_date: "2024-01-01",
                end_date: "2024-12-31",
                status: "active",
                created_at: "2024-01-15",
            } as Ad);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!campaign) return;
        const newStatus = campaign.status === "active" ? "paused" : "active";
        try {
            await adAPI.update(campaign._id, { status: newStatus });
            toast({
                title: newStatus === "active" ? "Campaign Active" : "Campaign Paused",
                description: `Campaign state updated to ${newStatus}.`
            });
            fetchCampaignData();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update campaign state.",
                variant: "destructive",
            });
        }
    };

    const handlePlay = (adID: string) => {
        const videoUrl = API_ENDPOINTS.AD.VIDEO(adID);
        setVideoSrc(videoUrl);
        setPreviewOpen(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active": return <Badge className="bg-green-100 text-green-700 border-none font-bold">Active</Badge>;
            case "paused": return <Badge className="bg-yellow-100 text-yellow-700 border-none font-bold">Paused</Badge>;
            default: return <Badge variant="secondary" className="font-bold">{status?.toUpperCase()}</Badge>;
        }
    };

    const getViewerStatusBadge = (status: string) => {
        switch (status) {
            case "completed": return <Badge className="bg-green-100 text-green-700 border-none font-bold text-[10px] px-2">SUCCESS</Badge>;
            case "started": return <Badge className="bg-yellow-100 text-yellow-700 border-none font-bold text-[10px] px-2">PENDING</Badge>;
            case "opened": return <Badge className="bg-blue-100 text-blue-700 border-none font-bold text-[10px] px-2">OPENED</Badge>;
            default: return <Badge variant="secondary" className="font-bold text-[10px] px-2">{status?.toUpperCase()}</Badge>;
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Campaign Detail">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-muted-foreground text-sm font-medium animate-pulse">Loading campaign details...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Campaign View">
            <div className="space-y-6 animate-in fade-in duration-500">
                {/* Header Sub-Nav */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/campaigns">
                            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl hover:bg-secondary border-border/50">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-bold tracking-tight text-foreground">{campaign?.title}</h1>
                                {campaign && getStatusBadge(campaign.status)}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground uppercase">
                                <span>{campaign?.campaign_name}</span>
                                <Separator orientation="vertical" className="h-2" />
                                <span className="font-mono">ID: {id}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-background/60 backdrop-blur-md p-2 rounded-2xl border border-border/50 shadow-sm">
                        <Button variant="outline" size="sm" className="h-9 rounded-xl px-4 gap-2 border-border/50 font-bold" onClick={handleToggleStatus}>
                            {campaign?.status === "active" ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                            {campaign?.status === "active" ? "Pause" : "Resume"}
                        </Button>
                        <Separator orientation="vertical" className="h-6" />
                        <ExportButton filename={`campaign-${id}-analytics`} />
                    </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard title="Total Views" value={adDetail?.total_views || 0} icon={Eye} trend="up" change={4.2} />
                    <KPICard title="Completions" value={adDetail?.completed_views || 0} icon={Target} trend="up" change={2.8} />
                    <KPICard title="Completion Rate" value={`${((adDetail?.completion_rate || 0) * 100).toFixed(1)}%`} icon={TrendingUp} trend="up" change={1.1} />
                    <KPICard title="Unique Users" value={viewers.length} icon={Smartphone} trend="neutral" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Media Overview */}
                    <Card className="lg:col-span-2 border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-[35%] bg-slate-900 group relative">
                                    <VideoThumbnail videoSrc={API_ENDPOINTS.AD.VIDEO(campaign?._id || "")} />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => campaign && handlePlay(campaign._id)}>
                                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white transform scale-90 group-hover:scale-100 transition-transform">
                                            <Play className="h-5 w-5 fill-current translate-x-0.5" />
                                        </div>
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-black/60 backdrop-blur-md text-white border-white/10 px-2 py-0.5 font-bold text-[9px]">VIDEO_X264</Badge>
                                    </div>
                                </div>

                                <div className="flex-1 p-6 space-y-4 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground">{campaign?.title}</h3>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Campaign Information</p>
                                            </div>
                                            <Badge variant="secondary" className="rounded-lg font-bold px-3">{adDetail?.marketerInfo?.name || "System"}</Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-0.5">
                                                <p className="text-[9px] font-bold text-muted-foreground uppercase">Unit Cost</p>
                                                <p className="text-sm font-bold text-foreground font-mono">{campaign?.cost_per_view?.toFixed(2)} Br.</p>
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[9px] font-bold text-muted-foreground uppercase">Deployment Period</p>
                                                <p className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                                    {campaign ? new Date(campaign.start_date).toLocaleDateString() : "-"} - {campaign ? new Date(campaign.end_date).toLocaleDateString() : "-"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t border-border/50">
                                        <Button variant="outline" size="sm" className="flex-1 h-9 rounded-xl font-bold gap-2">
                                            <ExternalLink className="h-3.5 w-3.5 opacity-60" /> Source
                                        </Button>
                                        <Button variant="default" size="sm" className="flex-1 h-9 rounded-xl font-bold gap-2">
                                            <Layers className="h-3.5 w-3.5" /> Variants
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Budget Consumption */}
                    <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden flex flex-col">
                        <CardHeader className="bg-secondary/10 border-b border-border/50 py-4 px-6">
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                <Zap className="h-4 w-4 text-primary" /> Budget Consumption
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 flex flex-col justify-between flex-1 space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Spent</p>
                                        <p className="text-2xl font-bold text-foreground">{adDetail?.budget?.spent?.toLocaleString()} <span className="text-xs font-normal">Br.</span></p>
                                    </div>
                                    <Badge className="bg-primary text-white font-bold px-2 py-0.5 text-[10px]">{adDetail?.budget?.usage_percent?.toFixed(1)}%</Badge>
                                </div>

                                <div className="space-y-2">
                                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${(adDetail?.budget?.usage_percent || 0)}%` }} />
                                    </div>
                                    <div className="flex justify-between text-[9px] font-bold text-muted-foreground uppercase">
                                        <span>Allocated: {adDetail?.budget?.budget_allocation?.toLocaleString()}</span>
                                        <span className="text-primary">Remaining: {adDetail?.budget?.remaining_budget?.toLocaleString()} Br.</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-secondary/30 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase">Current Balance</p>
                                    <p className="text-lg font-bold text-foreground">{adDetail?.budget?.remaining_budget?.toLocaleString()} Br.</p>
                                </div>
                                <div className="p-2 bg-background rounded-lg text-primary border border-border/50">
                                    <TrendingUp className="h-4 w-4" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="bg-secondary/30 p-1 rounded-xl h-10">
                        <TabsTrigger value="overview" className="text-xs font-bold px-6 h-8 rounded-lg">Overview</TabsTrigger>
                        <TabsTrigger value="hourly" className="text-xs font-bold px-6 h-8 rounded-lg">Hourly</TabsTrigger>
                        <TabsTrigger value="funnel" className="text-xs font-bold px-6 h-8 rounded-lg">Funnel</TabsTrigger>
                        <TabsTrigger value="heatmap" className="text-xs font-bold px-6 h-8 rounded-lg">Heatmap</TabsTrigger>
                        <TabsTrigger value="users" className="text-xs font-bold px-6 h-8 rounded-lg">Viewers</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                                <CardHeader className="py-4 px-6 border-b border-border/50 bg-secondary/10">
                                    <CardTitle className="text-sm font-bold uppercase">Views & Completions</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[300px] p-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={adDetail?.analytics?.dailyData || []}>
                                            <defs>
                                                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 500 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 500 }} dx={-10} />
                                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px', fontSize: '11px' }} />
                                            <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#viewsGrad)" name="Views" />
                                            <Area type="monotone" dataKey="completions" stroke="hsl(var(--orange-600))" strokeWidth={2} fill="none" name="Completions" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                                <CardHeader className="py-4 px-6 border-b border-border/50 bg-secondary/10">
                                    <CardTitle className="text-sm font-bold uppercase">Daily Spending</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[300px] p-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={adDetail?.analytics?.dailyData || []}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 500 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 500 }} dx={-10} />
                                            <Tooltip cursor={{ fill: 'hsl(var(--primary))', opacity: 0.05 }} contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px', fontSize: '11px' }} />
                                            <Bar dataKey="spend" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={24} name="Spend (Br)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="hourly" className="animate-in fade-in slide-in-from-bottom-2">
                        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                            <CardHeader className="py-4 px-6 border-b border-border/50 bg-secondary/10">
                                <CardTitle className="text-sm font-bold uppercase">Hourly Performance (Last 24h)</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[350px] p-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={adDetail?.analytics?.hourlyData || []}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                                        <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 500 }} interval={1} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 500 }} />
                                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px', fontSize: '11px' }} />
                                        <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Views" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="funnel" className="animate-in fade-in slide-in-from-bottom-2">
                        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                            <CardHeader className="py-4 px-6 bg-secondary/10 border-b border-border/50">
                                <CardTitle className="text-sm font-bold uppercase text-center">Conversion Funnel</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <FunnelChart data={adDetail?.analytics?.funnelData || []} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="heatmap" className="animate-in fade-in slide-in-from-bottom-2 text-foreground">
                        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                            <CardHeader className="py-4 px-6 bg-secondary/10 border-b border-border/50">
                                <CardTitle className="text-sm font-bold uppercase">Engagement Heatmap</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="h-[400px]">
                                    <HeatmapChart data={adDetail?.analytics?.heatmapData || []} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="users" className="animate-in fade-in slide-in-from-bottom-2">
                        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                            <CardHeader className="py-4 px-6 border-b border-border/50 bg-secondary/10 flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-bold uppercase flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-primary" /> Viewer Logs
                                </CardTitle>
                                <Badge variant="secondary" className="font-bold text-[10px] px-3">
                                    {viewers.length} Unique Nodes
                                </Badge>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="max-h-[500px] overflow-y-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-secondary/10 border-none">
                                                <TableHead className="h-10 text-[10px] uppercase font-bold text-muted-foreground pl-6">Node (MSISDN)</TableHead>
                                                <TableHead className="h-10 text-[10px] uppercase font-bold text-muted-foreground">Status</TableHead>
                                                <TableHead className="h-10 text-[10px] uppercase font-bold text-muted-foreground">Timestamp</TableHead>
                                                <TableHead className="h-10 text-[10px] uppercase font-bold text-muted-foreground">Device</TableHead>
                                                <TableHead className="h-10 text-[10px] uppercase font-bold text-muted-foreground pr-6 text-right">Location</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {viewers.map((viewer, idx) => (
                                                <TableRow key={idx} className="hover:bg-secondary/10 border-b border-border/50">
                                                    <TableCell className="py-4 pl-6">
                                                        <Link href={`/admin/lookup/${viewer.msisdn}`} className="font-mono text-sm font-bold text-primary hover:underline">
                                                            {viewer.msisdn}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell className="py-4">{getViewerStatusBadge(viewer.status)}</TableCell>
                                                    <TableCell className="py-4">
                                                        <span className="text-xs font-medium text-foreground">
                                                            {viewer.started_at ? new Date(viewer.started_at).toLocaleString() : "—"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                                            {viewer.device_info ? `${viewer.device_info.brand} ${viewer.device_info.model}` : "Generic"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="py-4 pr-6 text-right">
                                                        <Badge variant="outline" className="text-[9px] font-bold border-border/50">
                                                            {viewer.location?.category || "Unknown"}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                    <DialogOverlay className="z-[999] bg-black/60 backdrop-blur-sm" />
                    <DialogContent className="max-w-[800px] w-full p-0 bg-transparent border-none z-[1000] overflow-hidden">
                        <DialogHeader className="sr-only">
                            <DialogTitle>Video Preview</DialogTitle>
                            <DialogDescription>Previewing the campaign video content</DialogDescription>
                        </DialogHeader>
                        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                            {videoSrc && (
                                <video controls className="w-full h-full object-contain" autoPlay>
                                    <source src={videoSrc} type="video/mp4" />
                                </video>
                            )}
                            <DialogClose className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-all">
                                <XCircle className="h-6 w-6" />
                            </DialogClose>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
