import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { z } from "astro/zod";
import { parse as parseYaml } from "yaml";
import { projectSchema } from "../lib/project-schema";
import { SITE } from "./site";
import { skillCategories } from "./skills";
import {
  ALL_ACHIEVEMENTS,
  LOCKED_HINTS,
  MAX_XP,
} from "../scripts/data/achievements";
import { homeTourSteps, resumeTourSteps } from "../scripts/data/tour-steps";

const isHttps = (url: string) => new URL(url).protocol === "https:";

describe("SITE", () => {
  it("usa URLs https válidas", () => {
    for (const url of [SITE.url, SITE.github, SITE.linkedin]) {
      expect(isHttps(url), url).toBe(true);
    }
  });

  it("tem e-mail em formato válido", () => {
    expect(SITE.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  });
});

const PROJECTS_DIR = resolve("src/content/projects");

/** Lê o frontmatter de cada projeto e valida com o mesmo schema usado no build. */
const projects = readdirSync(PROJECTS_DIR)
  .filter((file) => file.endsWith(".md"))
  .map((file) => {
    const raw = readFileSync(join(PROJECTS_DIR, file), "utf8");
    const frontmatter = /^---\n([\s\S]*?)\n---/.exec(raw)?.[1] ?? "";
    const schema = projectSchema(() => z.string());
    return {
      slug: file.replace(/\.md$/, ""),
      result: schema.safeParse(parseYaml(frontmatter)),
    };
  });

describe("projects", () => {
  it("há ao menos um projeto", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it.each(projects.map((p) => [p.slug, p] as const))(
    "%s segue o schema da coleção",
    (_slug, p) => {
      expect(p.result.error?.issues ?? []).toEqual([]);
    },
  );

  it("slugs em kebab-case, sem repetição", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("títulos e posições (order) não se repetem e formam 1..N", () => {
    const data = projects.flatMap((p) =>
      p.result.data ? [p.result.data] : [],
    );
    const titles = data.map((d) => d.title);
    expect(new Set(titles).size).toBe(titles.length);
    expect(data.map((d) => d.order).sort((a, b) => a - b)).toEqual(
      data.map((_, i) => i + 1),
    );
  });
});

describe("skills", () => {
  it("toda categoria tem título e badges", () => {
    for (const c of skillCategories) {
      expect(c.title.length).toBeGreaterThan(0);
      expect(c.badges.length).toBeGreaterThan(0);
    }
  });

  it("não repete badge dentro da mesma categoria", () => {
    for (const c of skillCategories) {
      const alts = c.badges.map((b) => b.alt);
      expect(new Set(alts).size, c.title).toBe(alts.length);
    }
  });

  it("cores são hex sem # ou nome", () => {
    for (const c of skillCategories) {
      for (const b of c.badges) {
        expect(b.color, b.alt).not.toMatch(/^#/);
      }
    }
  });
});

describe("conquistas", () => {
  it("ids são únicos", () => {
    const ids = ALL_ACHIEVEMENTS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("MAX_XP é a soma do XP de todas", () => {
    expect(MAX_XP).toBe(ALL_ACHIEVEMENTS.reduce((s, a) => s + a.xp, 0));
    expect(MAX_XP).toBeGreaterThan(0);
  });

  it("conquista visível tem seletor; secreta não precisa", () => {
    for (const a of ALL_ACHIEVEMENTS) {
      if (!a.secret) expect(a.selector, a.id).toBeTruthy();
    }
  });

  it("toda conquista tem uma dica de bloqueada, e só elas", () => {
    const ids = ALL_ACHIEVEMENTS.map((a) => a.id).sort();
    expect(Object.keys(LOCKED_HINTS).sort()).toEqual(ids);
  });
});

describe("tour guiado", () => {
  it.each([
    ["home", homeTourSteps],
    ["currículo", resumeTourSteps],
  ])("passos do tour (%s) estão completos", (_name, steps) => {
    expect(steps.length).toBeGreaterThan(0);
    for (const s of steps) {
      expect(s.selector).toBeTruthy();
      expect(s.title).toBeTruthy();
      expect(s.text).toBeTruthy();
    }
  });
});
