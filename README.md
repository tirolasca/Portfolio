<div align="center">

# Lucas Santos — Portfólio

**Portfólio e currículo interativos de um desenvolvedor de software**, feitos com Astro e TypeScript.
Rápido, acessível e com alguns segredos escondidos.

[**lucastec.vercel.app**](https://lucastec.vercel.app) · [Currículo](https://lucastec.vercel.app/curriculo.html)

![Astro](https://img.shields.io/badge/Astro-7-BC52EE?style=flat&logo=astro&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6_strict-3178C6?style=flat&logo=typescript&logoColor=white)
![Lighthouse](https://img.shields.io/badge/Lighthouse-95%2B_desktop-0CCE6B?style=flat&logo=lighthouse&logoColor=white)
![Vercel](https://img.shields.io/badge/deploy-Vercel-000?style=flat&logo=vercel&logoColor=white)

<img src="docs/preview.webp" alt="Prévia da página inicial do portfólio" width="760" />

</div>

## Sobre o projeto

Este é o meu cartão de visitas na web: apresenta quem eu sou, minhas tecnologias, os projetos
que construí e o currículo completo — tudo numa experiência pensada para ser lembrada, sem
abrir mão de desempenho nem de acessibilidade.

Sou formado em **Desenvolvimento de Sistemas e Redes de Computadores** e curso
**Desenvolvimento de Software Multiplataforma** na FATEC. O site nasceu em HTML/CSS/JS
puros e foi migrado para **Astro + TypeScript** para ficar mais rápido, tipado e fácil de manter.

## Destaques

- 🌗 **Tema escuro/claro** com abertura cinematográfica (pode ser pulada com um toque ou tecla).
- 💻 **Terminal interativo** — digite `ajuda` para ver os comandos (`sobre`, `skills`, `projetos`,
  `experiencia`, `contato`, `curriculo`, `github`, `tema`…).
- 🏆 **Conquistas e XP**: 10 conquistas (6 abertas + 4 secretas) liberadas ao explorar o site.
- 🧭 **Tour guiado** (home e currículo) e **"Resumo de 30 s"** para quem tem pressa.
- 🐙 **Atividade do GitHub** ao vivo e modal com estatísticas do perfil.
- 📊 **Radar de competências** (Chart.js) e análise **SWOT** no currículo, mais linha do tempo.
- 🔗 **Skills ↔ Projetos**: clicar numa tecnologia destaca os projetos que a usam.
- 📬 **Formulário de contato acessível** com validação, rascunho automático e envio real opcional.
- 🌍 Tradução (PT/EN/ES) pelo [GTranslate](https://gtranslate.io) (versão gratuita) e cursor personalizado.
- 🥚 Segredos escondidos. Boa caçada.

## Projetos em destaque

| Projeto          | O que é                                   |
| ---------------- | ----------------------------------------- |
| Planet Spotter   | NASA Space Apps Challenge                 |
| Janosys API      | Projeto acadêmico — FATEC                 |
| Tempero da Casa  | Cardápio digital                          |
| CodeWave         | Site de empresa de tecnologia             |
| TaskMaster       | Gerenciador de tarefas                    |
| Portfólio Gamer  | Experiência interativa em RPG             |
| Aerocode         | Sistema de gestão da produção aeronáutica |
| Vinícola Premium | Experiência digital sofisticada           |
| Signa            | Gestão de requisitos aeronáuticos         |

## Stack

| Camada         | Tecnologias                                                                                                                                                           |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework      | [Astro 7](https://astro.build) (site estático) · `build.format: "file"` mantém `/curriculo.html`                                                                      |
| Linguagem      | TypeScript 6 (`strict`)                                                                                                                                               |
| UI             | CSS modular (35 arquivos) · Swiper (só Navigation/Autoplay) · Chart.js · Font Awesome (subconjunto gerado) · badges gerados no build (`badge-maker` + `simple-icons`) |
| Imagens        | `astro:assets` (AVIF/WebP responsivos)                                                                                                                                |
| Qualidade      | ESLint 10 + `typescript-eslint` + `eslint-plugin-astro` (a11y) · Prettier · `astro check` · Playwright + axe · Lighthouse CI · GitHub Actions                         |
| SEO / Métricas | `@astrojs/sitemap` · canonical, Open Graph, Twitter Cards, JSON-LD · `web-vitals`                                                                                     |
| Deploy         | [Vercel](https://vercel.com)                                                                                                                                          |

## Desempenho

Medição de laboratório (Lighthouse 13, mobile simulado, home): **de 6,9 MB para ~480 KB** (já com fonte e badges locais)
transferidos, **CLS de 0,135 para 0,002**, LCP de 15,8 s para 2,4 s, JS de 131 para 17 KB e desktop em **98**.
A metodologia, as limitações e o que ficou de fora estão em
[`docs/performance.md`](docs/performance.md).

## Como rodar

Requer **Node.js ≥ 22.23.4**.

```bash
npm install
npm run dev        # http://localhost:4321
```

| Comando                           | O que faz                                                            |
| --------------------------------- | -------------------------------------------------------------------- |
| `npm run build`                   | gera os ícones, checa tipos (`astro check`) e cria `dist/`           |
| `npm run preview`                 | serve o build localmente                                             |
| `npm run lint` · `lint:fix`       | ESLint                                                               |
| `npm run format` · `format:check` | Prettier                                                             |
| `npm run icons`                   | regenera o subconjunto do Font Awesome (automático no `dev`/`build`) |

### Variáveis de ambiente (opcionais — veja `.env.example`)

| Variável                  | Efeito                                                                                                                       |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `PUBLIC_CONTACT_ENDPOINT` | URL que recebe o formulário via `POST` JSON (Formspree, Web3Forms…). Sem ela, o formulário abre o app de e-mail (`mailto:`). |
| `PUBLIC_VITALS_URL`       | Endpoint que recebe Core Web Vitals reais via `sendBeacon`.                                                                  |

Contrato dos endpoints e o que configurar no servidor: [`docs/configuration.md`](docs/configuration.md).
Cabeçalhos HTTP, CSP e passos no GitHub: [`docs/security.md`](docs/security.md).

## Estrutura

```
public/                 favicons, manifest, imagem social (og-image.jpg), QR Code, PDF do currículo, robots.txt
scripts/fa-subset.mjs   gera o subconjunto do Font Awesome a partir dos ícones usados no código
src/
  assets/               imagens e fontes processadas pelo Astro
  components/           Hero, Skills, Projects, Swot, Contact, Header, Footer, modais…
  data/                 ← edite aqui: projects.ts, skills.ts, site.ts
  layouts/Base.astro    <head> (SEO, JSON-LD), tema, estilos
  lib/badges.ts         gera os badges de tecnologias (SVG) no build → /badges/*.svg
  pages/                index.astro · curriculo.astro
  styles/               index.css importa 35 módulos na ordem original (a cascata depende dela)
  scripts/
    main.ts             entrada: decide O QUE carrega e QUANDO
    deferred.ts         tudo que não é crítico (carregado em ociosidade)
    core/ features/ effects/ data/   (core/storage.ts: acesso seguro a localStorage/sessionStorage)
tests/                  E2E (Playwright), acessibilidade (axe) e SEO
docs/                   preview, desempenho, segurança (CSP, GitHub) e configuração (endpoints)
.github/                workflows de CI e CodeQL, Dependabot
```

### Estratégia de carregamento

1. **Crítico** (`main.ts`): tema, cursor, revelar ao rolar, abertura, navegação.
2. **Ocioso** (`deferred.ts`): efeitos, conquistas, GitHub, tradução, tour…
3. **Perto da tela**: carrossel (Swiper), constelação de skills, gráfico SWOT (Chart.js).
4. **No clique**: terminal, resumo de 30 s e formulário de e-mail.

## Adicionando conteúdo

- **Projeto novo**: acrescente um objeto em `src/data/projects.ts` (imagem em `src/assets/img/`).
  O campo `tech` usa os mesmos identificadores das skills (tipo `TechId`).
- **Tecnologia nova**: acrescente `{ alt, color, logo }` em `src/data/skills.ts` (o badge é gerado no
  build; `logo` é o slug do [simple-icons](https://simpleicons.org)). Esse arquivo é a **fonte única**:
  o badge aparece sozinho na home e no currículo (componente `SkillBadges.astro`).
- **Contadores** do hero (projetos e tecnologias) e o total de conquistas/XP são **derivados dos
  dados** — nada para atualizar à mão.
- **Ícone novo**: escreva a classe (`fa-solid fa-rocket`) no código; o subconjunto é regenerado sozinho.

## Acessibilidade e SEO

- Auditado com **axe-core** em Chromium real (claro e escuro, diálogos abertos): zero violações de
  contraste no tema escuro (padrão) nas duas páginas e Lighthouse de acessibilidade **100** no desktop.
- Foco visível, link "Pular para o conteúdo", diálogos com fundo `inert`, **Esc** e retorno de foco,
  `prefers-reduced-motion` respeitado.
- `canonical`, Open Graph (imagem 1200×630), Twitter Cards, **JSON-LD** (`Person`/`WebSite`/`WebPage`),
  `sitemap-index.xml` e `robots.txt`.

## Decisões técnicas

- **TypeScript 6, não 7**: o `typescript-eslint` e o `@astrojs/check` (e o editor) ainda dependem da
  API em JS do compilador, que o TS 7 nativo não tem. Migrar quando o ecossistema acompanhar.
- **GTranslate no lugar do Google Tradutor**: o Google encerrou o _Website Translator Widget_ em
  1/out/2026. O [GTranslate](https://gtranslate.io) gratuito (`core/translate.ts`) traduz no
  navegador, sem indexação das traduções, e é gratuito para sites pessoais/sem fins comerciais.
  Carrega em ociosidade e, se for bloqueado, o espaço reservado some.
- **Seletor de idioma personalizado**: o widget "Dropdown" do GTranslate gera um `<select class="gt_selector">`
  (com o placeholder "Select Language"). Ele fica na página só como **motor** (invisível); a interface é um
  dropdown próprio (`features/language-switcher.ts` + `styles/components/language-switcher.css`) com só
  **PT / EN / ES**, navegação por teclado (padrão WAI-ARIA de listbox), animações e variações clara/escura/
  responsiva. Ao escolher, o código atribui o valor no `<select>` e dispara `change` — é isso que aciona a
  tradução. Para mudar os idiomas, edite `LANGS` no `.ts` e `languages` em `core/translate.ts`.
- **`compressHTML: false`**: a compressão padrão do Astro remove espaços entre tags inline e cola
  ícones ao texto.
- **CSS cortado em sequência, sem reordenar**: preserva a cascata do CSS original.
- **Font Awesome em subconjunto**: 85 ícones custam ~10 KB; SVGs inline custariam ~38 KB
  (medição em [`docs/performance.md`](docs/performance.md)).

## Próximos passos

- Coletar Core Web Vitals reais (`PUBLIC_VITALS_URL`) e ajustar os limites do Lighthouse CI.
- Configurar `PUBLIC_CONTACT_ENDPOINT` para envio de mensagens sem depender do app de e-mail.
- Investigar o Speed Index da home em dispositivo real (abertura e animações contínuas).

## Créditos

Fonte **Inter** (SIL OFL 1.1, `src/assets/fonts/INTER-LICENSE.txt`) · **Font Awesome Free** (CC BY 4.0 / OFL / MIT) ·
logos dos badges: [simple-icons](https://simpleicons.org) (CC0) e Font Awesome.

## Licença

Ainda não há um arquivo `LICENSE`; por padrão, todos os direitos ficam reservados ao autor.
Para permitir reuso do código, adicione uma licença (ex.: MIT).

---

<div align="center">

Feito por **Lucas Santos** · [GitHub](https://github.com/tirolasca) · [LinkedIn](https://linkedin.com/in/lucas-santostec/)

</div>
