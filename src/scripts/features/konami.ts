import { session } from "../core/storage";
import { toggleMatrixMode } from "../effects/matrix";
import { showAchievement } from "./achievements";
import { state, unlockedAchievements } from "../state";

export function initKonamiCode() {
  const themeBtnEl = document.getElementById("theme-toggle");
  const themeIconEl = themeBtnEl
    ? themeBtnEl.querySelector<HTMLElement>("i")
    : null;
  if (!themeBtnEl || !themeIconEl) return;
  const themeBtn: HTMLElement = themeBtnEl;
  const themeIcon: HTMLElement = themeIconEl;

  let pressTimer: ReturnType<typeof setTimeout> | undefined;
  let visualTimer: ReturnType<typeof setTimeout> | undefined;
  let isHacking = false;
  let preventNextClick = false;

  themeBtn.addEventListener(
    "click",
    (e) => {
      if (preventNextClick) {
        e.preventDefault();
        e.stopImmediatePropagation();
        preventNextClick = false;
        return;
      }

      if (state.matrixMode) {
        e.preventDefault();
        e.stopImmediatePropagation();
        toggleMatrixMode();
      }
    },
    true,
  );

  function startHack() {
    if (isHacking || state.matrixMode) return;
    isHacking = true;
    preventNextClick = false;

    visualTimer = setTimeout(() => {
      themeBtn.style.transition = "all 4s linear";
      themeBtn.style.boxShadow = "0 0 30px #8c3cff, inset 0 0 15px #00ffe0";
      themeBtn.style.borderColor = "#8c3cff";
      themeIcon.classList.add("hacking-icon");
    }, 200);

    pressTimer = setTimeout(() => {
      preventNextClick = true;
      resetHackVisuals();
      isHacking = false;

      toggleMatrixMode();
    }, 1500);
  }

  function cancelHack() {
    clearTimeout(pressTimer);
    clearTimeout(visualTimer);

    if (!isHacking) return;
    isHacking = false;
    resetHackVisuals();
  }

  function resetHackVisuals() {
    themeBtn.style.transition = "all 0.3s ease";
    themeBtn.style.boxShadow = "";
    themeBtn.style.borderColor = "";
    themeIcon.classList.remove("hacking-icon");
  }

  themeBtn.addEventListener("mousedown", startHack);
  themeBtn.addEventListener("mouseup", cancelHack);
  themeBtn.addEventListener("mouseleave", cancelHack);

  themeBtn.addEventListener("touchstart", startHack, { passive: true });
  themeBtn.addEventListener("touchend", cancelHack);
  themeBtn.addEventListener("touchcancel", cancelHack);
}

export function initLogoSecret() {
  const logos = document.querySelectorAll<HTMLElement>(
    ".logo-header, .footer-logo",
  );
  logos.forEach((logo) => {
    logo.addEventListener("click", (e) => {
      e.preventDefault();
      state.logoClickCount++;
      clearTimeout(state.logoClickTimer);
      state.logoClickTimer = setTimeout(() => {
        state.logoClickCount = 0;
      }, 2000);
      if (state.logoClickCount >= 5) {
        state.logoClickCount = 0;
        if (!unlockedAchievements.has("a-logo")) {
          unlockedAchievements.add("a-logo");
          session.set(
            "achievements",
            JSON.stringify([...unlockedAchievements]),
          );
          showAchievement(
            "fa-rotate",
            "Segredo Descoberto!",
            "Você clicou na logo 5x — você é curioso!",
            75,
          );
        }
        logo.style.animation = "logoSpin 1s ease";
        setTimeout(() => {
          logo.style.animation = "";
        }, 1100);
      }
    });
  });
}
