/**
 * Modal de ajuda dos cards de projeto: mostra as contas de teste do ambiente de
 * demonstração, com botão de copiar. Carregado no primeiro clique no ícone de ajuda.
 */
import { closeDialog, openDialog } from "../core/dialog";

interface Credential {
  label: string;
  user: string;
  password: string;
}

const COPY_STATUS_MS = 2500;

function parseCredentials(raw: string | undefined): Credential[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter(
      (item): item is Credential =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Credential).label === "string" &&
        typeof (item as Credential).user === "string" &&
        typeof (item as Credential).password === "string",
    );
  } catch {
    return [];
  }
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function initProjectCredentials() {
  const buttons =
    document.querySelectorAll<HTMLButtonElement>(".project-help-btn");
  if (!buttons.length) return;

  const overlay = el("div", "modal-overlay");
  overlay.id = "credentials-modal";

  const dialog = el("div", "modal-content glow-card credentials-modal");
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "credentials-title");

  const closeBtn = el("button", "close-modal");
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Fechar");
  const closeIcon = el("i", "fa-solid fa-xmark");
  closeIcon.setAttribute("aria-hidden", "true");
  closeBtn.appendChild(closeIcon);

  const title = el("h4", "credentials-title");
  title.id = "credentials-title";
  const note = el(
    "p",
    "muted credentials-note",
    "Contas de teste para explorar o projeto. Os dados são apenas de demonstração.",
  );
  const list = el("div", "credentials-list");
  const status = el("p", "credentials-status");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");

  dialog.append(closeBtn, title, note, list, status);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  let statusTimer: number | undefined;
  function say(message: string) {
    status.textContent = message;
    window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(() => {
      status.textContent = "";
    }, COPY_STATUS_MS);
  }

  async function copy(value: string, what: string) {
    try {
      await navigator.clipboard.writeText(value);
      say(`${what} copiado!`);
    } catch {
      say("Não consegui copiar — selecione o texto manualmente.");
    }
  }

  function field(name: string, value: string): HTMLElement {
    const row = el("div", "credential-field");
    const label = el("span", "credential-name", name);
    const code = el("code", "credential-value", value);
    const copyBtn = el("button", "credential-copy");
    copyBtn.type = "button";
    copyBtn.setAttribute("aria-label", `Copiar ${name.toLowerCase()}`);
    copyBtn.title = `Copiar ${name.toLowerCase()}`;
    const icon = el("i", "fa-regular fa-copy");
    icon.setAttribute("aria-hidden", "true");
    copyBtn.appendChild(icon);
    copyBtn.addEventListener("click", () => {
      void copy(value, name);
    });
    row.append(label, code, copyBtn);
    return row;
  }

  function close() {
    overlay.classList.remove("active");
    closeDialog(overlay);
    window.clearTimeout(statusTimer);
    status.textContent = "";
  }

  function open(button: HTMLButtonElement) {
    const credentials = parseCredentials(button.dataset.credentials);
    if (!credentials.length) return;

    title.textContent = `Acesso de teste — ${button.dataset.project ?? "Projeto"}`;
    list.replaceChildren(
      ...credentials.map((c) => {
        const item = el("div", "credential-item");
        item.append(
          el("strong", "credential-role", c.label),
          field("Usuário", c.user),
          field("Senha", c.password),
        );
        return item;
      }),
    );

    overlay.classList.add("active");
    openDialog(overlay, closeBtn, button);
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => open(button));
  });
  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("active")) close();
  });
}
