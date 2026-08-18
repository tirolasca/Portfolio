function googleTranslateElementInit() {
  return new google.translate.TranslateElement(
    {
      pageLanguage: "pt",
      includedLanguages: "en,es,pt",
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false,
    },
    "google_translate_element",
  );
}
(function () {
  const s = document.createElement("script");
  s.src =
    "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  s.async = true;
  document.body.appendChild(s);
})();

let mouseX = 0,
  mouseY = 0;
let matrixMode = false;
let logoClickCount = 0,
  logoClickTimer = null;
const unlockedAchievements = new Set(
  JSON.parse(sessionStorage.getItem("achievements") || "[]"),
);
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

function secureRandom() {
  if (window.crypto && typeof window.crypto.getRandomValues === "function") {
    const buffer = new Uint32Array(1);
    window.crypto.getRandomValues(buffer);
    return buffer[0] / 0x100000000;
  }
  return Math.random();
}

const ALL_ACHIEVEMENTS = [
  {
    id: "a-hero",
    selector: "#home",
    icon: "fa-solid fa-house-user",
    title: "Bem-vindo!",
    desc: "Portfólio carregado com sucesso",
    xp: 10,
    secret: false,
  },
  {
    id: "a-skills",
    selector: ".skills",
    icon: "fa-bolt",
    title: "Stack Desbloqueada!",
    desc: "+15 tecnologias descobertas",
    xp: 25,
    secret: false,
  },
  {
    id: "a-projects",
    selector: "#projetos",
    icon: "fa-rocket",
    title: "Projetos Explorados!",
    desc: "Confira o que já foi construído",
    xp: 30,
    secret: false,
  },
  {
    id: "a-swot",
    selector: ".swot-section",
    icon: "fa-brain",
    title: "Análise SWOT!",
    desc: "Autoconhecimento nível máximo",
    xp: 20,
    secret: false,
  },
  {
    id: "a-contact",
    selector: "#contato",
    icon: "fa-bullseye",
    title: "Missão Completa!",
    desc: "Pronto para colaborar?",
    xp: 50,
    secret: false,
  },
  {
    id: "a-timeline",
    selector: ".timeline",
    icon: "fa-calendar-days",
    title: "Linha do Tempo!",
    desc: "Experiências profissionais reveladas",
    xp: 35,
    secret: false,
  },
  {
    id: "a-konami",
    selector: null,
    icon: "fa-dragon",
    title: "Modo Matrix!",
    desc: "Você hackeou o controle de luz e trevas!",
    xp: 100,
    secret: true,
  },
  {
    id: "a-logo",
    selector: null,
    icon: "fa-rotate",
    title: "Segredo da Logo!",
    desc: "Você clicou 5x na logo",
    xp: 75,
    secret: true,
  },
  {
    id: "a-terminal",
    selector: null,
    icon: "fa-terminal",
    title: "Acesso Concedido!",
    desc: "Você encontrou o terminal secreto",
    xp: 60,
    secret: true,
  },
  {
    id: "a-neo",
    selector: null,
    icon: "fa-user-secret",
    title: "Acordou, Neo?",
    desc: "Você encontrou o comando secreto do terminal",
    xp: 80,
    secret: true,
  },
];
const MAX_XP = ALL_ACHIEVEMENTS.reduce((s, a) => s + a.xp, 0);

document.addEventListener("DOMContentLoaded", () => {
  if (typeof AOS !== "undefined")
    AOS.init({
      once: true,
      duration: 800,
      offset: 50,
      disable: prefersReducedMotion,
    });

  const toggle = document.getElementById("theme-toggle");
  const icon =
    document.getElementById("theme-icon") ||
    (toggle ? toggle.querySelector("i") : null);
  if (icon) icon.style.transition = "transform 0.2s ease, opacity 0.2s ease";

  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      if (icon) {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
      }
    } else {
      document.documentElement.classList.remove("dark");
      if (icon) {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
      }
    }
  };

  applyTheme(localStorage.getItem("theme") === "dark" ? "dark" : "light");

  if (toggle) {
    toggle.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle("dark");
      const t = isDark ? "dark" : "light";
      localStorage.setItem("theme", t);
      if (icon) {
        icon.style.opacity = "0";
        icon.style.transform = "rotate(90deg)";
        setTimeout(() => {
          applyTheme(t);
          icon.style.opacity = "1";
          icon.style.transform = "rotate(0deg)";
        }, 200);
      }
    });
  }

  let scrollTimeout;
  const progress = document.getElementById("reading-progress");
  window.addEventListener("scroll", () => {
    document.documentElement.classList.add("show-scrollbar");
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(
      () => document.documentElement.classList.remove("show-scrollbar"),
      800,
    );
    if (progress) {
      const s = document.documentElement.scrollTop || document.body.scrollTop;
      const h =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      progress.style.width = (s / h) * 100 + "%";
    }
    if (typeof updateSideNavDots === "function") updateSideNavDots();
  });

  const dot = document.querySelector(".cursor-dot");
  const outline = document.querySelector(".cursor-outline");
  const glowCards = document.querySelectorAll(".glow-card");
  let ticking = false;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (dot && outline) {
          dot.style.left = `${mouseX}px`;
          dot.style.top = `${mouseY}px`;
          outline.style.left = `${mouseX}px`;
          outline.style.top = `${mouseY}px`;
        }
        glowCards.forEach((card) => {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--mouse-x", `${mouseX - r.left}px`);
          card.style.setProperty("--mouse-y", `${mouseY - r.top}px`);
        });
        ticking = false;
      });
      ticking = true;
    }
  });

  document
    .querySelectorAll("a, button, .social-btn, .toggle-btn")
    .forEach((el) => {
      el.addEventListener("mouseenter", () =>
        document.body.classList.add("cursor-active"),
      );
      el.addEventListener("mouseleave", () =>
        document.body.classList.remove("cursor-active"),
      );
    });

  if (
    typeof Swiper !== "undefined" &&
    document.querySelector(".projects-swiper")
  ) {
    const projectsSwiper = new Swiper(".projects-swiper", {
      slidesPerView: 2,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 3200,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      speed: 600,
      navigation: { prevEl: ".projects-prev", nextEl: ".projects-next" },
      breakpoints: { 0: { slidesPerView: 1 }, 769: { slidesPerView: 2 } },
    });

    if (projectsSwiper) {
      projectsSwiper.update();
    }
  }

  initTypewriter();
  initBackToTop();
  initTerminal();
  initSkillConstellation();
  initScrollSpy();
  initTimelineProgress();
  initSkillProjectLink();
  initGithubActivity();
  initOnboardingTour();
  initSummaryMode();
  initSwotChart();
  initTimelineToggle();
  initIntersectionObserver();
  init3DTilt();
  initMagneticButtons();
  initScrambleText();
  initNetworkCanvas();
  initAudioFeedback();
  initGithubModal();
  initBootSequence();

  initRipple();
  initFloatingTags();
  initSideNavDots();
  initAchievements();
  initAchievementsDrawer();
  initKonamiCode();
  initClickParticles();
  initParallax();
  initLogoSecret();
  initStatsCounters();

  initEmailModal();
  initProgressBars();
  initGlowPointerTracking();
  initKeyboardShortcuts();
  initSectionTitles();
});

