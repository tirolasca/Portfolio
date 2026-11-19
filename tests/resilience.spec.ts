import { expect, test } from "@playwright/test";
import { collectErrors, prepare } from "./helpers";

type ChartLike = {
  options: { scales: { r: { pointLabels: { color: string } } } };
};
type SwotCanvas = HTMLCanvasElement & { chart?: ChartLike };

test("armazenamento bloqueado: abertura, tema e página seguem funcionando", async ({
  page,
}) => {
  await page.addInitScript(() => {
    for (const name of ["localStorage", "sessionStorage"]) {
      Object.defineProperty(window, name, {
        get() {
          throw new DOMException("bloqueado", "SecurityError");
        },
      });
    }
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors = collectErrors(page);
  await page.goto("/");

  // a abertura termina mesmo sem sessionStorage
  await expect(page.locator("#cyber-preloader")).toHaveCount(0, {
    timeout: 10_000,
  });

  // a troca de tema não depende de persistência
  const html = page.locator("html");
  const before = await html.evaluate((el) => el.classList.contains("dark"));
  await page.locator("#theme-toggle").click();
  await expect
    .poll(() => html.evaluate((el) => el.classList.contains("dark")))
    .toBe(!before);
  expect(errors).toEqual([]);
});

test("gráfico SWOT acompanha a troca de tema sem recriar a instância", async ({
  page,
}) => {
  await prepare(page, "dark");
  const errors = collectErrors(page);
  await page.goto("/curriculo.html");
  await page.locator("#swotChart").scrollIntoViewIfNeeded();

  const labelColor = () =>
    page.evaluate(
      () =>
        (document.getElementById("swotChart") as SwotCanvas | null)?.chart
          ?.options.scales.r.pointLabels.color,
    );
  await expect.poll(labelColor).toBe("#ffffff");
  await page.evaluate(() => {
    const w = window as unknown as { __chart?: unknown };
    w.__chart = (document.getElementById("swotChart") as SwotCanvas).chart;
  });

  await page.locator("#theme-toggle").click();
  await expect.poll(labelColor).toBe("#15b8c4");

  const sameInstance = await page.evaluate(
    () =>
      (window as unknown as { __chart?: unknown }).__chart ===
      (document.getElementById("swotChart") as SwotCanvas).chart,
  );
  expect(sameInstance).toBe(true);
  expect(errors).toEqual([]);
});
