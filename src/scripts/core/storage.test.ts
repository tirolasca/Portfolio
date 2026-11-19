import { afterEach, describe, expect, it } from "vitest";
import { local, session } from "./storage";

afterEach(() => {
  local.remove("k");
  session.remove("k");
});

describe("storage seguro", () => {
  it("persiste e lê valores", () => {
    expect(local.set("k", "v")).toBe(true);
    expect(local.get("k")).toBe("v");
    expect(window.localStorage.getItem("k")).toBe("v");
  });

  it("retorna null para chave inexistente", () => {
    expect(local.get("k")).toBeNull();
  });

  it("remove o valor do storage e da memória", () => {
    local.set("k", "v");
    local.remove("k");
    expect(local.get("k")).toBeNull();
  });

  it("não lança e usa a memória quando o storage está bloqueado", () => {
    const original = Object.getOwnPropertyDescriptor(window, "localStorage");
    // modo privado/política de cookies: só ler window.localStorage já lança
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new DOMException("bloqueado", "SecurityError");
      },
    });
    try {
      expect(local.set("k", "v")).toBe(false);
      expect(local.get("k")).toBe("v");
      expect(() => local.remove("k")).not.toThrow();
      expect(local.get("k")).toBeNull();
    } finally {
      if (original) Object.defineProperty(window, "localStorage", original);
      else Reflect.deleteProperty(window, "localStorage");
    }
  });

  it("localStorage e sessionStorage são independentes", () => {
    local.set("k", "a");
    session.set("k", "b");
    expect(local.get("k")).toBe("a");
    expect(session.get("k")).toBe("b");
  });
});
