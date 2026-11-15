import Image from "next/image"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { PortfolioContent } from "@/lib/portfolio-content";
import Education from "../education";

const HeroSection = ({
    profile,
}: {
    profile: PortfolioContent["profile"];
}) => {
    return (
        <section>
            <div className="container">
                <div className="">
                    <div className="w-full h-72">
                        <Image src={profile.banner} alt="Bannière du portfolio" width={1080} height={267} unoptimized className="w-full h-full object-cover" />
                    </div>
                    <div className="border-x border-primary/10">
                        <div className="relative flex flex-col xs:flex-row items-center xs:items-start justify-center xs:justify-between max-w-3xl mx-auto gap-10 xs:gap-3 px-4 sm:px-7 pt-22 pb-8 sm:pb-12">
                            <div className="absolute top-0 transform -translate-y-1/2 w-[145px] h-[145px] overflow-hidden rounded-full border-4 border-white">
                                <Image src={profile.photo} alt={`Photo de ${profile.name}`} width={145} height={145} unoptimized className="w-full h-full object-cover" />
                                <span className="absolute bottom-2.5 right-5 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                            </div>
                            <div className="flex flex-col gap-2 sm:gap-3 items-center text-center xs:items-start">
                                <h1>{profile.name}</h1>
                                <p className="text-violet-700 font-normal">{profile.title}</p>
                                <div className="flex items-center gap-2">
                                    <Image src={"/images/icon/map-icon.svg"} alt="map-icon" width={20} height={20} />
                                    <p className="text-primary">{profile.location}</p>
                                </div>
                                <Education />
                            </div>
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <div className="flex items-center gap-2">
                                    {profile.socialLinks.map((value) => {
                                        return value.href ? (
                                            <Link
                                                href={value.href}
                                                target={value.href.startsWith("http") ? "_blank" : undefined}
                                                rel={value.href.startsWith("http") ? "noreferrer noopener" : undefined}
                                                key={value.label}
                                                aria-label={value.label}
                                                className="w-fit p-2.5 sm:p-3.5 hover:bg-primary/5 border border-primary/10 rounded-full"
                                            >
                                                <Image src={value.icon} alt="" width={18} height={18} unoptimized />
                                            </Link>
                                        ) : null
                                    })}
                                </div>
                                <div className="flex flex-wrap items-center justify-center gap-2">
                                    <Button asChild className="h-auto rounded-full p-0.5!">
                                        <Link
                                            href="/admin"
                                            className="inline-block p-0.5 rounded-full bg-[linear-gradient(96.09deg,_#9282F8_12.17%,_#F3CA4D_90.71%)]"
                                        >
                                            <span className="flex items-center gap-2 bg-primary hover:bg-[linear-gradient(96.09deg,_#9282F8_12.17%,_#F3CA4D_90.71%)] py-2.5 px-5 rounded-full">
                                                <span className="text-sm sm:text-base font-semibold text-white">Connexion</span>
                                            </span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection

