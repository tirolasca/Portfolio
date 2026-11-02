import Chart from "chart.js/auto";

type SwotCanvas = HTMLCanvasElement & { chart?: Chart };

export function initSwotChart() {
  const canvas = document.getElementById("swotChart") as SwotCanvas | null;

  if (!canvas || typeof Chart === "undefined") return;

  if (canvas.chart) {
    canvas.chart.destroy();
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const isDarkTheme = document.body.classList.contains("dark");

  const radarTextColor = isDarkTheme ? "#ffffff" : "#15b8c4";

  const radarTickColor = isDarkTheme ? "#ffffff" : "#15b8c4";

  const gridColor = isDarkTheme
    ? "rgba(190, 220, 225, 0.13)"
    : "rgba(0, 0, 0, 0.10)";

  const angleColor = isDarkTheme
    ? "rgba(190, 220, 225, 0.15)"
    : "rgba(0, 0, 0, 0.10)";

  const tooltipBackground = isDarkTheme
    ? "rgba(5, 15, 20, 0.97)"
    : "rgba(255, 255, 255, 0.97)";

  const tooltipTitleColor = isDarkTheme ? "#ffffff" : "#1a202c";

  const tooltipBodyColor = isDarkTheme ? "#d7e1e5" : "#4a5568";

  const tooltipBorderColor = isDarkTheme
    ? "rgba(0, 255, 224, 0.35)"
    : "rgba(0, 191, 174, 0.25)";

  const labels = [
    "Frontend",
    "Backend",
    "APIs",
    "Banco de Dados",
    "Cloud",
    "DevOps",
    "Mobile",
    "IA & Automação",
  ];

  const values = [8.5, 8, 8.5, 7.5, 5.5, 5, 6.5, 8];

  const chart = new Chart(ctx, {
    type: "radar",

    data: {
      labels,

      datasets: [
        {
          label: "Perfil técnico",
          data: values,

          backgroundColor: isDarkTheme
            ? "rgba(0, 255, 224, 0.10)"
            : "rgba(0, 191, 174, 0.10)",

          borderColor: isDarkTheme ? "#00ffe0" : "#00bfae",

          borderWidth: 2,

          pointBackgroundColor: isDarkTheme ? "#00ffe0" : "#00bfae",

          pointBorderColor: isDarkTheme ? "#061116" : "#ffffff",

          pointBorderWidth: 2,

          pointRadius: 4,
          pointHoverRadius: 7,

          pointHoverBackgroundColor: isDarkTheme ? "#00ffe0" : "#00bfae",

          pointHoverBorderColor: "#ffffff",

          fill: true,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      interaction: {
        intersect: false,
        mode: "nearest",
      },

      scales: {
        r: {
          min: 0,
          max: 10,
          beginAtZero: true,

          ticks: {
            stepSize: 2,
            color: radarTickColor,
            backdropColor: "transparent",

            font: {
              family: "'Inter', sans-serif",
              size: 9,
              weight: 500,
            },
          },

          angleLines: {
            color: angleColor,
            lineWidth: 1,
          },

          grid: {
            color: gridColor,
            lineWidth: 1,
          },

          pointLabels: {
            color: radarTextColor,

            font: {
              family: "'Inter', sans-serif",
              size: 12,
              weight: 700,
            },

            padding: 10,
          },
        },
      },

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          backgroundColor: tooltipBackground,

          titleColor: tooltipTitleColor,

          bodyColor: tooltipBodyColor,

          borderColor: tooltipBorderColor,

          borderWidth: 1,

          padding: 11,

          displayColors: false,

          titleFont: {
            family: "'Inter', sans-serif",
            size: 13,
            weight: 700,
          },

          bodyFont: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: 500,
          },

          callbacks: {
            title: (context) => context[0].label,

            label: (context) => `Nível: ${context.raw}/10`,
          },
        },
      },

      animation: {
        duration: 1400,
        easing: "easeOutQuart",
      },

      elements: {
        line: {
          tension: 0.15,
        },
      },
    },
  });

  canvas.chart = chart;

  requestAnimationFrame(() => {
    canvas.classList.add("visible");
  });
}
