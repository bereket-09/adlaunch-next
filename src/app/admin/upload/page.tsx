"use client";

import { useState, useEffect } from "react";
import {
    CloudUpload, FileVideo, CheckCircle, Image as ImageIcon,
    Link as LinkIcon, Zap, DollarSign, Calendar, Info, Film, X,
    Users, Target, Sparkles, ChevronRight, ArrowLeft
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { adAPI, marketerAPI, AdCreateRequest, Marketer, billingModelAPI } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const FieldGroup = ({ label, children, required, hint }: { label: string; children: React.ReactNode; required?: boolean; hint?: string }) => (
    <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-slate-900">
            <Label className="text-[10px] font-black uppercase tracking-widest pl-1">
                {label}{required && <span className="text-primary ml-0.5">*</span>}
            </Label>
            {hint && (
                <span className="text-[8px] font-bold text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded uppercase tracking-tighter">{hint}</span>
            )}
        </div>
        {children}
    </div>
);

export default function AdminUploadPage() {
    const [marketers, setMarketers] = useState<Marketer[]>([]);
    const [selectedMarketerId, setSelectedMarketerId] = useState("");
    const [selectedMarketer, setSelectedMarketer] = useState<Marketer | null>(null);
    const [campaignName, setCampaignName] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [ctaText, setCtaText] = useState("");
    const [ctaLink, setCtaLink] = useState("");
    const [billingModelId, setBillingModelId] = useState("");
    const [billingModels, setBillingModels] = useState<any[]>([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [rewardDescription, setRewardDescription] = useState("+ 50 GOLD");
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [loadingMarketers, setLoadingMarketers] = useState(true);

    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        fetchMarketers();
        fetchBillingModels();
    }, []);

    useEffect(() => {
        if (selectedMarketerId) {
            const m = marketers.find(marketer => marketer._id === selectedMarketerId);
            setSelectedMarketer(m || null);
        } else {
            setSelectedMarketer(null);
        }
    }, [selectedMarketerId, marketers]);

    const fetchMarketers = async () => {
        try {
            setLoadingMarketers(true);
            const res = await marketerAPI.list();
            if (res.status) {
                // Only active marketers can launch campaigns
                setMarketers(res.marketers.filter(m => m.status === 'active'));
            }
        } catch (err) {
            console.error("Failed to load marketers", err);
        } finally {
            setLoadingMarketers(false);
        }
    };

    const fetchBillingModels = async () => {
        try {
            const res = await billingModelAPI.list();
            if (res.status) setBillingModels(res.models);
        } catch (err) {
            console.error("Failed to load billing models", err);
        }
    };

    const selectedModel = billingModels.find(m => m._id === billingModelId);

    const isValid = !!(selectedMarketerId && title && campaignName && billingModelId &&
        budget && parseFloat(budget) >= 100 && startDate && endDate && videoFile);

    const hasEnoughBudget = selectedMarketer ? selectedMarketer.remaining_budget >= parseFloat(budget || "0") : false;

    const validateImage = (file: File): Promise<boolean> =>
        new Promise((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const ok = img.width >= 1200 && img.height >= 300;
                if (!ok) toast({ title: "Image too small", description: "Banner must be at least 1200\u00d7300px.", variant: "destructive" });
                resolve(ok);
            };
            img.onerror = () => resolve(false);
        });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid || !videoFile) {
            toast({ title: "Validation Error", description: "Fill all required fields.", variant: "destructive" });
            return;
        }

        if (!hasEnoughBudget) {
            toast({ 
                title: "Insufficient Balance", 
                description: `Advertiser only has ${selectedMarketer?.remaining_budget.toLocaleString()} Br. remaining.`, 
                variant: "destructive" 
            });
            return;
        }

        if (bannerFile && !(await validateImage(bannerFile))) return;

        setIsUploading(true);

        try {
            const payload: AdCreateRequest = {
                marketer_id: selectedMarketerId,
                campaign_name: campaignName,
                title,
                cost_per_view: selectedModel?.cpv_rate || 0,
                cost_per_click: selectedModel?.cpc_rate || 0,
                budget_allocation: Number(budget),
                video_description: description,
                video_file: videoFile,
                banner_file: bannerFile || undefined,
                cta_text: ctaText,
                cta_link: ctaLink,
                payment_type: selectedModel?.slug || "standard",
                billing_model: selectedModel?.slug || "view_only",
                start_date: startDate,
                end_date: endDate,
                reward_description: rewardDescription,
            };

            const json = await adAPI.create(payload);

            if (!json.status) {
                throw new Error(json.error || "Failed to initiate campaign protocol");
            }

            toast({
                title: "\ud83c\udf89 Protocol Initiated",
                description: "The campaign asset has been successfully uploaded and authorized.",
            });

            router.push("/admin/campaigns");
        } catch (err: any) {
            toast({
                title: "Ingress Failure",
                description: err.message,
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <AdminLayout title="Upload Campaign">
            <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20 font-sans">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-[1.25rem] hover:bg-white/40 border-slate-200 shadow-sm" onClick={() => router.back()}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="space-y-1">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase flex items-center gap-3">
                                Campaign Ingress
                                <Badge className="bg-primary/10 text-primary border-primary/20 font-black py-0.5 px-2 text-[10px] uppercase">Proxy_Mode</Badge>
                            </h1>
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest opacity-60">Authorize and deploy ad assets on behalf of a partner</p>
                        </div>
                    </div>

                    {selectedMarketer && (
                         <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-[1.5rem] border border-white/5 animate-in slide-in-from-right-4">
                            <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">{selectedMarketer.company_name}</p>
                                <p className={cn(
                                    "text-lg font-black text-white tabular-nums italic",
                                    !hasEnoughBudget && "text-rose-500"
                                )}>
                                    {selectedMarketer.remaining_budget.toLocaleString()} Br.
                                </p>
                            </div>
                         </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Form Column */}
                    <div className="lg:col-span-2 space-y-10">
                        <form onSubmit={handleSubmit} className="space-y-10">
                            
                            {/* Advertiser Selection */}
                            <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-primary">
                                            <Users className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-black italic uppercase tracking-tighter">Partner Selection</CardTitle>
                                            <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Select the advertiser for this campaign</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <FieldGroup label="Active Advertiser Mapping" required>
                                        <Select value={selectedMarketerId} onValueChange={setSelectedMarketerId}>
                                            <SelectTrigger className="h-14 rounded-2xl bg-white border-slate-200 text-sm font-bold px-6 focus:ring-primary/20 transition-all">
                                                <SelectValue placeholder={loadingMarketers ? "Syncing Partners..." : "Select Target Partner"} />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-1 bg-white">
                                                {marketers.map((m) => (
                                                    <SelectItem key={m._id} value={m._id} className="rounded-xl py-3 text-sm font-bold focus:bg-slate-50">
                                                        <div className="flex flex-col">
                                                            <span>{m.company_name || m.name}</span>
                                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                                                Balance: {m.remaining_budget.toLocaleString()} Br.
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FieldGroup>
                                </CardContent>
                            </Card>

                            {/* Video Drop Zone */}
                            <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-primary">
                                            <Film className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-black italic uppercase tracking-tighter">Ad Asset</CardTitle>
                                            <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">High-definition video container</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div
                                        className={`relative border-2 border-dashed rounded-[2rem] p-12 text-center transition-all duration-300 cursor-pointer ${
                                            isDragging
                                                ? "border-primary bg-primary/5 scale-[1.01]"
                                                : videoFile
                                                    ? "border-emerald-400 bg-emerald-50/50"
                                                    : "border-slate-200 hover:border-primary/40 hover:bg-primary/[0.02]"
                                        }`}
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={(e) => {
                                            e.preventDefault(); setIsDragging(false);
                                            const file = e.dataTransfer.files[0];
                                            if (file?.type.startsWith("video/")) setVideoFile(file);
                                            else toast({ title: "Invalid Asset", description: "Unsupported video format.", variant: "destructive" });
                                        }}
                                    >
                                        {videoFile ? (
                                            <div className="flex flex-col items-center gap-6 animate-in zoom-in-95">
                                                <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center text-emerald-600 shadow-xl border border-emerald-200">
                                                    <CheckCircle className="h-10 w-10" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-lg font-black text-slate-900 tracking-tight italic uppercase">{videoFile.name}</p>
                                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">Payload: {(videoFile.size / 1024 / 1024).toFixed(1)} MB</p>
                                                </div>
                                                <Button type="button" variant="outline" size="sm" className="rounded-full h-10 px-6 font-black uppercase text-[10px] tracking-widest border-slate-200 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                                        onClick={() => setVideoFile(null)}>
                                                    Replace Asset
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="w-20 h-20 rounded-[2rem] mx-auto bg-white flex items-center justify-center shadow-xl border border-slate-100">
                                                    <CloudUpload className="h-10 w-10 text-primary" />
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="font-black text-slate-900 text-xl italic uppercase tracking-tighter">Drag Asset Here</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">MP4 / WebM \u2014 MAX 50MB</p>
                                                </div>
                                                <Input type="file" accept="video/*" className="hidden" id="video-upload"
                                                       onChange={(e) => { const f = e.target.files?.[0]; if (f) setVideoFile(f); }} />
                                                <Button type="button" variant="secondary" size="lg" className="rounded-full h-12 px-8 font-black uppercase tracking-widest text-[10px] shadow-lg active:scale-95" asChild>
                                                    <label htmlFor="video-upload" className="cursor-pointer">Sync from Local</label>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Campaign Specs */}
                            <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-primary">
                                            <Zap className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-black italic uppercase tracking-tighter">Campaign Specs</CardTitle>
                                            <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Internal and public metadata</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <FieldGroup label="System Registry Name" required hint="Internal only">
                                            <Input placeholder="SUMMER_REACH_2024" value={campaignName}
                                                   onChange={(e) => setCampaignName(e.target.value)}
                                                   className="h-14 rounded-2xl bg-white border-slate-200 focus:ring-primary/20 font-bold" />
                                        </FieldGroup>
                                        <FieldGroup label="Frontend Broadcast Title" required hint="Visible to users">
                                            <Input placeholder="Summer Collection Preview" value={title}
                                                   onChange={(e) => setTitle(e.target.value)}
                                                   className="h-14 rounded-2xl bg-white border-slate-200 focus:ring-primary/20 font-bold" />
                                        </FieldGroup>
                                    </div>
                                    <FieldGroup label="Operational Description">
                                        <Textarea placeholder="Define campaign objectives..." value={description}
                                                  onChange={(e) => setDescription(e.target.value)} rows={4}
                                                  className="rounded-2xl bg-white border-slate-200 focus:ring-primary/20 font-medium resize-none p-5" />
                                    </FieldGroup>
                                    <FieldGroup label="In-App Reward Value" hint="e.g. + 50 GOLD">
                                        <Input placeholder="+ 50 Gold or 100MB Data" value={rewardDescription}
                                               onChange={(e) => setRewardDescription(e.target.value)}
                                               className="h-14 rounded-2xl bg-white border-slate-200 focus:ring-primary/20 font-black italic" />
                                    </FieldGroup>
                                </CardContent>
                            </Card>

                            {/* Billing & Logic */}
                            <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-primary">
                                            <DollarSign className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-black italic uppercase tracking-tighter">Billing Architecture</CardTitle>
                                            <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Network rates and budget allocation</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-8">
                                    <FieldGroup label="Network Protocol (Billing Model)" required>
                                        <Select value={billingModelId} onValueChange={setBillingModelId}>
                                            <SelectTrigger className="h-14 rounded-2xl bg-white border-slate-200 font-bold px-6">
                                                <SelectValue placeholder="Choose Network Rate Model" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl bg-white p-1">
                                                {billingModels.map(m => (
                                                    <SelectItem key={m._id} value={m._id} className="rounded-xl py-3 px-4 focus:bg-slate-50">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="font-bold text-sm">{m.name}</span>
                                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                                                {m.cpv_rate} Br./view {m.cpc_rate > 0 ? `+ ${m.cpc_rate} Br./click` : ''}
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FieldGroup>

                                    {selectedModel && (
                                        <div className="animate-in fade-in slide-in-from-top-2 p-6 rounded-[2rem] bg-primary/[0.03] border border-primary/20 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <h4 className="text-lg font-black text-slate-900 tracking-tighter italic uppercase">{selectedModel.name}</h4>
                                                    <p className="text-xs text-slate-500 font-medium">{selectedModel.description}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-black text-primary tabular-nums italic leading-none">{selectedModel.cpv_rate} Br.</p>
                                                    <p className="text-[8px] font-black text-primary opacity-60 uppercase tracking-widest">per_view</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                {selectedModel.features?.has_video && <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold text-[9px] px-2 py-0.5 uppercase">Video_Auth</Badge>}
                                                {selectedModel.features?.has_banner && <Badge className="bg-blue-50 text-blue-600 border-blue-100 font-bold text-[9px] px-2 py-0.5 uppercase">Banner_Auth</Badge>}
                                                {selectedModel.features?.has_cta && <Badge className="bg-orange-50 text-orange-600 border-orange-100 font-bold text-[9px] px-2 py-0.5 uppercase">CTA_Auth</Badge>}
                                            </div>
                                        </div>
                                    )}

                                    <FieldGroup label="Total Budget Allocation (ETB)" required hint="Min. 100 ETB">
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-lg font-black text-slate-300 group-focus-within:text-primary transition-colors italic">Br.</div>
                                            <Input type="number" placeholder="100.00" value={budget}
                                                   onChange={(e) => setBudget(e.target.value)}
                                                   className={cn(
                                                       "h-20 rounded-[2rem] bg-white border-slate-200 pl-16 pr-8 text-3xl font-black italic focus:ring-primary/10 transition-all",
                                                       !hasEnoughBudget && selectedMarketer && "border-rose-500 bg-rose-50/10 text-rose-600"
                                                   )} />
                                            {!hasEnoughBudget && selectedMarketer && (
                                                <div className="absolute top-full left-4 mt-2 flex items-center gap-2 text-rose-500 animate-pulse">
                                                    <Info className="h-3 w-3" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest italic">Exceeds Partner Balance</span>
                                                </div>
                                            )}
                                        </div>
                                        {budget && parseFloat(budget) >= 100 && selectedModel && (
                                            <div className="flex items-center gap-2 pt-1 pl-4 opacity-60 font-black italic">
                                                <Target className="h-3 w-3 text-slate-400" />
                                                <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em]">
                                                    Reach Limit: \u2248 {Math.floor(parseFloat(budget) / selectedModel.cpv_rate).toLocaleString()} Total Views
                                                </p>
                                            </div>
                                        )}
                                    </FieldGroup>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                        <FieldGroup label="Release Date" required>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 pointer-events-none" />
                                                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                                                       className="h-14 rounded-2xl bg-white border-slate-200 pl-12 font-bold" />
                                            </div>
                                        </FieldGroup>
                                        <FieldGroup label="Expiration Date" required>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 pointer-events-none" />
                                                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                                                       className="h-14 rounded-2xl bg-white border-slate-200 pl-12 font-bold" />
                                            </div>
                                        </FieldGroup>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Banner Selection */}
                            {selectedModel?.features?.has_banner && (
                                <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl overflow-hidden animate-in slide-in-from-bottom-4">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-primary">
                                                <ImageIcon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-black italic uppercase tracking-tighter">Display Banner</CardTitle>
                                                <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Wide-format marketing asset</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className={`border-2 border-dashed rounded-[2rem] p-10 transition-all ${bannerFile ? "border-emerald-400 bg-emerald-50/30" : "border-slate-200 hover:border-primary/40"}`}>
                                            {bannerFile ? (
                                                <div className="flex items-center justify-between gap-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg">
                                                            <ImageIcon className="h-6 w-6 text-emerald-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-900 truncate max-w-[250px] italic uppercase">{bannerFile.name}</p>
                                                            <p className="text-[9px] font-black text-slate-400 tracking-[0.1em] uppercase">SIZE: {(bannerFile.size / 1024).toFixed(0)} KB</p>
                                                        </div>
                                                    </div>
                                                    <Button type="button" variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-rose-50 text-rose-500"
                                                            onClick={() => setBannerFile(null)}><X className="h-5 w-5" /></Button>
                                                </div>
                                            ) : (
                                                <div className="text-center space-y-6">
                                                    <div className="w-14 h-14 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-lg border border-slate-50">
                                                        <CloudUpload className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <input type="file" accept="image/*" className="hidden" id="banner-upload"
                                                               onChange={(e) => setBannerFile(e.target.files?.[0] || null)} />
                                                        <label htmlFor="banner-upload" className="cursor-pointer group">
                                                            <p className="font-black text-slate-900 text-lg italic uppercase tracking-tighter group-hover:text-primary transition-colors">Select Banner Asset</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">MIN 1200\u00d7300px</p>
                                                        </label>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* CTA Injection */}
                            {selectedModel?.features?.has_cta && (
                                <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl overflow-hidden animate-in slide-in-from-bottom-4">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-primary">
                                                <LinkIcon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-black italic uppercase tracking-tighter">CTA Injection</CardTitle>
                                                <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">In-video interaction points</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <FieldGroup label="Interaction Label" required>
                                            <Input placeholder="e.g. SHOP NOW" value={ctaText} onChange={(e) => setCtaText(e.target.value)}
                                                   className="h-14 rounded-2xl bg-white border-slate-200 font-black italic" />
                                        </FieldGroup>
                                        <FieldGroup label="Destination Protocol (URL)" required>
                                            <Input placeholder="https://external-link.et" value={ctaLink} onChange={(e) => setCtaLink(e.target.value)}
                                                   className="h-14 rounded-2xl bg-white border-slate-200 font-bold" />
                                        </FieldGroup>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Proxy Execution Button */}
                            <Button
                                type="submit"
                                disabled={!isValid || isUploading || (selectedMarketer ? !hasEnoughBudget : false)}
                                className="w-full h-24 rounded-[2.5rem] text-3xl font-black tracking-tighter uppercase italic bg-slate-900 text-white shadow-2xl active:scale-[0.98] transition-all hover:bg-slate-800 disabled:opacity-20 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                {isUploading ? (
                                    <span className="flex items-center gap-4 relative z-10">
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                        Transmitting...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-4 relative z-10">
                                        <Zap className="h-8 w-8 text-primary" />
                                        Deploy Protocol \u2192
                                    </span>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Simulation & Real-time Console */}
                    <div className="space-y-10">
                        <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/50 bg-slate-950 overflow-hidden sticky top-8">
                             <CardHeader className="bg-white/[0.03] border-b border-white/5 p-8">
                                <CardTitle className="text-sm font-black flex items-center gap-3 text-white italic uppercase tracking-[0.2em]">
                                    <Sparkles className="h-4 w-4 text-primary" /> Preview Console
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-10">
                                <div className="space-y-4">
                                    {[
                                        { label: "Target Partner", value: selectedMarketer ? selectedMarketer.company_name : "Not Selected", icon: Users, color: "primary" },
                                        { label: "Asset Format", value: videoFile ? "SYNC_OK" : "PENDING", icon: Film, color: videoFile ? "emerald-500" : "slate-500" },
                                        { label: "End-to-End Rate", value: selectedModel ? `${selectedModel.cpv_rate} Br.` : "NULL", icon: Target, color: "blue-500" },
                                        { label: "Auth Budget", value: `${budget || 0} Br.`, icon: Zap, color: hasEnoughBudget ? "primary" : "rose-500" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 group hover:bg-white/[0.05] transition-colors">
                                            <div className={cn(
                                                "p-3 rounded-xl bg-slate-900 border border-white/5 transition-transform group-hover:scale-110",
                                                `text-${item.color}`
                                            )}>
                                                <item.icon className="h-4 w-4" />
                                            </div>
                                            <div className="space-y-0.5 min-w-0">
                                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">{item.label}</p>
                                                <p className={cn(
                                                    "text-sm font-black text-white truncate italic uppercase tracking-tight",
                                                    `text-${item.color}`
                                                )}>{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-8 bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 rounded-[2rem] space-y-3 relative overflow-hidden">
                                     <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                                     <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] relative z-10">Estimated Reach</p>
                                     <div className="flex items-baseline gap-2 relative z-10">
                                        <p className="text-5xl font-black text-white tracking-tighter italic">
                                            {budget && selectedModel ? Math.floor(Number(budget) / selectedModel.cpv_rate).toLocaleString() : "0"}
                                        </p>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">Total_Views</p>
                                     </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                     <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        System Integration Notes
                                     </div>
                                     <div className="space-y-2">
                                        {[
                                            "Bypasses partner verification queue",
                                            "Immediate budget deduction from wallet",
                                            "Real-time broadcast synchronization"
                                        ].map((note, i) => (
                                            <div key={i} className="flex gap-2 text-[9px] font-bold text-slate-500 leading-relaxed uppercase bg-white/[0.02] p-2 rounded-lg border border-white/5">
                                                <ChevronRight className="h-3 w-3 text-primary shrink-0" />
                                                {note}
                                            </div>
                                        ))}
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
