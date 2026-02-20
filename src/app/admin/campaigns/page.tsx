"use client";

import { useState, useEffect } from "react";
import {
    Upload,
    MoreHorizontal,
    Eye,
    Play,
    Pause,
    ExternalLink,
    XCircle,
    CheckCircle,
    BarChart3,
    Clock,
    Target,
    Zap,
    TrendingUp,
    Filter,
    ChevronRight,
    Search,
    Calendar,
    ArrowUpRight,
    Activity,
    Layers,
    MousePointer2,
    ShieldCheck
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adAPI, Ad } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import CampaignFilters from "@/components/analytics/CampaignFilters";
import RealTimeIndicator from "@/components/analytics/RealTimeIndicator";
import KPICard from "@/components/analytics/KPICard";

export default function AdminCampaignsPage() {
    const [campaigns, setCampaigns] = useState<Ad[]>([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [sortBy, setSortBy] = useState("created_desc");

    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        fetchCampaigns();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [campaigns, filters, sortBy]);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const response = await adAPI.list();
            if (response.status) {
                setCampaigns(response.ads);
            }
        } catch (error) {
            console.error("Error fetching campaigns:", error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let data = [...campaigns];

        if (filters.search) {
            const query = filters.search.toLowerCase();
            data = data.filter(
                (c) =>
                    c.title?.toLowerCase().includes(query) ||
                    c.campaign_name?.toLowerCase().includes(query) ||
                    (c.marketer_id as any)?.name?.toLowerCase().includes(query)
            );
        }

        if (filters.status && filters.status !== "all") {
            data = data.filter((c) => c.status === filters.status);
        }

        if (filters.marketer && filters.marketer !== "all") {
            data = data.filter((c) => (c.marketer_id as any)?._id === filters.marketer);
        }

        if (filters.dateRange) {
            const { from, to } = filters.dateRange;
            if (from) data = data.filter((c) => new Date(c.start_date) >= new Date(from));
            if (to) data = data.filter((c) => new Date(c.end_date) <= new Date(to));
        }

        data.sort((a, b) => {
            if (sortBy === "created_desc")
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            if (sortBy === "created_asc")
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            if (sortBy === "budget_desc")
                return b.budget_allocation - a.budget_allocation;
            if (sortBy === "budget_asc")
                return a.budget_allocation - b.budget_allocation;
            return 0;
        });

        setFilteredCampaigns(data);
    };

    const handleToggleStatus = async (campaign: Ad) => {
        const newStatus = campaign.status === "active" ? "paused" : "active";
        try {
            await adAPI.update(campaign._id, { status: newStatus });
            toast({
                title: newStatus === "active" ? "Campaign Activated" : "Campaign Paused",
                description: `Campaign status changed to ${newStatus}.`
            });
            fetchCampaigns();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update campaign status.",
                variant: "destructive",
            });
        }
    };

    const handleApprove = async (adId: string) => {
        try {
            const response = await adAPI.approve(adId);
            if (response.status) {
                toast({
                    title: "Campaign Approved",
                    description: "The campaign is now live.",
                });
                fetchCampaigns();
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to approve campaign.",
                variant: "destructive",
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active": return <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-bold">ACTIVE</Badge>;
            case "paused": return <Badge className="bg-rose-500/10 text-rose-600 border-none font-bold">PAUSED</Badge>;
            case "pending_approval": return <Badge className="bg-amber-500/10 text-amber-600 border-none font-bold">PENDING</Badge>;
            case "draft": return <Badge variant="secondary" className="bg-slate-500/10 text-slate-500 border-none font-bold">DRAFT</Badge>;
            default: return <Badge variant="secondary" className="font-bold">{status?.toUpperCase() || ""}</Badge>;
        }
    };

    const totalSpent = campaigns.reduce(
        (sum, c) => sum + (c.budget_allocation - (c.remaining_budget || 0)),
        0
    );

    const pendingCount = campaigns.filter((ad) => ad.status === "pending_approval").length;

    return (
        <AdminLayout title="Campaigns">
            <div className="space-y-6 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            Ad Campaigns
                            <Badge className="bg-primary/10 text-primary border-none font-bold py-0.5 px-2 text-[10px]">
                                LIVE
                            </Badge>
                        </h1>
                        <p className="text-muted-foreground text-sm">Monitor and manage all active advertiser campaigns and budgets.</p>
                    </div>
                    <Link href="/admin/upload">
                        <Button className="h-10 px-6 rounded-xl font-bold gap-2">
                            <Upload className="h-4 w-4" /> Create Campaign
                        </Button>
                    </Link>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard title="Total Campaigns" value={campaigns.length} icon={Layers} trend="up" change={4} />
                    <KPICard title="Active" value={campaigns.filter((c) => c.status === "active").length} icon={Zap} trend="up" change={2} />
                    <KPICard title="Total Spend" value={`${totalSpent.toLocaleString()} Br.`} icon={TrendingUp} trend="up" change={8} />
                    <KPICard title="Pending Review" value={pendingCount} icon={Clock} trend={pendingCount > 0 ? "down" : "neutral"} />
                </div>

                <div className="space-y-6">
                    {/* Filters */}
                    <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex-1 w-full max-w-4xl">
                            <CampaignFilters
                                campaigns={campaigns}
                                marketers={campaigns
                                    .map((c) => c.marketer_id as any)
                                    .filter((v, i, a) => a.findIndex((x) => x?._id === v?._id) === i)}
                                config={{ campaign: true, marketer: true, status: true, dateRange: true }}
                                onFiltersChange={setFilters}
                            />
                        </div>
                        <Button variant="outline" size="sm" className="h-9 rounded-xl px-4 font-bold text-xs gap-2">
                            <Filter className="h-3.5 w-3.5" /> Apply Filters
                        </Button>
                    </Card>

                    {/* Pending Approvals Queue */}
                    {pendingCount > 0 && (
                        <Card className="border-amber-200 bg-amber-50/50 backdrop-blur-sm rounded-2xl border shadow-sm overflow-hidden">
                            <CardHeader className="bg-amber-100/50 border-b border-amber-200 py-3 px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-amber-600" />
                                        <CardTitle className="text-base font-bold text-amber-900">Awaiting Approval ({pendingCount})</CardTitle>
                                    </div>
                                    <Badge className="bg-amber-500/10 text-amber-700 border-none text-[10px] font-bold">ACTION REQUIRED</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-amber-100">
                                    {campaigns.filter((ad) => ad.status === "pending_approval").map((ad) => (
                                        <div key={ad._id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white/40 hover:bg-amber-100/20 transition-colors gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-amber-500 border border-amber-200">
                                                    <MousePointer2 className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 text-sm leading-tight">{ad.title}</p>
                                                    <p className="text-[11px] font-bold text-amber-700/70 mt-0.5">
                                                        Marketer: {(ad.marketer_id as any)?.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 w-full sm:w-auto">
                                                <Button variant="ghost" size="sm" className="h-9 rounded-xl font-bold text-xs text-rose-600 hover:bg-rose-50 px-4">
                                                    Reject
                                                </Button>
                                                <Button size="sm" onClick={() => handleApprove(ad._id)} className="h-9 rounded-xl px-4 font-bold text-xs gap-2">
                                                    Approve <ChevronRight className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Campaigns Table */}
                    <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                        <CardHeader className="border-b border-border/50 bg-secondary/10 py-4 px-6 flex flex-row items-center justify-between">
                            <div className="space-y-0.5">
                                <CardTitle className="text-lg font-bold">All Campaigns</CardTitle>
                                <CardDescription className="text-xs">Summary of platform delivery and budget utilization.</CardDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                <RealTimeIndicator label="Sync: OK" />
                                <Badge variant="outline" className="font-mono text-xs px-3 py-1 bg-background border-border/50">
                                    {filteredCampaigns.length} TOTAL
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-secondary/5 border-none">
                                            <TableHead className="py-3 pl-6 uppercase text-[10px] font-bold text-muted-foreground">Campaign Details</TableHead>
                                            <TableHead className="py-3 uppercase text-[10px] font-bold text-muted-foreground">Marketer</TableHead>
                                            <TableHead className="py-3 text-center uppercase text-[10px] font-bold text-muted-foreground">Status</TableHead>
                                            <TableHead className="py-3 text-right uppercase text-[10px] font-bold text-muted-foreground border-l border-border/10 px-6">Budget</TableHead>
                                            <TableHead className="py-3 text-right uppercase text-[10px] font-bold text-muted-foreground pr-6">Remaining</TableHead>
                                            <TableHead className="py-3 pr-6 text-right uppercase text-[10px] font-bold text-muted-foreground">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow><TableCell colSpan={6} className="text-center py-20 animate-pulse text-muted-foreground text-sm font-medium">Fetching campaigns...</TableCell></TableRow>
                                        ) : filteredCampaigns.length === 0 ? (
                                            <TableRow><TableCell colSpan={6} className="text-center py-20 text-muted-foreground text-sm italic">No campaigns found matching the filters.</TableCell></TableRow>
                                        ) : (
                                            filteredCampaigns.map((campaign) => (
                                                <TableRow
                                                    key={campaign._id}
                                                    className="cursor-pointer hover:bg-secondary/10 transition-colors border-b border-border/50 group"
                                                    onClick={() => router.push(`/admin/campaigns/${campaign._id}`)}
                                                >
                                                    <TableCell className="py-4 pl-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
                                                                <BarChart3 className="h-4.5 w-4.5" />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-foreground text-sm leading-tight">{campaign.title}</p>
                                                                <p className="text-[10px] text-muted-foreground font-medium mt-0.5 flex items-center gap-1">
                                                                    <Activity className="h-2.5 w-2.5" /> {campaign.campaign_name}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 text-xs font-bold text-slate-600">{(campaign.marketer_id as any)?.name}</TableCell>
                                                    <TableCell className="py-4 text-center">{getStatusBadge(campaign.status)}</TableCell>
                                                    <TableCell className="py-4 text-right font-mono text-xs text-muted-foreground border-l border-border/10 px-6">
                                                        {campaign.budget_allocation?.toLocaleString()} <span className="opacity-60">Br.</span>
                                                    </TableCell>
                                                    <TableCell className="py-4 text-right font-mono font-bold text-primary text-sm pr-6">
                                                        {campaign.remaining_budget?.toLocaleString()} <span className="text-[10px] opacity-70">Br.</span>
                                                    </TableCell>
                                                    <TableCell className="py-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl bg-background/95 backdrop-blur-md border border-border/50 shadow-xl">
                                                                <DropdownMenuItem className="rounded-lg py-2 cursor-pointer text-sm font-semibold" onClick={() => router.push(`/admin/campaigns/${campaign._id}`)}>
                                                                    <Eye className="h-4 w-4 mr-2" /> View Analytics
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="rounded-lg py-2 cursor-pointer font-bold text-sm" onClick={() => handleToggleStatus(campaign)}>
                                                                    {campaign.status === "active" ? (
                                                                        <span className="flex items-center text-rose-600"><Pause className="h-4 w-4 mr-2" /> Pause Campaign</span>
                                                                    ) : (
                                                                        <span className="flex items-center text-emerald-600"><Play className="h-4 w-4 mr-2" /> Resume Campaign</span>
                                                                    )}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="rounded-lg py-2 cursor-pointer text-sm font-semibold text-slate-500" onClick={() => { }}>
                                                                    <ExternalLink className="h-4 w-4 mr-2" /> Open External Link
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
