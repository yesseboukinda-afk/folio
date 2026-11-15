import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPortfolioContent } from "@/lib/portfolio-content-server";
import Footer from "../components/layout/footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Formation | Yesse Boukinda",
    description: "Parcours académique de Yesse Boukinda.",
};

const FormationPage = async () => {
    const content = await getPortfolioContent();

    return (
        <>
            <main className="min-h-[70vh]">
                <div className="container">
                    <div className="border-x border-primary/10">
                        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-7 md:py-16">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 rounded-lg border border-primary/10 px-3 py-2 text-sm font-medium text-primary transition hover:bg-primary/5"
                            >
                                <ArrowLeft aria-hidden="true" className="size-4" />
                                Retour au portfolio
                            </Link>
                            <header className="mt-8">
                                <p className="text-sm font-medium uppercase tracking-[2px] text-primary">
                                    Parcours académique
                                </p>
                                <h1 className="mt-2 text-3xl font-semibold">Formation</h1>
                                <p className="mt-2 text-secondary">{content.profile.name}</p>
                            </header>
                            {content.educationData.length > 0 ? (
                                <div className="mt-8 space-y-4">
                                    {content.educationData.map((item, index) => (
                                        <article
                                            key={`${item.title}-${index}`}
                                            className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm sm:p-6"
                                        >
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <div>
                                                    <h2 className="text-lg font-semibold text-slate-900">
                                                        {item.title}
                                                    </h2>
                                                    <p className="mt-1 text-sm text-slate-600">
                                                        {item.subtitle}
                                                    </p>
                                                </div>
                                                <span className="rounded-full bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
                                                    {item.date}
                                                </span>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-8 rounded-xl border border-primary/10 p-5 text-sm text-slate-600">
                                    Aucune formation n’est renseignée pour le moment.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer footerText={content.footerText} />
        </>
    );
};

export default FormationPage;
