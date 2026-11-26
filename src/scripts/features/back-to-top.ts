import { scrollBehavior } from "../state";

export function initBackToTop() {
  const backToTop = document.querySelector<HTMLElement>(".back-to-top");

  if (!backToTop) return;

  const footer = document.querySelector<HTMLElement>(".site-footer, footer");

  /**
   * Como o botão usa position: fixed, só o elevamos quando o rodapé entra
   * na viewport. A distância restante do documento não é um bottom válido.
   * O deslocamento-base permanece definido no CSS para desktop e mobile.
   */
  const updatePosition = () => {
    const footerTop = footer?.getBoundingClientRect().top ?? Infinity;
    const overlap = Math.max(0, window.innerHeight - footerTop);

    if (overlap > 0) {
      backToTop.style.bottom = `calc(var(--back-to-top-offset, 20px) + ${Math.ceil(overlap)}px)`;
    } else {
      backToTop.style.removeProperty("bottom");
    }
  };

  const updateVisibility = () => {
    backToTop.classList.toggle("visible", window.scrollY > 200);
    updatePosition();
  };

  window.addEventListener("scroll", updateVisibility, { passive: true });
  window.addEventListener("resize", updatePosition, { passive: true });

  updateVisibility();

  backToTop.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  });
}
