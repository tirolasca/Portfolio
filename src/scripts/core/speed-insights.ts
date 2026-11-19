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

export function initSpeedInsights() {
  const env = import.meta.env as Record<string, string | undefined>;
  // Astro (site estático, sem rotas dinâmicas): a rota é o próprio caminho da página.
  injectSpeedInsights(
    {
      route: computeRoute(location.pathname, {}),
      framework: "astro",
      basePath: env.PUBLIC_VERCEL_OBSERVABILITY_BASEPATH,
      beforeSend: window.speedInsightsBeforeSend,
    },
    env.PUBLIC_VERCEL_OBSERVABILITY_CLIENT_CONFIG,
  );
}
