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
  ])
    expect(header(name), name).not.toBe("");
});

test("CSP: sem unsafe-eval nem unsafe-inline em scripts", () => {
  const script = csp.split(";").find((d) => d.trim().startsWith("script-src"))!;
  expect(script).not.toMatch(/unsafe-(eval|inline)/);
  expect(csp).toContain("object-src 'none'");
  expect(csp).toContain("frame-ancestors 'self'");
});

for (const path of PAGES) {
  test(`CSP: hash do script inline de ${path} confere com a CSP`, async ({
    request,
  }) => {
    const html = await (await request.get(path)).text();
    const inline = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)]
      .filter(([, attrs]) => !/\bsrc=|ld\+json/.test(attrs))
      .map(([, , body]) => body);
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
      [...document.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]')]
        .filter((a) => {
          const rel = a.rel.split(/\s+/);
          return !(rel.includes("noopener") && rel.includes("noreferrer"));
        })
        .map((a) => a.href),
    );
    expect(bad).toEqual([]);
  });

  test(`CSP aplicada: ${path} funciona sem violações`, async ({ page }) => {
    // o `astro preview` não lê o vercel.json: injetamos a CSP real nas páginas
    await page.route("**/*", async (route) => {
      if (route.request().resourceType() !== "document")
        return route.continue();
      const response = await route.fetch();
      await route.fulfill({
        response,
        headers: { ...response.headers(), "content-security-policy": csp },
      });
    });
    await prepare(page);
    const violations: string[] = [];
    await page.addInitScript(() => {
      document.addEventListener("securitypolicyviolation", (e) =>
        console.error(`CSP violation: ${e.violatedDirective} ${e.blockedURI}`),
      );
    });
    page.on("console", (m) => {
      if (/Content.Security.Policy|CSP violation/i.test(m.text()))
        violations.push(m.text());
    });
    const errors = collectErrors(page);
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await page.locator("#theme-toggle").click();
    const chart = page.locator("#swotChart");
    if (await chart.count()) await chart.scrollIntoViewIfNeeded();
    // modal de contato: HTML injetado por JS, com atributos de estilo
    await page
      .locator('.contact-btn.email, .social-btn[title="E-mail"]')
      .first()
      .click();
    await expect(page.locator("#email-modal-overlay.active")).toBeVisible();
    await page.waitForTimeout(1500);
    // violações de hosts externos (GTranslate/GitHub) não existem aqui: sem internet
    expect(violations).toEqual([]);
    expect(errors.filter((e) => /pageerror/.test(e))).toEqual([]);
  });
}
