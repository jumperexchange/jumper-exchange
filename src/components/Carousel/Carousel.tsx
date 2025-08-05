'use client';
import { useMediaQuery, type CSSObject } from '@mui/material';
import {
  Children,
  type ComponentType,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { AutoplayOptions, SwiperOptions } from 'swiper/types';
import { CarouselContainer } from './Carousel.style';
import {
  CarouselNavigationBase,
  CarouselPaginationBase,
} from './Carousel.types';
import { useSwiperAutoplayControl, useSwiperScopedClassNames } from './hooks';
import { CarouselHeader } from './CarouselHeader';
import {
  DEFAULT_AUTOPLAY_DELAY,
  DEFAULT_MOBILE_AUTOPLAY_DELAY,
  DEFAULT_SWIPER_CONFIG,
} from './constants';

export interface CarouselProps {
  title?: string;
  headerInfo?: ReactNode;
  sx?: CSSObject;
  CarouselNavigation?: ComponentType<CarouselNavigationBase>;
  CarouselPagination?: ComponentType<CarouselPaginationBase>;
  spaceBetween?: number;
  breakpoints?: {
    [width: number]: SwiperOptions;
    [ratio: string]: SwiperOptions;
  };
  fixedSlideWidth?: boolean;
  autoplayOptions?: AutoplayOptions;
  shouldAutoplay?: boolean;
  shouldLoop?: boolean;
}

export const Carousel: React.FC<PropsWithChildren<CarouselProps>> = ({
  sx,
  title,
  headerInfo,
  children,
  CarouselNavigation,
  breakpoints,
  spaceBetween = 32,
  CarouselPagination,
  fixedSlideWidth = false,
  autoplayOptions,
  shouldAutoplay = true,
  shouldLoop = true,
}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const classNames = useSwiperScopedClassNames();

  const autoplayDelay = !isMobile
    ? (autoplayOptions?.delay ?? DEFAULT_AUTOPLAY_DELAY)
    : DEFAULT_MOBILE_AUTOPLAY_DELAY;

  const slides = Children.toArray(children).map((child, index) => (
    <SwiperSlide key={`carousel-slide-${index}`} className="carousel-slide">
      {child}
    </SwiperSlide>
  ));
  const showControls = slides.length > 1;

  const autoplay =
    shouldAutoplay && !isMobile
      ? {
          delay: autoplayDelay,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
          ...autoplayOptions,
        }
      : false;

  const pagination = CarouselPagination
    ? {
        clickable: true,
        el: `.${classNames.pagination}`,
      }
    : false;

  const { handleInitSwipper, currentTimeLeft } = useSwiperAutoplayControl(
    shouldAutoplay,
    autoplayDelay,
  );

  return (
    <CarouselContainer
      title={title}
      hasPagination={!!CarouselPagination}
      fixedSlideWidth={fixedSlideWidth}
      sx={sx}
    >
      {title ? (
        <CarouselHeader
          title={title}
          headerInfo={headerInfo}
          hasNavigation={!!CarouselNavigation}
        />
      ) : null}
      <Swiper
        onSwiper={handleInitSwipper}
        navigation={{
          prevEl: `.${classNames.navigationPrev}`,
          nextEl: `.${classNames.navigationNext}`,
        }}
        {...DEFAULT_SWIPER_CONFIG}
        pagination={pagination}
        autoplay={autoplay}
        loop={shouldLoop}
        breakpoints={breakpoints}
        hashNavigation={!!CarouselNavigation}
        spaceBetween={spaceBetween}
      >
        {slides}
      </Swiper>
      {CarouselNavigation && showControls ? (
        <CarouselNavigation classNames={classNames} />
      ) : null}
      {CarouselPagination && showControls ? (
        <CarouselPagination
          className={classNames.pagination}
          delay={autoplayDelay}
          currentTimeLeft={currentTimeLeft}
        />
      ) : null}
    </CarouselContainer>
  );
};
