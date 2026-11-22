import type { APIRoute, GetStaticPaths } from "astro";
import { badgeSlug, renderBadge } from "../../lib/badges";
import { skillCategories } from "../../data/skills";

export const getStaticPaths = (() => {
  const seen = new Set<string>();
  return skillCategories
    .flatMap((c) => c.badges)
    .map((b) => {
      const slug = badgeSlug(b.alt);
      if (seen.has(slug))
        throw new Error(`Badge duplicado: "${b.alt}" (${slug})`);
      seen.add(slug);
      return { params: { slug }, props: { svg: renderBadge(b).svg } };
    });
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(props.svg as string, {
    headers: { "Content-Type": "image/svg+xml" },
  });
