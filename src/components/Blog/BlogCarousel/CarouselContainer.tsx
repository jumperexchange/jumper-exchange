import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, useTheme, type CSSObject } from '@mui/material';

import type { ReactNode } from 'react';
import { useCallback, useRef } from 'react';
import { SectionTitle } from 'src/components/ProfilePage/ProfilePage.style';
import {
  CarouselCenteredBox,
  CarouselContainerBox,
  CarouselHeader,
  CarouselNavigationButton,
  CarouselNavigationContainer,
} from '.';
import IconHeader from 'src/components/ProfilePage/Common/IconHeader';
import useClient from 'src/hooks/useClient';

interface CarouselContainerProps {
  title?: string;
  updateTitle?: string;
  updateTooltip?: string;
  styles?: CSSObject;
  children: ReactNode | ReactNode[];
  trackingCategory?: string;
}
const swipeDistance = 420;

export const CarouselContainer = ({
  styles,
  title,
  updateTitle,
  updateTooltip,
  children,
  trackingCategory,
}: CarouselContainerProps) => {
  const theme = useTheme();
  const carouselContainerRef = useRef<HTMLDivElement>(null);

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
                  title={updateTitle}
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
            <ArrowBackIcon sx={{ width: '22px', height: '22px' }} />
          </CarouselNavigationButton>
          <CarouselNavigationButton
            aria-label="next"
            sx={{ marginLeft: theme.spacing(1) }}
            onClick={() => handleChange('next')}
          >
            <ArrowForwardIcon sx={{ width: '22px', height: '22px' }} />
          </CarouselNavigationButton>
        </CarouselNavigationContainer>
      </CarouselHeader>
      <CarouselContainerBox ref={carouselContainerRef} sx={styles}>
        {children}
      </CarouselContainerBox>
    </Box>
  );
};