function initTypewriter() {
  const textEl = document.getElementById("typewriter");
  if (textEl) {
    const phrases = [
      "Desenvolvedor de Software",
      "Especialista Full Stack",
      "Entusiasta de IoT",
      "Estudante de DSM",
    ];
    let i = 0,
      j = 0,
      currentPhrase = [],
      isDeleting = false;
    function loop() {
      const phrase = phrases[i];
      if (!isDeleting && j <= phrase.length) {
        currentPhrase.push(phrase[j++]);
        textEl.innerHTML = currentPhrase.join("");
      } else if (isDeleting && j >= 0) {
        currentPhrase.pop();
        j--;
        textEl.innerHTML = currentPhrase.join("");
      }
      let speed = isDeleting ? 40 : 120;
      if (!isDeleting && j === phrase.length) {
        isDeleting = true;
        speed = 2000;
      } else if (isDeleting && j === 0) {
        isDeleting = false;
        i = (i + 1) % phrases.length;
        speed = 500;
      }
      setTimeout(loop, speed);
    }
    loop();
  }
}

function initBackToTop() {
  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("visible", window.scrollY > 200);
      const safe = Math.max(
        20,
        document.body.offsetHeight - (window.scrollY + window.innerHeight + 50),
      );
      backToTop.style.bottom = safe + "px";
    });
    backToTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

