"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Wallet, 
  History, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  ChevronLeft,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Activity,
  Plus
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { marketerAPI, budgetAPI, Marketer, Transaction } from "@/services/api";
import { cn } from "@/lib/utils";

export default function MarketerDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { toast } = useToast();
    
    const [marketer, setMarketer] = useState<Marketer | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Top-up/Deduct forms
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState<'topup' | 'deduction'>('topup');

    useEffect(() => {
        if (id) fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [marketerRes, transRes] = await Promise.all([
                marketerAPI.get(id),
                budgetAPI.getTransactions(id)
            ]);
            
            if (marketerRes.status) setMarketer(marketerRes.marketer);
            if (transRes.status) setTransactions(transRes.transactions.reverse());
        } catch (error) {
            toast({ title: "Fetch failed", description: "Could not load profile details.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateKYC = async () => {
        if (!marketer) return;
        setSaving(true);
        try {
            const res = await marketerAPI.update(id, {
                name: marketer.name,
                company_name: marketer.company_name,
                business_reg_number: marketer.business_reg_number,
                business_address: marketer.business_address,
                contact_info: marketer.contact_info,
                admin_comments: marketer.admin_comments,
                status: marketer.status,
                kyc_status: marketer.kyc_status
            });
            if (res.status) {
                toast({ title: "Profile Updated", description: "All changes have been saved." });
                fetchData();
            }
        } catch (err) {
            toast({ title: "Update Failed", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const handleBudgetAction = async () => {
        if (!amount || parseFloat(amount) <= 0) return;
        setSaving(true);
        try {
            const res = type === 'topup' 
                ? await budgetAPI.topup({ marketerId: id, amount: parseFloat(amount), payment_method: 'Internal Correction', description })
                : await budgetAPI.deduct({ marketerId: id, amount: parseFloat(amount), reason: 'Admin Adjustment', description });
            
            if (res.status) {
                toast({ title: type === 'topup' ? "Funds Added" : "Funds Deducted" });
                setAmount("");
                setDescription("");
                fetchData();
            }
        } catch (err) {
            toast({ title: "Transaction Failed", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = async (newStatus: string, kycStatus?: string) => {
        if (!marketer) return;
        try {
            await marketerAPI.update(id, { 
                status: newStatus as any, 
                kyc_status: kycStatus || marketer.kyc_status,
                admin_comments: marketer.admin_comments
            });
            toast({ title: "Status Updated", description: `Account is now ${newStatus.toUpperCase()}.` });
            fetchData();
        } catch (err) {
            toast({ title: "Failed to update status", variant: "destructive" });
        }
    };

    if (loading) return <AdminLayout title="Marketer Details"><div className="p-20 text-center animate-pulse">Initializing Profile View...</div></AdminLayout>;
    if (!marketer) return <AdminLayout title="Error">Account not found.</AdminLayout>;

    return (
        <AdminLayout title="Marketer Intelligence">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                {/* Breadcrumb & Quick Actions */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => router.back()} className="gap-2 text-slate-500 hover:text-slate-900">
                        <ChevronLeft className="h-4 w-4" /> Back to Directory
                    </Button>
                    <div className="flex gap-4">
                        {marketer.status === 'pending' && (
                            <>
                                <Button onClick={() => handleStatusChange('rejected', 'rejected')} variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50 h-11 rounded-xl px-6 font-bold">
                                    <XCircle className="h-4 w-4 mr-2" /> Reject
                                </Button>
                                <Button onClick={() => handleStatusChange('active', 'verified')} className="bg-emerald-600 hover:bg-emerald-700 h-11 rounded-xl px-8 font-bold shadow-lg shadow-emerald-200">
                                    <CheckCircle className="h-4 w-4 mr-2" /> Activate Account
                                </Button>
                            </>
                        )}
                        {marketer.status === 'active' && (
                            <Button onClick={() => handleStatusChange('deactivated')} variant="outline" className="text-rose-600 border-rose-200 h-11 rounded-xl">
                                <XCircle className="h-4 w-4 mr-2" /> Deactivate
                            </Button>
                        )}
                    </div>
                </div>

                {/* Profile Header Card */}
                <div className="bg-slate-950 text-white rounded-[3rem] p-12 relative overflow-hidden border border-white/5 shadow-2xl">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start md:items-center justify-between">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl">
                                    <Building className="h-10 w-10 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">{marketer.name}</h1>
                                    <p className="text-slate-400 font-medium mt-2 flex items-center gap-2">
                                        <Mail className="h-4 w-4" /> {marketer.email} • ID: {id.slice(-6).toUpperCase()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Badge className={cn(
                                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic border-none",
                                    marketer.status === 'active' ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                                )}>
                                    Account {marketer.status}
                                </Badge>
                                {(marketer as any).kyc_status === 'verified' && (
                                    <Badge className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic bg-blue-500 text-white border-none">
                                        Verified Business
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] min-w-[320px]">
                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Available Credit</p>
                                <p className="text-4xl font-black italic tracking-tighter text-white">{(marketer.remaining_budget || 0).toLocaleString()} <span className="text-[10px] opacity-40">Br.</span></p>
                            </div>
                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Total Limit</p>
                                <p className="text-2xl font-black italic tracking-tighter text-slate-300">{(marketer.total_budget || 0).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: KYC & Intelligence Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="rounded-[3rem] border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                            <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/50">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-2xl font-black uppercase italic tracking-tight">Business Profile & KYC</CardTitle>
                                        <CardDescription className="text-sm font-bold text-slate-400 tracking-widest uppercase">Manage Institutional Identity</CardDescription>
                                    </div>
                                    <ShieldCheck className="h-6 w-6 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 space-y-10">
                                <div className="grid md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Company Legal Name</Label>
                                        <Input 
                                            value={marketer.company_name || ""} 
                                            onChange={(e) => setMarketer({...marketer, company_name: e.target.value})}
                                            className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-slate-900"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Registration / TIN ID</Label>
                                        <Input 
                                            value={marketer.business_reg_number || ""} 
                                            onChange={(e) => setMarketer({...marketer, business_reg_number: e.target.value})}
                                            className="h-12 rounded-xl bg-slate-50 border-slate-100 font-mono font-bold"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Contact Number</Label>
                                        <Input 
                                            value={marketer.contact_info || ""} 
                                            onChange={(e) => setMarketer({...marketer, contact_info: e.target.value})}
                                            className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">HQ Address</Label>
                                        <Input 
                                            value={marketer.business_address || ""} 
                                            onChange={(e) => setMarketer({...marketer, business_address: e.target.value})}
                                            className="h-12 rounded-xl bg-slate-50 border-slate-100"
                                        />
                                    </div>
                                </div>

                                <Separator className="bg-slate-50" />

                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-primary" />
                                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 italic">Institutional Documents</h4>
                                    </div>
                                    {marketer.kyc_documents && marketer.kyc_documents.length > 0 ? (
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {marketer.kyc_documents.map((doc: any, i) => (
                                                <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary/30 transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-primary border border-slate-100">
                                                            <FileText className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-900 uppercase italic leading-none">{doc.type || "DOC"}_{i+1}</p>
                                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified Format</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="icon" asChild className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary">
                                                        <a href={doc.path || doc.url} target="_blank" rel="noopener noreferrer">
                                                            <Download className="h-5 w-5" />
                                                        </a>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-center text-slate-400 italic text-sm">
                                            No documentation linked to this institutional profile.
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] italic flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4" /> Admin Instructions & Feedback
                                    </Label>
                                    <Textarea 
                                        value={marketer.admin_comments || ""} 
                                        onChange={(e) => setMarketer({...marketer, admin_comments: e.target.value})}
                                        placeholder="Add private internal notes or instructions for the marketer..."
                                        className="min-h-[120px] rounded-2xl bg-amber-50/20 border-amber-100 text-sm font-medium p-6 shadow-inner focus:ring-amber-500/20 placeholder:text-amber-900/20"
                                    />
                                </div>

                                <div className="pt-6">
                                    <Button onClick={handleUpdateKYC} disabled={saving} className="w-full h-16 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest shadow-2xl transition-all active:scale-[0.98]">
                                        {saving ? "Updating Systems..." : "Synchronize Profile Details"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Transaction History Sub-Section */}
                        <Card className="rounded-[3rem] border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                            <CardHeader className="p-10 bg-white border-b border-slate-50">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl font-black uppercase tracking-tight italic">Transaction Ledger</CardTitle>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full financial audit log</p>
                                    </div>
                                    <Badge variant="outline" className="px-4 py-1 text-xs font-mono">{transactions.length} LOGS</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50/50 border-none px-10">
                                                <TableHead className="py-4 pl-10 text-[9px] font-black uppercase tracking-widest text-slate-400">Date/Time</TableHead>
                                                <TableHead className="py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Activity</TableHead>
                                                <TableHead className="py-4 text-right text-[9px] font-black uppercase tracking-widest text-slate-400">Amount</TableHead>
                                                <TableHead className="py-4 pr-10 pl-10 text-[9px] font-black uppercase tracking-widest text-slate-400">Reference</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {transactions.length === 0 ? (
                                                <TableRow><TableCell colSpan={4} className="text-center py-20 text-slate-400 italic font-medium">No financial movements recorded.</TableCell></TableRow>
                                            ) : (
                                                transactions.map((tx) => (
                                                    <TableRow key={tx._id} className="hover:bg-slate-50 transition-colors border-b border-slate-50">
                                                        <TableCell className="py-6 pl-10">
                                                            <div className="flex items-center gap-3">
                                                                <div className={cn(
                                                                    "h-2 w-2 rounded-full",
                                                                    tx.type === 'topup' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                                                                )} />
                                                                <span className="text-[11px] font-bold font-mono text-slate-500">{new Date(tx.created_at).toLocaleString()}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-6">
                                                            <Badge className={cn(
                                                                "h-6 px-3 rounded-lg text-[9px] font-black uppercase border-none",
                                                                tx.type === 'topup' ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                                                            )}>
                                                                {tx.type === 'topup' ? 'Credit' : 'Debit'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className={cn(
                                                            "py-6 text-right font-black italic tracking-tighter text-lg",
                                                            tx.type === 'topup' ? "text-emerald-600" : "text-rose-600"
                                                        )}>
                                                            {tx.type === 'topup' ? '+' : '-'}{tx.amount.toLocaleString()} <span className="text-[10px] opacity-60">Br.</span>
                                                        </TableCell>
                                                        <TableCell className="py-6 pr-10 pl-10">
                                                            <p className="text-xs font-bold text-slate-900 leading-tight">{tx.description || tx.reason || "System Update"}</p>
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

                    {/* Right Column: Financial Console & Activity */}
                    <div className="space-y-8">
                        
                        {/* Financial Hub */}
                        <Card className="rounded-[3rem] border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden sticky top-32">
                            <CardHeader className="p-10 bg-slate-950 text-white">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <Wallet className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-2xl font-black uppercase italic tracking-tight">Finance Console</CardTitle>
                                    </div>
                                    <CardDescription className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Adjust Advertiser Budget Limits</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 space-y-8">
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Current Pool</p>
                                    <p className="text-5xl font-black italic tracking-tighter text-slate-950">{(marketer.remaining_budget || 0).toLocaleString()} <span className="text-sm opacity-40">Br.</span></p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex p-2 bg-slate-50 rounded-2xl border border-slate-100">
                                        <Button 
                                            variant="ghost" 
                                            onClick={() => setType('topup')}
                                            className={cn("flex-1 rounded-xl h-12 font-black uppercase tracking-widest text-[10px] transition-all", type === 'topup' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400")}
                                        >
                                            Deposit
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            onClick={() => setType('deduction')}
                                            className={cn("flex-1 rounded-xl h-12 font-black uppercase tracking-widest text-[10px] transition-all", type === 'deduction' ? "bg-white text-rose-600 shadow-sm" : "text-slate-400")}
                                        >
                                            Withdraw
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black uppercase tracking-widest text-slate-500 pl-1">Amount to Transfer</Label>
                                        <Input 
                                            type="number" 
                                            placeholder="0.00" 
                                            value={amount} 
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="h-16 rounded-2xl text-center text-2xl font-black tracking-tighter border-slate-100 bg-slate-50 shadow-inner"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black uppercase tracking-widest text-slate-500 pl-1">Reference Reason</Label>
                                        <Input 
                                            placeholder="System correction..." 
                                            value={description} 
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="h-12 rounded-xl bg-slate-50 border-slate-100 text-sm font-semibold"
                                        />
                                    </div>

                                    <Button 
                                        disabled={saving || !amount} 
                                        onClick={handleBudgetAction}
                                        className={cn(
                                            "w-full h-16 rounded-[1.5rem] font-black uppercase tracking-widest italic shadow-xl transition-all active:scale-[0.98]",
                                            type === 'topup' ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-rose-600 hover:bg-rose-700 text-white"
                                        )}
                                    >
                                        {saving ? "Syncing..." : type === 'topup' ? "Deposit Funds" : "Execute Withdrawal"}
                                    </Button>
                                </div>

                                <Separator className="bg-slate-50" />

                                <div className="space-y-4">
                                     <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic flex items-center gap-2">
                                         <Activity className="h-4 w-4 text-primary" /> Key Performance
                                     </h4>
                                     <div className="grid grid-cols-2 gap-4">
                                         <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">ADS SUBMITTED</p>
                                             <p className="text-2xl font-black italic tracking-tighter text-slate-950">{marketer.total_ads || 0}</p>
                                         </div>
                                         <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">ENGAGEMENT</p>
                                             <p className="text-2xl font-black italic tracking-tighter text-slate-950">High</p>
                                         </div>
                                     </div>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
