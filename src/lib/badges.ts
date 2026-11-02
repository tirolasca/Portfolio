/**
 * Badges de tecnologias gerados no BUILD (sem requisições ao shields.io).
 * Usa o mesmo gerador do shields.io (`badge-maker`, estilo "for-the-badge") e os ícones
 * do `simple-icons`. Logos que não existem mais no simple-icons usam um ícone do Font Awesome.
 */
import { readFileSync } from "node:fs";
import { makeBadge } from "badge-maker";
import * as simpleIcons from "simple-icons";
import type { SkillBadge } from "../data/skills";

const FA = "node_modules/@fortawesome/fontawesome-free/svgs";

/** logo pedido → ícone do Font Awesome (marcas removidas do simple-icons) */
const FA_FALLBACK: Record<string, string> = {
  "c-sharp": "solid/hashtag",
  "microsoft-sql-server": "solid/database",
  amazonaws: "brands/aws",
  aiven: "solid/cloud",
  windows: "brands/windows",
  visualstudiocode: "brands/visual-studio",
  openai: "brands/openai",
};

const bySlug = new Map<string, string>();
for (const icon of Object.values(simpleIcons)) {
  if (icon && typeof icon === "object" && "slug" in icon && "path" in icon)
    bySlug.set(String(icon.slug), String(icon.path));
}

const COLORS: Record<string, string> = { white: "#ffffff", black: "#000000" };

function logoSvg(slug: string, logoColor = "white"): string | undefined {
  const color = COLORS[logoColor] ?? `#${logoColor.replace(/^#/, "")}`;
  let viewBox = "0 0 24 24";
  let d = bySlug.get(slug);
  if (!d && FA_FALLBACK[slug]) {
    const svg = readFileSync(`${FA}/${FA_FALLBACK[slug]}.svg`, "utf8");
    viewBox = svg.match(/viewBox="([^"]+)"/)?.[1] ?? viewBox;
    d = svg.match(/<path[^>]* d="([^"]+)"/)?.[1];
  }
  if (!d) return undefined;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><path fill="${color}" d="${d}"/></svg>`;
}

/** "Spring Boot" → "spring-boot" (nome do arquivo em /badges/) */
export function badgeSlug(alt: string) {
  return alt
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function renderBadge(b: SkillBadge) {
  const logo = b.logo ? logoSvg(b.logo, b.logoColor) : undefined;
  const svg = makeBadge({
    message: b.label ?? b.alt,
    color: b.color.match(/^[0-9a-f]{3,8}$/i) ? `#${b.color}` : b.color,
    style: "for-the-badge",
    ...(logo
      ? {
          logoBase64: `data:image/svg+xml;base64,${Buffer.from(logo).toString("base64")}`,
        }
      : {}),
  });
  const width = Math.ceil(
    Number(svg.match(/<svg[^>]*\swidth="([\d.]+)"/)?.[1] ?? 0),
  );
  return { svg, width, hasLogo: Boolean(logo) };
}
