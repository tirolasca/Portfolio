import { closeDialog, openDialog } from "../core/dialog";

export function initSummaryMode() {
  const trigger = document.getElementById("summary-mode-btn");
  if (!trigger) return;

  function buildModal(): HTMLElement {
    const overlay = document.createElement("div");
    overlay.id = "summary-modal-overlay";
    overlay.className = "summary-modal-overlay";

    const modal = document.createElement("div");
    modal.className = "summary-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Resumo rápido");

    const closeButton = document.createElement("button");
    closeButton.className = "summary-modal-close";
    closeButton.setAttribute("aria-label", "Fechar");

    const closeIcon = document.createElement("i");
    closeIcon.className = "fa-solid fa-xmark";
    closeIcon.setAttribute("aria-hidden", "true");
    closeButton.appendChild(closeIcon);

    const body = document.createElement("div");
    body.className = "summary-modal-body";
    body.id = "summary-modal-body";

    modal.append(closeButton, body);
    overlay.appendChild(modal);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeSummary();
    });

    closeButton.addEventListener("click", closeSummary);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && overlay.classList.contains("active")) {
        closeSummary();
      }
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

  function safeUrl(value: string): string | null {
    try {
      const url = new URL(value, document.baseURI);

      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return null;
      }

      return url.href;
    } catch {
      return null;
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

    // Limpa o conteúdo anterior sem interpretar dados como HTML.
    body.replaceChildren();

    // Nome e cargo.
    const heading = document.createElement("h3");
    heading.textContent = name;

    const roleElement = document.createElement("p");
    roleElement.className = "summary-role";
    roleElement.textContent = role;

    body.append(heading, roleElement);

    // Habilidades.
    const skillsBlock = document.createElement("div");
    skillsBlock.className = "summary-block";

    const skillsHeading = document.createElement("h3");
    skillsHeading.textContent = "Principais skills";

    const skillsContainer = document.createElement("div");
    skillsContainer.className = "summary-skills";

    for (const skill of skills) {
      const imageUrl = safeUrl(skill.image);
      if (!imageUrl) continue;

      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = skill.name;
      img.title = skill.name;

      skillsContainer.appendChild(img);
    }

    skillsBlock.append(skillsHeading, skillsContainer);
    body.appendChild(skillsBlock);

    // Projetos.
    const projectsBlock = document.createElement("div");
    projectsBlock.className = "summary-block";

    const projectsHeading = document.createElement("h3");
    projectsHeading.textContent = "Projetos em destaque";

    const projectsList = document.createElement("ul");
    projectsList.className = "summary-projects";

    for (const project of projects) {
      const li = document.createElement("li");
      const link = document.createElement("a");

      link.textContent = project.title;
      link.href = safeUrl(project.link) || "#";
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      li.appendChild(link);
      projectsList.appendChild(li);
    }

    projectsBlock.append(projectsHeading, projectsList);
    body.appendChild(projectsBlock);

    // Ações.
    const actions = document.createElement("div");
    actions.className = "summary-actions";

    const resumeLink = document.createElement("a");
    resumeLink.href = "/Lucas Santos - Currículo.pdf";
    resumeLink.download = "Lucas Santos - Currículo.pdf";
    resumeLink.className = "btn primary";

    const downloadIcon = document.createElement("i");
    downloadIcon.className = "fa-solid fa-download";
    downloadIcon.setAttribute("aria-hidden", "true");

    resumeLink.append(downloadIcon, document.createTextNode(" Currículo"));

    const contactLink = document.createElement("a");
    contactLink.href = "#contato";
    contactLink.className = "btn outline";
    contactLink.id = "summary-contact-link";

    const contactIcon = document.createElement("i");
    contactIcon.className = "fa-solid fa-paper-plane";
    contactIcon.setAttribute("aria-hidden", "true");

    contactLink.append(contactIcon, document.createTextNode(" Contato"));

    contactLink.addEventListener("click", closeSummary);

    actions.append(resumeLink, contactLink);
    body.appendChild(actions);
  }

  trigger.addEventListener("click", () => {
    let overlay = document.getElementById("summary-modal-overlay");

    overlay ??= buildModal();

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
