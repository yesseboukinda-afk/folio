"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Film } from "lucide-react";
import type { ProjectMedia } from "@/lib/portfolio-content";

function getVideoEmbedUrl(src: string): string | null {
    try {
        const url = new URL(src);
        const hostname = url.hostname.toLowerCase().replace(/^www\./, "");

        if (hostname === "youtu.be") {
            const videoId = url.pathname.slice(1).split("/")[0];
            return videoId ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}` : null;
        }

        if (
            hostname === "youtube.com" ||
            hostname === "m.youtube.com" ||
            hostname === "youtube-nocookie.com"
        ) {
            const videoId =
                url.searchParams.get("v") ??
                url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1];
            return videoId ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}` : null;
        }

        if (hostname === "vimeo.com" || hostname === "player.vimeo.com") {
            const videoId = url.pathname.split("/").filter(Boolean).pop();
            return videoId && /^\d+$/.test(videoId)
                ? `https://player.vimeo.com/video/${videoId}`
                : null;
        }

        return null;
    } catch {
        return null;
    }
}

export default function ProjectMediaCarousel({
    media,
    fallbackImage,
    title,
}: {
    media?: ProjectMedia[];
    fallbackImage?: string;
    title: string;
}) {
    const items =
        media?.length
            ? media
            : fallbackImage
                ? [{ type: "image" as const, src: fallbackImage }]
                : [];
    const [activeIndex, setActiveIndex] = useState(0);

    if (items.length === 0) {
        return null;
    }

    const currentIndex = activeIndex % items.length;
    const currentItem = items[currentIndex];
    const embedUrl = currentItem.type === "video" ? getVideoEmbedUrl(currentItem.src) : null;

    const selectPrevious = () => {
        setActiveIndex((index) => (index - 1 + items.length) % items.length);
    };
    const selectNext = () => {
        setActiveIndex((index) => (index + 1) % items.length);
    };

    return (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
            {currentItem.type === "image" ? (
                <Image
                    src={currentItem.src}
                    alt={`${title} — image ${currentIndex + 1}`}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                />
            ) : embedUrl ? (
                <iframe
                    src={embedUrl}
                    title={`${title} — vidéo ${currentIndex + 1}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                />
            ) : (
                <video
                    src={currentItem.src}
                    controls
                    preload="metadata"
                    playsInline
                    className="absolute inset-0 h-full w-full object-contain"
                />
            )}

            {items.length > 1 && (
                <>
                    <button
                        type="button"
                        aria-label={`Média précédent pour ${title}`}
                        onClick={selectPrevious}
                        className="absolute left-2 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                    >
                        <ChevronLeft aria-hidden="true" size={20} />
                    </button>
                    <button
                        type="button"
                        aria-label={`Média suivant pour ${title}`}
                        onClick={selectNext}
                        className="absolute right-2 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                    >
                        <ChevronRight aria-hidden="true" size={20} />
                    </button>
                    <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                        {currentItem.type === "video" && <Film aria-hidden="true" size={12} />}
                        <span aria-live="polite">{currentIndex + 1} / {items.length}</span>
                    </div>
                </>
            )}
        </div>
    );
}
