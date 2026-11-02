import {
  homeTourSteps,
  resumeTourSteps,
  type TourStep,
} from "../data/tour-steps";
import { isResumePage, prefersReducedMotion } from "../state";

interface TourElements {
  prompt: HTMLElement;
  card: HTMLElement;
  startBtn: HTMLElement;
  skipBtn: HTMLElement;
  stepCounter: HTMLElement;
  title: HTMLElement;
  text: HTMLElement;
  prevBtn: HTMLElement;
  nextBtn: HTMLElement;
  endBtn: HTMLElement;
  validSteps: TourStep[];
  storageKey: string;
}

export function initOnboardingTour(steps: TourStep[], storageKey = "tourSeen") {
  const TOUR_ALWAYS_SHOW = false;

  const prompt = document.getElementById("tour-prompt");
  const card = document.getElementById("tour-card");

  if (!prompt || !card || !steps?.length) return;

  if (!TOUR_ALWAYS_SHOW && localStorage.getItem(storageKey)) {
    prompt.remove();
    card.remove();
    return;
  }

  const startBtn = prompt.querySelector<HTMLElement>(".tour-start-btn");
  const skipBtn = prompt.querySelector<HTMLElement>(".tour-skip-btn");

  const stepCounter = document.getElementById("tour-step-counter");
  const title = document.getElementById("tour-title");
  const text = document.getElementById("tour-text");

  const prevBtn = document.getElementById("tour-prev-btn");
  const nextBtn = document.getElementById("tour-next-btn");
  const endBtn = document.getElementById("tour-end-btn");

  if (
    !startBtn ||
    !skipBtn ||
    !stepCounter ||
    !title ||
    !text ||
    !prevBtn ||
    !nextBtn ||
    !endBtn
  ) {
    return;
  }

  const validSteps = steps.filter((step) =>
    document.querySelector<HTMLElement>(step.selector),
  );

  if (!validSteps.length) return;

  runTour({
    prompt,
    card,
    startBtn,
    skipBtn,
    stepCounter,
    title,
    text,
    prevBtn,
    nextBtn,
    endBtn,
    validSteps,
    storageKey,
  });
}

function runTour({
  prompt,
  card,
  startBtn,
  skipBtn,
  stepCounter,
  title,
  text,
  prevBtn,
  nextBtn,
  endBtn,
  validSteps,
  storageKey,
}: TourElements) {
  let currentStep = 0;

  function clearHighlight() {
    document
      .querySelectorAll<HTMLElement>(".tour-highlight")
      .forEach((element) => {
        element.classList.remove("tour-highlight");
      });
  }

  function removePrompt() {
    prompt.classList.remove("show");

    setTimeout(() => {
      if (prompt.isConnected) {
        prompt.style.display = "none";
      }
    }, 400);
  }

  function finishTour() {
    clearHighlight();

    card.classList.remove("show");

    localStorage.setItem(storageKey, "1");

    setTimeout(() => {
      if (card.isConnected) {
        card.style.display = "none";
      }
    }, 400);
  }

  function updateNextButton() {
    nextBtn.classList.toggle(
      "is-finish",
      currentStep === validSteps.length - 1,
    );
  }

  function renderStep() {
    clearHighlight();

    const step = validSteps[currentStep];

    if (!step) {
      finishTour();
      return;
    }

    const target = document.querySelector<HTMLElement>(step.selector);

    if (!target) {
      finishTour();
      return;
    }

    target.classList.add("tour-highlight");

    target.scrollIntoView({
      behavior:
        prefersReducedMotion !== undefined && prefersReducedMotion
          ? "auto"
          : "smooth",
      block: "center",
    });

    stepCounter.textContent = `${currentStep + 1} / ${validSteps.length}`;
    title.textContent = step.title;
    text.textContent = step.text;

    prevBtn.style.display = currentStep > 0 ? "" : "none";

    updateNextButton();

    card.classList.remove("show");

    requestAnimationFrame(() => {
      setTimeout(() => {
        card.classList.add("show");
      }, 150);
    });
  }

  function startTour() {
    currentStep = 0;

    card.style.display = "";

    removePrompt();

    setTimeout(renderStep, 250);
  }

  function showPrompt() {
    card.style.display = "none";
    prompt.style.display = "";

    requestAnimationFrame(() => {
      setTimeout(() => {
        prompt.classList.add("show");
      }, 1200);
    });
  }

  startBtn.addEventListener("click", startTour);

  skipBtn.addEventListener("click", () => {
    localStorage.setItem(storageKey, "1");
    removePrompt();
  });

  nextBtn.addEventListener("click", () => {
    currentStep++;

    if (currentStep >= validSteps.length) {
      finishTour();
      return;
    }

    renderStep();
  });

  prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      renderStep();
    }
  });

  endBtn.addEventListener("click", finishTour);

  card.style.display = "none";

  showPrompt();
}

export function initTour() {
  initOnboardingTour(
    isResumePage ? resumeTourSteps : homeTourSteps,
    isResumePage ? "resumeTourSeen" : "tourSeen",
  );
}
