export interface SocialLink {
    label: string;
    href: string;
    icon: string;
}

export interface ProjectMedia {
    type: "image" | "video";
    src: string;
}

export type EngagementType = "freelance" | "stage";

export interface FeaturedWorkItem {
    title: string;
    description: string;
    roles: string[];
    image: string;
    url: string;
    engagementType?: EngagementType;
    media?: ProjectMedia[];
}

export interface ExperienceItem {
    role: string;
    location: string;
    startYear: string;
    endYear: string;
    projectUrl?: string;
    bulletPoints: string[];
}

export interface EducationItem {
    date: string;
    title: string;
    subtitle: string;
}

export interface ProjectLink {
    name: string;
    url: string;
    comingSoon: boolean;
    engagementType?: EngagementType;
    media?: ProjectMedia[];
}

export interface PortfolioContent {
    profile: {
        name: string;
        title: string;
        location: string;
        email: string;
        photo: string;
        banner: string;
        resumeUrl: string;
        socialLinks: SocialLink[];
    };
    about: {
        headlineStart: string;
        headlineAccent: string;
        headlineEnd: string;
        summary: string;
        skills: string[];
    };
    featuredWork: FeaturedWorkItem[];
    experienceData: ExperienceItem[];
    educationData: EducationItem[];
    projectOverview: {
        caseStudies: ProjectLink[];
        sideProjects: ProjectLink[];
    };
    footerText: string;
}

