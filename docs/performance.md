<div align="center">

<img src="https://raw.githubusercontent.com/tirolasca/tirolasca/main/assets/divider.svg" alt="" width="100%">

Os números abaixo são de laboratório (Lighthouse 13.6, Chromium 153 headless, perfil mobile simulado: Moto G Power, 4G lento).

> [!WARNING]
> **Limites da medição.** Foi feita num ambiente sem internet: o GTranslate e a API do GitHub **não carregaram** (geram os "erros de console" de rede que o Lighthouse mostra). As fontes do Google e os 57 badges do shields.io também não carregavam, e **hoje não existem mais**: a Inter e os badges são locais, então entram na conta de bytes e a comparação de transferido abaixo é conservadora (o "antes" não contava esses requests). Há variação entre rodadas (a home mobile oscilou de 87 a 97). Para dados reais use o `web-vitals` (abaixo) e rode o Lighthouse na sua máquina.

## 📈 Antes → depois

| Página / perfil    | Performance    | FCP             | LCP              | CLS               | Transferido           | JS          | CSS        | Imagens           |
| ------------------ | -------------- | --------------- | ---------------- | ----------------- | --------------------- | ----------- | ---------- | ----------------- |
| Home · mobile      | 70 → **91–95** | 1,4 → **0,9 s** | 15,8 → **2,4 s** | 0,135 → **0,002** | 6,9 MB → **477 KB** ¹ | 131 → 17 KB | 45 → 23 KB | 6,4 MB → 369 KB ¹ |
| Currículo · mobile | 96 → **98**    | 1,4 → **0,9 s** | 1,4 → **0,9 s**  | 0,093 → **0**     | 496 → **153 KB** ¹    | 131 → 17 KB | 45 → 23 KB | 81 → 44 KB        |
| Home · desktop     | 82 → **98**    | —               | 2,9 → **0,7 s**  | 0,019 → 0,018     | 5,9 MB → **295 KB**   | —           | —          | 5,5 MB → 233 KB   |

¹ Agora inclui a Inter local (48 KB) e os badges locais, que antes eram requests externos que falhavam neste ambiente e não eram contados.

Acessibilidade 96 → **100** · Boas práticas 96 · SEO **100**. JS/CSS/fontes em KB **gzip**.

### 🔍 Pontos de atenção honestos

- **Speed Index da home** oscila bastante (3,3–6,9 s) e é o que mais derruba a nota. Experimento controlado: sem a abertura (preloader) a home fica em **96–97**; com ela, 87–95. Por isso o ritmo da abertura foi encurtado (~3 s → ~1,7 s), ela pode ser pulada (toque/tecla) e some com `prefers-reduced-motion`. O restante provavelmente vem das animações contínuas (canvas, tags flutuantes, gradiente), que impedem a página de "estabilizar" visualmente: avalie em dispositivo real antes de mexer mais.
- Rodadas ocasionais do Lighthouse falham com `NO_SCREENSHOTS` (problema da ferramenta) e foram repetidas.

<img src="https://raw.githubusercontent.com/tirolasca/tirolasca/main/assets/divider.svg" alt="" width="100%">

## 🛠️ O que mudou

| Item                           | O que foi feito                                                                                                                                                                                                                                       |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Carregamento dinâmico**      | JS inicial só com o crítico (~5 KB gz). O resto vem por `import()`: ocioso (`deferred.ts`), perto da tela (carrossel, constelação, **Chart.js ~55 KB (só o radar) no currículo, perto do gráfico**) ou no clique (terminal, resumo 30 s, formulário). |
| **Imagens**                    | `astro:assets`: AVIF + WebP responsivos com `srcset`. `planet.png` 2,9 MB → ~9–35 KB. QR Code do hero 132 KB → ~40 KB.                                                                                                                                |
| **AOS → IntersectionObserver** | O site usava 4 efeitos (`fade-up/left/right`, `zoom-in`). Substituído por ~60 linhas (`core/reveal.ts`) + 30 de CSS, sem a dependência `aos` (JS + CSS). Só anima o que está abaixo da 1ª tela (não atrasa o LCP).                                    |
| **CSS**                        | 45 → 22 KB gz: sem CSS do AOS/Swiper-bundle/Font Awesome inteiro, 13 regras mortas removidas. Swiper só com os módulos usados (Navigation, Autoplay).                                                                                                 |
| **Ícones**                     | Font Awesome **subconjunto gerado** (`npm run icons`, automático no `dev`/`build`): 87 ícones, fontes 230 → ~10 KB, CSS ~100 → 5,8 KB.                                                                                                                |
| **Layout shift**               | O toast de conquista animava `right` (gerava CLS 0,135); agora `transform`. Imagens com `width/height`; carrossel com layout equivalente antes de o Swiper carregar.                                                                                  |
| **Contraste / tema**           | Tema escuro aplicado no `<head>` (antes havia um flash claro → escuro na 1ª visita). Cores de texto do tema claro com contraste AA. `html` com `background-color` real.                                                                               |
| **Cache/headers**              | `vercel.json`: assets com hash `immutable`, cabeçalhos de segurança básicos.                                                                                                                                                                          |

