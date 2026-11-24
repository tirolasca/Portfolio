import { defineConfig, envField } from "astro/config";
import sitemap from "@astrojs/sitemap";
import Sonda from "sonda/vite";

export default defineConfig({
  site: "https://lucastec.vercel.app",
  // Gera /curriculo.html (mantém as URLs antigas funcionando)
  build: { format: "file" },
  // A compressão padrão remove espaços entre tags inline (ex.: </i> <span>),
  // o que cola ícones e textos. O layout depende desses espaços.
  compressHTML: false,
  // Variáveis de ambiente tipadas e validadas no build (`astro:env/client`).
  // Ambas são PÚBLICAS: o valor vai para o bundle do navegador, então nunca
  // coloque segredos aqui (um endpoint do Formspree não é segredo).
  env: {
    schema: {
      PUBLIC_CONTACT_ENDPOINT: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
      PUBLIC_VITALS_URL: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
    },
  },
  vite: {
    plugins: [
      // Relatório do bundle (treemap) em .sonda/ — só quando pedido:
      //   npm run analyze   (flag --analyze, igual no Windows/Mac/Linux).
      //   No build normal fica desligado.
      // (usa o plugin do Vite: o `sonda/astro` não dispara no Astro 7, que
      //  chama o hook de build só com target "server")
      Sonda({
        enabled: process.argv.includes("--analyze"),
        // só o que vai pro navegador (o build também gera chunks de
        // prerender em dist/.prerender, que são descartados)
        exclude: [/\.prerender\//],
        filename: "sonda",
      }),
    ],
  },
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
