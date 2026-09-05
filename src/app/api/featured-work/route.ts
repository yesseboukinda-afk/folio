import { NextResponse } from "next/server";

const featureWork = [
    {
        title: "Conception d'une GED",
        description: "Conception et mise en ligne d'une gestion électronique de documents.",
        roles: ["Webmaster", "Développeur"],
        image: "/images/feature-work/feature-img-1.png",
        url: "https://opensource.gt.tc"
    },
    {
        title: "Messenger-Linu",
        description: "Version de Messenger-Linu disponible sur GitHub.",
        roles: ["Développeur web", "GitHub"],
        image: "/images/feature-work/feature-img-2.png",
        url: "https://github.com/yesseboukinda-afk/messenger-linu"
    },
    {
        title: "Application mobile du CNTS",
        description: "Application mobile développée pour le CNTS.",
        roles: ["Développeur mobile", "React Native"],
        image: "/images/feature-work/feature-img-1.png"
    }
]

export const GET = async () => {
    return NextResponse.json({
        featureWork
    });
};