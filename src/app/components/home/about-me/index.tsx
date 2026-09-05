import { Badge } from "@/components/ui/badge";

const AboutMe = () => {
    const servicesBedge = ["HTML", "CSS", "JavaScript", "PHP", "React Native", "Responsive Design", "Git", "GitHub", "Linux", "UI Development"];
    return (
        <section>
            <div className="container">
                <div className="border-x border-primary/10 bg-[url('/images/about-me/about-me-bg.svg')] bg-cover bg-center bg-no-repeat">
                    <div className="flex flex-col gap-9 sm:gap-12 max-w-3xl mx-auto px-4 sm:px-7 py-11 md:py-20">
                        <div className="flex flex-col gap-4">
                            <p className="text-sm tracking-[2px] text-primary uppercase font-medium">À propos</p>
                            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px]">Bonjour. Je suis Yesse, <span className="bg-[linear-gradient(90deg,_rgba(243,202,77,0.4)_0%,_rgba(243,202,77,0.05)_100%)]">développeur web et mobile</span>, et je crée des solutions numériques claires, accessibles et adaptées aux besoins réels.</h2>
                            <h5 className="text-secondary font-normal">Je transforme les idées en sites web et applications fonctionnels, de la conception au déploiement.</h5>
                        </div>
                        <div className="flex flex-col gap-4">
                            <p className="text-sm text-primary uppercase font-medium">Compétences</p>
                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                {servicesBedge?.map((value, index) => {
                                    return (
                                        <Badge variant={"outline"} key={index} className="py-1.5 px-3 rounded-lg">
                                            <p className="text-xs sm:text-sm font-medium text-primary">{value}</p>
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