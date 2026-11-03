import { session } from "../core/storage";
import { SITE } from "../../data/site";
import { closeDialog, openDialog } from "../core/dialog";

/**
 * Formulário de contato.
 * - PUBLIC_CONTACT_ENDPOINT definido → envia de verdade (fetch JSON).
 * - Caso contrário → abre o app de e-mail (mailto:).
 */

const ENDPOINT = import.meta.env.PUBLIC_CONTACT_ENDPOINT as string | undefined;

const DRAFT_KEY = "contactDraft";
const MAX_MESSAGE = 2000;
const REQUEST_TIMEOUT_MS = 10_000;

let sending = false;

type FieldName = "name" | "email" | "message";

interface Els {
  form: HTMLFormElement;
  name: HTMLInputElement;
  email: HTMLInputElement;
  subject: HTMLInputElement;
  message: HTMLTextAreaElement;
  hp: HTMLInputElement;
  count: HTMLElement;
  status: HTMLElement;
  send: HTMLButtonElement;
  success: HTMLElement;
}

let overlay: HTMLElement | null = null;
let els: Els;

const SEND_LABEL =
  '<i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Enviar';

function build(): HTMLElement {
  const el = document.createElement("div");

  el.id = "email-modal-overlay";
  el.setAttribute("aria-hidden", "true");

  el.innerHTML = `
    <div class="email-modal" role="dialog" aria-modal="true" aria-labelledby="em-title" aria-describedby="em-hint">
      <div class="email-modal-header">
        <h3 id="em-title">
          <i class="fa-solid fa-paper-plane" aria-hidden="true"></i>
          Enviar Mensagem
        </h3>

        <button type="button" class="email-modal-close" aria-label="Fechar">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </div>

      <form class="email-form" id="email-form-body" novalidate>
        <p id="em-hint" class="email-hint">
          Campos com
          <span aria-hidden="true">*</span>
          <span class="sr-only">asterisco</span>
          são obrigatórios.
        </p>

        <div class="email-form-row">
          <div class="email-form-group" data-field="name">
            <label for="em-name">Nome <span aria-hidden="true">*</span></label>
            <input
              id="em-name"
              name="name"
              type="text"
              placeholder="Seu nome"
              autocomplete="name"
              required
              aria-describedby="em-name-error"
            />
            <p class="email-field-error" id="em-name-error" hidden></p>
          </div>

          <div class="email-form-group" data-field="email">
            <label for="em-email">E-mail <span aria-hidden="true">*</span></label>
            <input
              id="em-email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              autocomplete="email"
              inputmode="email"
              required
              aria-describedby="em-email-error"
            />
            <p class="email-field-error" id="em-email-error" hidden></p>
          </div>
        </div>

        <div class="email-form-group">
          <label for="em-subject">Assunto</label>
          <input
            id="em-subject"
            name="subject"
            type="text"
            placeholder="Proposta, parceria, dúvida…"
            enterkeyhint="next"
          />
        </div>

        <div class="email-form-group" data-field="message">
          <label for="em-message">
            Mensagem <span aria-hidden="true">*</span>
          </label>

          <textarea
            id="em-message"
            name="message"
            maxlength="${MAX_MESSAGE}"
            placeholder="Conte um pouco mais sobre o que você precisa…"
            required
            aria-describedby="em-message-error em-count"
          ></textarea>

          <div class="email-meta">
            <p class="email-field-error" id="em-message-error" hidden></p>
            <span class="email-counter" id="em-count">
              0 / ${MAX_MESSAGE}
            </span>
          </div>
        </div>

        <div class="email-hp" aria-hidden="true">
          <label>
            Não preencha
            <input
              name="_gotcha"
              tabindex="-1"
              autocomplete="off"
            />
          </label>
        </div>

        <p
          class="email-status"
          id="em-status"
          role="status"
          aria-live="polite"
        ></p>

        <div class="email-form-actions">
          <button type="button" class="email-btn-cancel">
            Cancelar
          </button>

          <button type="submit" class="email-btn-send" id="em-send">
            ${SEND_LABEL}
          </button>
        </div>
      </form>

      <div
        class="email-success"
        id="email-success"
        role="status"
        tabindex="-1"
      ></div>
    </div>
  `;

  document.body.appendChild(el);

  const q = <T extends HTMLElement>(selector: string): T => {
    const element = el.querySelector<T>(selector);

    if (!element) {
      throw new Error(`Elemento não encontrado: ${selector}`);
    }

    return element;
  };

  els = {
    form: q<HTMLFormElement>("form"),
    name: q<HTMLInputElement>("#em-name"),
    email: q<HTMLInputElement>("#em-email"),
    subject: q<HTMLInputElement>("#em-subject"),
    message: q<HTMLTextAreaElement>("#em-message"),
    hp: q<HTMLInputElement>('input[name="_gotcha"]'),
    count: q<HTMLElement>("#em-count"),
    status: q<HTMLElement>("#em-status"),
    send: q<HTMLButtonElement>("#em-send"),
    success: q<HTMLElement>("#email-success"),
  };

  q<HTMLButtonElement>(".email-modal-close").addEventListener(
    "click",
    closeEmailModal,
  );

  q<HTMLButtonElement>(".email-btn-cancel").addEventListener(
    "click",
    closeEmailModal,
  );

  el.addEventListener("click", (event) => {
    if (event.target === el) {
      closeEmailModal();
    }
  });

  els.form.addEventListener("submit", onSubmit);

  els.form.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      els.form.requestSubmit();
    }
  });

  (["name", "email", "message"] as const).forEach((field) => {
    els[field].addEventListener("blur", () => {
      if (els[field].value) validateField(field);
    });

    els[field].addEventListener("input", () => {
      if (els[field].getAttribute("aria-invalid") === "true") {
        validateField(field);
      }
    });
  });

  els.form.addEventListener("input", () => {
    els.count.textContent = `${els.message.value.length} / ${MAX_MESSAGE}`;

    saveDraft();
  });

  return el;
}

