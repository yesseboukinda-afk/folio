"use client";

import Image from "next/image";
import { useRef, useState } from "react";
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
    const carouselRef = useRef<HTMLDivElement>(null);

    if (items.length === 0) {
        return null;
    }

    const currentIndex = Math.min(activeIndex, items.length - 1);
    const scrollToIndex = (index: number) => {
        const carousel = carouselRef.current;
        if (!carousel) {
            return;
        }

        carousel.scrollTo({
            left: index * carousel.clientWidth,
            behavior: "smooth",
        });
        setActiveIndex(index);
    };

    const selectPrevious = () => {
        scrollToIndex((currentIndex - 1 + items.length) % items.length);
    };
    const selectNext = () => {
        scrollToIndex((currentIndex + 1) % items.length);
    };

    return (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
            <div
                ref={carouselRef}
                onScroll={(event) => {
                    const carousel = event.currentTarget;
                    const index = Math.round(carousel.scrollLeft / carousel.clientWidth);
                    setActiveIndex(Math.min(index, items.length - 1));
                }}
                className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {items.map((item, index) => {
                    const embedUrl = item.type === "video" ? getVideoEmbedUrl(item.src) : null;

                    return (
                        <div
                            key={`${item.type}-${item.src}-${index}`}
                            className={`relative h-full w-full shrink-0 snap-center transition-opacity duration-500 ease-in-out motion-reduce:transition-none ${
                                index === currentIndex ? "opacity-100" : "opacity-75"
                            }`}
                        >
                            {item.type === "image" ? (
                                <Image
                                    src={item.src}
                                    alt={`${title} — image ${index + 1}`}
                                    fill
                                    unoptimized
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover"
                                />
                            ) : index !== currentIndex ? (
                                <div className="h-full w-full bg-slate-200" aria-hidden="true" />
                            ) : embedUrl ? (
                                <iframe
                                    src={embedUrl}
                                    title={`${title} — vidéo ${index + 1}`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="absolute inset-0 h-full w-full border-0"
                                />
                            ) : (
                                <video
                                    src={item.src}
                                    controls
                                    preload="metadata"
                                    playsInline
                                    className="absolute inset-0 h-full w-full object-contain"
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {items.length > 1 && (
                <>
                    <button
                        type="button"
                        aria-label={`Média précédent pour ${title}`}
                        onClick={selectPrevious}
                        className="absolute left-2 top-1/2 z-10 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white transition hover:bg-black/80 lg:grid"
                    >
                        <ChevronLeft aria-hidden="true" size={20} />
                    </button>
                    <button
                        type="button"
                        aria-label={`Média suivant pour ${title}`}
                        onClick={selectNext}
                        className="absolute right-2 top-1/2 z-10 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white transition hover:bg-black/80 lg:grid"
                    >
                        <ChevronRight aria-hidden="true" size={20} />
                    </button>
                    <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/75 px-3 py-1.5 text-sm font-semibold text-white">
                        {items[currentIndex].type === "video" && <Film aria-hidden="true" size={12} />}
                        <span aria-live="polite">{currentIndex + 1} / {items.length}</span>
                    </div>
                </>
            )}
        </div>
    );
}
