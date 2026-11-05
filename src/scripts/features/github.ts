import { closeDialog, openDialog } from "../core/dialog";
import { prefersReducedMotion } from "../state";
import { must } from "../utils";

export async function initGithubActivity() {
  const pill = document.getElementById("gh-activity-pill");
  const text = document.getElementById("gh-activity-text");
  if (!pill || !text) return;
  try {
    const r = await fetch(
      "https://api.github.com/users/tirolasca/events/public",
    );
    if (!r.ok) throw new Error("fail");
    const events = await r.json();
    if (!Array.isArray(events) || !events.length) {
      pill.style.display = "none";
      return;
    }
    const last = new Date(events[0].created_at);
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
      el.innerHTML = String(Math.floor(p * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  async function fetchGH() {
    if (fetched) return;
    ghModal.classList.add("gh-loading");
    try {
      const r = await fetch("https://api.github.com/users/tirolasca");
      if (!r.ok) throw new Error("GitHub request failed");
      const d = await r.json();
      must<HTMLImageElement>("gh-avatar").src = d.avatar_url;
      must("gh-bio").innerText = d.bio || "Desenvolvedor Full Stack & Redes";
      if (d.location) {
        must("gh-location").innerText = d.location;
        must("gh-location-container").style.display = "flex";
      }
      if (d.created_at) {
        must("gh-joined").innerText =
          `Membro desde ${new Date(d.created_at).getFullYear()}`;
        must("gh-joined-container").style.display = "flex";
      }
      animateVal("gh-repos", d.public_repos);
      animateVal("gh-followers", d.followers);
      animateVal("gh-following", d.following);
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
