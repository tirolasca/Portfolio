const NAV_SECTIONS_INDEX = [
  { id: "home", label: "Início", icon: "fa-house" },
  { id: "titulo", label: "Skills", icon: "fa-bolt" },
  { id: "projetos", label: "Projetos", icon: "fa-rocket" },
  { id: "contato", label: "Contato", icon: "fa-envelope" },
];

const NAV_SECTIONS_CURI = [
  { id: "top", label: "Resumo", icon: "fa-user" },
  { id: "formacao", label: "Formação", icon: "fa-graduation-cap" },
  { id: "experiencias", label: "Experiências", icon: "fa-briefcase" },
  { id: "projetos", label: "Projetos", icon: "fa-rocket" },
  { id: "swot", label: "SWOT", icon: "fa-brain" },
];

export function initSideNavDots() {
  const isCuri = !!document.querySelector<HTMLElement>(".curriculo-page");
  const list = isCuri ? NAV_SECTIONS_CURI : NAV_SECTIONS_INDEX;

  const nav = document.createElement("nav");
  nav.className = "side-nav-dots";
  nav.setAttribute("aria-label", "Navegação por seção");

  list.forEach(({ id, label }) => {
    const target = document.getElementById(id);
    if (!target) return;
    const dot = document.createElement("a");
    dot.className = "side-dot";
    dot.href = `#${id}`;
    dot.dataset.label = label;
    dot.setAttribute("aria-label", label);
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    });
    nav.appendChild(dot);
  });
  document.body.appendChild(nav);

  const bar = document.createElement("nav");
  bar.className = "side-nav-mobile-bar";
  bar.setAttribute("aria-label", "Navegação mobile");

  list.forEach(({ id, label, icon }) => {
    const target = document.getElementById(id);
    if (!target) return;
    const btn = document.createElement("button");
    btn.className = "nav-mobile-btn";
    btn.dataset.id = id;
    btn.setAttribute("aria-label", label);
    btn.innerHTML = `<i class="fa-solid ${icon}" aria-hidden="true"></i><span>${label}</span>`;
    btn.addEventListener("click", () => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    });
    bar.appendChild(btn);
  });
  document.body.appendChild(bar);
}

export function updateSideNavDots() {
  const midY = window.innerHeight / 2;

  document
    .querySelectorAll<
      HTMLAnchorElement & { labelTimeout?: ReturnType<typeof setTimeout> }
    >(".side-dot")
    .forEach((dot) => {
      const id = dot.href.split("#")[1];
      const el = document.getElementById(id);
      if (!el) return;

      const r = el.getBoundingClientRect();
      const isActive = r.top <= midY && r.bottom >= 0;

      if (isActive) {
        if (!dot.classList.contains("active")) {
          dot.classList.add("active", "show-label");

          if (dot.labelTimeout) clearTimeout(dot.labelTimeout);

          dot.labelTimeout = setTimeout(() => {
            dot.classList.remove("show-label");
          }, 3000);
        }
      } else {
        dot.classList.remove("active", "show-label");
      }
    });

  document.querySelectorAll<HTMLElement>(".nav-mobile-btn").forEach((btn) => {
    const id = btn.dataset.id;
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    const r = el.getBoundingClientRect();
    btn.classList.toggle("active", r.top <= midY && r.bottom >= 0);
  });
}
