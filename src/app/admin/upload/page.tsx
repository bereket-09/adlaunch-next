"use client";

import { useState, useEffect } from "react";
import {
    CloudUpload, FileVideo, CheckCircle, AlertCircle, ArrowLeft,
    Users, Target, Sparkles, Zap, ShieldCheck, ChevronRight,
    Play, Server, Database, Globe, MousePointer2
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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { adAPI, marketerAPI, AdCreateRequest, Marketer } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import RealTimeIndicator from "@/components/analytics/RealTimeIndicator";

export default function AdminUploadPage() {
    const [marketers, setMarketers] = useState<Marketer[]>([]);
    const [selectedMarketerId, setSelectedMarketerId] = useState("");
    const [campaignName, setCampaignName] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [rateType, setRateType] = useState("");
    const [budget, setBudget] = useState("");
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [loadingMarketers, setLoadingMarketers] = useState(true);

    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        fetchMarketers();
    }, []);

    const fetchMarketers = async () => {
        try {
            setLoadingMarketers(true);
            const res = await marketerAPI.list();
            if (res.status) {
                setMarketers(res.marketers);
            }
        } catch (err) {
            console.error("Failed to load marketers", err);
        } finally {
            setLoadingMarketers(false);
        }
    };

    const costPerViewMap: Record<string, number> = {
        free: 0,
        standard: 0.05,
        premium: 0.1,
        custom: 0.15,
    };

    const cost_per_view = rateType ? costPerViewMap[rateType] : 0;

    const isValid =
        selectedMarketerId &&
        title &&
        campaignName &&
        rateType &&
        budget &&
        parseFloat(budget) >= 100 &&
        startDate &&
        endDate &&
        videoFile;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid || !videoFile) return;

        setIsUploading(true);

        try {
            const payload: AdCreateRequest = {
                marketer_id: selectedMarketerId,
                campaign_name: campaignName,
                title,
                cost_per_view,
                budget_allocation: Number(budget),
                video_description: description || "",
                video_file: videoFile,
                start_date: startDate,
                end_date: endDate,
            };

            const json = await adAPI.create(payload);

            if (!json.status) {
                throw new Error(json.error || "Failed to initiate campaign protocol");
            }

            toast({
                title: "Protocol Initiated",
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
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-700 pb-10">
                {/* Header Section */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/40 border-border/50 shadow-sm" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="space-y-0.5">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            New Campaign Upload
                            <Badge className="bg-primary/10 text-primary border-primary/20 font-bold py-0.5 px-2 text-[10px]">MANUAL_ENTRY</Badge>
                        </h1>
                        <p className="text-muted-foreground font-medium text-sm">Create and deploy a new advertisement campaign for a specific advertiser.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Ingress Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-secondary/10 border-b border-border/50 p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                                        <CloudUpload className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold">Campaign Assets</CardTitle>
                                        <CardDescription className="text-xs">Upload video files for platform-wide distribution.</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-8">
                                <form onSubmit={handleSubmit} className="space-y-10">
                                    {/* Video Upload Zone */}
                                    <div
                                        className={`group relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${isDragging
                                            ? "border-primary bg-primary/5 scale-[0.99]"
                                            : videoFile
                                                ? "border-emerald-500/50 bg-emerald-500/5"
                                                : "border-border/60 hover:border-primary/40 hover:bg-white/40"
                                            }`}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setIsDragging(true);
                                        }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setIsDragging(false);
                                            const file = e.dataTransfer.files[0];
                                            if (file && file.type.startsWith("video/")) {
                                                setVideoFile(file);
                                            } else {
                                                toast({
                                                    title: "Invalid Protocol",
                                                    description: "Supported assets must be in video container format.",
                                                    variant: "destructive",
                                                });
                                            }
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                        {videoFile ? (
                                            <div className="space-y-4 relative z-10 animate-in zoom-in duration-300">
                                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500 text-white">
                                                    <CheckCircle className="h-6 w-6" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-base font-bold text-foreground truncate max-w-xs mx-auto">{videoFile.name}</p>
                                                    <p className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-wider">
                                                        Payload Ready: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 rounded-lg px-4 border-emerald-500/30 text-emerald-700 font-bold hover:bg-emerald-500/10"
                                                    onClick={() => setVideoFile(null)}
                                                    type="button"
                                                >
                                                    Change File
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4 relative z-10">
                                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                                    <FileVideo className="h-6 w-6" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-lg font-bold text-foreground">Upload Campaign Video</p>
                                                    <p className="text-muted-foreground text-xs font-medium max-w-[240px] mx-auto opacity-70">Drag and drop your video file here.</p>
                                                </div>
                                                <label className="inline-block cursor-pointer">
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="video/*"
                                                        onChange={(e) =>
                                                            e.target.files?.[0] && setVideoFile(e.target.files[0])
                                                        }
                                                    />
                                                    <Button variant="secondary" type="button" asChild className="h-9 px-6 rounded-lg font-bold text-sm gap-2">
                                                        <span>
                                                            <CloudUpload className="h-4 w-4" /> Browse Files
                                                        </span>
                                                    </Button>
                                                </label>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Assigned Advertiser</Label>
                                            <Select value={selectedMarketerId} onValueChange={setSelectedMarketerId}>
                                                <SelectTrigger className="h-10 rounded-xl bg-secondary/10 border-border/50 text-sm font-semibold px-4 focus:ring-primary/30 transition-all">
                                                    <SelectValue placeholder={loadingMarketers ? "Loading..." : "Select Advertiser"} />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-border/40 shadow-xl bg-background p-1">
                                                    {marketers.map((m) => (
                                                        <SelectItem key={m._id} value={m._id} className="rounded-lg py-2 text-sm font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                                                {m.name}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Internal Campaign Name</Label>
                                            <Input
                                                className="h-10 rounded-xl bg-secondary/10 border-border/50 text-sm font-semibold px-4 focus-visible:ring-primary/30 transition-all"
                                                placeholder="e.g., Summer_Promo_2024"
                                                value={campaignName}
                                                onChange={(e) => setCampaignName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Public Display Title</Label>
                                        <Input
                                            className="h-10 rounded-xl bg-secondary/10 border-border/50 text-base font-bold px-4 focus-visible:ring-primary/30 transition-all"
                                            placeholder="What users will see..."
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Campaign Description</Label>
                                        <Textarea
                                            className="min-h-[100px] rounded-xl bg-secondary/10 border-border/50 text-sm font-medium p-4 focus-visible:ring-primary/30 transition-all resize-none"
                                            placeholder="Additional details about the campaign..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Budget Pricing Tier</Label>
                                            <Select value={rateType} onValueChange={setRateType}>
                                                <SelectTrigger className="h-10 rounded-xl bg-secondary/10 border-border/50 text-sm font-semibold px-4">
                                                    <SelectValue placeholder="Select Tier" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-border/40 shadow-xl bg-background p-1">
                                                    <SelectItem value="free" className="rounded-lg py-2 text-sm font-medium">Free (0.00 Br.)</SelectItem>
                                                    <SelectItem value="standard" className="rounded-lg py-2 text-sm font-medium text-blue-600">Standard (0.05 Br.)</SelectItem>
                                                    <SelectItem value="premium" className="rounded-lg py-2 text-sm font-medium text-amber-600">Premium (0.10 Br.)</SelectItem>
                                                    <SelectItem value="custom" className="rounded-lg py-2 text-sm font-medium text-emerald-600">Custom (0.15 Br.)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Assigned Budget (Br.)</Label>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    min="100"
                                                    className="h-10 rounded-xl bg-secondary/10 border-border/50 text-base font-bold px-10 focus-visible:ring-primary/30 transition-all"
                                                    value={budget}
                                                    onChange={(e) => setBudget(e.target.value)}
                                                    required
                                                />
                                                <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-50" />
                                                <Badge className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary/5 text-primary border-none text-[8px] font-bold">MIN 100</Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Publish Date</Label>
                                            <Input
                                                type="date"
                                                className="h-10 rounded-xl bg-secondary/10 border-border/50 text-sm font-semibold px-4 focus-visible:ring-primary/30 transition-all font-mono"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">End Date</Label>
                                            <Input
                                                type="date"
                                                className="h-10 rounded-xl bg-secondary/10 border-border/50 text-sm font-semibold px-4 focus-visible:ring-primary/30 transition-all font-mono"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Simulation & Review Column */}
                    <div className="space-y-6">
                        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-primary/5 border-b border-border/50 p-6">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-primary" /> Summary Preview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-4">
                                    {[
                                        { label: "Advertiser", value: marketers.find(m => m._id === selectedMarketerId)?.name || "Not Selected", icon: Users },
                                        { label: "Cost Per View", value: `${cost_per_view.toFixed(2)} Br.`, icon: Target },
                                        { label: "Total Budget", value: `${budget || 0} Br.`, icon: Zap },
                                        { label: "Duration", value: startDate && endDate ? `${Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24))} Days` : "Not Set", icon: ShieldCheck },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20 border border-border/50">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                <item.icon className="h-4 w-4" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.label}</p>
                                                <p className="text-sm font-bold text-foreground">{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6 bg-slate-900 rounded-2xl border border-primary/20 space-y-4">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estimated Reach</p>
                                        <p className="text-2xl font-bold text-white tracking-tight">
                                            {budget && cost_per_view > 0 ? Math.floor(Number(budget) / cost_per_view).toLocaleString() : "0"}
                                            <span className="text-xs text-slate-500 ml-2 uppercase">TOTAL_VIEWS</span>
                                        </p>
                                    </div>
                                    <div className="pt-3 border-t border-white/5">
                                        <RealTimeIndicator label="PRE-VALIDATION" />
                                    </div>
                                </div>

                                <Button
                                    onClick={handleSubmit}
                                    disabled={!isValid || isUploading}
                                    className="w-full h-12 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-base font-bold transition-all hover:scale-[1.01] active:scale-[0.99] group"
                                >
                                    {isUploading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            PROCESSING...
                                        </div>
                                    ) : (
                                        <>
                                            <Zap className="h-5 w-5" />
                                            CREATE CAMPAIGN
                                            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>

                                <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">
                                    Encrypted Handshake: RSA_2048
                                </p>
                            </CardContent>
                        </Card>

                        <div className="p-6 bg-secondary/5 rounded-2xl border border-border/50 space-y-3">
                            <div className="flex items-center gap-2 text-primary">
                                <ShieldCheck className="h-4 w-4" />
                                <h4 className="text-[10px] font-bold uppercase tracking-wider">Integrity Notes</h4>
                            </div>
                            <ul className="space-y-1.5">
                                {[
                                    "Bypasses standard approval queue",
                                    "Immediate budget deduction",
                                    "Real-time network synchronization",
                                ].map((note, i) => (
                                    <li key={i} className="flex items-start gap-2 text-[10px] font-medium text-muted-foreground leading-tight">
                                        <div className="w-1 h-1 rounded-full bg-primary/40 mt-1" />
                                        {note}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
