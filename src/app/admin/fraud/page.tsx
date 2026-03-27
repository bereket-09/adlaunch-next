"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import {
    Shield,
    AlertTriangle,
    Ban,
    CheckCircle2,
    ShieldAlert,
    ShieldCheck,
    Lock,
    Globe,
    Activity,
    UserX,
    Filter,
    Radar,
    SearchX,
    LockKeyhole,
    Fingerprint,
    Cpu,
    ExternalLink,
    Terminal,
    MapPin,
    Clock,
    Zap,
    History,
    ChevronRight,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import KPICard from "@/components/analytics/KPICard";
import ExportButton from "@/components/analytics/ExportButton";
import RealTimeIndicator from "@/components/analytics/RealTimeIndicator";
import { analyticsAPI } from "@/services/api";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { API_ENDPOINTS } from "@/config/api";

const recentThreatsData = [
    { id: 1, type: "Brute Force Attempt", ip: "192.168.1.45", location: "Addis Ababa", time: "2 mins ago", severity: "high", status: "blocked" },
    { id: 2, type: "Suspicious Origin", ip: "45.12.89.22", location: "St. Petersburg", time: "15 mins ago", severity: "medium", status: "flagged" },
    { id: 3, type: "Unknown Agent", ip: "172.16.0.12", location: "Mekelle", time: "45 mins ago", severity: "low", status: "monitored" },
    { id: 4, type: "API Rate Limit Breach", ip: "91.22.45.118", location: "Adama", time: "1 hour ago", severity: "high", status: "blocked" },
];

const blockedIpsData = [
    { ip: "192.168.1.45", reason: "Multiple login failures", blockedAt: "2024-03-20 14:22", duration: "Permanent" },
    { ip: "91.22.45.118", reason: "Automated scraping detected", blockedAt: "2024-03-20 10:05", duration: "24 Hours" },
    { ip: "103.44.12.5", reason: "Known malicious host", blockedAt: "2024-03-19 22:18", duration: "Permanent" },
];

