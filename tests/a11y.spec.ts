import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { prepare } from "./helpers";

for (const theme of ["dark", "light"] as const) {
  for (const path of ["/", "/curriculo.html"]) {
    test(`axe: ${path} (${theme}) sem violações`, async ({ page }) => {
      await prepare(page, theme);

      // Sem animações em andamento: o axe mede contraste num estado estável.
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      await page.waitForFunction(() => document.fonts.status === "loaded");

      const results = await new AxeBuilder({ page })
        .exclude(".floating-tags-container") // Decorativo, aria-hidden.
        .analyze();

      expect(
        results.violations.map(
          (v) =>
            `${v.id}: ${v.nodes
              .map((n) => n.target.join(" "))
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

  const btn = page.locator("#terminal-btn");
  const overlay = page.locator("#terminal-overlay");

  // Abre o terminal.
  await btn.click();
  await expect(overlay).toHaveClass(/open/);

  // Fecha usando Escape.
  await page.keyboard.press("Escape");

  // Confirma que o terminal foi fechado.
  await expect(overlay).not.toHaveClass(/open/);

  // Confirma que o foco retornou ao botão que abriu o terminal.
  await expect(btn).toBeFocused();
});
