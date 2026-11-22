import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { initProjectCredentials } from "./project-credentials";

const credentials = [
  { label: "Administrador", user: "admin", password: "123" },
  { label: "Checker", user: "checker", password: "123" },
];

function renderCard(data: unknown = credentials) {
  document.body.innerHTML = `
    <div class="project-card">
      <button type="button" class="project-help-btn" data-project="Signa"></button>
    </div>`;
  const button =
    document.querySelector<HTMLButtonElement>(".project-help-btn")!;
  button.dataset.credentials =
    typeof data === "string" ? data : JSON.stringify(data);
  return button;
}

describe("modal de credenciais de teste", () => {
  let button: HTMLButtonElement;

  beforeEach(() => {
    button = renderCard();
    initProjectCredentials();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("abre com o título do projeto e uma conta por perfil", () => {
    button.click();
    const overlay = document.getElementById("credentials-modal")!;
    expect(overlay.classList.contains("active")).toBe(true);
    expect(overlay.querySelector("#credentials-title")?.textContent).toContain(
      "Signa",
    );
    expect(overlay.querySelectorAll(".credential-item")).toHaveLength(2);
    expect(overlay.textContent).toContain("checker");
  });

  it("fecha com Escape e devolve o estado inerte da página", () => {
    button.click();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    const overlay = document.getElementById("credentials-modal")!;
    expect(overlay.classList.contains("active")).toBe(false);
    expect(document.querySelector(".project-card")?.hasAttribute("inert")).toBe(
      false,
    );
  });

  it("fecha ao clicar no fundo", () => {
    button.click();
    const overlay = document.getElementById("credentials-modal")!;
    overlay.click();
    expect(overlay.classList.contains("active")).toBe(false);
  });

  it("ignora JSON inválido sem abrir o modal", () => {
    document.body.innerHTML = "";
    const bad = renderCard("{não é json");
    initProjectCredentials();
    bad.click();
    const overlays = document.querySelectorAll("#credentials-modal.active");
    expect(overlays).toHaveLength(0);
  });
});
