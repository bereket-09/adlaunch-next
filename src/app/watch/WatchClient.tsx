"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
    CheckCircle2,
    Play,
    Globe,
    Loader2,
    AlertCircle,
    Maximize2,
    Minimize2,
    ExternalLink,
    ChevronRight,
    Volume2,
    VolumeX
} from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { startTracking, completeTracking, getVideoDetails, pingTracking } from "./actions";
import API_CONFIG from "@/config/api";
import { adAPI } from "@/services/api";

type ViewState =
    | "loading"
    | "ready"
    | "playing"
    | "completed"
    | "rewarded"
    | "error";

interface WatchClientProps {
    token: string;
    initialData?: any;
}

const getDeviceInfo = () => {
    if (typeof window === 'undefined') return { type: 'unknown', model: 'unknown', brand: 'unknown', platform: 'unknown', userAgent: '', touchPoints: 0 };

    const ua = navigator.userAgent;
    const platform = navigator.platform || "";
    const maxTouchPoints = navigator.maxTouchPoints || 0;

    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);

    return {
        type: isMobile ? "mobile" : "desktop",
        model: isMobile ? "Smartphone" : "Desktop",
        brand: /iPhone|iPad|iPod/i.test(ua) ? "Apple" : (/Android/i.test(ua) ? "Android" : "PC"),
        platform,
        userAgent: ua,
        touchPoints: maxTouchPoints,
    };
};

