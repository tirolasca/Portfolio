// Tipos globais usados pelo portfólio (GTranslate e flags no window).

interface GTranslateSettings {
  default_language: string;
  languages: string[];
  wrapper_selector: string;
  native_language_names?: boolean;
  detect_browser_language?: boolean;
}

interface Window {
  gtranslateSettings?: GTranslateSettings;
  __techHighlightTimer?: number;
  /** Safari antigo — só usado como fallback de AudioContext */
  webkitAudioContext: typeof AudioContext;
}
