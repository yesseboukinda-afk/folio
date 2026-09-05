const skills = [
  "Python",
  "PHP",
  "HTML",
  "CSS",
  "React Native",
];

const tools = [
  "Linux",
  "Git",
  "GitHub",
];

const featuredWork = [
  {
    title: "Conception d'une GED",
    roles: ["Webmaster", "Développeur"],
    image: "Capture d’écran du 2026-08-05 11-52-01.png",
    url: "https://opensource.gt.tc",
  },
  {
    title: "Messenger-Linu",
    roles: ["Développeur web", "GitHub"],
    image: "Capture d’écran du 2026-08-05 11-52-50.png",
    url: "https://github.com/yesseboukinda-afk/messenger-linu",
  },
  {
    title: "Application mobile du CNTS",
    roles: ["Développeur mobile", "React Native"],
    image: "public/images/feature-work/feature-img-1.png",
  },
];

const experienceData = [
  {
    icon: "public/images/icon/tailwind-icon.svg",
    role: "Mise en place d'un système de vidéo surveillance",
    location: "EIT Groupe, Port-Gentil",
    startYear: "2025",
    endYear: "2025",
    bulletPoints: [
      "Déploiement du système de vidéo surveillance pour le groupe EIT à Port-Gentil",
      "Installation et configuration des caméras et du serveur de stockage vidéo",
      "Assuré la maintenance et le suivi technique du système",
    ],
  },
  {
    icon: "public/images/icon/asana-icon.svg",
    role: "Création d'une GED",
    location: "EIT Groupe",
    startYear: "2026",
    endYear: "2026",
    bulletPoints: [
      "Conception et réalisation d'une gestion électronique de documents (GED)",
      "Intégration des captures d'écran du projet présentes à la racine du projet",
      "Mise en ligne et documentation de la solution pour l'équipe EIT Groupe",
    ],
  },
];

const educationData = [
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
    title: "Licence 3 en cours",
    subtitle: "Institut national de la Poste, des Technologies de l'Information et de la Communication",
  },
];

const projectOverview = {
  caseStudies: [
    { name: "Conception d'une GED", url: "https://opensource.gt.tc" },
    { name: "Messenger-Linu", url: "https://github.com/yesseboukinda-afk/messenger-linu" },
    { name: "Application mobile du CNTS", url: "#" },
  ],
  sideProjects: [
    { name: "Messenger-Linu", url: "https://github.com/yesseboukinda-afk/messenger-linu" },
  ],
};

const skillsTagsContainer = document.getElementById("skills-tags");
const toolsTagsContainer = document.getElementById("tools-tags");
const featuredGridContainer = document.getElementById("featured-grid");
const experienceListContainer = document.getElementById("experience-list");
const educationListContainer = document.getElementById("education-list");
const caseStudiesContainer = document.getElementById("case-studies");
const sideProjectsContainer = document.getElementById("side-projects");

function renderTags(container, items) {
  if (!container) return;
  items.forEach((item) => {
    const tag = document.createElement("span");
    tag.className = "service-tag";
    tag.textContent = item;
    container.appendChild(tag);
  });
}

function renderFeaturedWork() {
  if (!featuredGridContainer) return;
  featuredWork.forEach((item) => {
    const card = document.createElement("article");
    card.className = "featured-card";

    const img = document.createElement("img");
    img.src = encodeURI(item.image);
    img.alt = item.title;

    const link = document.createElement("a");
    link.href = item.url || "#";
    link.target = "_blank";
    link.rel = "noreferrer noopener";
    link.appendChild(img);
    card.appendChild(link);

    const info = document.createElement("div");
    info.className = "featured-info";

    const title = document.createElement("h4");
    title.textContent = item.title;
    info.appendChild(title);

    const roles = document.createElement("p");
    roles.textContent = item.roles.join(", ");
    info.appendChild(roles);

    card.appendChild(info);
    featuredGridContainer.appendChild(card);
  });
}

function renderExperience() {
  if (!experienceListContainer) return;
  experienceData.forEach((item) => {
    const card = document.createElement("section");
    card.className = "experience-card";

    const head = document.createElement("div");
    head.className = "experience-item__head";

    const title = document.createElement("div");
    title.innerHTML = `<h5>${item.role}</h5><p>${item.location}</p>`;
    head.appendChild(title);

    const years = document.createElement("div");
    years.className = "experience-item__years";
    years.innerHTML = `
      <span class="experience-item__dot"></span>
      <span>${item.startYear} – ${item.endYear}</span>
    `;
    head.appendChild(years);

    card.appendChild(head);

    const list = document.createElement("ul");
    item.bulletPoints.forEach((point) => {
      const li = document.createElement("li");
      li.textContent = point;
      list.appendChild(li);
    });

    card.appendChild(list);
    experienceListContainer.appendChild(card);
  });
}

function renderEducation() {
  if (!educationListContainer) return;
  educationData.forEach((item) => {
    const card = document.createElement("section");
    card.className = "education-card";

    const date = document.createElement("p");
    date.className = "education-date";
    date.textContent = item.date;
    card.appendChild(date);

    const title = document.createElement("h5");
    title.className = "education-title";
    title.textContent = item.title;
    card.appendChild(title);

    const subtitle = document.createElement("p");
    subtitle.className = "education-subtitle";
    subtitle.textContent = item.subtitle;
    card.appendChild(subtitle);

    educationListContainer.appendChild(card);
  });
}

function renderProjects() {
  if (!caseStudiesContainer || !sideProjectsContainer) return;

  projectOverview.caseStudies.forEach((item) => {
    const link = document.createElement("a");
    link.className = "project-link";
    link.href = item.url;
    link.textContent = item.name;
    caseStudiesContainer.appendChild(link);
  });

  projectOverview.sideProjects.forEach((item) => {
    const wrapper = document.createElement("div");
    wrapper.className = item.comingSoon ? "project-link project-link--coming-soon" : "project-link";

    const title = document.createElement("span");
    title.textContent = item.name;
    wrapper.appendChild(title);

    if (item.comingSoon) {
      const badge = document.createElement("span");
      badge.textContent = "Coming Soon";
      wrapper.appendChild(badge);
    } else {
      const arrow = document.createElement("img");
      arrow.src = "public/images/icon/tile-arrow-icon.svg";
      arrow.alt = "arrow";
      arrow.className = "project-arrow";
      wrapper.appendChild(arrow);
      wrapper.addEventListener("click", () => {
        window.location.href = item.url;
      });
    }

    sideProjectsContainer.appendChild(wrapper);
  });
}

renderTags(skillsTagsContainer, skills);
renderTags(toolsTagsContainer, tools);
renderFeaturedWork();
renderExperience();
renderEducation();
renderProjects();