function initTerminal() {
  const btn = document.getElementById("terminal-btn");
  const overlay = document.getElementById("terminal-overlay");
  const closeBtn = document.getElementById("terminal-close");
  const input = document.getElementById("terminal-input");
  const output = document.getElementById("cli-output");
  if (!btn || !overlay || !input || !output) return;

  const history = [];
  let historyIndex = -1;

  function print(text, cls) {
    const line = document.createElement("div");
    line.className = "terminal-line " + (cls || "info");
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }
  function printCmd(text) {
    const line = document.createElement("div");
    line.className = "terminal-line cmd";
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }
  function scrollToSection(sel) {
    const el = document.querySelector(sel);
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

  const COMMANDS = {
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
      const a = document.querySelector("a[download]");
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
      const link = document.querySelector(
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

  function runCommand(raw) {
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
      print("  → xícaras de café consumidas: 8.742", "info");
      print('  → vezes que "funciona na minha máquina" foi dito: 312', "info");
      print("  → bugs que na verdade eram features: incontáveis", "info");
      print(
        "  → linhas de CSS pra centralizar uma div: mais do que devia",
        "info",
      );
      if (!unlockedAchievements.has("a-neo")) {
        unlockedAchievements.add("a-neo");
        sessionStorage.setItem(
          "achievements",
          JSON.stringify([...unlockedAchievements]),
        );
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
    setTimeout(() => input.focus(), 200);

    if (!unlockedAchievements.has("a-terminal")) {
      unlockedAchievements.add("a-terminal");
      sessionStorage.setItem(
        "achievements",
        JSON.stringify([...unlockedAchievements]),
      );
      showAchievement(
        "fa-terminal",
        "Acesso Concedido!",
        "Você encontrou o terminal secreto",
        60,
      );
    }
  }
  function closeTerminal() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
  }

  btn.addEventListener("click", openTerminal);
  closeBtn.addEventListener("click", closeTerminal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeTerminal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open"))
      closeTerminal();
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

function initSkillConstellation() {
  const groups = document.querySelectorAll(".skill-card, .skill-category");
  if (!groups.length) return;

  groups.forEach((group) => {
    const badges = group.querySelectorAll(".skill-badges img");
    if (badges.length < 2) return;

    const canvas = document.createElement("canvas");
    canvas.className = "skills-constellation";
    canvas.setAttribute("aria-hidden", "true");
    group.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    function resize() {
      const rect = group.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
    resize();
    window.addEventListener("resize", resize);

    function getCenter(el) {
      const r = el.getBoundingClientRect();
      const gRect = group.getBoundingClientRect();
      return {
        x: r.left - gRect.left + r.width / 2,
        y: r.top - gRect.top + r.height / 2,
      };
    }

    function colors() {
      const dark = document.documentElement.classList.contains("dark");
      return dark
        ? {
            line: "rgba(0,255,224,0.55)",
            dot: "rgba(0,255,224,0.9)",
            glow: "rgba(0,255,224,0.65)",
          }
        : {
            line: "rgba(0,191,174,0.55)",
            dot: "rgba(0,191,174,0.9)",
            glow: "rgba(0,200,180,0.55)",
          };
    }

    let rafId = null,
      dashOffset = 0,
      hovered = null;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!hovered) return;
      const c = colors();
      const hCenter = getCenter(hovered);
      const others = Array.from(badges)
        .filter((b) => b !== hovered)
        .map((b) => ({ center: getCenter(b) }))
        .map((o) => ({
          center: o.center,
          dist: Math.hypot(o.center.x - hCenter.x, o.center.y - hCenter.y),
        }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 3);

      others.forEach(({ center }) => {
        ctx.beginPath();
        ctx.moveTo(hCenter.x, hCenter.y);
        ctx.lineTo(center.x, center.y);
        ctx.strokeStyle = c.line;
        ctx.lineWidth = 1.4;
        if (!prefersReducedMotion) {
          ctx.setLineDash([4, 4]);
          ctx.lineDashOffset = -dashOffset;
        } else {
          ctx.setLineDash([]);
        }
        ctx.shadowBlur = 6;
        ctx.shadowColor = c.glow;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(center.x, center.y, 2.8, 0, Math.PI * 2);
        ctx.shadowBlur = 0;
        ctx.fillStyle = c.dot;
        ctx.fill();
      });

      ctx.beginPath();
      ctx.arc(hCenter.x, hCenter.y, 3.4, 0, Math.PI * 2);
      ctx.fillStyle = c.dot;
      ctx.fill();
    }

    function loop() {
      dashOffset = (dashOffset + 0.35) % 8;
      draw();
      rafId = requestAnimationFrame(loop);
    }

    badges.forEach((img) => {
      img.addEventListener("mouseenter", () => {
        hovered = img;
        if (prefersReducedMotion) {
          draw();
        } else {
          if (rafId) cancelAnimationFrame(rafId);
          loop();
        }
      });
      img.addEventListener("mouseleave", () => {
        hovered = null;
        if (rafId) cancelAnimationFrame(rafId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      });
    });
  });
}

function initScrollSpy() {
  const navLinks = Array.from(
    document.querySelectorAll(".main-nav .nav-link[href^='#']"),
  );
  if (!navLinks.length) return;

  const pairs = navLinks
    .map((link) => ({
      link,
      section: document.querySelector(link.getAttribute("href")),
    }))
    .filter((p) => p.section);
  if (!pairs.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const pair = pairs.find((p) => p.section === entry.target);
        if (!pair) return;
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("active"));
          pair.link.classList.add("active");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
  );

  pairs.forEach((p) => observer.observe(p.section));
}

function initTimelineProgress() {
  const timeline = document.querySelector(".timeline");
  if (!timeline) return;

  let ticking = false;
  function update() {
    const rect = timeline.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height + vh * 0.5;
    const scrolled = vh * 0.75 - rect.top;
    const progress = Math.min(1, Math.max(0, scrolled / total));
    timeline.style.setProperty("--timeline-fill", progress * 100 + "%");
    ticking = false;
  }
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
}

function normalize(str) {
  return (str || "").toLowerCase().replace(/[^a-z0-9.]/g, "");
}

function initSkillProjectLink() {
  const badges = document.querySelectorAll(".skill-badges img");
  const cards = document.querySelectorAll(".project-card[data-tech]");
  if (!badges.length || !cards.length) return;

  badges.forEach((badge) => {
    badge.style.cursor = "pointer";
    badge.addEventListener("click", () => {
      const skill = normalize(badge.alt);
      if (!skill) return;

      const matches = Array.from(cards).filter((card) =>
        (card.dataset.tech || "")
          .split(",")
          .some((t) => normalize(t) === skill),
      );

      cards.forEach((c) => c.classList.remove("tech-highlighted"));

      if (!matches.length) {
        showHintToast(`Nenhum projeto em destaque usa ${badge.alt} ainda.`);
        return;
      }

      matches.forEach((c) => c.classList.add("tech-highlighted"));
      const plural = matches.length > 1;
      showHintToast(
        `${matches.length} projeto${plural ? "s" : ""} usa${plural ? "m" : ""} ${badge.alt} — veja em Projetos.`,
      );

      const projectsSection = document.getElementById("projetos");
      if (projectsSection) {
        projectsSection.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }

      clearTimeout(window.__techHighlightTimer);
      window.__techHighlightTimer = setTimeout(() => {
        cards.forEach((c) => c.classList.remove("tech-highlighted"));
      }, 4000);
    });
  });
}

async function initGithubActivity() {
  const pill = document.getElementById("gh-activity-pill");
  const text = document.getElementById("gh-activity-text");
  if (!pill || !text) return;
  try {
    const r = await fetch(
      "https://api.github.com/users/tirolasca/events/public",
    );
    if (!r.ok) throw new Error("fail");
    const events = await r.json();
    if (!Array.isArray(events) || !events.length) {
      pill.style.display = "none";
      return;
    }
    const last = new Date(events[0].created_at);
    const days = Math.floor((Date.now() - last.getTime()) / 86400000);
    let label;
    if (days <= 0) label = "hoje";
    else if (days === 1) label = "ontem";
    else label = `há ${days} dias`;
    text.textContent = `Ativo no GitHub — última atividade ${label}`;
    pill.classList.add("loaded");
  } catch {
    pill.style.display = "none";
  }
}

function initOnboardingTour() {
  const TOUR_ALWAYS_SHOW = false;

  if (!TOUR_ALWAYS_SHOW && localStorage.getItem("tourSeen")) return;

  const steps = [
    {
      selector: "#home",
      title: "Bem-vindo(a)! 👋",
      text: "Esse é o início — aqui você me conhece rapidinho e já pode baixar meu currículo ou chamar no WhatsApp.",
    },
    {
      selector: "#titulo",
      title: "Habilidades",
      text: "Aqui estão as tecnologias que uso no dia a dia. Você também pode interagir com as badges para descobrir os projetos relacionados.",
    },
    {
      selector: "#projetos",
      title: "Projetos",
      text: "Aqui estão alguns dos projetos que já desenvolvi, com acesso ao código e às versões publicadas.",
    },
    {
      selector: "#contato",
      title: "Vamos conversar?",
      text: "Nesta seção você encontra o formulário de contato e minhas principais formas de contato.",
    },
  ];

  const validSteps = steps.filter((step) =>
    document.querySelector(step.selector),
  );

  if (!validSteps.length) return;

  const prompt = document.createElement("div");
  prompt.className = "tour-prompt";

  prompt.innerHTML = `
    <p>
      👋 Primeira vez por aqui?
      Posso te mostrar os destaques em uns 20 segundos.
    </p>

    <div class="tour-prompt-actions">
      <button type="button" class="btn primary tour-start-btn">
        Sim, mostra!
      </button>

      <button type="button" class="btn outline tour-skip-btn">
        Não, obrigado
      </button>
    </div>
  `;

  document.body.appendChild(prompt);

  requestAnimationFrame(() => {
    setTimeout(() => {
      prompt.classList.add("show");
    }, 1200);
  });

  const startBtn = prompt.querySelector(".tour-start-btn");
  const skipBtn = prompt.querySelector(".tour-skip-btn");

  function removePrompt() {
    prompt.classList.remove("show");

    setTimeout(() => {
      if (prompt.isConnected) {
        prompt.remove();
      }
    }, 400);
  }

  function dismissPrompt() {
    localStorage.setItem("tourSeen", "1");
    removePrompt();
  }

  skipBtn.addEventListener("click", dismissPrompt);

  startBtn.addEventListener("click", () => {
    removePrompt();

    setTimeout(() => {
      startTour();
    }, 250);
  });

  function startTour() {
    let currentStep = 0;

    const card = document.createElement("div");
    card.className = "tour-card";

    document.body.appendChild(card);

    function clearHighlight() {
      document.querySelectorAll(".tour-highlight").forEach((element) => {
        element.classList.remove("tour-highlight");
      });
    }

    function finishTour() {
      clearHighlight();

      card.classList.remove("show");

      localStorage.setItem("tourSeen", "1");

      setTimeout(() => {
        if (card.isConnected) {
          card.remove();
        }
      }, 400);
    }

    function renderStep() {
      clearHighlight();

      const step = validSteps[currentStep];

      if (!step) {
        finishTour();
        return;
      }

      const target = document.querySelector(step.selector);

      if (!target) {
        finishTour();
        return;
      }

      target.classList.add("tour-highlight");

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "center",
      });

      card.classList.remove("show");

      card.innerHTML = `
        <div class="tour-card-step">
          ${currentStep + 1} / ${validSteps.length}
        </div>

        <h5>${step.title}</h5>

        <p>${step.text}</p>

        <div class="tour-card-actions">

          ${
            currentStep > 0
              ? `
                <button
                  type="button"
                  class="btn outline tour-prev-btn"
                >
                  Voltar
                </button>
              `
              : ""
          }

          <button
            type="button"
            class="btn primary tour-next-btn"
          >
            ${currentStep === validSteps.length - 1 ? "Concluir" : "Próximo"}
          </button>

          <button
            type="button"
            class="tour-end-link"
          >
            Pular tour
          </button>

        </div>
      `;

      requestAnimationFrame(() => {
        setTimeout(() => {
          card.classList.add("show");
        }, 150);
      });

      const nextBtn = card.querySelector(".tour-next-btn");

      nextBtn.addEventListener("click", () => {
        currentStep++;

        if (currentStep >= validSteps.length) {
          finishTour();
          return;
        }

        renderStep();
      });

      const prevBtn = card.querySelector(".tour-prev-btn");

      if (prevBtn) {
        prevBtn.addEventListener("click", () => {
          if (currentStep > 0) {
            currentStep--;
            renderStep();
          }
        });
      }

      const endBtn = card.querySelector(".tour-end-link");

      endBtn.addEventListener("click", finishTour);
    }

    renderStep();
  }
}

function initSummaryMode() {
  const trigger = document.getElementById("summary-mode-btn");
  if (!trigger) return;

  function buildModal() {
    const overlay = document.createElement("div");
    overlay.id = "summary-modal-overlay";
    overlay.className = "summary-modal-overlay";
    overlay.innerHTML = `
      <div class="summary-modal" role="dialog" aria-modal="true" aria-label="Resumo rápido">
        <button class="summary-modal-close" aria-label="Fechar"><i class="fa-solid fa-xmark"></i></button>
        <div class="summary-modal-body" id="summary-modal-body"></div>
      </div>
    `;
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeSummary();
    });
    overlay
      .querySelector(".summary-modal-close")
      .addEventListener("click", closeSummary);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("active"))
        closeSummary();
    });
    document.body.appendChild(overlay);
    return overlay;
  }

  function closeSummary() {
    const overlay = document.getElementById("summary-modal-overlay");
    if (overlay) overlay.classList.remove("active");
  }

