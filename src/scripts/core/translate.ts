import { enhanceLanguageSwitcher } from "../features/language-switcher";

/**
 * Tradução: GTranslate (versão gratuita, tradução feita no navegador).
 * Substitui o Google Website Translator, descontinuado pelo Google em 1/out/2026.
 * Docs: https://gtranslate.io — plano gratuito para sites pessoais/sem fins comerciais.
 *
 * O widget "Dropdown" gera um <select class="gt_selector"> que usamos só como motor; a interface
 * visível é o seletor personalizado de features/language-switcher.ts.
 */
const WIDGET_SRC = "https://cdn.gtranslate.net/widgets/latest/dropdown.js";
const WRAPPER = ".gtranslate_wrapper";

export function initTranslate() {
  const wrapper = document.querySelector<HTMLElement>(WRAPPER);
  if (!wrapper || document.querySelector(`script[src="${WIDGET_SRC}"]`)) return;

  window.gtranslateSettings = {
    default_language: "pt", // idioma original do site
    languages: ["pt", "en", "es"],
    wrapper_selector: WRAPPER,
    native_language_names: true,
    detect_browser_language: false, // não traduz sozinho na primeira visita
  };

  // assim que o widget criar o <select>, troca a interface pela personalizada
  const enhance = () => {
    const engine =
      wrapper.querySelector<HTMLSelectElement>("select.gt_selector");
    if (!engine) return false;
    try {
      enhanceLanguageSwitcher(wrapper, engine);
    } catch (err) {
      console.error(
        "[idioma] não foi possível montar o seletor personalizado",
        err,
      );
    }
    return true;
  };
  const observer = new MutationObserver(() => {
    if (enhance()) observer.disconnect();
  });
  observer.observe(wrapper, { childList: true, subtree: true });
  setTimeout(() => observer.disconnect(), 15_000);

  const script = document.createElement("script");
  script.src = WIDGET_SRC;
  script.async = true;
  // bloqueado (adblock/offline): some com o espaço reservado em vez de deixar um vazio
  script.onerror = () => wrapper.classList.add("gtranslate-failed");
  script.onload = () => void enhance();
  document.body.appendChild(script);
}
