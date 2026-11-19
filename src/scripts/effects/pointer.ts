import { prefersReducedMotion } from "../state";
import { secureRandom } from "../utils";

export function init3DTilt() {
  document.querySelectorAll<HTMLElement>(".glow-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -10;
      const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 10;
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)";
    });
  });
}

export function initMagneticButtons() {
  document.querySelectorAll<HTMLElement>(".social-btn,.btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.3}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0,0)";
    });
  });
}

export function initGlowPointerTracking() {
  document.querySelectorAll<HTMLElement>(".glow-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty(
        "--mouse-x",
        `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`,
      );
      card.style.setProperty(
        "--mouse-y",
        `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`,
      );
    });
  });
}

export function initRipple() {
  const rippleTargets = document.querySelectorAll<HTMLElement>(
    ".btn, .social-btn, .toggle-btn, .theme-toggle, .achievements-btn, .back-to-top",
  );
  rippleTargets.forEach((btn) => {
    if (
      btn.classList.contains("back-to-top") ||
      btn.classList.contains("achievements-btn")
    ) {
      btn.style.overflow = "visible";
    } else {
      btn.style.overflow = "hidden";
    }

    btn.addEventListener("click", function (e) {
      const r = this.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2.2;
      const cx = e.clientX - r.left - size / 2;
      const cy = e.clientY - r.top - size / 2;

      const ripple = document.createElement("span");
      ripple.className = "ripple-effect";
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${cx}px;top:${cy}px;`;
      this.appendChild(ripple);

      const ring = document.createElement("span");
      ring.className = "ripple-ring";
      const rs = size * 0.7;
      ring.style.cssText = `width:${rs}px;height:${rs}px;left:${cx + (size - rs) / 2}px;top:${cy + (size - rs) / 2}px;`;
      this.appendChild(ring);

      setTimeout(() => {
        ripple.remove();
        ring.remove();
      }, 900);
    });
  });
}

export function initClickParticles() {
  document.addEventListener("click", (e) => {
    if (
      (e.target as HTMLElement).closest(
        ".slick-prev,.slick-next,.swiper-button-prev,.swiper-button-next,.back-to-top",
      )
    )
      return;
    const colors = [
      "#00ffe0",
      "#00aaff",
      "#ff6f91",
      "#ffd166",
      "#9fb5ff",
      "#ffffff",
    ];
    const randomFloat = (min: number, max: number) =>
      min + secureRandom() * (max - min);
    for (let i = 0; i < 12; i++) {
      const p = document.createElement("div");
      p.className = "click-particle";
      const angle = (i / 12) * Math.PI * 2,
        dist = randomFloat(40, 100);
      const tx = Math.cos(angle) * dist,
        ty = Math.sin(angle) * dist;
      const color = colors[Math.floor(randomFloat(0, colors.length))];
      const size = randomFloat(4, 8);
      p.style.cssText = `left:${e.clientX}px; top:${e.clientY}px; background:${color}; width:${size}px; height:${size}px; --tx:${tx}px; --ty:${ty}px;`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 800);
    }
  });
}

export function initParallax() {
  const hero = document.querySelector<HTMLElement>(".hero");
  if (!hero || prefersReducedMotion) return;
  window.addEventListener(
    "scroll",
    () => {
      if (window.innerWidth <= 768) {
        const heroImg = hero.querySelector<HTMLElement>(".hero-image");
        if (heroImg) heroImg.style.transform = `translateY(0)`;
        return;
      }
      const scrolled = window.scrollY;
      const heroImg = hero.querySelector<HTMLElement>(".hero-image");
      const heroTxt = hero.querySelector<HTMLElement>(".hero-content");
      if (heroImg) heroImg.style.transform = `translateY(${scrolled * 0.08}px)`;
      if (heroTxt) heroTxt.style.transform = `translateY(${scrolled * 0.04}px)`;
    },
    { passive: true },
  );
}