function populate(overlay) {
  const body = overlay.querySelector("#summary-modal-body");

  const name =
    document.querySelector(".brand-text h1")?.textContent?.trim() ||
    "Lucas Santos";

  const role =
    document.querySelector(".brand-text .job")?.textContent?.trim() || "";

  const skills = Array.from(
    document.querySelectorAll(".skills .skill-badges img"),
  )
    .slice(0, 8)
    .map((img) => ({
      name: img.alt,
      image: img.src,
    }));

  const projects = Array.from(
    document.querySelectorAll(".projects .project-card"),
  )
    .slice(0, 3)
    .map((card) => ({
      title: card.querySelector("h4")?.textContent?.trim() || "",
      link:
        card.querySelector(".project-links a[href^='http']")?.href || "#",
    }));

  body.innerHTML = `
    <h3>${name}</h3>
    <p class="summary-role">${role}</p>

    <div class="summary-block">
      <h6>Principais skills</h6>

      <div class="summary-skills">
        ${skills
          .map(
            (skill) => `
              <img
                src="${skill.image}"
                alt="${skill.name}"
                title="${skill.name}"
              >
            `,
          )
          .join("")}
      </div>
    </div>

    <div class="summary-block">
      <h6>Projetos em destaque</h6>

      <ul class="summary-projects">
        ${projects
          .map(
            (p) =>
              `<li><a href="${p.link}" target="_blank" rel="noopener">${p.title}</a></li>`,
          )
          .join("")}
      </ul>
    </div>

    <div class="summary-actions">
      <a
        href="Lucas Santos - Currículo.pdf"
        download="Lucas Santos - Currículo.pdf"
        class="btn primary"
      >
        <i class="fa-solid fa-download"></i> Currículo
      </a>

      <a
        href="#contato"
        class="btn outline"
        id="summary-contact-link"
      >
        <i class="fa-solid fa-paper-plane"></i> Contato
      </a>
    </div>
  `;

  const contactLink = body.querySelector("#summary-contact-link");

  if (contactLink) {
    contactLink.addEventListener("click", closeSummary);
  }
}

  trigger.addEventListener("click", () => {
    let overlay = document.getElementById("summary-modal-overlay");
    if (!overlay) overlay = buildModal();
    populate(overlay);
    requestAnimationFrame(() => overlay.classList.add("active"));
  });
}

function initSwotChart() {
  const swotCanvas = document.getElementById("swotChart");
  if (swotCanvas && typeof Chart !== "undefined") {
    const ctx = swotCanvas.getContext("2d");
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = "#a0aab2";
    const swotChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Forças", "Fraquezas", "Oportunidades", "Ameaças"],
        datasets: [
          {
            data: [8, 4, 7, 3],
            backgroundColor: [
              "rgba(0,255,224,0.6)",
              "rgba(255,111,145,0.6)",
              "rgba(255,209,102,0.6)",
              "rgba(159,181,255,0.6)",
            ],
            borderColor: ["#00ffe0", "#ff6f91", "#ffd166", "#9fb5ff"],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(0,0,0,0.8)",
            padding: 10,
            displayColors: false,
          },
        },
        scales: {
          y: { beginAtZero: true, grid: { color: "rgba(255,255,255,0.05)" } },
          x: { grid: { display: false } },
        },
        animation: { duration: 2000, easing: "easeOutQuart" },
      },
    });
    swotCanvas.chart = swotChart;
    setTimeout(() => swotCanvas.classList.add("visible"), 300);
  }
}

function initTimelineToggle() {
  document.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const details = btn
        .closest(".timeline-content")
        ?.querySelector(".details");
      if (details) {
        const open = details.classList.toggle("show");
        details.style.maxHeight = open ? details.scrollHeight + "px" : null;
        btn.textContent = open ? "Ocultar detalhes" : "Ver mais detalhes";
      }
    });
  });
}

function initIntersectionObserver() {
  const fadeEls = document.querySelectorAll(
    ".fade-up,.card,.skill-card,.project-card,.swot-card",
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  fadeEls.forEach((el) => observer.observe(el));
}

function init3DTilt() {
  document.querySelectorAll(".glow-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -10;
      const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 10;
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)";
    });
  });
}

function initMagneticButtons() {
  document.querySelectorAll(".social-btn,.btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.3}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0,0)";
    });
  });
}

function scramble(t) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
  let it = 0;
  const orig = t.dataset.value;
  if (!orig) return;
  clearInterval(t.interval);
  t.interval = setInterval(() => {
    t.innerText = orig
      .split("")
      .map((l, i) => (i < it ? orig[i] : letters[Math.floor(secureRandom() * letters.length)]))
      .join("");
    if (it >= orig.length) clearInterval(t.interval);
    it += 1 / 3;
  }, 30);
}

function initScrambleText() {
  document.querySelectorAll(".scramble-text").forEach((el) => {
    el.addEventListener("mouseenter", (e) => scramble(e.target));
    setTimeout(() => scramble(el), 500);
  });
}

