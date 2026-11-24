import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { prepare } from "./helpers";

for (const theme of ["dark", "light"] as const) {
  for (const path of [
    "/",
    "/curriculo.html",
    "/projetos/newelog.html",
    "/projetos/planet-spotter.html",
  ]) {
    test(`axe: ${path} (${theme}) sem violações`, async ({ page }) => {
      await prepare(page, theme);

      // Sem animações em andamento: o axe mede contraste num estado estável.
      await page.emulateMedia({ reducedMotion: "reduce" });

      await page.goto(path);
      await page.waitForLoadState("networkidle");
      await page.waitForFunction(() => document.fonts.status === "loaded");

      const results = await new AxeBuilder({ page })
        .exclude(".floating-tags-container")
        .analyze();

      expect(
        results.violations.map(
          (violation) =>
            `${violation.id}: ${violation.nodes
              .map((node) => node.target.join(" "))
              .slice(0, 3)
              .join(" | ")}`,
        ),
      ).toEqual([]);
    });
  }
}

test("diálogo do terminal: Esc fecha e o foco volta ao botão", async ({
  page,
}) => {
  await prepare(page);
  await page.goto("/");

  const button = page.locator("#terminal-btn");
  const overlay = page.locator("#terminal-overlay");

  await button.click();

  await expect(overlay).toHaveClass(/open/);

  await page.keyboard.press("Escape");

  await expect(overlay).not.toHaveClass(/open/);
  await expect(button).toBeFocused();
});
