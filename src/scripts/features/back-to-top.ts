export function initBackToTop() {
  const backToTop = document.querySelector<HTMLElement>(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("visible", window.scrollY > 200);
      const safe = Math.max(
        20,
        document.body.offsetHeight - (window.scrollY + window.innerHeight + 50),
      );
      backToTop.style.bottom = safe + "px";
    });
    backToTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}
