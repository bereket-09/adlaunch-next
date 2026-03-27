"use client";

import { useEffect, useState } from "react";
import { 
    History, Search, Filter, ShieldAlert, 
    Smartphone, Calendar, User, Eye,
    ExternalLink, MapPin, Laptop, Smartphone as Phone,
    Download, RefreshCw, Layers
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { format } from "date-fns";
import { analyticsAPI } from "@/services/api";

export default function AdminAuditPage() {
    const [audits, setAudits] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");

    useEffect(() => {
        fetchAudits();
    }, []);

    const fetchAudits = async () => {
        setLoading(true);
        try {
            const res = await analyticsAPI.getAudits();
            if (res.status) {
                setAudits(res.audits);
            }
        } catch (err) {
            console.error("Failed to fetch audits", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredAudits = audits.filter(a => {
        const matchesSearch = (a.msisdn?.includes(search)) || (a.ip?.includes(search));
        const matchesType = typeFilter === "all" || a.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const getEventBadge = (type: string) => {
        switch (type) {
            case 'sms_sent': return <Badge className="bg-blue-500/10 text-blue-600 border-none font-bold text-[10px]">SMS_SENT</Badge>;
            case 'token_created': return <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-bold text-[10px]">TOKEN_CREATED</Badge>;
            case 'video_started': return <Badge className="bg-orange-500/10 text-orange-600 border-none font-bold text-[10px]">VIDEO_STARTED</Badge>;
            case 'video_completed': return <Badge className="bg-purple-500/10 text-purple-600 border-none font-bold text-[10px]">VIDEO_COMPLETED</Badge>;
            default: return <Badge variant="outline" className="text-[10px]">{type.toUpperCase()}</Badge>;
        }
    };

    return (
        <AdminLayout title="Audit Logs">
            <div className="space-y-6 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            System Audit Trail
                            <Badge variant="outline" className="font-bold text-[10px] border-primary/20 text-primary bg-primary/5">READ-ONLY</Badge>
                        </h1>
                        <p className="text-muted-foreground text-sm">Historical record of all platform activities and tracking events.</p>
                    </div>
                    <div className="flex items-center gap-2">
                         <Button variant="outline" size="sm" className="h-9 rounded-xl font-bold text-xs gap-2" onClick={fetchAudits}>
                            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 rounded-xl font-bold text-xs gap-2">
                            <Download className="h-3.5 w-3.5" /> Export Logs
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl">
                    <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by MSISDN or IP..." 
                                className="pl-10 h-10 rounded-xl border-border/50 bg-background/50 text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <select 
                                className="h-10 rounded-xl border border-border/50 bg-background/50 px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="all">All Event Types</option>
                                <option value="sms_sent">SMS Sent</option>
                                <option value="token_created">Token Creation</option>
                                <option value="video_started">Video Started</option>
                                <option value="video_completed">Video Completed</option>
                            </select>
                            <Button variant="outline" className="h-10 w-10 p-0 rounded-xl border-border/50">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Audit Table */}
                <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-secondary/10 border-b border-border/50 py-4 px-6 flex flex-row items-center justify-between">
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <Layers className="h-4 w-4 text-primary" /> Event Log
                        </CardTitle>
                        <CardDescription className="text-xs">Displaying {filteredAudits.length} events matching current filters.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-secondary/5 border-none">
                                        <TableHead className="py-3 pl-6 uppercase text-[10px] font-bold text-muted-foreground">Timestamp</TableHead>
                                        <TableHead className="py-3 uppercase text-[10px] font-bold text-muted-foreground">Event Type</TableHead>
                                        <TableHead className="py-3 uppercase text-[10px] font-bold text-muted-foreground">Subscriber</TableHead>
                                        <TableHead className="py-3 uppercase text-[10px] font-bold text-muted-foreground">Origin</TableHead>
                                        <TableHead className="py-3 uppercase text-[10px] font-bold text-muted-foreground">Device/IP</TableHead>
                                        <TableHead className="py-3 pr-6 text-right uppercase text-[10px] font-bold text-muted-foreground">Flags</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <TableRow key={i} className="animate-pulse">
                                                <TableCell colSpan={6} className="h-16 bg-muted/20" />
                                            </TableRow>
                                        ))
                                    ) : filteredAudits.length > 0 ? (
                                        filteredAudits.map((audit) => (
                                            <TableRow key={audit._id} className="hover:bg-secondary/10 transition-colors border-b border-border/50 group">
                                                <TableCell className="py-4 pl-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-foreground">
                                                            {audit.timestamp ? format(new Date(audit.timestamp), 'MMM dd, yyyy') : '—'}
                                                        </span>
                                                        <span className="text-[10px] font-mono text-muted-foreground">
                                                            {audit.timestamp ? format(new Date(audit.timestamp), 'HH:mm:ss') : '—'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    {getEventBadge(audit.type)}
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                                            <User className="h-3.5 w-3.5 text-primary" />
                                                        </div>
                                                        <span className="font-mono text-[11px] font-bold tracking-tight">
                                                            {audit.msisdn || "ANONYMOUS"}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-bold text-foreground truncate max-w-[120px]">
                                                            {audit.location?.category || "Unknown"}
                                                        </span>
                                                        <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                                                            <MapPin className="h-3 w-3" /> External
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        {audit.device_info?.model?.toLowerCase().includes('iphone') || audit.device_info?.model?.toLowerCase().includes('phone') ? (
                                                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                                        ) : (
                                                            <Laptop className="h-3.5 w-3.5 text-muted-foreground" />
                                                        )}
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] font-bold text-foreground">{audit.ip || "—"}</span>
                                                            <span className="text-[9px] text-muted-foreground truncate max-w-[150px]">{audit.user_agent || "No UA String"}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 pr-6 text-right">
                                                    {audit.fraud_detected ? (
                                                        <Badge className="bg-rose-500 text-white font-bold text-[9px] h-5 gap-1">
                                                            <ShieldAlert className="h-2.5 w-2.5" /> FRAUD
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-muted-foreground border-border/50 font-bold text-[9px] h-5">
                                                            SECURE
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center gap-2">
                                                    <History className="h-8 w-8 text-muted-foreground/30" />
                                                    <p className="font-semibold italic">No audit records found matching criteria.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
