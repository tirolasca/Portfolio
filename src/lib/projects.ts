import { getCollection, type CollectionEntry } from "astro:content";
import { plainText } from "./plain-text";

export { plainText };

export type Project = CollectionEntry<"projects">;

/** Projetos na ordem definida pelo campo `order`. */
export async function getProjects(): Promise<Project[]> {
  const entries = await getCollection("projects");
  return entries.sort((a, b) => a.data.order - b.data.order);
}

/** Link da página de estudo de caso. */
export const projectHref = (id: string): string => `/projetos/${id}.html`;
