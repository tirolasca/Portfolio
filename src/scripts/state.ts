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

const reducedMotionQuery = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

/**
 * `true` quando o sistema pede "menos movimento". É uma binding ao vivo (`export let`):
 * quem importa enxerga a mudança se a pessoa alterar a preferência com a página aberta.
 * Para reagir à mudança (ligar/desligar algo), use `onMotionPreferenceChange`.
 */
export let prefersReducedMotion = reducedMotionQuery.matches;

const motionListeners = new Set<(reduce: boolean) => void>();
reducedMotionQuery.addEventListener("change", (e) => {
  prefersReducedMotion = e.matches;
  motionListeners.forEach((fn) => fn(e.matches));
});

/** Registra um callback chamado quando a preferência de movimento muda. */
export function onMotionPreferenceChange(fn: (reduce: boolean) => void) {
  motionListeners.add(fn);
}

/** Comportamento de rolagem programática (`scrollTo`/`scrollIntoView`) que respeita a preferência. */
export function scrollBehavior(): ScrollBehavior {
  return prefersReducedMotion ? "auto" : "smooth";
}

/** true na página do currículo */
export const isResumePage = Boolean(document.querySelector(".curriculo-page"));
