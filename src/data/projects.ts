import type { ImageMetadata } from "astro";
import planet from "../assets/img/planet.webp";
import janosys from "../assets/img/janosys.webp";
import temperoDaCasa from "../assets/img/tempero-da-casa.webp";
import codewave from "../assets/img/codewave.webp";
import taskmaster from "../assets/img/taskmaster.webp";
import portfolioGamer from "../assets/img/portfolio-gamer.webp";
import aerocode from "../assets/img/aerocode.webp";
import vinicola from "../assets/img/vinicola.webp";
import signa from "../assets/img/signa.webp";
import mercadolivre from "../assets/img/mercadolivre.webp";
import newelog from "../assets/img/newelog.webp";
import calculadoraMatrizes from "../assets/img/calculadora-matrizes.webp";

export type TechId =
  | "aiven"
  | "cassandra"
  | "css3"
  | "docker"
  | "express"
  | "firebase"
  | "flask"
  | "html5"
  | "java"
  | "javascript"
  | "jwt"
  | "microsservios"
  | "mongodb"
  | "mysql"
  | "neo4j"
  | "pandas"
  | "plotly"
  | "postgresql"
  | "prisma"
  | "python"
  | "react"
  | "redis"
  | "render"
  | "streamlit"
  | "springboot"
  | "sympy"
  | "tidb"
  | "typescript"
  | "vite";

