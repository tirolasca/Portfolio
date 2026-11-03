import Chart from "chart.js/auto";

/** `canvas.chart` expõe a instância (usado pelos testes E2E). */
type SwotCanvas = HTMLCanvasElement & { chart?: Chart };

const LABELS = [
  "Frontend",
  "Backend",
  "APIs",
  "Banco de Dados",
  "Cloud",
  "DevOps",
  "Mobile",
  "IA & Automação",
];
const VALUES = [8.5, 8, 8.5, 7.5, 5.5, 5, 6.5, 8];
const FONT = "'Inter', sans-serif";

/** O tema escuro é uma classe no <html> (veja core/theme.ts). */
const isDarkTheme = () => document.documentElement.classList.contains("dark");

function palette(dark: boolean) {
  return {
    text: dark ? "#ffffff" : "#15b8c4",
    grid: dark ? "rgba(190, 220, 225, 0.13)" : "rgba(0, 0, 0, 0.10)",
    angle: dark ? "rgba(190, 220, 225, 0.15)" : "rgba(0, 0, 0, 0.10)",
    tooltipBg: dark ? "rgba(5, 15, 20, 0.97)" : "rgba(255, 255, 255, 0.97)",
    tooltipTitle: dark ? "#ffffff" : "#1a202c",
    tooltipBody: dark ? "#d7e1e5" : "#4a5568",
    tooltipBorder: dark ? "rgba(0, 255, 224, 0.35)" : "rgba(0, 191, 174, 0.25)",
    fill: dark ? "rgba(0, 255, 224, 0.10)" : "rgba(0, 191, 174, 0.10)",
    accent: dark ? "#00ffe0" : "#00bfae",
    pointBorder: dark ? "#061116" : "#ffffff",
  };
}

/** Aplica as cores do tema ativo num gráfico já criado (sem recriá-lo). */
function applyPalette(chart: Chart<"radar">, dark: boolean) {
  const c = palette(dark);
  const ds = chart.data.datasets[0];
  ds.backgroundColor = c.fill;
  ds.borderColor = c.accent;
  ds.pointBackgroundColor = c.accent;
  ds.pointBorderColor = c.pointBorder;
  ds.pointHoverBackgroundColor = c.accent;

  const r = chart.options.scales!.r!;
  r.ticks!.color = c.text;
  r.angleLines!.color = c.angle;
  r.grid!.color = c.grid;
  r.pointLabels!.color = c.text;

  const tip = chart.options.plugins!.tooltip!;
  tip.backgroundColor = c.tooltipBg;
  tip.titleColor = c.tooltipTitle;
  tip.bodyColor = c.tooltipBody;
  tip.borderColor = c.tooltipBorder;
  chart.update("none");
}

let themeObserver: MutationObserver | undefined;

export function initSwotChart() {
  const canvas = document.getElementById("swotChart") as SwotCanvas | null;
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;

  // reinicialização: nunca deixa duas instâncias (ou observers) no mesmo canvas
  Chart.getChart(canvas)?.destroy();
  themeObserver?.disconnect();

  const dark = isDarkTheme();
  const c = palette(dark);

  const chart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: LABELS,
      datasets: [
        {
          label: "Perfil técnico",
          data: VALUES,
          backgroundColor: c.fill,
          borderColor: c.accent,
          borderWidth: 2,
          pointBackgroundColor: c.accent,
          pointBorderColor: c.pointBorder,
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: c.accent,
          pointHoverBorderColor: "#ffffff",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: "nearest" },
      scales: {
        r: {
          min: 0,
          max: 10,
          beginAtZero: true,
          ticks: {
            stepSize: 2,
            color: c.text,
            backdropColor: "transparent",
            font: { family: FONT, size: 9, weight: 500 },
          },
          angleLines: { color: c.angle, lineWidth: 1 },
          grid: { color: c.grid, lineWidth: 1 },
          pointLabels: {
            color: c.text,
            font: { family: FONT, size: 12, weight: 700 },
            padding: 10,
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: c.tooltipBg,
          titleColor: c.tooltipTitle,
          bodyColor: c.tooltipBody,
          borderColor: c.tooltipBorder,
          borderWidth: 1,
          padding: 11,
          displayColors: false,
          titleFont: { family: FONT, size: 13, weight: 700 },
          bodyFont: { family: FONT, size: 12, weight: 500 },
          callbacks: {
            title: (context) => context[0].label,
            label: (context) => `Nível: ${context.raw}/10`,
          },
        },
      },
      animation: { duration: 1400, easing: "easeOutQuart" },
      elements: { line: { tension: 0.15 } },
    },
  });

  canvas.chart = chart;

  // acompanha a troca de tema: só atualiza as cores quando o tema muda de fato
  let lastDark = dark;
  themeObserver = new MutationObserver(() => {
    const now = isDarkTheme();
    if (now === lastDark) return;
    lastDark = now;
    applyPalette(chart, now);
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  window.addEventListener(
    "pagehide",
    () => {
      themeObserver?.disconnect();
      chart.destroy();
      canvas.chart = undefined;
    },
    { once: true },
  );

  requestAnimationFrame(() => canvas.classList.add("visible"));
}
