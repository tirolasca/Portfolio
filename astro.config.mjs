import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://lucastec.vercel.app",
  // Gera /curriculo.html (mantém as URLs antigas funcionando)
  build: { format: "file" },
  // A compressão padrão remove espaços entre tags inline (ex.: </i> <span>),
  // o que cola ícones e textos. O layout depende desses espaços.
  compressHTML: false,
  integrations: [
    sitemap({
      // com build.format "file" as páginas são servidas como /curriculo.html
      // (sem `lastmod`: só informamos datas que correspondam a mudanças reais)
      serialize(item) {
        if (!item.url.endsWith("/") && !item.url.endsWith(".html"))
          item.url += ".html";
        return item;
      },
    }),
  ],
});
