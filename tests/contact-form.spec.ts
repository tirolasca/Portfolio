import { expect, test } from "@playwright/test";
import { prepare } from "./helpers";

test("formulário de contato: validação, foco, rascunho e sucesso honesto", async ({
  page,
}) => {
  await prepare(page);
  await page.goto("/");

  const trigger = page.locator(".contact-btn.email");
  const overlay = page.locator("#email-modal-overlay");

  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();

  // Modal aberto: foco no primeiro campo e fundo inerte.
  await expect(overlay).toHaveClass(/active/);
  await expect(overlay).toHaveAttribute("aria-hidden", "false");
  await expect(page.locator("#em-name")).toBeFocused();
  await expect(page.locator("body > [inert]").first()).toBeAttached();

  // Formulário vazio: três campos inválidos e foco no primeiro.
  await page.locator("#em-send").click();

  await expect(page.locator("[aria-invalid=true]")).toHaveCount(3);
  await expect(page.locator("#em-name")).toBeFocused();

  // Validação de mensagens específicas.
  await page.locator("#em-name").fill("Ana");
  await page.locator("#em-email").fill("isso-nao-e-email");
  await page.locator("#em-message").fill("oi");
  await page.locator("#em-send").click();

  await expect(page.locator("#em-email-error")).toContainText("e-mail válido");

  await expect(page.locator("#em-message-error")).toContainText(
    "10 caracteres",
  );

  // Escape fecha o modal.
  await page.keyboard.press("Escape");

  await expect(overlay).not.toHaveClass(/active/);
  await expect(overlay).toHaveAttribute("aria-hidden", "true");

  // Aguarda o modal terminar de fechar antes de verificar o foco.
  await expect(overlay).toBeHidden();

  // O foco deve retornar ao botão que abriu o modal.
  await expect(trigger).toBeFocused();

  // O fundo deve deixar de ser inerte.
  await expect(page.locator("body > [inert]")).toHaveCount(0);

  // Reabre o modal e verifica a restauração do rascunho.
  await trigger.click();

  await expect(overlay).toHaveClass(/active/);
  await expect(overlay).toHaveAttribute("aria-hidden", "false");
  await expect(page.locator("#em-name")).toHaveValue("Ana");

  // Preenche os dados válidos.
  await page.locator("#em-email").fill("ana@exemplo.com");

  await page
    .locator("#em-message")
    .fill("Olá Lucas, gostei muito do portfólio!");

  // Envia e verifica a confirmação honesta via mailto.
  await page.locator("#em-send").click();

  const success = page.locator("#email-success");

  await expect(success).toHaveClass(/show/);
  await expect(success).toContainText("app de e-mail");
  await expect(success.locator("[data-copy]")).toBeVisible();
});
