export function secureRandom() {
  if (window.crypto && typeof window.crypto.getRandomValues === "function") {
    const buffer = new Uint32Array(1);
    window.crypto.getRandomValues(buffer);
    return buffer[0] / 0x100000000;
  }
  return Math.random();
}

/** Busca um elemento por id e falha de forma explícita se ele não existir. */
export function must<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Elemento #${id} não encontrado`);
  return el as T;
}

export function normalize(str: string | null | undefined) {
  return (str || "").toLowerCase().replace(/[^a-z0-9.]/g, "");
}
