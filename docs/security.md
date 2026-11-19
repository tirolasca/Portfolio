<div align="center">

<img src="https://raw.githubusercontent.com/tirolasca/tirolasca/main/assets/divider.svg" alt="" width="100%">

O site é estático (Astro, `build.format: "file"`) e hospedado na Vercel. A segurança se divide em **o que está no código** (versionado neste repositório) e **o que precisa ser ativado na interface do GitHub** (ver o fim do documento).

## 🛡️ Cabeçalhos HTTP (`vercel.json`)

| Cabeçalho                    | Valor / motivo                                                                                                                |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `Content-Security-Policy`    | Veja a seção abaixo.                                                                                                          |
| `Permissions-Policy`         | Desliga recursos que o site não usa (câmera, microfone, geolocalização, pagamento, USB, sensores, autoplay, captura de tela). |
| `Referrer-Policy`            | `strict-origin-when-cross-origin`: não vaza caminhos para outros sites.                                                       |
| `X-Content-Type-Options`     | `nosniff`: o navegador respeita o `Content-Type` declarado.                                                                   |
| `X-Frame-Options`            | `SAMEORIGIN`: mantido por compatibilidade com navegadores antigos; a CSP (`frame-ancestors 'self'`) é a defesa principal.     |
| `Cross-Origin-Opener-Policy` | `same-origin`: isola a janela de outras origens. O site não depende de `window.opener`.                                       |

> [!NOTE]
> `Cross-Origin-Resource-Policy` **não** foi aplicado: ele impediria que outros sites (ex.: READMEs) incorporassem imagens e badges do site, e o ganho de segurança aqui seria pequeno. HSTS já é enviado pela própria Vercel nos domínios `*.vercel.app`; em domínio próprio, confirme.

<img src="https://raw.githubusercontent.com/tirolasca/tirolasca/main/assets/divider.svg" alt="" width="100%">

## 🧱 Content-Security-Policy

<details open>
<summary><b>Diretiva por diretiva</b></summary>

<br>

| Diretiva                                                                                                                                                                                           | Por quê                                                                                                                                                                                                                    |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default-src 'self'`                                                                                                                                                                               | Tudo que não for listado só carrega do próprio site.                                                                                                                                                                       |
| `script-src 'self' 'sha256-…' https://*.gtranslate.net https://translate.google.com https://translate.googleapis.com https://www.gstatic.com`                                                      | Sem `unsafe-inline` e sem `unsafe-eval`. O único script inline é o do tema em `Base.astro` (evita o flash do tema claro) e é liberado por **hash**. As origens externas de script são só as do GTranslate/Google Tradutor. |
| `style-src 'self' 'unsafe-inline' https://www.gstatic.com https://translate.googleapis.com https://translate.google.com https://*.gtranslate.net`                                                  | Exceção consciente: o site usa atributos `style="--var: …"` (barras de progresso, índices de animação, inclusive em HTML criado por JS) e o GTranslate injeta estilos. Estilo inline não executa código.                   |
| `img-src 'self' data: https://avatars.githubusercontent.com https://*.gtranslate.net https://www.gstatic.com https://translate.google.com https://translate.googleapis.com https://www.google.com` | Imagens do site, ícones embutidos (`data:`), o avatar do GitHub e imagens do widget de tradução.                                                                                                                           |
| `font-src 'self' data:`                                                                                                                                                                            | Fontes locais (Inter e Font Awesome em subset). O Vite embute a fonte menor como `data:`.                                                                                                                                  |
| `connect-src 'self' https://api.github.com https://translate.googleapis.com https://translate-pa.googleapis.com https://translate.google.com https://*.gtranslate.net https://formspree.io`        | API pública do GitHub (atividade e avatar), as chamadas do GTranslate e o envio do formulário de contato ao **Formspree**.                                                                                                 |
| `manifest-src`, `media-src`                                                                                                                                                                        | Apenas o próprio site.                                                                                                                                                                                                     |
| `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`                                                                                                                                       | Bloqueiam plugins, troca da URL base e envio de formulários para fora. O Formspree é chamado por `fetch` (coberto por `connect-src`), não por envio nativo de formulário.                                                  |
| `frame-ancestors 'self'`                                                                                                                                                                           | Impede que o site seja embutido em páginas de terceiros (anti-clickjacking).                                                                                                                                               |
| `upgrade-insecure-requests`                                                                                                                                                                        | Promove requisições `http:` a `https:`.                                                                                                                                                                                    |

</details>

### 📌 Pontos importantes

**Speed Insights sem script inline.** O componente `@vercel/speed-insights/astro` gerava um script inline cujo texto muda a cada versão da biblioteca (até dentro de `^2.0.0`), o que quebrava o hash da CSP a cada atualização. Hoje ele é carregado por `src/scripts/core/speed-insights.ts`, como arquivo em `/_astro` (origem `'self'`). O único hash na CSP é o do script do tema. O `.gitattributes` força LF, porque o hash depende do texto exato de `Base.astro` (com CRLF ele mudaria).

> [!IMPORTANT]
> **Ao alterar o script inline do tema**, o hash muda. O teste `tests/security.spec.ts` confere o hash do HTML gerado contra o `vercel.json` e informa o novo valor quando divergir.

