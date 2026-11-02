import { prefersReducedMotion } from "../state";
import { secureRandom } from "../utils";

export function initBootSequence() {
  const preloader = document.getElementById("cyber-preloader");
  const terminal = document.getElementById("terminal-output");
  if (preloader && terminal) {
    if (sessionStorage.getItem("hasBooted")) {
      preloader.style.display = "none";
      document.body.classList.remove("booting");
      setTimeout(() => showDynamicGreeting(), 500);
    } else {
      // a abertura sempre começa no tema escuro (a classe já veio do <head>)
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      const ic =
        document.getElementById("theme-icon") ||
        document.querySelector<HTMLElement>("#theme-toggle i");
      if (ic) {
        ic.classList.remove("fa-moon");
        ic.classList.add("fa-sun");
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
        delay += secureRandom() * 110 + 30; // ritmo curto: a abertura pesa no LCP
        setTimeout(() => {
          const p = document.createElement("p");
          p.className = `log-line ${log.cls}`;
          p.textContent = `[ ${(secureRandom() * 2).toFixed(4)} ] ${log.text}`;
          terminal.appendChild(p);
        }, delay);
      });
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        clearTimeout(finishTimer);
        removeEventListener("pointerdown", finish);
        removeEventListener("keydown", finish);
        preloader.classList.add("hidden");
        document.body.classList.remove("booting");
        sessionStorage.setItem("hasBooted", "true");
        setTimeout(() => preloader.remove(), 800);
        setTimeout(() => showDynamicGreeting(), 1200);
      };
      const finishTimer = setTimeout(finish, delay + 400);
      // qualquer toque/tecla pula a abertura; "menos movimento" nem a mostra
      addEventListener("pointerdown", finish);
      addEventListener("keydown", finish);
      if (prefersReducedMotion) finish();
    }
  } else {
    setTimeout(() => showDynamicGreeting(), 800);
  }
}

function showDynamicGreeting() {
  if (sessionStorage.getItem("greeted")) return;
  const hour = new Date().getHours();
  let icon: string;
  let msg: string;
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
  toast.setAttribute("role", "status");
  toast.innerHTML = `<i class="fa-solid ${icon}" aria-hidden="true"></i><span>${msg}</span>`;
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
