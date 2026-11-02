/**
 * Pausa animações CSS infinitas de elementos que estão fora da tela
 * (o navegador não as pausa sozinho, e cada quadro custa estilo/pintura).
 * O CSS correspondente está em styles/base/animations.css.
 */
const SELECTOR = [
  ".skill-card",
  ".animated-title",
  ".timeline",
  ".progress-bar",
  ".project-card",
  ".gh-activity-dot",
].join(",");

export function initAnimationGuard() {
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries)
        e.target.toggleAttribute("data-offscreen", !e.isIntersecting);
    },
    { rootMargin: "120px" },
  );
  document.querySelectorAll(SELECTOR).forEach((el) => io.observe(el));
}
