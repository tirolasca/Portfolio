import type { ImageMetadata } from "astro";
import planet from "../assets/img/planet.png";
import janosys from "../assets/img/janosys.png";
import temperoDaCasa from "../assets/img/tempero-da-casa.png";
import codewave from "../assets/img/codewave.png";
import taskmaster from "../assets/img/taskmaster.png";
import portfolioGamer from "../assets/img/portfolio-gamer.png";
import aerocode from "../assets/img/aerocode.png";
import vinicola from "../assets/img/vinicola.png";
import signa from "../assets/img/signa.png";

export type TechId =
  | "aiven"
  | "css3"
  | "express"
  | "firebase"
  | "flask"
  | "html5"
  | "javascript"
  | "mysql"
  | "pandas"
  | "plotly"
  | "prisma"
  | "python"
  | "react"
  | "render"
  | "typescript"
  | "vite";

export interface Project {
  title: string;
  /** classes do ícone do título (Font Awesome) */
  icon: string;
  subtitle: string;
  subtitleIcon: string;
  descriptionIcon: string;
  /** HTML inline (usa <strong>) — renderizado com set:html */
  description: string;
  image: ImageMetadata;
  imageAlt: string;
  /** usado pelo destaque "skill → projetos" (data-tech) */
  tech: TechId[];
  demo: string;
  demoIcon: string;
  repo: string;
  repoIcon: string;
}

