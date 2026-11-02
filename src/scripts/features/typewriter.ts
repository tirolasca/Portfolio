export function initTypewriter() {
  const textEl = document.getElementById("typewriter");
  if (textEl) {
    const phrases = [
      "Desenvolvedor de Software",
      "Especialista Full Stack",
      "Explorador de Novas Tecnologias",
      "Estudante de DSM",
    ];
    let i = 0,
      j = 0,
      isDeleting = false;
    const currentPhrase: string[] = [];
    const loop = (): void => {
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
    };
    loop();
  }
}
