import { NextResponse } from "next/server";

const experienceData = [
    {
        icon: "/images/icon/tailwind-icon.svg",
        role: "Mise en place d'un système de vidéosurveillance",
        location: "EIT Groupe, Port-Gentil",
        startYear: "2025",
        endYear: "2025",
        bulletPoints: [
            "Déploiement du système de vidéosurveillance pour le groupe EIT",
            "Installation et configuration des caméras et du serveur de stockage vidéo",
            "Maintenance et suivi technique du système"
        ]
    },
    {
        icon: "/images/icon/asana-icon.svg",
        role: "Création d'une gestion électronique de documents",
        location: "EIT Groupe",
        startYear: "2026",
        endYear: "2026",
        bulletPoints: [
            "Conception et réalisation d'une solution de gestion électronique de documents",
            "Mise en ligne et documentation de la solution",
            "Accompagnement de l'équipe dans son utilisation"
        ]
    },
]

const educationData = [
    {
        date: "2023",
        title: "BAC A1",
        subtitle: "Lycée"
    },
    {
        date: "2025",
        title: "DTS en MMI",
        subtitle: "Institut national de la Poste, des Technologies de l'Information et de la Communication"
    },
    {
        date: "2026 - en cours",
        title: "Licence 3",
        subtitle: "Institut national de la Poste, des Technologies de l'Information et de la Communication"
    }
];


const projectOverview = {
    caseStudies: [
        { name: "Conception d'une GED", url: "https://opensource.gt.tc" },
        { name: "Messenger-Linu", url: "https://github.com/yesseboukinda-afk/messenger-linu" },
        { name: "Application mobile du CNTS", url: "#" },
    ],
    sideProjects: [
        { name: "Messenger-Linu", url: "https://github.com/yesseboukinda-afk/messenger-linu" },
    ]
};


export const GET = async () => {
    return NextResponse.json({
        experienceData,
        educationData,
        projectOverview
    });
};