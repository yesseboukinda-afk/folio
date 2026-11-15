import Link from "next/link"
import type { PortfolioContent } from "@/lib/portfolio-content";
import ProjectMediaCarousel from "../project-media-carousel";

const FeaturedWork = ({
    featuredWork,
}: {
    featuredWork: PortfolioContent["featuredWork"];
}) => {
    return (
        <section>
            <div className="container">
                <div className="border-x border-primary/10">
                    <div className="flex flex-col max-w-3xl mx-auto py-10 px-4 sm:px-7">
                        <div className="flex flex-col xs:flex-row gap-5 items-center justify-between">
                            <p className="text-sm tracking-[2px] text-primary uppercase font-medium">Featured work</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 border-t border-primary/10">
                        {featuredWork.map((value, index) => {
                            const isRightCol = index % 2 === 1;

                            return (
                                <div
                                    key={`${value.title}-${index}`}
                                    className={`group flex flex-col gap-3.5 sm:gap-5 p-3.5 sm:p-6 ${isRightCol ? 'md:border-l md:border-primary/10' : ''}`}
                                >
                                    <ProjectMediaCarousel
                                        media={value.media}
                                        fallbackImage={value.image}
                                        title={value.title}
                                    />
                                    <div className="flex flex-col gap-1 sm:gap-2 px-2">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            {value.url ? (
                                                <Link href={value.url} target="_blank" rel="noreferrer noopener">
                                                    <h4>{value.title}</h4>
                                                </Link>
                                            ) : (
                                                <h4>{value.title}</h4>
                                            )}
                                            {value.engagementType && (
                                                <span className="whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold leading-5 text-emerald-900">
                                                    {value.engagementType === "freelance" ? "Freelance" : "Stage"}
                                                </span>
                                            )}
                                        </div>
                                        <p>{value.roles.join(", ")}</p>
                                        {value.description && <p className="text-sm">{value.description}</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    )
}

export default FeaturedWork