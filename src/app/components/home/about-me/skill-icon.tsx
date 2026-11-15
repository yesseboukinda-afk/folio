import {
    siAngular,
    siCss,
    siCplusplus,
    siDocker,
    siDart,
    siFigma,
    siGit,
    siGithub,
    siGitlab,
    siGo,
    siHtml5,
    siJavascript,
    siKubernetes,
    siLaravel,
    siLinux,
    siMysql,
    siNextdotjs,
    siNodedotjs,
    siPostgresql,
    siPhp,
    siPython,
    siReact,
    siRust,
    siSwift,
    siTailwindcss,
    siTypescript,
    siVuedotjs,
    siWordpress,
    type SimpleIcon,
} from "simple-icons";
import { CodeXml, MonitorSmartphone, PanelsTopLeft, type LucideIcon } from "lucide-react";

const brandIcons: Record<string, SimpleIcon> = {
    html: siHtml5,
    html5: siHtml5,
    css: siCss,
    css3: siCss,
    javascript: siJavascript,
    js: siJavascript,
    php: siPhp,
    python: siPython,
    react: siReact,
    reactjs: siReact,
    reactnative: siReact,
    git: siGit,
    github: siGithub,
    linux: siLinux,
    typescript: siTypescript,
    ts: siTypescript,
    node: siNodedotjs,
    nodejs: siNodedotjs,
    next: siNextdotjs,
    nextjs: siNextdotjs,
    tailwind: siTailwindcss,
    tailwindcss: siTailwindcss,
    docker: siDocker,
    kubernetes: siKubernetes,
    postgresql: siPostgresql,
    postgres: siPostgresql,
    mysql: siMysql,
    gitlab: siGitlab,
    figma: siFigma,
    wordpress: siWordpress,
    laravel: siLaravel,
    vue: siVuedotjs,
    vuejs: siVuedotjs,
    angular: siAngular,
    cpp: siCplusplus,
    cplusplus: siCplusplus,
    go: siGo,
    rust: siRust,
    swift: siSwift,
    dart: siDart,
};

const interfaceIcons: Record<string, LucideIcon> = {
    responsivedesign: MonitorSmartphone,
    responsive: MonitorSmartphone,
    uidevelopment: PanelsTopLeft,
    ui: PanelsTopLeft,
};

export default function SkillIcon({ skill }: { skill: string }) {
    const key = skill
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
    const brandIcon = brandIcons[key];

    if (brandIcon) {
        return (
            <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-4 shrink-0"
                fill={`#${brandIcon.hex}`}
            >
                <path d={brandIcon.path} />
            </svg>
        );
    }

    const Icon = interfaceIcons[key] ?? CodeXml;
    return <Icon aria-hidden="true" className="size-4 shrink-0 text-violet-700" />;
}