function initNetworkCanvas() {
  const canvas = document.getElementById("networkCanvas");
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    canvas.width = window.innerWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      initP();
    });
    class Particle {
      constructor() {
        this.x = secureRandom() * canvas.width;
        this.y = secureRandom() * canvas.height;
        this.dx = secureRandom() - 0.5;
        this.dy = secureRandom() - 0.5;
        this.r = secureRandom() * 2 + 1;
        this.color = "rgba(0,255,224,0.6)";
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      update() {
        if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
        if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;
        const ddx = mouseX - this.x,
          ddy = mouseY - this.y,
          dist = Math.hypot(ddx, ddy);
        if (dist < 100) {
          this.x -= ddx / 20;
          this.y -= ddy / 20;
        }
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
      }
    }
    function initP() {
      particles = [];
      for (let i = 0; i < (canvas.width * canvas.height) / 12000; i++)
        particles.push(new Particle());
    }
    function connect() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const d =
            (particles[a].x - particles[b].x) ** 2 +
            (particles[a].y - particles[b].y) ** 2;
          if (d < 8000) {
            ctx.strokeStyle = `rgba(0,255,224,${1 - d / 8000})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }
    function animate() {
      requestAnimationFrame(animate);
      if (document.documentElement.classList.contains("dark")) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => p.update());
        connect();
      }
    }
    initP();
    animate();
  }
}

function initAudioFeedback() {
  let audioCtx = null;
  function initCtx() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {}
    }
    if (audioCtx?.state === "suspended") audioCtx.resume();
  }
  document.body.addEventListener("click", initCtx, { once: true });

  function playHover() {
    if (
      !audioCtx ||
      audioCtx.state === "suspended" ||
      !document.documentElement.classList.contains("dark")
    )
      return;
    const o = audioCtx.createOscillator(),
      g = audioCtx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(800, audioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);
    g.gain.setValueAtTime(0.02, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + 0.05);
  }
  function playClick() {
    if (
      !audioCtx ||
      audioCtx.state === "suspended" ||
      !document.documentElement.classList.contains("dark")
    )
      return;
    const o = audioCtx.createOscillator(),
      g = audioCtx.createGain();
    o.type = "square";
    o.frequency.setValueAtTime(150, audioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);
    g.gain.setValueAtTime(0.05, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + 0.1);
  }
  document
    .querySelectorAll(".btn,.social-btn,.project-card,.skill-card,.toggle-btn")
    .forEach((el) => {
      el.addEventListener("mouseenter", playHover);
      el.addEventListener("click", playClick);
    });
}

function initGithubModal() {
  const githubLinks = document.querySelectorAll(
    'a[href="https://github.com/tirolasca"],a[href="https://github.com/tirolasca/"]',
  );
  const ghModal = document.getElementById("github-modal");
  const closeGh = document.getElementById("close-gh-modal");
  if (!ghModal) return;
  let fetched = false;

  function animateVal(id, end, dur = 1500) {
    const el = document.getElementById(id);
    if (!el) return;
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      el.innerHTML = Math.floor(p * end);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  async function fetchGH() {
    if (fetched) return;
    ghModal.classList.add("gh-loading");
    try {
      const r = await fetch("https://api.github.com/users/tirolasca");
      if (!r.ok) throw new Error("GitHub request failed");
      const d = await r.json();
      document.getElementById("gh-avatar").src = d.avatar_url;
      document.getElementById("gh-bio").innerText =
        d.bio || "Desenvolvedor Full Stack & Redes";
      if (d.location) {
        document.getElementById("gh-location").innerText = d.location;
        document.getElementById("gh-location-container").style.display = "flex";
      }
      if (d.created_at) {
        document.getElementById("gh-joined").innerText =
          `Membro desde ${new Date(d.created_at).getFullYear()}`;
        document.getElementById("gh-joined-container").style.display = "flex";
      }
      animateVal("gh-repos", d.public_repos);
      animateVal("gh-followers", d.followers);
      animateVal("gh-following", d.following);
      fetched = true;
    } catch {
      document.getElementById("gh-bio").innerText = "Sistema offline.";
      ["gh-repos", "gh-followers", "gh-following"].forEach(
        (id) => (document.getElementById(id).innerText = "0"),
      );
    } finally {
      ghModal.classList.remove("gh-loading");
    }
  }

  githubLinks.forEach((link) =>
    link.addEventListener("click", (e) => {
      if (link.classList.contains("gh-btn")) return;
      e.preventDefault();
      ghModal.classList.add("active");
      fetchGH();
    }),
  );
  if (closeGh)
    closeGh.addEventListener("click", () => ghModal.classList.remove("active"));
  if (ghModal)
    ghModal.addEventListener("click", (e) => {
      if (e.target === ghModal) ghModal.classList.remove("active");
    });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && ghModal?.classList.contains("active"))
      ghModal.classList.remove("active");
  });
}

function initBootSequence() {
  const preloader = document.getElementById("cyber-preloader");
  const terminal = document.getElementById("terminal-output");
  if (preloader && terminal) {
    if (sessionStorage.getItem("hasBooted")) {
      preloader.style.display = "none";
      document.body.classList.remove("booting");
      setTimeout(() => showDynamicGreeting(), 500);
    } else {
      if (!document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
        const ic =
          document.getElementById("theme-icon") ||
          document.querySelector("#theme-toggle i");
        if (ic) {
          ic.classList.remove("fa-moon");
          ic.classList.add("fa-sun");
        }
      }
      const logs = [
        { text: "INIT SYSTEM... OK", cls: "log-system" },
        { text: "LOADING KERNEL DSM-5.15.0...", cls: "" },
        { text: "MOUNTING VIRTUAL FILESYSTEM... OK", cls: "log-success" },
        { text: "CHECKING HARDWARE NODES... FOUND 4 CORES", cls: "" },
        {
          text: "INITIALIZING NETWORK INTERFACES... ETH0 UP",
          cls: "log-success",
        },
        {
          text: "WARNING: UNAUTHORIZED PING DETECTED. IGNORING.",
          cls: "log-warning",
        },
        { text: "ESTABLISHING SECURE CONNECTION...", cls: "" },
        { text: "SSL CERTIFICATE VERIFIED.", cls: "log-success" },
        { text: "LOADING USER PROFILE: LUCAS_SANTOS...", cls: "log-system" },
        { text: "FETCHING GITHUB REPOSITORIES... OK", cls: "log-success" },
        { text: "MOUNTING FULL-STACK ASSETS... OK", cls: "log-success" },
        { text: "COMPILING UI/UX MODULES...", cls: "" },
        { text: "STARTING PORTFOLIO DAEMON...", cls: "" },
        { text: "ACCESS GRANTED. WELCOME.", cls: "log-system" },
      ];
      let delay = 0;
      logs.forEach((log) => {
        delay += secureRandom() * 200 + 50;
        setTimeout(() => {
          const p = document.createElement("p");
          p.className = `log-line ${log.cls}`;
          p.textContent = `[ ${(secureRandom() * 2).toFixed(4)} ] ${log.text}`;
          terminal.appendChild(p);
        }, delay);
      });
      setTimeout(() => {
        preloader.classList.add("hidden");
        document.body.classList.remove("booting");
        sessionStorage.setItem("hasBooted", "true");
        setTimeout(() => preloader.remove(), 800);
        setTimeout(() => showDynamicGreeting(), 1200);
      }, delay + 600);
    }
  } else {
    setTimeout(() => showDynamicGreeting(), 800);
  }
}

function initRipple() {
  const rippleTargets = document.querySelectorAll(
    ".btn, .social-btn, .toggle-btn, .theme-toggle, .achievements-btn, .back-to-top",
  );
  rippleTargets.forEach((btn) => {
    if (
      btn.classList.contains("back-to-top") ||
      btn.classList.contains("achievements-btn")
    ) {
      btn.style.overflow = "visible";
    } else {
      btn.style.overflow = "hidden";
    }

    btn.addEventListener("click", function (e) {
      const r = this.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2.2;
      const cx = e.clientX - r.left - size / 2;
      const cy = e.clientY - r.top - size / 2;

      const ripple = document.createElement("span");
      ripple.className = "ripple-effect";
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${cx}px;top:${cy}px;`;
      this.appendChild(ripple);

      const ring = document.createElement("span");
      ring.className = "ripple-ring";
      const rs = size * 0.7;
      ring.style.cssText = `width:${rs}px;height:${rs}px;left:${cx + (size - rs) / 2}px;top:${cy + (size - rs) / 2}px;`;
      this.appendChild(ring);

      setTimeout(() => {
        ripple.remove();
        ring.remove();
      }, 900);
    });
  });
}

const NAV_SECTIONS_INDEX = [
  { id: "home", label: "Início", icon: "fa-house" },
  { id: "titulo", label: "Skills", icon: "fa-bolt" },
  { id: "projetos", label: "Projetos", icon: "fa-rocket" },
  { id: "contato", label: "Contato", icon: "fa-envelope" },
];
const NAV_SECTIONS_CURI = [
  { id: "top", label: "Resumo", icon: "fa-user" },
  { id: "formacao", label: "Formação", icon: "fa-graduation-cap" },
  { id: "experiencias", label: "Experiências", icon: "fa-briefcase" },
  { id: "projetos", label: "Projetos", icon: "fa-rocket" },
  { id: "swot", label: "SWOT", icon: "fa-brain" },
];

function initSideNavDots() {
  const isCuri = !!document.querySelector(".curriculo-page");
  const list = isCuri ? NAV_SECTIONS_CURI : NAV_SECTIONS_INDEX;

  const nav = document.createElement("nav");
  nav.className = "side-nav-dots";
  nav.setAttribute("aria-label", "Navegação por seção");

  list.forEach(({ id, label }) => {
    const target = document.getElementById(id);
    if (!target) return;
    const dot = document.createElement("a");
    dot.className = "side-dot";
    dot.href = `#${id}`;
    dot.dataset.label = label;
    dot.setAttribute("aria-label", label);
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    });
    nav.appendChild(dot);
  });
  document.body.appendChild(nav);

  const bar = document.createElement("nav");
  bar.className = "side-nav-mobile-bar";
  bar.setAttribute("aria-label", "Navegação mobile");

  list.forEach(({ id, label, icon }) => {
    const target = document.getElementById(id);
    if (!target) return;
    const btn = document.createElement("button");
    btn.className = "nav-mobile-btn";
    btn.dataset.id = id;
    btn.setAttribute("aria-label", label);
    btn.innerHTML = `<i class="fa-solid ${icon}"></i><span>${label}</span>`;
    btn.addEventListener("click", () => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    });
    bar.appendChild(btn);
  });
  document.body.appendChild(bar);
}

