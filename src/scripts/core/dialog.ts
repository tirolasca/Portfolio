/**
 * Acessibilidade de diálogos.
 *
 * Ao abrir:
 * - O restante da página fica inert.
 * - O foco é direcionado ao elemento inicial.
 * - O elemento que abriu o diálogo é armazenado.
 *
 * Ao fechar:
 * - O inert é removido dos elementos afetados.
 * - O foco retorna ao elemento que abriu o diálogo.
 */

interface DialogState {
  opener: HTMLElement | null;
  inert: HTMLElement[];
}

const opened = new WeakMap<HTMLElement, DialogState>();

/**
 * Tenta direcionar o foco ao elemento.
 * Repete a tentativa enquanto o elemento não estiver visível.
 */
export function focusWhenVisible(target: HTMLElement, attempt = 0): void {
  if (!target.isConnected) return;

  target.focus({ preventScroll: true });

  if (document.activeElement !== target && attempt < 8) {
    window.setTimeout(() => {
      focusWhenVisible(target, attempt + 1);
    }, 40);
  }
}

/**
 * Abre um diálogo e torna o restante da página inerte.
 */
export function openDialog(
  overlay: HTMLElement,
  focusTarget?: HTMLElement | null,
  opener?: HTMLElement | null,
): void {
  // Evita registrar o mesmo diálogo mais de uma vez.
  if (opened.has(overlay)) return;

  const inert = Array.from(document.body.children).filter(
    (element): element is HTMLElement =>
      element instanceof HTMLElement &&
      element !== overlay &&
      !element.hasAttribute("inert"),
  );

  // Impede interação com o conteúdo externo.
  inert.forEach((element) => {
    element.setAttribute("inert", "");
  });

  const activeElement =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

  opened.set(overlay, {
    opener: opener ?? activeElement,
    inert,
  });

  // Direciona o foco ao conteúdo do diálogo.
  if (focusTarget) {
    focusWhenVisible(focusTarget);
  }
}

/**
 * Fecha um diálogo, restaura o conteúdo e devolve o foco.
 */
export function closeDialog(overlay: HTMLElement): void {
  const state = opened.get(overlay);

  if (!state) return;

  // Libera somente os elementos que este diálogo tornou inertes.
  state.inert.forEach((element) => {
    element.removeAttribute("inert");
  });

  // Remove o registro antes de restaurar o foco.
  opened.delete(overlay);

  // Restaura o foco ao elemento que abriu o diálogo.
  if (state.opener?.isConnected && !state.opener.hasAttribute("disabled")) {
    state.opener.focus({ preventScroll: true });
  }
}
