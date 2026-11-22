/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard"],
  // CSS gerado (subconjunto do Font Awesome) e fontes não entram
  ignoreFiles: ["src/styles/vendor/**", "dist/**", ".astro/**", "coverage/**"],
  // Tolerância zero: qualquer aviso reprova (sem teto de --max-warnings).
  defaultSeverity: "error",
  rules: {
    // Classes, ids e keyframes em kebab-case. Única exceção: as duas classes que o
    // widget GTranslate (terceiros) gera em snake_case e que o CSS precisa alcançar.
    "selector-class-pattern": [
      "^(?:[a-z][a-z0-9]*(?:-[a-z0-9]+)*|gtranslate_wrapper|gt_selector)$",
      {
        message: (name) =>
          `Expected class selector ".${name}" to be kebab-case`,
      },
    ],
    // prefixos como -webkit-backdrop-filter são intencionais (Safari)
    "property-no-vendor-prefix": null,
    // Sinal real: foi esse tipo de conflito de cascata que deu problema antes.
    // Regra de ouro: seletores de menor especificidade vêm ANTES dos de maior
    // (base → estados → tema escuro quando a especificidade já é maior).
    "no-descending-specificity": true,
  },
};
