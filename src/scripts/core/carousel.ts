import Swiper from "swiper";
import { Autoplay, Navigation } from "swiper/modules";
import { onMotionPreferenceChange, prefersReducedMotion } from "../state";

export function initProjectsCarousel() {
  if (!document.querySelector<HTMLElement>(".projects-swiper")) return;

  const projectsSwiper = new Swiper(".projects-swiper", {
    modules: [Navigation, Autoplay],
    slidesPerView: 2,
    spaceBetween: 24,
    loop: true,
    autoplay: {
      delay: 3200,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    // movimento reduzido: troca de slide imediata (sem deslizar)
    speed: prefersReducedMotion ? 0 : 600,
    navigation: { prevEl: ".projects-prev", nextEl: ".projects-next" },
    breakpoints: { 0: { slidesPerView: 1 }, 769: { slidesPerView: 2 } },
  });

  // conteúdo que avança sozinho só roda se a pessoa não pediu "menos movimento" (WCAG 2.2.2);
  // as setas continuam funcionando.
  if (prefersReducedMotion) projectsSwiper.autoplay.stop();
  onMotionPreferenceChange((reduce) => {
    projectsSwiper.params.speed = reduce ? 0 : 600;
    if (reduce) projectsSwiper.autoplay.stop();
    else projectsSwiper.autoplay.start();
  });

  projectsSwiper.update();
}
