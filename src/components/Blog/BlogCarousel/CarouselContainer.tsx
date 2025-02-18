import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, useMediaQuery, useTheme, type CSSObject } from '@mui/material';
import type { ReactNode } from 'react';
import { useCallback, useRef } from 'react';
import IconHeader from 'src/components/ProfilePage/Common/IconHeader';
import { SectionTitle } from 'src/components/ProfilePage/ProfilePage.style';
import useClient from 'src/hooks/useClient';
import {
  CarouselCenteredBox,
  CarouselContainerBox,
  CarouselHeader,
  CarouselNavigationButton,
  CarouselNavigationContainer,
} from '.';

interface CarouselContainerProps {
  title?: string;
  updateTitle?: string;
  updateTooltip?: string;
  sx?: CSSObject;
  children: ReactNode | ReactNode[];
  trackingCategory?: string;
}
const swipeDistance = 420;

export const CarouselContainer = ({
  sx,
  title,
  updateTitle,
  updateTooltip,
  children,
  trackingCategory,
}: CarouselContainerProps) => {
  const theme = useTheme();
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const isClient = useClient();

  const handleChange = useCallback((direction: 'next' | 'prev') => {
    if (carouselContainerRef.current) {
      const node: HTMLDivElement = carouselContainerRef.current;
      const scrollLeftPos = node.scrollLeft;
      const scrollWidth =
        carouselContainerRef.current.scrollWidth -
        carouselContainerRef.current.clientWidth;

      let scrollPos = 0;
      switch (direction) {
        case 'next':
          if (scrollLeftPos + swipeDistance < scrollWidth) {
            scrollPos = scrollLeftPos + swipeDistance;
          } else {
            scrollPos = scrollWidth;
          }
          break;
        case 'prev':
          if (scrollLeftPos - swipeDistance > 0) {
            scrollPos = scrollLeftPos - swipeDistance;
          } else {
            scrollPos = 0;
          }
          break;
      }

      node.scrollTo({
        left: parseInt(`${scrollPos}`),
        behavior: 'smooth',
      });
    }
  }, []);
  return (
    <Box>
      <CarouselHeader>
        <CarouselCenteredBox>
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
        </CarouselCenteredBox>
        <CarouselNavigationContainer>
          <CarouselNavigationButton
            aria-label="previous"
            onClick={() => handleChange('prev')}
          >
            <ChevronLeftIcon sx={{ width: '24px', height: '24px' }} />
          </CarouselNavigationButton>
          <CarouselNavigationButton
            aria-label="next"
            sx={{ marginLeft: theme.spacing(1) }}
            onClick={() => handleChange('next')}
          >
            <ChevronRightIcon sx={{ width: '24px', height: '24px' }} />
          </CarouselNavigationButton>
        </CarouselNavigationContainer>
      </CarouselHeader>
      <CarouselContainerBox ref={carouselContainerRef} sx={sx}>
        {children}
      </CarouselContainerBox>
    </Box>
  );
};
