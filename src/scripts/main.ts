/**
 * Ponto de entrada. Estratégia de carregamento:
 *  1. crítico   → aqui (tema, cursor, revelar ao rolar, abertura, navegação)
 *  2. ocioso    → deferred.ts (efeitos, conquistas, GitHub, tradução…)
 *  3. por perto → carrossel, constelação de skills e gráfico SWOT (Chart.js)
 *  4. no clique → terminal, resumo de 30s e formulário de e-mail
 */
import { initCursor } from "./core/cursor";
import {
  lazyFeature,
  memoizeLoader,
  onIdle,
  prefetchOnIntent,
  whenNear,
} from "./core/loaders";
import { initReveal } from "./core/reveal";
import { initScrollProgress } from "./core/scroll";
import { initTheme } from "./core/theme";
import { initBackToTop } from "./features/back-to-top";
import { initBootSequence } from "./features/boot";
import { initSideNavDots } from "./features/side-nav";
import { initTypewriter } from "./features/typewriter";

const EMAIL_TRIGGERS = '.contact-btn.email, .social-btn[title="E-mail"]';

function init() {
  // 1. crítico
  initReveal();
  initTheme();
  initScrollProgress();
  initCursor();
  initTypewriter();
  initBackToTop();
  initSideNavDots();
  initBootSequence();

  // 2. ocioso
  onIdle(
    () => import("./deferred").then((m) => m.initDeferred()),
    2500,
    "deferred",
  );
  onIdle(
    () => import("./core/vitals").then((m) => m.initVitals()),
    5000,
    "vitals",
  );
  onIdle(
    () => import("./core/speed-insights").then((m) => m.initSpeedInsights()),
    2500,
    "speed-insights",
  );

  // 3. quando chegam perto da tela
  whenNear(".projects-swiper", () =>
    import("./core/carousel").then((m) => m.initProjectsCarousel()),
  );
  whenNear(".skills-grid", () =>
    import("./features/skill-constellation").then((m) =>
      m.initSkillConstellation(),
    ),
  );
  whenNear("#swotChart", () =>
    import("./features/swot-chart").then((m) => m.initSwotChart()),
  );

  // 4. na interação
  lazyFeature("#terminal-btn", () =>
    import("./features/terminal").then((m) => m.initTerminal()),
  );
  lazyFeature("#summary-mode-btn", () =>
    import("./features/summary-mode").then((m) => m.initSummaryMode()),
  );

  const loadEmail = memoizeLoader(() => import("./features/email"));
  prefetchOnIntent(EMAIL_TRIGGERS, loadEmail);
  document.querySelectorAll<HTMLElement>(EMAIL_TRIGGERS).forEach((el) => {
    el.addEventListener("click", async (e) => {
      e.preventDefault(); // sem JS, o link mailto: continua funcionando
      try {
        (await loadEmail()).openEmailModal(el);
      } catch (err) {
        console.warn("[loader] formulário de contato não carregou", err);
        const href = el.getAttribute("href");
        if (href?.startsWith("mailto:")) window.location.href = href;
      }
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
