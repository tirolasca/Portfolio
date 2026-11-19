/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

// getViteConfig reaproveita a config do Astro (imports de imagem, aliases,
// TypeScript), então os testes enxergam o código igual ao build.
// Os testes unitários ficam ao lado do código (src/**/*.test.ts); os E2E do
// Playwright continuam em tests/ e não são pegos por aqui.
export default getViteConfig({
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/scripts/**/*.ts", "src/data/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/scripts/globals.d.ts"],
      reporter: ["text", "html"],
    },
  },
});
