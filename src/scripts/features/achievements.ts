
import { session } from "../core/storage";
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
            session.set(
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

  const cards = ALL_ACHIEVEMENTS.map(renderAchievementCard);
  grid.replaceChildren(...cards);

  grid
    .querySelectorAll<HTMLElement>(".achievement-card.locked")
    .forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.dataset.id ?? "";
        const ach = ALL_ACHIEVEMENTS.find((a) => a.id === id);
        if (!ach) return;
        const hint = LOCKED_HINTS[id] || "Continue explorando!";
        showHintToast(
          ach.secret ? `🔮 Segredo: ${hint}` : `💡 Dica: ${hint}`,
        );
      });
    });
}

function renderAchievementCard(a: Achievement): HTMLElement {
  const unlocked = unlockedAchievements.has(a.id);
  const card = document.createElement("div");
  card.classList.add("achievement-card", unlocked ? "unlocked" : "locked");
  if (a.secret) card.classList.add("secret");
  card.dataset.id = a.id;
  card.setAttribute("data-tooltip", getAchievementTooltipText(a, unlocked));

  const iconContainer = document.createElement("div");
  iconContainer.className = "achievement-card-icon";
  const icon = document.createElement("i");
  const iconClasses =
    unlocked || !a.secret
      ? a.icon.split(/\s+/).filter(Boolean)
      : ["fa-question"];
  icon.classList.add("fa-solid", ...iconClasses);
  icon.setAttribute("aria-hidden", "true");
  if (!unlocked && !a.secret) icon.style.opacity = "0.35";
  iconContainer.append(icon);

  const title = document.createElement("div");
  title.className = "achievement-card-title";
  title.textContent = !unlocked && a.secret ? "???" : a.title;

  const description = document.createElement("div");
  description.className = "achievement-card-desc";
  description.textContent = unlocked
    ? a.desc
    : a.secret
      ? "Conquista oculta"
      : "Ainda não desbloqueada";

  const xp = document.createElement("div");
  xp.className = "achievement-card-xp";
  xp.textContent = unlocked
    ? `+${a.xp} XP`
    : a.secret
      ? "??? XP"
      : `${a.xp} XP`;

  card.append(iconContainer, title, description, xp);

  if (a.secret) {
    const secretTag = document.createElement("span");
    secretTag.className = "achievement-card-secret";
    secretTag.textContent = unlocked ? "✦ Secreto" : "???";
    card.append(secretTag);
  }

  return card;
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

  const iconContainer = document.createElement("div");
  iconContainer.className = "achievement-icon";
  const iconElement = document.createElement("i");
  iconElement.classList.add("fa-solid", ...icon.split(/\s+/).filter(Boolean));
  iconElement.setAttribute("aria-hidden", "true");
  iconContainer.append(iconElement);

  const body = document.createElement("div");
  body.className = "achievement-body";

  const titleElement = document.createElement("div");
  titleElement.className = "achievement-title";
  titleElement.textContent = title;

  const descriptionElement = document.createElement("div");
  descriptionElement.className = "achievement-desc";
  descriptionElement.textContent = desc;

  body.append(titleElement, descriptionElement);

  const xpElement = document.createElement("div");
  xpElement.className = "achievement-xp";
  xpElement.textContent = `+${xp} XP`;

  toast.append(iconContainer, body, xpElement);
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

  const icon = document.createElement("i");
  icon.classList.add("fa-solid", "fa-lightbulb");
  icon.setAttribute("aria-hidden", "true");

  const message = document.createElement("span");
  message.textContent = text;

  t.append(icon, message);
  document.body.appendChild(t);

  requestAnimationFrame(() =>
    requestAnimationFrame(() => t.classList.add("show")),
  );

  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 500);
  }, 3000);
}
