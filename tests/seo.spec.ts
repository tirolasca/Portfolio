import { expect, test } from "@playwright/test";

const SITE = "https://lucastec.vercel.app";

const pages = [
  ["/", `${SITE}/`],
  ["/curriculo.html", `${SITE}/curriculo.html`],
  ["/projetos/newelog.html", `${SITE}/projetos/newelog.html`],
] as const;

for (const [path, canonical] of pages) {
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

    const structuredData = JSON.parse(
      (await page
        .locator('script[type="application/ld+json"]')
        .textContent()) ?? "{}",
    ) as {
      "@graph"?: Array<{
        "@type"?: string | string[];
      }>;
    };

    expect(structuredData["@graph"]).toBeDefined();
    expect(Array.isArray(structuredData["@graph"])).toBe(true);

    const schemaTypes = structuredData["@graph"]!.flatMap((node) =>
      Array.isArray(node["@type"])
        ? node["@type"]
        : node["@type"]
          ? [node["@type"]]
          : [],
    );

    expect(schemaTypes).toEqual(
      expect.arrayContaining(["WebSite", "Person", "WebPage"]),
    );

    await expect(page.locator("h1")).toHaveCount(1);
  });
}

test("sitemap e robots", async ({ request }) => {
  const sitemapResponse = await request.get("/sitemap-0.xml");

  expect(sitemapResponse.ok()).toBe(true);

  const sitemap = await sitemapResponse.text();

  expect(sitemap).toContain(`<loc>${SITE}/</loc>`);
  expect(sitemap).toContain(`<loc>${SITE}/curriculo.html</loc>`);
  expect(sitemap).toContain(`<loc>${SITE}/projetos/newelog.html</loc>`);

  const robotsResponse = await request.get("/robots.txt");

  expect(robotsResponse.ok()).toBe(true);

  const robots = await robotsResponse.text();

  expect(robots).toContain(
    "Sitemap: https://lucastec.vercel.app/sitemap-index.xml",
  );
});
