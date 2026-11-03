export interface SkillBadge {
  /** Texto alternativo e, por padrão, texto do badge */
  alt: string;
  /** Texto exibido no badge, se diferente de alt */
  label?: string;
  /** Cor de fundo: hex sem "#" ou nome */
  color: string;
  /** Slug do ícone no Simple Icons */
  logo?: string;
  /** Cor do ícone: white, black ou hex sem "#" */
  logoColor?: string;
}

export interface SkillCategory {
  title: string;
  /** Classes do ícone do título (Font Awesome) */
  icon: string;
  badges: SkillBadge[];
}

export const skillCategories: SkillCategory[] = [
  // 1. Frontend e interfaces
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
      { alt: "React", color: "20232A", logo: "react", logoColor: "61DAFB" },
      { alt: "Astro", color: "BC52EE", logo: "astro", logoColor: "white" },
      { alt: "Vite", color: "646CFF", logo: "vite", logoColor: "white" },
    ],
  },

  // 2. Linguagens de programação
  {
    title: "Linguagens de Programação",
    icon: "fa-solid fa-code",
    badges: [
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
      { alt: "Python", color: "3670A0", logo: "python", logoColor: "FFDD54" },
      { alt: "Java", color: "ED8B00", logo: "openjdk", logoColor: "white" },
      { alt: "C#", color: "239120", logo: "c-sharp", logoColor: "white" },
      { alt: "PHP", color: "777BB4", logo: "php", logoColor: "white" },
    ],
  },

  // 3. Backend, APIs e segurança
  {
    title: "Backend, APIs & Segurança",
    icon: "fa-solid fa-server",
    badges: [
      {
        alt: "Node.js",
        color: "5FA04E",
        logo: "nodedotjs",
        logoColor: "white",
      },
      { alt: "Fastify", color: "000000", logo: "fastify", logoColor: "white" },
      { alt: "Express", color: "000000", logo: "express", logoColor: "white" },
      { alt: "Flask", color: "000000", logo: "flask", logoColor: "white" },
      { alt: "FastAPI", color: "009688", logo: "fastapi", logoColor: "white" },
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
        alt: "Pydantic",
        color: "E92063",
        logo: "pydantic",
        logoColor: "white",
      },
      { alt: "Swagger", color: "85EA2D", logo: "swagger", logoColor: "black" },

      {
        alt: "Microsserviços",
        color: "326CE5",
        logo: "kubernetes",
      },
      {
        alt: "JWT",
        color: "000000",
        logo: "jsonwebtokens",
        logoColor: "white",
      },
      {
        alt: "RabbitMQ",
        color: "FF6600",
        logo: "rabbitmq",
        logoColor: "white",
      },
      {
        alt: "Firebase",
        color: "DD2C00",
        logo: "firebase",
        logoColor: "white",
      },
    ],
  },

  // 4. Bancos de dados e ORM
  {
    title: "Banco de Dados & ORM",
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
        alt: "Neo4j",
        color: "4581C3",
        logo: "neo4j",
        logoColor: "white",
      },
      {
        alt: "Apache Cassandra",
        label: "Cassandra",
        color: "1287B1",
        logo: "apachecassandra",
        logoColor: "white",
      },
      { alt: "SQLite", color: "003B57", logo: "sqlite", logoColor: "white" },
      {
        alt: "SQL Server",
        color: "CC2927",
        logo: "microsoft-sql-server",
        logoColor: "white",
      },
      { alt: "Redis", color: "DC382D", logo: "redis", logoColor: "white" },
      { alt: "Neon", color: "00E599", logo: "neon", logoColor: "000000" },
      { alt: "Prisma", color: "2D3748", logo: "prisma", logoColor: "white" },
      { alt: "TypeORM", color: "FE0803", logo: "typeorm", logoColor: "white" },
      { alt: "Flyway", color: "CC0200", logo: "flyway", logoColor: "white" },
    ],
  },

  // 5. Cloud, DevOps e observabilidade
  {
    title: "Cloud, DevOps & Observabilidade",
    icon: "fa-solid fa-cloud",
    badges: [
      { alt: "AWS", color: "FF9900", logo: "amazonaws", logoColor: "white" },
      { alt: "Docker", color: "2496ED", logo: "docker", logoColor: "white" },
      { alt: "Vercel", color: "000000", logo: "vercel", logoColor: "white" },
      { alt: "Render", color: "46E3B7", logo: "render", logoColor: "000000" },
      { alt: "Aiven", color: "FF5A5F", logo: "aiven", logoColor: "white" },
      {
        alt: "GitHub Actions",
        color: "2088FF",
        logo: "githubactions",
        logoColor: "white",
      },
      {
        alt: "Prometheus",
        color: "E6522C",
        logo: "prometheus",
        logoColor: "white",
      },
      { alt: "Grafana", color: "F46800", logo: "grafana", logoColor: "white" },
      {
        alt: "Loki",
        color: "F46800",
        logo: "grafana",
        logoColor: "white",
      },
      { alt: "Jaeger", color: "60D0E4", logo: "jaeger", logoColor: "white" },
    ],
  },

  // 6. Redes e infraestrutura
  {
    title: "Redes & Infraestrutura",
    icon: "fa-solid fa-network-wired",
    badges: [
      { alt: "Cisco", color: "1BA0D7", logo: "cisco", logoColor: "white" },
      { alt: "Linux", color: "FCC624", logo: "linux", logoColor: "black" },
      {
        alt: "Windows Server",
        color: "0078D4",
        logo: "windows",
        logoColor: "white",
      },
    ],
  },

  // 7. Ferramentas e versionamento
  {
    title: "Ferramentas & Versionamento",
    icon: "fa-solid fa-screwdriver-wrench",
    badges: [
      { alt: "Git", color: "F05033", logo: "git", logoColor: "white" },
      { alt: "GitHub", color: "181717", logo: "github", logoColor: "white" },
      {
        alt: "Visual Studio Code",
        label: "VS Code",
        color: "007ACC",
        logo: "visualstudiocode",
        logoColor: "white",
      },
      { alt: "Postman", color: "FF6C37", logo: "postman", logoColor: "white" },
      { alt: "XAMPP", color: "FB7A24", logo: "xampp", logoColor: "white" },
      {
        alt: "Formspree",
        color: "E5122E",
        logo: "formspree",
        logoColor: "white",
      },
      { alt: "Jest", color: "C21325", logo: "jest", logoColor: "white" },
    ],
  },

  // 8. Ciência e análise de dados
  {
    title: "Data Science & Analytics",
    icon: "fa-solid fa-chart-pie",
    badges: [
      { alt: "Pandas", color: "150458", logo: "pandas", logoColor: "white" },
      { alt: "Plotly", color: "3F4F75", logo: "plotly", logoColor: "white" },
    ],
  },

  // 9. Inteligência artificial e modelos de linguagem
  {
    title: "IA & Modelos de Linguagem",
    icon: "fa-solid fa-brain",
    badges: [
      { alt: "ChatGPT", color: "74AA9C", logo: "openai", logoColor: "white" },
      { alt: "DSPy", color: "412991", logo: "python", logoColor: "white" },
      { alt: "Gemma", color: "8E75B2", logo: "google", logoColor: "white" },
      { alt: "Claude", color: "D97757", logo: "claude", logoColor: "white" },
      {
        alt: "Perplexity",
        color: "000000",
        logo: "perplexity",
        logoColor: "20B8CD",
      },
      {
        alt: "Google Gemini",
        color: "8E75B2",
        logo: "googlegemini",
        logoColor: "white",
      },
    ],
  },

  // 10. IoT e Blockchain
  {
    title: "IoT & Blockchain",
    icon: "fa-solid fa-microchip",
    badges: [
      { alt: "Arduino", color: "00878F", logo: "arduino", logoColor: "white" },
      {
        alt: "Blockchain.com",
        label: "Blockchain",
        color: "121D33",
        logo: "blockchaindotcom",
        logoColor: "white",
      },
    ],
  },
];
