import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { prepare } from "./helpers";

const CDN = "**/cdn.gtranslate.net/**";

/** Marcação do widget "Dropdown": <select class="gt_selector"> com o placeholder "Select Language" */
const STUB = `(() => { const s = window.gtranslateSettings; const w = document.querySelector(s.wrapper_selector);
  w.innerHTML = '<select class="gt_selector notranslate" aria-label="Select Language" onchange="window.__gt = this.value">' +
    '<option value="">Select Language</option>' +
    '<option value="pt|pt" selected>Português</option>' +
    '<option value="pt|en">English</option>' +
    '<option value="pt|es">Español</option></select>'; })();`;

async function mockWidget(page: Page) {
  await page.route(CDN, (route) =>
    route.fulfill({ contentType: "text/javascript", body: STUB }),
  );
}

test("GTranslate: configura o widget e carrega uma única vez", async ({
  page,
}) => {
  await prepare(page);
  let hits = 0;
  // Simula o GTranslate (visual "Dropdown"): mesma marcação que o widget gera
  await page.route(CDN, async (route) => {
    hits++;
    await route.fulfill({ contentType: "text/javascript", body: STUB });
  });
  await page.goto("/");
  await expect(page.locator(".lang-option .lang-name")).toHaveText([
    "Português",
    "English",
    "Español",
  ]);

  const settings = await page.evaluate(() => window.gtranslateSettings);
  expect(settings).toMatchObject({
    default_language: "pt",
    languages: ["pt", "en", "es"],
    wrapper_selector: ".gtranslate_wrapper",
    native_language_names: true,
    detect_browser_language: false,
  });
  expect(hits).toBe(1);
  await expect(page.locator(".gtranslate_wrapper")).toHaveAttribute(
    "translate",
    "no",
  );
  // o Google Website Translator (descontinuado) não é mais carregado
  expect(
    await page.locator('script[src*="translate.google.com"]').count(),
  ).toBe(0);
});

test("GTranslate bloqueado: o espaço reservado some em vez de ficar vazio", async ({
  page,
}) => {
  await prepare(page);
  await page.route(CDN, (route) => route.abort());
  await page.goto("/");
  await expect(page.locator(".gtranslate_wrapper")).toHaveClass(
    /gtranslate-failed/,
  );
  await expect(page.locator(".gtranslate_wrapper")).toBeHidden();
});

test("badges de tecnologias vêm de uma única fonte (home e currículo iguais)", async ({
  page,
}) => {
  await prepare(page);
  const alts = async (path: string) => {
    await page.goto(path);
    return page
      .locator(".skill-badges img")
      .evaluateAll((imgs) =>
        imgs.map(
          (i) => `${(i as HTMLImageElement).alt}|${i.getAttribute("src")}`,
        ),
      );
  };
  const home = await alts("/");
  const resume = await alts("/curriculo.html");
  expect(home.length).toBeGreaterThan(50);
  expect(resume).toEqual(home);
  expect(home.every((x) => /\|\/badges\/[a-z0-9-]+\.svg$/.test(x))).toBe(true);
});

