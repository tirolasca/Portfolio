import { prefersReducedMotion } from "../state";

/** Distância (px) da borda inferior da tela para disparar a animação. */
const OFFSET = 50;

/**
 * Revela elementos `[data-reveal]` quando entram na tela (IntersectionObserver).
 * Valores: fade-up | fade-right | fade-left | zoom-in. Atraso opcional: data-reveal-delay="200".
 */
export function initReveal() {
  const all = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (!all.length) return;

  // Só anima o que está abaixo da primeira tela: o conteúdo inicial nunca fica
  // escondido esperando o JS (isso atrasaria o LCP).
  const fold = window.innerHeight - OFFSET;
  const items = [...all].filter((el) => {
    if (el.getBoundingClientRect().top < fold) {
      el.removeAttribute("data-reveal");
      return false;
    }
    return true;
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) return;
  // `.js` só entra depois da decisão acima (não esconde nada antes da hora)
  document.documentElement.classList.add("js");

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        io.unobserve(el);
        el.classList.add("is-visible");
        release(el);
      }
    },
    { rootMargin: `0px 0px -${OFFSET}px 0px` },
  );

  items.forEach((el) => {
    const delay = el.dataset.revealDelay;
    if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
    io.observe(el);
  });
}

/** Ao fim da animação devolve o elemento ao CSS normal (sem conflito com :hover/transform). */
function release(el: HTMLElement) {
  function done() {
    clearTimeout(timer);
    el.removeEventListener("transitionend", onEnd);
    el.removeAttribute("data-reveal");
    el.classList.remove("is-visible");
    el.style.removeProperty("--reveal-delay");
  }
  function onEnd(e: TransitionEvent) {
    if (e.target === el && e.propertyName === "opacity") done();
  }
  el.addEventListener("transitionend", onEnd);
  const timer = setTimeout(done, 2500); // garantia caso a transição não dispare
}
