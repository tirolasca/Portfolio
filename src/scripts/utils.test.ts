import { describe, expect, it, vi } from "vitest";
import { must, normalize, secureRandom } from "./utils";

describe("normalize", () => {
  it("deixa minúsculo e remove espaços e símbolos", () => {
    expect(normalize("Node.js")).toBe("node.js");
    expect(normalize("Spring Boot")).toBe("springboot");
    expect(normalize("C++")).toBe("c");
  });

  it("aceita null, undefined e string vazia", () => {
    expect(normalize(null)).toBe("");
    expect(normalize(undefined)).toBe("");
    expect(normalize("")).toBe("");
  });
});

describe("secureRandom", () => {
  it("retorna um número em [0, 1)", () => {
    for (let i = 0; i < 100; i++) {
      const n = secureRandom();
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(1);
    }
  });

  it("cai para Math.random sem crypto.getRandomValues", () => {
    const original = window.crypto;
    vi.stubGlobal("crypto", undefined);
    Object.defineProperty(window, "crypto", {
      value: undefined,
      configurable: true,
    });
    const spy = vi.spyOn(Math, "random").mockReturnValue(0.42);
    try {
      expect(secureRandom()).toBe(0.42);
    } finally {
      spy.mockRestore();
      vi.unstubAllGlobals();
      Object.defineProperty(window, "crypto", {
        value: original,
        configurable: true,
      });
    }
  });
});

describe("must", () => {
  it("retorna o elemento quando existe", () => {
    document.body.innerHTML = '<div id="alvo"></div>';
    expect(must("alvo")).toBe(document.getElementById("alvo"));
  });

  it("falha de forma explícita quando não existe", () => {
    document.body.innerHTML = "";
    expect(() => must("nada")).toThrow("#nada");
  });
});
