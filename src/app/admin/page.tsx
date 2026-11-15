"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import {
    DEFAULT_PORTFOLIO_CONTENT,
    type EngagementType,
    getEditableFooterText,
    isPortfolioContent,
    type EducationItem,
    type ExperienceItem,
    type FeaturedWorkItem,
    type PortfolioContent,
    type ProjectLink,
    type ProjectMedia,
} from "@/lib/portfolio-content";
import {
    getSupabaseBrowserClient,
    hasSupabaseConfig,
} from "@/lib/supabase-browser";
import ProjectMediaEditor from "./project-media-editor";
import SkillIcon from "../components/home/about-me/skill-icon";

type PageStatus = "checking" | "login" | "ready" | "setup" | "error";
type RecordKey = "caseStudies" | "sideProjects";

const fieldClassName =
    "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200";
const cardClassName = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6";

function Field({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: "text" | "email" | "password";
    placeholder?: string;
}) {
    if (type === "password") {
        return (
            <PasswordField
                label={label}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        );
                }

    return (
        <label className="block text-sm font-medium text-slate-700">
            {label}
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
                className={fieldClassName}
            />
        </label>
    );
}

function ProjectEngagementField({
    value,
    onChange,
}: {
    value: EngagementType | undefined;
    onChange: (value: EngagementType | undefined) => void;
}) {
    return (
        <label className="block text-sm font-medium text-slate-700">
            Libellé du projet
            <select
                value={value ?? ""}
                onChange={(event) => {
                    const selected = event.target.value;
                    onChange(selected === "freelance" || selected === "stage" ? selected : undefined);
                }}
                className={fieldClassName}
            >
                <option value="">Aucun libellé</option>
                <option value="freelance">Freelance</option>
                <option value="stage">Stage</option>
            </select>
        </label>
    );
}

