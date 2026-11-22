import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// O Chart.js só desenha num <canvas> real; aqui o contexto 2D é um proxy que
// aceita qualquer chamada. O objetivo é pegar o erro clássico de tree-shaking:
// esquecer de registrar um controller/escala/plugin e o gráfico quebrar no
// `new Chart(...)` ("radar is not a registered controller").
function fakeContext(canvas: HTMLCanvasElement) {
  const noop = () => undefined;
  return new Proxy({ canvas } as Record<string | symbol, unknown>, {
    get(target, prop) {
      if (prop in target) return target[prop];
      // o Chart.js testa `item.length` para saber se recebeu uma lista
      if (prop === "length" || typeof prop === "symbol") return undefined;
      if (prop === "measureText") return () => ({ width: 10 });
      if (prop === "createLinearGradient")
        return () => ({ addColorStop: noop });
      return noop;
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    },
  });
}

describe("gráfico SWOT (Chart.js com registro mínimo)", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div><canvas id="swotChart"></canvas></div>';
    const canvas = document.getElementById("swotChart") as HTMLCanvasElement;
    canvas.getContext = (() =>
      fakeContext(canvas)) as unknown as HTMLCanvasElement["getContext"];
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  it("cria o radar com 8 eixos e expõe a instância no canvas", async () => {
    const { initSwotChart } = await import("./swot-chart");
    initSwotChart();

    const canvas = document.getElementById("swotChart") as HTMLCanvasElement & {
      chart?: { config: { type: string }; data: { labels: string[] } };
    };
    expect(canvas.chart).toBeDefined();
    expect(canvas.chart!.config.type).toBe("radar");
    expect(canvas.chart!.data.labels).toHaveLength(8);
    expect(canvas.classList.contains("visible")).toBe(true);
  });

  it("não quebra ao reinicializar (sem instância duplicada)", async () => {
    const { initSwotChart } = await import("./swot-chart");
    initSwotChart();
    expect(() => initSwotChart()).not.toThrow();
  });
});
