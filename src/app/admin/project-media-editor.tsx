"use client";

import Image from "next/image";
import { useState } from "react";
import { Film, Trash2 } from "lucide-react";
import type { ProjectMedia } from "@/lib/portfolio-content";

interface ProjectMediaEditorProps {
    media: ProjectMedia[];
    busy: boolean;
    onChange: (media: ProjectMedia[]) => void;
    onUpload: (file: File, type: ProjectMedia["type"]) => Promise<ProjectMedia>;
}

function isExternalVideoUrl(value: string): boolean {
    try {
        const url = new URL(value);
        const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
        const isVideoHost =
            hostname === "youtube.com" ||
            hostname === "m.youtube.com" ||
            hostname === "youtube-nocookie.com" ||
            hostname === "youtu.be" ||
            hostname === "vimeo.com" ||
            hostname === "player.vimeo.com";
        const isVideoFile = /\.(mp4|webm|ogg)$/i.test(url.pathname);

        return url.protocol === "https:" && (isVideoHost || isVideoFile);
    } catch {
        return false;
    }
}

export default function ProjectMediaEditor({
    media,
    busy,
    onChange,
    onUpload,
}: ProjectMediaEditorProps) {
    const [videoUrl, setVideoUrl] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const uploadFiles = async (
        files: FileList | null,
        type: ProjectMedia["type"],
    ) => {
        const selectedFiles = Array.from(files ?? []);
        if (selectedFiles.length === 0) {
            return;
        }

        setErrorMessage("");
        const uploadedMedia: ProjectMedia[] = [];

        try {
            for (const file of selectedFiles) {
                uploadedMedia.push(await onUpload(file, type));
            }
            onChange([...media, ...uploadedMedia]);
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "Impossible d'ajouter ce média.",
            );
        }
    };

    const addVideoLink = () => {
        const url = videoUrl.trim();
        if (!isExternalVideoUrl(url)) {
            setErrorMessage("Ajoute un lien HTTPS YouTube, Vimeo ou vers une vidéo MP4/WebM/OGG.");
            return;
        }

        setErrorMessage("");
        onChange([...media, { type: "video", src: url }]);
        setVideoUrl("");
    };

    return (
        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
            <div>
                <h3 className="text-sm font-semibold text-slate-800">Médias du projet</h3>
                <p className="mt-1 text-xs text-slate-500">
                    Ajoute plusieurs photos ou vidéos, ou un lien vers une vidéo.
                </p>
            </div>

            {media.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {media.map((item, index) => (
                        <div
                            key={`${item.type}-${item.src}-${index}`}
                            className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                        >
                            {item.type === "image" ? (
                                <Image
                                    src={item.src}
                                    alt={`Photo ${index + 1} du projet`}
                                    width={240}
                                    height={135}
                                    unoptimized
                                    className="h-24 w-full object-cover"
                                />
                            ) : (
                                <div className="grid h-24 place-items-center text-slate-500">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Film aria-hidden="true" size={18} />
                                        Vidéo
                                    </div>
                                </div>
                            )}
                            <button
                                type="button"
                                disabled={busy}
                                onClick={() => onChange(media.filter((_, mediaIndex) => mediaIndex !== index))}
                                className="flex w-full items-center justify-center gap-2 border-t border-slate-200 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                                <Trash2 aria-hidden="true" size={14} />
                                Retirer
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                    Ajouter des photos
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        disabled={busy}
                        onChange={(event) => {
                            void uploadFiles(event.currentTarget.files, "image");
                            event.currentTarget.value = "";
                        }}
                        className="mt-1 block w-full text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-violet-50 file:px-3 file:py-2 file:font-medium file:text-violet-700 hover:file:bg-violet-100"
                    />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                    Ajouter des vidéos
                    <input
                        type="file"
                        accept="video/mp4,video/webm,video/ogg"
                        multiple
                        disabled={busy}
                        onChange={(event) => {
                            void uploadFiles(event.currentTarget.files, "video");
                            event.currentTarget.value = "";
                        }}
                        className="mt-1 block w-full text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-violet-50 file:px-3 file:py-2 file:font-medium file:text-violet-700 hover:file:bg-violet-100"
                    />
                </label>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
                <input
                    type="url"
                    value={videoUrl}
                    disabled={busy}
                    onChange={(event) => setVideoUrl(event.target.value)}
                    placeholder="Lien vidéo HTTPS (YouTube, Vimeo, MP4…)"
                    className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                />
                <button
                    type="button"
                    disabled={busy || !videoUrl.trim()}
                    onClick={addVideoLink}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Ajouter une vidéo par lien
                </button>
            </div>

            {errorMessage && <p role="alert" className="text-sm text-red-700">{errorMessage}</p>}
        </section>
    );
}
