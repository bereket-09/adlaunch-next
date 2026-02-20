// File: src/components/EnhancedVideoPlayer.tsx

import { useState, useRef, useEffect, useCallback } from "react";
import { Loader2, CheckCircle2, Maximize2, Minimize2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  videoUrl: string;
  onComplete: () => void;
  adDetails?: {
    sponsor: string;
    duration: string; // "30s"
    reward: string;
    rewardType: 'data' | 'voice' | 'sms';
  };
}

const EnhancedVideoPlayer = ({ videoUrl, onComplete, adDetails }: VideoPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [watchTime, setWatchTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [replays, setReplays] = useState(0);
  const [isNativeFs, setIsNativeFs] = useState(false);
  const [isCssFs, setIsCssFs] = useState(false);
  const [preventSeek, setPreventSeek] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lastTimeRef = useRef(0);

  // Enter/exit CSS fullscreen (fallback)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onFullChange = () => {
      const native = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      setIsNativeFs(native);
    };
    document.addEventListener('fullscreenchange', onFullChange);
    return () => document.removeEventListener('fullscreenchange', onFullChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => {
      setIsLoading(false);
      setStartTime(Date.now());
      // autoplay once ready
      video.play().catch(() => {});
    };

    const onTimeUpdate = () => {
      if (!video.duration) return;
      const pct = (video.currentTime / video.duration) * 100;
      setProgress(pct);
      setWatchTime(Math.floor(video.currentTime));
      lastTimeRef.current = video.currentTime;
    };

    const onSeeking = () => {
      if (!preventSeek) return;
      // If user tries to seek, jump back to lastTimeRef
      if (Math.abs((video.currentTime || 0) - (lastTimeRef.current || 0)) > 0.5) {
        // force revert
        video.currentTime = Math.max(0, lastTimeRef.current - 0.1);
      }
    };

    const onEnded = () => {
      // ensure 100% progress
      setProgress(100);
      // emit analytics
      const payload = {
        startTime: startTime ? new Date(startTime).toISOString() : undefined,
        endTime: new Date().toISOString(),
        watchTime: Math.floor(watchTime),
        completionRate: 100,
        replays,
        device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        ua: navigator.userAgent,
      };
      console.log('ad:complete', payload);
      onComplete();
    };

    video.addEventListener('loadeddata', onLoaded);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('seeking', onSeeking);
    video.addEventListener('ended', onEnded);

    return () => {
      video.removeEventListener('loadeddata', onLoaded);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('seeking', onSeeking);
      video.removeEventListener('ended', onEnded);
    };
  }, [onComplete, preventSeek, startTime, watchTime, replays]);

  // prevent context menu
  const handleContextMenu = (e: React.MouseEvent) => e.preventDefault();

  // Fullscreen helpers: try native first, fall back to CSS fullscreen
  const enterFullscreen = useCallback(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    // Native requestFullscreen
    const request = (root.requestFullscreen || (root as any).webkitRequestFullscreen || (root as any).msRequestFullscreen);
    if (request) {
      request.call(root).then(() => setIsNativeFs(true)).catch(() => {
        // fallback to CSS fullscreen
        root.classList.add('app-fullscreen');
        setIsCssFs(true);
      });
      return;
    }

    // Fallback
    root.classList.add('app-fullscreen');
    setIsCssFs(true);
  }, []);

  const exitFullscreen = useCallback(() => {
    const root = rootRef.current;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      setIsNativeFs(false);
      return;
    }
    if (root) {
      root.classList.remove('app-fullscreen');
      setIsCssFs(false);
    }
  }, []);

  // toggle fullscreen
  const toggleFullscreen = () => {
    if (document.fullscreenElement || isCssFs) exitFullscreen();
    else enterFullscreen();
  };

  return (
    <div id="enhanced-player-root" ref={rootRef} className={`relative w-full ${isCssFs ? 'h-screen fixed inset-0 z-[9999] bg-black flex items-center justify-center' : ''}`}>

      {/* Card top: reward + sponsor */}
      <div className={`w-full max-w-3xl ${isCssFs ? 'mx-auto' : ''}`}>
        <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-orange-50 border border-primary/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary text-white"><CheckCircle2 className="h-4 w-4" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Reward</p>
              <p className="text-sm font-semibold">{adDetails?.reward || '50MB Data'}</p>
            </div>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <div>Sponsored by</div>
            <div className="font-semibold text-foreground">{adDetails?.sponsor || 'Sponsor'}</div>
          </div>
        </div>

        {/* Video container */}
        <div className={`relative rounded-2xl overflow-hidden bg-black shadow-lg ${isCssFs ? 'h-[92vh]' : 'aspect-video'}`} onContextMenu={handleContextMenu}>

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-3" />
                <div className="text-sm text-white/80">Loading your ad…</div>
              </div>
            </div>
          )}

          {/* Video element */}
          <video
            ref={videoRef}
            playsInline
            className="w-full h-full object-cover"
            disablePictureInPicture
            controls={false}
            controlsList="nodownload noplaybackrate"
            onContextMenu={handleContextMenu}
            // Make it difficult to interact (we also block seeking via events)
            style={{ pointerEvents: 'auto', background: 'black' }}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* UI Overlay (controls disabled except fullscreen) */}
          <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur border border-white/10 text-white"
              onClick={toggleFullscreen}
              aria-label="Toggle fullscreen"
            >
              { (document.fullscreenElement || isCssFs) ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" /> }
            </button>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 z-20">
            <Progress value={Math.min(100, Math.round(progress))} className="h-1.5" />
          </div>

        </div>

        {/* Progress & badges */}
        <div className="mt-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="inline-flex items-center gap-2 px-2 py-1 bg-orange-50 rounded-full">Ad in progress</div>
            <div className="text-muted-foreground">{Math.round(progress)}%</div>
          </div>

          <div className="flex items-center gap-2">
            { [25, 50, 75, 100].map((m) => (
              <div key={m} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${progress >= m ? 'bg-primary text-white' : 'bg-white/10 text-muted-foreground'}`}>
                {progress >= m ? '✓' : m}
              </div>
            )) }
          </div>
        </div>

      </div>

      {/* CSS fullscreen styles - injected class 'app-fullscreen' handled by global CSS in your app */}
      <style>{`
        /* Fallback fullscreen styles when .app-fullscreen is added to #enhanced-player-root */
        #enhanced-player-root.app-fullscreen { position: fixed !important; inset: 0 !important; z-index: 99999 !important; display:flex; align-items:center; justify-content:center; }
        #enhanced-player-root.app-fullscreen .aspect-video { height: 92vh; width: auto; max-width: 100%; }
      `}</style>

    </div>
  );
};

export default EnhancedVideoPlayer;
