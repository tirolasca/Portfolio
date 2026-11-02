export function initAudioFeedback() {
  let audioCtx: AudioContext | null = null;
  function initCtx() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch {
        /* áudio indisponível: o feedback sonoro é opcional */
      }
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
    .querySelectorAll<HTMLElement>(
      ".btn,.social-btn,.project-card,.skill-card,.toggle-btn",
    )
    .forEach((el) => {
      el.addEventListener("mouseenter", playHover);
      el.addEventListener("click", playClick);
    });
}
