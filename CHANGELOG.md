# Changelog

Todas as alterações relevantes deste projeto são documentadas neste arquivo.

O formato segue as convenções do [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e as versões seguem o [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-11-24

Primeira versão estável do portfólio.

### Adicionado

- Licença de código aberto MIT.
- Política de segurança em `SECURITY.md`, com orientações para divulgação responsável de vulnerabilidades.
- Guia de contribuição em `CONTRIBUTING.md`.
- Documentação do projeto e instruções de execução no `README.md`.
- Verificações automatizadas de segurança com CodeQL, Scorecard, OSV-Scanner e Gitleaks.
- Testes baseados em propriedades com `fast-check` para fortalecer a validação da extração de texto dos projetos.
- Workflow do Scorecard com suporte à execução manual.

### Melhorado

- Extração e normalização de texto das descrições dos projetos utilizando `parse5`.
- Processo de qualidade e validação por meio de testes automatizados e integração contínua.

---

[1.0.0]: https://github.com/tirolasca/Portfolio/releases/tag/v1.0.0
