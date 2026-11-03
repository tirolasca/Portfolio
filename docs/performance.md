# Desempenho, acessibilidade e SEO

Relatório das otimizações e de **como medir**. Os números abaixo são de laboratório
(Lighthouse 13.6, Chromium 153 headless, perfil mobile simulado — Moto G Power, 4G lento).

> **Limites da medição.** Foi feita num ambiente sem internet: o GTranslate e a API do
> GitHub **não carregaram** (geram os "erros de console" de rede que o Lighthouse mostra).
> As fontes do Google e os 57 badges do shields.io também não carregavam — **hoje não
> existem mais**: a Inter e os badges são locais, então entram na conta de bytes e a
> comparação de transferido abaixo é conservadora (o "antes" não contava esses requests).
> Há variação entre rodadas (a home mobile oscilou de 87 a 97). Para dados reais use o
> `web-vitals` (abaixo) e rode o Lighthouse na sua máquina.

## Antes → depois

| Página / perfil    | Performance    | FCP             | LCP              | CLS               | Transferido           | JS          | CSS        | Imagens           |
| ------------------ | -------------- | --------------- | ---------------- | ----------------- | --------------------- | ----------- | ---------- | ----------------- |
| Home · mobile      | 70 → **91–95** | 1,4 → **0,9 s** | 15,8 → **2,4 s** | 0,135 → **0,002** | 6,9 MB → **477 KB** ¹ | 131 → 17 KB | 45 → 23 KB | 6,4 MB → 369 KB ¹ |
| Currículo · mobile | 96 → **98**    | 1,4 → **0,9 s** | 1,4 → **0,9 s**  | 0,093 → **0**     | 496 → **153 KB** ¹    | 131 → 17 KB | 45 → 23 KB | 81 → 44 KB        |
| Home · desktop     | 82 → **98**    | —               | 2,9 → **0,7 s**  | 0,019 → 0,018     | 5,9 MB → **295 KB**   | —           | —          | 5,5 MB → 233 KB   |

¹ Agora inclui a Inter local (48 KB) e os badges locais, que antes eram requests externos
que falhavam neste ambiente e não eram contados.

Acessibilidade 96 → **100** · Boas práticas 96 · SEO **100**.
JS/CSS/fontes em KB **gzip**.

Pontos de atenção honestos:

- **Speed Index da home** oscila bastante (3,3–6,9 s) e é o que mais derruba a nota. Experimento
  controlado: sem a abertura (preloader) a home fica em **96–97**; com ela, 87–95. Por isso o ritmo
  da abertura foi encurtado (~3 s → ~1,7 s), ela pode ser pulada (toque/tecla) e some com
  `prefers-reduced-motion`. O restante provavelmente vem das animações contínuas (canvas, tags
  flutuantes, gradiente), que impedem a página de "estabilizar" visualmente — avalie em
  dispositivo real antes de mexer mais.
- Rodadas ocasionais do Lighthouse falham com `NO_SCREENSHOTS` (problema da ferramenta)
  e foram repetidas.

## O que mudou

| Item                       | O que foi feito                                                                                                                                                                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Carregamento dinâmico      | JS inicial só com o crítico (~5 KB gz). O resto vem por `import()`: ocioso (`deferred.ts`), perto da tela (carrossel, constelação, **Chart.js 68 KB só no currículo, perto do gráfico**) ou no clique (terminal, resumo 30 s, formulário). |
| Imagens                    | `astro:assets`: AVIF + WebP responsivos com `srcset`. `planet.png` 2,9 MB → ~9–35 KB. QR Code do hero 132 KB → ~40 KB.                                                                                                                     |
| AOS → IntersectionObserver | O site usava 4 efeitos (`fade-up/left/right`, `zoom-in`). Substituído por ~60 linhas (`core/reveal.ts`) + 30 de CSS, sem a dependência `aos` (JS + CSS). Só anima o que está abaixo da 1ª tela (não atrasa o LCP).                         |
| CSS                        | 45 → 22 KB gz: sem CSS do AOS/Swiper-bundle/Font Awesome inteiro, 13 regras mortas removidas. Swiper só com os módulos usados (Navigation, Autoplay).                                                                                      |
| Ícones                     | Font Awesome **subconjunto gerado** (`npm run icons`, automático no `dev`/`build`): 85 ícones, fontes 230 → 9 KB, CSS ~100 → 5,7 KB.                                                                                                       |
| Layout shift               | O toast de conquista animava `right` (gerava CLS 0,135); agora `transform`. Imagens com `width/height`; carrossel com layout equivalente antes de o Swiper carregar.                                                                       |
| Contraste / tema           | Tema escuro aplicado no `<head>` (antes havia um flash claro → escuro na 1ª visita). Cores de texto do tema claro com contraste AA. `html` com `background-color` real.                                                                    |
| Cache/headers              | `vercel.json`: assets com hash `immutable`, cabeçalhos de segurança básicos.                                                                                                                                                               |

## Avaliação: migrar ícones para SVG?

