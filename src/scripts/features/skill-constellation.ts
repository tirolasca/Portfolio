import { prefersReducedMotion } from "../state";

export function initSkillConstellation() {
  const groups = document.querySelectorAll<HTMLElement>(
    ".skill-card, .skill-category",
  );
  if (!groups.length) return;

  groups.forEach((group) => {
    const badges = group.querySelectorAll<HTMLElement>(".skill-badges img");
    if (badges.length < 2) return;

    const canvas = document.createElement("canvas");
    canvas.className = "skills-constellation";
    canvas.setAttribute("aria-hidden", "true");
    group.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      const rect = group.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
    resize();
    window.addEventListener("resize", resize);

    function getCenter(el: Element) {
      const r = el.getBoundingClientRect();
      const gRect = group.getBoundingClientRect();
      return {
        x: r.left - gRect.left + r.width / 2,
        y: r.top - gRect.top + r.height / 2,
      };
    }

    function colors() {
      const dark = document.documentElement.classList.contains("dark");
      return dark
        ? {
            line: "rgba(0,255,224,0.55)",
            dot: "rgba(0,255,224,0.9)",
            glow: "rgba(0,255,224,0.65)",
          }
        : {
            line: "rgba(0,191,174,0.55)",
            dot: "rgba(0,191,174,0.9)",
            glow: "rgba(0,200,180,0.55)",
          };
    }

    let rafId: number | null = null,
      dashOffset = 0,
      hovered: HTMLElement | null = null;

    const draw = (): void => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!hovered) return;
      const c = colors();
      const hCenter = getCenter(hovered);
      const others = Array.from(badges)
        .filter((b) => b !== hovered)
        .map((b) => ({ center: getCenter(b) }))
        .map((o) => ({
          center: o.center,
          dist: Math.hypot(o.center.x - hCenter.x, o.center.y - hCenter.y),
        }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 3);

      others.forEach(({ center }) => {
        ctx.beginPath();
        ctx.moveTo(hCenter.x, hCenter.y);
        ctx.lineTo(center.x, center.y);
        ctx.strokeStyle = c.line;
        ctx.lineWidth = 1.4;
        if (!prefersReducedMotion) {
          ctx.setLineDash([4, 4]);
          ctx.lineDashOffset = -dashOffset;
        } else {
          ctx.setLineDash([]);
        }
        ctx.shadowBlur = 6;
        ctx.shadowColor = c.glow;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(center.x, center.y, 2.8, 0, Math.PI * 2);
        ctx.shadowBlur = 0;
        ctx.fillStyle = c.dot;
        ctx.fill();
      });

      ctx.beginPath();
      ctx.arc(hCenter.x, hCenter.y, 3.4, 0, Math.PI * 2);
      ctx.fillStyle = c.dot;
      ctx.fill();
    };

    function loop() {
      dashOffset = (dashOffset + 0.35) % 8;
      draw();
      rafId = requestAnimationFrame(loop);
    }

    badges.forEach((img) => {
      img.addEventListener("mouseenter", () => {
        hovered = img;
        if (prefersReducedMotion) {
          draw();
        } else {
          if (rafId) cancelAnimationFrame(rafId);
          loop();
        }
      });
      img.addEventListener("mouseleave", () => {
        hovered = null;
        if (rafId) cancelAnimationFrame(rafId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      });
    });
  });
}
