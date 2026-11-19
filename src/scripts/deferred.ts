/**
 * Tudo que NÃO é necessário para a primeira pintura. Carregado num chunk
 * separado, quando o navegador fica ocioso (veja main.ts).
 */
import { initAnimationGuard } from "./core/animation-guard";
import { initTranslate } from "./core/translate";
import {
  initAchievements,
  initAchievementsDrawer,
} from "./features/achievements";
import { initAudioFeedback } from "./features/audio";
import { initGithubActivity, initGithubModal } from "./features/github";
import { initKeyboardShortcuts } from "./features/shortcuts";
import { initKonamiCode, initLogoSecret } from "./features/konami";
import { initSkillProjectLink } from "./features/skill-project-link";
import { initTimelineProgress, initTimelineToggle } from "./features/timeline";
import { initTour } from "./features/tour";
import {
  init3DTilt,
  initClickParticles,
  initGlowPointerTracking,
  initMagneticButtons,
  initParallax,
  initRipple,
} from "./effects/pointer";
import { initFloatingTags } from "./effects/floating-tags";
import { initNetworkCanvas } from "./effects/network-canvas";
import {
  initIntersectionObserver,
  initProgressBars,
  initSectionTitles,
  initStatsCounters,
} from "./effects/reveal";
import { initScrambleText } from "./effects/scramble";

const tasks = [
  initAnimationGuard,
  initTour,
  initIntersectionObserver,
  initProgressBars,
  initStatsCounters,
  initSectionTitles,
  init3DTilt,
  initMagneticButtons,
  initGlowPointerTracking,
  initRipple,
  initClickParticles,
  initParallax,
  initScrambleText,
  initFloatingTags,
  initNetworkCanvas,
  initAudioFeedback,
  initAchievements,
  initAchievementsDrawer,
  initKonamiCode,
  initLogoSecret,
  initKeyboardShortcuts,
  initGithubActivity,
  initGithubModal,
  initTimelineProgress,
  initTimelineToggle,
  initSkillProjectLink,
  initTranslate,
];

let started = false;

export function initDeferred() {
  if (started) return; // evita inicializar listeners duas vezes
  started = true;
  // Cada init é isolado: uma falha não derruba os demais.
  for (const task of tasks) {
    try {
      task();
    } catch (err) {
      console.error(`[init] ${task.name} falhou`, err);
    }
  }
}
