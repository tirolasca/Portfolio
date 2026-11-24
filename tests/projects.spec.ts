import { expect, test } from "@playwright/test";
import { collectErrors, prepare } from "./helpers";

test.describe("páginas de projeto", () => {
  test("o card da home leva ao estudo de caso", async ({ page }) => {
    await prepare(page);
    await page.goto("/");

    const link = page.locator('a[href="/projetos/newelog.html"]').first();

    await expect(link).toHaveText(/Detalhes/);

    await link.evaluate((element: HTMLElement) => element.click());

    await expect(page).toHaveURL(/\/projetos\/newelog\.html$/);
    await expect(page.locator("main h2")).toContainText("NEWELOG");
  });

  test("mostra tecnologias, links externos seguros e contas de teste", async ({
    page,
  }) => {
    await prepare(page);

    const errors = collectErrors(page);

    await page.goto("/projetos/newelog.html");

    await expect(page.locator(".case-tech li img").first()).toBeVisible();

    await expect(page.locator(".project-help-btn")).toBeVisible();

    const external = page.locator('main a[target="_blank"]');

    await expect(external).toHaveCount(7);

    for (const rel of await external.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("rel")),
    )) {
      expect(rel).toContain("noopener");
    }

    expect(errors).toEqual([]);
  });

  test("botão de contas de teste abre o modal com usuário e senha", async ({
    page,
  }) => {
    await prepare(page);
    await page.goto("/projetos/newelog.html");

    await page.locator(".project-help-btn").click();

    const dialog = page.getByRole("dialog");

    await expect(dialog).toBeVisible();

    await expect(dialog.locator(".credential-item").first()).toContainText(
      "Senha",
    );

    await page.keyboard.press("Escape");

    await expect(dialog).toBeHidden();
  });

  test("chamada final traz WhatsApp, LinkedIn, GitHub e e-mail", async ({
    page,
  }) => {
    await prepare(page);
    await page.goto("/projetos/newelog.html");

    const contact = page.locator("#contato");

    for (const name of ["WhatsApp", "LinkedIn", "GitHub", "E-mail"]) {
      await expect(contact.getByRole("link", { name })).toBeVisible();
    }
  });

  test("o card da página não se move com o mouse", async ({ page }) => {
    await prepare(page);
    await page.goto("/projetos/newelog.html");

    const cover = page.locator(".case-cover");

    await expect(cover).toBeVisible();

    const before = await cover.boundingBox();

    expect(before).not.toBeNull();

    await cover.hover({ position: { x: 20, y: 20 } });
    await page.mouse.move(300, 200);

    const after = await cover.boundingBox();

    expect(after).toEqual(before);
  });

  test("projeto sem contas de teste não mostra a seção", async ({ page }) => {
    await prepare(page);
    await page.goto("/projetos/planet-spotter.html");

    await expect(page.locator(".project-help-btn")).toHaveCount(0);
  });

  test("navegação entre projetos é circular, sem fim", async ({ page }) => {
    await prepare(page);

    // Primeiro projeto: próximo segue a ordem; anterior leva ao último.
    await page.goto("/projetos/planet-spotter.html");

    await expect(page.locator('.case-pager a[rel="next"]')).toHaveAttribute(
      "href",
      "/projetos/janosys-api.html",
    );

    const previous = page.locator('.case-pager a[rel="prev"]');

    await expect(previous).toContainText("Ir ao último projeto");

    await expect(previous).toHaveAttribute(
      "href",
      "/projetos/calculadora-de-matrizes.html",
    );

    // Último projeto: próximo volta ao primeiro.
    await page.goto("/projetos/calculadora-de-matrizes.html");

    const next = page.locator('.case-pager a[rel="next"]');

    await expect(next).toContainText("Voltar ao primeiro projeto");

    await expect(next).toHaveAttribute("href", "/projetos/planet-spotter.html");
  });
});
