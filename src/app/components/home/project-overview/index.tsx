import Link from "next/link";
import type { PortfolioContent, ProjectLink, ProjectMedia } from "@/lib/portfolio-content";
import ProjectMediaCarousel from "../project-media-carousel";

type ProjectCardData = Omit<ProjectLink, "media"> & {
    description: string;
    roles: string[];
    media: ProjectMedia[];
};

function getProjectMedia(
    project: ProjectLink,
    featuredWork: PortfolioContent["featuredWork"],
): ProjectMedia[] {
    if (project.media !== undefined) {
        return project.media;
    }

    const relatedProject = featuredWork.find(
        (item) =>
            (project.url && item.url === project.url) ||
            item.title.toLowerCase() === project.name.toLowerCase(),
    );

    if (!relatedProject) {
        return [];
    }

    return relatedProject.media?.length
        ? relatedProject.media
        : relatedProject.image
            ? [{ type: "image", src: relatedProject.image }]
            : [];
}

function getUniqueProjects(
    featuredWork: PortfolioContent["featuredWork"],
    projectOverview: PortfolioContent["projectOverview"],
): ProjectCardData[] {
    const projects: ProjectCardData[] = [];

    const addProject = (project: ProjectCardData) => {
        const normalizedName = project.name.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const normalizedUrl = project.url.trim().replace(/\/+$/, "").toLowerCase();
        const duplicateIndex = projects.findIndex((existing) => {
            const existingName = existing.name.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            const existingUrl = existing.url.trim().replace(/\/+$/, "").toLowerCase();

            return (
                (normalizedName && normalizedName === existingName) ||
                (normalizedUrl && normalizedUrl === existingUrl)
            );
        });

        if (duplicateIndex === -1) {
            projects.push(project);
            return;
        }

        const existing = projects[duplicateIndex];
        const mergedMedia = [...existing.media, ...project.media].filter(
            (media, index, allMedia) =>
                allMedia.findIndex((item) => item.type === media.type && item.src === media.src) === index,
        );
        const url = existing.url || project.url;

        projects[duplicateIndex] = {
            ...existing,
            url,
            comingSoon: (existing.comingSoon || project.comingSoon) && !url,
            engagementType: existing.engagementType ?? project.engagementType,
            description: existing.description || project.description,
            roles: [...new Set([...existing.roles, ...project.roles])],
            media: mergedMedia,
        };
    };

    featuredWork.forEach((project) => {
        addProject({
            name: project.title,
            url: project.url,
            comingSoon: false,
            engagementType: project.engagementType,
            description: project.description,
            roles: project.roles,
            media: project.media?.length
                ? project.media
                : project.image
                    ? [{ type: "image", src: project.image }]
                    : [],
        });
    });

    [...projectOverview.caseStudies, ...projectOverview.sideProjects].forEach((project) => {
        addProject({
            name: project.name,
            url: project.url,
            comingSoon: project.comingSoon,
            engagementType: project.engagementType,
            description: "",
            roles: [],
            media: getProjectMedia(project, featuredWork),
        });
    });

    return projects;
}

function ProjectCard({
    project,
}: {
    project: ProjectCardData;
}) {
    return (
        <article className="flex min-w-0 flex-col gap-3 rounded-xl border border-primary/10 p-3">
            <ProjectMediaCarousel media={project.media} title={project.name} />
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 flex-col items-start gap-1">
                    <h4 className={project.comingSoon ? "text-muted-foreground" : ""}>
                        {project.name}
                    </h4>
                    {project.url && !project.comingSoon && (
                        <Link
                            href={project.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="max-w-full break-all text-sm font-medium text-violet-700 underline decoration-violet-300 underline-offset-2 transition hover:text-violet-900"
                        >
                            {project.url.replace(/^https?:\/\//, "")}
                        </Link>
                    )}
                </div>
                {project.comingSoon && (
                    <span className="whitespace-nowrap rounded-lg border border-slate-300 bg-slate-100 px-3 py-1.5 text-sm font-semibold leading-5 text-slate-800">
                        Bientôt disponible
                    </span>
                )}
                {project.engagementType && (
                    <span className="whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold leading-5 text-emerald-900">
                        {project.engagementType === "freelance" ? "Freelance" : "Stage"}
                    </span>
                )}
            </div>
            {project.roles.length > 0 && (
                <p className="text-sm text-secondary">{project.roles.join(", ")}</p>
            )}
            {project.description && (
                <p className="text-sm text-secondary">{project.description}</p>
            )}
        </article>
    );
}

const ProjectOverview = ({
    projectOverview,
    featuredWork,
}: {
    projectOverview: PortfolioContent["projectOverview"];
    featuredWork: PortfolioContent["featuredWork"];
}) => {
    const projects = getUniqueProjects(featuredWork, projectOverview);

    return (
        <section>
            <div className="container">
                <div className="border-x border-primary/10">
                    <div className="flex flex-col max-w-3xl mx-auto px-4 sm:px-7 py-9 md:py-16">
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                            <p className="text-sm tracking-[2px] text-primary uppercase font-medium">
                                Projets
                            </p>
                        </div>
                        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                            {projects.map((project, index) => (
                                <ProjectCard key={`${project.name}-${index}`} project={project} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectOverview;
