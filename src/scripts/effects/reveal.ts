import { prefersReducedMotion } from "../state";

export function initIntersectionObserver() {
  const fadeEls = document.querySelectorAll<HTMLElement>(
    ".fade-up,.card,.skill-card,.project-card,.swot-card",
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  fadeEls.forEach((el) => observer.observe(el));
}

export function initProgressBars() {
  const bars = document.querySelectorAll<HTMLElement>(".progress-bar");
  if (!bars.length) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target as HTMLElement;
          const level =
            getComputedStyle(bar).getPropertyValue("--level").trim() ||
            bar.style.width;
          bar.style.width = "0";
          requestAnimationFrame(() =>
            setTimeout(() => {
              bar.style.width = level || "0%";
            }, 80),
          );
          obs.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 },
  );
  bars.forEach((b) => obs.observe(b));
}

export function initStatsCounters() {
  const counters = document.querySelectorAll<HTMLElement>("[data-count]");
  if (!counters.length) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const end = Number.parseInt(el.dataset.count ?? "", 10);
          // movimento reduzido: mostra o valor final, sem contagem
          if (prefersReducedMotion) {
            el.textContent = String(end);
            obs.unobserve(el);
            return;
          }
          const dur = 1500;
          let start: number | null = null;
          function step(ts: number) {
            if (!start) {
              start = ts;
            }
            const p = Math.min((ts - start) / dur, 1);
            el.textContent = String(Math.floor(p * end));
            if (p < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = String(end);
            }
          }
          requestAnimationFrame(step);
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.5 },
  );
  counters.forEach((c) => obs.observe(c));
}

export function initSectionTitles() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle(
          "section-title-visible",
          entry.isIntersecting,
        );
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
  );

  document
    .querySelectorAll<HTMLElement>(
      ".skills h3, .projects h3, .titulo-swot, .contact h3",
    )
    .forEach((el) => {
      observer.observe(el);
    });
}