**Endpoints configuráveis.** O Formspree (`https://formspree.io`) já está em `connect-src`. Se você definir `PUBLIC_VITALS_URL` (ou trocar o provedor do formulário), acrescente a origem do novo endpoint; sem isso o navegador bloqueia o envio. Veja [`configuration.md`](configuration.md).

**Por que a tradução só falhava em produção.** O `vercel.json` (e a CSP dele) só vale no deploy; `astro dev` e `astro preview` não o aplicam, então localmente nada era bloqueado. O Google Tradutor, usado pelo GTranslate, carrega CSS de `www.gstatic.com`/`translate.googleapis.com` e chama `translate-pa.googleapis.com`; sem essas origens na CSP, o navegador recusava as requisições.

> [!WARNING]
> **Limite da validação.** O teste de CSP aplica a política real às páginas e não encontrou violações nos recursos do próprio site. Ele **não** consegue validar o GTranslate, a API do GitHub nem o Formspree (o ambiente de teste não tem internet). Depois do primeiro deploy, abra o site num _preview_ da Vercel com o DevTools, troque de idioma e envie uma mensagem de teste: se o console mostrar "Refused to …" para alguma origem, inclua-a na diretiva indicada. Para observar sem bloquear, use temporariamente o cabeçalho `Content-Security-Policy-Report-Only`.

<img src="https://raw.githubusercontent.com/tirolasca/tirolasca/main/assets/divider.svg" alt="" width="100%">

## 🤖 GitHub Actions

Todos os workflows usam permissões mínimas (`contents: read`, ampliadas só no job que precisa), `timeout-minutes`, `persist-credentials: false` no checkout e actions fixadas por **SHA completo** (a versão fica em comentário; o Dependabot atualiza o SHA).

| Workflow          | O que faz                                                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ci.yml`          | Qualidade (ESLint, Stylelint, Prettier, CSpell, Knip, Vitest, tipos, build, size-limit, links), E2E + axe e Lighthouse CI. O build é feito uma vez e reaproveitado. |
| `codeql.yml`      | Análise estática de JavaScript/TypeScript em push, PR para `main` e toda segunda-feira.                                                                             |
| `zizmor.yml`      | Analisa os próprios workflows (injeção de script, permissões excessivas, actions sem SHA). Resultado na aba Security.                                               |
| `osv-scanner.yml` | Vulnerabilidades conhecidas no `package-lock.json`. No PR, falha só se o PR **introduzir** uma nova; a varredura completa só reporta.                               |
| `gitleaks.yml`    | Procura segredos no histórico inteiro e nos PRs. Gratuito em conta pessoal; em organização exigiria `GITLEAKS_LICENSE`.                                             |
| `scorecard.yml`   | Nota pública de boas práticas do repositório (OpenSSF Scorecard). Só funciona em repositório público.                                                               |
| `dependabot.yml`  | npm (semanal, agrupado) e GitHub Actions (mensal, agrupado), com **espera de 7 dias** após o lançamento de cada versão (`cooldown`).                                |

> [!NOTE]
> A varredura completa do OSV-Scanner usa `fail-on-vuln: false`: uma vulnerabilidade em dependência transitiva sem correção disponível não deixa o `main` vermelho. Quem barra é o scan de PR.

<img src="https://raw.githubusercontent.com/tirolasca/tirolasca/main/assets/divider.svg" alt="" width="100%">

## ✅ O que precisa ser ativado no GitHub (não vem do código)

<details>
<summary><b>🔒 Proteção da branch <code>main</code></b></summary>

<br>

_Settings → Rules → Rulesets → New branch ruleset_ (ou _Branches → Add rule_), alvo `main`:

1. _Restrict deletions_ e _Block force pushes_.
2. _Require a pull request before merging_ (com 0 aprovações, se você trabalha sozinho; com 1 se houver mais gente).
3. _Require status checks to pass_: `Lint, formatação, testes, tipos e build`, `Testes E2E + acessibilidade (Playwright/axe)`, `Lighthouse CI`, `Análise de segurança (JavaScript/TypeScript)`, `Análise dos workflows` (zizmor), `Varredura de segredos` (Gitleaks) e o scan de PR do OSV-Scanner. Os nomes aparecem na lista depois da primeira execução.
4. _Require branches to be up to date before merging_.

</details>

<details>
<summary><b>🛰️ Segurança do repositório</b></summary>

<br>

_Settings → Code security_: ative _Dependency graph_, _Dependabot alerts_, _Dependabot security updates_ e _Secret scanning_ com _Push protection_. O _code scanning_ do CodeQL, do zizmor, do OSV-Scanner e do Scorecard aparece sozinho na aba Security depois da primeira execução de cada workflow. Para o zizmor e o OSV-Scanner **bloquearem** o merge (e não só avisarem), use uma regra de _code scanning_ no ruleset da `main`.

</details>

<details>
<summary><b>📝 Descrição e topics do repositório</b></summary>

<br>

Na página principal do repositório, ícone de engrenagem ao lado de _About_.

</details>
