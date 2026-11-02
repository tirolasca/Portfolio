/**
 * Seletor de idioma personalizado.
 *
 * O GTranslate (visual "Dropdown") gera um <select class="gt_selector">. Ele continua na página
 * como MOTOR (escondido): ao escolher um idioma aqui, atribuímos o valor nele e disparamos o evento
 * `change` — é isso que aciona a tradução. A interface que o usuário vê é esta, só com PT/EN/ES
 * (o placeholder "Select Language" do widget nunca aparece).
 */
const LANGS = {
  pt: { name: "Português", code: "PT" },
  en: { name: "English", code: "EN" },
  es: { name: "Español", code: "ES" },
} as const;
type LangCode = keyof typeof LANGS;

const GLOBE =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
const CHECK =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

/** "pt|en" → "en" (idioma de destino do valor das <option> do GTranslate) */
const targetOf = (value: string): string => value.split("|")[1] ?? "";

export function enhanceLanguageSwitcher(
  wrapper: HTMLElement,
  engine: HTMLSelectElement,
) {
  if (wrapper.querySelector(".lang-switcher")) return;

  // só os idiomas que o widget realmente oferece, na ordem de LANGS
  const values = new Map<LangCode, string>();
  for (const opt of Array.from(engine.options)) {
    const code = targetOf(opt.value) as LangCode;
    if (code in LANGS && !values.has(code)) values.set(code, opt.value);
  }
  const codes = (Object.keys(LANGS) as LangCode[]).filter((c) => values.has(c));
  if (codes.length < 2) return; // nada para escolher

  const sw = document.createElement("div");
  sw.className = "lang-switcher";
  sw.innerHTML = `
    <button type="button" class="lang-btn" aria-haspopup="listbox" aria-expanded="false" aria-controls="lang-menu">
      <span class="lang-btn-globe">${GLOBE}</span>
      <span class="lang-btn-label"></span>
      <span class="lang-btn-chevron" aria-hidden="true"></span>
    </button>
    <ul class="lang-menu" id="lang-menu" role="listbox" tabindex="-1" aria-label="Idioma do site">
      ${codes
        .map(
          (c, i) => `
        <li class="lang-option" role="option" id="lang-opt-${c}" data-lang="${c}" style="--i:${i}" aria-selected="false">
          <span class="lang-code">${LANGS[c].code}</span>
          <span class="lang-name">${LANGS[c].name}</span>
          <span class="lang-check">${CHECK}</span>
        </li>`,
        )
        .join("")}
    </ul>`;
  wrapper.appendChild(sw);

  // o <select> do GTranslate vira só o motor: fora da vista e da navegação
  engine.setAttribute("aria-hidden", "true");
  engine.tabIndex = -1;

  const btn = sw.querySelector<HTMLButtonElement>(".lang-btn")!;
  const label = sw.querySelector<HTMLElement>(".lang-btn-label")!;
  const menu = sw.querySelector<HTMLElement>(".lang-menu")!;
  const options = Array.from(sw.querySelectorAll<HTMLElement>(".lang-option"));
  let active = 0;
  let typed = "";
  let typedTimer: ReturnType<typeof setTimeout> | undefined;

  const current = (): LangCode => {
    const c = targetOf(engine.value) as LangCode;
    return codes.includes(c) ? c : "pt"; // placeholder/vazio = idioma original
  };

  function render() {
    const cur = current();
    label.textContent = LANGS[cur].name;
    btn.setAttribute(
      "aria-label",
      `Idioma: ${LANGS[cur].name}. Alterar idioma`,
    );
    options.forEach((o) =>
      o.setAttribute("aria-selected", String(o.dataset.lang === cur)),
    );
    document.documentElement.dataset.siteLang = cur; // gancho útil para CSS/depuração
  }

  function setActive(i: number) {
    active = (i + options.length) % options.length;
    options.forEach((o, idx) =>
      o.classList.toggle("is-active", idx === active),
    );
    menu.setAttribute("aria-activedescendant", options[active].id);
    options[active].scrollIntoView({ block: "nearest" });
  }

  const isOpen = () => sw.classList.contains("is-open");

  function open() {
    render();
    sw.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
    setActive(options.findIndex((o) => o.dataset.lang === current()));
    menu.focus({ preventScroll: true });
  }

  function close(returnFocus: boolean) {
    sw.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    menu.removeAttribute("aria-activedescendant");
    if (returnFocus) btn.focus({ preventScroll: true });
  }

  function choose(code: LangCode) {
    close(true);
    if (code === current()) return;
    engine.value = values.get(code)!;
    render();
    engine.dispatchEvent(new Event("change", { bubbles: true })); // aciona a tradução do GTranslate
  }

  btn.addEventListener("click", () => (isOpen() ? close(false) : open()));
  btn.addEventListener("keydown", (e) => {
    if (["ArrowDown", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      open();
    }
  });

  menu.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        return setActive(active + 1);
      case "ArrowUp":
        e.preventDefault();
        return setActive(active - 1);
      case "Home":
        e.preventDefault();
        return setActive(0);
      case "End":
        e.preventDefault();
        return setActive(options.length - 1);
      case "Enter":
      case " ":
        e.preventDefault();
        return choose(options[active].dataset.lang as LangCode);
      case "Escape":
        e.preventDefault();
        e.stopPropagation();
        return close(true);
      case "Tab":
        return close(false);
    }
    // digitar a inicial salta para o idioma (E → English → Español…)
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      typed = (typed + e.key).toLowerCase();
      clearTimeout(typedTimer);
      typedTimer = setTimeout(() => (typed = ""), 600);
      const n = options.length;
      for (let k = 1; k <= n; k++) {
        const idx = (active + (typed.length === 1 ? k : 0)) % n;
        if (
          LANGS[options[idx].dataset.lang as LangCode].name
            .toLowerCase()
            .startsWith(typed)
        ) {
          setActive(idx);
          break;
        }
      }
    }
  });

  options.forEach((o, i) => {
    o.addEventListener("pointermove", () => setActive(i));
    o.addEventListener("click", () => choose(o.dataset.lang as LangCode));
  });

  // clicar fora fecha (sem roubar o foco)
  document.addEventListener("pointerdown", (e) => {
    if (isOpen() && !sw.contains(e.target as Node)) close(false);
  });
  // o motor pode atualizar o idioma depois (cookie do GTranslate): mantém o rótulo certo
  engine.addEventListener("change", render);
  [0, 600, 2000, 5000].forEach((ms) => setTimeout(render, ms));
  render();
}