export const projects: Project[] = [
  {
    title: "Planet Spotter",
    icon: "fa-solid fa-satellite",
    subtitle: "NASA Space Apps Challenge",
    subtitleIcon: "fa-solid fa-user-astronaut",
    descriptionIcon: "fa-solid fa-laptop-code",
    description:
      "Aplicação web desenvolvida durante o <strong>NASA Space Apps Challenge</strong> para <strong>exploração e visualização interativa de exoplanetas</strong>. Atuei como <strong>Frontend Developer</strong>, responsável pela interface responsiva e animações em <strong>HTML, CSS e JavaScript</strong>.",
    image: planet,
    imageAlt: "Projeto NASA Planet Spotter",
    tech: ["html5", "css3", "javascript"],
    demo: "https://nasasjc.vercel.app",
    demoIcon: "fa-solid fa-up-right-from-square",
    repo: "https://github.com/tirolasca/NASA.git",
    repoIcon: "fa-brands fa-github",
  },
  {
    title: "Janosys API",
    icon: "fa-solid fa-database",
    subtitle: "Projeto Acadêmico — FATEC",
    subtitleIcon: "fa-solid fa-building-columns",
    descriptionIcon: "fa-solid fa-code-branch",
    description:
      "Aplicação web para <strong>análise comparativa de dados do Censo 2010 e 2022</strong>, utilizando <strong>Python (Flask)</strong>, <strong>Pandas</strong> e <strong>Plotly</strong>. Atuei como <strong>Frontend Developer</strong>, responsável pela camada visual responsiva e integração dinâmica com <strong>HTML, CSS e JavaScript</strong>.",
    image: janosys,
    imageAlt: "Janosys Project",
    tech: [
      "python",
      "flask",
      "pandas",
      "plotly",
      "html5",
      "css3",
      "javascript",
    ],
    demo: "http://janosysapi1.vercel.app",
    demoIcon: "fa-solid fa-up-right-from-square",
    repo: "https://github.com/janosystime/Janosys-Project.git",
    repoIcon: "fa-brands fa-github",
  },
  {
    title: "Tempero da Casa",
    icon: "fa-solid fa-utensils",
    subtitle: "Cardápio Digital",
    subtitleIcon: "fa-solid fa-clipboard-list",
    descriptionIcon: "fa-solid fa-bowl-food",
    description:
      "Aplicação Web de <strong>Cardápio Digital</strong> simples e responsiva, criada para facilitar a <strong>visualização de pratos e a navegação entre categorias</strong>. Atuei no desenvolvimento da interface utilizando <strong>HTML, CSS e JavaScript</strong>, garantindo uma experiência clara, rápida e intuitiva para o usuário.",
    image: temperoDaCasa,
    imageAlt: "Tempero da Casa",
    tech: ["html5", "css3", "javascript"],
    demo: "https://temperodacasa.vercel.app",
    demoIcon: "fa-solid fa-up-right-from-square",
    repo: "https://github.com/DeveloperCorsair/Cardapio",
    repoIcon: "fa-brands fa-github",
  },
  {
    title: "CodeWave",
    icon: "fa-solid fa-wave-square",
    subtitle: "Empresa de Tecnologia",
    subtitleIcon: "fa-solid fa-building",
    descriptionIcon: "fa-solid fa-code",
    description:
      "Desenvolvi a <strong>CodeWave</strong>, uma <strong>página institucional que comunica a missão e a visão inovadora da marca</strong>. Criei uma interface moderna e responsiva com <strong>HTML, CSS e JavaScript</strong>, destacando como a tecnologia conecta pessoas e simplifica processos.",
    image: codewave,
    imageAlt: "CodeWave",
    tech: ["html5", "css3", "javascript"],
    demo: "https://codewavebr.vercel.app",
    demoIcon: "fa-solid fa-up-right-from-square",
    repo: "https://github.com/tirolasca/CodeWave",
    repoIcon: "fa-brands fa-github",
  },
  {
    title: "TaskMaster",
    icon: "fa-solid fa-list-check",
    subtitle: "Gerenciador de Tarefas",
    subtitleIcon: "fa-solid fa-list-ul",
    descriptionIcon: "fa-solid fa-terminal",
    description:
      "Aplicativo Web de <strong>gerenciamento de tarefas</strong>, moderno e responsivo, desenvolvido com <strong>React, TypeScript e Vite</strong>. Inclui <strong>drag &amp; drop, temas claro e escuro AMOLED</strong> e animações sutis, garantindo uma experiência visual elegante e intuitiva para o usuário.",
    image: taskmaster,
    imageAlt: "TaskMaster",
    tech: ["react", "typescript", "vite", "javascript", "html5", "css3"],
    demo: "https://taskmasterbr.vercel.app",
    demoIcon: "fa-solid fa-arrow-up-right-from-square",
    repo: "https://github.com/tirolasca/TaskMaster",
    repoIcon: "fa-brands fa-github",
  },
  {
    title: "Portfólio Gamer",
    icon: "fa-solid fa-gamepad",
    subtitle: "Experiência Interativa em RPG",
    subtitleIcon: "fa-solid fa-trophy",
    descriptionIcon: "fa-solid fa-terminal",
    description:
      "Uma experiência gamificada que transforma um currículo tradicional em um <strong>verdadeiro jogo de RPG</strong>. Desenvolvido com <strong>HTML, CSS Avançado e JavaScript</strong>. Conta com motor próprio de <strong>XP, Level Up, NPC interativo, inventário (Loot)</strong> e <strong>áudio 8-bits</strong> gerado por código, garantindo imersão total.",
    image: portfolioGamer,
    imageAlt: "Portfólio Gamer RPG",
    tech: ["html5", "css3", "javascript", "firebase"],
    demo: "https://portfoliogamer.vercel.app",
    demoIcon: "fa-solid fa-arrow-up-right-from-square",
    repo: "https://github.com/tirolasca/PortfolioGamer",
    repoIcon: "fa-brands fa-github",
  },
  {
    title: "Aerocode",
    icon: "fa-solid fa-plane",
    subtitle: "Sistema de Gestão da Produção Aeronáutica",
    subtitleIcon: "fa-solid fa-industry",
    descriptionIcon: "fa-solid fa-code",
    description:
      "Aplicação web para <strong>gestão da produção aeronáutica</strong>, desenvolvida com <strong>React, TypeScript, Prisma e MySQL</strong>. Conta com <strong>autenticação, níveis de acesso, métricas de qualidade, filtros e histórico</strong>, além de aplicação e API hospedadas na <strong>Vercel, Render e Aiven</strong>.",
    image: aerocode,
    imageAlt: "Aerocode",
    tech: [
      "react",
      "typescript",
      "prisma",
      "mysql",
      "express",
      "render",
      "aiven",
      "javascript",
      "html5",
      "css3",
    ],
    demo: "https://aerocodespa.vercel.app",
    demoIcon: "fa-solid fa-arrow-up-right-from-square",
    repo: "https://github.com/tirolasca/Aerocode-Fullstack",
    repoIcon: "fa-brands fa-github",
  },
  {
    title: "Vinícola Premium",
    icon: "fa-solid fa-wine-glass",
    subtitle: "Experiência Digital Sofisticada",
    subtitleIcon: "fa-solid fa-crown",
    descriptionIcon: "fa-solid fa-code",
    description:
      "Site desenvolvido para uma <strong>vinícola premium</strong>, com foco em <strong>elegância, identidade visual e experiência do usuário</strong>. Desenvolvido com <strong>HTML, CSS e JavaScript</strong>, apresenta uma interface moderna e responsiva para destacar os vinhos, a história e a identidade da marca.",
    image: vinicola,
    imageAlt: "Vinícola Premium",
    tech: ["html5", "css3", "javascript"],
    demo: "https://vinicolapremium.vercel.app",
    demoIcon: "fa-solid fa-arrow-up-right-from-square",
    repo: "https://github.com/tirolasca/Vinicola",
    repoIcon: "fa-brands fa-github",
  },
  {
    title: "Signa",
    icon: "fa-solid fa-file-shield",
    subtitle: "Gestão de Requisitos Aeronáuticos",
    subtitleIcon: "fa-solid fa-plane",
    descriptionIcon: "fa-solid fa-code",
    description:
      "Plataforma web para <strong>centralização e gestão de requisitos normativos aeronáuticos</strong>, com diferentes níveis de permissão, busca, filtragem e <strong>controle de versões e alterações</strong>. Desenvolvido com <strong>React, TypeScript e CSS</strong>, o projeto é idealizado pela <strong>FATEC</strong> em parceria com a <strong>Akaer</strong>.",
    image: signa,
    imageAlt: "Signa",
    tech: ["react", "typescript", "css3", "javascript", "html5", "vite"],
    demo: "https://janosys-aeroespacial.vercel.app",
    demoIcon: "fa-solid fa-arrow-up-right-from-square",
    repo: "https://github.com/janosystime/Janosys-Project-1-Akaer",
    repoIcon: "fa-brands fa-github",
  },
];
