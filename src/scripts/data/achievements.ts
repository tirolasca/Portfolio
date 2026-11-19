export interface Achievement {
  id: string;
  /** seção que, ao aparecer na tela, desbloqueia a conquista (null = secreta) */
  selector: string | null;
  icon: string;
  title: string;
  desc: string;
  xp: number;
  secret: boolean;
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "a-hero",
    selector: "#home",
    icon: "fa-solid fa-house-user",
    title: "Bem-vindo!",
    desc: "Portfólio carregado com sucesso",
    xp: 10,
    secret: false,
  },
  {
    id: "a-skills",
    selector: ".skills",
    icon: "fa-bolt",
    title: "Stack Desbloqueada!",
    desc: "+15 tecnologias descobertas",
    xp: 25,
    secret: false,
  },
  {
    id: "a-projects",
    selector: "#projetos",
    icon: "fa-rocket",
    title: "Projetos Explorados!",
    desc: "Confira o que já foi construído",
    xp: 30,
    secret: false,
  },
  {
    id: "a-swot",
    selector: ".swot-section",
    icon: "fa-brain",
    title: "Análise SWOT!",
    desc: "Autoconhecimento nível máximo",
    xp: 20,
    secret: false,
  },
  {
    id: "a-contact",
    selector: "#contato",
    icon: "fa-bullseye",
    title: "Missão Completa!",
    desc: "Pronto para colaborar?",
    xp: 50,
    secret: false,
  },
  {
    id: "a-timeline",
    selector: ".timeline",
    icon: "fa-calendar-days",
    title: "Linha do Tempo!",
    desc: "Experiências profissionais reveladas",
    xp: 35,
    secret: false,
  },
  {
    id: "a-konami",
    selector: null,
    icon: "fa-dragon",
    title: "Modo Matrix!",
    desc: "Você hackeou o controle de luz e trevas!",
    xp: 100,
    secret: true,
  },
  {
    id: "a-logo",
    selector: null,
    icon: "fa-rotate",
    title: "Segredo da Logo!",
    desc: "Você clicou 5x na logo",
    xp: 75,
    secret: true,
  },
  {
    id: "a-terminal",
    selector: null,
    icon: "fa-terminal",
    title: "Acesso Concedido!",
    desc: "Você encontrou o terminal secreto",
    xp: 60,
    secret: true,
  },
  {
    id: "a-neo",
    selector: null,
    icon: "fa-user-secret",
    title: "Acordou, Neo?",
    desc: "Você encontrou o comando secreto do terminal",
    xp: 80,
    secret: true,
  },
];

export const MAX_XP = ALL_ACHIEVEMENTS.reduce((s, a) => s + a.xp, 0);

export const LOCKED_HINTS: Record<string, string> = {
  "a-hero": "Você já está aqui — aguarde um momento no início da página!",
  "a-skills": "Role até a seção de habilidades e tecnologias para desbloquear.",
  "a-projects": "Explore a seção de projetos para descobrir esta conquista.",
  "a-swot": "A análise SWOT revela muito — role até encontrá-la.",
  "a-contact": "Chegue até o fim do portfólio e veja a seção de contato.",
  "a-timeline": "Role até a linha do tempo de experiências profissionais.",
  "a-konami":
    "O controle de luz e trevas esconde um segredo... segure-o com firmeza.",
  "a-logo": "Clique 5 vezes seguidas na logo do portfólio…",
  "a-terminal":
    "Nem tudo no cabeçalho é o que parece... procure por um ícone diferente.",
  "a-neo": "Dizem que um certo terminal responde a quem pergunta por 'neo'...",
};
