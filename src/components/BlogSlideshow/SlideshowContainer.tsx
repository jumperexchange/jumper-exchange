import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
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
import { SlideshowContainerBox } from '.';

interface SlideshowContainerProps {
  title?: string;
  styles?: CSSObject;
  children?: any;
  trackingCategory?: string;
}
const slideDistance = 420;

export const SlideshowContainer = ({
  styles,
  title,
  children,
  trackingCategory,
}: SlideshowContainerProps) => {
  const { trackEvent } = useUserTracking();

  const slideshowContainerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const { t } = useTranslation();

  const handleChange = useCallback(
    (direction: 'next' | 'prev') => {
      if (slideshowContainerRef.current) {
        const node: HTMLDivElement = slideshowContainerRef.current;
        const scrollLeftPos = node.scrollLeft;
        const scrollWidth =
          slideshowContainerRef.current.scrollWidth -
          slideshowContainerRef.current.clientWidth;

        let scrollPos = 0;
        switch (direction) {
          case 'next':
            trackEvent({
              category: trackingCategory || 'slideshow',
              label: 'swipe-slideshow',
              action: TrackingAction.SlideSlideshow,
              data: {
                [TrackingEventParameter.SwipeDirection]: 'left',
              },
              disableTrackingTool: [
                EventTrackingTool.ARCx,
                EventTrackingTool.Cookie3,
              ],
            });
            if (scrollLeftPos + slideDistance < scrollWidth) {
              scrollPos = scrollLeftPos + slideDistance;
            } else {
              scrollPos = scrollWidth;
            }
            break;
          case 'prev':
            trackEvent({
              category: trackingCategory || 'slideshow',
              label: 'swipe-slideshow',
              action: TrackingAction.SlideSlideshow,
              data: {
                [TrackingEventParameter.SwipeDirection]: 'right',
              },
              disableTrackingTool: [
                EventTrackingTool.ARCx,
                EventTrackingTool.Cookie3,
              ],
            });
            if (scrollLeftPos - slideDistance > 0) {
              scrollPos = scrollLeftPos - slideDistance;
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
        backgroundColor: theme.palette.surface1.main,
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
          [theme.breakpoints.up('lg' as Breakpoint)]: {
            justifyContent: 'flex-start',
          },
        }}
      >
        <Typography
          variant="lifiHeaderMedium"
          sx={{
            fontWeight: 600,
            fontSize: 24,
            marginLeft: 2,
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
              transition: 'background-color 250ms',
              backgroundColor:
                theme.palette.mode === 'light'
                  ? getContrastAlphaColor(theme, '2%')
                  : getContrastAlphaColor(theme, '4%'),
              '&:hover': {
                backgroundColor:
                  theme.palette.mode === 'light'
                    ? theme.palette.alphaDark100.main
                    : theme.palette.alphaLight300.main,
              },
            }}
          >
            <ArrowBackIosIcon
              sx={{
                marginLeft: theme.spacing(0.75),
              }}
            />
          </IconButton>

          <IconButton
            onClick={() => handleChange('next')}
            sx={{
              marginLeft: 1,
              marginRight: 2,
              width: 40,
              height: 40,
              transition: 'background-color 250ms',
              color: 'inherit',
              backgroundColor:
                theme.palette.mode === 'light'
                  ? getContrastAlphaColor(theme, '2%')
                  : getContrastAlphaColor(theme, '4%'),
              '&:hover': {
                backgroundColor:
                  theme.palette.mode === 'light'
                    ? theme.palette.alphaDark100.main
                    : theme.palette.alphaLight300.main,
              },
            }}
          >
            <ArrowForwardIosIcon
              sx={{
                marginLeft: theme.spacing(0.25),
              }}
            />
          </IconButton>
        </Box>
      </Box>
      <SlideshowContainerBox
        ref={slideshowContainerRef}
        sx={{
          ...styles,
        }}
      >
        {children}
      </SlideshowContainerBox>
    </Box>
  );
};
