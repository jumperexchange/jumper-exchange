'use client';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTheme } from '@mui/material/styles';
import {
  Children,
  type FC,
  type PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import {
  CarouselColumn,
  CarouselControls,
  CarouselDot,
  CarouselDots,
  CarouselViewport,
  sectionCarouselNavButtonSx,
} from './SectionCarousel.styles';

// Generic paged carousel: 1 card on mobile, 2 from the `sm` breakpoint, with
// edge nav buttons and page dots. Each child is a slide. Shared by the profile
// page sections (perks, missions, …).
export const SectionCarousel: FC<PropsWithChildren> = ({ children }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [navState, setNavState] = useState({ isBeginning: true, isEnd: true });
  const [snapCount, setSnapCount] = useState(1);
  const [activeSnap, setActiveSnap] = useState(0);

  const slides = Children.toArray(children);

  useEffect(() => {
    if (!swiper) {
      return;
    }
    const update = () => {
      setNavState({ isBeginning: swiper.isBeginning, isEnd: swiper.isEnd });
      setSnapCount(Math.max(1, swiper.snapGrid?.length ?? 1));
      setActiveSnap(swiper.snapIndex ?? 0);
    };
    update();
    const events = [
      'slideChange',
      'snapIndexChange',
      'resize',
      'update',
    ] as const;
    events.forEach((event) => swiper.on(event, update));
    return () => {
      events.forEach((event) => swiper.off(event, update));
    };
  }, [swiper]);

  // snapIndex is page-based (slidesPerGroup = slidesPerView), so a dot maps to
  // the slide that starts its page.
  const goToPage = (page: number) =>
    swiper?.slideTo(page * (swiper.params.slidesPerGroup ?? 1));

  return (
    <CarouselColumn>
      <CarouselViewport>
        <Swiper
          onSwiper={setSwiper}
          freeMode={false}
          spaceBetween={24}
          grabCursor
          // Page by the full set of visible cards so snaps/dots/`isEnd` are all
          // page-based and in agreement.
          breakpoints={{
            0: { slidesPerView: 1, slidesPerGroup: 1 },
            [theme.breakpoints.values.sm]: {
              slidesPerView: 2,
              slidesPerGroup: 2,
            },
          }}
        >
          {slides.map((child, index) => (
            <SwiperSlide key={index}>{child}</SwiperSlide>
          ))}
        </Swiper>

        {!navState.isBeginning && (
          <IconButton
            aria-label={t('profile_page.sectionCarousel.previous')}
            sx={sectionCarouselNavButtonSx('left')}
            onClick={() => swiper?.slidePrev()}
          >
            <ArrowBackIcon sx={{ width: 20, height: 20 }} />
          </IconButton>
        )}
        {!navState.isEnd && (
          <IconButton
            aria-label={t('profile_page.sectionCarousel.next')}
            sx={sectionCarouselNavButtonSx('right')}
            onClick={() => swiper?.slideNext()}
          >
            <ArrowForwardIcon sx={{ width: 20, height: 20 }} />
          </IconButton>
        )}
      </CarouselViewport>

      {snapCount > 1 && (
        <CarouselControls>
          <CarouselDots>
            {Array.from({ length: snapCount }).map((_, index) => (
              <CarouselDot
                key={index}
                active={index === activeSnap}
                role="button"
                tabIndex={0}
                aria-current={index === activeSnap ? 'page' : undefined}
                aria-label={t('profile_page.sectionCarousel.goToPage', {
                  page: index + 1,
                })}
                onClick={() => goToPage(index)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    goToPage(index);
                  }
                }}
              />
            ))}
          </CarouselDots>
        </CarouselControls>
      )}
    </CarouselColumn>
  );
};
