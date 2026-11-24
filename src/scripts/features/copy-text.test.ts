import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { initCopyButtons } from "./copy-text";

const html = `
  <button type="button" data-copy="a@b.c">copiar</button>
  <p data-copy-status></p>`;

describe("initCopyButtons", () => {
  beforeEach(() => {
    document.body.innerHTML = html;
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  const click = async () => {
    document.querySelector("button")?.click();
    await vi.advanceTimersByTimeAsync(0);
  };

  it("copia o texto, marca o botão e anuncia o resultado", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    initCopyButtons();
    await click();

    expect(writeText).toHaveBeenCalledWith("a@b.c");
    expect(document.querySelector("button")?.hasAttribute("data-copied")).toBe(
      true,
    );
    expect(document.querySelector("[data-copy-status]")?.textContent).toMatch(
      /Copiado/,
    );
  });

  it("limpa o estado depois do tempo de feedback", async () => {
    vi.stubGlobal("navigator", {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    initCopyButtons();
    await click();
    await vi.advanceTimersByTimeAsync(2000);

    expect(document.querySelector("button")?.hasAttribute("data-copied")).toBe(
      false,
    );
    expect(document.querySelector("[data-copy-status]")?.textContent).toBe("");
  });

  it("avisa quando a cópia falha e não marca o botão", async () => {
    vi.stubGlobal("navigator", {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error("negado")) },
    });
    initCopyButtons();
    await click();

    expect(document.querySelector("button")?.hasAttribute("data-copied")).toBe(
      false,
    );
    expect(document.querySelector("[data-copy-status]")?.textContent).toMatch(
      /Não foi possível/,
    );
  });
});
