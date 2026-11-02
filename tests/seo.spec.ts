import { expect, test } from "@playwright/test";

const SITE = "https://lucastec.vercel.app";

for (const [path, canonical] of [
  ["/", `${SITE}/`],
  ["/curriculo.html", `${SITE}/curriculo.html`],
] as const) {
  test(`metadados de ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      canonical,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      canonical,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      `${SITE}/og-image.jpg`,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    const ld = JSON.parse(
      (await page
        .locator('script[type="application/ld+json"]')
        .textContent()) ?? "{}",
    );
    expect(ld["@graph"].map((n: { "@type": string }) => n["@type"])).toEqual([
      "WebSite",
      "Person",
      "WebPage",
    ]);
    await expect(page.locator("h1")).toHaveCount(1);
  });
}

test("sitemap e robots", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap-0.xml")).text();
  expect(sitemap).toContain(`<loc>${SITE}/</loc>`);
  expect(sitemap).toContain(`<loc>${SITE}/curriculo.html</loc>`);
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain(
    "Sitemap: https://lucastec.vercel.app/sitemap-index.xml",
  );
});