function updateSideNavDots() {
  const midY = window.innerHeight / 2;

  document.querySelectorAll(".side-dot").forEach((dot) => {
    const id = dot.href.split("#")[1];
    const el = document.getElementById(id);
    if (!el) return;

    const r = el.getBoundingClientRect();
    const isActive = r.top <= midY && r.bottom >= 0;

    if (isActive) {
      if (!dot.classList.contains("active")) {
        dot.classList.add("active", "show-label");

        if (dot.labelTimeout) clearTimeout(dot.labelTimeout);

        dot.labelTimeout = setTimeout(() => {
          dot.classList.remove("show-label");
        }, 3000);
      }
    } else {
      dot.classList.remove("active", "show-label");
    }
  });

  document.querySelectorAll(".nav-mobile-btn").forEach((btn) => {
    const id = btn.dataset.id;
    const el = document.getElementById(id);
    if (!el) return;
    const r = el.getBoundingClientRect();
    btn.classList.toggle("active", r.top <= midY && r.bottom >= 0);
  });
}

function initAchievements() {
  ALL_ACHIEVEMENTS.forEach((ach) => {
    if (!ach.selector) return;
    const el = document.querySelector(ach.selector);
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !unlockedAchievements.has(ach.id)) {
            unlockedAchievements.add(ach.id);
            sessionStorage.setItem(
              "achievements",
              JSON.stringify([...unlockedAchievements]),
            );
            showAchievement(ach.icon, ach.title, ach.desc, ach.xp);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
  });
}

function getTotalXP() {
  return ALL_ACHIEVEMENTS.filter((a) => unlockedAchievements.has(a.id)).reduce(
    (s, a) => s + a.xp,
    0,
  );
}

function updateDrawerBadge() {
  const count = unlockedAchievements.size;
  const badge = document.getElementById("achievements-badge");
  if (badge) {
    badge.textContent = count;
    badge.classList.add("pop");
    setTimeout(() => badge.classList.remove("pop"), 400);
  }
}

const LOCKED_HINTS = {
  "a-hero": "Você já está aqui — aguarde um momento no início da página!",
  "a-skills": "Role até a seção de habilidades e tecnologias para desbloquear.",
  "a-projects": "Explore a seção de projetos para descobrir esta conquista.",
  "a-swot": "A análise SWOT revela muito — role até encontrá-la.",
  "a-contact": "Chegue até o fim do portfólio e veja a seção de contato.",
  "a-timeline": "Role até a linha do tempo de experiências profissionais.",
  "a-konami":
    "O controle de luz e trevas esconde um segredo... segure-o com firmeza.",
  "a-logo": "Clique 5 vezes seguidas na logo do portfólio…",
  "a-terminal":
    "Nem tudo no cabeçalho é o que parece... procure por um ícone diferente.",
  "a-neo": "Dizem que um certo terminal responde a quem pergunta por 'neo'...",
};

function renderAchievementsGrid() {
  const grid = document.getElementById("achievements-grid");
  if (!grid) return;

  grid.innerHTML = ALL_ACHIEVEMENTS.map(renderAchievementCard).join("");

  grid.querySelectorAll(".achievement-card.locked").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      const ach = ALL_ACHIEVEMENTS.find((a) => a.id === id);
      if (!ach) return;
      const hint = LOCKED_HINTS[id] || "Continue explorando!";
      showHintToast(ach.secret ? `🔮 Segredo: ${hint}` : `💡 Dica: ${hint}`);
    });
  });
}

function renderAchievementCard(a) {
  const unlocked = unlockedAchievements.has(a.id);
  const cls = [
    "achievement-card",
    unlocked ? "unlocked" : "locked",
    a.secret ? "secret" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const secretTag = getAchievementSecretTag(a, unlocked);
  const iconHtml = getAchievementIconHtml(a, unlocked);
  const tooltipText = getAchievementTooltipText(a, unlocked);
  const displayTitle = !unlocked && a.secret ? "???" : a.title;
  const displayDesc = unlocked
    ? a.desc
    : a.secret
      ? "Conquista oculta"
      : "Ainda não desbloqueada";
  const displayXP = unlocked
    ? `+${a.xp} XP`
    : a.secret
      ? "??? XP"
      : `${a.xp} XP`;

  return `
      <div class="${cls}" data-tooltip="${tooltipText}" data-id="${a.id}">
        <div class="achievement-card-icon">${iconHtml}</div>
        <div class="achievement-card-title">${displayTitle}</div>
        <div class="achievement-card-desc">${displayDesc}</div>
        <div class="achievement-card-xp">${displayXP}</div>
        ${secretTag}
      </div>`;
}

function getAchievementSecretTag(a, unlocked) {
  if (!a.secret) return "";
  const secretLabel = unlocked ? "✦ Secreto" : "???";
  return `<span class="achievement-card-secret">${secretLabel}</span>`;
}

function getAchievementIconHtml(a, unlocked) {
  if (unlocked) return `<i class="fa-solid ${a.icon}"></i>`;
  if (a.secret) return `<i class="fa-solid fa-question"></i>`;
  return `<i class="fa-solid ${a.icon}" style="opacity:0.35"></i>`;
}

function getAchievementTooltipText(a, unlocked) {
  const hint = LOCKED_HINTS[a.id] || "Continue explorando o portfólio!";
  if (unlocked) return `✓ Desbloqueada: ${a.desc}`;
  return a.secret ? `🔮 Segredo: ${hint}` : `💡 Dica: ${hint}`;
}

function refreshXPBar() {
  const xp = getTotalXP();
  if (document.getElementById("xp-current"))
    document.getElementById("xp-current").textContent = xp;
  if (document.getElementById("xp-max"))
    document.getElementById("xp-max").textContent = MAX_XP;
  if (document.getElementById("xp-unlocked-count"))
    document.getElementById("xp-unlocked-count").textContent =
      unlockedAchievements.size;
  if (document.getElementById("xp-total-count"))
    document.getElementById("xp-total-count").textContent =
      ALL_ACHIEVEMENTS.length;
  const fill = document.getElementById("xp-fill");
  if (fill) fill.style.width = ((xp / MAX_XP) * 100).toFixed(1) + "%";
}

function initAchievementsDrawer() {
  const overlay = document.querySelector(".achievements-overlay");
  const btnOpen = document.getElementById("achievements-toggle");
  const btnClose = overlay
    ? overlay.querySelector(".achievements-close")
    : null;

  if (!overlay || !btnOpen) return;

  function openDrawer() {
    renderAchievementsGrid();
    refreshXPBar();
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  btnOpen.addEventListener("click", openDrawer);
  btnClose?.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeDrawer();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeDrawer();
  });

  updateDrawerBadge();
}

