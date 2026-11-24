import { z } from "astro/zod";

/**
 * Tecnologias que os projetos podem declarar. O mapa serve de fonte única para o
 * identificador (usado no destaque "skill → projetos") e para o nome exibido.
 */
export const TECH_LABELS = {
  aiven: "Aiven",
  cassandra: "Apache Cassandra",
  css3: "CSS3",
  docker: "Docker",
  express: "Express",
  firebase: "Firebase",
  flask: "Flask",
  html5: "HTML5",
  java: "Java",
  javascript: "JavaScript",
  jwt: "JWT",
  microsservios: "Microsserviços",
  mongodb: "MongoDB",
  mysql: "MySQL",
  neo4j: "Neo4j",
  pandas: "Pandas",
  plotly: "Plotly",
  postgresql: "PostgreSQL",
  prisma: "Prisma",
  python: "Python",
  react: "React",
  redis: "Redis",
  render: "Render",
  streamlit: "Streamlit",
  springboot: "Spring Boot",
  sympy: "SymPy",
  tidb: "TiDB",
  typescript: "TypeScript",
  vite: "Vite",
} as const;

export type TechId = keyof typeof TECH_LABELS;

const TECH_IDS = Object.keys(TECH_LABELS) as [TechId, ...TechId[]];

const httpsUrl = z.url({ protocol: /^https$/ });

const credential = z.object({
  /** perfil da conta (ex.: Administrador) */
  label: z.string().min(1),
  user: z.string().min(1),
  password: z.string().min(1),
});

/**
 * Schema de um projeto. Recebe o helper `image()` do Astro para que a imagem
 * passe pelo pipeline do `astro:assets` (nos testes, basta um `z.string()`).
 */
export const projectSchema = <TImage extends z.ZodType>(image: () => TImage) =>
  z.object({
    title: z.string().min(1),
    /** posição no carrossel e nas listas (1 = primeiro) */
    order: z.number().int().positive(),
    /** classes do ícone do título (Font Awesome) */
    icon: z.string().min(1),
    subtitle: z.string().min(1),
    subtitleIcon: z.string().min(1),
    descriptionIcon: z.string().min(1),
    /** HTML inline (usa <strong>) — renderizado com set:html */
    description: z.string().min(1),
    image: image(),
    imageAlt: z.string().min(1),
    /** usado pelo destaque "skill → projetos" (data-tech) */
    tech: z.array(z.enum(TECH_IDS)).min(1),
    demo: httpsUrl,
    repo: httpsUrl,
    demoIcon: z.string().min(1).default("fa-solid fa-up-right-from-square"),
    repoIcon: z.string().min(1).default("fa-brands fa-github"),
    /** contas de teste de ambientes de demonstração (ícone de ajuda no card) */
    credentials: z.array(credential).optional(),
  });
