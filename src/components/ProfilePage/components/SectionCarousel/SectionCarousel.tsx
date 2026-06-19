'use client';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTheme } from '@mui/material/styles';
import {
  Children,
  type FC,
  isValidElement,
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
  SWIPER_SHADOW_SPACING,
} from './SectionCarousel.styles';

interface SectionCarouselProps extends PropsWithChildren {
  maxSlidesPerView?: number;
}

export const SectionCarousel: FC<SectionCarouselProps> = ({
  children,
  maxSlidesPerView = 2,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [pageState, setPageState] = useState({ pageCount: 1, activePage: 0 });

  const slides = Children.toArray(children);

  useEffect(() => {
    if (!swiper) {
      return;
    }
    // `loop` duplicates slides, so the snap grid no longer maps to real pages —
    // derive pages from the real slide count and `realIndex` instead.
    const update = () => {
      const perGroup = swiper.params.slidesPerGroup ?? 1;
      const pageCount = Math.max(1, Math.ceil(slides.length / perGroup));
      setPageState({
        pageCount,
        activePage: Math.min(
          pageCount - 1,
          Math.floor(swiper.realIndex / perGroup),
        ),
      });
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
  }, [swiper, slides.length]);

  // `slideToLoop` targets the real slide index, so dots stay correct under loop.
  const goToPage = (page: number) =>
    swiper?.slideToLoop(page * (swiper.params.slidesPerGroup ?? 1));

  return (
    <CarouselColumn>
      <CarouselViewport>
        <Swiper
          onSwiper={setSwiper}
          loop
          freeMode={false}
          spaceBetween={24}
          grabCursor
          // Page by the full set of visible cards so each dot maps to one page.
          breakpoints={{
            0: { slidesPerView: 1, slidesPerGroup: 1 },
            [theme.breakpoints.values.sm]: {
              slidesPerView: 2,
              slidesPerGroup: 2,
            },
            ...(maxSlidesPerView > 2 && {
              [theme.breakpoints.values.md]: {
                slidesPerView: maxSlidesPerView,
                slidesPerGroup: maxSlidesPerView,
              },
            }),
          }}
          style={{ padding: `${SWIPER_SHADOW_SPACING}px` }}
        >
          {slides.map((child, index) => (
            <SwiperSlide
              key={
                isValidElement(child) && child.key != null ? child.key : index
              }
            >
              {child}
            </SwiperSlide>
          ))}
        </Swiper>

        {pageState.pageCount > 1 && (
          <>
            <IconButton
              aria-label={t('profile_page.sectionCarousel.previous')}
              sx={sectionCarouselNavButtonSx('left')}
              onClick={() => swiper?.slidePrev()}
            >
              <ArrowBackIcon sx={{ width: 20, height: 20 }} />
            </IconButton>
            <IconButton
              aria-label={t('profile_page.sectionCarousel.next')}
              sx={sectionCarouselNavButtonSx('right')}
              onClick={() => swiper?.slideNext()}
            >
              <ArrowForwardIcon sx={{ width: 20, height: 20 }} />
            </IconButton>
          </>
        )}
      </CarouselViewport>

      {pageState.pageCount > 1 && (
        <CarouselControls>
          <CarouselDots>
            {Array.from({ length: pageState.pageCount }).map((_, index) => (
              <CarouselDot
                key={index}
                active={index === pageState.activePage}
                role="button"
                tabIndex={0}
                aria-current={
                  index === pageState.activePage ? 'page' : undefined
                }
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
