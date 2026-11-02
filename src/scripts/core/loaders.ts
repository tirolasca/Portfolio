/** Utilitários para adiar JS: ocioso, perto da tela ou na primeira interação. */

/** Executa quando o navegador está ocioso (com limite de tempo). */
export function onIdle(cb: () => void, timeout = 2500) {
  if ("requestIdleCallback" in window)
    window.requestIdleCallback(() => cb(), { timeout });
  else setTimeout(cb, 300);
}

/** Executa uma vez quando o alvo chega perto da área visível. */
export function whenNear(
  target: string | Element | null,
  cb: () => void,
  rootMargin = "500px",
) {
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  if (!("IntersectionObserver" in window)) return cb();
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      cb();
    },
    { rootMargin },
  );
  io.observe(el);
}

/** Começa a baixar o módulo quando o usuário "se aproxima" do elemento (hover/foco/toque). */
export function prefetchOnIntent(
  selector: string,
  load: () => Promise<unknown>,
) {
  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    for (const ev of ["pointerenter", "focusin", "touchstart"])
      el.addEventListener(ev, () => void load(), { once: true, passive: true });
  });
}

/**
 * Carrega a funcionalidade no primeiro clique e repete o clique, para que o
 * handler registrado pelo módulo assuma (usado por terminal e resumo de 30s).
 */
export function lazyFeature(selector: string, load: () => Promise<unknown>) {
  const els = [...document.querySelectorAll<HTMLElement>(selector)];
  if (!els.length) return;
  let loading: Promise<unknown> | undefined;
  const ensure = () => (loading ??= load());
  prefetchOnIntent(selector, ensure);

  const handlers = new Map<HTMLElement, (e: Event) => void>();
  const release = () =>
    handlers.forEach((h, el) => el.removeEventListener("click", h, true));
  els.forEach((el) => {
    const first = async (e: Event) => {
      e.stopImmediatePropagation();
      e.preventDefault();
      await ensure();
      release();
      el.click();
    };
    handlers.set(el, first);
    el.addEventListener("click", first, true);
  });
}
