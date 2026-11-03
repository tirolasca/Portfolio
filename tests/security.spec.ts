import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { collectErrors, prepare } from "./helpers";

type Header = { key: string; value: string };

const config = JSON.parse(readFileSync("vercel.json", "utf8")) as {
  headers: { source: string; headers: Header[] }[];
};

const globalHeaders = config.headers.find((h) => h.source === "/(.*)")!.headers;

const header = (name: string) =>
  globalHeaders.find((h) => h.key === name)?.value ?? "";

const csp = header("Content-Security-Policy");

const PAGES = ["/", "/curriculo.html"];

test("cabeçalhos de segurança obrigatórios estão definidos", () => {
  for (const name of [
    "Content-Security-Policy",
    "Permissions-Policy",
    "Referrer-Policy",
    "X-Content-Type-Options",
    "X-Frame-Options",
  ]) {
    expect(header(name), name).not.toBe("");
  }
});

test("CSP: sem unsafe-eval nem unsafe-inline em scripts", () => {
  const script = csp
    .split(";")
    .find((directive) => directive.trim().startsWith("script-src"));

  expect(script).toBeDefined();
  expect(script).not.toMatch(/unsafe-(eval|inline)/);

  expect(csp).toContain("object-src 'none'");
  expect(csp).toContain("frame-ancestors 'self'");
});

for (const path of PAGES) {
  test(`CSP: hash do script inline de ${path} confere com a CSP`, async ({
    request,
    page,
  }) => {
    const response = await request.get(path);

    expect(response.ok()).toBeTruthy();

    const html = await response.text();

    // DOMParser interpreta o HTML sem executar os scripts.
    const inline = await page.evaluate((source) => {
      const document = new DOMParser().parseFromString(source, "text/html");

      return Array.from(document.querySelectorAll("script"))
        .filter(
          (script) =>
            !script.hasAttribute("src") && !/ld\+json/i.test(script.type),
        )
        .map((script) => script.textContent ?? "");
    }, html);

    expect(inline.length).toBeGreaterThan(0);

    for (const body of inline) {
      const hash = createHash("sha256").update(body).digest("base64");

      expect(csp, `hash do script inline: sha256-${hash}`).toContain(
        `'sha256-${hash}'`,
      );
    }
  });

  test(`links externos de ${path} usam noopener noreferrer`, async ({
    page,
  }) => {
    await prepare(page);
    await page.goto(path);

    const bad = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]'),
      )
        .filter((anchor) => {
          const rel = anchor.rel.toLowerCase().split(/\s+/);

          return !rel.includes("noopener") || !rel.includes("noreferrer");
        })
        .map((anchor) => anchor.href),
    );

    expect(bad).toEqual([]);
  });

  test(`CSP aplicada: ${path} funciona sem violações`, async ({ page }) => {
    // O Astro preview não aplica automaticamente o vercel.json.
    // Injeta a CSP real na resposta HTML.
    await page.route("**/*", async (route) => {
      if (route.request().resourceType() !== "document") {
        await route.continue();
        return;
      }

      const response = await route.fetch();

      await route.fulfill({
        response,
        headers: {
          ...response.headers(),
          "content-security-policy": csp,
        },
      });
    });

    await prepare(page);

    const violations: string[] = [];

    await page.addInitScript(() => {
      document.addEventListener("securitypolicyviolation", (event) => {
        console.error(
          `CSP violation: ${event.violatedDirective} ${event.blockedURI}`,
        );
      });
    });

    page.on("console", (message) => {
      if (/Content.Security.Policy|CSP violation/i.test(message.text())) {
        violations.push(message.text());
      }
    });

    const errors = collectErrors(page);

    await page.goto(path);
    await page.waitForLoadState("networkidle");

    // Alternância de tema.
    await page.locator("#theme-toggle").click();

    // Gráfico SWOT, quando disponível.
    const chart = page.locator("#swotChart");

    if (await chart.count()) {
      await chart.scrollIntoViewIfNeeded();
    }

    // Abertura do modal de contato.
    const emailTrigger = page
      .locator('.contact-btn.email, .social-btn[title="E-mail"]')
      .first();

    await emailTrigger.scrollIntoViewIfNeeded();
    await emailTrigger.click();

    const overlay = page.locator("#email-modal-overlay");

    // Verifica a abertura e o estado de acessibilidade.
    await expect(overlay).toHaveClass(/active/);
    await expect(overlay).toBeVisible();
    await expect(overlay).toHaveAttribute("aria-hidden", "false");

    // Não deve haver violações de CSP.
    expect(violations).toEqual([]);

    // Não deve haver erros de execução JavaScript.
    expect(errors.filter((error) => /pageerror/.test(error))).toEqual([]);
  });
}
