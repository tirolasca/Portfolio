import { showHintToast } from "./achievements";
import { prefersReducedMotion } from "../state";
import { normalize } from "../utils";

export function initSkillProjectLink() {
  const badges =
    document.querySelectorAll<HTMLImageElement>(".skill-badges img");
  const cards = document.querySelectorAll<HTMLElement>(
    ".project-card[data-tech]",
  );
  if (!badges.length || !cards.length) return;

  badges.forEach((badge) => {
    badge.style.cursor = "pointer";
    badge.addEventListener("click", () => {
      const skill = normalize(badge.alt);
      if (!skill) return;

      const matches = Array.from(cards).filter((card) =>
        (card.dataset.tech || "")
          .split(",")
          .some((t) => normalize(t) === skill),
      );

      cards.forEach((c) => c.classList.remove("tech-highlighted"));

      if (!matches.length) {
        showHintToast(`Nenhum projeto em destaque usa ${badge.alt} ainda.`);
        return;
      }

      matches.forEach((c) => c.classList.add("tech-highlighted"));
      const plural = matches.length > 1;
      showHintToast(
        `${matches.length} projeto${plural ? "s" : ""} usa${plural ? "m" : ""} ${badge.alt} — veja em Projetos.`,
      );

      const projectsSection = document.getElementById("projetos");
      if (projectsSection) {
        projectsSection.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }

      clearTimeout(window.__techHighlightTimer);
      window.__techHighlightTimer = window.setTimeout(() => {
        cards.forEach((c) => c.classList.remove("tech-highlighted"));
      }, 4000);
    });
  });
}
