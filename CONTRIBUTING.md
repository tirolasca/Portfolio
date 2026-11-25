# Como contribuir

Obrigado pelo interesse em contribuir com o **Portfolio**! Este documento descreve o fluxo para propor correções, melhorias e documentação.

## Antes de começar

- Consulte as [Issues abertas](https://github.com/tirolasca/Portfolio/issues) para verificar se o assunto já está sendo discutido.
- Para mudanças maiores, abra uma Issue antes de implementar. Explique o problema ou a melhoria proposta para alinhar o escopo.
- Para correções pequenas de documentação ou erros evidentes, você pode abrir diretamente uma Pull Request.
- Se não tiver permissão para criar branches neste repositório, faça um fork e envie a Pull Request a partir dele.

## Requisitos

- **Node.js 26.13.0 ou superior**, conforme definido em `package.json` e utilizado pelo CI.
- **npm**, que acompanha o Node.js.
- **Git**.
- Para os testes de navegador: Chromium instalado pelo Playwright.

## Preparar o ambiente

1. Faça um fork do repositório, se necessário.
2. Clone seu fork:

   ```bash
   git clone https://github.com/SEU-USUARIO/Portfolio.git
   cd Portfolio
   ```

3. Instale as dependências:

   ```bash
   npm ci
   ```

   A instalação também prepara os hooks locais do Husky. O hook de commit executa verificações nos arquivos preparados por meio do lint-staged.

4. Crie uma branch descritiva a partir de `main`:

   ```bash
   git switch -c fix/descrição-curta
   ```

   Exemplos de prefixos: `fix/` para correções, `feat/` para funcionalidades, `docs/` para documentação, `test/` para testes e `chore/` para manutenção.

## Desenvolver e testar

Faça mudanças pequenas e focadas. Preserve os padrões existentes de Astro, TypeScript estrito, acessibilidade, segurança e desempenho.

Quando alterar comportamento, lógica ou dados, inclua ou atualize testes que cubram o cenário modificado. Correções de bugs devem, sempre que viável, incluir um teste que reproduza o problema antes da correção.

Mudanças exclusivamente documentais normalmente não exigem testes de código, mas a formatação e a revisão dos links continuam relevantes.

### Verificações locais

Execute as verificações adequadas ao escopo da mudança. Para a suíte principal de qualidade:

```bash
npm run quality
```

Esse comando executa ESLint, Stylelint, Prettier em modo de verificação, checagem de tipos do Astro, testes unitários, Knip e CSpell.

Outros comandos úteis:

| Comando                           | Finalidade                                       |
| --------------------------------- | ------------------------------------------------ |
| `npm run test`                    | Executa os testes unitários com Vitest.          |
| `npm run test:coverage`           | Executa os testes e gera relatório de cobertura. |
| `npm run test:e2e`                | Executa os testes de navegador com Playwright.   |
| `npx playwright install chromium` | Instala o Chromium necessário aos testes E2E.    |
| `npm run build`                   | Executa `astro check` e gera o site em `dist/`.  |
| `npm run size`                    | Verifica o orçamento de tamanho do build.        |
| `npm run check:links`             | Verifica links internos e âncoras no build.      |
| `npm run format:check`            | Verifica a formatação com Prettier.              |
| `npm run spell`                   | Verifica ortografia com CSpell.                  |

O workflow de CI também executa verificações de qualidade, build, testes E2E com axe, orçamento de tamanho, links internos e Lighthouse CI.

Não inclua arquivos gerados, credenciais, tokens, arquivos `.env`, dados pessoais ou alterações não relacionadas à proposta.

## Enviar uma Pull Request

1. Revise as alterações:

   ```bash
   git status
   git diff
   ```

2. Faça commits claros e objetivos. Exemplos:

   ```text
   docs: atualiza instruções de contribuição
   fix: corrige comportamento do formulário
   test: adiciona cobertura para validação de projetos
   ```

3. Envie a branch:

   ```bash
   git push -u origin docs/readme-contributing
   ```

4. Abra uma Pull Request direcionada à branch `main`.
5. Na descrição, explique o que mudou, por que a mudança é necessária e como foi validada. Relacione a Issue correspondente, se houver.
6. Aguarde e verifique os checks automáticos. Corrija as falhas e atualize a branch da Pull Request quando necessário.

A branch `main` é protegida: mudanças devem entrar por Pull Request e cumprir as verificações obrigatórias configuradas no repositório. Não envie alterações diretamente para `main` nem tente contornar as proteções.

### Checklist para a Pull Request

- [ ] A mudança tem escopo claro e está relacionada ao objetivo descrito.
- [ ] Testes foram adicionados ou atualizados quando houve mudança de comportamento.
- [ ] As verificações locais relevantes foram executadas.
- [ ] A documentação foi atualizada, quando necessário.
- [ ] Não foram incluídos segredos, credenciais, arquivos locais ou artefatos gerados.
- [ ] Os checks da CI passaram.

## Relatar bugs e sugerir melhorias

- **Bug ou comportamento inesperado:** abra uma [Issue](https://github.com/tirolasca/Portfolio/issues) com contexto, passos para reproduzir, resultado esperado e resultado observado. Inclua informações do navegador e do ambiente quando forem relevantes.
- **Sugestão de melhoria:** abra uma Issue descrevendo o problema que a proposta resolve, o resultado esperado e, se possível, uma alternativa considerada.
- **Dúvidas gerais:** utilize as Issues para manter a discussão acessível e que pode ser pesquisado.

Não publique informações pessoais, tokens, dados privados ou detalhes que possam expor visitantes.

## Relatar vulnerabilidades

**Não abra uma Issue pública para reportar uma vulnerabilidade.** Utilize o recurso **Private Vulnerability Reporting** do GitHub:

1. Acesse a aba **Security** do repositório.
2. Abra **Advisories**.
3. Selecione **Report a vulnerability**.

Inclua, se possível, a descrição, os passos para reprodução, os componentes afetados e o impacto potencial. Consulte a [Política de Segurança](SECURITY.md) para mais informações.

## Licença

Ao enviar uma contribuição, você concorda que ela será disponibilizada sob a licença [MIT](LICENSE), nos termos dessa licença. Você mantém os direitos autorais sobre sua contribuição e concede os direitos previstos pela licença MIT para o material que enviar.

Recursos de terceiros incluídos no projeto podem possuir licenças próprias; não presuma que a licença MIT deste repositório substitui os termos desses recursos.

## Processo de releases

O projeto utiliza Semantic Versioning (SemVer), no formato `MAJOR.MINOR.PATCH`.

As versões oficiais são identificadas por tags Git no formato `vMAJOR.MINOR.PATCH`, associadas a releases do GitHub.

### Regras de versionamento

- **MAJOR:** alterações incompatíveis que exijam mudanças relevantes na utilização ou configuração do projeto.
- **MINOR:** novas funcionalidades compatíveis com a versão anterior.
- **PATCH:** correções de bugs e melhorias compatíveis.

### Publicação de uma release

1. Criar uma branch para preparar a release.
2. Atualizar a versão no `package.json` e no `package-lock.json`, quando aplicável.
3. Atualizar o `CHANGELOG.md` com as alterações efetivamente realizadas.
4. Executar as verificações de qualidade, testes e build.
5. Abrir um Pull Request para `main` e aguardar os checks obrigatórios.
6. Após o merge, criar uma tag Git no commit integrado à `main`.
7. Publicar uma GitHub Release associada à tag, com as notas da versão.

O projeto utiliza entrega contínua na Vercel. A publicação de uma release documenta um marco estável do projeto e não substitui o processo automatizado de deploy.
