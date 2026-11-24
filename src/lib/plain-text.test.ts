import { describe, expect, it } from "vitest";
import { plainText } from "./plain-text";

describe("plainText", () => {
  it("extrai texto de HTML inline", () => {
    expect(plainText("Olá <strong>mundo</strong>!")).toBe("Olá mundo!");
  });

  it("ignora conteúdo de script", () => {
    expect(plainText("Olá<script>alert(1)</script> mundo")).toBe("Olá mundo");
  });

  it("ignora conteúdo de style", () => {
    expect(plainText("Olá<style>.x{color:red}</style> mundo")).toBe(
      "Olá mundo",
    );
  });

  it("lida com atributos contendo sinais de maior e menor", () => {
    expect(plainText('<a title="1 > 0">link</a>')).toBe("link");
  });

  it("decodifica entidades HTML", () => {
    expect(plainText("A &amp; B")).toBe("A & B");
  });

  it("lida com HTML incompleto", () => {
    expect(plainText("texto <script>alert(1")).toBe("texto");
  });

  it("normaliza espaços", () => {
    expect(plainText("  um   <strong>dois</strong>  ")).toBe("um dois");
  });

  it("lida com entradas vazias", () => {
    expect(plainText("")).toBe("");
  });
});
