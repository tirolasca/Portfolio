import { expect, test } from "@playwright/test";
import { prepare } from "./helpers";

test("formulário de contato: validação, foco, rascunho e sucesso honesto", async ({
  page,
}) => {
  await prepare(page);
  await page.goto("/");
  const trigger = page.locator(".contact-btn.email");
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();

  // foco no primeiro campo e fundo inerte
  await expect(page.locator("#em-name")).toBeFocused();
  await expect(page.locator("body > [inert]").first()).toBeAttached();

  // vazio → 3 campos inválidos, foco no primeiro
  await page.locator("#em-send").click();
  await expect(page.locator("[aria-invalid=true]")).toHaveCount(3);
  await expect(page.locator("#em-name")).toBeFocused();

  // mensagens específicas
  await page.locator("#em-name").fill("Ana");
  await page.locator("#em-email").fill("isso-nao-e-email");
  await page.locator("#em-message").fill("oi");
  await page.locator("#em-send").click();
  await expect(page.locator("#em-email-error")).toContainText("e-mail válido");
  await expect(page.locator("#em-message-error")).toContainText(
    "10 caracteres",
  );

  // Esc fecha, devolve o foco e remove o inert
  await page.keyboard.press("Escape");
  await expect(page.locator("#email-modal-overlay")).not.toHaveClass(/active/);
  await expect(trigger).toBeFocused();
  await expect(page.locator("body > [inert]")).toHaveCount(0);

  // rascunho restaurado ao reabrir (espera a transição de saída terminar de verdade)
  await expect(page.locator("#email-modal-overlay")).toBeHidden();
  await trigger.click();
  await expect(page.locator("#em-name")).toHaveValue("Ana");

  // sucesso (mailto): mensagem honesta + opção de copiar
  await page.locator("#em-email").fill("ana@exemplo.com");
  await page
    .locator("#em-message")
    .fill("Olá Lucas, gostei muito do portfólio!");
  await page.locator("#em-send").click();
  const success = page.locator("#email-success");
  await expect(success).toHaveClass(/show/);
  await expect(success).toContainText("app de e-mail");
  await expect(success.locator("[data-copy]")).toBeVisible();
});
