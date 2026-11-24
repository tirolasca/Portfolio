import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"projects">;

/** Projetos na ordem definida pelo campo `order`. */
export async function getProjects(): Promise<Project[]> {
  const entries = await getCollection("projects");
  return entries.sort((a, b) => a.data.order - b.data.order);
}

/** Link da página de estudo de caso (o site usa `build.format: "file"`). */
export const projectHref = (id: string): string => `/projetos/${id}.html`;

/** Texto puro de uma descrição em HTML inline (para meta description). */
export const plainText = (html: string): string =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
