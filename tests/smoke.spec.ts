import { expect, test } from "@playwright/test";
import { collectErrors, prepare } from "./helpers";

test.describe("home", () => {
  test("carrega sem erros e com contadores derivados dos dados", async ({
    page,
  }) => {
    await prepare(page);
    const errors = collectErrors(page);
    await page.goto("/");

    // esperado = o que existe na página (nada de número fixo: o contador é dinâmico)
    const expected = await page.evaluate(() => ({
      projects: new Set(
        [...document.querySelectorAll(".project-card h4")].map((h) =>
          h.textContent?.trim(),
        ),
      ).size,
      technologies: new Set(
        [...document.querySelectorAll(".skills .skill-badges img")].map(
          (i) => (i as HTMLImageElement).alt,
        ),
      ).size,
    }));
    expect(expected.projects).toBeGreaterThan(0);
    expect(expected.technologies).toBeGreaterThan(0);

    const stats = page.locator(".hero-stat-number");
    await expect
      .poll(
        async () =>
          (await stats.allTextContents()).map((s) => s.trim()).join(","),
        { timeout: 20_000 }, // a contagem é animada
      )
      .toBe(`${expected.projects},${expected.technologies}`);
    expect(errors).toEqual([]);
  });

  test("não depende de terceiros para fontes e badges", async ({ page }) => {
    await prepare(page);
    const external: string[] = [];
    page.on("request", (r) => {
      const host = new URL(r.url()).hostname;
      if (/shields\.io|fonts\.googleapis|fonts\.gstatic/.test(host))
        external.push(r.url());
    });
    await page.goto("/");
    await page.locator(".skills").scrollIntoViewIfNeeded();
    await page.waitForLoadState("networkidle");
    expect(external).toEqual([]);
    await expect(page.locator(".skill-badges img").first()).toHaveAttribute(
      "src",
      /^\/badges\/.+\.svg$/,
    );
  });

  test("todos os ícones resolvem a fonte Font Awesome", async ({ page }) => {
    await prepare(page);
    await page.goto("/");
    const bad = await page.evaluate(async () => {
      await document.fonts.ready;
      const out: string[] = [];
      document.querySelectorAll('i[class*="fa-"]').forEach((i) => {
        const cs = getComputedStyle(i, "::before");
        if (
          !/Font Awesome/.test(cs.fontFamily) ||
          ["none", "normal", '""'].includes(cs.content)
        )
          out.push(i.className);
      });
      return [...new Set(out)];
    });
    expect(bad).toEqual([]);
  });

  test("terminal, e-mail e Chart.js só carregam sob demanda", async ({
    page,
  }) => {
    await prepare(page);
    const chunks: string[] = [];
    page.on("request", (r) => {
      const m = r.url().match(/\/_astro\/([a-z-]+)\./i);
      if (m) chunks.push(m[1]);
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(chunks.filter((c) => /terminal|email|swot/.test(c))).toEqual([]);
    await page.locator("#terminal-btn").click();
    await expect(page.locator("#terminal-overlay")).toHaveClass(/open/);
    expect(chunks.some((c) => /terminal/.test(c))).toBe(true);
  });

  test("cursor personalizado aparece e o do sistema fica oculto (desktop)", async ({
    page,
  }) => {
    await prepare(page);
    await page.goto("/");
    await page.mouse.move(300, 300);
    await expect(page.locator(".cursor-dot")).toHaveCSS("opacity", "1");
    await expect(page.locator(".cursor-dot")).toHaveCSS(
      "z-index",
      "2147483647",
    );
  });
});

test("currículo: gráfico SWOT carrega só perto da tela", async ({ page }) => {
  await prepare(page);
  const errors = collectErrors(page);
  const chunks: string[] = [];
  page.on("request", (r) => {
    const m = r.url().match(/\/_astro\/([a-z-]+)\./i);
    if (m) chunks.push(m[1]);
  });
  await page.goto("/curriculo.html");
  await page.waitForLoadState("networkidle");
  expect(chunks.some((c) => /swot/.test(c))).toBe(false);
  await page.locator("#swotChart").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page.evaluate(() =>
        Boolean(
          (
            document.getElementById("swotChart") as HTMLElement & {
              chart?: unknown;
            }
          )?.chart,
        ),
      ),
    )
    .toBe(true);
  expect(errors).toEqual([]);
});