Medido com os 85 ícones usados: SVGs inline somariam **~38 KB gz** (uma ocorrência de cada)
contra **~10,7 KB** do subconjunto de fonte (9 KB de fonte + 1,7 KB de CSS). **Não compensa**
migrar tudo. A migração gradual faz sentido só para poucos ícones críticos acima da dobra
(se um dia o `font-display: block` incomodar). O gerador de subconjunto cobre o dia a dia:
é só escrever a classe (`fa-solid fa-rocket`) no código.

## Avaliação: animações

- 43 `@keyframes`, 32 animações infinitas. 23 keyframes animam propriedades que forçam
  repintura (`box-shadow`, `filter`, `text-shadow`, `background-position`, `clip-path`).
- Medição (headless, sem GPU): as animações custam ~45 ms/s de main thread (≈ 4–5 %
  de um núcleo); o fundo animado do `body` sozinho foi irrelevante. **Não justifica reescrever**.
- Aplicado: animações infinitas **pausam fora da tela** (`core/animation-guard.ts`) e o canvas
  de partículas só roda enquanto visível. `prefers-reduced-motion` já era respeitado.
- Se quiser ir além: trocar `background-position`/`box-shadow` por `transform`/`opacity`
  nos títulos neon, barras de progresso e bordas dos cards.

## Acessibilidade

Auditoria com **axe-core em Chromium real** (claro e escuro, ambas as páginas, e com os
diálogos abertos) + ESLint (`jsx-a11y`).

- Corrigido: contraste de títulos/stats/botões, nome acessível do botão de conquistas,
  `role="status"` nos toasts, ordem de títulos do resumo, região rolável focável,
  ícones decorativos com `aria-hidden`, foco visível global, link "Pular para o conteúdo".
- Diálogos (e-mail, terminal, conquistas, GitHub, resumo): fundo `inert`, foco no
  primeiro controle, **Esc** fecha e o foco volta a quem abriu.
- As palavras flutuantes do hero (decorativas, `aria-hidden`) agora também passam no contraste
  do tema claro; nos testes o axe as exclui por serem decoração móvel.

## Core Web Vitals reais

`src/scripts/core/vitals.ts` usa a biblioteca `web-vitals` (LCP, CLS, INP, FCP, TTFB):

- desenvolvimento, ou `?vitals` na URL → imprime no console;
- `PUBLIC_VITALS_URL` definido → envia por `sendBeacon` para o seu endpoint.

Sem nenhum dos dois, a biblioteca nem é baixada. Para laboratório:

```bash
npm run build && npm run preview
npx lighthouse http://localhost:4321 --preset=desktop --view
npx lighthouse http://localhost:4321 --view            # mobile
```

## Testes e CI

- `npm run test:e2e` (Playwright): carregamento sob demanda, ausência de terceiros, ícones,
  formulário (validação, foco, rascunho), diálogos, SEO e **axe** nas duas páginas e temas.
  Sem navegadores do Playwright: `CHROME_PATH=/caminho/do/chrome npm run test:e2e`.
- GitHub Actions (`.github/workflows/ci.yml`): lint, formatação, tipos+build, E2E e
  Lighthouse CI (`lighthouserc.json`).

### Critérios do Lighthouse CI

Home e currículo, 3 execuções cada, avaliando a **mediana** (uma rodada ruim isolada não reprova).

| Item                | Limite    | Efeito  | Por quê                                                                             |
| ------------------- | --------- | ------- | ----------------------------------------------------------------------------------- |
| Acessibilidade, SEO | ≥ 0,95    | reprova | Resultados estáveis em 1,00; qualquer queda é regressão real.                       |
| Boas práticas       | ≥ 0,90    | reprova | Estável em 0,96.                                                                    |
| Performance         | ≥ 0,80    | reprova | Folga sobre ~0,96–1,00 medidos, para absorver a variação entre runners do GitHub.   |
| CLS                 | ≤ 0,1     | reprova | Limite "bom" do Core Web Vitals.                                                    |
| LCP                 | ≤ 4000 ms | reprova | Folga sobre ~2,4 s; o limite "bom" é 2,5 s e fica como meta, não como trava.        |
| TBT                 | ≤ 300 ms  | avisa   | Métrica de laboratório sensível ao runner.                                          |
| Speed Index         | ≤ 4300 ms | avisa   | Oscila bastante; o limite "bom" para mobile é 3,4 s. Veja o ponto de atenção acima. |

Medição desta revisão (Lighthouse CI 0.15.1, mobile simulado, sem internet — o GTranslate e a API do
GitHub não carregam), mediana de 3 execuções: **home** performance 0,97 · acessibilidade 1,00 · boas
práticas 0,96 · SEO 1,00 · FCP 0,98 s · LCP 2,4 s · CLS 0,009 · TBT 29 ms · **Speed Index 3,5 s**;
**currículo** performance 1,00 · LCP 1,9 s · CLS 0,001 · Speed Index 1,7 s. São dados de laboratório,
não de usuários reais.

## Ideias que ficaram de fora

- Reduzir o custo contínuo das animações (trocar `background-position`/`box-shadow` por
  `transform`/`opacity`) — só se medições em dispositivo real mostrarem problema.
- Coletar Core Web Vitals reais em produção (`PUBLIC_VITALS_URL`) e ajustar os limites do Lighthouse CI.