function PasswordField({
    label,
    value,
    onChange,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    const [visible, setVisible] = useState(false);

    return (
        <label className="block text-sm font-medium text-slate-700">
            {label}
            <div className="relative">
                <input
                    type={visible ? "text" : "password"}
                    value={value}
                    placeholder={placeholder}
                    onChange={(event) => onChange(event.target.value)}
                    className={`${fieldClassName} pr-11`}
                />
                <button
                    type="button"
                    aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    aria-pressed={visible}
                    onClick={() => setVisible((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-violet-600"
                >
                    {visible ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
                </button>
            </div>
        </label>
    );
}

function TextArea({
    label,
    value,
    onChange,
    rows = 3,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    rows?: number;
}) {
    return (
        <label className="block text-sm font-medium text-slate-700">
            {label}
            <textarea
                value={value}
                rows={rows}
                onChange={(event) => onChange(event.target.value)}
                className={fieldClassName}
            />
        </label>
    );
}

function ListField({
    label,
    values,
    onChange,
}: {
    label: string;
    values: string[];
    onChange: (values: string[]) => void;
}) {
    return (
        <TextArea
            label={`${label} (une ligne par élément)`}
            value={values.join("\n")}
            onChange={(value) => onChange(value.split(/\r?\n/))}
            rows={Math.max(3, Math.min(values.length + 1, 8))}
        />
    );
}

function SectionCard({
    title,
    description,
    onAdd,
    children,
}: {
    title: string;
    description?: string;
    onAdd?: () => void;
    children: ReactNode;
}) {
    return (
        <section className={cardClassName}>
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                    {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
                </div>
                {onAdd && (
                    <button
                        type="button"
                        onClick={onAdd}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        Ajouter
                    </button>
                )}
            </div>
            {children}
        </section>
    );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
            Supprimer
        </button>
    );
}

function newExperience(): ExperienceItem {
    return {
        role: "",
        location: "",
        startYear: "",
        endYear: "",
        projectUrl: "",
        bulletPoints: [""],
    };
}

function newEducation(): EducationItem {
    return { date: "", title: "", subtitle: "" };
}

function newFeaturedWork(): FeaturedWorkItem {
    return {
        title: "",
        description: "",
        roles: [],
        image: "",
        url: "",
        media: [],
    };
}

function newProjectLink(): ProjectLink {
    return { name: "", url: "", comingSoon: false, media: [] };
}

function updateAt<T>(items: T[], index: number, patch: Partial<T>): T[] {
    return items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
    );
}

function deleteAt<T>(items: T[], index: number): T[] {
    return items.filter((_, itemIndex) => itemIndex !== index);
}

export default function AdminPage() {
    const [status, setStatus] = useState<PageStatus>("checking");
    const [content, setContent] = useState<PortfolioContent>(() =>
        structuredClone(DEFAULT_PORTFOLIO_CONTENT),
    );
    const [openSkillIndex, setOpenSkillIndex] = useState<number | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [notice, setNotice] = useState("");
    const [busy, setBusy] = useState(false);
    const [uploading, setUploading] = useState("");

    useEffect(() => {
        if (!hasSupabaseConfig()) {
            setStatus("setup");
            return;
        }

        let cancelled = false;

        const checkAdmin = async () => {
            try {
                const supabase = getSupabaseBrowserClient();
                const { data: sessionData, error: sessionError } =
                    await supabase.auth.getSession();
                if (sessionError) {
                    throw sessionError;
                }

                if (!sessionData.session) {
                    if (!cancelled) setStatus("login");
                    return;
                }

                const { data: userData, error: userError } = await supabase.auth.getUser();
                if (userError) {
                    throw userError;
                }

                if (!userData.user) {
                    if (!cancelled) setStatus("login");
                    return;
                }

                const { data: membership, error: membershipError } = await supabase
                    .from("portfolio_admins")
                    .select("user_id")
                    .eq("user_id", userData.user.id)
                    .maybeSingle();

                if (membershipError) {
                    throw membershipError;
                }

                if (!membership) {
                    await supabase.auth.signOut();
                    if (!cancelled) {
                        setErrorMessage("Ce compte n'a pas les droits administrateur.");
                        setStatus("login");
                    }
                    return;
                }

                const { data: contentRow, error: contentError } = await supabase
                    .from("portfolio_content")
                    .select("content")
                    .eq("id", "main")
                    .maybeSingle();

                if (contentError) {
                    throw contentError;
                }

                const savedContent: unknown = contentRow?.content;
                if (savedContent !== undefined && !isPortfolioContent(savedContent)) {
                    throw new Error("Le contenu Supabase n'a pas le format attendu.");
                }

                if (!cancelled) {
                    setContent(
                        savedContent && isPortfolioContent(savedContent)
                            ? savedContent
                            : structuredClone(DEFAULT_PORTFOLIO_CONTENT),
                    );
                    setStatus("ready");
                }
            } catch (error) {
                if (!cancelled) {
                    setErrorMessage(
                        error instanceof Error ? error.message : "Une erreur est survenue.",
                    );
                    setStatus("error");
                }
            }
        };

        void checkAdmin();
        return () => {
            cancelled = true;
        };
    }, []);

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setBusy(true);
        setErrorMessage("");

        try {
            const supabase = getSupabaseBrowserClient();
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                throw error;
            }
            setPassword("");
            setStatus("checking");
            window.location.reload();
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "Impossible de se connecter.",
            );
        } finally {
            setBusy(false);
        }
    };

    const saveContent = async () => {
        setBusy(true);
        setErrorMessage("");
        setNotice("");

        try {
            const supabase = getSupabaseBrowserClient();
            const { error } = await supabase
                .from("portfolio_content")
                .upsert(
                    {
                        id: "main",
                        content,
                        updated_at: new Date().toISOString(),
                    },
                    { onConflict: "id" },
                );

            if (error) {
                throw error;
            }

            setNotice("Les modifications ont été enregistrées.");
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "Impossible d'enregistrer le contenu.",
            );
        } finally {
            setBusy(false);
        }
    };

    const uploadFile = async (
        file: File,
        folder: string,
        type: ProjectMedia["type"],
    ): Promise<string> => {
        const allowedTypes: Record<string, string> =
            type === "image"
                ? {
                    "image/jpeg": "jpg",
                    "image/png": "png",
                    "image/webp": "webp",
                    }
                : {
                    "video/mp4": "mp4",
                    "video/webm": "webm",
                    "video/ogg": "ogg",
                };
        const maxFileSize = type === "image" ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
        const sizeLabel = type === "image" ? "5 Mo" : "50 Mo";

        if (!allowedTypes[file.type]) {
            const message =
                type === "image"
                    ? "Choisis une image au format JPG, PNG ou WebP."
                    : "Choisis une vidéo au format MP4, WebM ou OGG.";
            setErrorMessage(message);
            throw new Error(message);
        }
        if (file.size > maxFileSize) {
            const message = `Le fichier ne doit pas dépasser ${sizeLabel}.`;
            setErrorMessage(message);
            throw new Error(message);
        }

        setUploading(folder);
        setErrorMessage("");
        setNotice("");

        try {
            const supabase = getSupabaseBrowserClient();
            const extension = allowedTypes[file.type];
            const path = `${folder}/${crypto.randomUUID()}.${extension}`;
            const { data, error } = await supabase.storage
                .from("portfolio-media")
                .upload(path, file, {
                    cacheControl: "3600",
                    contentType: file.type,
                    upsert: false,
                });

            if (error) {
                throw error;
            }

            const { data: publicUrl } = supabase.storage
                .from("portfolio-media")
                .getPublicUrl(data.path);
            return publicUrl.publicUrl;
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "Impossible d'envoyer ce fichier.",
            );
            throw error;
        } finally {
            setUploading("");
        }
    };

    const uploadImage = async (
        file: File,
        folder: string,
        onUploaded: (url: string) => void,
    ) => {
        try {
            const url = await uploadFile(file, folder, "image");
            onUploaded(url);
            setNotice("Image téléversée. Enregistre les modifications pour la publier.");
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "Impossible d'envoyer cette image.",
            );
        }
    };

    const uploadProjectMedia = async (
        file: File,
        type: ProjectMedia["type"],
        folder: string,
    ): Promise<ProjectMedia> => {
        const src = await uploadFile(file, folder, type);
        setNotice("Média téléversé. Enregistre les modifications pour le publier.");
        return { type, src };
    };

    const signOut = async () => {
        setBusy(true);
        setErrorMessage("");
        try {
            const { error } = await getSupabaseBrowserClient().auth.signOut();
            if (error) {
                throw error;
            }
            setStatus("login");
            setNotice("");
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "Impossible de fermer la session.",
            );
        } finally {
            setBusy(false);
        }
    };

    const updateProfile = (patch: Partial<PortfolioContent["profile"]>) => {
        setContent((current) => ({
            ...current,
            profile: { ...current.profile, ...patch },
        }));
    };

    const updateAbout = (patch: Partial<PortfolioContent["about"]>) => {
        setContent((current) => ({
            ...current,
            about: { ...current.about, ...patch },
        }));
    };

    const updateProjectLinks = (
        key: RecordKey,
        items: ProjectLink[],
    ) => {
        setContent((current) => ({
            ...current,
            projectOverview: { ...current.projectOverview, [key]: items },
        }));
    };

    const updateFeaturedMedia = (index: number, media: ProjectMedia[]) => {
        const image = media.find((item) => item.type === "image")?.src ?? "";
        setContent((current) => ({
            ...current,
            featuredWork: updateAt(current.featuredWork, index, { media, image }),
        }));
    };

    const updateProjectLinkMedia = (
        key: RecordKey,
        index: number,
        media: ProjectMedia[],
    ) => {
        setContent((current) => ({
            ...current,
            projectOverview: {
                ...current.projectOverview,
                [key]: updateAt(current.projectOverview[key], index, { media }),
            },
        }));
    };

    const imageUploadField = (
        label: string,
        folder: string,
        value: string,
        onUploaded: (url: string) => void,
    ) => (
        <div className="space-y-3">
            {value && (
                <Image
                    src={value}
                    alt={`Aperçu : ${label.toLowerCase()}`}
                    width={160}
                    height={100}
                    unoptimized
                    className="max-h-28 w-auto rounded-lg border border-slate-200 object-cover"
                />
            )}
            <label className="block text-sm text-slate-600">
                {label}
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={Boolean(uploading)}
                    onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) void uploadImage(file, folder, onUploaded);
                        event.currentTarget.value = "";
                    }}
                    className="mt-1 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-violet-50 file:px-3 file:py-2 file:font-medium file:text-violet-700 hover:file:bg-violet-100"
                />
            </label>
            {uploading === folder && <p className="text-sm text-slate-500">Envoi en cours…</p>}
        </div>
    );

    if (status === "checking") {
        return (
            <main className="grid min-h-screen place-items-center bg-slate-50 p-6 text-slate-600">
                Vérification de l’accès administrateur…
            </main>
        );
    }

    if (status === "setup") {
        return (
            <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
                <section className={`${cardClassName} max-w-xl`}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
                        Configuration requise
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold text-slate-900">Espace administrateur</h1>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                        Configure Supabase avec les variables de <code>.env.example</code>, puis
                        exécute <code>supabase/schema.sql</code> dans l’éditeur SQL de ton projet.
                        Les étapes de création du compte admin sont dans le README.
                    </p>
                </section>
            </main>
        );
    }

    if (status === "error") {
        return (
            <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
                <section className={`${cardClassName} max-w-xl`}>
                    <h1 className="text-2xl font-semibold text-slate-900">Erreur de configuration</h1>
                    <p role="alert" className="mt-3 text-sm text-red-700">{errorMessage}</p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                    >
                        Réessayer
                    </button>
                </section>
            </main>
        );
    }

    if (status === "login") {
        return (
            <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
                <form onSubmit={handleLogin} className={`${cardClassName} w-full max-w-md`}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
                        Administration
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold text-slate-900">Connexion</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Connecte-toi avec le compte administrateur Supabase.
                    </p>
                    <div className="mt-6 space-y-4">
                        <Field label="Adresse e-mail" type="email" value={email} onChange={setEmail} />
                        <Field label="Mot de passe" type="password" value={password} onChange={setPassword} />
                    </div>
                    {errorMessage && (
                        <p role="alert" className="mt-4 text-sm text-red-700">{errorMessage}</p>
                    )}
                    <button
                        type="submit"
                        disabled={busy || !email || !password}
                        className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {busy ? "Connexion…" : "Se connecter"}
                    </button>
                    <Link
                        href="/"
                        className="mt-3 flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                        Retour au site
                    </Link>
                </form>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
            <div className="mx-auto max-w-5xl">
                <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
                            Portfolio de Yesse
                        </p>
                        <h1 className="mt-1 text-3xl font-semibold text-slate-900">Administration</h1>
                        <p className="mt-2 text-sm text-slate-600">
                            Modifie les sections du site, puis enregistre pour publier.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => void signOut()}
                        disabled={busy}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                    >
                        Se déconnecter
                    </button>
                </header>

                <div className="space-y-6">
                    <SectionCard title="Profil">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Field label="Nom" value={content.profile.name} onChange={(name) => updateProfile({ name })} />
                            <Field label="Titre professionnel" value={content.profile.title} onChange={(title) => updateProfile({ title })} />
                            <Field label="Localisation" value={content.profile.location} onChange={(location) => updateProfile({ location })} />
                            <Field label="Adresse e-mail" type="email" value={content.profile.email} onChange={(emailValue) => updateProfile({ email: emailValue })} />
                        </div>
                        <div className="mt-5 grid gap-5 md:grid-cols-2">
                            {imageUploadField(
                                "Photo de profil",
                                "profile",
                                content.profile.photo,
                                (photo) => updateProfile({ photo }),
                            )}
                            {imageUploadField(
                                "Bannière",
                                "banner",
                                content.profile.banner,
                                (banner) => updateProfile({ banner }),
                            )}
                        </div>
                        <div className="mt-6 border-t border-slate-200 pt-5">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <h3 className="font-medium text-slate-800">Réseaux sociaux</h3>
                                <button
                                    type="button"
                                    onClick={() => updateProfile({ socialLinks: [...content.profile.socialLinks, { label: "", href: "", icon: "" }] })}
                                    className="text-sm font-medium text-violet-700 hover:text-violet-900"
                                >
                                    Ajouter un lien
                                </button>
                            </div>
                            <div className="space-y-4">
                                {content.profile.socialLinks.map((link, index) => (
                                    <div key={`${link.label}-${index}`} className="grid items-center gap-3 rounded-xl bg-slate-50 p-3 sm:grid-cols-[1fr_2fr_1.5fr_auto]">
                                        <Field label="Nom" value={link.label} onChange={(label) => setContent((current) => ({ ...current, profile: { ...current.profile, socialLinks: updateAt(current.profile.socialLinks, index, { label }) } }))} />
                                        <Field label="Lien du réseau" value={link.href} onChange={(href) => setContent((current) => ({ ...current, profile: { ...current.profile, socialLinks: updateAt(current.profile.socialLinks, index, { href }) } }))} />
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="grid size-12 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white">
                                                {link.icon && (
                                                    <Image
                                                        src={link.icon}
                                                        alt=""
                                                        width={28}
                                                        height={28}
                                                        unoptimized
                                                        className="size-7 object-contain"
                                                    />
                                                )}
                                            </div>
                                            <label className="min-w-0 flex-1 text-sm text-slate-600">
                                                Icône
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    disabled={Boolean(uploading)}
                                                    onChange={(event) => {
                                                        const file = event.target.files?.[0];
                                                        if (file) {
                                                            void uploadImage(file, `social/${index}`, (icon) =>
                                                                setContent((current) => ({
                                                                    ...current,
                                                                    profile: {
                                                                        ...current.profile,
                                                                        socialLinks: updateAt(current.profile.socialLinks, index, { icon }),
                                                                    },
                                                                })),
                                                            );
                                                        }
                                                        event.currentTarget.value = "";
                                                    }}
                                                    className="mt-1 block w-full min-w-0 text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-violet-50 file:px-2 file:py-1.5 file:font-medium file:text-violet-700 hover:file:bg-violet-100"
                                                />
                                            </label>
                                        </div>
                                        <RemoveButton onClick={() => updateProfile({ socialLinks: deleteAt(content.profile.socialLinks, index) })} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard title="À propos et compétences">
                        <div className="space-y-4">
                            <Field label="Texte avant la mise en évidence" value={content.about.headlineStart} onChange={(headlineStart) => updateAbout({ headlineStart })} />
                            <Field label="Texte mis en évidence" value={content.about.headlineAccent} onChange={(headlineAccent) => updateAbout({ headlineAccent })} />
                            <TextArea label="Texte après la mise en évidence" value={content.about.headlineEnd} onChange={(headlineEnd) => updateAbout({ headlineEnd })} />
                            <TextArea label="Description" value={content.about.summary} onChange={(summary) => updateAbout({ summary })} />
                            <div className="grid grid-cols-4 gap-3 sm:grid-cols-3">
                                <h3 className="col-span-4 text-sm font-medium text-slate-700 sm:col-span-3">Compétences</h3>
                                {content.about.skills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className="relative flex justify-center sm:items-center sm:justify-start sm:gap-3 sm:rounded-xl sm:border sm:border-slate-200 sm:bg-slate-50 sm:p-3"
                                    >
                                        <div className="relative sm:hidden">
                                            <button
                                                type="button"
                                                aria-label={`Modifier la compétence ${skill || index + 1}`}
                                                aria-expanded={openSkillIndex === index}
                                                onClick={() =>
                                                    setOpenSkillIndex((current) =>
                                                        current === index ? null : index,
                                                    )
                                                }
                                                className="grid size-12 place-items-center rounded-xl border border-slate-200 bg-white"
                                            >
                                                <SkillIcon skill={skill} />
                                            </button>
                                            {openSkillIndex === index && (
                                                <div className="absolute left-1/2 top-full z-30 mt-2 w-64 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <span className="text-sm font-medium text-slate-700">Modifier la compétence</span>
                                                        <button
                                                            type="button"
                                                            aria-label="Fermer"
                                                            onClick={() => setOpenSkillIndex(null)}
                                                            className="grid size-8 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                                                        >
                                                            <X aria-hidden="true" className="size-4" />
                                                        </button>
                                                    </div>
                                                    <Field
                                                        label={`Compétence ${index + 1}`}
                                                        value={skill}
                                                        onChange={(value) =>
                                                            updateAbout({
                                                                skills: content.about.skills.map((item, itemIndex) =>
                                                                    itemIndex === index ? value : item,
                                                                ),
                                                            })
                                                        }
                                                    />
                                                    <div className="mt-3 flex justify-end">
                                                        <RemoveButton
                                                            onClick={() => {
                                                                updateAbout({
                                                                    skills: deleteAt(content.about.skills, index),
                                                                });
                                                                setOpenSkillIndex(null);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <span className="hidden size-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white sm:grid">
                                            <SkillIcon skill={skill} />
                                        </span>
                                        <div className="hidden min-w-0 flex-1 sm:block">
                                            <Field
                                                label={`Compétence ${index + 1}`}
                                                value={skill}
                                                onChange={(value) =>
                                                    updateAbout({
                                                        skills: content.about.skills.map((item, itemIndex) =>
                                                            itemIndex === index ? value : item,
                                                        ),
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="hidden sm:block">
                                            <RemoveButton
                                                onClick={() =>
                                                    updateAbout({
                                                        skills: deleteAt(content.about.skills, index),
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => updateAbout({ skills: [...content.about.skills, ""] })}
                                    className="col-span-4 justify-self-start rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:col-span-3"
                                >
                                    Ajouter une compétence
                                </button>
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard
                        title="Projets à la une"
                        description="Ajoute, modifie ou supprime des projets affichés sur la page d’accueil."
                        onAdd={() => setContent((current) => ({ ...current, featuredWork: [...current.featuredWork, newFeaturedWork()] }))}
                    >
                        <div className="space-y-5">
                            {content.featuredWork.map((item, index) => (
                                <article key={`${item.title}-${index}`} className="rounded-xl bg-slate-50 p-4 sm:p-5">
                                    <div className="mb-4 flex justify-end">
                                        <RemoveButton onClick={() => setContent((current) => ({ ...current, featuredWork: deleteAt(current.featuredWork, index) }))} />
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <Field label="Titre" value={item.title} onChange={(title) => setContent((current) => ({ ...current, featuredWork: updateAt(current.featuredWork, index, { title }) }))} />
                                        <Field label="Lien du projet" value={item.url} onChange={(url) => setContent((current) => ({ ...current, featuredWork: updateAt(current.featuredWork, index, { url }) }))} />
                                        <ProjectEngagementField
                                            value={item.engagementType}
                                            onChange={(engagementType) => setContent((current) => ({ ...current, featuredWork: updateAt(current.featuredWork, index, { engagementType }) }))}
                                        />
                                        <TextArea label="Description" value={item.description} onChange={(description) => setContent((current) => ({ ...current, featuredWork: updateAt(current.featuredWork, index, { description }) }))} />
                                        <ListField label="Rôles et technologies" values={item.roles} onChange={(roles) => setContent((current) => ({ ...current, featuredWork: updateAt(current.featuredWork, index, { roles }) }))} />
                                        <ProjectMediaEditor
                                            media={item.media ?? (item.image ? [{ type: "image", src: item.image }] : [])}
                                            busy={Boolean(uploading)}
                                            onChange={(media) => updateFeaturedMedia(index, media)}
                                            onUpload={(file, type) =>
                                                uploadProjectMedia(file, type, `projects/featured/${index}`)
                                            }
                                        />
                                    </div>
                                </article>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard
                        title="Expériences"
                        onAdd={() => setContent((current) => ({ ...current, experienceData: [...current.experienceData, newExperience()] }))}
                    >
                        <div className="space-y-5">
                            {content.experienceData.map((item, index) => (
                                <article key={`${item.role}-${index}`} className="rounded-xl bg-slate-50 p-4 sm:p-5">
                                    <div className="mb-4 flex justify-end">
                                        <RemoveButton onClick={() => setContent((current) => ({ ...current, experienceData: deleteAt(current.experienceData, index) }))} />
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <Field label="Poste / réalisation" value={item.role} onChange={(role) => setContent((current) => ({ ...current, experienceData: updateAt(current.experienceData, index, { role }) }))} />
                                        <Field label="Lieu / organisation" value={item.location} onChange={(location) => setContent((current) => ({ ...current, experienceData: updateAt(current.experienceData, index, { location }) }))} />
                                        <Field label="Année de début" value={item.startYear} onChange={(startYear) => setContent((current) => ({ ...current, experienceData: updateAt(current.experienceData, index, { startYear }) }))} />
                                        <Field label="Année de fin (ou Present)" value={item.endYear} onChange={(endYear) => setContent((current) => ({ ...current, experienceData: updateAt(current.experienceData, index, { endYear }) }))} />
                                        <Field label="Lien du projet (facultatif)" value={item.projectUrl ?? ""} onChange={(projectUrl) => setContent((current) => ({ ...current, experienceData: updateAt(current.experienceData, index, { projectUrl }) }))} />
                                        <ListField label="Détails" values={item.bulletPoints} onChange={(bulletPoints) => setContent((current) => ({ ...current, experienceData: updateAt(current.experienceData, index, { bulletPoints }) }))} />
                                    </div>
                                </article>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard
                        title="Formation"
                        onAdd={() => setContent((current) => ({ ...current, educationData: [...current.educationData, newEducation()] }))}
                    >
                        <div className="space-y-4">
                            {content.educationData.map((item, index) => (
                                <article key={`${item.title}-${index}`} className="grid gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-[1fr_1fr_2fr_auto]">
                                    <Field label="Date" value={item.date} onChange={(date) => setContent((current) => ({ ...current, educationData: updateAt(current.educationData, index, { date }) }))} />
                                    <Field label="Diplôme" value={item.title} onChange={(title) => setContent((current) => ({ ...current, educationData: updateAt(current.educationData, index, { title }) }))} />
                                    <Field label="Établissement" value={item.subtitle} onChange={(subtitle) => setContent((current) => ({ ...current, educationData: updateAt(current.educationData, index, { subtitle }) }))} />
                                    <RemoveButton onClick={() => setContent((current) => ({ ...current, educationData: deleteAt(current.educationData, index) }))} />
                                </article>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard
                        title="Projets"
                        onAdd={() =>
                            updateProjectLinks("sideProjects", [
                                ...content.projectOverview.sideProjects,
                                newProjectLink(),
                            ])
                        }
                    >
                        <div className="space-y-4">
                            {[
                                ...content.projectOverview.caseStudies.map((item, index) => ({
                                    key: "caseStudies" as const,
                                    item,
                                    index,
                                })),
                                ...content.projectOverview.sideProjects.map((item, index) => ({
                                    key: "sideProjects" as const,
                                    item,
                                    index,
                                })),
                            ].map(({ key, item, index }) => (
                                    <article key={`${key}-${index}-${item.name}`} className="grid gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-[1fr_2fr_auto_auto_auto]">
                                        <Field label="Nom" value={item.name} onChange={(name) => updateProjectLinks(key, updateAt(content.projectOverview[key], index, { name }))} />
                                        <Field label="URL" value={item.url} onChange={(url) => updateProjectLinks(key, updateAt(content.projectOverview[key], index, { url }))} />
                                        <ProjectEngagementField
                                            value={item.engagementType}
                                            onChange={(engagementType) => updateProjectLinks(key, updateAt(content.projectOverview[key], index, { engagementType }))}
                                        />
                                        <label className="flex items-center gap-2 text-sm text-slate-700">
                                            <input
                                                type="checkbox"
                                                checked={item.comingSoon}
                                                onChange={(event) => updateProjectLinks(key, updateAt(content.projectOverview[key], index, { comingSoon: event.target.checked }))}
                                            />
                                            À venir
                                        </label>
                                        <RemoveButton onClick={() => updateProjectLinks(key, deleteAt(content.projectOverview[key], index))} />
                                        <ProjectMediaEditor
                                            media={item.media ?? []}
                                            busy={Boolean(uploading)}
                                            onChange={(media) => updateProjectLinkMedia(key, index, media)}
                                            onUpload={(file, type) =>
                                                uploadProjectMedia(file, type, `projects/${key}/${index}`)
                                            }
                                        />
                                    </article>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard title="Pied de page">
                        <Field label="Texte de bas de page" value={getEditableFooterText(content.footerText)} onChange={(footerText) => setContent((current) => ({ ...current, footerText }))} />
                    </SectionCard>
                </div>

                <div className="sticky bottom-4 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
                    <div aria-live="polite">
                        {errorMessage && <p role="alert" className="text-sm text-red-700">{errorMessage}</p>}
                        {notice && <p className="text-sm text-emerald-700">{notice}</p>}
                    </div>
                    <button
                        type="button"
                        onClick={() => void saveContent()}
                        disabled={busy || Boolean(uploading)}
                        className="rounded-lg bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {busy ? "Enregistrement…" : "Enregistrer les modifications"}
                    </button>
                </div>
            </div>
        </main>
    );
}