export default function WatchClient({ token, initialData }: WatchClientProps) {
    const [viewState, setViewState] = useState<ViewState>("loading");
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(initialData?.ad_id ? `${API_CONFIG.API_BASE}/ad/video/${initialData.ad_id}` : null);
    const [currentSecureKey, setCurrentSecureKey] = useState<string>(initialData?.secure_key || "");
    const [metaBase64, setMetaBase64] = useState<string>("");
    const [progress, setProgress] = useState(0);
    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const [isCssFs, setIsCssFs] = useState(false);
    const [rewardData, setRewardData] = useState<any>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [adData, setAdData] = useState<any>(initialData?.ad || null);

    const [hasInteracted, setHasInteracted] = useState(false);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const lastTimeRef = useRef(0);
    const hasInitializedRef = useRef(false);
    const latestSecureKeyRef = useRef<string>(initialData?.secure_key || "");

    const adDetails = {
        sponsor: adData?.campaign_name || "ADREWARDS SPONSOR",
        reward: adData?.reward_description || "Verified Reward",
    };

    useEffect(() => {
        const meta = {
            msisdn: "251912345678",
            ip: "127.0.0.1",
            userAgent: navigator.userAgent,
            device: getDeviceInfo(),
            screen: {
                width: window.screen.width,
                height: window.screen.height,
                pixelRatio: window.devicePixelRatio,
            },
            location: { lat: 8.0, lon: 34.0, country: "ET" },
        };
        setMetaBase64(btoa(JSON.stringify(meta)));
    }, []);

    const handleStartVideo = async (key: string) => {
        if (!key || !metaBase64) return;
        try {
            const data = await startTracking(token, metaBase64, key);
            if (data.status) {
                setCurrentSecureKey(data.secure_key);
                latestSecureKeyRef.current = data.secure_key;
            }
        } catch (err) {
            console.error("Discovery failed", err);
        }
    };

    const handleVideoComplete = async () => {
        setViewState("completed");
        try {
            const data = await completeTracking(token, metaBase64, latestSecureKeyRef.current);
            setRewardData(data);
            setViewState("rewarded");
        } catch (err) {
            setViewState("rewarded");
        }
    };

    const startPlaying = async () => {
        setHasInteracted(true);
        if (videoRef.current) {
            videoRef.current.muted = false;
            setIsMuted(false);
            try {
                await videoRef.current.play();
                setViewState("playing");
                if (currentSecureKey) handleStartVideo(currentSecureKey);
            } catch (err) {
                console.error("Play failed", err);
            }
        }
    };

    useEffect(() => {
        if (!token || !metaBase64 || hasInitializedRef.current) return;
        const setupVideo = async () => {
            hasInitializedRef.current = true;
            try {
                let data = initialData;
                if (!data || data.status === false) {
                    setViewState("loading");
                    data = await getVideoDetails(token, metaBase64);
                }

                if (!data || data.status === false) {
                    const errMsg = (data?.error || "").toLowerCase();
                    if (errMsg.includes("completed") || errMsg.includes("rewarded") || errMsg.includes("expired")) {
                        setViewState("rewarded");
                        return;
                    }
                    throw new Error(data?.error || "Video cannot be loaded");
                }

                setAdData(data.ad);
                setCurrentSecureKey(data.secure_key);
                latestSecureKeyRef.current = data.secure_key;
                setVideoUrl(`${API_CONFIG.API_BASE}/ad/video/${data.ad_id}`);
                setViewState("ready");
            } catch (err: any) {
                setError(err.message || "Unable to load video");
                setViewState("error");
            }
        };
        setupVideo();
    }, [token, metaBase64, initialData]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || viewState !== "playing" || !videoUrl) return;

        let hls: any = null;
        const isHLS = videoUrl.includes(".m3u8");

        if (isHLS) {
            import("hls.js").then((Hls) => {
                const hlsClass = Hls.default;
                if (hlsClass.isSupported()) {
                    hls = new hlsClass({
                        startLevel: 0,
                        capLevelToPlayerSize: true,
                    });
                    hls.loadSource(videoUrl);
                    hls.attachMedia(video);
                    hls.on(hlsClass.Events.MANIFEST_PARSED, () => setIsVideoLoading(false));
                } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = videoUrl;
                }
            });
        }

        const onLoaded = () => setIsVideoLoading(false);
        const onTimeUpdate = () => {
            if (!video.duration) return;
            setProgress((video.currentTime / video.duration) * 100);
            lastTimeRef.current = video.currentTime;
        };
        const onEnded = () => handleVideoComplete();
        const onVolumeChange = () => setIsMuted(video.muted);

        video.addEventListener("loadeddata", onLoaded);
        video.addEventListener("timeupdate", onTimeUpdate);
        video.addEventListener("ended", onEnded);
        video.addEventListener("volumechange", onVolumeChange);

        return () => {
            if (hls) hls.destroy();
            video.removeEventListener("loadeddata", onLoaded);
            video.removeEventListener("timeupdate", onTimeUpdate);
            video.removeEventListener("ended", onEnded);
            video.removeEventListener("volumechange", onVolumeChange);
        };
    }, [viewState, videoUrl]);

    return (
        // Added pb-10 to account for the new fixed footer
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-zinc-900 selection:bg-orange-100 pb-10">

            <header className="w-full bg-white border-b border-zinc-200 p-4 px-6 md:px-10 flex items-center justify-between sticky top-0 z-40 shadow-sm">
                <div className="flex items-center gap-3">
                    <Logo className="w-6 h-6 text-orange-500" />
                    {/* <span className="text-xl font-bold tracking-tight">AdReward</span> */}
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-9 h-9 border border-zinc-200 rounded-full flex items-center justify-center bg-zinc-50">
                        <div className="w-4 h-4 bg-orange-500 rounded-full shadow-inner" />
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 w-full">
                {/* Increased max-width to 5xl for a better desktop/windows experience */}
                <div className="w-full max-w-5xl mx-auto bg-white md:rounded-[2rem] md:shadow-xl md:ring-1 md:ring-zinc-200 overflow-hidden relative">

                    {error ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center min-h-[50vh]">
                            <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-6">
                                <AlertCircle className="w-10 h-10 text-orange-500" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tight text-zinc-900 mb-4">Attention</h2>
                            <p className="text-zinc-500 mb-8 max-w-md text-lg leading-relaxed">{error}</p>
                            <Button onClick={() => window.location.reload()} className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-10 py-6 font-bold tracking-widest uppercase transition-transform hover:scale-105">Try Again</Button>
                        </div>
                    ) : viewState === "rewarded" ? (
                        <div className="flex flex-col md:flex-row p-6 md:p-12 gap-8 lg:gap-16 items-center">
                            <div className="flex-1 w-full relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-zinc-900 shadow-xl flex items-center justify-center group">
                                {adData?.banner_url ? (
                                    <img src={adData.banner_url} alt="Hero" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center relative">
                                        <div className="absolute inset-0 bg-orange-500/10" />
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-end p-6 md:p-8">
                                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 px-6 flex items-center gap-4 shadow-2xl transform transition-transform group-hover:-translate-y-2">
                                        <CheckCircle2 className="w-6 h-6 text-orange-500" />
                                        <span className="text-lg font-bold tracking-tight text-zinc-900">Verification Complete</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-center max-w-lg w-full">
                                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-8 border border-orange-100">
                                    <CheckCircle2 className="w-8 h-8 text-orange-500" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-orange-500 tracking-tighter leading-[1.1] mb-6">Reward<br />Triggered!</h1>
                                <p className="text-zinc-500 font-medium mb-10 text-lg leading-relaxed">Your achievement has been recorded. An SMS with your unique reward code will be shared shortly.</p>

                                <Button
                                    onClick={() => window.close()}
                                    className="w-full md:w-auto self-start bg-orange-500 hover:bg-orange-600 text-white rounded-full px-10 py-6 text-lg font-bold shadow-xl shadow-orange-500/20 transition-all hover:scale-105 group"
                                >
                                    Browse Now <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col w-full">

                            {/* TOP BANNER SLOT (Future-proofing layout for custom sponsor banners above player) */}
                            {adData?.banner_url && (
                                <div className="w-full h-24 md:h-32 bg-zinc-100 relative border-b border-zinc-200 overflow-hidden">
                                    <img src={adData.banner_url} alt="Sponsor Banner" className="w-full h-full object-cover" />
                                </div>
                            )}

                            {/* Center: Video Player */}
                            <div className="w-full aspect-video max-h-[60vh] bg-black relative shadow-inner group overflow-hidden">
                                {videoUrl ? (
                                    <video
                                        ref={videoRef}
                                        src={videoUrl}
                                        className="w-full h-full object-contain pointer-events-none"
                                        playsInline
                                        muted={isMuted}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-3" />
                                        <span className="text-xs tracking-widest uppercase font-bold text-zinc-400">Optimizing Stream</span>
                                    </div>
                                )}

                                {/* Play Overlay */}
                                {viewState === "ready" && !hasInteracted && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center cursor-pointer group-hover:bg-black/50 transition-colors" onClick={startPlaying}>
                                        <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:scale-105 transition-transform border-4 border-white/10">
                                            <Play className="w-10 h-10 text-white fill-white translate-x-1" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Bottom: Description & CTA Area */}
                            <div className="p-6 md:p-8 flex flex-col gap-6 bg-white">

                                {/* Progress & Stream Status */}
                                <div className="flex flex-row items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-100">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] uppercase tracking-widest font-bold">
                                                {viewState === "completed" ? "Verified" : "Secure Stream"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold tracking-tight text-zinc-500 uppercase hidden sm:inline-block">Progress</span>
                                        <span className="text-sm font-black text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                                            {Math.round(progress)}%
                                        </span>
                                    </div>
                                </div>
                                <Progress value={progress} className="h-2 bg-zinc-100 [&>div]:bg-orange-500" />

                                {/* Description & CTA Split */}
                                <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between pt-2">
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-black text-zinc-900 mb-2 tracking-tight">{adDetails.sponsor}</h3>
                                        {adData?.description ? (
                                            <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl">
                                                {adData.description}
                                            </p>
                                        ) : (
                                            <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl italic">
                                                Watch this quick sponsor message to unlock your exclusive rewards and benefits.
                                            </p>
                                        )}
                                    </div>

                                    {/* Call to Action always on the bottom right (or below on mobile) */}
                                    {adData?.cta_link && (
                                        <div className="w-full md:w-auto flex-shrink-0 mt-2 md:mt-0">
                                            <Button
                                                onClick={() => window.open(adData.cta_link, "_blank")}
                                                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl px-8 py-6 font-bold shadow-md transition-all text-base"
                                            >
                                                {adData.cta_text || "Visit Sponsor"} <ExternalLink className="w-4 h-4 ml-2 opacity-70" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Floating Bottom Claim Overlay when finished */}
                    {viewState === "completed" && (
                        // Positioned absolute to the card, slightly above the bottom to not clip with footer
                        <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md border-t border-zinc-200 p-4 md:p-6 z-30 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-6">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-zinc-900 text-lg tracking-tight">Requirement Met</h4>
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Generate code now</p>
                                </div>
                            </div>
                            <Button
                                onClick={handleVideoComplete}
                                className="w-full sm:w-auto h-14 px-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-black uppercase tracking-widest text-sm transition-transform active:scale-95 shadow-lg shadow-orange-500/20"
                            >
                                Claim Reward
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            {/* FIXED FOOTER */}
            <footer className="fixed bottom-0 left-0 right-0 w-full bg-white/80 backdrop-blur-md border-t border-zinc-200 py-2.5 px-6 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between opacity-60 hover:opacity-100 transition-opacity">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        © 2026 AdRewards Media.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-orange-500 transition-colors">Terms</a>
                        <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-orange-500 transition-colors">Privacy</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}