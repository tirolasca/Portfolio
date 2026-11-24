/** Timeout padrão das chamadas a APIs externas (a página nunca deve esperar indefinidamente). */
const DEFAULT_TIMEOUT_MS = 8_000;

/**
 * GET com timeout que devolve o JSON como `unknown`.
 *
 * O resultado NÃO é tipado de propósito: quem chama precisa validá-lo (veja
 * `core/github-schema.ts`) antes de usar, porque uma anotação TypeScript não
 * garante nada sobre o que a rede realmente devolveu.
 */
export async function fetchJson(
  url: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<unknown> {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
