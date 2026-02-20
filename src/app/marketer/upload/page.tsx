"use client";

import { useState } from "react";
import { CloudUpload, FileVideo, CheckCircle, AlertCircle } from "lucide-react";
import MarketerLayout from "@/components/MarketerLayout";
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
import { adAPI, AdCreateRequest } from "@/services/api";

export default function MarketerUploadPage() {
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

    const { toast } = useToast();
    const router = useRouter();

    const getMarketerId = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("marketer_id");
        }
        return null;
    };

    const marketer_id = getMarketerId();

    const costPerViewMap: Record<string, number> = {
        free: 0,
        standard: 0.05,
        premium: 0.1,
        custom: 0.15,
    };

    const cost_per_view = rateType ? costPerViewMap[rateType] : 0;

    const isValid =
        marketer_id &&
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
                marketer_id: marketer_id!,
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
                throw new Error(json.error || "Failed to create campaign");
            }

            toast({
                title: "Campaign Created",
                description: "Your advertisement has been submitted for approval.",
            });

            router.push("/marketer/campaigns");
        } catch (err: any) {
            toast({
                title: "Upload failed",
                description: err.message,
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <MarketerLayout title="Create Campaign">
            <div className="max-w-3xl mx-auto space-y-6">
                <Card className="card-elevated">
                    <CardHeader>
                        <CardTitle>Upload Video</CardTitle>
                        <CardDescription>
                            Upload your video and configure campaign details
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div
                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging
                                        ? "border-primary bg-orange-50"
                                        : videoFile
                                            ? "border-green-500 bg-green-50"
                                            : "border-border hover:border-primary/50"
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
                                            title: "Invalid file type",
                                            description: "Please upload a valid video file",
                                            variant: "destructive",
                                        });
                                    }
                                }}
                            >
                                {videoFile ? (
                                    <div className="space-y-3">
                                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100">
                                            <CheckCircle className="h-7 w-7 text-green-600" />
                                        </div>
                                        <p className="font-medium">{videoFile.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                        <Button
                                            variant="outline"
                                            onClick={() => setVideoFile(null)}
                                            type="button"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-100">
                                            <CloudUpload className="h-7 w-7 text-primary" />
                                        </div>
                                        <p className="font-medium">
                                            Drop your video here or browse
                                        </p>
                                        <label>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="video/*"
                                                onChange={(e) =>
                                                    e.target.files?.[0] && setVideoFile(e.target.files[0])
                                                }
                                            />
                                            <Button variant="outline" type="button" asChild>
                                                <span>
                                                    <FileVideo className="h-4 w-4 mr-2" />
                                                    Choose File
                                                </span>
                                            </Button>
                                        </label>
                                    </>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Campaign Name *</Label>
                                <Input
                                    value={campaignName}
                                    onChange={(e) => setCampaignName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Video Title *</Label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Price per View *</Label>
                                    <Select value={rateType} onValueChange={setRateType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select rate type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="free">Free</SelectItem>
                                            <SelectItem value="standard">Standard (0.05 Br.)</SelectItem>
                                            <SelectItem value="premium">Premium (0.10 Br.)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Budget Allocation (Br.) *</Label>
                                    <Input
                                        type="number"
                                        min="100"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Start Date *</Label>
                                    <Input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>End Date *</Label>
                                    <Input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {budget && parseFloat(budget) < 100 && (
                                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                                    <AlertCircle className="h-5 w-5" />
                                    <p>Minimum budget is 100 Br.</p>
                                </div>
                            )}

                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => router.push("/marketer/campaigns")}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    variant="gradient"
                                    disabled={!isValid || isUploading}
                                >
                                    {isUploading ? "Creating..." : "Create Campaign"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </MarketerLayout>
    );
}
