import { Badge } from "@/components/ui/badge";
import type { PortfolioContent } from "@/lib/portfolio-content";
import SkillIcon from "./skill-icon";

const AboutMe = ({ about }: { about: PortfolioContent["about"] }) => {
    return (
        <section>
            <div className="container">
                <div className="border-x border-primary/10 bg-[url('/images/about-me/about-me-bg.svg')] bg-cover bg-center bg-no-repeat">
                    <div className="flex flex-col gap-9 sm:gap-12 max-w-3xl mx-auto px-4 sm:px-7 py-11 md:py-20">
                        <div className="flex flex-col gap-4">
                            <p className="text-sm tracking-[2px] text-primary uppercase font-medium">À propos</p>
                            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px]">{about.headlineStart} <span className="bg-[linear-gradient(90deg,_rgba(243,202,77,0.4)_0%,_rgba(243,202,77,0.05)_100%)]">{about.headlineAccent}</span>{about.headlineEnd}</h2>
                            <h5 className="text-secondary font-normal">{about.summary}</h5>
                        </div>
                        <div className="flex flex-col gap-4">
                            <p className="text-sm text-primary uppercase font-medium">Compétences</p>
                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                {about.skills.map((value, index) => {
                                    return (
                                        <Badge variant={"outline"} key={`${value}-${index}`} className="py-1.5 px-3 rounded-lg">
                                            <span className="flex items-center gap-2 text-xs sm:text-sm font-medium text-primary">
                                                <SkillIcon skill={value} />
                                                {value}
                                            </span>
                                        </Badge>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutMe