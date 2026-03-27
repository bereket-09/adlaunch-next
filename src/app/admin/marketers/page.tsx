"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import {
    Users,
    Search,
    Plus,
    MoreHorizontal,
    Mail,
    Calendar,
    Ban,
    CheckCircle,
    Edit2,
    Wallet,
    History,
    DollarSign,
    Building2,
    TrendingUp,
    ShieldCheck,
    ArrowUpRight,
    ChevronRight,
    SearchCode,
    Globe,
    ExternalLink
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { marketerAPI, budgetAPI, Marketer, Transaction } from "@/services/api";
import KPICard from "@/components/analytics/KPICard";

export default function AdminMarketersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [marketers, setMarketers] = useState<Marketer[]>([]);
    const [loading, setLoading] = useState(true);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newMarketer, setNewMarketer] = useState({
        name: "",
        email: "",
        password: "",
        total_budget: "",
        contact_info: "",
    });

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingMarketer, setEditingMarketer] = useState<Marketer | null>(null);

    const [isTopupOpen, setIsTopupOpen] = useState(false);
    const [topupData, setTopupData] = useState({
        marketerId: "",
        amount: "",
        payment_method: "credit_card",
        description: "",
    });

    const [isDeductOpen, setIsDeductOpen] = useState(false);
    const [deductData, setDeductData] = useState({
        marketerId: "",
        amount: "",
        reason: "",
        description: "",
    });

    const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedMarketerName, setSelectedMarketerName] = useState("");
    const [isKYCOpen, setIsKYCOpen] = useState(false);
    const [kycMarketer, setKycMarketer] = useState<Marketer | null>(null);

    const { toast } = useToast();

    useEffect(() => {
        fetchMarketers();
    }, []);

    const fetchMarketers = async () => {
        try {
            setLoading(true);
            const response = await marketerAPI.list();
            if (response.status) {
                setMarketers(response.marketers);
            }
        } catch (error) {
            console.error('Error fetching marketers:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredMarketers = marketers.filter(
        (m) =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateMarketer = async () => {
        try {
            const response = await marketerAPI.create({
                name: newMarketer.name,
                email: newMarketer.email,
                password: newMarketer.password,
                total_budget: parseFloat(newMarketer.total_budget) || 0,
                contact_info: newMarketer.contact_info || newMarketer.email,
                status: "pendingPassChange",
            });

            if (response.status) {
                toast({
                    title: "Marketer Created",
                    description: `${newMarketer.name} has been successfully added.`,
                });
                setIsCreateOpen(false);
                setNewMarketer({ name: "", email: "", password: "", total_budget: "", contact_info: "" });
                fetchMarketers();
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to create marketer.", variant: "destructive" });
        }
    };

    const handleUpdateMarketer = async () => {
        if (!editingMarketer) return;
        try {
            const response = await marketerAPI.update(editingMarketer._id, {
                name: editingMarketer.name,
                email: editingMarketer.email,
                total_budget: editingMarketer.total_budget,
                contact_info: editingMarketer.contact_info,
                status: editingMarketer.status,
            });
            if (response.status) {
                toast({ title: "Marketer Updated", description: "Account details have been saved." });
                setIsEditOpen(false);
                setEditingMarketer(null);
                fetchMarketers();
            }
        } catch (error) {
            toast({ title: "Sync Failure", description: "Failed to update marketer.", variant: "destructive" });
        }
    };

    const handleTopup = async () => {
        try {
            const response = await budgetAPI.topup({
                marketerId: topupData.marketerId,
                amount: parseFloat(topupData.amount),
                payment_method: topupData.payment_method,
                description: topupData.description,
            });
            if (response.status) {
                toast({ title: "Funds Added", description: `${topupData.amount} Br added to account.` });
                setIsTopupOpen(false);
                setTopupData({ marketerId: "", amount: "", payment_method: "credit_card", description: "" });
                fetchMarketers();
            }
        } catch (error) {
            toast({ title: "Failed", description: "Could not add funds.", variant: "destructive" });
        }
    };

    const handleDeduct = async () => {
        try {
            const response = await budgetAPI.deduct({
                marketerId: deductData.marketerId,
                amount: parseFloat(deductData.amount),
                reason: deductData.reason,
                description: deductData.description,
            });
            if (response.status) {
                toast({ title: "Funds Deducted", description: `${deductData.amount} Br deducted from account.` });
                setIsDeductOpen(false);
                setDeductData({ marketerId: "", amount: "", reason: "", description: "" });
                fetchMarketers();
            }
        } catch (error) {
            toast({ title: "Failed", description: "Could not deduct funds.", variant: "destructive" });
        }
    };

    const handleViewTransactions = async (marketer: Marketer) => {
        setSelectedMarketerName(marketer.name);
        try {
            const response = await budgetAPI.getTransactions(marketer._id);
            if (response.status) setTransactions(response.transactions);
        } catch (error) {
            setTransactions([]);
        }
        setIsTransactionsOpen(true);
    };

    const handleToggleStatus = async (marketer: Marketer) => {
        const newStatus = marketer.status === "active" ? "deactivated" : "active";
        try {
            await marketerAPI.update(marketer._id, { status: newStatus });
            toast({ title: newStatus === "active" ? "Account Activated" : "Account Suspended" });
            fetchMarketers();
        } catch (error) {
            toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
        }
    };

    const handleApprove = async (id: string) => {
        try {
            const comments = (kycMarketer?._id === id) ? kycMarketer.admin_comments : "";
            await marketerAPI.update(id, { 
                status: "active", 
                kyc_status: "verified",
                admin_comments: comments 
            });
            toast({ title: "Application Approved", description: "Marketer account is now active." });
            fetchMarketers();
        } catch (error) {
            toast({ title: "Error", description: "Failed to approve.", variant: "destructive" });
        }
    };

    const handleReject = async (id: string) => {
        try {
            const comments = (kycMarketer?._id === id) ? kycMarketer.admin_comments : "";
            await marketerAPI.update(id, { 
                status: "rejected",
                kyc_status: "rejected", 
                admin_comments: comments 
            });
            toast({ title: "Application Rejected" });
            fetchMarketers();
        } catch (error) {
            toast({ title: "Error", description: "Failed to reject.", variant: "destructive" });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active": return <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-bold">ACTIVE</Badge>;
            case "deactivated": return <Badge variant="secondary" className="bg-rose-500/10 text-rose-600 border-none font-bold">INACTIVE</Badge>;
            case "pending": return <Badge className="bg-amber-500/10 text-amber-600 border-none font-bold">PENDING APPROVAL</Badge>;
            case "rejected": return <Badge className="bg-rose-500/10 text-rose-600 border-none font-bold text-xs">REJECTED</Badge>;
            case "pendingPassChange": return <Badge className="bg-amber-500/10 text-amber-600 border-none font-bold">ONBOARDING</Badge>;
            default: return <Badge variant="secondary" className="font-bold">{status?.toUpperCase() || ""}</Badge>;
        }
    };

    const totalPortfolioBudget = marketers.reduce((acc, current) => acc + current.remaining_budget, 0);

    return (
        <AdminLayout title="Marketer Management">
            <div className="space-y-6 animate-in fade-in duration-500">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            Advertiser Accounts
                            <Badge className="bg-primary/10 text-primary border-none font-bold py-0.5 px-2 text-[10px]">LIVE</Badge>
                        </h1>
                        <p className="text-muted-foreground text-sm">Manage advertiser permissions, credit limits, and account status.</p>
                    </div>
                </div>

                {/* KPI Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard title="Total Portfolio Balance" value={`${totalPortfolioBudget.toLocaleString()} Br.`} icon={Wallet} trend="up" change={5.2} />
                    <KPICard title="Active Accounts" value={marketers.filter(m => m.status === 'active').length} icon={ShieldCheck} trend="neutral" />
                    <KPICard title="New Requests" value={marketers.filter(m => m.status === 'pending').length.toString()} icon={Users} trend="up" />
                    <KPICard title="Avg. Balance" value={`${(totalPortfolioBudget / (marketers.length || 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })} Br.`} icon={TrendingUp} trend="neutral" />
                </div>

                {/* Control Bar */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-background/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-sm">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search marketers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-10 rounded-xl bg-secondary/20 border-border/50 text-sm"
                        />
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)} className="h-10 px-6 rounded-xl font-bold gap-2">
                        <Plus className="h-4 w-4" /> Add Marketer
                    </Button>
                </div>

                {/* Main Directory Table */}
                <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                    <CardHeader className="border-b border-border/50 bg-secondary/10 py-4 px-6 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-bold">Marketer Accounts</CardTitle>
                        <Badge variant="outline" className="font-mono text-xs px-3 py-1 bg-background">
                            {filteredMarketers.length} TOTAL
                        </Badge>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-secondary/5 border-none">
                                        <TableHead className="py-3 pl-6 uppercase text-[10px] font-bold text-muted-foreground">Name & Contact</TableHead>
                                        <TableHead className="py-3 uppercase text-[10px] font-bold text-muted-foreground text-center">Status</TableHead>
                                        <TableHead className="py-3 uppercase text-[10px] font-bold text-muted-foreground text-right border-x border-border/10">Balance</TableHead>
                                        <TableHead className="py-3 uppercase text-[10px] font-bold text-muted-foreground text-right">Total Limit</TableHead>
                                        <TableHead className="py-3 pr-6 text-right uppercase text-[10px] font-bold text-muted-foreground">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow><TableCell colSpan={5} className="text-center py-16 text-muted-foreground italic text-sm">Loading accounts...</TableCell></TableRow>
                                    ) : (
                                        filteredMarketers.map((marketer) => (
                                            <TableRow key={marketer._id} className="hover:bg-secondary/10 transition-colors border-b border-border/50">
                                                <TableCell className="py-4 pl-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                                            <Building2 className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-foreground text-sm leading-tight">{marketer.name}</p>
                                                            <p className="text-[11px] text-muted-foreground font-medium mt-0.5 flex items-center gap-1">
                                                                <Mail className="h-3 w-3" /> {marketer.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 text-center">{getStatusBadge(marketer.status)}</TableCell>
                                                <TableCell className="py-4 text-right font-mono text-sm font-bold text-primary bg-primary/[0.02] border-x border-border/10">
                                                    {marketer.remaining_budget.toLocaleString()} <span className="text-[10px] opacity-60">Br.</span>
                                                </TableCell>
                                                <TableCell className="py-4 text-right font-mono text-xs text-muted-foreground">
                                                    {marketer.total_budget.toLocaleString()} <span className="text-[10px] opacity-60">MAX</span>
                                                </TableCell>
                                                <TableCell className="py-4 pr-6 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border border-border/50 shadow-xl bg-background/95 backdrop-blur-md">
                                                            <DropdownMenuItem className="rounded-lg py-2 cursor-pointer text-sm font-semibold" onClick={() => { setEditingMarketer(marketer); setIsEditOpen(true); }}>
                                                                <Edit2 className="h-4 w-4 mr-2" /> Edit Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator className="my-1" />
                                                            <DropdownMenuItem className="rounded-lg py-2 text-emerald-600 font-bold cursor-pointer text-sm" onClick={() => { setTopupData({ ...topupData, marketerId: marketer._id }); setIsTopupOpen(true); }}>
                                                                <Wallet className="h-4 w-4 mr-2" /> Add Balance
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="rounded-lg py-2 text-amber-600 font-bold cursor-pointer text-sm" onClick={() => { setDeductData({ ...deductData, marketerId: marketer._id }); setIsDeductOpen(true); }}>
                                                                <DollarSign className="h-4 w-4 mr-2" /> Deduct Funds
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="rounded-lg py-2 cursor-pointer text-sm font-semibold" onClick={() => handleViewTransactions(marketer)}>
                                                                <History className="h-4 w-4 mr-2" /> Transaction History
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator className="my-1" />
                                                            {marketer.status === 'pending' && (
                                                                <>
                                                                    <DropdownMenuItem className="rounded-lg py-2 text-emerald-600 font-bold cursor-pointer text-sm" onClick={() => handleApprove(marketer._id)}>
                                                                        <CheckCircle className="h-4 w-4 mr-2" /> Approve Application
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem className="rounded-lg py-2 text-rose-600 font-bold cursor-pointer text-sm" onClick={() => handleReject(marketer._id)}>
                                                                        <Ban className="h-4 w-4 mr-2" /> Reject Application
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator className="my-1" />
                                                                </>
                                                            )}
                                                            <DropdownMenuItem className="rounded-lg py-2 cursor-pointer text-sm font-semibold" onClick={() => { setKycMarketer(marketer); setIsKYCOpen(true); }}>
                                                                <SearchCode className="h-4 w-4 mr-2" /> View KYC Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator className="my-1" />
                                                            <DropdownMenuItem className="rounded-lg py-2 text-destructive font-bold cursor-pointer text-sm" onClick={() => handleToggleStatus(marketer)}>
                                                                {marketer.status === "active" ? <><Ban className="h-4 w-4 mr-2" /> Deactivate Account</> : <><CheckCircle className="h-4 w-4 mr-2" /> Activate Account</>}
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

                {/* Modals Refined */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-lg rounded-2xl border border-border/50 bg-background p-6 shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <Plus className="h-5 w-5 text-primary" /> Create Marketer Account
                            </DialogTitle>
                            <DialogDescription className="text-sm">Initiate a new advertiser account with initial budget allocation.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-muted-foreground ml-1">Agency Name</Label>
                                <Input placeholder="e.g. Media Force Ltd." value={newMarketer.name} onChange={(e) => setNewMarketer({ ...newMarketer, name: e.target.value })} className="h-11 rounded-xl bg-secondary/10 border-border/50 font-semibold" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground ml-1">Email Address</Label>
                                    <Input type="email" placeholder="admin@agency.com" value={newMarketer.email} onChange={(e) => setNewMarketer({ ...newMarketer, email: e.target.value })} className="h-11 rounded-xl bg-secondary/10 border-border/50 font-semibold" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground ml-1">Password</Label>
                                    <Input type="password" value={newMarketer.password} onChange={(e) => setNewMarketer({ ...newMarketer, password: e.target.value })} className="h-11 rounded-xl bg-secondary/10 border-border/50 font-semibold" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-muted-foreground ml-1">Initial Budget (Br.)</Label>
                                <div className="relative">
                                    <Input type="number" placeholder="50,000" value={newMarketer.total_budget} onChange={(e) => setNewMarketer({ ...newMarketer, total_budget: e.target.value })} className="h-12 rounded-xl bg-secondary/10 border-border/50 pl-10 font-bold text-lg" />
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="h-11 rounded-xl border-border/50 font-bold px-6">Cancel</Button>
                            <Button onClick={handleCreateMarketer} className="h-11 rounded-xl px-8 font-bold">Create Account</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Modal */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="sm:max-w-md rounded-2xl border border-border/50 bg-background p-6 shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold">Edit Account Details</DialogTitle>
                        </DialogHeader>
                        {editingMarketer && (
                            <div className="space-y-4 py-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-muted-foreground">Marketer Name</Label>
                                    <Input value={editingMarketer.name} onChange={(e) => setEditingMarketer({ ...editingMarketer, name: e.target.value })} className="h-11 rounded-xl" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-muted-foreground">Email Address</Label>
                                    <Input type="email" value={editingMarketer.email} onChange={(e) => setEditingMarketer({ ...editingMarketer, email: e.target.value })} className="h-11 rounded-xl" />
                                </div>
                            </div>
                        )}
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsEditOpen(false)} className="h-11 rounded-xl font-bold">Cancel</Button>
                            <Button onClick={handleUpdateMarketer} className="h-11 rounded-xl px-6 font-bold">Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Transactions History Modal */}
                <Dialog open={isTransactionsOpen} onOpenChange={setIsTransactionsOpen}>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col p-0 rounded-2xl border border-border/50 shadow-3xl">
                        <div className="p-6 bg-secondary/10 border-b border-border/50">
                            <DialogHeader>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <DialogTitle className="text-xl font-bold">Transaction History</DialogTitle>
                                        <DialogDescription className="text-xs font-medium text-muted-foreground">
                                            Financial logs for <span className="text-foreground font-bold">{selectedMarketerName}</span>
                                        </DialogDescription>
                                    </div>
                                    <Badge variant="outline" className="font-mono text-xs px-3 py-1 bg-background">{transactions.length} LOGS</Badge>
                                </div>
                            </DialogHeader>
                        </div>
                        <div className="flex-1 overflow-y-auto p-0">
                            <Table>
                                <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                                    <TableRow className="bg-secondary/5 border-none">
                                        <TableHead className="py-3 pl-6 text-[10px] font-bold uppercase text-muted-foreground">Timestamp</TableHead>
                                        <TableHead className="py-3 text-[10px] font-bold uppercase text-muted-foreground">Type</TableHead>
                                        <TableHead className="py-3 text-right text-[10px] font-bold uppercase text-muted-foreground">Amount</TableHead>
                                        <TableHead className="py-3 pr-6 text-[10px] font-bold uppercase text-muted-foreground pl-10">Description</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.length === 0 ? (
                                        <TableRow><TableCell colSpan={4} className="text-center py-20 text-muted-foreground text-sm italic">No transaction records found.</TableCell></TableRow>
                                    ) : (
                                        transactions.map((tx) => (
                                            <TableRow key={tx._id} className="hover:bg-secondary/5 transition-colors border-b border-border/50">
                                                <TableCell className="py-4 pl-6 text-[11px] font-bold font-mono text-muted-foreground">
                                                    {new Date(tx.created_at).toLocaleString()}
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <Badge className={`font-bold text-[9px] px-2 py-0 ${tx.type === 'topup' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                                                        {tx.type === 'topup' ? 'CREDIT' : 'DEBIT'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className={`py-4 text-right font-mono text-sm font-bold ${tx.type === 'topup' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {tx.type === 'topup' ? '+' : '-'}{tx.amount.toLocaleString()} <span className="text-[10px] opacity-60">Br.</span>
                                                </TableCell>
                                                <TableCell className="py-4 pr-6 pl-10">
                                                    <p className="text-xs font-semibold text-foreground/80">{tx.description || tx.reason || 'System adjustment'}</p>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="p-4 bg-secondary/10 border-t border-border/50 text-right">
                            <Button variant="outline" onClick={() => setIsTransactionsOpen(false)} className="rounded-xl h-9 px-6 font-bold text-xs border-border/50 shadow-sm bg-background">Close</Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Top-up Modal */}
                <Dialog open={isTopupOpen} onOpenChange={setIsTopupOpen}>
                    <DialogContent className="sm:max-w-md rounded-2xl border border-border/50 bg-background p-8 shadow-3xl">
                        <DialogHeader className="items-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 border border-emerald-100">
                                <Wallet className="h-8 w-8" />
                            </div>
                            <DialogTitle className="text-2xl font-bold text-emerald-600">Add Balance</DialogTitle>
                            <DialogDescription className="text-sm font-medium">Add infrastructure credits to this account.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-5 py-6">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-muted-foreground ml-1">Amount (Br.)</Label>
                                <Input type="number" placeholder="0.00" value={topupData.amount} onChange={(e) => setTopupData({ ...topupData, amount: e.target.value })} className="h-14 rounded-xl text-center text-2xl font-bold text-emerald-600 bg-emerald-50/30 border-emerald-100" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-muted-foreground ml-1">Reference / Note</Label>
                                <Input placeholder="Internal memo..." value={topupData.description} onChange={(e) => setTopupData({ ...topupData, description: e.target.value })} className="h-11 rounded-xl" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleTopup} className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-lg shadow-lg shadow-emerald-200">Confirm Deposit</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Deduct Modal */}
                <Dialog open={isDeductOpen} onOpenChange={setIsDeductOpen}>
                    <DialogContent className="sm:max-w-md rounded-2xl border border-border/50 bg-background p-8 shadow-3xl">
                        <DialogHeader className="items-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 mb-4 border border-rose-100">
                                <DollarSign className="h-8 w-8" />
                            </div>
                            <DialogTitle className="text-2xl font-bold text-rose-600">Deduct Balance</DialogTitle>
                            <DialogDescription className="text-sm font-medium">Remove funds from this account balance.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-5 py-6">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-muted-foreground ml-1">Amount (Br.)</Label>
                                <Input type="number" placeholder="0.00" value={deductData.amount} onChange={(e) => setDeductData({ ...deductData, amount: e.target.value })} className="h-14 rounded-xl text-center text-2xl font-bold text-rose-600 bg-rose-50/30 border-rose-100" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-muted-foreground ml-1">Reason for Deduction</Label>
                                <Input placeholder="Ref: Correction or fee..." value={deductData.reason} onChange={(e) => setDeductData({ ...deductData, reason: e.target.value })} className="h-11 rounded-xl" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="destructive" onClick={handleDeduct} className="w-full h-12 rounded-xl font-bold text-lg shadow-lg shadow-rose-200">Confirm Deduction</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* KYC Details Modal - Enhanced with Edit & Feedback */}
                <Dialog open={isKYCOpen} onOpenChange={setIsKYCOpen}>
                    <DialogContent className="sm:max-w-2xl rounded-2xl border border-border/50 bg-background p-0 overflow-hidden shadow-3xl">
                        <div className="p-6 bg-primary/10 border-b border-border/50">
                            <DialogHeader>
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                                            <SearchCode className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <DialogTitle className="text-xl font-bold italic uppercase tracking-tight">Compliance Editor</DialogTitle>
                                            <DialogDescription className="text-xs font-bold text-primary/70 uppercase">Verify & Manage Business Identity</DialogDescription>
                                        </div>
                                    </div>
                                    {kycMarketer && getStatusBadge(kycMarketer.status)}
                                </div>
                            </DialogHeader>
                        </div>

                        {kycMarketer && (
                            <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Marketer Display Name</Label>
                                        <Input 
                                            value={kycMarketer.name} 
                                            onChange={(e) => setKycMarketer({...kycMarketer, name: e.target.value})}
                                            className="h-10 rounded-xl bg-secondary/10 border-border/50 font-bold"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Primary Email</Label>
                                        <Input 
                                            value={kycMarketer.email} 
                                            disabled
                                            className="h-10 rounded-xl bg-secondary/5 border-border/50 font-medium opacity-70"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Legal Company Entity</Label>
                                        <Input 
                                            value={kycMarketer.company_name || ""} 
                                            onChange={(e) => setKycMarketer({...kycMarketer, company_name: e.target.value})}
                                            className="h-10 rounded-xl bg-secondary/10 border-border/50 font-bold"
                                            placeholder="Not provided"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Registration Number</Label>
                                        <Input 
                                            value={kycMarketer.business_reg_number || ""} 
                                            onChange={(e) => setKycMarketer({...kycMarketer, business_reg_number: e.target.value})}
                                            className="h-10 rounded-xl bg-secondary/10 border-border/50 font-mono font-bold"
                                            placeholder="N/A"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Business Address</Label>
                                    <Input 
                                        value={kycMarketer.business_address || ""} 
                                        onChange={(e) => setKycMarketer({...kycMarketer, business_address: e.target.value})}
                                        className="h-10 rounded-xl bg-secondary/10 border-border/50 font-medium"
                                        placeholder="Full business location..."
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Admin Feedback / Correction Comments</Label>
                                    <textarea 
                                        value={kycMarketer.admin_comments || ""} 
                                        onChange={(e) => setKycMarketer({...kycMarketer, admin_comments: e.target.value})}
                                        placeholder="Add instructions or reasons for rejection/update request..."
                                        className="w-full min-h-[100px] p-4 bg-amber-50/30 border border-amber-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-amber-900/30"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-border/50">
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all"
                                        onClick={() => {
                                            handleReject(kycMarketer._id);
                                            setIsKYCOpen(false);
                                        }}
                                    >
                                        Reject & Block
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] bg-secondary border border-border/60"
                                        onClick={async () => {
                                            await marketerAPI.update(kycMarketer._id, { 
                                                ...kycMarketer,
                                                kyc_status: 'rejected' // Request Update state
                                            });
                                            toast({ title: "Update Requested", description: "Comments sent to advertiser." });
                                            setIsKYCOpen(false);
                                            fetchMarketers();
                                        }}
                                    >
                                        Request Fixes
                                    </Button>
                                    <Button
                                        className="flex-2 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
                                        onClick={() => {
                                            handleApprove(kycMarketer._id);
                                            setIsKYCOpen(false);
                                        }}
                                    >
                                        Final Approval
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="p-4 bg-secondary/10 border-t border-border/50 text-center">
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Compliance Lifecycle Management System</p>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