// ---------- validação ----------

function errorFor(field: FieldName): string {
  const value = els[field].value.trim();

  if (field === "name") {
    return value.length < 2 ? "Informe seu nome." : "";
  }

  if (field === "email") {
    return !value || !els.email.checkValidity()
      ? "Informe um e-mail válido, como nome@email.com."
      : "";
  }

  return value.length < 10
    ? "Escreva uma mensagem com pelo menos 10 caracteres."
    : "";
}

function validateField(field: FieldName): boolean {
  const message = errorFor(field);
  const input = els[field];

  const error = document.getElementById(`em-${field}-error`) as HTMLElement;

  input.setAttribute("aria-invalid", String(Boolean(message)));

  input
    .closest(".email-form-group")
    ?.classList.toggle("has-error", Boolean(message));

  error.textContent = message;
  error.hidden = !message;

  return !message;
}

// ---------- rascunho ----------

function saveDraft(): void {
  try {
    session.set(
      DRAFT_KEY,
      JSON.stringify({
        n: els.name.value,
        e: els.email.value,
        s: els.subject.value,
        m: els.message.value,
      }),
    );
  } catch {
    // Storage bloqueado ou indisponível.
  }
}

function restoreDraft(): void {
  try {
    const draft = JSON.parse(session.get(DRAFT_KEY) || "null");

    if (!draft || typeof draft !== "object") return;

    els.name.value ||= draft.n ?? "";
    els.email.value ||= draft.e ?? "";
    els.subject.value ||= draft.s ?? "";
    els.message.value ||= draft.m ?? "";

    els.count.textContent = `${els.message.value.length} / ${MAX_MESSAGE}`;
  } catch {
    // Rascunho inválido: ignora.
  }
}

// ---------- abrir / fechar ----------

export function openEmailModal(from?: HTMLElement): void {
  overlay ??= build();

  if (overlay.classList.contains("active")) return;

  restoreDraft();

  // Registra o diálogo e o elemento que abriu o modal.
  openDialog(
    overlay,
    els.success.classList.contains("show") ? els.success : els.name,
    from,
  );

  overlay.classList.add("active");
  overlay.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";
  document.addEventListener("keydown", onKeydown);
}

export function closeEmailModal(): void {
  if (!overlay || !overlay.classList.contains("active")) {
    return;
  }

  overlay.classList.remove("active");
  overlay.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";
  document.removeEventListener("keydown", onKeydown);

  // closeDialog é o único responsável por restaurar o foco.
  closeDialog(overlay);

  if (els.success.classList.contains("show")) {
    window.setTimeout(() => {
      if (!overlay?.classList.contains("active")) {
        resetForm();
      }
    }, 350);
  }
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === "Escape") {
    event.preventDefault();
    closeEmailModal();
  }
}

// ---------- reset ----------

