import { session } from "../core/storage";
import { closeDialog, openDialog } from "../core/dialog";
import { toggleMatrixMode } from "../effects/matrix";
import { showAchievement } from "./achievements";
import { openEmailModal } from "./email";
import { prefersReducedMotion, unlockedAchievements } from "../state";

export function initTerminal() {
  const btn = document.getElementById("terminal-btn");
  const overlay = document.getElementById("terminal-overlay");
  const closeBtn = document.getElementById("terminal-close");
  const input = document.getElementById(
    "terminal-input",
  ) as HTMLInputElement | null;
  const output = document.getElementById("cli-output");

  if (!btn || !overlay || !closeBtn || !input || !output) return;

  setupTerminal({ btn, overlay, closeBtn, input, output });
}

interface TerminalElements {
  btn: HTMLElement;
  overlay: HTMLElement;
  closeBtn: HTMLElement;
  input: HTMLInputElement;
  output: HTMLElement;
}

function setupTerminal({
  btn,
  overlay,
  closeBtn,
  input,
  output,
}: TerminalElements) {
  const history: string[] = [];
  let historyIndex = -1;

  function print(text: string, cls?: string) {
    const line = document.createElement("div");
    line.className = "terminal-line " + (cls || "info");
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function printCmd(text: string) {
    const line = document.createElement("div");
    line.className = "terminal-line cmd";
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function scrollToSection(sel: string) {
    const el = document.querySelector<HTMLElement>(sel);
    if (!el) return;

    closeTerminal();

    setTimeout(
      () =>
        el.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        }),
      250,
    );
  }

  const COMMANDS: Record<string, () => void> = {
    help: () => {
      print("Comandos disponíveis:", "accent");
      [
        "sobre        – quem é o Lucas",
        "skills       – tecnologias que ele usa",
        "projetos     – ver os projetos",
        "experiencia  – linha do tempo profissional",
        "contato      – abrir formulário de contato",
        "curriculo    – baixar o currículo em PDF",
        "github       – abrir perfil do GitHub",
        "tema         – alternar claro/escuro",
        "matrix       – ??? tente e descubra",
        "clear        – limpar a tela",
        "sair         – fechar o terminal",
      ].forEach((l) => print("  " + l));
    },

    ajuda: () => COMMANDS.help(),

    sobre: () => {
      print(
        "Desenvolvedor full stack, apaixonado por criar experiências web bem cuidadas. Abrindo o início...",
        "info",
      );
      scrollToSection("#home");
    },

    about: () => COMMANDS.sobre(),

    skills: () => {
      print(
        "Frontend, Backend, Cloud & DevOps, IA/Automação e mais. Abrindo seção...",
        "info",
      );
      scrollToSection(".skills");
    },

    habilidades: () => COMMANDS.skills(),

    projetos: () => {
      print("Carregando vitrine de projetos...", "info");
      scrollToSection("#projetos");
    },

    projects: () => COMMANDS.projetos(),

    experiencia: () => {
      print("Exibindo linha do tempo profissional...", "info");
      scrollToSection(".timeline");
    },

    timeline: () => COMMANDS.experiencia(),

    swot: () => {
      print("Autoanálise carregada.", "info");
      scrollToSection(".swot-section");
    },

    contato: () => {
      print("Abrindo formulário de contato...", "info");
      closeTerminal();

      setTimeout(() => {
        if (typeof openEmailModal === "function") openEmailModal();
      }, 250);
    },

    contact: () => COMMANDS.contato(),

    curriculo: () => {
      const a = document.querySelector<HTMLElement>("a[download]");

      if (a) {
        print("Iniciando download do currículo em PDF...", "accent");
        a.click();
      } else {
        print("Link de download não encontrado nesta página.", "err");
      }
    },

    resume: () => COMMANDS.curriculo(),
    cv: () => COMMANDS.curriculo(),

    github: () => {
      const link = document.querySelector<HTMLElement>(
        'a[href="https://github.com/tirolasca"]',
      );

      if (link) {
        print("Abrindo github.com/tirolasca...", "info");
        link.click();
      } else {
        print("Link do GitHub não encontrado nesta página.", "err");
      }
    },

    tema: () => {
      const t = document.getElementById("theme-toggle");

      if (t) {
        t.click();
        print("Tema alternado.", "info");
      } else {
        print("Controle de tema não encontrado.", "err");
      }
    },

    theme: () => COMMANDS.tema(),

    matrix: () => {
      print("Ativando protocolo...", "accent");

      if (typeof toggleMatrixMode === "function") toggleMatrixMode();
    },

    whoami: () =>
      print("guest — ninguém precisa de login pra ver um portfólio :)", "info"),

    date: () => print(new Date().toLocaleString("pt-BR"), "info"),

    data: () => COMMANDS.date(),

    clear: () => {
      output.innerHTML = "";
    },

    limpar: () => COMMANDS.clear(),

    exit: () => closeTerminal(),
    sair: () => closeTerminal(),
    quit: () => closeTerminal(),
  };

  function runCommand(raw: string) {
    const trimmed = raw.trim();

    if (!trimmed) return;

    printCmd(trimmed);
    history.push(trimmed);
    historyIndex = history.length;

    const lower = trimmed.toLowerCase();

    if (lower === "sudo hire-me" || lower === "sudo contratar") {
      print("Permissão concedida. Abrindo canal de contato...", "accent");
      closeTerminal();

      setTimeout(() => {
        if (typeof openEmailModal === "function") openEmailModal();
      }, 250);

      return;
    }

    if (lower === "neo") {
      print("Acesso concedido ao núcleo do sistema...", "accent");
      print(" ╔══════════════════════════════╗", "info");
      print(" ║     BEM-VINDO(A) AO CORE      ║", "info");
      print(" ╚══════════════════════════════╝", "info");
      print("Estatísticas não-oficiais deste portfólio:", "info");
      print("  → commits feitos sem saber exatamente o que mudou: 47", "info");
      print('  → vezes que "funciona na minha máquina" foi dito: 312', "info");
      print("  → bugs que na verdade eram features: incontáveis", "info");
      print(
        "  → pesquisas no Stack Overflow que salvaram o projeto: confidencial",
        "info",
      );

      if (!unlockedAchievements.has("a-neo")) {
        unlockedAchievements.add("a-neo");
        session.set("achievements", JSON.stringify([...unlockedAchievements]));

        setTimeout(
          () =>
            showAchievement(
              "fa-user-secret",
              "Acordou, Neo?",
              "Você encontrou o comando secreto do terminal",
              80,
            ),
          600,
        );
      }

      return;
    }

    const cmd = lower.split(/\s+/)[0];

    if (COMMANDS[cmd]) {
      COMMANDS[cmd]();
      return;
    }

    print(
      'comando não encontrado: "' +
        cmd +
        '". digite "help" para ver os comandos.',
      "err",
    );
  }

  function openTerminal() {
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");

    if (!output.children.length) {
      print(
        "Sistema iniciado. Bem-vindo(a) ao terminal do portfólio.",
        "accent",
      );
      print('Digite "help" para ver os comandos disponíveis.', "info");
    }

    openDialog(overlay, input, btn);

    if (!unlockedAchievements.has("a-terminal")) {
      unlockedAchievements.add("a-terminal");
      session.set("achievements", JSON.stringify([...unlockedAchievements]));

      showAchievement(
        "fa-terminal",
        "Acesso Concedido!",
        "Você encontrou o terminal secreto",
        60,
      );
    }
  }

  function closeTerminal() {
    if (!overlay.classList.contains("open")) return;

    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");

    closeDialog(overlay);

    // Restaura o foco ao botão que abriu o terminal.
    // O próximo frame permite que o fechamento seja aplicado primeiro.
    requestAnimationFrame(() => {
      if (btn.isConnected && !btn.hasAttribute("disabled")) {
        btn.focus();
      }
    });
  }

  btn.addEventListener("click", openTerminal);
  closeBtn.addEventListener("click", closeTerminal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeTerminal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) {
      closeTerminal();
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      runCommand(input.value);
      input.value = "";
    } else if (e.key === "ArrowUp") {
      e.preventDefault();

      if (history.length) {
        historyIndex = Math.max(0, historyIndex - 1);
        input.value = history[historyIndex] || "";
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();

      if (history.length) {
        historyIndex = Math.min(history.length, historyIndex + 1);
        input.value = history[historyIndex] || "";
      }
    }
  });
}
