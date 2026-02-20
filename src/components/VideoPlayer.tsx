import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  onComplete: () => void;
}

const VideoPlayer = ({ videoUrl, onComplete }: VideoPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoading(false);
      video.play();
    };

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleEnded = () => {
      onComplete();
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [onComplete]);

  // Prevent context menu (right-click)
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Ad in progress label */}
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-primary rounded-full text-sm font-medium">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse-orange" />
          Ad in progress
        </span>
      </div>

      {/* Video container */}
      <div 
        className="relative bg-foreground/5 rounded-2xl overflow-hidden aspect-video shadow-xl"
        onContextMenu={handleContextMenu}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading advertisement...</p>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          disablePictureInPicture
          controlsList="nodownload noplaybackrate"
          onContextMenu={handleContextMenu}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Custom progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-foreground/10">
          <div 
            className="h-full bg-gradient-to-r from-primary to-orange-600 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Progress percentage */}
      <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
        <span>Please watch the complete advertisement</span>
        <span className="font-medium text-primary">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

export default VideoPlayer;
