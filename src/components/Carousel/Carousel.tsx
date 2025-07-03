'use client';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, useMediaQuery, type CSSObject } from '@mui/material';
import useId from '@mui/utils/useId';
import type { PropsWithChildren, ReactNode } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, FreeMode, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SwiperOptions } from 'swiper/types';
import { SectionTitle } from '../ProfilePage/ProfilePage.style';
import {
  CarouselContainer,
  CarouselHeader,
  CarouselNavigationButton,
  CarouselNavigationContainer,
} from './Carousel.style';

interface CarouselProps {
  title?: string;
  headerInfo?: ReactNode;
  sx?: CSSObject;
  hasNavigation?: boolean;
  hasPagination?: boolean;
  spaceBetween?: number;
  breakpoints?: {
    [width: number]: SwiperOptions;
    [ratio: string]: SwiperOptions;
  };
  fixedSlideWidth?: boolean;
}

export const Carousel: React.FC<PropsWithChildren<CarouselProps>> = ({
  sx,
  title,
  headerInfo,
  children,
  hasNavigation = true,
  breakpoints,
  spaceBetween = 32,
  hasPagination = false,
  fixedSlideWidth = false,
}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const swiperId = useId();

  // specify a unique className for each caroussel to avoid triggering non-related carousels
  const classNames = {
    navigationPrev: `swiper-button-prev-${swiperId}`,
    navigationNext: `swiper-button-next-${swiperId}`,
    pagination: `swiper-pagination-${swiperId}`,
  };

  return (
    <CarouselContainer
      title={title}
      hasPagination={hasPagination}
      fixedSlideWidth={fixedSlideWidth}
      sx={sx}
    >
      {title ? (
        <CarouselHeader>
          {title && (
            <SectionTitle
              variant="bodyXLarge"
              sx={{ maxWidth: 'calc(100% - 88px)' }}
            >
              {title}
            </SectionTitle>
          )}
          {headerInfo ?? null}
        </CarouselHeader>
      ) : null}
      <Swiper
        modules={[Navigation, Pagination, Autoplay, FreeMode]}
        navigation={{
          prevEl: `.${classNames.navigationPrev}`,
          nextEl: `.${classNames.navigationNext}`,
        }}
        slidesOffsetAfter={0}
        slidesOffsetBefore={0}
        pagination={
          hasPagination
            ? {
                clickable: true,
                el: `.${classNames.pagination}`,
              }
            : false
        }
        autoplay={
          !isMobile
            ? {
                delay: 3000,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
              }
            : false
        }
        loop={true}
        rewind={true}
        breakpoints={breakpoints}
        keyboard={{
          enabled: true,
        }}
        grabCursor={true}
        cssMode={false}
        className="carousel-swiper"
        hashNavigation={hasNavigation}
        setWrapperSize={false}
        slidesPerView="auto"
        spaceBetween={spaceBetween}
        freeMode={true}
        mousewheel={{
          releaseOnEdges: true,
        }}
      >
        {Array.isArray(children) &&
          children.map((child, index) => (
            <SwiperSlide key={index} className="carousel-slide">
              {child}
            </SwiperSlide>
          ))}
      </Swiper>

      {hasNavigation && (
        <CarouselNavigationContainer>
          <CarouselNavigationButton
            aria-label="previous"
            className={classNames.navigationPrev}
          >
            <ChevronLeftIcon sx={{ width: '24px', height: '24px' }} />
          </CarouselNavigationButton>
          <CarouselNavigationButton
            aria-label="next"
            className={classNames.navigationNext}
            sx={{
              marginLeft: 1,
            }}
          >
            <ChevronRightIcon sx={{ width: '24px', height: '24px' }} />
          </CarouselNavigationButton>
        </CarouselNavigationContainer>
      )}

      {hasPagination && (
        <Box
          className={`swiper-pagination ${classNames.pagination}`}
          sx={{
            position: 'absolute',
            bottom: 1,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
          }}
        />
      )}
    </CarouselContainer>
  );
};
