import { closeDialog, openDialog } from "../core/dialog";
import {
  ALL_ACHIEVEMENTS,
  LOCKED_HINTS,
  MAX_XP,
  type Achievement,
} from "../data/achievements";
import { unlockedAchievements } from "../state";

export function initAchievements() {
  ALL_ACHIEVEMENTS.forEach((ach) => {
    if (!ach.selector) return;
    const el = document.querySelector<HTMLElement>(ach.selector);
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !unlockedAchievements.has(ach.id)) {
            unlockedAchievements.add(ach.id);
            sessionStorage.setItem(
              "achievements",
              JSON.stringify([...unlockedAchievements]),
            );
            showAchievement(ach.icon, ach.title, ach.desc, ach.xp);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
  });
}

function getTotalXP() {
  return ALL_ACHIEVEMENTS.filter((a) => unlockedAchievements.has(a.id)).reduce(
    (s, a) => s + a.xp,
    0,
  );
}

function updateDrawerBadge() {
  const count = unlockedAchievements.size;
  const badge = document.getElementById("achievements-badge");
  if (badge) {
    badge.textContent = String(count);
    // o nome acessível precisa conter o texto visível (o número do selo)
    badge
      .closest("button")
      ?.setAttribute("aria-label", `Ver conquistas, ${count} desbloqueadas`);
    badge.classList.add("pop");
    setTimeout(() => badge.classList.remove("pop"), 400);
  }
}

function renderAchievementsGrid() {
  const grid = document.getElementById("achievements-grid");
  if (!grid) return;

  grid.innerHTML = ALL_ACHIEVEMENTS.map(renderAchievementCard).join("");

  grid
    .querySelectorAll<HTMLElement>(".achievement-card.locked")
    .forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.dataset.id ?? "";
        const ach = ALL_ACHIEVEMENTS.find((a) => a.id === id);
        if (!ach) return;
        const hint = LOCKED_HINTS[id] || "Continue explorando!";
        showHintToast(ach.secret ? `🔮 Segredo: ${hint}` : `💡 Dica: ${hint}`);
      });
    });
}

function renderAchievementCard(a: Achievement) {
  const unlocked = unlockedAchievements.has(a.id);
  const cls = [
    "achievement-card",
    unlocked ? "unlocked" : "locked",
    a.secret ? "secret" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const secretTag = getAchievementSecretTag(a, unlocked);
  const iconHtml = getAchievementIconHtml(a, unlocked);
  const tooltipText = getAchievementTooltipText(a, unlocked);
  const displayTitle = !unlocked && a.secret ? "???" : a.title;
  const displayDesc = unlocked
    ? a.desc
    : a.secret
      ? "Conquista oculta"
      : "Ainda não desbloqueada";
  const displayXP = unlocked
    ? `+${a.xp} XP`
    : a.secret
      ? "??? XP"
      : `${a.xp} XP`;

  return `
      <div class="${cls}" data-tooltip="${tooltipText}" data-id="${a.id}">
        <div class="achievement-card-icon">${iconHtml}</div>
        <div class="achievement-card-title">${displayTitle}</div>
        <div class="achievement-card-desc">${displayDesc}</div>
        <div class="achievement-card-xp">${displayXP}</div>
        ${secretTag}
      </div>`;
}

function getAchievementSecretTag(a: Achievement, unlocked: boolean) {
  if (!a.secret) return "";
  const secretLabel = unlocked ? "✦ Secreto" : "???";
  return `<span class="achievement-card-secret">${secretLabel}</span>`;
}

function getAchievementIconHtml(a: Achievement, unlocked: boolean) {
  if (unlocked) return `<i class="fa-solid ${a.icon}" aria-hidden="true"></i>`;
  if (a.secret)
    return `<i class="fa-solid fa-question" aria-hidden="true"></i>`;
  return `<i class="fa-solid ${a.icon}" style="opacity:0.35" aria-hidden="true"></i>`;
}

function getAchievementTooltipText(a: Achievement, unlocked: boolean) {
  const hint = LOCKED_HINTS[a.id] || "Continue explorando o portfólio!";
  if (unlocked) return `✓ Desbloqueada: ${a.desc}`;
  return a.secret ? `🔮 Segredo: ${hint}` : `💡 Dica: ${hint}`;
}

function refreshXPBar() {
  const xp = getTotalXP();
  const setText = (id: string, value: number) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(value);
  };
  setText("xp-current", xp);
  setText("xp-max", MAX_XP);
  setText("xp-unlocked-count", unlockedAchievements.size);
  setText("xp-total-count", ALL_ACHIEVEMENTS.length);
  const fill = document.getElementById("xp-fill");
  if (fill) fill.style.width = ((xp / MAX_XP) * 100).toFixed(1) + "%";
}

export function initAchievementsDrawer() {
  const overlayEl = document.querySelector<HTMLElement>(
    ".achievements-overlay",
  );
  const btnOpen = document.getElementById("achievements-toggle");
  const btnClose = overlayEl
    ? overlayEl.querySelector<HTMLElement>(".achievements-close")
    : null;

  if (!overlayEl || !btnOpen) return;
  const overlay: HTMLElement = overlayEl;

  function openDrawer() {
    renderAchievementsGrid();
    refreshXPBar();
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    openDialog(overlay, btnClose, btnOpen);
  }
  function closeDrawer() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    closeDialog(overlay);
  }

  btnOpen.addEventListener("click", openDrawer);
  btnClose?.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeDrawer();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeDrawer();
  });

  updateDrawerBadge();
}

export function showAchievement(
  icon: string,
  title: string,
  desc: string,
  xp: number,
) {
  updateDrawerBadge();
  const grid = document.getElementById("achievements-grid");
  if (grid?.children.length) {
    renderAchievementsGrid();
    refreshXPBar();
  }

  const toast = document.createElement("div");
  toast.className = "achievement-toast";
  toast.setAttribute("role", "status");
  toast.innerHTML = `
    <div class="achievement-icon"><i class="fa-solid ${icon}" aria-hidden="true"></i></div>
    <div class="achievement-body">
      <div class="achievement-title">${title}</div>
      <div class="achievement-desc">${desc}</div>
    </div>
    <div class="achievement-xp">+${xp} XP</div>
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.add("show");
    });
  });
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 600);
  }, 3500);
}

export function showHintToast(text: string) {
  const existing = document.querySelector<HTMLElement>(".hint-toast");
  if (existing) existing.remove();
  const t = document.createElement("div");
  t.className = "hint-toast";
  t.setAttribute("role", "status");
  t.innerHTML = `<i class="fa-solid fa-lightbulb" aria-hidden="true"></i><span>${text}</span>`;
  document.body.appendChild(t);
  requestAnimationFrame(() =>
    requestAnimationFrame(() => t.classList.add("show")),
  );
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 500);
  }, 3000);
}
