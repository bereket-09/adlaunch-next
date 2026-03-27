"use client";

import { useEffect, useState } from "react";
import {
    CloudUpload, FileVideo, CheckCircle, Image as ImageIcon,
    Link as LinkIcon, Zap, DollarSign, Calendar, Info, Film, X
} from "lucide-react";
import MarketerLayout from "@/components/MarketerLayout";
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
import { adAPI, AdCreateRequest, billingModelAPI } from "@/services/api";
import { Badge } from "@/components/ui/badge";

const FieldGroup = ({ label, children, required, hint }: { label: string; children: React.ReactNode; required?: boolean; hint?: string }) => (
    <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
            <Label className="text-xs font-semibold text-foreground">
                {label}{required && <span className="text-primary ml-0.5">*</span>}
            </Label>
            {hint && (
                <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{hint}</span>
            )}
        </div>
        {children}
    </div>
);

export default function MarketerUploadPage() {
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

    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        billingModelAPI.list()
            .then(res => { if (res.status) setBillingModels(res.models); })
            .catch(console.error);
    }, []);

    const selectedModel = billingModels.find(m => m._id === billingModelId);
    const marketer_id = typeof window !== 'undefined' ? localStorage.getItem("marketer_id") : null;

    const validateImage = (file: File): Promise<boolean> =>
        new Promise((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const ok = img.width >= 1200 && img.height >= 300;
                if (!ok) toast({ title: "Image too small", description: "Banner must be at least 1200×300px.", variant: "destructive" });
                resolve(ok);
            };
            img.onerror = () => resolve(false);
        });

    const isValid = !!(marketer_id && title && campaignName && billingModelId &&
        budget && parseFloat(budget) >= 100 && startDate && endDate && videoFile);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid || !videoFile) {
            toast({ title: "Validation Error", description: "Fill all required fields.", variant: "destructive" });
            return;
        }
        if (bannerFile && !(await validateImage(bannerFile))) return;
        setIsUploading(true);
        try {
            const payload: AdCreateRequest = {
                marketer_id: marketer_id!,
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
            if (!json.status) throw new Error(json.error || "Failed");
            toast({ title: "🎉 Campaign Created", description: "Your ad has been submitted for approval." });
            router.push("/marketer/campaigns");
        } catch (err: any) {
            toast({ title: "Upload failed", description: err.message, variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <MarketerLayout title="Launch Campaign">
            <div className="max-w-3xl mx-auto">

                {/* Page header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Launch New Campaign</h1>
                    <p className="text-sm text-muted-foreground mt-1">Upload your video, set a budget, and go live.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Video Drop Zone */}
                    <Card className="card-elevated border-0 overflow-hidden">
                        <CardHeader className="pb-3 pt-5 px-5 border-b border-border/40">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Film className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <CardTitle className="text-sm font-bold">Video Asset</CardTitle>
                                <Badge className="badge-orange ml-1">Required</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-5">
                            <div
                                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer ${
                                    isDragging
                                        ? "border-primary bg-primary/5 scale-[1.01]"
                                        : videoFile
                                            ? "border-green-400 bg-green-50/50"
                                            : "border-border hover:border-primary/50 hover:bg-primary/[0.02]"
                                }`}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={(e) => {
                                    e.preventDefault(); setIsDragging(false);
                                    const file = e.dataTransfer.files[0];
                                    if (file?.type.startsWith("video/")) setVideoFile(file);
                                    else toast({ title: "Invalid file", description: "Please drop a video file.", variant: "destructive" });
                                }}
                            >
                                {videoFile ? (
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-bold text-foreground truncate max-w-[280px]">{videoFile.name}</p>
                                                <p className="text-[10px] text-muted-foreground">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</p>
                                            </div>
                                        </div>
                                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-500"
                                                onClick={() => setVideoFile(null)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
                                             style={{ background: 'linear-gradient(135deg, hsl(24,100%,96%), hsl(34,100%,94%))' }}>
                                            <CloudUpload className="h-7 w-7 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground text-sm">Drag & drop your video here</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">MP4, WebM — up to 50 MB</p>
                                        </div>
                                        <Input type="file" accept="video/*" className="hidden" id="video-upload"
                                               onChange={(e) => { const f = e.target.files?.[0]; if (f) setVideoFile(f); }} />
                                        <Button type="button" variant="outline" size="sm" className="rounded-xl h-9 px-5 font-semibold border-border/60" asChild>
                                            <label htmlFor="video-upload" className="cursor-pointer">Select Video File</label>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Campaign Details */}
                    <Card className="card-elevated border-0">
                        <CardHeader className="pb-3 pt-5 px-5 border-b border-border/40">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Zap className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <CardTitle className="text-sm font-bold">Campaign Details</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FieldGroup label="Campaign Name" required>
                                    <Input placeholder="e.g. Summer Sale 2026" value={campaignName}
                                           onChange={(e) => setCampaignName(e.target.value)}
                                           className="h-10 rounded-xl border-border/60 focus:border-primary/50" />
                                </FieldGroup>
                                <FieldGroup label="Ad Title" required>
                                    <Input placeholder="Displayed to viewers" value={title}
                                           onChange={(e) => setTitle(e.target.value)}
                                           className="h-10 rounded-xl border-border/60 focus:border-primary/50" />
                                </FieldGroup>
                            </div>
                            <FieldGroup label="Description">
                                <Textarea placeholder="Briefly describe your campaign…" value={description}
                                          onChange={(e) => setDescription(e.target.value)} rows={3}
                                          className="rounded-xl border-border/60 focus:border-primary/50 resize-none" />
                            </FieldGroup>
                            <FieldGroup label="Reward Description" hint="e.g. + 50 Gold">
                                <Input placeholder="+ 50 Gold or 100MB Data" value={rewardDescription}
                                       onChange={(e) => setRewardDescription(e.target.value)}
                                       className="h-10 rounded-xl border-border/60 focus:border-primary/50" />
                            </FieldGroup>
                        </CardContent>
                    </Card>

                    {/* Billing Model */}
                    <Card className="card-elevated border-0">
                        <CardHeader className="pb-3 pt-5 px-5 border-b border-border/40">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <DollarSign className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <CardTitle className="text-sm font-bold">Billing & Budget</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4">
                            <FieldGroup label="Billing Model" required>
                                <Select value={billingModelId} onValueChange={setBillingModelId}>
                                    <SelectTrigger className="h-11 rounded-xl border-border/60">
                                        <SelectValue placeholder="Choose how you want to reach users…" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-border/60 shadow-xl">
                                        {billingModels.map(m => (
                                            <SelectItem key={m._id} value={m._id} className="rounded-xl">
                                                <div className="flex flex-col gap-0.5 py-0.5">
                                                    <span className="font-bold text-sm">{m.name}</span>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {m.cpv_rate} Br./view{m.cpc_rate > 0 ? ` + ${m.cpc_rate} Br./click` : ''}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FieldGroup>

                            {selectedModel && (
                                <div className="flex items-start gap-3 p-3.5 rounded-xl"
                                     style={{ background: 'linear-gradient(135deg, hsl(24,100%,97%), hsl(34,100%,95%))', border: '1px solid hsl(24,100%,88%)' }}>
                                    <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-foreground">{selectedModel.name}</p>
                                        {selectedModel.description && (
                                            <p className="text-[10px] text-muted-foreground mt-0.5">{selectedModel.description}</p>
                                        )}
                                        <div className="flex gap-2 mt-2">
                                            {selectedModel.features?.has_video && <span className="badge-green text-[9px] py-0 px-1.5">Video</span>}
                                            {selectedModel.features?.has_banner && <span className="badge-blue text-[9px] py-0 px-1.5">Banner</span>}
                                            {selectedModel.features?.has_cta && <span className="badge-orange text-[9px] py-0 px-1.5">CTA</span>}
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-lg font-black text-primary tabular-nums">{selectedModel.cpv_rate} Br.</p>
                                        <p className="text-[9px] text-muted-foreground font-semibold uppercase">per view</p>
                                    </div>
                                </div>
                            )}

                            <FieldGroup label="Total Budget (ETB)" required hint="Min. 100 ETB">
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">Br.</span>
                                    <Input type="number" placeholder="100.00" value={budget}
                                           onChange={(e) => setBudget(e.target.value)}
                                           className="h-10 rounded-xl border-border/60 pl-10 focus:border-primary/50" />
                                </div>
                                {budget && parseFloat(budget) >= 100 && selectedModel && (
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                        ≈ {Math.floor(parseFloat(budget) / selectedModel.cpv_rate).toLocaleString()} estimated views
                                    </p>
                                )}
                            </FieldGroup>

                            <div className="grid grid-cols-2 gap-4">
                                <FieldGroup label="Start Date" required>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                                               className="h-10 rounded-xl border-border/60 pl-9 focus:border-primary/50" />
                                    </div>
                                </FieldGroup>
                                <FieldGroup label="End Date" required>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                                               className="h-10 rounded-xl border-border/60 pl-9 focus:border-primary/50" />
                                    </div>
                                </FieldGroup>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Banner — conditional */}
                    {selectedModel?.features?.has_banner && (
                        <Card className="card-elevated border-0 animate-[slideUp_0.3s_ease-out]">
                            <CardHeader className="pb-3 pt-5 px-5 border-b border-border/40">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4 text-primary" /> Banner Image
                                    <Badge className="badge-blue ml-1">Required by plan</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5">
                                <div className={`border-2 border-dashed rounded-xl p-5 transition-all ${bannerFile ? "border-green-400 bg-green-50/30" : "border-border hover:border-primary/40"}`}>
                                    {bannerFile ? (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                                    <ImageIcon className="h-4 w-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-foreground truncate max-w-[200px]">{bannerFile.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">{(bannerFile.size / 1024).toFixed(0)} KB</p>
                                                </div>
                                            </div>
                                            <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-red-500 hover:bg-red-50"
                                                    onClick={() => setBannerFile(null)}>Remove</Button>
                                        </div>
                                    ) : (
                                        <div className="text-center space-y-2">
                                            <Input type="file" accept="image/*" className="hidden" id="banner-upload"
                                                   onChange={(e) => setBannerFile(e.target.files?.[0] || null)} />
                                            <label htmlFor="banner-upload" className="inline-flex items-center gap-2 text-xs font-semibold text-primary cursor-pointer hover:underline">
                                                <CloudUpload className="h-4 w-4" /> Upload Banner (min. 1200×300px)
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* CTA — conditional */}
                    {selectedModel?.features?.has_cta && (
                        <Card className="card-elevated border-0 animate-[slideUp_0.3s_ease-out]">
                            <CardHeader className="pb-3 pt-5 px-5 border-b border-border/40">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <LinkIcon className="h-4 w-4 text-primary" /> Call to Action
                                    <Badge className="badge-orange ml-1">Required by plan</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FieldGroup label="Button Label" required>
                                    <Input placeholder="e.g. Shop Now" value={ctaText} onChange={(e) => setCtaText(e.target.value)}
                                           className="h-10 rounded-xl border-border/60 focus:border-primary/50" />
                                </FieldGroup>
                                <FieldGroup label="Destination URL" required>
                                    <Input placeholder="https://your-site.com" value={ctaLink} onChange={(e) => setCtaLink(e.target.value)}
                                           className="h-10 rounded-xl border-border/60 focus:border-primary/50" />
                                </FieldGroup>
                            </CardContent>
                        </Card>
                    )}

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={!isValid || isUploading}
                        className="w-full h-12 text-base font-bold text-white rounded-2xl transition-all duration-200 disabled:opacity-50"
                        style={{ background: isValid && !isUploading ? 'linear-gradient(135deg, hsl(24,100%,50%), hsl(34,100%,55%))' : undefined,
                                 boxShadow: isValid && !isUploading ? '0 8px 24px rgba(255,109,0,0.35)' : undefined }}
                    >
                        {isUploading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Uploading Assets…
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Zap className="h-5 w-5" /> Launch Campaign
                            </span>
                        )}
                    </Button>
                </form>
            </div>
        </MarketerLayout>
    );
}
