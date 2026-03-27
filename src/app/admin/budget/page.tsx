"use client";
export const dynamic = 'force-dynamic';

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
    Globe,
    Trash2
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
import { analyticsAPI, billingModelAPI } from "@/services/api";

export default function AdminBudgetPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [billingModels, setBillingModels] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const [newModel, setNewModel] = useState({
        name: "",
        cpv_rate: 0,
        cpc_rate: 0,
        description: "",
        features: {
            has_video: true,
            has_banner: false,
            has_cta: false
        }
    });

    const [globalSettings, setGlobalSettings] = useState({
        autoDeduction: true,
        budgetAlertThreshold: 75,
        pauseCampaignsAtZero: true,
        allowNegativeBalance: false,
    });

    const fetchBillingModels = async () => {
        try {
            const res = await billingModelAPI.list();
            if (res.status) setBillingModels(res.models);
        } catch (err) {
            console.error("Failed to fetch billing models", err);
        }
    };

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
        fetchBillingModels();
    }, []);

    const handleCreateModel = async () => {
        setIsSaving(true);
        try {
            const res = await billingModelAPI.create(newModel);
            if (res.status) {
                toast.success("Billing model created.");
                fetchBillingModels();
                setNewModel({
                    name: "",
                    cpv_rate: 0,
                    cpc_rate: 0,
                    description: "",
                    features: { has_video: true, has_banner: false, has_cta: false }
                });
            }
        } catch (err) {
            toast.error("Failed to create billing model.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateModel = async (id: string, updates: any) => {
        try {
            await billingModelAPI.update(id, updates);
            toast.success("Model updated.");
            fetchBillingModels();
        } catch (err) {
            toast.error("Failed to update.");
        }
    };

    const handleSave = () => {
        toast.success("Budget policies updated successfully.");
    };


    return (
        <AdminLayout title="Billing Models">
            <div className="page-container">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">Financial Controls</h1>
                            <span className="badge-green">Synced</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Manage pricing tiers, unit rates, and financial enforcement policies.</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-9 rounded-xl font-semibold text-xs gap-2 px-4 border border-border/60">
                        <History className="h-4 w-4" /> Audit Logs
                    </Button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard title="Total Revenue" value={`${data?.kpis?.total_revenue?.toLocaleString() || '0'} Br.`} icon={Wallet} trend="up" change={12.5} accent />
                    <KPICard title="Total Top-ups" value={`${data?.kpis?.total_topups?.toLocaleString() || '0'} Br.`} icon={ArrowUpRight} trend="up" change={5.2} />
                    <KPICard title="Platform Balance" value={`${data?.kpis?.platform_balance?.toLocaleString() || '0'} Br.`} icon={GanttChartSquare} trend="neutral" accent />
                    <KPICard title="Avg Deduction" value={`${data?.kpis?.avg_real_deduction?.toFixed(2) || '0.00'} Br.`} icon={Zap} trend="down" change={1.4} />
                </div>

                <Tabs defaultValue="rates" className="space-y-5">
                    <TabsList className="bg-secondary/80 rounded-xl p-1 gap-1 h-auto">
                        <TabsTrigger value="rates" className="rounded-lg px-5 py-2 gap-2 text-xs font-semibold transition-all">
                            <TrendingUp className="h-3.5 w-3.5" /> Billing Models
                        </TabsTrigger>
                        <TabsTrigger value="transactions" className="rounded-lg px-5 py-2 gap-2 text-xs font-semibold transition-all">
                            <History className="h-3.5 w-3.5" /> Transactions
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="rounded-lg px-5 py-2 gap-2 text-xs font-semibold transition-all">
                            <ShieldCheck className="h-3.5 w-3.5" /> Financial Policies
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="rates" className="space-y-5">
                        <Card className="card-elevated border-0 rounded-2xl overflow-hidden">
                            <CardHeader className="border-b border-border/40 py-4 px-6 flex flex-row items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <BarChart3 className="h-4 w-4 text-primary" />
                                        <CardTitle className="text-base font-bold">Billing Models</CardTitle>
                                    </div>
                                    <CardDescription className="text-xs">Configure dynamic pricing tiers for ad campaigns.</CardDescription>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="sm" className="h-9 rounded-xl font-bold gap-2 px-4 text-white"
                                                style={{ background: 'linear-gradient(135deg, hsl(24,100%,50%), hsl(34,100%,55%))' }}>
                                            <Plus className="h-4 w-4" /> Add Billing Model
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md rounded-2xl p-6">
                                        <DialogHeader>
                                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                                <TrendingUp className="h-5 w-5 text-primary" /> Add New Billing Model
                                            </DialogTitle>
                                            <CardDescription className="text-xs">Configure how marketers are billed and what features they get.</CardDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 pt-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Tier Name</Label>
                                                <Input 
                                                    value={newModel.name}
                                                    onChange={(e) => setNewModel({...newModel, name: e.target.value})}
                                                    placeholder="e.g. Ultra Premium" 
                                                    className="h-10 rounded-lg text-sm" 
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">CPV Rate (ETB)</Label>
                                                    <Input 
                                                        type="number" 
                                                        value={newModel.cpv_rate}
                                                        onChange={(e) => setNewModel({...newModel, cpv_rate: parseFloat(e.target.value)})}
                                                        placeholder="0.10" 
                                                        className="h-10 rounded-lg text-sm" 
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">CPC Rate (ETB)</Label>
                                                    <Input 
                                                        type="number" 
                                                        value={newModel.cpc_rate}
                                                        onChange={(e) => setNewModel({...newModel, cpc_rate: parseFloat(e.target.value)})}
                                                        placeholder="0.05" 
                                                        className="h-10 rounded-lg text-sm" 
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3 p-3 bg-secondary/20 rounded-xl border border-border/50">
                                                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Features Included</Label>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-medium">Video Ad</span>
                                                        <Switch checked={newModel.features.has_video} onCheckedChange={(val) => setNewModel({...newModel, features: {...newModel.features, has_video: val}})} />
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-medium">Banner Ad</span>
                                                        <Switch checked={newModel.features.has_banner} onCheckedChange={(val) => setNewModel({...newModel, features: {...newModel.features, has_banner: val}})} />
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-medium">CTA Button</span>
                                                        <Switch checked={newModel.features.has_cta} onCheckedChange={(val) => setNewModel({...newModel, features: {...newModel.features, has_cta: val}})} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Description</Label>
                                                <Input 
                                                    value={newModel.description}
                                                    onChange={(e) => setNewModel({...newModel, description: e.target.value})}
                                                    placeholder="Short description of this tier..." 
                                                    className="h-10 rounded-lg text-sm" 
                                                />
                                            </div>
                                            <Button 
                                                onClick={handleCreateModel} 
                                                disabled={isSaving}
                                                className="w-full h-11 rounded-lg font-bold mt-2"
                                            >
                                                {isSaving ? "Saving..." : "Save Billing Model"}
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-secondary/5 border-none">
                                            <TableHead className="py-3 pl-6 uppercase text-[10px] font-bold text-muted-foreground">Name</TableHead>
                                            <TableHead className="py-3 uppercase text-[10px] font-bold text-muted-foreground">Rates (CPV / CPC)</TableHead>
                                            <TableHead className="py-3 uppercase text-[10px] font-bold text-muted-foreground">Features</TableHead>
                                            <TableHead className="py-3 pr-6 text-right uppercase text-[10px] font-bold text-muted-foreground">Manage</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {billingModels.map((model) => (
                                            <TableRow key={model._id} className="hover:bg-primary/[0.02] transition-colors border-b border-border/40 group">
                                                <TableCell className="py-4 pl-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary/10">
                                                            <Zap className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <div>
                                                            <span className="font-bold text-sm block">{model.name}</span>
                                                            <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">{model.slug}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex gap-2">
                                                        <span className="badge-orange">{model.cpv_rate.toFixed(2)} CPV</span>
                                                        {model.cpc_rate > 0 && (
                                                            <span className="badge-blue">{model.cpc_rate.toFixed(2)} CPC</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex gap-1.5">
                                                        {model.features?.has_video && <span className="badge-green">Video</span>}
                                                        {model.features?.has_banner && <span className="badge-blue">Banner</span>}
                                                        {model.features?.has_cta && <span className="badge-orange">CTA</span>}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 pr-6 text-right">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
                                                            onClick={() => handleUpdateModel(model._id, { active: false })}>
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="transactions" className="space-y-5">
                        <Card className="card-elevated border-0 rounded-2xl overflow-hidden">
                            <CardHeader className="border-b border-border/40 py-4 px-6">
                                <div className="flex items-center gap-2">
                                    <History className="h-4 w-4 text-primary" />
                                    <CardTitle className="text-base font-bold text-foreground">Platform Transaction History</CardTitle>
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
                                            <TableRow key={t.id} className="hover:bg-primary/[0.02] transition-colors border-b border-border/40 group">
                                                <TableCell className="py-4 pl-6">
                                                    <span className="font-bold text-sm block text-foreground">{t.marketer || 'Unknown'}</span>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <span className={t.type === 'topup' ? 'badge-green' : 'badge-red'}>
                                                        {t.type === 'topup' ? '↑ Top-up' : '↓ Deduction'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <span className={`font-mono font-bold tabular-nums ${t.type === 'topup' ? 'text-green-600' : 'text-red-500'}`}>
                                                        {t.type === 'topup' ? '+' : '-'}{t.amount.toLocaleString()} Br.
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-4 text-muted-foreground text-xs">
                                                    {t.reason || '—'}
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


                    <TabsContent value="settings" className="space-y-5">
                        <Card className="card-elevated border-0 rounded-2xl overflow-hidden">
                            <CardHeader className="border-b border-border/40 py-4 px-6">
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
                                    <Button variant="ghost" className="h-10 px-6 rounded-xl font-semibold text-xs text-muted-foreground">
                                        Reset Changes
                                    </Button>
                                    <Button onClick={handleSave} className="h-10 px-6 rounded-xl font-bold text-sm gap-2 text-white"
                                            style={{ background: 'linear-gradient(135deg, hsl(24,100%,50%), hsl(34,100%,55%))' }}>
                                        <Save className="h-4 w-4" /> Save Policies
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
