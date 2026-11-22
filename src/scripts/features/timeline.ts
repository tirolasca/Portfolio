export function initTimelineProgress() {
  const timelineEl = document.querySelector<HTMLElement>(".timeline");
  if (!timelineEl) return;
  const timeline: HTMLElement = timelineEl;

  let ticking = false;
  function update() {
    const rect = timeline.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height + vh * 0.5;
    const scrolled = vh * 0.75 - rect.top;
    const progress = Math.min(1, Math.max(0, scrolled / total));
    timeline.style.setProperty("--timeline-fill", progress * 100 + "%");
    ticking = false;
  }
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
}

export function initTimelineToggle() {
  document.querySelectorAll<HTMLElement>(".toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const details = btn
        .closest(".timeline-content")
        ?.querySelector<HTMLElement>(".details");
      if (details) {
        const open = details.classList.toggle("show");
        details.style.maxHeight = open ? details.scrollHeight + "px" : "";
        btn.textContent = open ? "Ocultar detalhes" : "Ver mais detalhes";
      }
    });
  });
}