export const DEFAULT_PORTFOLIO_CONTENT: PortfolioContent = {
    profile: {
        name: "Yesse Boukinda",
        title: "Développeur web et mobile",
        location: "Gabon",
        email: "yesseboukinda@gmail.com",
        photo: "/images/hero-sec/user-img.png",
        banner: "/images/hero-sec/banner-bg-img.png",
        resumeUrl: "",
        socialLinks: [
            {
                label: "GitHub",
                href: "https://github.com/yesseboukinda-afk",
                icon: "/images/icon/github-icon.svg",
            },
            {
                label: "Facebook",
                href: "https://web.facebook.com/profile.php?id=61579006270270",
                icon: "/images/icon/facebook-icon.svg",
            },
            {
                label: "WhatsApp",
                href: "https://wa.me/241077058307",
                icon: "/images/icon/whatsapp-icon.svg",
            },
            {
                label: "Gmail",
                href: "mailto:yesseboukinda@gmail.com",
                icon: "/images/icon/gmail-icon.svg",
            },
        ],
    },
    about: {
        headlineStart: "Bonjour. Je suis Yesse,",
        headlineAccent: "développeur web et mobile",
        headlineEnd: ", et je crée des solutions numériques claires, accessibles et adaptées aux besoins réels.",
        summary: "Je transforme les idées en sites web et applications fonctionnels, de la conception au déploiement.",
        skills: [
            "HTML",
            "CSS",
            "JavaScript",
            "PHP",
            "React Native",
            "Responsive Design",
            "Git",
            "GitHub",
            "Linux",
            "UI Development",
        ],
    },
    featuredWork: [
        {
            title: "Conception d'une GED",
            description: "Conception et mise en ligne d'une gestion électronique de documents.",
            roles: ["Webmaster", "Développeur"],
            image: "/images/feature-work/feature-img-1.png",
            url: "https://opensource.gt.tc",
        },
        {
            title: "Messenger-Linu",
            description: "Version de Messenger-Linu disponible sur GitHub.",
            roles: ["Développeur web", "GitHub"],
            image: "/images/feature-work/feature-img-2.png",
            url: "https://github.com/yesseboukinda-afk/messenger-linu",
        },
        {
            title: "Application mobile du CNTS",
            description: "Application mobile développée pour le CNTS.",
            roles: ["Développeur mobile", "React Native"],
            image: "/images/feature-work/feature-img-1.png",
            url: "",
        },
    ],
    experienceData: [
        {
            role: "Mise en place d'un système de vidéosurveillance",
            location: "EIT Groupe, Port-Gentil",
            startYear: "2025",
            endYear: "2025",
            bulletPoints: [
                "Déploiement du système de vidéosurveillance pour le groupe EIT",
                "Installation et configuration des caméras et du serveur de stockage vidéo",
                "Maintenance et suivi technique du système",
            ],
        },
        {
            role: "Création d'une gestion électronique de documents",
            location: "EIT Groupe",
            startYear: "2026",
            endYear: "2026",
            bulletPoints: [
                "Conception et réalisation d'une solution de gestion électronique de documents",
                "Mise en ligne et documentation de la solution",
                "Accompagnement de l'équipe dans son utilisation",
            ],
        },
    ],
    educationData: [
        {
            date: "2023",
            title: "BAC A1",
            subtitle: "Lycée",
        },
        {
            date: "2025",
            title: "DTS en MMI",
            subtitle: "Institut national de la Poste, des Technologies de l'Information et de la Communication",
        },
        {
            date: "2026 - en cours",
            title: "Licence 3",
            subtitle: "Institut national de la Poste, des Technologies de l'Information et de la Communication",
        },
    ],
    projectOverview: {
        caseStudies: [
            { name: "Conception d'une GED", url: "https://opensource.gt.tc", comingSoon: false },
            {
                name: "Messenger-Linu",
                url: "https://github.com/yesseboukinda-afk/messenger-linu",
                comingSoon: false,
            },
            { name: "Application mobile du CNTS", url: "", comingSoon: false },
        ],
        sideProjects: [
            {
                name: "Messenger-Linu",
                url: "https://github.com/yesseboukinda-afk/messenger-linu",
                comingSoon: false,
            },
        ],
    },
    footerText: "2026 © Conception et maintenance par Yesse Boukinda",
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasStringFields(value: unknown, fields: string[]): boolean {
    return isRecord(value) && fields.every((field) => typeof value[field] === "string");
}

function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isProjectMedia(value: unknown): value is ProjectMedia[] {
    return (
        Array.isArray(value) &&
        value.every(
            (item) =>
                hasStringFields(item, ["src"]) &&
                isRecord(item) &&
                (item.type === "image" || item.type === "video"),
        )
    );
}

function hasOptionalProjectMedia(value: Record<string, unknown>): boolean {
    return value.media === undefined || isProjectMedia(value.media);
}

function hasOptionalEngagementType(value: Record<string, unknown>): boolean {
    return (
        value.engagementType === undefined ||
        value.engagementType === "freelance" ||
        value.engagementType === "stage"
    );
}

function isSocialLinks(value: unknown): value is SocialLink[] {
    return (
        Array.isArray(value) &&
        value.every((item) => hasStringFields(item, ["label", "href", "icon"]))
    );
}

function isFeaturedWork(value: unknown): value is FeaturedWorkItem[] {
    return (
        Array.isArray(value) &&
        value.every(
            (item) =>
                hasStringFields(item, ["title", "description", "image", "url"]) &&
                isRecord(item) &&
                isStringArray(item.roles) &&
                hasOptionalEngagementType(item) &&
                hasOptionalProjectMedia(item),
        )
    );
}

function isExperience(value: unknown): value is ExperienceItem[] {
    return (
        Array.isArray(value) &&
        value.every(
            (item) =>
                hasStringFields(item, ["role", "location", "startYear", "endYear"]) &&
                isRecord(item) &&
                (item.projectUrl === undefined || typeof item.projectUrl === "string") &&
                isStringArray(isRecord(item) ? item.bulletPoints : undefined),
        )
    );
}

function isEducation(value: unknown): value is EducationItem[] {
    return (
        Array.isArray(value) &&
        value.every((item) => hasStringFields(item, ["date", "title", "subtitle"]))
    );
}

function isProjectLinks(value: unknown): value is ProjectLink[] {
    return (
        Array.isArray(value) &&
        value.every(
            (item) =>
                hasStringFields(item, ["name", "url"]) &&
                isRecord(item) &&
                typeof item.comingSoon === "boolean" &&
                hasOptionalEngagementType(item) &&
                hasOptionalProjectMedia(item),
        )
    );
}

export function isPortfolioContent(value: unknown): value is PortfolioContent {
    if (!isRecord(value) || !isRecord(value.profile) || !isRecord(value.about)) {
        return false;
    }

    return (
        hasStringFields(value.profile, [
            "name",
            "title",
            "location",
            "email",
            "photo",
            "banner",
            "resumeUrl",
        ]) &&
        isSocialLinks(value.profile.socialLinks) &&
        hasStringFields(value.about, ["headlineStart", "headlineAccent", "headlineEnd", "summary"]) &&
        isStringArray(value.about.skills) &&
        isFeaturedWork(value.featuredWork) &&
        isExperience(value.experienceData) &&
        isEducation(value.educationData) &&
        isRecord(value.projectOverview) &&
        isProjectLinks(value.projectOverview.caseStudies) &&
        isProjectLinks(value.projectOverview.sideProjects) &&
        typeof value.footerText === "string"
    );
}
