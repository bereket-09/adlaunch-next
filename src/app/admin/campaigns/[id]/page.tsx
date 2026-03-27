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
    Smartphone,
    Calendar,
    ExternalLink,
    Zap,
    ShieldCheck,
    XCircle,
    MousePointer2,
    Info,
    Wallet,
    BarChart,
    ChevronRight,
    Search,
    History,
    CheckCircle2,
    AlertCircle,
    Copy,
    Share2,
    ArrowUpRight,
    MapPin,
    MonitorSmartphone,
    Clock,
    User
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
    BarChart as RechartsBarChart,
    Bar,
    Cell
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

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function AdminCampaignDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const { toast } = useToast();

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
            toast({ title: "Error", description: "Failed to load live data.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: any) => {
        if (!date) return "-";
        const d = new Date(date);
        return isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
    };

    const handleToggleStatus = async () => {
        if (!campaign) return;
        const newStatus = campaign.status === "active" ? "paused" : "active";
        try {
            await adAPI.update(campaign._id, { status: newStatus });
            toast({ title: `Campaign ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}` });
            fetchCampaignData();
        } catch (error) {
            toast({ title: "Error", variant: "destructive" });
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

    if (loading) return (
        <AdminLayout title="System Intelligence">
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-sm font-bold tracking-widest text-muted-foreground uppercase animate-pulse">Analyzing Campaign Nodes...</p>
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout title="Campaign Analytics">
            <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-700">
                {/* Header Section */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-background/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50">
                    <div className="flex items-center gap-5">
                        <Link href="/admin/campaigns">
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
                        <ExportButton filename={`campaign-${id}-intel`} />
                        <Button 
                            onClick={handleToggleStatus} 
                            variant={campaign?.status === "active" ? "outline" : "default"} 
                            className={`font-black rounded-xl h-11 px-6 uppercase text-[10px] tracking-widest shadow-lg transition-all active:scale-95 ${campaign?.status === "active" ? 'border-amber-200 text-amber-700 hover:bg-amber-50' : ''}`}
                        >
                            {campaign?.status === "active" ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                            {campaign?.status === "active" ? "Pause Campaign" : (campaign?.status === "pending_approval" ? "Approve & Start" : "Resume Campaign")}
                        </Button>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <KPICard title="Total Views" value={adDetail?.total_views || 0} icon={Eye} />
                    <KPICard title="Completions" value={adDetail?.completed_views || 0} icon={Target} />
                    <KPICard title="Reward Success" value={`${adDetail?.analytics?.reward_success_rate || 0}%`} icon={Zap} />
                    <KPICard title="Avg. Watch Time" value={adDetail?.analytics?.avg_watch_time || "0s"} icon={Clock} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Detailed Info Card */}
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
                                    <Badge className="bg-black/60 backdrop-blur-md text-white border-white/10 text-[9px] font-black tracking-widest">PREVIEW_HLS</Badge>
                                </div>
                            </div>
                            <div className="p-8 flex-1 flex flex-col justify-between space-y-8">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Info className="h-4 w-4 text-primary" />
                                        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Creative Intelligence</h3>
                                    </div>
                                    <p className="text-sm md:text-base leading-relaxed text-foreground/80 font-medium">
                                        {campaign?.description || "No description provided for this creative asset."}
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-border/50">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Interaction Action</p>
                                        <Link href={campaign?.cta_link || "#"} target="_blank" className="text-xs font-bold text-primary flex items-center gap-1.5 hover:underline group/cta">
                                            {campaign?.cta_text || "Visit Website"} <ExternalLink className="h-3 w-3 group-hover/cta:translate-x-0.5 transition-transform" />
                                        </Link>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Billing Logic</p>
                                        <Badge variant="secondary" className="font-mono text-[9px] font-black uppercase tracking-wider">{campaign?.billing_model?.replace(/_/g, ' ')}</Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Cost Units</p>
                                        <p className="text-xs font-black font-mono text-foreground">{campaign?.cost_per_view} Br <span className="text-muted-foreground">/</span> {campaign?.cost_per_click} Br</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Priority Tier</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-black">{campaign?.rate_tier?.toUpperCase()}</p>
                                            <Badge className="h-4 px-1.5 text-[8px] bg-primary/10 text-primary border-none">Lv.{campaign?.priority}</Badge>
                                        </div>
                                    </div>
                                     <div className="space-y-1 col-span-2 md:col-span-1">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Active Lifecycle</p>
                                        <p className="text-[10px] font-bold text-foreground">
                                            {formatDate(campaign?.start_date)} → {formatDate(campaign?.end_date)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Marketer & Budget Card */}
                    <Card className="lg:col-span-4 border-border/50 shadow-xl bg-background/40 backdrop-blur-md rounded-3xl flex flex-col">
                        <CardHeader className="pb-4 border-b border-border/50 bg-secondary/5">
                            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-primary">
                                <Wallet className="h-4 w-4" /> Financial Execution
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 flex-1 flex flex-col justify-between space-y-8">
                            <div className="p-5 rounded-2xl bg-secondary/20 border border-border/50 group hover:border-primary/30 transition-colors">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Marketer Profile</p>
                                        <p className="font-bold text-sm tracking-tight">{adDetail?.marketerInfo?.name}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground font-medium">{adDetail?.marketerInfo?.email}</p>
                                    <Badge variant="outline" className={`text-[8px] font-black tracking-[0.2em] px-2 border-none shadow-sm ${adDetail?.marketerInfo?.kyc_status === 'verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                        KYC: {adDetail?.marketerInfo?.kyc_status?.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Balance Exhaustion</p>
                                        <p className="text-3xl font-black text-primary tracking-tighter">{adDetail?.budget?.remaining_budget?.toLocaleString()} <span className="text-xs font-bold text-muted-foreground tracking-normal italic ml-0.5">Br. Left</span></p>
                                    </div>
                                    <div className="text-right">
                                        <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] px-2">{adDetail?.budget?.usage_percent?.toFixed(1)}%</Badge>
                                    </div>
                                </div>
                                
                                <div className="h-2.5 bg-secondary/50 rounded-full overflow-hidden p-0.5 border border-border/50 shadow-inner">
                                    <div className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(var(--primary),0.5)]" style={{ width: `${adDetail?.budget?.usage_percent || 0}%` }} />
                                </div>
                                
                                <div className="flex justify-between items-center bg-secondary/10 p-3 rounded-xl border border-border/50">
                                    <div className="text-center flex-1 border-r border-border/50">
                                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Spent</p>
                                        <p className="text-sm font-black text-foreground">{adDetail?.budget?.spent?.toLocaleString()} Br.</p>
                                    </div>
                                    <div className="text-center flex-1">
                                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Allocated</p>
                                        <p className="text-sm font-black text-foreground">{adDetail?.budget?.budget_allocation?.toLocaleString()} Br.</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="hourly" className="w-full space-y-6">
                    <TabsList className="bg-secondary/30 p-1 rounded-2xl border border-border/50 h-12 flex items-center gap-1 max-w-2xl mx-auto md:mx-0">
                        <TabsTrigger value="hourly" className="flex-1 rounded-xl font-black text-[10px] uppercase tracking-widest h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm">Hourly Reach</TabsTrigger>
                        <TabsTrigger value="funnel" className="flex-1 rounded-xl font-black text-[10px] uppercase tracking-widest h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm">Funnel Logic</TabsTrigger>
                        <TabsTrigger value="dropoff" className="flex-1 rounded-xl font-black text-[10px] uppercase tracking-widest h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm">Video Heatmap</TabsTrigger>
                        <TabsTrigger value="viewers" className="flex-1 rounded-xl font-black text-[10px] uppercase tracking-widest h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm">Viewer Logs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="hourly" className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                        <Card className="p-8 border-border/50 shadow-xl bg-background/50 rounded-3xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 flex items-center gap-2 opacity-50">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Real-Time</span>
                            </div>
                            <CardTitle className="text-xs font-black mb-10 uppercase tracking-[0.25em] text-muted-foreground flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-primary" /> Impression Velocity (24H)
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
                                    <MonitorSmartphone className="h-4 w-4 text-primary" /> Retention Intelligence
                                </CardTitle>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-80">Duration Analysis: 5s Intervals</p>
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
                            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.4em] mb-12 border-b-2 border-primary/20 pb-2">User Conversion Lifecycle</h3>
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
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest pl-8 py-4">Node Hash (MSISDN)</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest">Global Status</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest">Handset Profile</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest px-8 text-right">Timestamp</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {viewers.length > 0 ? viewers.map((user, i) => (
                                        <TableRow key={i} className="hover:bg-primary/5 transition-colors border-b border-border/30">
                                            <TableCell className="pl-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                                        <Search className="w-3.5 h-3.5 text-muted-foreground" />
                                                    </div>
                                                    <span className="font-mono font-bold text-sm text-primary tracking-tight">{user.msisdn}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getViewerStatusBadge(user.status)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Smartphone className="w-3.5 h-3.5 text-muted-foreground" />
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                                                        {user.device_info?.brand || "Generic"} {user.device_info?.model || "Device"}
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
                                            <TableCell colSpan={4} className="h-40 text-center">
                                                <div className="flex flex-col items-center gap-2 opacity-40">
                                                    <History className="h-10 w-10 text-muted-foreground" />
                                                    <p className="font-black uppercase text-[10px] tracking-[0.4em]">No Live Nodes Recorded</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Card>
                    </TabsContent>
                </Tabs>

                <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                    <DialogContent className="max-w-5xl p-0 bg-black border-none overflow-hidden rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                         <div className="relative group">
                            <video controls autoPlay className="w-full aspect-video ring-1 ring-white/10">
                                <source src={API_ENDPOINTS.AD.VIDEO(campaign?._id || "")} />
                                <source src={campaign?.video_file_path} />
                            </video>
                             <div className="absolute top-4 right-4 z-10">
                                 <DialogClose className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all">
                                    <XCircle className="h-6 w-6" />
                                 </DialogClose>
                             </div>
                         </div>
                        <div className="p-8 bg-background border-t border-border/50">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-black tracking-tight">{campaign?.title}</h3>
                                {getStatusBadge(campaign?.status)}
                            </div>
                            <div className="flex items-center gap-6 mt-4">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Direct Engagement Link</span>
                                    <Link href={campaign?.cta_link || "#"} target="_blank" className="text-sm font-bold text-primary flex items-center gap-2 mt-1 hover:underline">
                                        {campaign?.cta_text || "Visit Official Store"} <ExternalLink className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                                <Separator orientation="vertical" className="h-8" />
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Creative ID</span>
                                    <span className="text-sm font-mono font-bold mt-1">{id}</span>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
