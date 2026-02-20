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
} from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { startTracking, completeTracking, getVideoDetails } from "./actions";
import API_CONFIG from "@/config/api";

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

    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isMobileUA = /Mobi|Android/i.test(ua);

    const isTouchDevice = maxTouchPoints > 0;
    const isDesktopOS = /Win|Mac|Linux/i.test(platform);

    const isMobile =
        (isAndroid || isIOS || isMobileUA) &&
        isTouchDevice &&
        !isDesktopOS;

    return {
        type: isMobile ? "mobile" : "desktop",
        model: isMobile ? "Smartphone" : "Desktop",
        brand: isIOS
            ? "Apple"
            : isAndroid
                ? "Android"
                : isDesktopOS
                    ? "PC"
                    : "Unknown",
        platform,
        userAgent: ua,
        touchPoints: maxTouchPoints,
    };
};

export default function WatchClient({ token, initialData }: WatchClientProps) {
    const [viewState, setViewState] = useState<ViewState>(initialData?.status ? "playing" : "loading");
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(initialData?.ad_id ? `${API_CONFIG.API_BASE}/ad/video/${initialData.ad_id}` : null);
    const [currentSecureKey, setCurrentSecureKey] = useState<string>(initialData?.secure_key || "");
    const [metaBase64, setMetaBase64] = useState<string>("");
    const [progress, setProgress] = useState(0);
    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const [isCssFs, setIsCssFs] = useState(false);
    const [rewardData, setRewardData] = useState<any>(null);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const lastTimeRef = useRef(0);
    const hasInitializedRef = useRef(false);

    const adDetails = {
        sponsor: "ETHIO TELECOM",
        duration: "30 seconds",
        reward: "100MB Data Bundle",
        rewardType: "data" as const,
    };

    useEffect(() => {
        const deviceInfo = getDeviceInfo();
        const meta = {
            msisdn: "251912345678",
            ip: "127.0.0.1",
            userAgent: deviceInfo.userAgent,
            device: {
                type: deviceInfo.type,
                model: deviceInfo.model,
                brand: deviceInfo.brand,
                platform: deviceInfo.platform,
                touchPoints: deviceInfo.touchPoints,
            },
            screen: {
                width: typeof window !== 'undefined' ? window.screen.width : 0,
                height: typeof window !== 'undefined' ? window.screen.height : 0,
                pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
            },
            location: {
                lat: 8.0,
                lon: 34.0,
                country: "ET",
            },
        };
        setMetaBase64(btoa(JSON.stringify(meta)));
    }, []);

    const handleStartVideo = async (key: string) => {
        if (!key || !metaBase64) return;
        try {
            const data = await startTracking(token, metaBase64, key);
            if (data.status) setCurrentSecureKey(data.secure_key);
        } catch (err) {
            console.error("Start video failed", err);
        }
    };

    const handleVideoComplete = async () => {
        setViewState("completed");
        try {
            const data = await completeTracking(token, metaBase64, currentSecureKey);
            setRewardData(data);
            setViewState("rewarded");
        } catch (err) {
            console.error("Complete video failed", err);
            setViewState("rewarded");
        }
    };

    useEffect(() => {
        if (!token || !metaBase64 || hasInitializedRef.current) return;

        const setupVideo = async () => {
            hasInitializedRef.current = true;

            try {
                // If we don't have initialData (SSR failed or was skipped), fetch on client
                let data = initialData;
                if (!data || data.status === false) {
                    setViewState("loading");
                    data = await getVideoDetails(token, metaBase64);
                }

                if (!data || data.status === false) throw new Error(data?.error || "Video cannot be loaded");
                if (!data.ad_id) throw new Error("Failed to get ad_id");

                setCurrentSecureKey(data?.secure_key);
                setVideoUrl(`${API_CONFIG.API_BASE}/ad/video/${data.ad_id}`);
                setViewState("playing");

                // Track start
                handleStartVideo(data.secure_key);

                const playVideoSafely = async () => {
                    if (!videoRef.current) return;
                    const video = videoRef.current;

                    // Try unmuted autoplay first
                    video.muted = false;
                    video.volume = 1;

                    try {
                        await video.play();
                    } catch {
                        console.warn("Unmuted autoplay blocked, falling back to muted");
                        video.muted = true;
                        try {
                            await video.play();
                            // If muted autoplay succeeded, we still want to try unmuting later
                            // Browsers sometimes allow unmuting via a small delay or if the user interacted globally
                            setTimeout(async () => {
                                if (video.muted) {
                                    video.muted = false;
                                    try {
                                        await video.play();
                                    } catch {
                                        video.muted = true;
                                        console.warn("Still muted due to policy");
                                    }
                                }
                            }, 1000);
                        } catch {
                            console.error("Autoplay completely blocked");
                        }
                    }
                };
                playVideoSafely();

            } catch (err: any) {
                console.error(err);
                setError(err.message || "Unable to load video");
                setViewState("error");
            }
        };

        setupVideo();
    }, [token, metaBase64, initialData]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || viewState !== "playing") return;

        const onLoaded = () => {
            setIsVideoLoading(false);
            video.play().catch(() => { });
        };
        const onTimeUpdate = () => {
            if (!video.duration) return;
            setProgress((video.currentTime / video.duration) * 100);
            lastTimeRef.current = video.currentTime;
        };
        const onSeeking = () => {
            if (Math.abs(video.currentTime - lastTimeRef.current) > 0.5)
                video.currentTime = Math.max(0, lastTimeRef.current - 0.1);
        };
        const onEnded = () => {
            setProgress(100);
            handleVideoComplete();
        };
        const onVolumeChange = () => {
            setIsMuted(video.muted);
        };

        video.addEventListener("loadeddata", onLoaded);
        video.addEventListener("timeupdate", onTimeUpdate);
        video.addEventListener("seeking", onSeeking);
        video.addEventListener("ended", onEnded);
        video.addEventListener("volumechange", onVolumeChange);

        return () => {
            video.removeEventListener("loadeddata", onLoaded);
            video.removeEventListener("timeupdate", onTimeUpdate);
            video.removeEventListener("seeking", onSeeking);
            video.removeEventListener("ended", onEnded);
            video.removeEventListener("volumechange", onVolumeChange);
        };
    }, [viewState, currentSecureKey]);

    const toggleFullscreen = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        if (document.fullscreenElement === video) {
            document.exitFullscreen().catch(() => { });
            setIsCssFs(false);
        } else {
            if (video.requestFullscreen) {
                video.requestFullscreen().catch(() => { });
                setIsCssFs(true);
            }
        }
    }, []);

    useEffect(() => {
        const handleFsChange = () => {
            const video = videoRef.current;
            if (!video) return;
            setIsCssFs(document.fullscreenElement === video);
        };
        document.addEventListener("fullscreenchange", handleFsChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFsChange);
        };
    }, []);

    const handleUserUnmute = () => {
        const video = videoRef.current;
        if (!video) return;
        if (video.muted) {
            video.muted = false;
            video.volume = 1;
            setIsMuted(false);
            video.play().catch(() => { });
        }
    };

    const handleBrowseNow = () => {
        if (typeof window !== 'undefined') {
            window.close();
            // Fallback for browsers that don't allow script-initiated close
            setTimeout(() => {
                window.location.href = "about:blank";
            }, 500);
        }
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex flex-col cursor-pointer"
            onClick={handleUserUnmute}
        >
            <header className="p-4 border-b border-border/10 bg-background/40 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Logo />
                    <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                        <Globe className="h-3.5 w-3.5 text-primary animate-pulse" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Zero-Rated Access</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-3xl">
                    {viewState === "loading" && (
                        <div className="text-center animate-fade-in">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground mb-2">Loading Your Reward</h1>
                            <p className="text-muted-foreground">Preparing your advertisement...</p>
                        </div>
                    )}

                    {viewState === "error" && (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in px-4">
                            <div className="relative w-28 h-28 mb-6">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-400 to-red-600 animate-pulse opacity-30"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <AlertCircle className="h-14 w-14 text-red-700" />
                                </div>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-red-700 mb-3">Oops!</h1>
                            <p className="text-center text-lg text-red-500/80 mb-6 max-w-md">{error}</p>
                            <Button size="lg" onClick={() => window.location.reload()}>Retry Now</Button>
                        </div>
                    )}

                    {viewState === "playing" && (
                        <div ref={rootRef} className={`animate-in fade-in zoom-in-95 duration-700 ${isCssFs ? "fixed inset-0 z-[9999] bg-black flex items-center justify-center p-0" : "p-0 sm:p-4"}`}>
                            <div className={`w-full max-w-4xl mx-auto ${isCssFs ? "h-full" : ""}`}>
                                {/* Main Visual Frame */}
                                <div className={`relative rounded-3xl overflow-hidden bg-zinc-950 shadow-2xl transition-all duration-500 group border border-white/5 ${isCssFs ? "h-full w-full rounded-none" : "aspect-[9/16] sm:aspect-video"}`} onContextMenu={(e) => e.preventDefault()}>

                                    {/* Glass Overlay for Controls */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" />

                                    {isVideoLoading && (
                                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-950">
                                            <div className="w-16 h-16 relative">
                                                <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                                                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                            </div>
                                            <p className="mt-4 text-[10px] font-bold text-primary uppercase tracking-[0.2em] animate-pulse">Initializing Media...</p>
                                        </div>
                                    )}

                                    {videoUrl ? (
                                        <video
                                            ref={videoRef}
                                            src={videoUrl}
                                            playsInline
                                            autoPlay
                                            muted
                                            className={`w-full h-full pointer-events-none transition-transform duration-1000 ${isCssFs ? "object-contain" : "object-cover sm:object-contain"}`}
                                            controls={false}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                                            <Loader2 className="h-10 w-10 animate-spin text-white/20" />
                                        </div>
                                    )}

                                    {/* Action Header Overlay */}
                                    <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-primary bg-primary/20 backdrop-blur-md px-3 py-1 rounded-full border border-primary/30 uppercase tracking-widest">Premium Ad</span>
                                            <h3 className="text-white font-bold text-sm tracking-tight drop-shadow-lg">{adDetails.sponsor}</h3>
                                        </div>
                                        <button
                                            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white transition-all shadow-xl active:scale-95"
                                            onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                                        >
                                            {isCssFs ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                                        </button>
                                    </div>

                                    {/* Progress & Reward Indicators */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center justify-between text-white/90 text-xs font-bold font-mono">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-white/10 px-2 py-0.5 rounded border border-white/5">{Math.round(progress)}%</span>
                                                    <span className="opacity-50 tracking-tighter uppercase">Status: BUFFER_SYNC</span>
                                                </div>
                                                <span className="text-primary tracking-widest uppercase">{adDetails.reward} Bundle</span>
                                            </div>

                                            <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-md border border-white/5">
                                                <div
                                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary/80 to-primary shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all duration-300 ease-out flex items-center justify-end"
                                                    style={{ width: `${progress}%` }}
                                                >
                                                    <div className="w-4 h-full bg-white/40 animate-pulse" />
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center mt-2 px-1">
                                                {[25, 50, 75, 100].map((m) => (
                                                    <div key={m} className={`flex flex-col items-center gap-1.5 transition-all duration-500 ${progress >= m ? "opacity-100 scale-110" : "opacity-30 scale-90"}`}>
                                                        <div className={`w-2.5 h-2.5 rounded-full border-2 ${progress >= m ? "bg-primary border-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]" : "border-white"}`} />
                                                        <span className="text-[8px] font-black text-white/80 tracking-tighter">{m}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mute/Sound Tip (Only shows on mobile when muted) */}
                                    {isMuted && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 animate-pulse sm:hidden">
                                            <div className="bg-black/20 backdrop-blur-xl p-4 rounded-3xl border border-white/5 flex flex-col items-center gap-2 transform -rotate-2">
                                                <Play className="h-8 w-8 text-white/10 fill-white/5" />
                                                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Tap to Enable Audio</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {viewState === "completed" && (
                        <div className="text-center animate-fade-in">
                            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-6" />
                            <h1 className="text-2xl font-bold text-foreground mb-2">Processing Your Reward</h1>
                            <p className="text-muted-foreground">Crediting {adDetails.reward} to your account...</p>
                        </div>
                    )}

                    {viewState === "rewarded" && (
                        <div className="text-center animate-scale-in px-4">
                            <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-green-100 mb-6 shadow-lg">
                                <CheckCircle2 className="h-16 w-16 text-green-600" />
                            </div>
                            <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground mb-3">Congratulations! 🎉</h1>
                            <p className="text-lg text-muted-foreground mb-6">{adDetails.reward} has been successfully credited!</p>
                            <Button size="lg" className="gap-2" onClick={handleBrowseNow}>
                                <Globe className="h-5 w-5" /> Browse Now
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            <footer className="p-4 text-center text-sm text-muted-foreground border-t border-border/50">
                <p>© 2026 AdRewards Platform.</p>
            </footer>
        </div>
    );
}