function showAchievement(icon, title, desc, xp) {
  updateDrawerBadge();
  const grid = document.getElementById("achievements-grid");
  if (grid?.children.length) {
    renderAchievementsGrid();
    refreshXPBar();
  }

  const toast = document.createElement("div");
  toast.className = "achievement-toast";
  toast.innerHTML = `
    <div class="achievement-icon"><i class="fa-solid ${icon}"></i></div>
    <div class="achievement-body">
      <div class="achievement-title">${title}</div>
      <div class="achievement-desc">${desc}</div>
    </div>
    <div class="achievement-xp">+${xp} XP</div>
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.add("show");
    });
  });
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 600);
  }, 3500);
}

function initKonamiCode() {
  const themeBtn = document.getElementById("theme-toggle");
  const themeIcon = themeBtn ? themeBtn.querySelector("i") : null;
  if (!themeBtn || !themeIcon) return;

  let pressTimer;
  let visualTimer;
  let isHacking = false;
  let preventNextClick = false;

  themeBtn.addEventListener(
    "click",
    (e) => {
      if (preventNextClick) {
        e.preventDefault();
        e.stopImmediatePropagation();
        preventNextClick = false;
        return;
      }

      if (matrixMode) {
        e.preventDefault();
        e.stopImmediatePropagation();
        toggleMatrixMode();
      }
    },
    true,
  );

  function startHack(e) {
    if (isHacking || matrixMode) return;
    isHacking = true;
    preventNextClick = false;

    visualTimer = setTimeout(() => {
      themeBtn.style.transition = "all 4s linear";
      themeBtn.style.boxShadow = "0 0 30px #8c3cff, inset 0 0 15px #00ffe0";
      themeBtn.style.borderColor = "#8c3cff";
      themeIcon.classList.add("hacking-icon");
    }, 200);

    pressTimer = setTimeout(() => {
      preventNextClick = true;
      resetHackVisuals();
      isHacking = false;

      toggleMatrixMode();
    }, 1500);
  }

  function cancelHack() {
    clearTimeout(pressTimer);
    clearTimeout(visualTimer);

    if (!isHacking) return;
    isHacking = false;
    resetHackVisuals();
  }

  function resetHackVisuals() {
    themeBtn.style.transition = "all 0.3s ease";
    themeBtn.style.boxShadow = "";
    themeBtn.style.borderColor = "";
    themeIcon.classList.remove("hacking-icon");
  }

  themeBtn.addEventListener("mousedown", startHack);
  themeBtn.addEventListener("mouseup", cancelHack);
  themeBtn.addEventListener("mouseleave", cancelHack);

  themeBtn.addEventListener("touchstart", startHack, { passive: true });
  themeBtn.addEventListener("touchend", cancelHack);
  themeBtn.addEventListener("touchcancel", cancelHack);
}

function toggleMatrixMode() {
  matrixMode = !matrixMode;
  if (matrixMode) {
    startMatrix();
    if (!unlockedAchievements.has("a-konami")) {
      unlockedAchievements.add("a-konami");
      sessionStorage.setItem(
        "achievements",
        JSON.stringify([...unlockedAchievements]),
      );
      showAchievement(
        "fa-dragon",
        "Modo Matrix Ativado!",
        "↑↑↓↓←→←→BA descoberto",
        100,
      );
    }
  } else {
    stopMatrix();
  }
}

let matrixCanvas, matrixRAF;
function startMatrix() {
  matrixCanvas = document.createElement("canvas");
  matrixCanvas.id = "matrix-canvas";
  matrixCanvas.style.cssText =
    "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99998;pointer-events:none;opacity:0;transition:opacity 1s;";
  document.body.appendChild(matrixCanvas);
  requestAnimationFrame(() => {
    matrixCanvas.style.opacity = "0.85";
  });

  const ctx = matrixCanvas.getContext("2d");
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
  const cols = Math.floor(matrixCanvas.width / 20);
  const drops = new Array(cols).fill(1);
  const chars =
    "アカサタナハマヤラワ01アイウエオカキクケコABCDEF0123456789@#$%".split("");

  function draw() {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    ctx.fillStyle = "#00ffe0";
    ctx.font = "14px monospace";
    drops.forEach((y, i) => {
      const c = chars[Math.floor(secureRandom() * chars.length)];
      const white = secureRandom() > 251 / 256;
      ctx.fillStyle = white ? "#ffffff" : "#00ffe0";
      ctx.fillText(c, i * 20, y * 20);
      if (y * 20 > matrixCanvas.height && secureRandom() > 0.975) drops[i] = 0;
      drops[i]++;
    });
    matrixRAF = requestAnimationFrame(draw);
  }
  draw();
  document.addEventListener("click", stopMatrix, { once: true });
}
function stopMatrix() {
  if (matrixCanvas) {
    matrixCanvas.style.opacity = "0";
    setTimeout(() => {
      matrixCanvas?.remove();
      matrixCanvas = null;
    }, 1000);
  }
  cancelAnimationFrame(matrixRAF);
  matrixMode = false;
}

function initClickParticles() {
  document.addEventListener("click", (e) => {
    if (
      e.target.closest(
        ".slick-prev,.slick-next,.swiper-button-prev,.swiper-button-next,.back-to-top",
      )
    )
      return;
    const colors = [
      "#00ffe0",
      "#00aaff",
      "#ff6f91",
      "#ffd166",
      "#9fb5ff",
      "#ffffff",
    ];
    const randomFloat = (min, max) => min + secureRandom() * (max - min);
    for (let i = 0; i < 12; i++) {
      const p = document.createElement("div");
      p.className = "click-particle";
      const angle = (i / 12) * Math.PI * 2,
        dist = randomFloat(40, 100);
      const tx = Math.cos(angle) * dist,
        ty = Math.sin(angle) * dist;
      const color = colors[Math.floor(randomFloat(0, colors.length))];
      const size = randomFloat(4, 8);
      p.style.cssText = `left:${e.clientX}px; top:${e.clientY}px; background:${color}; width:${size}px; height:${size}px; --tx:${tx}px; --ty:${ty}px;`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 800);
    }
  });
}

function initParallax() {
  const hero = document.querySelector(".hero");
  if (!hero || prefersReducedMotion) return;
  window.addEventListener(
    "scroll",
    () => {
      if (window.innerWidth <= 768) {
        const heroImg = hero.querySelector(".hero-image");
        if (heroImg) heroImg.style.transform = `translateY(0)`;
        return;
      }
      const scrolled = window.scrollY;
      const heroImg = hero.querySelector(".hero-image");
      const heroTxt = hero.querySelector(".hero-content");
      if (heroImg) heroImg.style.transform = `translateY(${scrolled * 0.08}px)`;
      if (heroTxt) heroTxt.style.transform = `translateY(${scrolled * 0.04}px)`;
    },
    { passive: true },
  );
}

function initLogoSecret() {
  const logos = document.querySelectorAll(".logo-header, .footer-logo");
  logos.forEach((logo) => {
    logo.addEventListener("click", (e) => {
      e.preventDefault();
      logoClickCount++;
      clearTimeout(logoClickTimer);
      logoClickTimer = setTimeout(() => {
        logoClickCount = 0;
      }, 2000);
      if (logoClickCount >= 5) {
        logoClickCount = 0;
        if (!unlockedAchievements.has("a-logo")) {
          unlockedAchievements.add("a-logo");
          sessionStorage.setItem(
            "achievements",
            JSON.stringify([...unlockedAchievements]),
          );
          showAchievement(
            "fa-rotate",
            "Segredo Descoberto!",
            "Você clicou na logo 5x — você é curioso!",
            75,
          );
        }
        logo.style.animation = "logoSpin 1s ease";
        setTimeout(() => {
          logo.style.animation = "";
        }, 1100);
      }
    });
  });
}

function initStatsCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const end = Number.parseInt(el.dataset.count);
          let dur = 1500,
            start = null;
          function step(ts) {
            if (!start) {
              start = ts;
            }
            const p = Math.min((ts - start) / dur, 1);
            el.textContent = Math.floor(p * end);
            if (p < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = end;
            }
          }
          requestAnimationFrame(step);
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.5 },
  );
  counters.forEach((c) => obs.observe(c));
}

function showDynamicGreeting() {
  if (sessionStorage.getItem("greeted")) return;
  const hour = new Date().getHours();
  let icon = "",
    msg = "";
  if (hour >= 5 && hour < 12) {
    icon = "fa-sun";
    msg = "Bom dia! Explore o portfólio!";
  } else if (hour >= 12 && hour < 18) {
    icon = "fa-cloud-sun";
    msg = "Boa tarde! Bem-vindo ao portfólio!";
  } else if (hour >= 18 && hour < 22) {
    icon = "fa-moon";
    msg = "Boa noite! Veja meus projetos!";
  } else {
    icon = "fa-star";
    msg = "Trabalhando tarde? Eu também!";
  }

  const toast = document.createElement("div");
  toast.className = "greeting-toast";
  toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${msg}</span>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() =>
    requestAnimationFrame(() => toast.classList.add("show")),
  );
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 3000);
  sessionStorage.setItem("greeted", "true");
}

function initFloatingTags() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const random = (max = 1) => secureRandom() * max;
  const tags = [
    "React",
    "Node.js",
    "Python",
    "Flask",
    "TypeScript",
    "Docker",
    "AWS",
    "Git",
    "HTML5",
    "CSS3",
    "MySQL",
    "Firebase",
    "C#",
    "Arduino",
    "PHP",
    "Linux",
    "API REST",
    "Vite",
    "Pandas",
    "Blockchain",
    "IoT",
    "Web3",
    "CI/CD",
    "SCRUM",
    "<div>",
    "function(){}",
    "import React",
    "git push",
    "npm install",
    "$ sudo",
    "SELECT *",
    "console.log",
    "useState",
    "useEffect",
    "async/await",
    "JSON",
  ];
  const container = document.createElement("div");
  container.className = "floating-tags-container";
  hero.appendChild(container);

  tags.forEach((tag) => {
    const el = document.createElement("span");
    el.className = "floating-tag";
    el.textContent = tag;
    el.style.cssText = `
      left:${random(95)}%;
      top:${random(90)}%;
      animation-delay:${random(8)}s;
      animation-duration:${12 + random(10)}s;
      font-size:${0.6 + random(0.4)}rem;
      opacity:${0.08 + random(0.12)};
    `;
    container.appendChild(el);
  });
}

function showHintToast(text) {
  const existing = document.querySelector(".hint-toast");
  if (existing) existing.remove();
  const t = document.createElement("div");
  t.className = "hint-toast";
  t.innerHTML = `<i class="fa-solid fa-lightbulb"></i><span>${text}</span>`;
  document.body.appendChild(t);
  requestAnimationFrame(() =>
    requestAnimationFrame(() => t.classList.add("show")),
  );
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 500);
  }, 3000);
}

function initSectionTitles() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle(
          "section-title-visible",
          entry.isIntersecting,
        );
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
  );

  document
    .querySelectorAll(".skills h3, .projects h3, .titulo-swot, .contact h3")
    .forEach((el) => {
      observer.observe(el);
    });
}

function initEmailModal() {
  const overlay = document.createElement("div");
  overlay.id = "email-modal-overlay";
  overlay.innerHTML = `
    <div class="email-modal" role="dialog" aria-modal="true" aria-label="Enviar mensagem">
      <div class="email-modal-header">
        <h3><i class="fa-solid fa-paper-plane"></i> Enviar Mensagem</h3>
        <button class="email-modal-close" aria-label="Fechar"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div class="email-form" id="email-form-body">
        <div class="email-form-row">
          <div class="email-form-group">
            <label for="em-name">Nome</label>
            <input id="em-name" type="text" placeholder="Seu nome" autocomplete="name" />
          </div>
          <div class="email-form-group">
            <label for="em-email">E-mail</label>
            <input id="em-email" type="email" placeholder="seu@email.com" autocomplete="email" />
          </div>
        </div>
        <div class="email-form-group">
          <label for="em-subject">Assunto</label>
          <input id="em-subject" type="text" placeholder="Proposta, parceria, dúvida…" />
        </div>
        <div class="email-form-group">
          <label for="em-message">Mensagem</label>
          <textarea id="em-message" placeholder="Conte um pouco mais sobre o que você precisa…"></textarea>
        </div>
        <div class="email-form-actions">
          <button type="button" class="email-btn-cancel">Cancelar</button>
          <button type="button" class="email-btn-send" id="em-send">
            <i class="fa-solid fa-paper-plane"></i> Enviar
          </button>
        </div>
      </div>

      <div class="email-success" id="email-success">
        <div class="email-success-icon"><i class="fa-solid fa-circle-check"></i></div>
        <h4>Mensagem enviada!</h4>
        <p>Em breve entrarei em contato. Obrigado!</p>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  document
    .querySelectorAll('.contact-btn.email, .social-btn[title="E-mail"]')
    .forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openEmailModal();
      });
    });

  overlay
    .querySelector(".email-modal-close")
    .addEventListener("click", closeEmailModal);
  overlay
    .querySelector(".email-btn-cancel")
    .addEventListener("click", closeEmailModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeEmailModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("active"))
      closeEmailModal();
  });

  overlay.querySelector("#em-send").addEventListener("click", handleEmailSend);
}

