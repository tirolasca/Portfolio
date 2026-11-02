/**
 * Gera um subconjunto do Font Awesome com SÓ os ícones usados no código.
 *   - varre src/ atrás de classes `fa-*`
 *   - escreve src/styles/vendor/fontawesome-subset.css
 *   - escreve src/assets/fonts/fa-{solid,brands}-subset.woff2
 * Rodado automaticamente antes de `dev` e `build` (veja package.json).
 * Para usar um ícone novo basta escrever a classe no código (ex.: "fa-solid fa-rocket").
 */
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  statSync,
} from "node:fs";
import { join, extname } from "node:path";
import subsetFont from "subset-font";

const FA = "node_modules/@fortawesome/fontawesome-free";
const OUT_CSS = "src/styles/vendor/fontawesome-subset.css";
const OUT_FONTS = "src/assets/fonts";

// ---------- 1. classes usadas no código ----------
function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (p.endsWith("vendor")) continue; // ignora o próprio CSS gerado
      walk(p, files);
    } else if ([".astro", ".ts", ".css", ".html", ".md"].includes(extname(p)))
      files.push(p);
  }
  return files;
}
const used = new Set();
for (const f of walk("src")) {
  for (const m of readFileSync(f, "utf8").matchAll(/(?<![\w-])fa-[a-z0-9-]+/g))
    used.add(m[0]);
}

// ---------- 2. parse do CSS do FA em blocos de topo ----------
const css = readFileSync(`${FA}/css/all.css`, "utf8").replace(
  /\/\*[\s\S]*?\*\//g,
  "",
);
const blocks = [];
{
  let depth = 0,
    start = 0;
  for (let i = 0; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}") {
      depth--;
      if (depth === 0) {
        blocks.push(css.slice(start, i + 1).trim());
        start = i + 1;
      }
    }
  }
}
const brandsCss = readFileSync(`${FA}/css/brands.css`, "utf8");
const brandNames = new Set(
  [...brandsCss.matchAll(/\.(fa-[a-z0-9-]+)\s*\{\s*--fa:/g)].map((m) => m[1]),
);

/** Lê `--fa: "\\f09b"` (hex) ou `--fa: "\\?"` (caractere literal) e devolve o codepoint. */
function parseCodepoint(body) {
  const m = body.match(/--fa:\s*"((?:\\[0-9a-fA-F]{1,6}\s?|\\.|[^"\\])+)"/);
  if (!m) return undefined;
  const hex = m[1].match(/^\\([0-9a-fA-F]{1,6})\s?$/);
  if (hex) return parseInt(hex[1], 16);
  const lit = m[1].replace(/^\\/, "");
  return lit.codePointAt(0);
}

const BASE = new Set([
  ".fa",
  ".fas",
  ".far",
  ".fab",
  ".fa-solid",
  ".fa-regular",
  ".fa-brands",
  ".fa-classic",
]);
const selOf = (b) => b.slice(0, b.indexOf("{")).trim();
const bodyOf = (b) => b.slice(b.indexOf("{") + 1, b.lastIndexOf("}"));
const classes = (sel) =>
  [...sel.matchAll(/\.(fa-[a-z0-9-]+|fa|fas|far|fab)\b/g)].map(
    (m) => "." + m[1],
  );

