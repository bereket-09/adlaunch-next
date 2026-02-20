"use client";

import { useEffect, useState } from "react";

interface VideoThumbnailProps {
    videoSrc: string; // URL or object URL
    fallback?: string; // placeholder
}

export default function VideoThumbnail({ videoSrc, fallback = "/placeholder.svg" }: VideoThumbnailProps) {
    const [thumb, setThumb] = useState<string>(fallback);

    useEffect(() => {
        if (!videoSrc) return;

        const video = document.createElement("video");
        video.src = videoSrc;
        video.crossOrigin = "anonymous";

        video.addEventListener("loadeddata", () => {
            video.currentTime = 2; // pick 2 seconds in
        });

        video.addEventListener("seeked", () => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            setThumb(canvas.toDataURL("image/png")); // set thumbnail
        });
    }, [videoSrc]);

    return <img src={thumb} alt="Video thumbnail" className="w-full h-full object-cover" />;
}
