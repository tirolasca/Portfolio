import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";

const date = new Date().toLocaleString("pt-BR");
const reportDir = "reports";

mkdirSync(reportDir, { recursive: true });

let output;
let status = "APROVADO";

try {
  output = execSync("npm test -- --run", {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
} catch (error) {
  status = "FALHOU";
  output = [
    error.stdout?.toString() ?? "",
    error.stderr?.toString() ?? "",
  ].join("\n");
}

const report = `# Relatório de Testes

- Data: ${date}
- Projeto: ${process.env.npm_package_name ?? "Não identificado"}
- Resultado geral: ${status}

## Resultado da execução

\`\`\`text
${output}
\`\`\`

## Instruções para a IA responsável pela correção

Analise o resultado dos testes e:

1. Identifique todos os testes que falharam.
2. Localize os arquivos e componentes envolvidos.
3. Investigue a causa-raiz de cada falha.
4. Identifique possíveis problemas de arquitetura, segurança e desempenho relacionados.
5. Corrija os problemas sem remover funcionalidades existentes.
6. Não enfraqueça os testes para fazer a suíte passar.
7. Crie testes adicionais quando necessário.
8. Execute novamente toda a suíte de testes.
9. Apresente um resumo das alterações realizadas e dos resultados finais.

Não invente causas ou resultados. Diferencie problemas comprovados de hipóteses.

## Saída esperada

Apresente:
- Problemas identificados.
- Causas-raiz.
- Arquivos que precisam ser modificados.
- Correções realizadas.
- Testes executados após as correções.
- Problemas restantes.
`;

const file = `${reportDir}/relatorio-testes.md`;

writeFileSync(file, report, "utf8");

console.log(`\nRelatório gerado: ${file}`);
console.log(`Resultado: ${status}`);
