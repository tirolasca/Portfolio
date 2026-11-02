/** Estado compartilhado entre os módulos (valores mutáveis ficam num objeto). */
export const state: {
  mouseX: number;
  mouseY: number;
  matrixMode: boolean;
  logoClickCount: number;
  logoClickTimer: ReturnType<typeof setTimeout> | undefined;
} = {
  mouseX: 0,
  mouseY: 0,
  matrixMode: false,
  logoClickCount: 0,
  logoClickTimer: undefined,
};

/** Ids das conquistas já desbloqueadas nesta sessão. */
export const unlockedAchievements = new Set<string>(
  JSON.parse(sessionStorage.getItem("achievements") || "[]"),
);

export const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

/** true na página do currículo */
export const isResumePage = Boolean(document.querySelector(".curriculo-page"));
