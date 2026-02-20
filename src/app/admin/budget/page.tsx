"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/config/api";
import { format } from "date-fns";

import {
    Save,
    Plus,
    Shield,
    DollarSign,
    Zap,
    TrendingUp,
    BarChart3,
    ArrowUpRight,
    Search,
    ChevronRight,
    Wallet,
    GanttChartSquare,
    Calculator,
    ShieldCheck,
    Lock,
    Settings2,
    History,
    FileText,
    ArrowDownRight,
    Globe
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import KPICard from "@/components/analytics/KPICard";
import { analyticsAPI } from "@/services/api";

const rateTiers = [
    { id: 1, name: "Free", rate: 0.0, description: "Basic tier for new advertisers", campaigns: 0, color: "text-slate-500", bg: "bg-slate-50", icon: Shield },
    { id: 2, name: "Standard", rate: 0.1, description: "Default rate for most campaigns", campaigns: 14, color: "text-blue-500", bg: "bg-blue-50", icon: Zap },
    { id: 3, name: "Premium", rate: 0.15, description: "Priority placement and better targeting", campaigns: 38, color: "text-orange-500", bg: "bg-orange-50", icon: TrendingUp },
    { id: 4, name: "Enterprise", rate: 1.2, description: "Custom solutions for large advertisers", campaigns: 5, color: "text-purple-500", bg: "bg-purple-50", icon: Globe },
];

export default function AdminBudgetPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [globalSettings, setGlobalSettings] = useState({
        autoDeduction: true,
        budgetAlertThreshold: 75,
        pauseCampaignsAtZero: true,
        allowNegativeBalance: false,
    });

    useEffect(() => {
        const fetchBudget = async () => {
            try {
                const json = await analyticsAPI.getAdminBudget();
                if (json.status) {
                    setData(json);
                }
            } catch (err) {
                console.error("Failed to fetch budget data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBudget();
    }, []);

    const handleSave = () => {
        toast.success("Budget policies updated successfully.");
    };


    return (
        <AdminLayout title="Budget & Pricing">
            <div className="space-y-6 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            Financial Controls
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-bold py-0.5 px-2 text-[10px]">
                                SYNCED
                            </Badge>
                        </h1>
                        <p className="text-muted-foreground text-sm">Manage pricing tiers, unit rates, and financial enforcement policies.</p>
                    </div>
                    <div className="flex gap-3 items-center bg-background/50 backdrop-blur-sm p-2 rounded-2xl border border-border/50 shadow-sm">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-none py-1 px-3 font-bold text-[10px]">
                            ACTIVE
                        </Badge>
                        <Separator orientation="vertical" className="h-6 bg-border/50" />
                        <Button variant="ghost" size="sm" className="h-8 rounded-lg font-bold text-xs gap-2 px-3">
                            <History className="h-4 w-4" /> Audit Logs
                        </Button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard title="Total Revenue" value={`${data?.kpis?.total_revenue?.toLocaleString() || '0'} Br.`} icon={Wallet} trend="up" change={12.5} />
                    <KPICard title="Total Top-ups" value={`${data?.kpis?.total_topups?.toLocaleString() || '0'} Br.`} icon={ArrowUpRight} trend="up" change={5.2} />
                    <KPICard title="Current Balance" value={`${data?.kpis?.platform_balance?.toLocaleString() || '0'} Br.`} icon={GanttChartSquare} trend="neutral" />
                    <KPICard title="Avg Deduction" value={`${data?.kpis?.avg_real_deduction?.toFixed(2) || '0.00'} Br.`} icon={Zap} trend="down" change={1.4} />
                </div>

                <Tabs defaultValue="rates" className="space-y-6">
                    <div className="bg-background/50 backdrop-blur-sm p-2 rounded-2xl border border-border/50 shadow-sm overflow-x-auto">
                        <TabsList className="bg-secondary/20 p-1 rounded-xl h-auto flex gap-1">
                            <TabsTrigger value="rates" className="rounded-lg px-6 py-2.5 gap-2 text-xs font-bold transition-all">
                                <TrendingUp className="h-4 w-4" /> Pricing Tiers
                            </TabsTrigger>
                            <TabsTrigger value="transactions" className="rounded-lg px-6 py-2.5 gap-2 text-xs font-bold transition-all">
                                <History className="h-4 w-4" /> Transactions
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="rounded-lg px-6 py-2.5 gap-2 text-xs font-bold transition-all">
                                <ShieldCheck className="h-4 w-4" /> Financial Policies
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="rates" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-secondary/10 border-b border-border/50 py-4 px-6 flex flex-row items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <BarChart3 className="h-4 w-4 text-primary" />
                                        <CardTitle className="text-lg font-bold">Cost Per Click Rates</CardTitle>
                                    </div>
                                    <CardDescription className="text-xs">Define the cost for each successful ad engagement.</CardDescription>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="sm" className="h-9 rounded-xl font-bold gap-2 px-4 shadow-sm">
                                            <Plus className="h-4 w-4" /> Add Rate Tier
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md rounded-2xl p-6">
                                        <DialogHeader>
                                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                                <TrendingUp className="h-5 w-5 text-primary" /> Add New Rate Tier
                                            </DialogTitle>
                                            <CardDescription className="text-xs">Configure a new pricing model for the platform.</CardDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 pt-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Tier Name</Label>
                                                <Input placeholder="e.g. Ultra Premium" className="h-10 rounded-lg text-sm" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Rate (ETB per Click)</Label>
                                                <div className="relative">
                                                    <Input type="number" step="0.01" placeholder="0.25" className="h-12 rounded-lg text-lg font-bold pl-10" />
                                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Description</Label>
                                                <Input placeholder="Short description of this tier..." className="h-10 rounded-lg text-sm" />
                                            </div>
                                            <Button className="w-full h-11 rounded-lg font-bold mt-2">Save Rate Tier</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-secondary/5 border-none">
                                            <TableHead className="py-3 pl-6 uppercase text-[10px] font-bold text-muted-foreground">Tier Name</TableHead>
                                            <TableHead className="py-3 uppercase text-[10px] font-bold text-muted-foreground">Rate (CPC)</TableHead>
                                            <TableHead className="py-3 uppercase text-[10px] font-bold text-muted-foreground">Description</TableHead>
                                            <TableHead className="py-3 pr-6 text-right uppercase text-[10px] font-bold text-muted-foreground">Active Campaigns</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rateTiers.map((tier) => (
                                            <TableRow key={tier.id} className="hover:bg-secondary/10 transition-colors border-b border-border/50 group">
                                                <TableCell className="py-4 pl-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${tier.bg} ${tier.color} border-current/20`}>
                                                            <tier.icon className="h-4.5 w-4.5" />
                                                        </div>
                                                        <div>
                                                            <span className="font-bold text-sm block">{tier.name}</span>
                                                            <span className="text-[9px] font-bold text-muted-foreground uppercase">Tier ID: 00{tier.id}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <Badge variant="outline" className="font-mono text-sm font-bold border-border/50 py-1 px-3 rounded-lg bg-background">
                                                        {tier.rate.toFixed(2)} <span className="text-[10px] opacity-60 ml-1">ETB</span>
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <p className="text-xs text-muted-foreground max-w-[250px] italic">"{tier.description}"</p>
                                                </TableCell>
                                                <TableCell className="py-4 pr-6 text-right">
                                                    <div className="flex flex-col items-end">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg font-bold text-foreground leading-none">{tier.campaigns}</span>
                                                            <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-bold text-[9px]">ACTIVE</Badge>
                                                        </div>
                                                        <span className="text-[9px] font-bold text-muted-foreground uppercase mt-1">Total Linked</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="transactions" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-secondary/10 border-b border-border/50 py-4 px-6">
                                <div className="flex items-center gap-2">
                                    <History className="h-4.5 w-4.5 text-primary" />
                                    <CardTitle className="text-lg font-bold text-foreground">Platform Transaction History</CardTitle>
                                </div>
                                <CardDescription className="text-xs text-muted-foreground">Monitor all top-ups and deductions across the platform.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-secondary/5 border-none">
                                            <TableHead className="py-3 pl-6 uppercase text-[10px] font-bold text-muted-foreground">Marketer</TableHead>
                                            <TableHead className="py-3 uppercase text-[10px] font-bold text-muted-foreground">Type</TableHead>
                                            <TableHead className="py-3 uppercase text-[10px] font-bold text-muted-foreground">Amount</TableHead>
                                            <TableHead className="py-3 uppercase text-[10px] font-bold text-muted-foreground">Reason</TableHead>
                                            <TableHead className="py-3 pr-6 text-right uppercase text-[10px] font-bold text-muted-foreground">Timestamp</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data?.recent_transactions?.map((t: any) => (
                                            <TableRow key={t.id} className="hover:bg-secondary/10 transition-colors border-b border-border/50 group">
                                                <TableCell className="py-4 pl-6">
                                                    <span className="font-bold text-sm block text-foreground">{t.marketer || 'Unknown'} Marketer</span>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <Badge className={t.type === 'topup' ? 'bg-emerald-500/10 text-emerald-600 border-none' : 'bg-rose-500/10 text-rose-600 border-none'}>
                                                        {t.type.toUpperCase()}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4 font-mono font-bold text-foreground">
                                                    {t.type === 'topup' ? '+' : '-'}{t.amount.toLocaleString()} Br.
                                                </TableCell>
                                                <TableCell className="py-4 italic text-muted-foreground text-xs">
                                                    {t.reason || 'No reason provided'}
                                                </TableCell>
                                                <TableCell className="py-4 pr-6 text-right text-xs text-muted-foreground">
                                                    {t.timestamp ? format(new Date(t.timestamp), 'MMM dd, HH:mm') : 'N/A'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {(!data?.recent_transactions || data.recent_transactions.length === 0) && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground italic">
                                                    No recent transactions found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>


                    <TabsContent value="settings" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-secondary/10 border-b border-border/50 py-4 px-6">
                                <div className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-primary" />
                                    <CardTitle className="text-lg font-bold">Financial Enforcement</CardTitle>
                                </div>
                                <CardDescription className="text-xs">Rules for balance enforcement and real-time deductions.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Deduction Policy */}
                                    <div className="p-6 rounded-2xl bg-secondary/5 border border-border/50 space-y-6">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <Label className="text-sm font-bold block">Auto-Deduction</Label>
                                                <p className="text-xs text-muted-foreground max-w-[200px]">Deduct balance in real-time for each successful ad completion.</p>
                                            </div>
                                            <Switch
                                                checked={globalSettings.autoDeduction}
                                                onCheckedChange={(checked) => setGlobalSettings({ ...globalSettings, autoDeduction: checked })}
                                            />
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-border/30">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Alert Threshold</Label>
                                                <Badge className="bg-primary text-white font-mono text-xs px-2 py-0.5 rounded-md">{globalSettings.budgetAlertThreshold}%</Badge>
                                            </div>
                                            <Input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={globalSettings.budgetAlertThreshold}
                                                onChange={(e) => setGlobalSettings({ ...globalSettings, budgetAlertThreshold: parseInt(e.target.value) })}
                                                className="h-2 accent-primary"
                                            />
                                            <p className="text-[10px] text-muted-foreground italic">Triggers email notifications to the advertiser.</p>
                                        </div>
                                    </div>

                                    {/* Suspension Policy */}
                                    <div className="p-6 rounded-2xl bg-secondary/5 border border-border/50 space-y-6">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <Label className="text-sm font-bold block">Pause at Zero</Label>
                                                <p className="text-xs text-muted-foreground max-w-[200px]">Automatically pause all campaigns when balance reaches zero.</p>
                                            </div>
                                            <Switch
                                                checked={globalSettings.pauseCampaignsAtZero}
                                                onCheckedChange={(checked) => setGlobalSettings({ ...globalSettings, pauseCampaignsAtZero: checked })}
                                            />
                                        </div>

                                        <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100 mt-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label className="text-xs font-bold text-rose-900 block">Allow Negative Balance</Label>
                                                    <p className="text-[10px] text-rose-700/70">Permit negative balances for trusted accounts.</p>
                                                </div>
                                                <Switch
                                                    checked={globalSettings.allowNegativeBalance}
                                                    onCheckedChange={(checked) => setGlobalSettings({ ...globalSettings, allowNegativeBalance: checked })}
                                                    className="data-[state=checked]:bg-rose-500"
                                                />
                                            </div>
                                            <p className="text-[9px] font-bold text-rose-500 uppercase tracking-wider">Warning: Risk of uncollateralized delivery</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end items-center gap-3 pt-4 border-t border-border/30">
                                    <Button variant="ghost" className="h-10 px-6 rounded-xl font-bold text-xs uppercase text-muted-foreground">
                                        Reset Changes
                                    </Button>
                                    <Button onClick={handleSave} className="h-10 px-8 rounded-xl font-bold text-sm gap-2">
                                        <Save className="h-4 w-4" /> Save Pricing Policies
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
}
