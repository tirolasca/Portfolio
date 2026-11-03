# Configuração de endpoints (variáveis `PUBLIC_*`)

Toda variável `PUBLIC_*` é embutida no JavaScript do navegador: **qualquer pessoa consegue lê-la**.
Nunca coloque chaves privadas, tokens ou segredos nelas.

Depois de definir uma variável (Vercel → _Settings → Environment Variables_), faça um novo deploy
e **acrescente a origem do endpoint em `connect-src`** na CSP do `vercel.json` (veja `docs/security.md`);
sem isso o navegador bloqueia a requisição.

## `PUBLIC_CONTACT_ENDPOINT` — formulário de contato

Sem a variável, o formulário abre o app de e-mail (`mailto:`) e mostra o texto para copiar. Com ela,
o envio é feito pelo navegador.

**Requisição** (`src/scripts/features/email.ts`)

- `POST` com `Content-Type: application/json` e `Accept: application/json`.
- Corpo: `{ "name": string, "email": string, "subject": string, "message": string }`.
  `subject` assume "Mensagem do Portfólio" quando vazio; `message` tem no máximo 2000 caracteres.
- O campo _honeypot_ não é enviado: se um robô o preencher, o formulário finge sucesso e não faz requisição.
- Timeout de 10 s. Rede fora do ar, timeout e respostas fora de 2xx mostram mensagens distintas e o
  botão volta ao normal. Enquanto há um envio em andamento, novos envios são ignorados.

**Resposta esperada:** qualquer status `2xx` conta como sucesso (o corpo não é lido).

**O que o servidor precisa fazer** (o frontend não basta):

1. Validar de novo nome, e-mail, tamanho da mensagem e tipos dos campos.
2. Aplicar _rate limiting_ por IP (e, se possível, verificação anti-robô como Turnstile ou reCAPTCHA).
3. Permitir CORS para `https://lucastec.vercel.app` (ou a origem do site) com o método `POST`.
4. Nunca repassar o texto recebido como HTML sem escapar.

Serviços prontos como Formspree e Web3Forms atendem a esses pontos; confira no painel deles o
domínio permitido e os limites do plano gratuito.

## `PUBLIC_VITALS_URL` — Core Web Vitals reais

Sem a variável (e sem `?vitals` na URL ou modo de desenvolvimento), a biblioteca `web-vitals` nem é baixada.

**Métricas:** LCP, INP e CLS (principais) e FCP e TTFB (complementares).

**Requisição** (`src/scripts/core/vitals.ts`): `navigator.sendBeacon(url, corpo)` por métrica, com o
corpo em JSON sem cabeçalho de tipo (chega como `text/plain`, o que evita _preflight_ de CORS):

```json
{ "name": "LCP", "value": 2445.1, "rating": "good", "id": "v5-…", "path": "/" }
```

- Não há dados pessoais: sem cookies, sem identificador de usuário, sem IP no corpo (o servidor
  receptor vê o IP da conexão; descarte-o ou não o armazene).
- O `id` identifica só o carregamento da página.
- Falhas de envio são ignoradas e não afetam a experiência.

**O que o servidor precisa fazer:** aceitar `POST` de `text/plain`, fazer `JSON.parse` do corpo,
validar `name` (lista fixa de métricas) e `value` (número), limitar a taxa e responder `204`.
Avalie, para o seu caso, se é necessário avisar os visitantes ou obter consentimento: isso depende
de onde os dados são guardados e de por quanto tempo.

Enquanto o endpoint não existir, **não há dados reais de campo** — apenas as medições de laboratório
do `docs/performance.md`.
