import { Navigation, Pagination, Autoplay, FreeMode } from 'swiper/modules';

export const DEFAULT_AUTOPLAY_DELAY = 3000;
export const DEFAULT_MOBILE_AUTOPLAY_DELAY = 5000;

export const DEFAULT_SWIPER_CONFIG = {
  modules: [Navigation, Pagination, Autoplay, FreeMode],
  keyboard: {
    enabled: true,
  },
  grabCursor: true,
  cssMode: false,
  className: 'carousel-swiper',
  setWrapperSize: false,
  slidesPerView: 'auto' as const,
  rewind: true,
  freeMode: {
    enabled: true,
    sticky: true,
    minimumVelocity: 0.1,
  },
  mousewheel: {
    releaseOnEdges: true,
  },
};
