<div align="center">

<img src="https://raw.githubusercontent.com/tirolasca/tirolasca/main/assets/divider.svg" alt="" width="100%">

> [!WARNING]
> Toda variável `PUBLIC_*` é embutida no JavaScript do navegador: **qualquer pessoa consegue lê-la**. Nunca coloque chaves privadas, tokens ou segredos nelas.

Depois de definir uma variável (Vercel → _Settings → Environment Variables_), faça um novo deploy e **confira se a origem do endpoint está em `connect-src`** na CSP do `vercel.json` (veja [`security.md`](security.md)); sem isso o navegador bloqueia a requisição.

| Variável                                                                                | Para quê                                   | Origem na CSP                          |
| --------------------------------------------------------------------------------------- | ------------------------------------------ | -------------------------------------- |
| [`PUBLIC_CONTACT_ENDPOINT`](#-public_contact_endpoint--formulário-de-contato-formspree) | Envio do formulário de contato (Formspree) | `https://formspree.io` ✅ já liberada  |
| [`PUBLIC_VITALS_URL`](#-public_vitals_url--core-web-vitals-reais)                       | Core Web Vitals reais (dados de campo)     | ⚠️ acrescente a origem do seu endpoint |

<img src="https://raw.githubusercontent.com/tirolasca/tirolasca/main/assets/divider.svg" alt="" width="100%">

## 📬 `PUBLIC_CONTACT_ENDPOINT` — formulário de contato (Formspree)

Sem a variável, o formulário abre o app de e-mail (`mailto:`) e mostra o texto para copiar. Com ela, o envio é feito pelo navegador. O formulário do portfólio usa o [**Formspree**](https://formspree.io).

### Como configurar

1. No painel do Formspree, crie um formulário e copie o endpoint, no formato `https://formspree.io/f/<id>`.
2. Na Vercel, em _Settings → Environment Variables_, crie `PUBLIC_CONTACT_ENDPOINT` com esse endereço (marque os ambientes em que o envio deve funcionar, como _Production_ e _Preview_).
3. Faça um novo deploy: a variável é embutida **na hora do build**, então mudar o valor sem redeploy não tem efeito.
4. Para testar localmente, copie `.env.example` para `.env` (ele não é versionado), preencha a variável e rode `npm run dev`.
5. No painel do Formspree, confira o domínio permitido, o filtro de spam e os limites do plano gratuito.

> [!NOTE]
> A origem `https://formspree.io` já está em `connect-src` no `vercel.json`. Se trocar de provedor, troque também essa origem.

### Requisição

Implementada em `src/scripts/features/email.ts`.

- `POST` com `Content-Type: application/json` e `Accept: application/json`.
- Corpo: `{ "name": string, "email": string, "subject": string, "message": string, "_subject": string }`. O `_subject` repete o valor de `subject`: é o campo especial do Formspree que define o assunto do e-mail de notificação, enquanto `subject` continua como campo normal da mensagem. `subject` assume "Mensagem do Portfólio" quando vazio; `message` tem no máximo 2000 caracteres.
- O campo _honeypot_ não é enviado: se um robô o preencher, o formulário finge sucesso e não faz requisição.
- Timeout de 10 s. Rede fora do ar, timeout e respostas fora de 2xx mostram mensagens distintas e o botão volta ao normal. Enquanto há um envio em andamento, novos envios são ignorados.

**Resposta esperada:** qualquer status `2xx` conta como sucesso (o corpo não é lido).

### O que o servidor precisa fazer

O frontend não basta. O Formspree cobre boa parte disto, mas confirme no painel:

1. Validar de novo nome, e-mail, tamanho da mensagem e tipos dos campos.
2. Aplicar _rate limiting_ por IP (e, se possível, verificação anti-robô como Turnstile ou reCAPTCHA).
3. Permitir CORS para `https://lucastec.vercel.app` (ou a origem do site) com o método `POST`.
4. Nunca repassar o texto recebido como HTML sem escapar.

Qualquer outro serviço com o mesmo contrato (como o Web3Forms) também funciona: basta trocar a URL e a origem em `connect-src`.

<img src="https://raw.githubusercontent.com/tirolasca/tirolasca/main/assets/divider.svg" alt="" width="100%">

## 📊 `PUBLIC_VITALS_URL` — Core Web Vitals reais

Sem a variável (e sem `?vitals` na URL ou modo de desenvolvimento), a biblioteca `web-vitals` nem é baixada.

**Métricas:** LCP, INP e CLS (principais) e FCP e TTFB (complementares).

### Requisição

Implementada em `src/scripts/core/vitals.ts`: `navigator.sendBeacon(url, corpo)` por métrica, com o corpo em JSON sem cabeçalho de tipo (chega como `text/plain`, o que evita _preflight_ de CORS):

```json
{ "name": "LCP", "value": 2445.1, "rating": "good", "id": "v6-…", "path": "/" }
```

- Não há dados pessoais: sem cookies, sem identificador de usuário, sem IP no corpo (o servidor receptor vê o IP da conexão; descarte-o ou não o armazene).
- O `id` identifica só o carregamento da página.
- Falhas de envio são ignoradas e não afetam a experiência.

### O que o servidor precisa fazer

Aceitar `POST` de `text/plain`, fazer `JSON.parse` do corpo, validar `name` (lista fixa de métricas) e `value` (número), limitar a taxa e responder `204`. Avalie, para o seu caso, se é necessário avisar os visitantes ou obter consentimento: isso depende de onde os dados são guardados e de por quanto tempo.

> [!NOTE]
> Enquanto o endpoint não existir, **não há dados reais de campo**: apenas as medições de laboratório do [`performance.md`](performance.md).
