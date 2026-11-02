/**
 * Acessibilidade de diálogos: ao abrir, o resto da página fica `inert`
 * (foco e leitores de tela ficam presos no diálogo); ao fechar, tudo volta e
 * o foco retorna a quem abriu.
 */
const opened = new WeakMap<
  HTMLElement,
  { opener: HTMLElement | null; inert: Element[] }
>();

/** O overlay pode estar com visibility:hidden durante a transição; tenta de novo. */
export function focusWhenVisible(target: HTMLElement, attempt = 0) {
  target.focus();
  if (document.activeElement !== target && attempt < 8)
    setTimeout(() => focusWhenVisible(target, attempt + 1), 40);
}

export function openDialog(
  overlay: HTMLElement,
  focusTarget?: HTMLElement | null,
  opener?: HTMLElement | null,
) {
  if (opened.has(overlay)) return;
  const inert = [...document.body.children].filter(
    (c) =>
      c !== overlay &&
      !(c instanceof HTMLScriptElement) &&
      !c.hasAttribute("inert"),
  );
  inert.forEach((c) => c.setAttribute("inert", ""));
  opened.set(overlay, {
    opener: opener ?? (document.activeElement as HTMLElement | null),
    inert,
  });
  if (focusTarget) focusWhenVisible(focusTarget);
}

export function closeDialog(overlay: HTMLElement) {
  const state = opened.get(overlay);
  if (!state) return;
  state.inert.forEach((c) => c.removeAttribute("inert"));
  opened.delete(overlay);
  state.opener?.focus?.();
}
