import { session } from "../core/storage";
import { showAchievement } from "../features/achievements";
import { state, unlockedAchievements } from "../state";
import { secureRandom } from "../utils";

export function toggleMatrixMode() {
  state.matrixMode = !state.matrixMode;
  if (state.matrixMode) {
    startMatrix();
    if (!unlockedAchievements.has("a-konami")) {
      unlockedAchievements.add("a-konami");
      session.set("achievements", JSON.stringify([...unlockedAchievements]));
      showAchievement(
        "fa-dragon",
        "Modo Matrix Ativado!",
        "↑↑↓↓←→←→BA descoberto",
        100,
      );
    }
  } else {
    stopMatrix();
  }
}

let matrixCanvas: HTMLCanvasElement | null = null;

let matrixRAF = 0;

function startMatrix() {
  const canvas = document.createElement("canvas");
  matrixCanvas = canvas;
  canvas.id = "matrix-canvas";
  canvas.style.cssText =
    "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99998;pointer-events:none;opacity:0;transition:opacity 1s;";
  document.body.appendChild(canvas);
  requestAnimationFrame(() => {
    canvas.style.opacity = "0.85";
  });

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const cols = Math.floor(canvas.width / 20);
  const drops = new Array(cols).fill(1);
  const chars =
    "アカサタナハマヤラワ01アイウエオカキクケコABCDEF0123456789@#$%".split("");

  const draw = (): void => {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00ffe0";
    ctx.font = "14px monospace";
    drops.forEach((y, i) => {
      const c = chars[Math.floor(secureRandom() * chars.length)];
      const white = secureRandom() > 251 / 256;
      ctx.fillStyle = white ? "#ffffff" : "#00ffe0";
      ctx.fillText(c, i * 20, y * 20);
      if (y * 20 > canvas.height && secureRandom() > 0.975) drops[i] = 0;
      drops[i]++;
    });
    matrixRAF = requestAnimationFrame(draw);
  };
  draw();
  document.addEventListener("click", stopMatrix, { once: true });
}

function stopMatrix() {
  if (matrixCanvas) {
    matrixCanvas.style.opacity = "0";
    setTimeout(() => {
      matrixCanvas?.remove();
      matrixCanvas = null;
    }, 1000);
  }
  cancelAnimationFrame(matrixRAF);
  state.matrixMode = false;
}
