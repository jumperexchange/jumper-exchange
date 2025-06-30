'use client';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, useMediaQuery, type CSSObject } from '@mui/material';
import type { ReactNode } from 'react';
import MultiCarousel, { ResponsiveType } from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import useClient from 'src/hooks/useClient';
import IconHeader from '../ProfilePage/Common/IconHeader';
import { SectionTitle } from '../ProfilePage/ProfilePage.style';
import {
  CarouselContainer,
  CarouselHeader,
  CarouselNavigationButton,
  CarouselNavigationContainer,
} from './Carousel.style';
import './styles.css';

const getItemsCount = () => {
  const containerWidth = window.innerWidth; // Or the carousel's actual width
  const cardPlusGap = 416 + 24;
  return Math.floor(containerWidth / cardPlusGap);
};

interface CarouselProps {
  title?: string;
  updateTitle?: string;
  updateTooltip?: string;
  sx?: CSSObject;
  children: ReactNode | ReactNode[];
  hidePagination?: boolean;
  showDots?: boolean;
  responsive: ResponsiveType;
}

export const Carousel = ({
  sx,
  title,
  updateTitle,
  updateTooltip,
  children,
  hidePagination = false,
  responsive,
  showDots = false,
}: CarouselProps) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const isClient = useClient();
  console.log('children', children);
  return (
    <CarouselContainer title={title} showDots={showDots}>
      <CarouselHeader>
        {/* <CarouselLabel> */}
        {title && <SectionTitle variant="headerMedium">{title}</SectionTitle>}
        {updateTitle && (
          <Box>
            {isClient && (
              <IconHeader
                tooltipKey={updateTooltip || ''}
                title={!isMobile ? updateTitle : undefined}
              />
            )}
          </Box>
        )}
        {/* </CarouselLabel> */}
      </CarouselHeader>
      <MultiCarousel
        additionalTransfrom={0}
        arrows={false}
        autoPlay={!isMobile}
        autoPlaySpeed={3000}
        centerMode={true}
        className="carousel"
        focusOnSelect={false}
        infinite={true}
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderDotsOutside={false}
        responsive={responsive}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots={false}
        sliderClass="carousel-slide"
        containerClass="carousel-container"
        customButtonGroup={
          !hidePagination ? (
            <CarouselNavigation
              next={() => {
                console.log('next');
              }}
              previous={() => {
                console.log('previous');
              }}
              goToSlide={() => {
                console.log('goToSlide');
              }}
            />
          ) : null
        }
        dotListClass="custom-dot-list-style"
        draggable={true}
        itemClass="carousel-item"
        partialVisible={false}
        renderButtonGroupOutside={true}
        ssr={true}
        swipeable={true}
        transitionDuration={500}
      >
        {children}
      </MultiCarousel>
    </CarouselContainer>
  );
};

const CarouselNavigation = ({
  next,
  previous,
  goToSlide,
  ...rest
}: {
  next: () => void;
  previous: () => void;
  goToSlide: (slide: number) => void;
}) => {
  const {
    carouselState: { currentSlide },
  } = rest as { carouselState: { currentSlide: number } };
  return (
    <>
      <CarouselNavigationContainer className="carousel-button-group">
        {' '}
        {/* remember to give it position:absolute
         */}
        <CarouselNavigationButton
          aria-label="previous"
          onClick={() => previous()}
          className={currentSlide === 0 ? 'disable' : ''}
        >
          <ChevronLeftIcon sx={{ width: '24px', height: '24px' }} />
        </CarouselNavigationButton>
        <CarouselNavigationButton
          aria-label="next"
          sx={(theme) => ({
            marginLeft: theme.spacing(1),
          })}
          onClick={() => next()}
        >
          <ChevronRightIcon sx={{ width: '24px', height: '24px' }} />
        </CarouselNavigationButton>
      </CarouselNavigationContainer>
    </>
  );
};
