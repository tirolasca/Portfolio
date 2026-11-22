import { updateSideNavDots } from "../features/side-nav";

/** Barra de leitura + scrollbar que aparece só durante a rolagem. */
export function initScrollProgress() {
  let scrollTimeout: ReturnType<typeof setTimeout> | undefined;
  const progress = document.getElementById("reading-progress");
  window.addEventListener("scroll", () => {
    document.documentElement.classList.add("show-scrollbar");
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(
      () => document.documentElement.classList.remove("show-scrollbar"),
      800,
    );
    if (progress) {
      const s = document.documentElement.scrollTop || document.body.scrollTop;
      const h =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      progress.style.width = (s / h) * 100 + "%";
    }
    updateSideNavDots();
  });
}
