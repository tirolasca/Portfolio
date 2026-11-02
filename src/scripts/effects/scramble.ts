import { secureRandom } from "../utils";

type ScrambleTarget = HTMLElement & {
  interval?: ReturnType<typeof setInterval>;
};

function scramble(t: ScrambleTarget) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
  let it = 0;
  const orig = t.dataset.value;
  if (!orig) return;
  clearInterval(t.interval);
  t.interval = setInterval(() => {
    t.innerText = orig
      .split("")
      .map((_l, i) =>
        i < it ? orig[i] : letters[Math.floor(secureRandom() * letters.length)],
      )
      .join("");
    if (it >= orig.length) clearInterval(t.interval);
    it += 1 / 3;
  }, 30);
}

export function initScrambleText() {
  document.querySelectorAll<HTMLElement>(".scramble-text").forEach((el) => {
    el.addEventListener("mouseenter", (e) =>
      scramble(e.target as ScrambleTarget),
    );
    setTimeout(() => scramble(el), 500);
  });
}
