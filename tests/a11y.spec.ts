import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { prepare } from "./helpers";

for (const theme of ["dark", "light"] as const) {
  for (const path of ["/", "/curriculo.html"]) {
    test(`axe: ${path} (${theme}) sem violações`, async ({ page }) => {
      await prepare(page, theme);
      // sem animações em andamento: o axe mede contraste num estado estável
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1500);
      const results = await new AxeBuilder({ page })
        .exclude(".floating-tags-container") // decorativo, aria-hidden
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
  await btn.click();
  await expect(page.locator("#terminal-overlay")).toHaveClass(/open/);
  await page.keyboard.press("Escape");
  await expect(page.locator("#terminal-overlay")).not.toHaveClass(/open/);
  await expect(btn).toBeFocused();
});
