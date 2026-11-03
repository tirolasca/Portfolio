/**
 * Core Web Vitals reais (dados de campo), via biblioteca `web-vitals`.
 *  - desenvolvimento ou `?vitals` na URL → imprime no console
 *  - PUBLIC_VITALS_URL definido → envia com sendBeacon (seu próprio endpoint)
 * Sem nenhum dos dois, a biblioteca nem é baixada.
 */
import type { Metric } from "web-vitals";

export async function initVitals() {
  const endpoint = import.meta.env.PUBLIC_VITALS_URL as string | undefined;
  const verbose =
    import.meta.env.DEV || new URLSearchParams(location.search).has("vitals");
  if (!endpoint && !verbose) return;

  const { onCLS, onFCP, onINP, onLCP, onTTFB } = await import("web-vitals");

  const report = (m: Metric) => {
    if (verbose)
      console.info(
        `[vitals] ${m.name}: ${m.value.toFixed(m.name === "CLS" ? 3 : 0)} (${m.rating})`,
      );
    if (endpoint) {
      const body = JSON.stringify({
        name: m.name,
        value: m.value,
        rating: m.rating,
        id: m.id,
        path: location.pathname,
      });
      try {
        navigator.sendBeacon?.(endpoint, body);
      } catch {
        /* a coleta de métricas nunca pode afetar a experiência */
      }
    }
  };
  [onCLS, onFCP, onINP, onLCP, onTTFB].forEach((fn) => fn(report));
}
