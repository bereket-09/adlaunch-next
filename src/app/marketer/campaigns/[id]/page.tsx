"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Eye,
    TrendingUp,
    Play,
    Pause,
    Target,
    Smartphone,
    Calendar,
    ExternalLink,
    Zap,
    ShieldCheck,
    XCircle,
    Info,
    Wallet,
    Clock,
    MonitorSmartphone,
    Search,
    History,
    FileText,
    Copy,
    CheckCircle2,
    Share2
} from "lucide-react";
import MarketerLayout from "@/components/MarketerLayout";
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
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart as RechartsBarChart,
    Bar,
} from "recharts";
import { analyticsAPI, Ad, AdUser } from "@/services/api";
import { API_ENDPOINTS } from "@/config/api";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogOverlay,
} from "@/components/ui/dialog";
import VideoThumbnail from "@/components/VideoThumbnail";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function MarketerCampaignDetailPage({ params }: PageProps) {
    const { id } = use(params);

    const [campaign, setCampaign] = useState<any>(null);
    const [adDetail, setAdDetail] = useState<any>(null);
    const [viewers, setViewers] = useState<AdUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewOpen, setPreviewOpen] = useState(false);

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

    const getStatusBadge = (status: string) => {
        const styles: any = {
            active: "bg-emerald-100 text-emerald-700 border-emerald-200",
            pending_approval: "bg-blue-100 text-blue-700 border-blue-200",
            paused: "bg-amber-100 text-amber-700 border-amber-200",
            rejected: "bg-red-100 text-red-700 border-red-200"
        };
        return <Badge variant="outline" className={`${styles[status] || "bg-slate-100"} border font-black uppercase text-[9px] tracking-widest px-2 shadow-sm`}>{status?.replace('_', ' ')}</Badge>;
    };

    const getViewerStatusBadge = (status: string) => {
        const styles: any = {
            completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
            started: "bg-amber-100 text-amber-700 border-amber-200",
            opened: "bg-sky-100 text-sky-700 border-sky-200",
        };
        return (
            <Badge variant="outline" className={`${styles[status] || "bg-slate-50"} border font-bold text-[9px] uppercase tracking-wider`}>
                {status}
            </Badge>
        );
    };

    if (loading) {
        return (
            <MarketerLayout title="Campaign Intelligence">
                <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-sm font-black tracking-widest text-muted-foreground uppercase animate-pulse">Synchronizing Data Nodes...</p>
                </div>
            </MarketerLayout>
        );
    }

    return (
        <MarketerLayout title="Campaign Intelligence">
            <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-700">
                {/* Header Section */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-background/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50">
                    <div className="flex items-center gap-5">
                        <Link href="/marketer/campaigns">
                            <Button variant="outline" size="icon" className="rounded-xl h-12 w-12 hover:bg-primary/5 transition-colors">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground">{campaign?.title}</h1>
                                {getStatusBadge(campaign?.status)}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{campaign?.campaign_name}</p>
                                <Separator orientation="vertical" className="h-3" />
                                <p className="text-[10px] font-mono text-primary font-bold">{id}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 overflow-x-auto pb-1 xl:pb-0">
                        <ExportButton filename={`my-campaign-${id}-intel`} />
                        <Button variant="outline" className="font-black rounded-xl h-11 px-6 uppercase text-[10px] tracking-widest shadow-sm hidden md:flex items-center gap-2">
                            <Share2 className="h-4 w-4" /> Share Analytics
                        </Button>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <KPICard title="Total Impressions" value={adDetail?.total_views || 0} icon={Eye} />
                    <KPICard title="Net Completions" value={adDetail?.completed_views || 0} icon={Target} />
                    <KPICard title="Engagement Efficiency" value={`${adDetail?.analytics?.reward_success_rate || 0}%`} icon={Zap} />
                    <KPICard title="Avg. Attention span" value={adDetail?.analytics?.avg_watch_time || "0s"} icon={Clock} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Creative Analysis Card */}
                    <Card className="lg:col-span-8 overflow-hidden border-border/50 shadow-xl bg-background/40 backdrop-blur-md rounded-3xl group">
                        <div className="flex flex-col md:flex-row h-full">
                            <div className="md:w-[40%] relative bg-black aspect-video md:aspect-auto flex items-center overflow-hidden">
                                <VideoThumbnail videoSrc={API_ENDPOINTS.AD.VIDEO(campaign?._id || "")} />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px]">
                                    <Button onClick={() => setPreviewOpen(true)} size="icon" variant="secondary" className="rounded-full h-16 w-16 shadow-2xl hover:scale-110 transition-transform bg-white/90 text-primary border-none">
                                        <Play className="h-8 w-8 fill-current translate-x-1" />
                                    </Button>
                                </div>
                                <div className="absolute top-4 left-4">
                                    <Badge className="bg-black/60 backdrop-blur-md text-white border-white/10 text-[9px] font-black tracking-widest">LIVE_HLS</Badge>
                                </div>
                            </div>
                            <div className="p-8 flex-1 flex flex-col justify-between space-y-8">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <FileText className="h-4 w-4 text-primary" />
                                        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Campaign Creative</h3>
                                    </div>
                                    <p className="text-sm md:text-base leading-relaxed text-foreground/80 font-medium italic">
                                        "{campaign?.description || "No specific creative brief provided."}"
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-border/50">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Call to Action (CTA)</p>
                                        <Link href={campaign?.cta_link || "#"} target="_blank" className="text-xs font-bold text-primary flex items-center gap-1.5 hover:underline group/cta">
                                            {campaign?.cta_text || "Visit Landing Page"} <ExternalLink className="h-3 w-3 group-hover/cta:translate-x-0.5 transition-transform" />
                                        </Link>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">CPV Rate</p>
                                        <p className="text-xs font-black font-mono text-foreground">{campaign?.cost_per_view} Br</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">CPC Rate</p>
                                        <p className="text-xs font-black font-mono text-foreground">{campaign?.cost_per_click} Br</p>
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Active Flight Path</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                            <p className="text-[10px] font-bold text-foreground">
                                                {campaign ? new Date(campaign.start_date).toLocaleDateString() : "-"} → {campaign ? new Date(campaign.end_date).toLocaleDateString() : "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Spend Efficiency Card */}
                    <Card className="lg:col-span-4 border-border/50 shadow-xl bg-background/40 backdrop-blur-md rounded-3xl flex flex-col">
                        <CardHeader className="pb-4 border-b border-border/50 bg-secondary/5">
                            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-primary">
                                <Wallet className="h-4 w-4" /> Spend Execution
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 flex-1 flex flex-col justify-between space-y-8">
                            <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Remaining Budget</p>
                                        <p className="text-3xl font-black text-primary tracking-tighter">{adDetail?.budget?.remaining_budget?.toLocaleString()} <span className="text-xs font-bold text-muted-foreground tracking-normal italic ml-0.5">Br.</span></p>
                                    </div>
                                    <div className="text-right">
                                        <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] px-2">{adDetail?.budget?.usage_percent?.toFixed(1)}%</Badge>
                                    </div>
                                </div>
                                
                                <div className="h-2.5 bg-secondary/50 rounded-full overflow-hidden p-0.5 border border-border/50 shadow-inner">
                                    <div className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(var(--primary),0.5)]" style={{ width: `${adDetail?.budget?.usage_percent || 0}%` }} />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-secondary/10 p-4 rounded-2xl border border-border/50 text-center">
                                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Spent to Date</p>
                                        <p className="text-sm font-black text-foreground">{adDetail?.budget?.spent?.toLocaleString()} Br.</p>
                                    </div>
                                    <div className="bg-secondary/10 p-4 rounded-2xl border border-border/50 text-center">
                                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Allocated</p>
                                        <p className="text-sm font-black text-foreground">{adDetail?.budget?.budget_allocation?.toLocaleString()} Br.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">KYC Status</span>
                                </div>
                                <Badge className={`text-[8px] font-black tracking-widest px-2 ${adDetail?.marketerInfo?.kyc_status === 'verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                    {adDetail?.marketerInfo?.kyc_status?.toUpperCase() || "UNVERIFIED"}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="hourly" className="w-full space-y-6">
                    <TabsList className="bg-secondary/30 p-1 rounded-2xl border border-border/50 h-12 flex items-center gap-1 max-w-2xl mx-auto md:mx-0">
                        <TabsTrigger value="hourly" className="flex-1 rounded-xl font-black text-[10px] uppercase tracking-widest h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm">Daily Momentum</TabsTrigger>
                        <TabsTrigger value="funnel" className="flex-1 rounded-xl font-black text-[10px] uppercase tracking-widest h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm">Conversion Funnel</TabsTrigger>
                        <TabsTrigger value="dropoff" className="flex-1 rounded-xl font-black text-[10px] uppercase tracking-widest h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm">Retention IQ</TabsTrigger>
                        <TabsTrigger value="viewers" className="flex-1 rounded-xl font-black text-[10px] uppercase tracking-widest h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm">Interaction Logs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="hourly" className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                        <Card className="p-8 border-border/50 shadow-xl bg-background/50 rounded-3xl overflow-hidden relative">
                            <CardTitle className="text-xs font-black mb-10 uppercase tracking-[0.25em] text-muted-foreground flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-primary" /> Impression velocity (24H Traffic)
                            </CardTitle>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={adDetail?.analytics?.hourlyData || []}>
                                        <defs>
                                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25}/>
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} stroke="hsl(var(--muted-foreground))" />
                                        <XAxis dataKey="hour" fontSize={10} axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold'}} />
                                        <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold'}} />
                                        <Tooltip 
                                            contentStyle={{backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f0f0f0'}} 
                                            labelStyle={{fontWeight: 'black', textTransform: 'uppercase', fontSize: '10px'}}
                                        />
                                        <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorViews)" strokeWidth={4} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="dropoff" className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                        <Card className="p-8 border-border/50 shadow-xl bg-background/50 rounded-3xl overflow-hidden">
                             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                                <CardTitle className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground flex items-center gap-2">
                                    <MonitorSmartphone className="h-4 w-4 text-primary" /> Audience Retention Analytics
                                </CardTitle>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-80 italic">Drop-off mapping at 5s playback offsets</p>
                            </div>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsBarChart data={adDetail?.analytics?.dropOffData || []}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                        <XAxis dataKey="label" fontSize={10} axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold'}} />
                                        <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold'}} />
                                        <Tooltip cursor={{fill: 'hsla(var(--primary), 0.05)'}} />
                                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Retention Count" />
                                    </RechartsBarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="funnel" className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                        <Card className="p-12 lg:p-20 flex flex-col items-center justify-center bg-background/40 border-border/50 shadow-xl rounded-3xl">
                             <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.4em] mb-12 border-b-2 border-primary/20 pb-2 text-center">Engagement conversion Lifecycle</h3>
                            <div className="w-full max-w-4xl">
                                <FunnelChart data={adDetail?.analytics?.funnelData || []} />
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="viewers" className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                        <Card className="overflow-hidden border-border/50 shadow-xl rounded-3xl bg-background/40">
                             <Table>
                                <TableHeader className="bg-secondary/20 border-b border-border/50">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest pl-8 py-4">Interaction Node</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest">Global Status</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest">Handset Profile</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest px-8 text-right">Interaction Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {viewers.length > 0 ? viewers.slice(0, 50).map((user, i) => (
                                        <TableRow key={i} className="hover:bg-primary/5 transition-colors border-b border-border/30">
                                            <TableCell className="pl-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                                        <Search className="w-3.5 h-3.5 text-muted-foreground" />
                                                    </div>
                                                    <span className="font-mono font-bold text-sm text-primary tracking-tight">
                                                        {user.msisdn.replace(/(\d{4})\d{4}(\d{2})/, "$1****$2")}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getViewerStatusBadge(user.status)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Smartphone className="w-3.5 h-3.5 text-muted-foreground" />
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                                                        {user.device_info?.brand || "Generic"} {user.device_info?.model || "Handset"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-8 text-right">
                                                <div className="inline-flex flex-col items-end">
                                                    <span className="text-[11px] font-bold text-foreground">
                                                        {user.started_at ? new Date(user.started_at).toLocaleDateString() : "—"}
                                                    </span>
                                                    <span className="text-[9px] font-black text-muted-foreground/60 tracking-widest">
                                                        {user.started_at ? new Date(user.started_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "—"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-40 text-center text-muted-foreground uppercase text-[10px] font-black tracking-widest opacity-40">
                                                No interaction nodes found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Card>
                    </TabsContent>
                </Tabs>

                <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                    <DialogContent className="max-w-5xl p-0 bg-black border-none overflow-hidden rounded-3xl shadow-2xl">
                         <div className="relative">
                            <video controls autoPlay className="w-full aspect-video ring-1 ring-white/10">
                                <source src={API_ENDPOINTS.AD.VIDEO(campaign?._id || "")} />
                                <source src={campaign?.video_file_path} />
                            </video>
                         </div>
                        <div className="p-8 bg-background border-t border-border/50 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black tracking-tight">{campaign?.title}</h3>
                                <p className="text-xs text-muted-foreground font-bold uppercase mt-1">Creative Preview (HLS Pipeline)</p>
                            </div>
                            <Button variant="outline" className="rounded-xl font-black text-[10px] tracking-widest" onClick={() => setPreviewOpen(false)}>
                                <XCircle className="mr-2 h-4 w-4" /> Terminate Preview
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </MarketerLayout>
    );
}

