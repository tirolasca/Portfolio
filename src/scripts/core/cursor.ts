import { state } from "../state";

/** Elementos que ativam o anel "grande" do cursor (o cursor nativo fica oculto). */
const INTERACTIVE =
  'a, button, [role="button"], [role="option"], summary, select, label[for], .social-btn, .toggle-btn, .skill-badges img, .side-dot';

/** Cursor personalizado (ponto + anel) e posição do brilho dos cards. */
export function initCursor() {
  const dot = document.querySelector<HTMLElement>(".cursor-dot");
  const outline = document.querySelector<HTMLElement>(".cursor-outline");
  const glowCards = document.querySelectorAll<HTMLElement>(".glow-card");
  let ticking = false;
  let revealed = false;

  // Fica invisível até o primeiro movimento (evita um ponto parado no canto).
  if (dot && outline) {
    dot.style.opacity = "0";
    outline.style.opacity = "0";
  }

  document.addEventListener("mousemove", (e) => {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (dot && outline) {
          dot.style.left = `${state.mouseX}px`;
          dot.style.top = `${state.mouseY}px`;
          outline.style.left = `${state.mouseX}px`;
          outline.style.top = `${state.mouseY}px`;
          if (!revealed) {
            dot.style.opacity = "";
            outline.style.opacity = "";
            revealed = true;
          }
        }
        glowCards.forEach((card) => {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--mouse-x", `${state.mouseX - r.left}px`);
          card.style.setProperty("--mouse-y", `${state.mouseY - r.top}px`);
        });
        ticking = false;
      });
      ticking = true;
    }
  });

  // Delegação: também vale para elementos criados depois (modais, toasts).
  document.addEventListener("mouseover", (e) => {
    if ((e.target as Element).closest?.(INTERACTIVE))
      document.body.classList.add("cursor-active");
  });
  document.addEventListener("mouseout", (e) => {
    const next = e.relatedTarget as Element | null;
    if (!next?.closest?.(INTERACTIVE))
      document.body.classList.remove("cursor-active");
  });
}
