import { local } from "./storage";
export function initTheme() {
  const toggle = document.getElementById("theme-toggle");
  const icon =
    document.getElementById("theme-icon") ||
    (toggle ? toggle.querySelector<HTMLElement>("i") : null);
  if (icon) icon.style.transition = "transform 0.2s ease, opacity 0.2s ease";

  const applyTheme = (theme: string) => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      if (icon) {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
      }
    } else {
      document.documentElement.classList.remove("dark");
      if (icon) {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
      }
    }
  };

  // o <head> já aplicou "dark" (tema salvo ou 1ª visita com abertura): respeita
  const startDark =
    local.get("theme") === "dark" ||
    document.documentElement.classList.contains("dark");
  applyTheme(startDark ? "dark" : "light");

  if (toggle) {
    toggle.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle("dark");
      const t = isDark ? "dark" : "light";
      local.set("theme", t);
      if (icon) {
        icon.style.opacity = "0";
        icon.style.transform = "rotate(90deg)";
        setTimeout(() => {
          applyTheme(t);
          icon.style.opacity = "1";
          icon.style.transform = "rotate(0deg)";
        }, 200);
      }
    });
  }
}