/** Conta de teste exibida no modal de ajuda do card (apenas ambientes de demonstração). */
export interface ProjectCredential {
  /** perfil da conta (ex.: Administrador) */
  label: string;
  user: string;
  password: string;
}

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
  /** quando presente, o card ganha o ícone de ajuda com as credenciais de teste */
  credentials?: ProjectCredential[];
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
    subtitle: "API 1º Semestre — FATEC SJC",
    subtitleIcon: "fa-solid fa-building-columns",
    descriptionIcon: "fa-solid fa-code-branch",
    description:
      "Plataforma web para <strong>análise dos dados do Censo de SJC</strong>, com dashboards interativos, <strong>filtros regionais e etários</strong> e indicadores populacionais. Desenvolvida com <strong>Flask, Pandas, Plotly e Docker</strong>. Atuei como <strong>Frontend Dev</strong>, desenvolvendo a <strong>interface responsiva</strong> com <strong>HTML, CSS e JS</strong>.",
    image: janosys,
    imageAlt: "Janosys Project",
    tech: [
      "python",
      "flask",
      "pandas",
      "plotly",
      "docker",
      "html5",
      "css3",
      "javascript",
    ],
    demo: "https://janosysapi1.vercel.app",
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
      "Aplicação web para <strong>gestão da produção aeronáutica</strong>, desenvolvida com <strong>React, TypeScript, Prisma e MySQL</strong>. Conta com <strong>autenticação, níveis de acesso, métricas de qualidade, filtros e histórico</strong>, além da aplicação hospedada na <strong>Vercel</strong>, API no <strong>Render</strong> e banco de dados no <strong>TiDB Cloud</strong>.",
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
    credentials: [
      {
        label: "Administrador",
        user: "carlos.silva@aerocode.com",
        password: "admin123",
      },
    ],
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
    subtitle: "Gestão de Normas Aeronáuticas — 2º Semestre",
    subtitleIcon: "fa-solid fa-plane",
    descriptionIcon: "fa-solid fa-code",
    description:
      "Plataforma web desenvolvida no <strong>2º semestre de DSM (FATEC SJC)</strong>, em parceria com a <strong>Akaer</strong>, para <strong>gestão e correlação de normas aeronáuticas</strong>. Possui busca, filtros, catálogo de peças, aprovação de normas e histórico de alterações, com <strong>três níveis de acesso</strong>.",
    image: signa,
    imageAlt: "Signa",
    tech: ["react", "typescript", "css3", "javascript", "html5", "vite"],
    demo: "https://janosys-aeroespacial.vercel.app",
    demoIcon: "fa-solid fa-arrow-up-right-from-square",
    repo: "https://github.com/janosystime/Janosys-Project-1-Akaer",
    repoIcon: "fa-brands fa-github",
    credentials: [
      { label: "Administrador", user: "admin", password: "123" },
      { label: "Checker", user: "checker", password: "123" },
      { label: "Usuário", user: "usuario", password: "123" },
    ],
  },

  {
    title: "Mercado Livre",
    icon: "fa-solid fa-store",
    subtitle: "Plataforma de E-commerce & Bancos Poliglotas",
    subtitleIcon: "fa-solid fa-database",
    descriptionIcon: "fa-solid fa-code",
    description:
      "Projeto de e-commerce desenvolvido em <strong>Python</strong>, explorando bancos de dados <strong>MongoDB, Redis, Cassandra e Neo4j</strong>. Possui interface em <strong>Streamlit</strong>, visualizações de dados e recursos de diagnóstico, aplicando diferentes modelos de persistência.",
    image: mercadolivre,
    imageAlt: "Plataforma Mercado Livre desenvolvida em Python",
    tech: ["python", "streamlit", "mongodb", "redis", "cassandra", "neo4j"],
    demo: "https://mercadolivrebr.streamlit.app",
    demoIcon: "fa-solid fa-up-right-from-square",
    repo: "https://github.com/tirolasca/MercadoLivre",
    repoIcon: "fa-brands fa-github",
  },

  {
    title: "NEWELOG",
    icon: "fa-solid fa-truck-fast",
    subtitle: "Gestão de Frota & Operação Logística",
    subtitleIcon: "fa-solid fa-chart-line",
    descriptionIcon: "fa-solid fa-code",
    description:
      "Sistema de <strong>gestão e operação logística</strong>, desenvolvido no Projeto Integrador da <strong>FATEC</strong> para a <strong>NEWE</strong>. Utiliza arquitetura de <strong>microsserviços</strong> com <strong>React, TypeScript, Java, Spring Boot e PostgreSQL</strong>. Inclui painel financeiro, motoristas, ranking e importação de manifestos CSV.",
    image: newelog,
    imageAlt: "Painel financeiro do NEWELOG, sistema de gestão de frota",
    tech: [
      "react",
      "typescript",
      "vite",
      "java",
      "springboot",
      "postgresql",
      "jwt",
      "microsservios",
      "css3",
    ],
    demo: "https://newelog.vercel.app",
    demoIcon: "fa-solid fa-arrow-up-right-from-square",
    repo: "https://github.com/Koitech-Log/Koitech-Log-3DSM-Newelog",
    repoIcon: "fa-brands fa-github",
    credentials: [
      {
        label: "Administrador",
        user: "admin@newelog.com",
        password: "admin123",
      },
    ],
  },

  {
    title: "Calculadora de Matrizes",
    icon: "fa-solid fa-calculator",
    subtitle: "Álgebra Linear & Computação Científica",
    subtitleIcon: "fa-solid fa-square-root-variable",
    descriptionIcon: "fa-solid fa-code",
    description:
      "Aplicação educacional de <strong>álgebra linear</strong> desenvolvida em <strong>Python</strong>, com operações simbólicas via <strong>SymPy</strong>, interfaces em <strong>Streamlit e Tkinter</strong> e visualizações matemáticas. Possui <strong>testes automatizados</strong> e ferramentas de qualidade de código.",
    image: calculadoraMatrizes,
    imageAlt: "Calculadora de Matrizes e operações de álgebra linear",
    tech: ["python", "streamlit", "sympy"],
    demo: "https://calculadora-matrizes.streamlit.app",
    demoIcon: "fa-solid fa-up-right-from-square",
    repo: "https://github.com/tirolasca/Calculadora-Matrizes",
    repoIcon: "fa-brands fa-github",
  },
];
