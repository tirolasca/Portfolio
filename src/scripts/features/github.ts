import { closeDialog, openDialog } from "../core/dialog";
import { fetchJson } from "../core/http";
import { parseGithubUser, parseLatestEventDate } from "../core/github-schema";
import { prefersReducedMotion } from "../state";
import { must } from "../utils";

export async function initGithubActivity() {
  const pill = document.getElementById("gh-activity-pill");
  const text = document.getElementById("gh-activity-text");
  if (!pill || !text) return;
  try {
    const last = parseLatestEventDate(
      await fetchJson("https://api.github.com/users/tirolasca/events/public"),
    );
    if (!last) {
      pill.style.display = "none";
      return;
    }
    const days = Math.floor((Date.now() - last.getTime()) / 86400000);
    let label: string;
    if (days <= 0) label = "hoje";
    else if (days === 1) label = "ontem";
    else label = `há ${days} dias`;
    text.textContent = `Ativo no GitHub — última atividade ${label}`;
    pill.classList.add("loaded");
  } catch {
    pill.style.display = "none";
  }
}

export function initGithubModal() {
  const githubLinks = document.querySelectorAll<HTMLElement>(
    'a[href="https://github.com/tirolasca"],a[href="https://github.com/tirolasca/"]',
  );
  const ghModalEl = document.getElementById("github-modal");
  const closeGh = document.getElementById("close-gh-modal");
  if (!ghModalEl) return;
  const ghModal: HTMLElement = ghModalEl;
  let fetched = false;

  function animateVal(id: string, end: number, dur = 1500) {
    const el = document.getElementById(id);
    if (!el) return;
    // movimento reduzido: valor final direto, sem contagem
    if (prefersReducedMotion) {
      el.textContent = String(end);
      return;
    }
    let start: number | null = null;
    const step = (ts: number): void => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      el.textContent = String(Math.floor(p * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  async function fetchGH() {
    if (fetched) return;
    ghModal.classList.add("gh-loading");
    try {
      const user = parseGithubUser(
        await fetchJson("https://api.github.com/users/tirolasca"),
      );
      if (!user) throw new Error("Resposta inesperada da API do GitHub");
      must<HTMLImageElement>("gh-avatar").src = user.avatarUrl;
      must("gh-bio").innerText = user.bio ?? "Desenvolvedor Full Stack & Redes";
      if (user.location) {
        must("gh-location").innerText = user.location;
        must("gh-location-container").style.display = "flex";
      }
      if (user.joinedYear !== null) {
        must("gh-joined").innerText = `Membro desde ${user.joinedYear}`;
        must("gh-joined-container").style.display = "flex";
      }
      animateVal("gh-repos", user.publicRepos);
      animateVal("gh-followers", user.followers);
      animateVal("gh-following", user.following);
      fetched = true;
    } catch {
      must("gh-bio").innerText = "Sistema offline.";
      ["gh-repos", "gh-followers", "gh-following"].forEach(
        (id) => (must(id).innerText = "0"),
      );
    } finally {
      ghModal.classList.remove("gh-loading");
    }
  }

  function closeGhModal() {
    ghModal.classList.remove("active");
    closeDialog(ghModal);
  }

  githubLinks.forEach((link) =>
    link.addEventListener("click", (e) => {
      if (link.classList.contains("gh-btn")) return;
      e.preventDefault();
      ghModal.classList.add("active");
      openDialog(ghModal, closeGh, link);
      fetchGH();
    }),
  );
  if (closeGh) closeGh.addEventListener("click", closeGhModal);
  if (ghModal)
    ghModal.addEventListener("click", (e) => {
      if (e.target === ghModal) closeGhModal();
    });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && ghModal?.classList.contains("active"))
      closeGhModal();
  });
}
