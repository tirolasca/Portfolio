/* ==========================================================================
   CONFIGURAÇÕES GERAIS E UTILITÁRIOS
   ========================================================================== */

// Função para o Google Translate
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: "pt",
      includedLanguages: "en,es,pt",
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false,
    },
    "google_translate_element",
  );
}

// Carrega o script do Google Translate dinamicamente de forma assíncrona
(function () {
  const gtScript = document.createElement("script");
  gtScript.src =
    "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  gtScript.async = true; // Otimização de carregamento
  document.body.appendChild(gtScript);
})();

/* ==========================================================================
   INICIALIZAÇÃO (DOM Content Loaded)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Inicializa AOS (Animações de Scroll)
  if (typeof AOS !== "undefined") {
    AOS.init({ once: true, duration: 800, offset: 50 });
  }

  // 2. Controle de Tema (Dark/Light)
  const toggle = document.getElementById("theme-toggle");
  const icon =
    document.getElementById("theme-icon") ||
    (toggle ? toggle.querySelector("i") : null);

  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      if (icon) icon.classList.replace("fa-moon", "fa-sun");
    } else {
      document.documentElement.classList.remove("dark");
      if (icon) icon.classList.replace("fa-sun", "fa-moon");
    }
  };

  // Carregar preferência salva
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") applyTheme("dark");

  if (toggle) {
    toggle.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle("dark");
      const newTheme = isDark ? "dark" : "light";
      localStorage.setItem("theme", newTheme);

      if (icon) {
        // Animação suave no ícone
        icon.style.opacity = 0;
        icon.style.transform = "rotate(90deg)";
        setTimeout(() => {
          applyTheme(newTheme);
          icon.style.opacity = 1;
          icon.style.transform = "rotate(0deg)";
        }, 200);
      }
    });
  }

  // 3. Gerenciamento de Scroll (Scrollbar e Barra de Progresso)
  let scrollTimeout;
  const progress = document.getElementById("reading-progress");

  window.addEventListener("scroll", () => {
    // Mostrar/Esconder Scrollbar customizada
    document.documentElement.classList.add("show-scrollbar");
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      document.documentElement.classList.remove("show-scrollbar");
    }, 800);

    // Barra de Progresso de Leitura otimizada
    if (progress) {
      const winScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progress.style.width = scrolled + "%";
    }
  });

  // 4. Efeitos de Mouse (Cursor Spotlight e Glassmorphism) com requestAnimationFrame para 60FPS
  const dot = document.querySelector(".cursor-dot");
  const outline = document.querySelector(".cursor-outline");
  const glowCards = document.querySelectorAll(".glow-card");
  let mouseX = 0,
    mouseY = 0;
  let ticking = false;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        // Atualiza Cursor
        if (dot && outline) {
          dot.style.left = `${mouseX}px`;
          dot.style.top = `${mouseY}px`;
          outline.style.left = `${mouseX}px`;
          outline.style.top = `${mouseY}px`;
        }

        // Atualiza Glassmorphism
        glowCards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const x = mouseX - rect.left;
          const y = mouseY - rect.top;
          card.style.setProperty("--mouse-x", `${x}px`);
          card.style.setProperty("--mouse-y", `${y}px`);
        });
        ticking = false;
      });
      ticking = true;
    }
  });

  // Cursor Ativo em Links/Botões
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

  // 5. Inicialização do Slick Carousel (Se existir)
  if ($.fn.slick && $(".projects-carousel").length) {
    $(".projects-carousel").slick({
      slidesToShow: 2,
      slidesToScroll: 1,
      arrows: true,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 3000,
      speed: 600,
      cssEase: "ease-out",
      pauseOnHover: true,
      prevArrow:
        '<button type="button" class="slick-prev" data-icon="🠔"></button>',
      nextArrow:
        '<button type="button" class="slick-next" data-icon="🠖"></button>',
      responsive: [{ breakpoint: 768, settings: { slidesToShow: 1 } }],
    });
  }

  // 6. Typewriter Effect Refatorado
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

      let speed = isDeleting ? 40 : 120; // Velocidade de apagar e digitar

      // Lógica de transição
      if (!isDeleting && j === phrase.length) {
        isDeleting = true;
        speed = 2000; // Pausa quando a frase termina
      } else if (isDeleting && j === 0) {
        isDeleting = false;
        i = (i + 1) % phrases.length;
        speed = 500; // Pausa antes de começar a nova frase
      }

      setTimeout(loop, speed);
    }
    loop();
  }

  // 7. Botão Back to Top
  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.offsetHeight;

      backToTop.classList.toggle("visible", scrollY > 200);

      // Impede que o botão sobreponha o rodapé
      const safeBottom = Math.max(
        20,
        documentHeight - (scrollY + windowHeight + 50),
      );
      backToTop.style.bottom = safeBottom + "px";
    });

    backToTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 8. Gráfico SWOT (Se existir o canvas no currículo)
  const swotCanvas = document.getElementById("swotChart");
  if (swotCanvas && typeof Chart !== "undefined") {
    const ctx = swotCanvas.getContext("2d");

    // Estilização global da fonte do Chart.js
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = "#a0aab2";

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Forças", "Fraquezas", "Oportunidades", "Ameaças"],
        datasets: [
          {
            data: [8, 4, 7, 3],
            backgroundColor: [
              "rgba(0, 255, 224, 0.6)", // Turquesa neon
              "rgba(255, 111, 145, 0.6)", // Vermelho
              "rgba(255, 209, 102, 0.6)", // Amarelo
              "rgba(159, 181, 255, 0.6)", // Azul claro
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
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleFont: { size: 14 },
            bodyFont: { size: 13 },
            padding: 10,
            displayColors: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "rgba(255, 255, 255, 0.05)" },
          },
          x: {
            grid: { display: false },
          },
        },
        animation: {
          duration: 2000,
          easing: "easeOutQuart",
        },
      },
    });

    // Timeout para garantir que o canvas seja renderizado antes do fade
    setTimeout(() => {
      swotCanvas.classList.add("visible");
    }, 300);
  }

  // 9. Timeline Toggle (Se existir no currículo)
  document.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const content = btn.closest(".timeline-content");
      const details = content ? content.querySelector(".details") : null;

      if (details) {
        const isOpen = details.classList.toggle("show");
        details.style.maxHeight = isOpen ? details.scrollHeight + "px" : null;
        btn.textContent = isOpen ? "Ocultar detalhes" : "Ver mais detalhes";
      }
    });
  });

  // 10. Intersection Observer (Fade-in global de elementos)
  const fadeElements = document.querySelectorAll(
    ".fade-up, .card, .skill-card, .project-card, .swot-card",
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // Para a animação não repetir ao rolar para cima
        }
      });
    },
    { threshold: 0.1 },
  );

  fadeElements.forEach((el) => observer.observe(el));

  /* ==========================================================================
       11. TILT 3D NOS CARDS (GLASSMORPHISM AVANÇADO)
       ========================================================================== */
  const tiltCards = document.querySelectorAll(".glow-card");
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // Pos X no card
      const y = e.clientY - rect.top; // Pos Y no card

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calcula a rotação (máximo de 10 graus)
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      // Reseta a rotação quando o mouse sai
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });

  /* ==========================================================================
       12. BOTÕES MAGNÉTICOS (UX MICROINTERACTION)
       ========================================================================== */
  const magneticBtns = document.querySelectorAll(".social-btn, .btn");
  magneticBtns.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      // Pega o centro do botão
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Move o botão 30% da distância até o mouse (efeito ímã)
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      // Solta o botão (spring back)
      btn.style.transform = `translate(0px, 0px)`;
    });
  });

  /* ==========================================================================
       13. EFEITO HACKER (SCRAMBLE TEXT)
       ========================================================================== */
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
  const scrambleElements = document.querySelectorAll(".scramble-text");

  function scrambleAnimation(target) {
    let iteration = 0;
    const originalText = target.dataset.value;
    clearInterval(target.interval);

    target.interval = setInterval(() => {
      target.innerText = originalText
        .split("")
        .map((letter, index) => {
          // Retorna a letra original se já passou da iteração
          if (index < iteration) {
            return originalText[index];
          }
          // Coloca um caractere aleatório
          return letters[Math.floor(Math.random() * letters.length)];
        })
        .join("");

      if (iteration >= originalText.length) {
        clearInterval(target.interval);
      }
      // Velocidade da decodificação
      iteration += 1 / 3;
    }, 30);
  }

  // Aplica o efeito quando passa o mouse por cima
  scrambleElements.forEach((el) => {
    el.addEventListener("mouseenter", (e) => scrambleAnimation(e.target));

    // Ativa uma vez quando a tela carrega
    setTimeout(() => scrambleAnimation(el), 500);
  });

  /* ==========================================================================
       14. FUNDO DE NÓS DE REDE (CANVAS PARTICLES)
       ========================================================================== */
  const canvas = document.getElementById("networkCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particlesArray = [];

    canvas.width = window.innerWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      initParticles();
    });

    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      update() {
        if (this.x > canvas.width || this.x < 0)
          this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0)
          this.directionY = -this.directionY;

        // Interação com o mouse (os nós fogem levemente do mouse)
        let dx = mouseX - this.x;
        let dy = mouseY - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          this.x -= dx / 20;
          this.y -= dy / 20;
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    function initParticles() {
      particlesArray = [];
      let numberOfParticles = (canvas.width * canvas.height) / 12000;
      for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 2 + 1;
        let x = Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;
        let y = Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;
        let directionX = Math.random() * 1 - 0.5;
        let directionY = Math.random() * 1 - 0.5;
        let color = "rgba(0, 255, 224, 0.6)"; // Neon Teal
        particlesArray.push(
          new Particle(x, y, directionX, directionY, size, color),
        );
      }
    }

    function connectParticles() {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let distance =
            (particlesArray[a].x - particlesArray[b].x) *
              (particlesArray[a].x - particlesArray[b].x) +
            (particlesArray[a].y - particlesArray[b].y) *
              (particlesArray[a].y - particlesArray[b].y);
          if (distance < (canvas.width / 7) * (canvas.height / 7)) {
            let opacityValue = 1 - distance / 10000;
            ctx.strokeStyle = `rgba(0, 255, 224, ${opacityValue})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      requestAnimationFrame(animateParticles);
      // Só desenha se estiver no modo escuro para economizar bateria
      if (document.documentElement.classList.contains("dark")) {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < particlesArray.length; i++) {
          particlesArray[i].update();
        }
        connectParticles();
      }
    }

    initParticles();
    animateParticles();
  }

  /* ==========================================================================
       15. MICRO-FEEDBACK SONORO UI (CYBERPUNK VIBE)
       ========================================================================== */
  // Usa Web Audio API para gerar sons sem precisar baixar MP3
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // O navegador bloqueia áudio até o primeiro clique do usuário
  document.body.addEventListener(
    "click",
    () => {
      if (audioCtx.state === "suspended") audioCtx.resume();
    },
    { once: true },
  );

  // Som 1: Hover rápido e tecnológico (Click/Tick)
  function playHoverSound() {
    if (
      audioCtx.state === "suspended" ||
      !document.documentElement.classList.contains("dark")
    )
      return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      1200,
      audioCtx.currentTime + 0.05,
    ); // Sweep rápido
    gain.gain.setValueAtTime(0.02, audioCtx.currentTime); // Volume BEM baixo (0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  }

  // Som 2: Clique mecânico futurista (Para botões e troca de tema)
  function playClickSound() {
    if (
      audioCtx.state === "suspended" ||
      !document.documentElement.classList.contains("dark")
    )
      return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1); // Grave descendo
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  }

  // Atrelando os sons aos elementos (Sons SÓ tocam no modo Escuro para imersão total)
  document
    .querySelectorAll(
      ".btn, .social-btn, .project-card, .skill-card, .toggle-btn",
    )
    .forEach((el) => {
      el.addEventListener("mouseenter", playHoverSound);
      el.addEventListener("click", playClickSound);
    });

  if (toggle) {
    toggle.addEventListener("click", () => {
      // Um som especial para a troca de tema
      if (audioCtx.state === "suspended") return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(isDark ? 800 : 200, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(
        isDark ? 200 : 800,
        audioCtx.currentTime + 0.15,
      );
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    });
  }

 const githubLinks = document.querySelectorAll('a[href="https://github.com/tirolasca"], a[href="https://github.com/tirolasca/"]');
    const ghModal = document.getElementById('github-modal');
    const closeGhModal = document.getElementById('close-gh-modal');
    let dataFetched = false; // Impede requisições duplicadas

    // Função de animação dos números
    function animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
        if (!obj) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }

    // Busca os dados reais na API
 async function fetchGitHubStats() {
        if (dataFetched) return; 
        try {
            const response = await fetch(`https://api.github.com/users/tirolasca`);
            if (!response.ok) throw new Error('Erro na API');
            
            const data = await response.json();
            
            // 1. Atualiza Foto e Bio
            document.getElementById('gh-avatar').src = data.avatar_url;
            document.getElementById('gh-bio').innerText = data.bio || 'Desenvolvedor Full Stack & Redes';
            
            // 2. Atualiza Localização (se existir no perfil)
            if (data.location) {
                const locContainer = document.getElementById('gh-location-container');
                document.getElementById('gh-location').innerText = data.location;
                locContainer.style.display = 'flex'; // Exibe a tag
            }
            
            // 3. Atualiza Data de Criação (Formata para o padrão BR)
            if (data.created_at) {
                const joinedContainer = document.getElementById('gh-joined-container');
                const joinDate = new Date(data.created_at);
                const year = joinDate.getFullYear();
                document.getElementById('gh-joined').innerText = `Membro desde ${year}`;
                joinedContainer.style.display = 'flex'; // Exibe a tag
            }
            
            // 4. Inicia animação da trinca de números
            animateValue('gh-repos', 0, data.public_repos, 1500);
            animateValue('gh-followers', 0, data.followers, 1500);
            animateValue('gh-following', 0, data.following, 1500); // O novo número!
            
            dataFetched = true;
        } catch (error) {
            console.error(error);
            document.getElementById('gh-bio').innerText = 'Sistema offline. Dados em cache local.';
            document.getElementById('gh-repos').innerText = '0';
            document.getElementById('gh-followers').innerText = '0';
            document.getElementById('gh-following').innerText = '0';
        }
    }

    // Intercepta os cliques nos botões do Github (Hero e Contato)
    githubLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Se for o botão DENTRO do modal, deixa ele funcionar normalmente
            if (link.classList.contains('gh-btn')) return; 
            
            e.preventDefault(); // Trava a navegação normal
            ghModal.classList.add('active'); // Mostra o modal
            fetchGitHubStats(); // Puxa os dados
        });
    });

    // Fechar pelo botão X
    if (closeGhModal) {
        closeGhModal.addEventListener('click', () => {
            ghModal.classList.remove('active');
        });
    }

    // Fechar clicando fora do card (no fundo escuro)
    if (ghModal) {
        ghModal.addEventListener('click', (e) => {
            if (e.target === ghModal) {
                ghModal.classList.remove('active');
            }
        });
    }

    // Fechar apertando a tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && ghModal && ghModal.classList.contains('active')) {
            ghModal.classList.remove('active');
        }
    });
  /* ==========================================================================
       SCRIPT DE BOOT CYBERPUNK
       ========================================================================== */

  const preloader = document.getElementById("cyber-preloader");
  const terminalOutput = document.getElementById("terminal-output");

  if (preloader && terminalOutput) {
    // Verifica se o usuário já viu o boot nesta sessão
    const hasBooted = sessionStorage.getItem("hasBooted");

    if (hasBooted) {
      // Se já viu, remove a tela imediatamente e libera o scroll
      preloader.style.display = "none";
      document.body.classList.remove("booting");
    } else {
      // Força o modo escuro para o boot ficar legal
      if (!document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
        const icon = document.getElementById("theme-icon");
        if (icon) icon.classList.replace("fa-moon", "fa-sun");
      }

      // Mensagens de simulação do terminal (focadas no seu perfil técnico)
      const bootLogs = [
        { text: "INIT SYSTEM... OK", class: "log-system" },
        { text: "LOADING KERNEL DSM-5.15.0...", class: "" },
        { text: "MOUNTING VIRTUAL FILESYSTEM... OK", class: "log-success" },
        { text: "CHECKING HARDWARE NODES... FOUND 4 CORES", class: "" },
        {
          text: "INITIALIZING NETWORK INTERFACES... ETH0 UP",
          class: "log-success",
        },
        {
          text: "WARNING: UNAUTHORIZED PING DETECTED. IGNORING.",
          class: "log-warning",
        },
        { text: "ESTABLISHING SECURE CONNECTION...", class: "" },
        { text: "SSL CERTIFICATE VERIFIED.", class: "log-success" },
        { text: "LOADING USER PROFILE: LUCAS_SANTOS...", class: "log-system" },
        { text: "FETCHING GITHUB REPOSITORIES... OK", class: "log-success" },
        { text: "MOUNTING FULL-STACK ASSETS... OK", class: "log-success" },
        { text: "COMPILING UI/UX MODULES...", class: "" },
        { text: "STARTING PORTFOLIO DAEMON...", class: "" },
        { text: "ACCESS GRANTED. WELCOME.", class: "log-system" },
      ];

      let delay = 0;

      bootLogs.forEach((log) => {
        // Tempo aleatório entre cada linha (de 50ms a 250ms) para realismo
        delay += Math.random() * 200 + 50;

        setTimeout(() => {
          const p = document.createElement("p");
          p.className = `log-line ${log.class}`;
          // Adiciona um timestamp falso no início de cada linha
          const timestamp = (Math.random() * 2).toFixed(4);
          p.textContent = `[ ${timestamp} ] ${log.text}`;
          terminalOutput.appendChild(p);
        }, delay);
      });

      // Finaliza o boot e revela o site
      setTimeout(() => {
        preloader.classList.add("hidden");
        document.body.classList.remove("booting");

        // Marca na sessão que já assistiu
        sessionStorage.setItem("hasBooted", "true");

        // Remove do HTML para não consumir memória
        setTimeout(() => preloader.remove(), 800);
      }, delay + 600); // 600ms de pausa após a última linha
    }
  }
});
