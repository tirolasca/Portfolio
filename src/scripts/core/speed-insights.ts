/**
 * Vercel Speed Insights, carregado como módulo externo do próprio site.
 *
 * Por que não usar o componente `@vercel/speed-insights/astro`: ele gera um <script> INLINE cujo
 * conteúdo muda a cada versão da biblioteca (inclusive dentro do intervalo `^2.0.0`). Como a CSP
 * não permite `unsafe-inline`, cada script inline precisa de um hash fixo no vercel.json — e o
 * hash quebrava a cada atualização. Aqui o código vai para um arquivo em /_astro (origem 'self'),
 * que a CSP já permite, e o hash deixa de depender da versão da dependência.
 */
import { computeRoute, injectSpeedInsights } from "@vercel/speed-insights";

/** `/_vercel/speed-insights/script.js` só existe na Vercel: em preview/CI local (Lighthouse CI)
 *  a requisição dá 404 com `text/html` e vira erro de console. Nada é coletado ali mesmo. */
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

export function initSpeedInsights() {
  // em `astro dev` mantém o modo de depuração da biblioteca
  if (!import.meta.env.DEV && LOCAL_HOSTS.has(location.hostname)) return;
  const env = import.meta.env as Record<string, string | undefined>;
  // Astro (site estático, sem rotas dinâmicas): a rota é o próprio caminho da página.
  const basePath = env.PUBLIC_VERCEL_OBSERVABILITY_BASEPATH;
  const beforeSend = window.speedInsightsBeforeSend;
  injectSpeedInsights(
    {
      route: computeRoute(location.pathname, {}),
      framework: "astro",
      // com exactOptionalPropertyTypes só passamos as chaves que existem
      ...(basePath !== undefined && { basePath }),
      ...(beforeSend !== undefined && { beforeSend }),
    },
    env.PUBLIC_VERCEL_OBSERVABILITY_CLIENT_CONFIG,
  );
}
