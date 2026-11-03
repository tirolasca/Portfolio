import { session } from "./core/storage";
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
function readUnlocked(): string[] {
  try {
    const parsed: unknown = JSON.parse(session.get("achievements") || "[]");
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}
export const unlockedAchievements = new Set<string>(readUnlocked());

export const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

/** true na página do currículo */
export const isResumePage = Boolean(document.querySelector(".curriculo-page"));
