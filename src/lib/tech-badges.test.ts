import { describe, expect, it } from "vitest";
import { TECH_LABELS, type TechId } from "./project-schema";
import { techBadge } from "./tech-badges";

describe("techBadge", () => {
  it.each(Object.keys(TECH_LABELS) as TechId[])(
    "%s tem badge com caminho e largura válidos",
    (id) => {
      const badge = techBadge(id);
      expect(badge.alt).toBe(TECH_LABELS[id]);
      expect(badge.src).toMatch(/^\/badges\/[a-z0-9-]+\.svg$/);
      expect(badge.width).toBeGreaterThan(0);
    },
  );
});
