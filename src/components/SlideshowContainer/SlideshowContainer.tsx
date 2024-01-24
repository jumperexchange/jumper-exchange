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
import { SlideshowContainerBox } from '.';

interface SlideshowContainerProps {
  styles?: CSSObject;
  children?: any;
}
const slideDistance = 420;

export const SlideshowContainer = ({
  styles,
  children,
}: SlideshowContainerProps) => {
  const slideshowContainerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const { t } = useTranslation();

  const handleChange = useCallback((direction: 'forward' | 'back') => {
    if (slideshowContainerRef.current) {
      const node: HTMLDivElement = slideshowContainerRef.current;
      const scrollLeftPos = node.scrollLeft;
      const scrollWidth =
        slideshowContainerRef.current.scrollWidth -
        slideshowContainerRef.current.clientWidth;

      let scrollPos = 0;
      switch (direction) {
        case 'forward':
          if (scrollLeftPos + slideDistance < scrollWidth) {
            scrollPos = scrollLeftPos + slideDistance;
          } else {
            scrollPos = scrollWidth;
          }
          break;
        case 'back':
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
  }, []);
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.white.main,
        padding: theme.spacing(6, 1, 8),
      }}
    >
      <Box
        sx={{
          display: 'flex',
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
            ...(theme.palette.mode === 'dark' && {
              color: theme.palette.black.main,
            }),
          }}
        >
          {t('blog.similarPosts')}
        </Typography>
        <Box
          sx={{
            [theme.breakpoints.up('md' as Breakpoint)]: {
              ...(children && children?.length < 3 && { display: 'none' }),
              marginLeft: 3,
            },
          }}
        >
          <IconButton onClick={() => handleChange('back')}>
            <ArrowBackIosIcon />
          </IconButton>

          <IconButton
            onClick={() => handleChange('forward')}
            sx={{ marginLeft: 1, marginRight: 2 }}
          >
            <ArrowForwardIosIcon />
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
