import { parseFragment } from "parse5";

interface HtmlNode {
  nodeName: string;
  tagName?: string;
  value?: string;
  childNodes?: HtmlNode[];
}

/**
 * Extrai texto de um fragmento HTML.
 * Ignora o conteúdo de script e style.
 * O resultado é texto puro, não HTML sanitizado.
 */
export function plainText(html: string): string {
  const fragment = parseFragment(html) as unknown as HtmlNode;
  const parts: string[] = [];

  function walk(node: HtmlNode): void {
    if (node.tagName === "script" || node.tagName === "style") {
      return;
    }

    if (node.nodeName === "#text") {
      parts.push(node.value ?? "");
      return;
    }

    for (const child of node.childNodes ?? []) {
      walk(child);
    }
  }

  walk(fragment);

  return parts.join("").replace(/\s+/g, " ").trim();
}