<img src="https://raw.githubusercontent.com/tirolasca/tirolasca/main/assets/divider.svg" alt="" width="100%">

## 🧊 Vidro em repouso (`backdrop-filter`)

O efeito de vidro (`--glass-blur: blur(20px) saturate(1.8)` e variações) estava declarado também em elementos que ficam **fechados** quase o tempo todo: modais, terminal, gaveta de conquistas, toasts, menu de idioma, rótulos da navegação lateral, botão de voltar ao topo e o card do tour. Fechados por `opacity: 0` (ou fora da tela), eles continuavam entrando na passada de renderização, e a cada frame de uma animação por trás o navegador refazia o desfoque.

Medido em laboratório (currículo, mobile simulado, ambiente de 1 núcleo, execuções únicas e por isso aproximadas): sem animações ou sem `backdrop-filter` a nota ia de **0,78 para 1,00** (TBT de 871 ms para ~24–90 ms); desligar o `backdrop-filter` só dos elementos fechados levou a **0,96** (TBT 184 ms).

**O que foi feito:** o `backdrop-filter` desses elementos passou a valer apenas no estado aberto (`.active`, `.open`, `.show`, `.is-open`, `.visible`, `:hover`). Aberto, o visual é o mesmo; a única diferença é que, ao **fechar**, o desfoque some de imediato em vez de acompanhar o fade de opacidade. Com isso o currículo ficou com mediana **0,89** (TBT ~400 ms) no mesmo ambiente.

**Não resolvido:** na home, o que mais pesa são as animações CSS contínuas (sem elas a nota passou de 0,61 para 0,91 no mesmo teste), e não o `backdrop-filter` nem os canvas. Reduzir isso exige decisão de design (por exemplo, trocar `background-position`, `box-shadow` e `filter` por `transform` e `opacity` nos títulos neon, barras e bordas dos cards).

## 🔬 Avaliações

<details>
<summary><b>🎯 Migrar ícones para SVG?</b></summary>

<br>

Medido com 85 ícones (hoje são 87): SVGs inline somariam **~38 KB gz** (uma ocorrência de cada) contra **~10,7 KB** do subconjunto de fonte (fonte + CSS, em gzip). **Não compensa** migrar tudo. A migração gradual faz sentido só para poucos ícones críticos acima da dobra (se um dia o `font-display: block` incomodar). O gerador de subconjunto cobre o dia a dia: é só escrever a classe (`fa-solid fa-rocket`) no código.

</details>

<details>
<summary><b>🎬 Animações</b></summary>

<br>

- 43 `@keyframes`, 32 animações infinitas. 23 keyframes animam propriedades que forçam repintura (`box-shadow`, `filter`, `text-shadow`, `background-position`, `clip-path`).
- Medição (headless, sem GPU): as animações custam ~45 ms/s de main thread (≈ 4–5 % de um núcleo); o fundo animado do `body` sozinho foi irrelevante. **Não justifica reescrever**.
- Aplicado: animações infinitas **pausam fora da tela** (`core/animation-guard.ts`) e o canvas de partículas só roda enquanto visível. `prefers-reduced-motion` já era respeitado.
- Se quiser ir além: trocar `background-position`/`box-shadow` por `transform`/`opacity` nos títulos neon, barras de progresso e bordas dos cards.

</details>

<details>
<summary><b>♿ Acessibilidade</b></summary>

<br>

Auditoria com **axe-core em Chromium real** (claro e escuro, ambas as páginas, e com os diálogos abertos) + ESLint (`jsx-a11y`).

- Corrigido: contraste de títulos/stats/botões, nome acessível do botão de conquistas, `role="status"` nos toasts, ordem de títulos do resumo, região rolável focável, ícones decorativos com `aria-hidden`, foco visível global, link "Pular para o conteúdo".
- Diálogos (e-mail, terminal, conquistas, GitHub, resumo): fundo `inert`, foco no primeiro controle, **Esc** fecha e o foco volta a quem abriu.
- As palavras flutuantes do hero (decorativas, `aria-hidden`) agora também passam no contraste do tema claro; nos testes o axe as exclui por serem decoração móvel.

</details>

<img src="https://raw.githubusercontent.com/tirolasca/tirolasca/main/assets/divider.svg" alt="" width="100%">

## 📡 Core Web Vitals reais

`src/scripts/core/vitals.ts` usa a biblioteca `web-vitals` (LCP, CLS, INP, FCP, TTFB):

- desenvolvimento, ou `?vitals` na URL → imprime no console;
- `PUBLIC_VITALS_URL` definido → envia por `sendBeacon` para o seu endpoint (veja [`configuration.md`](configuration.md)).

Sem nenhum dos dois, a biblioteca nem é baixada. Para laboratório:

```bash
npm run build && npm run preview
npx lighthouse http://localhost:4321 --preset=desktop --view
npx lighthouse http://localhost:4321 --view            # mobile
```

