import { z } from "astro/zod";
import { describe, expect, it } from "vitest";
import { TECH_LABELS, projectSchema } from "./project-schema";

const schema = projectSchema(() => z.string());

const valid = {
  title: "Exemplo",
  order: 1,
  icon: "fa-solid fa-code",
  subtitle: "Sub",
  subtitleIcon: "fa-solid fa-code",
  descriptionIcon: "fa-solid fa-code",
  description: "Texto com <strong>destaque</strong>",
  image: "../../assets/img/x.webp",
  imageAlt: "Alt",
  tech: ["react", "typescript"],
  demo: "https://exemplo.dev",
  repo: "https://github.com/x/y",
};

describe("projectSchema", () => {
  it("aceita um projeto válido e aplica os ícones padrão", () => {
    const parsed = schema.parse(valid);
    expect(parsed.demoIcon).toBe("fa-solid fa-up-right-from-square");
    expect(parsed.repoIcon).toBe("fa-brands fa-github");
    expect(parsed.credentials).toBeUndefined();
  });

  it("aceita contas de teste completas", () => {
    const parsed = schema.parse({
      ...valid,
      credentials: [{ label: "Admin", user: "a@b.c", password: "x" }],
    });
    expect(parsed.credentials).toHaveLength(1);
  });

  it.each([
    ["demo sem https", { demo: "http://exemplo.dev" }],
    ["repo que não é URL", { repo: "github.com/x/y" }],
    ["tecnologia desconhecida", { tech: ["cobol"] }],
    ["lista de tecnologias vazia", { tech: [] }],
    ["order zero", { order: 0 }],
    ["order fracionário", { order: 1.5 }],
    ["título vazio", { title: "" }],
    ["conta de teste incompleta", { credentials: [{ label: "A", user: "u" }] }],
  ])("rejeita %s", (_name, override) => {
    expect(schema.safeParse({ ...valid, ...override }).success).toBe(false);
  });

  it("rejeita campo obrigatório ausente", () => {
    const { imageAlt: _omit, ...withoutAlt } = valid;
    expect(schema.safeParse(withoutAlt).success).toBe(false);
  });
});

describe("TECH_LABELS", () => {
  it("todo identificador tem um nome exibível", () => {
    for (const [id, label] of Object.entries(TECH_LABELS)) {
      expect(label.length, id).toBeGreaterThan(0);
    }
  });
});
