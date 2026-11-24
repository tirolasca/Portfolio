import { describe, expect, it } from "vitest";
import { SUMMARY_SKILLS, pickSummarySkills } from "./summary-mode";

const badge = (alt: string) => {
  const img = document.createElement("img");
  img.alt = alt;
  img.src = `https://exemplo.dev/badges/${alt}.svg`;
  return img;
};

describe("pickSummarySkills", () => {
  it("usa as 10 skills definidas, na ordem pedida", () => {
    expect(SUMMARY_SKILLS).toEqual([
      "React",
      "CSS3",
      "Astro",
      "TypeScript",
      "Python",
      "JavaScript",
      "Java",
      "PostgreSQL",
      "Node.js",
      "Spring Boot",
    ]);
  });

  it("ignora a ordem do DOM e outras skills", () => {
    const dom = ["Docker", ...[...SUMMARY_SKILLS].reverse(), "Vite"].map(badge);
    expect(pickSummarySkills(dom).map((s) => s.name)).toEqual([
      ...SUMMARY_SKILLS,
    ]);
  });

  it("pula skill ausente e usa só o primeiro badge repetido", () => {
    const first = badge("React");
    const dom = [first, badge("React"), badge("Astro")];
    const result = pickSummarySkills(dom);
    expect(result.map((s) => s.name)).toEqual(["React", "Astro"]);
    expect(result[0]?.image).toBe(first.src);
  });
});
