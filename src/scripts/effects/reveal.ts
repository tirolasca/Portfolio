export function initIntersectionObserver() {
  const fadeEls = document.querySelectorAll<HTMLElement>(
    ".fade-up,.card,.skill-card,.project-card,.swot-card",
  );

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Movimento reduzido: exibe tudo imediatamente.
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    fadeEls.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
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

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Movimento reduzido: mostra as barras no valor final.
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    bars.forEach((bar) => {
      const level =
        getComputedStyle(bar).getPropertyValue("--level").trim() ||
        bar.style.width;

      bar.style.width = level || "0%";
    });

    return;
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target as HTMLElement;

          const level =
            getComputedStyle(bar).getPropertyValue("--level").trim() ||
            bar.style.width;

          bar.style.width = "0";

          requestAnimationFrame(() => {
            setTimeout(() => {
              bar.style.width = level || "0%";
            }, 80);
          });

          obs.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 },
  );

  bars.forEach((bar) => obs.observe(bar));
}

export function initStatsCounters() {
  const counters = document.querySelectorAll<HTMLElement>("[data-count]");

  if (!counters.length) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Movimento reduzido: define o valor final imediatamente.
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    counters.forEach((el) => {
      const end = Number.parseInt(el.dataset.count ?? "", 10);

      if (Number.isFinite(end)) {
        el.textContent = String(end);
      }
    });

    return;
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target as HTMLElement;
        const end = Number.parseInt(el.dataset.count ?? "", 10);

        if (!Number.isFinite(end)) {
          obs.unobserve(el);
          return;
        }

        const dur = 1500;
        let start: number | null = null;

        function step(ts: number) {
          if (start === null) {
            start = ts;
          }

          const progress = Math.min((ts - start) / dur, 1);

          el.textContent = String(Math.floor(progress * end));

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = String(end);
          }
        }

        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((counter) => obs.observe(counter));
}

export function initSectionTitles() {
  const titles = document.querySelectorAll<HTMLElement>(
    ".skills h3, .projects h3, .titulo-swot, .contact h3",
  );

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Movimento reduzido: títulos aparecem imediatamente.
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    titles.forEach((el) => {
      el.classList.add("section-title-visible");
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle(
          "section-title-visible",
          entry.isIntersecting,
        );
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px",
    },
  );

  titles.forEach((el) => observer.observe(el));
}
