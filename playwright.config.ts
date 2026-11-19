import { defineConfig } from "@playwright/test";

const PORT = 4321;

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    viewport: { width: 1280, height: 800 },
    // Em máquinas sem os navegadores do Playwright: CHROME_PATH=/caminho/do/chrome
    launchOptions: process.env.CHROME_PATH
      ? {
          executablePath: process.env.CHROME_PATH,
          args: (process.env.CHROME_ARGS ?? "--no-sandbox --disable-gpu").split(
            " ",
          ),
        }
      : {},
  },
  // sobe o build (`npm run build` antes) numa porta fixa
  webServer: {
    command: `npx astro preview --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
