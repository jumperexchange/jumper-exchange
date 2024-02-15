import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { Breakpoint } from '@mui/material';
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  type CSSObject,
} from '@mui/material';

import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TrackingAction, TrackingEventParameter } from 'src/const';
import { useUserTracking } from 'src/hooks';
import { EventTrackingTool } from 'src/types';
import { getContrastAlphaColor } from 'src/utils';
import { CarouselContainerBox } from '.';

interface CarouselContainerProps {
  title?: string;
  styles?: CSSObject;
  children?: any;
  trackingCategory?: string;
}
const swipeDistance = 420;

export const CarouselContainer = ({
  styles,
  title,
  children,
  trackingCategory,
}: CarouselContainerProps) => {
  const { trackEvent } = useUserTracking();

  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const { t } = useTranslation();

  const handleChange = useCallback(
    (direction: 'next' | 'prev') => {
      if (carouselContainerRef.current) {
        const node: HTMLDivElement = carouselContainerRef.current;
        const scrollLeftPos = node.scrollLeft;
        const scrollWidth =
          carouselContainerRef.current.scrollWidth -
          carouselContainerRef.current.clientWidth;

        let scrollPos = 0;
        switch (direction) {
          case 'next':
            trackEvent({
              category: trackingCategory || 'carousel',
              label: 'swipe-carousel',
              action: TrackingAction.SwipeCarousel,
              data: {
                [TrackingEventParameter.SwipeDirection]: 'left',
              },
              disableTrackingTool: [
                EventTrackingTool.ARCx,
                EventTrackingTool.Cookie3,
              ],
            });
            if (scrollLeftPos + swipeDistance < scrollWidth) {
              scrollPos = scrollLeftPos + swipeDistance;
            } else {
              scrollPos = scrollWidth;
            }
            break;
          case 'prev':
            trackEvent({
              category: trackingCategory || 'carousel',
              label: 'swipe-carousel',
              action: TrackingAction.SwipeCarousel,
              data: {
                [TrackingEventParameter.SwipeDirection]: 'right',
              },
              disableTrackingTool: [
                EventTrackingTool.ARCx,
                EventTrackingTool.Cookie3,
              ],
            });
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
      } else {
      }
    },
    [trackEvent, trackingCategory],
  );
  return (
    <Box
      sx={{
        padding: theme.spacing(0, 1),
      }}
    >
      <Box
        sx={{
          display: 'flex',
          ...(theme.palette.mode === 'dark' && {
            color: theme.palette.white.main,
          }),
          justifyContent: 'space-between',
          // [theme.breakpoints.up('lg' as Breakpoint)]: {
          //   justifyContent: 'flex-start',
          // },
        }}
      >
        <Typography
          variant="lifiHeaderMedium"
          sx={{
            fontWeight: 600,
            fontSize: 24,
            color: 'inherit',
          }}
        >
          {title ?? t('blog.recentPosts')}
        </Typography>
        <Box
          sx={{
            [theme.breakpoints.up('md' as Breakpoint)]: {
              ...(children && children?.length < 3 && { display: 'none' }),
              marginLeft: 3,
            },
          }}
        >
          <IconButton
            onClick={() => handleChange('prev')}
            sx={{
              width: 40,
              color: 'inherit',
              height: 40,
              fontSize: 22,
              transition: 'background-color 250ms',
              backgroundColor: getContrastAlphaColor(theme, '4%'),
              '&:hover': {
                backgroundColor:
                  theme.palette.mode === 'light'
                    ? theme.palette.alphaDark100.main
                    : theme.palette.alphaLight300.main,
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <IconButton
            onClick={() => handleChange('next')}
            sx={{
              marginLeft: 2,
              width: 40,
              height: 40,
              fontSize: 22,
              transition: 'background-color 250ms',
              color: 'inherit',
              backgroundColor: getContrastAlphaColor(theme, '4%'),
              '&:hover': {
                backgroundColor:
                  theme.palette.mode === 'light'
                    ? theme.palette.alphaDark100.main
                    : theme.palette.alphaLight300.main,
              },
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>
      </Box>
      <CarouselContainerBox
        ref={carouselContainerRef}
        sx={{
          ...styles,
        }}
      >
        {children}
      </CarouselContainerBox>
    </Box>
  );
};
