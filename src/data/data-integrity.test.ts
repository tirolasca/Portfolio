import { describe, expect, it } from "vitest";
import { projects } from "./projects";
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

describe("projects", () => {
  it("não repete títulos", () => {
    const titles = projects.map((p) => p.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it.each(projects.map((p) => [p.title, p] as const))(
    "%s tem links https e ao menos uma tecnologia",
    (_title, p) => {
      expect(isHttps(p.demo), p.demo).toBe(true);
      expect(isHttps(p.repo), p.repo).toBe(true);
      expect(p.tech.length).toBeGreaterThan(0);
      expect(p.imageAlt.length).toBeGreaterThan(0);
    },
  );
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