<img src="https://raw.githubusercontent.com/tirolasca/tirolasca/main/assets/divider.svg" alt="" width="100%">

## 🧪 Testes e CI

- `npm run test` (Vitest + happy-dom): funções puras, `core/storage.ts` (inclusive com o storage bloqueado), integridade dos dados (projetos, skills, conquistas, tour) e o gráfico SWOT, que é montado de verdade para pegar erro de _tree-shaking_ do Chart.js.
- `npm run test:e2e` (Playwright): carregamento sob demanda, ausência de terceiros, ícones, formulário (validação, foco, rascunho), diálogos, SEO e **axe** nas duas páginas e temas. Sem navegadores do Playwright: `CHROME_PATH=/caminho/do/chrome npm run test:e2e`.
- GitHub Actions (`.github/workflows/ci.yml`): ESLint, Stylelint, Prettier, CSpell, Knip, Vitest, tipos+build, **size-limit**, **Linkinator** (links do `dist/`), E2E e Lighthouse CI (`lighthouserc.json`). Os workflows de segurança estão em [`security.md`](security.md).
- Localmente, `npm run quality` roda lint, CSS, formatação, tipos, testes, Knip e CSpell de uma vez, e o hook de commit (Husky + lint-staged) cobre os arquivos alterados.

### 📦 Orçamento de tamanho (size-limit)

`npm run size` mede o `dist/` em **gzip** e reprova se passar do limite (`.size-limit.json`). Medido neste build:

| Grupo                               | Medido  | Limite |
| ----------------------------------- | ------- | ------ |
| CSS (total)                         | 25,5 kB | 30 kB  |
| JS de entrada (`Base`)              | 5,6 kB  | 7 kB   |
| JS sob demanda, sem o Chart.js      | ~48 kB  | 56 kB  |
| Chart.js (`swot-chart`, só o radar) | 55,4 kB | 62 kB  |

Estes valores são de gzip nível máximo, medidos pelo size-limit, e podem diferir dos da tabela "Antes → depois" (medidos no Lighthouse, com a compressão do servidor).

### 🎚️ Critérios do Lighthouse CI

Home e currículo, 3 execuções cada, avaliando a **mediana** (uma rodada ruim isolada não reprova).

| Item                | Limite    | Efeito     | Por quê                                                                             |
| ------------------- | --------- | ---------- | ----------------------------------------------------------------------------------- |
| Acessibilidade, SEO | ≥ 0,95    | 🔴 reprova | Resultados estáveis em 1,00; qualquer queda é regressão real.                       |
| Boas práticas       | ≥ 0,90    | 🔴 reprova | Estável em 0,96.                                                                    |
| Performance         | ≥ 0,80    | 🔴 reprova | Folga sobre ~0,96–1,00 medidos, para absorver a variação entre runners do GitHub.   |
| CLS                 | ≤ 0,1     | 🔴 reprova | Limite "bom" do Core Web Vitals.                                                    |
| LCP                 | ≤ 4000 ms | 🔴 reprova | Folga sobre ~2,4 s; o limite "bom" é 2,5 s e fica como meta, não como trava.        |
| TBT                 | ≤ 300 ms  | 🟡 avisa   | Métrica de laboratório sensível ao runner.                                          |
| Speed Index         | ≤ 4300 ms | 🟡 avisa   | Oscila bastante; o limite "bom" para mobile é 3,4 s. Veja o ponto de atenção acima. |

> [!NOTE]
> Medição na máquina do autor (Lighthouse CI 0.15.1, mobile simulado, mediana de 3 execuções). A nota **oscila bastante entre rodadas e entre máquinas**:
>
> |                              | Antes do ajuste do vidro | Depois do ajuste do vidro |
> | ---------------------------- | ------------------------ | ------------------------- |
> | **Home** · performance       | 0,64 a 0,73              | 0,76 a 0,77               |
> | **Home** · Speed Index / TBT | 4,6–4,9 s / ~1,0 s       | 4,5 s / 0,69 s            |
> | **Currículo** · TBT          | 0,95 s                   | 0,89 s                    |
>
> Mesmo depois do ajuste, a home ficou abaixo do limite de 0,80 que reprova o CI **nesta máquina**; o currículo não reprova, mas segue com aviso de TBT. O CI do GitHub roda em outro hardware, então vale conferir o resultado lá. Na revisão anterior a home media Speed Index de 3,5 s e TBT de 29 ms. São dados de laboratório, não de usuários reais. A causa encontrada e o ajuste feito estão em [Vidro em repouso](#-vidro-em-repouso-backdrop-filter).

## 💡 Ideias que ficaram de fora

- Reduzir o custo contínuo das animações (trocar `background-position`/`box-shadow` por `transform`/`opacity`), só se medições em dispositivo real mostrarem problema.
- Coletar Core Web Vitals reais em produção (`PUBLIC_VITALS_URL`) e ajustar os limites do Lighthouse CI.
