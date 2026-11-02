import { prefersReducedMotion, state } from "../state";
import { secureRandom } from "../utils";

export function initNetworkCanvas() {
  const canvas = document.getElementById(
    "networkCanvas",
  ) as HTMLCanvasElement | null;
  if (!canvas || prefersReducedMotion) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  setupNetworkCanvas(canvas, ctx);
}

function setupNetworkCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) {
  let particles: Particle[] = [];
  canvas.width = window.innerWidth;
  canvas.height = canvas.parentElement?.offsetHeight ?? 0;
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = canvas.parentElement?.offsetHeight ?? 0;
    initP();
  });
  class Particle {
    x: number;
    y: number;
    dx: number;
    dy: number;
    r: number;
    color: string;
    constructor() {
      this.x = secureRandom() * canvas.width;
      this.y = secureRandom() * canvas.height;
      this.dx = secureRandom() - 0.5;
      this.dy = secureRandom() - 0.5;
      this.r = secureRandom() * 2 + 1;
      this.color = "rgba(0,255,224,0.6)";
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    update() {
      if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
      if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;
      const ddx = state.mouseX - this.x,
        ddy = state.mouseY - this.y,
        dist = Math.hypot(ddx, ddy);
      if (dist < 100) {
        this.x -= ddx / 20;
        this.y -= ddy / 20;
      }
      this.x += this.dx;
      this.y += this.dy;
      this.draw();
    }
  }
  function initP() {
    particles = [];
    for (let i = 0; i < (canvas.width * canvas.height) / 12000; i++)
      particles.push(new Particle());
  }
  function connect() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        const d =
          (particles[a].x - particles[b].x) ** 2 +
          (particles[a].y - particles[b].y) ** 2;
        if (d < 8000) {
          ctx.strokeStyle = `rgba(0,255,224,${1 - d / 8000})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }
  // só anima enquanto o canvas está na tela (a aba oculta já é pausada pelo navegador)
  let visible = true;
  let running = false;
  function animate() {
    if (!visible) {
      running = false;
      return;
    }
    requestAnimationFrame(animate);
    if (document.documentElement.classList.contains("dark")) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => p.update());
      connect();
    }
  }
  initP();
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !running) {
      running = true;
      animate();
    }
  }).observe(canvas);
  running = true;
  animate();
}
