/** Utilitários para adiar JS: ocioso, perto da tela ou na primeira interação. */

type Task = () => unknown | Promise<unknown>;

const RETRIES = 2;
const RETRY_DELAY_MS = 3000;

/**
 * Executa a tarefa e, se ela falhar (ex.: chunk indisponível por rede
 * instável), tenta de novo algumas vezes. Nunca lança: o erro vira um aviso.
 */
async function runWithRetry(label: string, task: Task, retries = RETRIES) {
  for (let attempt = 0; ; attempt++) {
    try {
      await task();
      return;
    } catch (err) {
      if (attempt >= retries) {
        console.warn(`[loader] ${label} indisponível após falhas`, err);
        return;
      }
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
    }
  }
}

/**
 * Memoriza um carregamento, mas esquece o resultado se ele falhar, para que
 * uma falha temporária não deixe a funcionalidade indisponível para sempre.
 */
export function memoizeLoader<T>(load: () => Promise<T>): () => Promise<T> {
  let pending: Promise<T> | undefined;
  return () =>
    (pending ??= load().catch((err) => {
      pending = undefined;
      throw err;
    }));
}

/** Executa quando o navegador está ocioso (com limite de tempo). */
export function onIdle(cb: Task, timeout = 2500, label = "onIdle") {
  const run = () => void runWithRetry(label, cb);
  if ("requestIdleCallback" in window)
    window.requestIdleCallback(run, { timeout });
  else setTimeout(run, 300);
}

/** Executa uma vez quando o alvo chega perto da área visível. */
export function whenNear(
  target: string | Element | null,
  cb: Task,
  rootMargin = "500px",
) {
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  const label = typeof target === "string" ? target : "whenNear";
  const run = () => void runWithRetry(label, cb);
  if (!("IntersectionObserver" in window)) return run();
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      run();
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
  const prefetch = () => void load().catch(() => {}); // a falha aparece no clique
  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    for (const ev of ["pointerenter", "focusin", "touchstart"])
      el.addEventListener(ev, prefetch, { once: true, passive: true });
  });
}

/**
 * Carrega a funcionalidade no primeiro clique e repete o clique, para que o
 * handler registrado pelo módulo assuma (usado por terminal e resumo de 30s).
 * Se o carregamento falhar, o clique seguinte tenta de novo.
 */
export function lazyFeature(selector: string, load: () => Promise<unknown>) {
  const els = [...document.querySelectorAll<HTMLElement>(selector)];
  if (!els.length) return;
  const ensure = memoizeLoader(load);
  prefetchOnIntent(selector, ensure);

  const handlers = new Map<HTMLElement, (e: Event) => void>();
  const release = () =>
    handlers.forEach((h, el) => el.removeEventListener("click", h, true));
  els.forEach((el) => {
    const first = async (e: Event) => {
      e.stopImmediatePropagation();
      e.preventDefault();
      try {
        await ensure();
      } catch (err) {
        console.warn(`[loader] ${selector} não carregou; tente novamente`, err);
        return; // mantém o handler: o próximo clique tenta de novo
      }
      release();
      el.click();
    };
    handlers.set(el, first);
    el.addEventListener("click", first, true);
  });
}
