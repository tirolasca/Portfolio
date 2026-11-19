import { afterEach, describe, expect, it } from "vitest";
import { closeDialog, focusWhenVisible, openDialog } from "./dialog";

describe("gerenciamento de diálogos", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("torna o conteúdo externo inerte e direciona o foco ao diálogo", () => {
    const page = document.createElement("main");
    const overlay = document.createElement("section");
    const focusTarget = document.createElement("button");
    overlay.append(focusTarget);
    document.body.append(page, overlay);

    openDialog(overlay, focusTarget);

    expect(page.hasAttribute("inert")).toBe(true);
    expect(overlay.hasAttribute("inert")).toBe(false);
    expect(document.activeElement).toBe(focusTarget);
  });

  it("restaura o conteúdo e o foco ao fechar", () => {
    const opener = document.createElement("button");
    const page = document.createElement("main");
    const overlay = document.createElement("section");
    document.body.append(opener, page, overlay);

    openDialog(overlay, null, opener);
    expect(page.hasAttribute("inert")).toBe(true);

    closeDialog(overlay);

    expect(page.hasAttribute("inert")).toBe(false);
    expect(document.activeElement).toBe(opener);
  });

  it("não substitui o acionador original quando o mesmo diálogo é aberto duas vezes", () => {
    const firstOpener = document.createElement("button");
    const secondOpener = document.createElement("button");
    const overlay = document.createElement("section");
    document.body.append(firstOpener, secondOpener, overlay);

    openDialog(overlay, null, firstOpener);
    openDialog(overlay, null, secondOpener);
    closeDialog(overlay);

    expect(document.activeElement).toBe(firstOpener);
  });

  it("ignora tentativas de foco em elementos desconectados ou diálogos fechados", () => {
    const dialog = document.createElement("section");
    const detachedTarget = document.createElement("button");
    const outside = document.createElement("button");
    document.body.append(dialog, outside);
    outside.focus();

    focusWhenVisible(detachedTarget, dialog);
    focusWhenVisible(outside, dialog, 0, () => false);

    expect(document.activeElement).toBe(outside);
  });

  it("permite fechar um diálogo que não foi registrado sem alterar a página", () => {
    const page = document.createElement("main");
    const overlay = document.createElement("section");
    document.body.append(page, overlay);

    expect(() => closeDialog(overlay)).not.toThrow();
    expect(page.hasAttribute("inert")).toBe(false);
  });
});
