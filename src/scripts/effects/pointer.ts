import { prefersReducedMotion } from "../state";
import { secureRandom } from "../utils";

export function init3DTilt() {
  if (prefersReducedMotion) return;

  document.querySelectorAll<HTMLElement>(".glow-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();

      if (!rect.width || !rect.height) return;

      const rx =
        ((event.clientY - rect.top - rect.height / 2) / (rect.height / 2)) *
        -10;

      const ry =
        ((event.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)";
    });
  });
}

export function initMagneticButtons() {
  if (prefersReducedMotion) return;

  // `.no-magnet`: botões de leitura/ação ficam parados.
  document
    .querySelectorAll<HTMLElement>(".social-btn,.btn:not(.no-magnet)")
    .forEach((btn) => {
      btn.addEventListener("mousemove", (event) => {
        const rect = btn.getBoundingClientRect();

        const x = (event.clientX - rect.left - rect.width / 2) * 0.3;

        const y = (event.clientY - rect.top - rect.height / 2) * 0.3;

        btn.style.transform = `translate(${x}px, ${y}px)`;
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0,0)";
      });
    });
}

export function initGlowPointerTracking() {
  document.querySelectorAll<HTMLElement>(".glow-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();

      if (!rect.width || !rect.height) return;

      card.style.setProperty(
        "--mouse-x",
        `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`,
      );

      card.style.setProperty(
        "--mouse-y",
        `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`,
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

    btn.addEventListener("click", function (event) {
      if (prefersReducedMotion) return;

      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2.2;

      const cx = event.clientX - rect.left - size / 2;
      const cy = event.clientY - rect.top - size / 2;

      const ripple = document.createElement("span");
      ripple.className = "ripple-effect";
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${cx}px;top:${cy}px;`;

      this.appendChild(ripple);

      const ring = document.createElement("span");
      ring.className = "ripple-ring";

      const ringSize = size * 0.7;

      ring.style.cssText =
        `width:${ringSize}px;height:${ringSize}px;` +
        `left:${cx + (size - ringSize) / 2}px;` +
        `top:${cy + (size - ringSize) / 2}px;`;

      this.appendChild(ring);

      setTimeout(() => {
        ripple.remove();
        ring.remove();
      }, 900);
    });
  });
}

export function initClickParticles() {
  if (prefersReducedMotion) return;

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (
      target instanceof Element &&
      target.closest(
        ".slick-prev,.slick-next,.swiper-button-prev,.swiper-button-next,.back-to-top",
      )
    ) {
      return;
    }

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
      const particle = document.createElement("div");
      particle.className = "click-particle";

      const angle = (i / 12) * Math.PI * 2;
      const distance = randomFloat(40, 100);

      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      const color = colors[Math.floor(randomFloat(0, colors.length))];

      const size = randomFloat(4, 8);

      particle.style.cssText =
        `left:${event.clientX}px;` +
        `top:${event.clientY}px;` +
        `background:${color};` +
        `width:${size}px;` +
        `height:${size}px;` +
        `--tx:${tx}px;` +
        `--ty:${ty}px;`;

      document.body.appendChild(particle);

      setTimeout(() => particle.remove(), 800);
    }
  });
}

export function initParallax() {
  const hero = document.querySelector<HTMLElement>(".hero");

  if (!hero || prefersReducedMotion) return;

  window.addEventListener(
    "scroll",
    () => {
      const heroImage = hero.querySelector<HTMLElement>(".hero-image");
      const heroContent = hero.querySelector<HTMLElement>(".hero-content");

      if (window.innerWidth <= 768) {
        if (heroImage) {
          heroImage.style.transform = "translateY(0)";
        }

        return;
      }

      const scrolled = window.scrollY;

      if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.08}px)`;
      }

      if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.04}px)`;
      }
    },
    { passive: true },
  );
}