function resetForm(): void {
  els.form.reset();

  els.form.hidden = false;

  els.success.classList.remove("show");
  els.success.innerHTML = "";

  els.count.textContent = `0 / ${MAX_MESSAGE}`;

  (["name", "email", "message"] as const).forEach((field) => {
    els[field].removeAttribute("aria-invalid");

    els[field].closest(".email-form-group")?.classList.remove("has-error");

    (document.getElementById(`em-${field}-error`) as HTMLElement).hidden = true;
  });

  els.status.textContent = "";
}

// ---------- envio ----------

function setBusy(busy: boolean): void {
  els.send.disabled = busy;
  els.form.setAttribute("aria-busy", String(busy));

  els.send.innerHTML = busy
    ? '<i class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i> Enviando…'
    : SEND_LABEL;
}

function failureMessage(error: unknown): string {
  const fallback = `escreva para ${SITE.email}.`;

  if (error instanceof DOMException && error.name === "TimeoutError") {
    return `O servidor demorou para responder. Tente de novo ou ${fallback}`;
  }

  if (error instanceof TypeError) {
    return `Sem conexão com o servidor. Verifique sua internet ou ${fallback}`;
  }

  return `Não consegui enviar agora. Tente de novo ou ${fallback}`;
}

async function onSubmit(event: Event): Promise<void> {
  event.preventDefault();

  if (sending) return;

  const fields = (["name", "email", "message"] as const).filter(
    (field) => !validateField(field),
  );

  if (fields.length) {
    els.status.textContent = `Corrija ${
      fields.length === 1 ? "o campo destacado" : "os campos destacados"
    } para enviar.`;

    els[fields[0]].focus();
    return;
  }

  els.status.textContent = "";

  if (els.hp.value) {
    showSuccess("sent");
    return;
  }

  const data = {
    name: els.name.value.trim(),
    email: els.email.value.trim(),
    subject: els.subject.value.trim() || "Mensagem do Portfólio",
    message: els.message.value.trim(),
  };

  sending = true;
  setBusy(true);

  try {
    if (ENDPOINT) {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (!response.ok) {
        throw new Error(String(response.status));
      }

      showSuccess("sent");
    } else {
      const body = `Nome: ${data.name}\nE-mail: ${data.email}\n\n${data.message}`;

      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;

      showSuccess("mailto", `${data.subject}\n\n${body}`);
    }

    try {
      session.remove(DRAFT_KEY);
    } catch {
      // Ignora falha de armazenamento.
    }
  } catch (error) {
    els.status.textContent = failureMessage(error);
  } finally {
    sending = false;
    setBusy(false);
  }
}

// ---------- sucesso ----------

function showSuccess(kind: "sent" | "mailto", fullText = ""): void {
  const sent = kind === "sent";

  els.success.innerHTML = `
    <div class="email-success-icon">
      <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
    </div>

    <h4>${sent ? "Mensagem enviada!" : "Quase lá!"}</h4>

    <p>
      ${
        sent
          ? "Obrigado pelo contato — respondo assim que possível."
          : "Abri o seu app de e-mail com a mensagem pronta. Falta só clicar em enviar por lá."
      }
    </p>

    ${
      sent
        ? ""
        : `
          <p class="email-fallback">
            Não abriu? Copie e envie manualmente para
            <strong>${SITE.email}</strong>.
          </p>

          <div class="email-form-actions">
            <button
              type="button"
              class="email-btn-cancel"
              data-copy="${SITE.email}"
            >
              Copiar e-mail
            </button>

            <button
              type="button"
              class="email-btn-cancel"
              data-copy-text
            >
              Copiar mensagem
            </button>
          </div>

          <p
            class="email-status"
            data-copy-status
            role="status"
            aria-live="polite"
          ></p>
        `
    }

    <div class="email-form-actions">
      <button
        type="button"
        class="email-btn-send"
        data-close
      >
        Fechar
      </button>
    </div>
  `;

  els.form.hidden = true;
  els.success.classList.add("show");
  els.success.focus();

  els.success
    .querySelector("[data-close]")
    ?.addEventListener("click", closeEmailModal);

  els.success
    .querySelectorAll<HTMLElement>("[data-copy], [data-copy-text]")
    .forEach((button) => {
      button.addEventListener("click", async () => {
        const status =
          els.success.querySelector<HTMLElement>("[data-copy-status]");

        try {
          await navigator.clipboard.writeText(button.dataset.copy ?? fullText);

          if (status) status.textContent = "Copiado!";
        } catch {
          if (status) {
            status.textContent =
              "Não consegui copiar — selecione o texto manualmente.";
          }
        }
      });
    });
}
