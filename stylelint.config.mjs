/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard"],
  // CSS gerado (subconjunto do Font Awesome) e fontes não entram
  ignoreFiles: ["src/styles/vendor/**", "dist/**", ".astro/**", "coverage/**"],
  // Adoção gradual: tudo que sobrou vira AVISO. O `lint:css` usa um teto
  // (--max-warnings) que só pode diminuir: nenhum problema novo entra, e os
  // atuais você resolve aos poucos (e baixa o teto no package.json).
  defaultSeverity: "warning",
  rules: {
    // Regras só de ESTILO desligadas: o Prettier já cuida da formatação e as
    // demais exigiriam reescrever ~1.700 linhas sem mudar nada no resultado.
    // Dá pra ligar uma por vez e rodar `stylelint --fix` quando quiser.
    "rule-empty-line-before": null,
    "at-rule-empty-line-before": null,
    "comment-empty-line-before": null,
    "custom-property-empty-line-before": null,
    "declaration-empty-line-before": null,
    "color-function-notation": null,
    "color-function-alias-notation": null,
    "alpha-value-notation": null,
    "color-hex-length": null,
    "import-notation": null,
    "media-feature-range-notation": null,
    "value-keyword-case": null,
    "selector-class-pattern": null,
    "selector-id-pattern": null,
    "keyframes-name-pattern": null,
    // prefixos como -webkit-backdrop-filter são intencionais (Safari)
    "property-no-vendor-prefix": null,
    // Sinal real: foi esse tipo de conflito de cascata que deu problema antes.
    "no-descending-specificity": true,
  },
};
