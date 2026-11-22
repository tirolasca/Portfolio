/**
 * Acesso seguro a localStorage/sessionStorage.
 *
 * Navegadores podem bloquear o armazenamento (modo privado, política de
 * cookies, cota cheia): nesse caso até ler `window.localStorage` lança erro.
 * Estes wrappers nunca lançam; quando o armazenamento não está disponível,
 * os valores ficam só em memória durante a vida da página, e a interface
 * continua funcionando (apenas sem persistência).
 */
type Area = "localStorage" | "sessionStorage";

export interface SafeStorage {
  get(key: string): string | null;
  /** Retorna `true` se o valor foi persistido de fato. */
  set(key: string, value: string): boolean;
  remove(key: string): void;
}

function createSafeStorage(area: Area): SafeStorage {
  const memory = new Map<string, string>();

  const backend = (): Storage | null => {
    try {
      return window[area];
    } catch {
      return null;
    }
  };

  return {
    get(key) {
      try {
        const value = backend()?.getItem(key);
        if (value != null) return value;
      } catch {
        /* storage bloqueado: usa a memória */
      }
      return memory.get(key) ?? null;
    },
    set(key, value) {
      memory.set(key, value);
      try {
        const store = backend();
        if (!store) return false;
        store.setItem(key, value);
        return true;
      } catch {
        return false;
      }
    },
    remove(key) {
      memory.delete(key);
      try {
        backend()?.removeItem(key);
      } catch {
        /* ignora */
      }
    },
  };
}

export const local = createSafeStorage("localStorage");
export const session = createSafeStorage("sessionStorage");
