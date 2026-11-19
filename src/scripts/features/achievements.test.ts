import { afterEach, describe, expect, it, vi } from "vitest";
import { showAchievement, showHintToast } from "./achievements";

describe("notificações de conquistas", () => {
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    document.body.replaceChildren();
  });

  it("renderiza dicas como texto, sem interpretar HTML recebido", () => {
    vi.useFakeTimers();
    const payload = '<img src=x onerror="alert(1)">';

    showHintToast(payload);

    const toast = document.querySelector<HTMLElement>(".hint-toast");
    expect(toast?.querySelector("img")).toBeNull();
    expect(toast?.querySelector("span")?.textContent).toBe(payload);
  });

  it("renderiza título e descrição da conquista como texto", () => {
    vi.useFakeTimers();
    const title = '<svg onload="alert(1)">';
    const description = '<script>alert("xss")</script>';

    showAchievement("fa-trophy", title, description, 10);

    const toast = document.querySelector<HTMLElement>(".achievement-toast");
    expect(toast?.querySelector("svg, script")).toBeNull();
    expect(toast?.querySelector(".achievement-title")?.textContent).toBe(title);
    expect(toast?.querySelector(".achievement-desc")?.textContent).toBe(
      description,
    );
  });
});
