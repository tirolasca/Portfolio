import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { projectSchema } from "./lib/project-schema";

/**
 * Um arquivo .md por projeto em src/content/projects/. O frontmatter segue o
 * schema de `lib/project-schema.ts`; o corpo em Markdown é opcional e, quando
 * existe, aparece na página de estudo de caso (/projetos/<slug>.html).
 */
const projects = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/projects" }),
  schema: ({ image }) => projectSchema(image),
});

export const collections = { projects };
