import Swiper from "swiper";
import { Autoplay, Navigation } from "swiper/modules";

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
    speed: 600,
    navigation: { prevEl: ".projects-prev", nextEl: ".projects-next" },
    breakpoints: { 0: { slidesPerView: 1 }, 769: { slidesPerView: 2 } },
  });

  projectsSwiper.update();
}