export default function AdminFraudPage() {
    const [loading, setLoading] = useState(true);
    const [kpis, setKpis] = useState<any>(null);
    const [suspiciousActivity, setSuspiciousActivity] = useState<any[]>([]);
    const [blockedIPs, setBlockedIPs] = useState<any[]>([]);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const data = await analyticsAPI.getAdminFraud();

            if (!data?.status) return;

            setKpis(data.kpis);
            setSuspiciousActivity(data.suspicious_activity ?? []);
            setBlockedIPs(data.blocked_ips ?? []);
        } catch (err) {
            console.error("Failed to load fraud dashboard", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Security Dashboard">
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-muted-foreground text-sm font-medium">Scanning for threats...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const displayThreats = suspiciousActivity.map((a, i) => ({
        id: a.id || i,
        type: a.type,
        ip: a.ip || "Unknown",
        location: a.location || "Internal",
        time: a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : "-",
        severity: (a.confidence || 0) > 80 ? "high" : (a.confidence || 0) > 50 ? "medium" : "low",
        status: "blocked"
    }));

    const displayBlocked = blockedIPs;

    return (
        <AdminLayout title="Fraud & Security">
            <div className="space-y-6 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            Fraud Detection
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-bold py-0.5 px-2 text-[10px]">
                                ACTIVE
                            </Badge>
                        </h1>
                        <p className="text-muted-foreground text-sm">Real-time threat monitoring and automated incident response.</p>
                    </div>
                    <div className="flex gap-3 items-center bg-background/50 backdrop-blur-sm p-2 rounded-2xl border border-border/50 shadow-sm">
                        <RealTimeIndicator label="Status: Secure" />
                        <Separator orientation="vertical" className="h-6 bg-border/50" />
                        <ExportButton filename="security-report" />
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard title="Security Health" value="99.2%" icon={ShieldCheck} trend="up" change={0.4} />
                    <KPICard title="Anomaly Rate" value={kpis ? `${kpis.fraud_detection_rate}%` : "0.5%"} icon={Radar} trend="down" change={1.2} />
                    <KPICard title="Blocked Attempts" value={kpis?.blocked_attempts || 1284} icon={Ban} trend="up" change={24} />
                    <KPICard title="Monitored Users" value={kpis?.suspicious_activities || 12} icon={Fingerprint} trend="neutral" />
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <div className="bg-background/50 backdrop-blur-sm p-2 rounded-2xl border border-border/50 shadow-sm overflow-x-auto">
                        <TabsList className="bg-secondary/20 p-1 rounded-xl h-auto flex gap-1">
                            <TabsTrigger value="overview" className="rounded-lg px-6 py-2.5 gap-2 text-xs font-bold transition-all">
                                <Activity className="h-4 w-4" /> Activity Feed
                            </TabsTrigger>
                            <TabsTrigger value="blocked" className="rounded-lg px-6 py-2.5 gap-2 text-xs font-bold transition-all">
                                <LockKeyhole className="h-4 w-4" /> Blocked IPs
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="overview" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-secondary/10 border-b border-border/50 py-4 px-6 flex flex-row items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Radar className="h-4 w-4 text-primary" />
                                        <CardTitle className="text-lg font-bold">Suspicious Activity</CardTitle>
                                    </div>
                                    <CardDescription className="text-xs">Live stream of potential security threats.</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-[10px] font-bold py-0 px-2 border-emerald-500/20 text-emerald-600 bg-emerald-50">LIVE</Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><History className="h-4 w-4" /></Button>
                                    <Button variant="outline" size="sm" className="h-8 rounded-lg font-bold text-xs">Filter</Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-secondary/5 border-none">
                                            <TableHead className="py-3 pl-6 uppercase text-[10px] font-bold text-muted-foreground">Type & Source</TableHead>
                                            <TableHead className="py-3 uppercase text-[10px] font-bold text-muted-foreground">IP Origin</TableHead>
                                            <TableHead className="py-3 uppercase text-[10px] font-bold text-muted-foreground">Detected At</TableHead>
                                            <TableHead className="py-3 uppercase text-[10px] font-bold text-muted-foreground text-center">Severity</TableHead>
                                            <TableHead className="py-3 pr-6 text-right uppercase text-[10px] font-bold text-muted-foreground">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                         {displayThreats.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="py-12 text-center text-muted-foreground italic text-sm">
                                                    No suspicious activity detected in the last scan.
                                                </TableCell>
                                            </TableRow>
                                         ) : (
                                            displayThreats.map((threat) => (
                                                <TableRow key={threat.id} className="hover:bg-secondary/10 transition-colors border-b border-border/50">
                                                    <TableCell className="py-4 pl-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${threat.severity === 'high' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                                                                {threat.severity === 'high' ? <ShieldAlert className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                                                            </div>
                                                            <span className="font-bold text-sm">{threat.type}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-mono text-xs font-bold text-foreground">{threat.ip}</span>
                                                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                                <MapPin className="h-3 w-3" /> {threat.location}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 font-mono text-xs text-muted-foreground">
                                                        {threat.time}
                                                    </TableCell>
                                                    <TableCell className="py-4 text-center">
                                                        <Badge variant="outline" className={`font-bold text-[9px] px-2 py-0 border-none ${threat.severity === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                                                            {threat.severity?.toUpperCase() || ''}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-4 pr-6 text-right">
                                                        <div className="flex flex-col items-end gap-1">
                                                            <Badge className={`text-[9px] font-bold px-2 py-0 ${threat.status === 'blocked' ? 'bg-rose-500' : 'bg-amber-500'}`}>
                                                                {threat.status?.toUpperCase() || ''}
                                                            </Badge>
                                                            <Button variant="link" className="h-auto p-0 text-[10px] font-bold text-primary">Details</Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                         )}
                                    </TableBody>
                                </Table>
                                <div className="p-4 border-t border-border/50 text-center">
                                    <Button variant="ghost" size="sm" className="font-bold text-xs text-muted-foreground hover:text-primary gap-1">
                                        View Full History <ChevronRight className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="blocked" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-secondary/10 border-b border-border/50 py-4 px-6 flex flex-row items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-rose-500" />
                                        <CardTitle className="text-lg font-bold">Blocked IP Addresses</CardTitle>
                                    </div>
                                    <CardDescription className="text-xs">Persistent restrictions applied to malicious nodes.</CardDescription>
                                </div>
                                <Button variant="destructive" size="sm" className="h-8 rounded-lg px-4 font-bold text-xs gap-2">
                                    <ShieldAlert className="h-4 w-4" /> Block IP
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-secondary/5 border-none">
                                            <TableHead className="py-3 pl-6 uppercase text-[10px] font-bold text-muted-foreground">IP Address</TableHead>
                                            <TableHead className="py-3 uppercase text-[10px] font-bold text-muted-foreground">Reason</TableHead>
                                            <TableHead className="py-3 uppercase text-[10px] font-bold text-muted-foreground">Blocked At</TableHead>
                                            <TableHead className="py-3 pr-6 text-right uppercase text-[10px] font-bold text-muted-foreground">Duration</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                         {displayBlocked.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="py-12 text-center text-muted-foreground italic text-sm">
                                                    No IP addresses are currently blacklisted.
                                                </TableCell>
                                            </TableRow>
                                         ) : (
                                            displayBlocked.map((info, i) => (
                                                <TableRow key={info.ip || i} className="hover:bg-rose-50/10 transition-colors border-b border-border/50">
                                                    <TableCell className="py-4 pl-6">
                                                        <span className="font-mono text-sm font-bold text-rose-600">{info.ip}</span>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-sm">{info.reason}</span>
                                                            <span className="text-[10px] text-rose-400 font-bold">Confirmed</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 font-mono text-xs text-muted-foreground">
                                                        {info.blockedAt}
                                                    </TableCell>
                                                    <TableCell className="py-4 pr-6 text-right">
                                                        <Badge variant="outline" className="border-rose-200 text-rose-700 bg-rose-50 text-[9px] font-bold">
                                                            {info.duration?.toUpperCase() || ''}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                         )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
}
