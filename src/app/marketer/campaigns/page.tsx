"use client";

import { useState, useEffect } from "react";
import {
    MoreHorizontal,
    Eye,
    Upload,
    ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import MarketerLayout from "@/components/MarketerLayout";

export default function MarketerCampaignsPage() {
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
            let marketerId = localStorage.getItem("marketer_id");
            if (!marketerId) return;

            setLoading(true);
            const data = await adAPI.listByMarketer(marketerId);
            if (data.status) {
                setCampaigns(data.ads);
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
                    c.marketer_id?.name?.toLowerCase().includes(query)
            );
        }

        if (filters.status && filters.status !== "all") {
            data = data.filter((c) => c.status === filters.status);
        }

        if (filters.marketer && filters.marketer !== "all") {
            data = data.filter((c) => c.marketer_id?._id === filters.marketer);
        }

        if (filters.dateRange) {
            const { from, to } = filters.dateRange;
            if (from) data = data.filter((c) => new Date(c.start_date) >= from);
            if (to) data = data.filter((c) => new Date(c.end_date) <= to);
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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <span className="bg-green-100/50 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Active</span>;
            case "paused":
                return <span className="bg-yellow-100/50 text-yellow-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Paused</span>;
            case "pending_approval":
                return <span className="bg-blue-100/50 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Pending</span>;
            case "draft":
                return <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Draft</span>;
            default:
                return <span className="bg-orange-100/50 text-orange-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">{status}</span>;
        }
    };

    const totalSpent = campaigns.reduce(
        (sum, c) => sum + (c.budget_allocation - c.remaining_budget),
        0
    );

    return (
        <MarketerLayout title="Campaigns">
            <div className="page-container">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Campaign Inventory</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">Monitor and manage all your ad campaigns</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <RealTimeIndicator />
                        <Link href="/marketer/upload">
                            <Button size="sm" className="h-9 px-4 rounded-xl font-bold gap-2 text-xs text-white"
                                    style={{ background: 'linear-gradient(135deg, hsl(24,100%,50%), hsl(34,100%,55%))' }}>
                                <Upload className="h-4 w-4" /> New Campaign
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex-1 min-w-[260px]">
                        <CampaignFilters
                            campaigns={campaigns}
                            marketers={campaigns
                                .map((c) => c.marketer_id)
                                .filter((v, i, a) => a.findIndex((x) => x?._id === v?._id) === i)}
                            config={{ campaign: true, marketer: true, status: true, dateRange: true }}
                            onFiltersChange={setFilters}
                        />
                    </div>
                </div>

                <Card className="card-elevated border-0 rounded-2xl overflow-hidden mb-6">
                    <CardHeader className="border-b border-border/40 py-4 px-6">
                        <CardTitle className="text-base font-bold">All Campaigns</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-secondary/40 border-none">
                                        <TableHead className="py-3 pl-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Campaign</TableHead>
                                        <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Status</TableHead>
                                        <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Dates</TableHead>
                                        <TableHead className="py-3 text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Rate (Br.)</TableHead>
                                        <TableHead className="py-3 text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Budget</TableHead>
                                        <TableHead className="py-3 text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Spent</TableHead>
                                        <TableHead className="py-3 pr-6 text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-12">
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                                    <span className="text-sm">Loading campaigns...</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredCampaigns.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-16">
                                                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                                    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                                                        <Eye className="h-6 w-6 opacity-30" />
                                                    </div>
                                                    <p className="font-medium text-sm">No campaigns found</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredCampaigns.map((campaign) => (
                                        <TableRow
                                            key={campaign._id}
                                            className="cursor-pointer hover:bg-primary/[0.02] border-b border-border/40 group transition-colors"
                                            onClick={() => router.push(`/marketer/campaigns/${campaign._id}`)}
                                        >
                                            <TableCell className="py-4 pl-6">
                                                <div>
                                                    <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{campaign.title}</p>
                                                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">{campaign.campaign_name}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">{getStatusBadge(campaign.status)}</TableCell>
                                            <TableCell className="py-4">
                                                <div className="text-xs text-muted-foreground">
                                                    <p>{new Date(campaign.start_date).toLocaleDateString()}</p>
                                                    <p className="opacity-60">→ {new Date(campaign.end_date).toLocaleDateString()}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 text-right font-mono font-bold text-xs">
                                                {campaign.cost_per_view?.toFixed(3)}
                                            </TableCell>
                                            <TableCell className="py-4 text-right font-mono font-bold text-xs whitespace-nowrap">
                                                {campaign.budget_allocation?.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="py-4 text-right font-mono font-bold text-xs text-red-500 whitespace-nowrap">
                                                {(campaign.budget_allocation - campaign.remaining_budget)?.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="py-4 pr-6 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-2xl border-border/60 shadow-xl p-1.5 focus:outline-none">
                                                        <DropdownMenuItem
                                                            className="rounded-xl text-xs font-semibold"
                                                            onClick={(e) => { e.stopPropagation(); router.push(`/marketer/campaigns/${campaign._id}`); }}
                                                        >
                                                            <Eye className="h-3.5 w-3.5 mr-2 text-muted-foreground" /> View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="rounded-xl text-xs font-semibold" onClick={(e) => e.stopPropagation()}>
                                                            <ExternalLink className="h-3.5 w-3.5 mr-2 text-muted-foreground" /> Preview
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: 'Total Campaigns', value: campaigns.length, color: 'text-foreground', bg: 'bg-primary/10', emoji: '📋' },
                        { label: 'Active Campaigns', value: campaigns.filter(c => c.status === 'active').length, color: 'text-green-600', bg: 'bg-green-50', emoji: '✅' },
                        { label: 'Total Spent', value: `${totalSpent.toLocaleString()} Br.`, color: 'text-primary', bg: 'bg-orange-50', emoji: '💰' },
                    ].map((s) => (
                        <div key={s.label} className="card-elevated flex items-center gap-4 p-5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${s.bg}`}>{s.emoji}</div>
                            <div>
                                <p className={`text-2xl font-black tracking-tight ${s.color}`}>{s.value}</p>
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MarketerLayout>
    );
}
