import { state } from "../state";
import { secureRandom } from "../utils";

/** Teto de partículas: as conexões custam O(n²), então o limite importa. */
const MAX_PARTICLES_DESKTOP = 90;
const MAX_PARTICLES_MOBILE = 40;
/** Área (px²) por partícula; telas pequenas ficam mais esparsas. */
const AREA_PER_PARTICLE_DESKTOP = 12_000;
const AREA_PER_PARTICLE_MOBILE = 20_000;
const MOBILE_MAX_WIDTH = 768;
const LINK_DISTANCE_SQ = 8000;
const RESIZE_DEBOUNCE_MS = 150;

interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  r: number;
}

export function initNetworkCanvas() {
  const canvas = document.getElementById(
    "networkCanvas",
  ) as HTMLCanvasElement | null;
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;
  setupNetworkCanvas(canvas, ctx);
}

function setupNetworkCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) {
  const root = document.documentElement;
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let particles: Particle[] = [];
  let frame = 0;
  let visible = true;

  const createParticle = (): Particle => ({
    x: secureRandom() * canvas.width,
    y: secureRandom() * canvas.height,
    dx: secureRandom() - 0.5,
    dy: secureRandom() - 0.5,
    r: secureRandom() * 2 + 1,
  });

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = canvas.parentElement?.offsetHeight ?? 0;
    const mobile = canvas.width < MOBILE_MAX_WIDTH;
    const wanted = Math.floor(
      (canvas.width * canvas.height) /
        (mobile ? AREA_PER_PARTICLE_MOBILE : AREA_PER_PARTICLE_DESKTOP),
    );
    const count = Math.min(
      wanted,
      mobile ? MAX_PARTICLES_MOBILE : MAX_PARTICLES_DESKTOP,
    );
    particles = Array.from({ length: count }, createParticle);
  }

  function step(p: Particle) {
    if (p.x > canvas.width || p.x < 0) p.dx = -p.dx;
    if (p.y > canvas.height || p.y < 0) p.dy = -p.dy;
    const ddx = state.mouseX - p.x;
    const ddy = state.mouseY - p.y;
    if (Math.hypot(ddx, ddy) < 100) {
      p.x -= ddx / 20;
      p.y -= ddy / 20;
    }
    p.x += p.dx;
    p.y += p.dy;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  function connect() {
    ctx.lineWidth = 0.8;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        if (dx * dx > LINK_DISTANCE_SQ) continue; // descarte barato
        const d = dx * dx + (particles[a].y - particles[b].y) ** 2;
        if (d < LINK_DISTANCE_SQ) {
          ctx.strokeStyle = `rgba(0,255,224,${1 - d / LINK_DISTANCE_SQ})`;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  /** Só anima com o canvas visível, aba em primeiro plano, tema escuro e sem "menos movimento". */
  const shouldRun = () =>
    visible &&
    !document.hidden &&
    !motionQuery.matches &&
    root.classList.contains("dark");

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,255,224,0.6)";
    particles.forEach(step);
    connect();
    frame = requestAnimationFrame(loop);
  }

  function sync() {
    if (shouldRun()) {
      if (!frame) frame = requestAnimationFrame(loop);
    } else if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, RESIZE_DEBOUNCE_MS);
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  const themeObserver = new MutationObserver(sync);

  resize();
  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", sync);
  motionQuery.addEventListener("change", sync);
  io.observe(canvas);
  themeObserver.observe(root, { attributes: true, attributeFilter: ["class"] });
  sync();

  window.addEventListener(
    "pagehide",
    () => {
      cancelAnimationFrame(frame);
      clearTimeout(resizeTimer);
      io.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", sync);
      motionQuery.removeEventListener("change", sync);
    },
    { once: true },
  );
}