test.describe("seletor de idioma personalizado", () => {
  const norm = (t: string[]) => t.map((x) => x.replace(/\s+/g, " ").trim());

  test('lista só PT/EN/ES e nunca mostra "Select Language"', async ({
    page,
  }) => {
    await prepare(page);
    await mockWidget(page);
    await page.goto("/");
    await page.locator(".lang-btn").click();
    expect(norm(await page.locator(".lang-option").allTextContents())).toEqual([
      "PT Português",
      "EN English",
      "ES Español",
    ]);
    await expect(
      page.getByText(/select language/i).filter({ visible: true }),
    ).toHaveCount(0);
    await expect(page.locator(".lang-btn-label")).toHaveText("Português");
    // o <select> do GTranslate segue na página, mas só como motor (fora da vista e dos leitores de tela)
    const engine = page.locator("select.gt_selector");
    await expect(engine).toHaveAttribute("aria-hidden", "true");
    await expect(engine).toHaveCSS("opacity", "0");
  });

  test("escolher um idioma aciona o motor do GTranslate", async ({ page }) => {
    await prepare(page);
    await mockWidget(page);
    await page.goto("/");
    await page.locator(".lang-btn").click();
    await page.locator('.lang-option[data-lang="en"]').click();
    await expect
      .poll(() =>
        page.evaluate(() => (window as unknown as { __gt?: string }).__gt),
      )
      .toBe("pt|en");
    await expect(page.locator(".lang-btn-label")).toHaveText("English");
    await expect(page.locator(".lang-btn")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await expect(page.locator('.lang-option[data-lang="en"]')).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("teclado: setas, Enter, Esc e Tab (padrão WAI-ARIA de listbox)", async ({
    page,
  }) => {
    await prepare(page);
    await mockWidget(page);
    await page.goto("/");
    const btn = page.locator(".lang-btn");
    const menu = page.locator(".lang-menu");
    await btn.focus();
    await page.keyboard.press("ArrowDown");
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toBeFocused();
    await expect(menu).toHaveAttribute("aria-activedescendant", "lang-opt-pt");
    await page.keyboard.press("ArrowDown");
    await expect(menu).toHaveAttribute("aria-activedescendant", "lang-opt-en");
    await page.keyboard.press("End");
    await expect(menu).toHaveAttribute("aria-activedescendant", "lang-opt-es");
    await page.keyboard.press("Enter");
    await expect(btn).toBeFocused();
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(".lang-btn-label")).toHaveText("Español");
    await expect
      .poll(() =>
        page.evaluate(() => (window as unknown as { __gt?: string }).__gt),
      )
      .toBe("pt|es");

    await page.keyboard.press("ArrowUp"); // abre
    await page.keyboard.press("Escape"); // fecha e devolve o foco
    await expect(btn).toBeFocused();
    await expect(btn).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("Enter");
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Tab");
    await expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  test("clicar fora fecha o menu", async ({ page }) => {
    await prepare(page);
    await mockWidget(page);
    await page.goto("/");
    await page.locator(".lang-btn").click();
    await expect(page.locator(".lang-switcher")).toHaveClass(/is-open/);
    await page.mouse.click(40, 500);
    await expect(page.locator(".lang-switcher")).not.toHaveClass(/is-open/);
  });

  test("tema claro e escuro têm menus distintos", async ({ page }) => {
    const bg: Record<string, string> = {};
    for (const theme of ["dark", "light"] as const) {
      await prepare(page, theme);
      await mockWidget(page);
      await page.goto("/");
      await page.locator(".lang-btn").click();
      bg[theme] = await page
        .locator(".lang-menu")
        .evaluate((el) => getComputedStyle(el).backgroundColor);
    }
    expect(bg.light).toBe("rgba(255, 255, 255, 0.95)");
    expect(bg.dark).toBe("rgba(2, 22, 26, 0.94)");
  });

  test("celular: só o globo, e o menu aberto cabe na tela", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await prepare(page);
    await mockWidget(page);
    await page.goto("/");
    // offsetWidth ignora transform (o botão ainda pode estar na animação de entrada)
    const btnWidth = await page
      .locator(".lang-btn")
      .evaluate((el) => (el as HTMLElement).offsetWidth);
    expect(btnWidth).toBe(42);
    await expect(page.locator(".lang-btn-label")).toBeHidden();
    await page.locator(".lang-btn").click();
    await expect(page.locator(".lang-menu")).toBeVisible();
    const m = await page.locator(".lang-menu").boundingBox();
    expect(m!.x).toBeGreaterThanOrEqual(0);
    expect(m!.x + m!.width).toBeLessThanOrEqual(390);
  });

  test("antes de carregar mostra o esqueleto no tamanho final (sem salto de layout)", async ({
    page,
  }) => {
    await prepare(page);
    await page.route(CDN, async (route) => {
      await new Promise((r) => setTimeout(r, 4000));
      await route.fulfill({ contentType: "text/javascript", body: STUB });
    });
    await page.goto("/");
    const wrapper = page.locator(".gtranslate_wrapper");
    const skeleton = await wrapper.boundingBox();
    expect(Math.round(skeleton!.height)).toBe(42);
    await expect(page.locator(".lang-btn")).toBeVisible({ timeout: 15_000 });
    const loaded = await wrapper.boundingBox();
    expect(Math.round(loaded!.width)).toBe(Math.round(skeleton!.width));
    expect(Math.round(loaded!.height)).toBe(Math.round(skeleton!.height));
  });

  for (const theme of ["dark", "light"] as const) {
    test(`acessibilidade (axe) com o menu aberto — ${theme}`, async ({
      page,
    }) => {
      await prepare(page, theme);
      await mockWidget(page);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/");
      await page.locator(".lang-btn").click();
      await expect(page.locator(".lang-menu")).toBeVisible();
      const results = await new AxeBuilder({ page })
        .include(".gtranslate_wrapper")
        .analyze();
      expect(
        results.violations.map(
          (v) =>
            `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`,
        ),
      ).toEqual([]);
    });
  }
});