const kept = [];
const rootBlocks = [];
const icons = new Map(); // nome -> codepoint
const keyframes = new Map();
const wantedKeyframes = new Set();
for (const b of blocks) {
  if (b.startsWith("@font-face")) continue;
  if (b.startsWith(":root") || b.startsWith(":host")) {
    rootBlocks.push(b); // variáveis de família (--fa-family-brands etc.)
    continue;
  }
  if (b.startsWith("@keyframes")) {
    keyframes.set(b.match(/@keyframes\s+([\w-]+)/)[1], b);
    continue;
  }
  const sel = selOf(b);
  if (sel.startsWith("@")) {
    // @supports / @media: mantém se mexer em algo usado ou base
    const cs = classes(b);
    if (cs.length && cs.every((c) => BASE.has(c) || used.has(c.slice(1))))
      kept.push(b);
    continue;
  }
  const selectors = sel.split(",").map((s) => s.trim());
  const isIcon =
    /--fa:\s*"/.test(bodyOf(b)) &&
    selectors.every((s) => /^\.fa-[a-z0-9-]+$/.test(s));
  if (isIcon) {
    const hit = selectors.filter((s) => used.has(s.slice(1)));
    if (!hit.length) continue;
    const cp = parseCodepoint(bodyOf(b));
    if (cp === undefined) {
      console.warn("sem codepoint:", hit.join(","));
      continue;
    }
    hit.forEach((s) => icons.set(s.slice(1), cp));
    kept.push(`${hit.join(",\n")} {${bodyOf(b)}}`);
    continue;
  }
  const cs = classes(sel);
  if (cs.every((c) => BASE.has(c)) || cs.some((c) => used.has(c.slice(1)))) {
    kept.push(b);
    for (const m of bodyOf(b).matchAll(/animation(?:-name)?:\s*([\w-]+)/g))
      wantedKeyframes.add(m[1]);
  }
}
for (const k of wantedKeyframes)
  if (keyframes.has(k)) kept.push(keyframes.get(k));

// ---------- 3. valida: toda classe de ícone usada existe? ----------
const knownNonIcons = new Set([
  "fa-solid",
  "fa-regular",
  "fa-brands",
  "fa-classic",
]);
const unknown = [...used].filter(
  (u) =>
    !icons.has(u) &&
    !knownNonIcons.has(u) &&
    !u.endsWith("-subset") && // nome de arquivo, não classe
    !kept.some((b) => selOf(b).includes("." + u)),
);
if (unknown.length)
  console.warn(
    "⚠ classes fa-* sem regra no Font Awesome (typo ou classe própria?):",
    unknown.join(", "),
  );

// ---------- 4. subconjunto das fontes ----------
mkdirSync(OUT_FONTS, { recursive: true });
const groups = { brands: [], solid: [] };
for (const [name, cp] of icons)
  (brandNames.has(name) ? groups.brands : groups.solid).push(cp);
const fonts = {
  solid: {
    file: "fa-solid-900.woff2",
    family: "Font Awesome 7 Free",
    weight: 900,
  },
  brands: {
    file: "fa-brands-400.woff2",
    family: "Font Awesome 7 Brands",
    weight: 400,
  },
};
let faces = "";
const sizes = {};
for (const [key, cps] of Object.entries(groups)) {
  if (!cps.length) continue;
  const input = readFileSync(`${FA}/webfonts/${fonts[key].file}`);
  const text = String.fromCodePoint(...cps);
  const out = await subsetFont(input, text, { targetFormat: "woff2" });
  const name = `fa-${key}-subset.woff2`;
  writeFileSync(`${OUT_FONTS}/${name}`, out);
  sizes[key] = out.length;
  faces += `@font-face {\n  font-family: "${fonts[key].family}";\n  font-style: normal;\n  font-weight: ${fonts[key].weight};\n  font-display: block;\n  src: url("../../assets/fonts/${name}") format("woff2");\n}\n\n`;
}

// ---------- 5. escreve o CSS ----------
const header = `/* GERADO por scripts/fa-subset.mjs — NÃO EDITE. Rode \`npm run icons\`.\n   Font Awesome Free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT) — https://fontawesome.com/license/free */\n`;
mkdirSync("src/styles/vendor", { recursive: true });
writeFileSync(
  OUT_CSS,
  header + rootBlocks.join("\n\n") + "\n\n" + faces + kept.join("\n\n") + "\n",
);
console.log(
  `fontawesome: ${icons.size} ícones (solid ${groups.solid.length}, brands ${groups.brands.length}) | fontes: ${Object.entries(
    sizes,
  )
    .map(([k, v]) => `${k} ${(v / 1024).toFixed(1)} KB`)
    .join(", ")} | css ${(statSync(OUT_CSS).size / 1024).toFixed(1)} KB`,
);
