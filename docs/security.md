# Segurança

O site é estático (Astro, `build.format: "file"`) e hospedado na Vercel. A segurança se divide
em **o que está no código** (versionado neste repositório) e **o que precisa ser ativado na
interface do GitHub** (ver o fim do documento).

## Cabeçalhos HTTP (`vercel.json`)

| Cabeçalho                    | Valor / motivo                                                                                                                |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `Content-Security-Policy`    | Veja a tabela abaixo.                                                                                                         |
| `Permissions-Policy`         | Desliga recursos que o site não usa (câmera, microfone, geolocalização, pagamento, USB, sensores, autoplay, captura de tela). |
| `Referrer-Policy`            | `strict-origin-when-cross-origin`: não vaza caminhos para outros sites.                                                       |
| `X-Content-Type-Options`     | `nosniff`: o navegador respeita o `Content-Type` declarado.                                                                   |
| `X-Frame-Options`            | `SAMEORIGIN`: mantido por compatibilidade com navegadores antigos; a CSP (`frame-ancestors 'self'`) é a defesa principal.     |
| `Cross-Origin-Opener-Policy` | `same-origin`: isola a janela de outras origens. O site não depende de `window.opener`.                                       |

`Cross-Origin-Resource-Policy` **não** foi aplicado: ele impediria que outros sites (ex.: READMEs)
incorporassem imagens e badges do site, e o ganho de segurança aqui seria pequeno.
HSTS já é enviado pela própria Vercel nos domínios `*.vercel.app`; em domínio próprio, confirme.

### Content-Security-Policy

| Diretiva                                                                                                                                                          | Por quê                                                                                                                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default-src 'self'`                                                                                                                                              | Tudo que não for listado só carrega do próprio site.                                                                                                                                                                       |
| `script-src 'self' 'sha256-…' https://*.gtranslate.net https://translate.google.com https://translate.googleapis.com https://www.gstatic.com`                     | Sem `unsafe-inline` e sem `unsafe-eval`. O único script inline é o do tema em `Base.astro` (evita o flash do tema claro) e é liberado por **hash**. As origens externas de script são só as do GTranslate/Google Tradutor. |
| `style-src 'self' 'unsafe-inline'`                                                                                                                                | Exceção consciente: o site usa atributos `style="--var: …"` (barras de progresso, índices de animação, inclusive em HTML criado por JS) e o GTranslate injeta estilos. Estilo inline não executa código.                   |
| `img-src 'self' data: https://avatars.githubusercontent.com https://*.gtranslate.net https://www.gstatic.com https://translate.google.com https://www.google.com` | Imagens do site, ícones embutidos (`data:`), o avatar do GitHub e imagens do widget de tradução.                                                                                                                           |
| `font-src 'self' data:`                                                                                                                                           | Fontes locais (Inter e Font Awesome em subset). O Vite embute a fonte menor como `data:`.                                                                                                                                  |
| `connect-src 'self' https://api.github.com https://translate.googleapis.com https://translate.google.com https://*.gtranslate.net`                                | API pública do GitHub (atividade e avatar) e as chamadas do GTranslate.                                                                                                                                                    |
| `manifest-src`, `media-src`                                                                                                                                       | Apenas o próprio site.                                                                                                                                                                                                     |
| `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`                                                                                                      | Bloqueiam plugins, troca da URL base e envio de formulários para fora.                                                                                                                                                     |
| `frame-ancestors 'self'`                                                                                                                                          | Impede que o site seja embutido em páginas de terceiros (anti-clickjacking).                                                                                                                                               |
| `upgrade-insecure-requests`                                                                                                                                       | Promove requisições `http:` a `https:`.                                                                                                                                                                                    |

**Speed Insights sem script inline.** O componente `@vercel/speed-insights/astro` gerava um script
inline cujo texto muda a cada versão da biblioteca (até dentro de `^2.0.0`), o que quebrava o hash da
CSP a cada atualização. Hoje ele é carregado por `src/scripts/core/speed-insights.ts`, como arquivo em
`/_astro` (origem `'self'`). O único hash na CSP é o do script do tema. O `.gitattributes` força LF,
porque o hash depende do texto exato de `Base.astro` (com CRLF ele mudaria).

**Ao alterar o script inline do tema**, o hash muda. O teste `tests/security.spec.ts` confere o
hash do HTML gerado contra o `vercel.json` e informa o novo valor quando divergir.

**Endpoints configuráveis.** Se você definir `PUBLIC_CONTACT_ENDPOINT` ou `PUBLIC_VITALS_URL`,
acrescente a origem deles em `connect-src`; sem isso o navegador bloqueia o envio.

**Limite da validação.** O teste de CSP aplica a política real às páginas e não encontrou
violações nos recursos do próprio site. Ele **não** consegue validar o GTranslate nem a API do
GitHub (o ambiente de teste não tem internet). Depois do primeiro deploy, abra o site num _preview_
da Vercel com o DevTools e troque de idioma: se o console mostrar "Refused to …" para alguma
origem do GTranslate, inclua-a na diretiva indicada. Para observar sem bloquear, use
temporariamente o cabeçalho `Content-Security-Policy-Report-Only`.

## GitHub Actions

- `ci.yml`: permissões mínimas (`contents: read`), concorrência por branch/PR, `timeout-minutes`
  em todos os jobs, actions fixadas por **SHA completo** (a versão fica em comentário), build feito
  uma vez e reaproveitado pelos jobs de E2E e Lighthouse, e `persist-credentials: false` no checkout.
- `codeql.yml`: análise de JavaScript/TypeScript em push e PR para `main` e toda segunda-feira.
- `dependabot.yml`: npm (semanal, agrupado) e GitHub Actions (mensal, agrupado). O Dependabot
  atualiza também os SHAs fixados.

## O que precisa ser ativado no GitHub (não vem do código)

**Proteção da branch `main`** — _Settings → Rules → Rulesets → New branch ruleset_ (ou _Branches →
Add rule_), alvo `main`:

1. _Restrict deletions_ e _Block force pushes_.
2. _Require a pull request before merging_ (com 0 aprovações, se você trabalha sozinho; com 1 se houver mais gente).
3. _Require status checks to pass_: `Lint, formatação, tipos e build`, `Testes E2E + acessibilidade (Playwright/axe)`, `Lighthouse CI` e `Análise de segurança (JavaScript/TypeScript)`. Os nomes aparecem na lista depois da primeira execução.
4. _Require branches to be up to date before merging_.

**Segurança do repositório** — _Settings → Code security_: ative _Dependency graph_, _Dependabot alerts_,
_Dependabot security updates_ e _Secret scanning_ com _Push protection_. O _code scanning_ do CodeQL
aparece sozinho na aba Security depois da primeira execução do workflow.

**Descrição e topics do repositório** — na página principal do repositório, ícone de engrenagem ao
lado de _About_.
