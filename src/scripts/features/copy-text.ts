/**
 * Botões "copiar" da página de projeto: `<button data-copy="texto">`.
 * O resultado é anunciado num elemento `aria-live` (leitores de tela) e o
 * botão ganha `data-copied` por um instante (o CSS troca o ícone).
 */
const FEEDBACK_MS = 1800;

async function writeToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false; // sem permissão ou contexto não seguro
  }
}

export function initCopyButtons(root: ParentNode = document): void {
  const status = root.querySelector<HTMLElement>("[data-copy-status]");

  root
    .querySelectorAll<HTMLButtonElement>("button[data-copy]")
    .forEach((btn) => {
      let timer: ReturnType<typeof setTimeout> | undefined;

      btn.addEventListener("click", async () => {
        const ok = await writeToClipboard(btn.dataset["copy"] ?? "");
        if (status) {
          status.textContent = ok
            ? "Copiado para a área de transferência."
            : "Não foi possível copiar. Selecione o texto e copie manualmente.";
        }
        if (!ok) return;
        btn.dataset["copied"] = "";
        clearTimeout(timer);
        timer = setTimeout(() => {
          delete btn.dataset["copied"];
          if (status) status.textContent = "";
        }, FEEDBACK_MS);
      });
    });
}
