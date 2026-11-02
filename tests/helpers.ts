import type { Page } from "@playwright/test";

/** Pula a abertura (preloader), o tour e fixa o tema antes de a página carregar. */
export async function prepare(page: Page, theme: "dark" | "light" = "dark") {
  await page.addInitScript((t) => {
    try {
      localStorage.setItem("theme", t);
      localStorage.setItem("tourSeen", "1");
      localStorage.setItem("resumeTourSeen", "1");
      sessionStorage.setItem("hasBooted", "1");
    } catch {
      /* ignora */
    }
  }, theme);
}

/** Erros de console/JS, ignorando falhas de rede externas (sem internet em alguns ambientes). */
export function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    if (
      /Failed to load resource|ERR_NAME_NOT_RESOLVED|ERR_INTERNET/.test(
        m.text(),
      )
    )
      return;
    errors.push(`console: ${m.text()}`);
  });
  return errors;
}
