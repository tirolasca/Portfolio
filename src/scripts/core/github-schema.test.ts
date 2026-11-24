import { describe, expect, it } from "vitest";
import { parseGithubUser, parseLatestEventDate } from "./github-schema";

const valid = {
  avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
  bio: "dev",
  location: "Brasil",
  created_at: "2021-06-15T12:00:00Z",
  public_repos: 12,
  followers: 3,
  following: 4,
};

describe("parseGithubUser", () => {
  it("aceita uma resposta válida e normaliza os campos", () => {
    expect(parseGithubUser(valid)).toEqual({
      avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
      bio: "dev",
      location: "Brasil",
      joinedYear: 2021,
      publicRepos: 12,
      followers: 3,
      following: 4,
    });
  });

  it("trata bio, localização e data ausentes como null", () => {
    const user = parseGithubUser({
      ...valid,
      bio: null,
      location: "",
      created_at: undefined,
    });
    expect(user).toMatchObject({ bio: null, location: null, joinedYear: null });
  });

  it.each([null, undefined, 42, "x", [], [valid]])(
    "rejeita um corpo que não é objeto (%j)",
    (body) => {
      expect(parseGithubUser(body)).toBeNull();
    },
  );

  it.each(["public_repos", "followers", "following"])(
    "rejeita quando %s não é um número válido",
    (field) => {
      expect(parseGithubUser({ ...valid, [field]: "10" })).toBeNull();
      expect(parseGithubUser({ ...valid, [field]: -1 })).toBeNull();
      expect(parseGithubUser({ ...valid, [field]: Number.NaN })).toBeNull();
    },
  );

  it("rejeita avatar fora do domínio do GitHub ou sem https", () => {
    for (const avatar_url of [
      "https://evil.example/a.png",
      "http://avatars.githubusercontent.com/u/1",
      "javascript:alert(1)",
      "não é url",
      42,
    ]) {
      expect(parseGithubUser({ ...valid, avatar_url })).toBeNull();
    }
  });
});

describe("parseLatestEventDate", () => {
  it("devolve a data do primeiro evento", () => {
    const date = parseLatestEventDate([
      { created_at: "2026-11-20T10:00:00Z" },
      { created_at: "2020-01-01T00:00:00Z" },
    ]);
    expect(date?.toISOString()).toBe("2026-11-20T10:00:00.000Z");
  });

  it.each([
    [],
    {},
    null,
    [null],
    [{}],
    [{ created_at: "ontem" }],
    [{ created_at: 5 }],
  ])("devolve null para %j", (body) => {
    expect(parseLatestEventDate(body)).toBeNull();
  });
});