function openEmailModal() {
  const overlay = document.getElementById("email-modal-overlay");
  if (!overlay) return;
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
  document.getElementById("em-name")?.focus();
}
function closeEmailModal() {
  const overlay = document.getElementById("email-modal-overlay");
  if (!overlay) return;
  overlay.classList.remove("active");
  document.body.style.overflow = "";
  setTimeout(() => {
    document.getElementById("email-success")?.classList.remove("show");
    document.getElementById("email-form-body").style.display = "";
    overlay
      .querySelectorAll("input, textarea")
      .forEach((el) => (el.value = ""));
  }, 350);
}

function handleEmailSend() {
  const name = document.getElementById("em-name")?.value.trim();
  const email = document.getElementById("em-email")?.value.trim();
  const subject = document.getElementById("em-subject")?.value.trim();
  const message = document.getElementById("em-message")?.value.trim();

  if (!name || !email || !message) {
    const missing = [
      !name && "#em-name",
      !email && "#em-email",
      !message && "#em-message",
    ].filter(Boolean);
    missing.forEach((sel) => {
      const el = document.querySelector(sel);
      if (!el) return;
      el.style.borderColor = "#ff6b6b";
      el.style.boxShadow = "0 0 0 3px rgba(255,107,107,.15)";
      el.addEventListener(
        "input",
        () => {
          el.style.borderColor = "";
          el.style.boxShadow = "";
        },
        { once: true },
      );
    });
    return;
  }

  const btn = document.getElementById("em-send");
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Enviando…';

  const body = `Nome: ${name}
E-mail: ${email}

${message}`;
  const mailto = `mailto:lucasnascimento1245@gmail.com?subject=${encodeURIComponent(subject || "Mensagem do Portfólio")}&body=${encodeURIComponent(body)}`;

  setTimeout(() => {
    window.location.href = mailto;
    document.getElementById("email-form-body").style.display = "none";
    document.getElementById("email-success").classList.add("show");
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar';
    setTimeout(closeEmailModal, 3000);
  }, 600);
}

function initProgressBars() {
  const bars = document.querySelectorAll(".progress-bar");
  if (!bars.length) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const level =
            getComputedStyle(bar).getPropertyValue("--level").trim() ||
            bar.style.width;
          bar.style.width = "0";
          requestAnimationFrame(() =>
            setTimeout(() => {
              bar.style.width = level || "0%";
            }, 80),
          );
          obs.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 },
  );
  bars.forEach((b) => obs.observe(b));
}

function initGlowPointerTracking() {
  document.querySelectorAll(".glow-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty(
        "--mouse-x",
        `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`,
      );
      card.style.setProperty(
        "--mouse-y",
        `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`,
      );
    });
  });
}

function initKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    if (e.key !== "?" || e.ctrlKey || e.metaKey) return;
    if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
    const overlay = document.querySelector(".achievements-overlay");
    if (overlay && !overlay.classList.contains("open"))
      document.getElementById("achievements-toggle")?.click();
  });
}