/**
 * Validação em tempo de execução das respostas da API pública do GitHub.
 * Só os campos que o site usa são conferidos; qualquer outra coisa é ignorada.
 */

export interface GithubUser {
  avatarUrl: string;
  bio: string | null;
  location: string | null;
  /** ano de criação da conta */
  joinedYear: number | null;
  publicRepos: number;
  followers: number;
  following: number;
}

/** Host permitido para o avatar (é o mesmo da `img-src` da CSP). */
const AVATAR_HOST = "avatars.githubusercontent.com";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const count = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : null;

const text = (value: unknown): string | null =>
  typeof value === "string" && value.trim() !== "" ? value : null;

/** Só aceita avatar https do domínio do GitHub (evita imagem de origem inesperada). */
function safeAvatar(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === AVATAR_HOST
      ? url.href
      : null;
  } catch {
    return null;
  }
}

function parseDate(value: unknown): Date | null {
  if (typeof value !== "string") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Valida `GET /users/{user}`. Devolve `null` se faltar algum campo essencial. */
export function parseGithubUser(data: unknown): GithubUser | null {
  if (!isRecord(data)) return null;
  const avatarUrl = safeAvatar(data["avatar_url"]);
  const publicRepos = count(data["public_repos"]);
  const followers = count(data["followers"]);
  const following = count(data["following"]);
  if (
    avatarUrl === null ||
    publicRepos === null ||
    followers === null ||
    following === null
  ) {
    return null;
  }
  return {
    avatarUrl,
    bio: text(data["bio"]),
    location: text(data["location"]),
    joinedYear: parseDate(data["created_at"])?.getFullYear() ?? null,
    publicRepos,
    followers,
    following,
  };
}

/** Valida `GET /users/{user}/events/public` e devolve a data do evento mais recente. */
export function parseLatestEventDate(data: unknown): Date | null {
  if (!Array.isArray(data)) return null;
  const first: unknown = data[0];
  return isRecord(first) ? parseDate(first["created_at"]) : null;
}
