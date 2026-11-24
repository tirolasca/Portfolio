import { skillCategories, type SkillBadge } from "../data/skills";
import { badgeSlug, renderBadge } from "./badges";
import { TECH_LABELS, type TechId } from "./project-schema";

const byAlt = new Map<string, SkillBadge>(
  skillCategories.flatMap((c) => c.badges).map((b) => [b.alt, b]),
);

export interface TechBadge {
  alt: string;
  src: string;
  width: number;
}

/**
 * Badge (o mesmo SVG gerado no build para a seção de habilidades) de uma
 * tecnologia de projeto. O nome em `TECH_LABELS` precisa existir em
 * `skills.ts`: se faltar, o build falha em vez de mostrar badge quebrado.
 */
export function techBadge(id: TechId): TechBadge {
  const alt = TECH_LABELS[id];
  const badge = byAlt.get(alt);
  if (!badge) {
    throw new Error(
      `Tecnologia "${alt}" (${id}) não tem badge em src/data/skills.ts`,
    );
  }
  return {
    alt,
    src: `/badges/${badgeSlug(alt)}.svg`,
    width: renderBadge(badge).width,
  };
}
