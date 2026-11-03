import { closeDialog, openDialog } from "../core/dialog";
export function initSummaryMode() {
  const trigger = document.getElementById("summary-mode-btn");
  if (!trigger) return;

  function buildModal() {
    const overlay = document.createElement("div");
    overlay.id = "summary-modal-overlay";
    overlay.className = "summary-modal-overlay";
    overlay.innerHTML = `
      <div class="summary-modal" role="dialog" aria-modal="true" aria-label="Resumo rápido">
        <button class="summary-modal-close" aria-label="Fechar"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
        <div class="summary-modal-body" id="summary-modal-body"></div>
      </div>
    `;
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeSummary();
    });
    overlay
      .querySelector<HTMLElement>(".summary-modal-close")
      ?.addEventListener("click", closeSummary);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("active"))
        closeSummary();
    });
    document.body.appendChild(overlay);
    return overlay;
  }

  function closeSummary() {
    const overlay = document.getElementById("summary-modal-overlay");
    if (overlay) {
      overlay.classList.remove("active");
      closeDialog(overlay);
    }
  }

  function populate(overlay: HTMLElement) {
    const body = overlay.querySelector<HTMLElement>("#summary-modal-body");
    if (!body) return;

    const name =
      document
        .querySelector<HTMLElement>(".brand-text h1")
        ?.textContent?.trim() || "Lucas Santos";

    const role =
      document
        .querySelector<HTMLElement>(".brand-text .job")
        ?.textContent?.trim() || "";

    const skills = Array.from(
      document.querySelectorAll<HTMLImageElement>(".skills .skill-badges img"),
    )
      .slice(0, 8)
      .map((img) => ({
        name: img.alt,
        image: img.src,
      }));

    const projects = Array.from(
      document.querySelectorAll<HTMLElement>(".projects .project-card"),
    )
      .slice(0, 3)
      .map((card) => ({
        title: card.querySelector<HTMLElement>("h4")?.textContent?.trim() || "",
        link:
          card.querySelector<HTMLAnchorElement>(
            ".project-links a[href^='http']",
          )?.href || "#",
      }));

    body.innerHTML = `
    <h3>${name}</h3>
    <p class="summary-role">${role}</p>

    <div class="summary-block">
      <h3>Principais skills</h3>

      <div class="summary-skills">
        ${skills
          .map(
            (skill) => `
              <img
                src="${skill.image}"
                alt="${skill.name}"
                title="${skill.name}"
              >
            `,
          )
          .join("")}
      </div>
    </div>

    <div class="summary-block">
      <h3>Projetos em destaque</h3>

      <ul class="summary-projects">
        ${projects
          .map(
            (p) =>
              `<li><a href="${p.link}" target="_blank" rel="noopener noreferrer">${p.title}</a></li>`,
          )
          .join("")}
      </ul>
    </div>

    <div class="summary-actions">
      <a
        href="/Lucas Santos - Currículo.pdf"
        download="Lucas Santos - Currículo.pdf"
        class="btn primary"
      >
        <i class="fa-solid fa-download" aria-hidden="true"></i> Currículo
      </a>

      <a
        href="#contato"
        class="btn outline"
        id="summary-contact-link"
      >
        <i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Contato
      </a>
    </div>
  `;

    const contactLink = body.querySelector<HTMLElement>(
      "#summary-contact-link",
    );

    if (contactLink) {
      contactLink.addEventListener("click", closeSummary);
    }
  }

  trigger.addEventListener("click", () => {
    let overlay = document.getElementById("summary-modal-overlay");
    if (!overlay) overlay = buildModal();
    populate(overlay);
    requestAnimationFrame(() => {
      overlay.classList.add("active");
      openDialog(
        overlay,
        overlay.querySelector<HTMLElement>(".summary-modal-close"),
        document.getElementById("summary-mode-btn"),
      );
    });
  });
}
