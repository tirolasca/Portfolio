import { expect, test, type Page } from "@playwright/test";
import { prepare } from "./helpers";

/** Animações CSS infinitas em execução (inclui pseudo-elementos). */
async function infiniteAnimations(page: Page) {
  return page.evaluate(() =>
    document
      .getAnimations()
      .filter(
        (a) =>
          a.playState === "running" &&
          a.effect?.getComputedTiming().iterations === Infinity,
      )
      .map((a) => (a as CSSAnimation).animationName ?? a.id),
  );
}

/** O carrossel é criado sob demanda (perto da tela): rola até ele e espera a instância do Swiper. */
async function carouselAutoplay(page: Page) {
  await page.locator(".projects-swiper").scrollIntoViewIfNeeded();
  await expect
    .poll(
      () =>
        page.evaluate(
          () =>
            !!(
              document.querySelector(".projects-swiper") as { swiper?: object }
            ).swiper,
        ),
      { timeout: 10_000 },
    )
    .toBe(true);
  return page.evaluate(
    () =>
      (
        document.querySelector(".projects-swiper") as unknown as {
          swiper: { autoplay: { running: boolean } };
        }
      ).swiper.autoplay.running,
  );
}

for (const theme of ["light", "dark"] as const) {
  test.describe(`movimento reduzido — ${theme}`, () => {
    test.beforeEach(async ({ page }) => {
      await prepare(page, theme);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/");
      await page.waitForLoadState("load");
    });

    test("rolagem suave desligada no CSS e nenhuma animação infinita rodando", async ({
      page,
    }) => {
      const scrollBehavior = await page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      );
      expect(scrollBehavior).toBe("auto");
      expect(await infiniteAnimations(page)).toEqual([]);
    });

    test("carrossel de projetos não avança sozinho", async ({ page }) => {
      expect(await carouselAutoplay(page)).toBe(false);
    });

    test("frase do hero fica estática (sem digitar/apagar)", async ({
      page,
    }) => {
      const el = page.locator("#typewriter");
      await expect(el).not.toHaveText("");
      const first = await el.textContent();
      await page.waitForTimeout(1500);
      expect(await el.textContent()).toBe(first);
    });

    test("contadores do hero mostram o valor final sem contagem", async ({
      page,
    }) => {
      const counters = page.locator("[data-count]");
      const n = await counters.count();
      for (let i = 0; i < n; i++) {
        const c = counters.nth(i);
        await c.scrollIntoViewIfNeeded();
        await expect(c).toHaveText((await c.getAttribute("data-count"))!, {
          timeout: 300,
        });
      }
    });

    test("seta de voltar ao topo rola sem animação", async ({ page }) => {
      await page.evaluate(() => window.scrollTo(0, 2000));
      await expect(page.locator(".back-to-top")).toHaveClass(/visible/);
      await page.locator(".back-to-top").click();
      // sem rolagem suave, a posição final é imediata (um frame)
      await expect
        .poll(() => page.evaluate(() => window.scrollY), {
          timeout: 400,
        })
        .toBe(0);
    });
  });
}

test("sem preferência: rolagem suave e animações decorativas continuam ativas", async ({
  page,
}) => {
  await prepare(page, "light");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.waitForLoadState("load");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("smooth");
  expect((await infiniteAnimations(page)).length).toBeGreaterThan(0);
  expect(await carouselAutoplay(page)).toBe(true);
});
