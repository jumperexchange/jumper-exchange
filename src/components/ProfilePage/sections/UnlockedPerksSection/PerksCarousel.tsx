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
  CarouselViewport,
  PerksColumn,
  PerksControls,
  PerksControlsLabel,
  PerksDot,
  PerksDots,
  perksNavButtonSx,
} from './UnlockedPerksSection.styles';

export const PerksCarousel: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [navState, setNavState] = useState({ isBeginning: true, isEnd: true });
  const [snapCount, setSnapCount] = useState(1);
  const [activeSnap, setActiveSnap] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);

  const slides = Children.toArray(children);
  const total = slides.length;

  useEffect(() => {
    if (!swiper) {
      return;
    }
    const update = () => {
      setNavState({ isBeginning: swiper.isBeginning, isEnd: swiper.isEnd });
      setSnapCount(Math.max(1, swiper.snapGrid?.length ?? 1));
      setActiveSnap(swiper.snapIndex ?? 0);
      const perView = swiper.slidesPerViewDynamic?.() ?? 1;
      setVisibleCount(Math.max(1, Math.round(perView)));
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

  const shown = Math.min(visibleCount, total);
  // snapIndex is page-based (slidesPerGroup = slidesPerView), so a dot maps to
  // the slide that starts its page.
  const goToPage = (page: number) =>
    swiper?.slideTo(page * (swiper.params.slidesPerGroup ?? 1));

  return (
    <PerksColumn>
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
            aria-label="previous"
            sx={perksNavButtonSx('left')}
            onClick={() => swiper?.slidePrev()}
          >
            <ArrowBackIcon sx={{ width: 20, height: 20 }} />
          </IconButton>
        )}
        {!navState.isEnd && (
          <IconButton
            aria-label="next"
            sx={perksNavButtonSx('right')}
            onClick={() => swiper?.slideNext()}
          >
            <ArrowForwardIcon sx={{ width: 20, height: 20 }} />
          </IconButton>
        )}
      </CarouselViewport>

      <PerksControls>
        <PerksControlsLabel>
          {t('profile_page.unlockedPerks.showing', { shown, total })}
        </PerksControlsLabel>
        {snapCount > 1 && (
          <PerksDots>
            {Array.from({ length: snapCount }).map((_, index) => (
              <PerksDot
                key={index}
                active={index === activeSnap}
                role="button"
                aria-label={`Go to perk page ${index + 1}`}
                onClick={() => goToPage(index)}
              />
            ))}
          </PerksDots>
        )}
      </PerksControls>
    </PerksColumn>
  );
};
