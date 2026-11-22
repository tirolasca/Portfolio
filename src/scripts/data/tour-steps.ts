export interface TourStep {
  selector: string;
  title: string;
  text: string;
}

export const homeTourSteps: TourStep[] = [
  {
    selector: "#home",
    title: "Bem-vindo(a)! 👋",
    text: "Esse é o início — aqui você me conhece rapidinho e já pode baixar meu currículo ou chamar no WhatsApp.",
  },
  {
    selector: "#titulo",
    title: "Habilidades",
    text: "Aqui estão as tecnologias que uso no dia a dia. Você também pode interagir com as badges para descobrir os projetos relacionados.",
  },
  {
    selector: "#projetos",
    title: "Projetos",
    text: "Aqui estão alguns dos projetos que já desenvolvi, com acesso ao código e às versões publicadas.",
  },
  {
    selector: "#contato",
    title: "Vamos conversar?",
    text: "Nesta seção você encontra o formulário de contato e minhas principais formas de contato.",
  },
];

export const resumeTourSteps: TourStep[] = [
  {
    selector: ".curriculo-top",
    title: "Resumo profissional",
    text: "Aqui você encontra uma visão geral do meu perfil profissional e das principais tecnologias que utilizo.",
  },
  {
    selector: "#formacao",
    title: "Formação",
    text: "Nesta seção estão minha formação e os cursos que complementam minha preparação profissional.",
  },
  {
    selector: ".timeline",
    title: "Experiência",
    text: "Aqui você pode conhecer minha trajetória e experiências ao longo da minha formação profissional.",
  },
  {
    selector: "#projetos",
    title: "Projetos",
    text: "Aqui estão alguns dos projetos que desenvolvi e as tecnologias utilizadas em cada um.",
  },
  {
    selector: ".swot-section",
    title: "Diferenciais",
    text: "Esta seção apresenta meus principais pontos fortes, oportunidades e aspectos do meu desenvolvimento profissional.",
  },
  {
    selector: "#contato",
    title: "Contato",
    text: "No final da página estão minhas principais formas de contato.",
  },
];
