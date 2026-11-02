export interface SkillBadge {
  /** texto alternativo e, por padrão, o texto do badge */
  alt: string;
  /** texto do badge, se for diferente de `alt` */
  label?: string;
  /** cor de fundo: hex sem "#" ou nome (ex.: "gray") */
  color: string;
  /** slug do ícone no simple-icons (ex.: "html5"); veja src/lib/badges.ts */
  logo?: string;
  /** cor do ícone: "white" (padrão), "black" ou hex sem "#" */
  logoColor?: string;
}

export interface SkillCategory {
  title: string;
  /** classes do ícone do título (Font Awesome) */
  icon: string;
  badges: SkillBadge[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend & UI",
    icon: "fa-brands fa-html5",
    badges: [
      { alt: "HTML5", color: "E34F26", logo: "html5", logoColor: "white" },
      {
        alt: "CSS3",
        label: "CSS",
        color: "663399",
        logo: "css",
        logoColor: "white",
      },
      {
        alt: "Astro",
        color: "BC52EE",
        logo: "astro",
        logoColor: "white",
      },
      { alt: "React", color: "20232A", logo: "react", logoColor: "61DAFB" },
      {
        alt: "Vite",
        label: "vite",
        color: "646CFF",
        logo: "vite",
        logoColor: "white",
      },
      {
        alt: "JavaScript",
        color: "F7DF1E",
        logo: "javascript",
        logoColor: "black",
      },
      {
        alt: "TypeScript",
        color: "3178C6",
        logo: "typescript",
        logoColor: "white",
      },
    ],
  },
  {
    title: "Backend & APIs",
    icon: "fa-solid fa-code",
    badges: [
      { alt: "Python", color: "3670A0", logo: "python", logoColor: "ffdd54" },
      { alt: "C#", color: "239120", logo: "c-sharp", logoColor: "white" },
      { alt: "PHP", color: "777BB4", logo: "php", logoColor: "white" },
      { alt: "Flask", color: "000000", logo: "flask", logoColor: "white" },
      { alt: "Fastify", color: "000000", logo: "fastify", logoColor: "white" },
      { alt: "Express", color: "000000", logo: "express", logoColor: "white" },
      {
        alt: "Node.js",
        color: "5FA04E",
        logo: "nodedotjs",
        logoColor: "white",
      },
      { alt: "Java", color: "ED8B00", logo: "openjdk", logoColor: "white" },
      { alt: "FastAPI", color: "009688", logo: "fastapi", logoColor: "white" },
      {
        alt: "Pydantic",
        color: "E92063",
        logo: "pydantic",
        logoColor: "white",
      },
      { alt: "Swagger", color: "85EA2D", logo: "swagger", logoColor: "black" },
      {
        alt: "Spring Boot",
        color: "6DB33F",
        logo: "springboot",
        logoColor: "white",
      },
      {
        alt: "Spring Security",
        color: "6DB33F",
        logo: "springsecurity",
        logoColor: "white",
      },
      {
        alt: "RabbitMQ",
        color: "FF6600",
        logo: "rabbitmq",
        logoColor: "white",
      },
      {
        alt: "JWT",
        color: "000000",
        logo: "jsonwebtokens",
        logoColor: "white",
      },
    ],
  },
  {
    title: "Bancos de Dados, ORM & Web3",
    icon: "fa-solid fa-database",
    badges: [
      { alt: "MySQL", color: "005C84", logo: "mysql", logoColor: "white" },
      {
        alt: "PostgreSQL",
        color: "4169E1",
        logo: "postgresql",
        logoColor: "white",
      },
      { alt: "MongoDB", color: "47A248", logo: "mongodb", logoColor: "white" },
      {
        alt: "Apache Cassandra",
        label: "Cassandra",
        color: "1287B1",
        logo: "apachecassandra",
        logoColor: "white",
      },
      { alt: "SQLite", color: "003B57", logo: "sqlite", logoColor: "white" },
      { alt: "Prisma", color: "2D3748", logo: "prisma", logoColor: "white" },
      { alt: "TypeORM", color: "FE0803", logo: "typeorm", logoColor: "white" },
      {
        alt: "SQL Server",
        color: "CC2927",
        logo: "microsoft-sql-server",
        logoColor: "white",
      },
      {
        alt: "Firebase",
        color: "DD2C00",
        logo: "firebase",
        logoColor: "white",
      },
      { alt: "Flyway", color: "CC0200", logo: "flyway", logoColor: "white" },
      { alt: "Redis", color: "DC382D", logo: "redis", logoColor: "white" },
      {
        alt: "Blockchain",
        label: "Blockchain.com",
        color: "121D33",
        logo: "blockchaindotcom",
      },
      { alt: "Neon", color: "00E599", logo: "neon", logoColor: "000000" },
    ],
  },
  {
    title: "Cloud & DevOps",
    icon: "fa-solid fa-cloud",
    badges: [
      { alt: "AWS", color: "FF9900", logo: "amazonaws", logoColor: "white" },
      { alt: "Docker", color: "2496ED", logo: "docker", logoColor: "white" },
      { alt: "Vercel", color: "000000", logo: "vercel", logoColor: "white" },
      { alt: "Aiven", color: "FF5A5F", logo: "aiven", logoColor: "white" },
      { alt: "Render", color: "46E3B7", logo: "render", logoColor: "000000" },
      {
        alt: "GitHub Actions",
        color: "2088FF",
        logo: "githubactions",
        logoColor: "white",
      },
    ],
  },
  {
    title: "Redes & Infraestrutura",
    icon: "fa-solid fa-network-wired",
    badges: [
      { alt: "Cisco", color: "1BA0D7", logo: "cisco", logoColor: "white" },
      { alt: "Linux", color: "FCC624", logo: "linux", logoColor: "black" },
      {
        alt: "Windows Server",
        color: "gray",
        logo: "windows",
        logoColor: "white",
      },
    ],
  },
  {
    title: "Ferramentas & Desenvolvimento",
    icon: "fa-solid fa-tools",
    badges: [
      { alt: "Git", color: "F05033", logo: "git", logoColor: "white" },
      { alt: "GitHub", color: "181717", logo: "github", logoColor: "white" },
      {
        alt: "VS Code",
        color: "007ACC",
        logo: "visualstudiocode",
        logoColor: "white",
      },
      { alt: "XAMPP", color: "FB7A24", logo: "xampp", logoColor: "white" },
      { alt: "Postman", color: "FF6C37", logo: "postman", logoColor: "white" },
    ],
  },
  {
    title: "Data Science & Analytics",
    icon: "fa-solid fa-chart-line",
    badges: [
      { alt: "Pandas", color: "150458", logo: "pandas", logoColor: "white" },
      { alt: "Plotly", color: "3F4F75", logo: "plotly", logoColor: "white" },
    ],
  },
  {
    title: "IA, Automação & IoT",
    icon: "fa-solid fa-robot",
    badges: [
      { alt: "ChatGPT", color: "74aa9c", logo: "openai", logoColor: "white" },
      { alt: "DSPy", color: "412991", logo: "python", logoColor: "white" },
      { alt: "Gemma", color: "8E75B2", logo: "google", logoColor: "white" },
      { alt: "Arduino", color: "00878F", logo: "arduino", logoColor: "white" },
      { alt: "Claude", color: "D97757", logo: "claude", logoColor: "white" },
      {
        alt: "Perplexity",
        color: "000000",
        logo: "perplexity",
        logoColor: "088F8F",
      },
      {
        alt: "Google Gemini",
        color: "8E75B2",
        logo: "googlegemini",
        logoColor: "white",
      },
    ],
  },
];
