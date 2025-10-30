import Box, { BoxProps } from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { WIDGET_WIDTH } from 'src/config/widgetConfig';

export const AnnouncementBannerContainerList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  width: 'fit-content',
  maxWidth: WIDGET_WIDTH,
  position: 'relative',
  left: `50%`,
  transform: 'translateX(-50%)',
  [theme.breakpoints.up('sm')]: {
    left: `calc(${WIDGET_WIDTH}px/2)`,
  },
}));

interface AnnouncementBannerContainerProps extends BoxProps {
  highlight?: boolean;
}

export const AnnouncementBannerContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'highlight',
})<AnnouncementBannerContainerProps>(({ theme }) => ({
  position: 'relative',
  width: 'fit-content',
  borderRadius: theme.spacing(4),
  boxShadow: theme.shadows[3],
  variants: [
    {
      props: ({ highlight }) => highlight,
      style: {
        padding: '1px',
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          display: 'inline-block',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          background: `linear-gradient(
        45deg,
        ${(theme.vars || theme).palette.primary.main},
        ${(theme.vars || theme).palette.secondary.main},
        ${(theme.vars || theme).palette.borderActive}
      )`,
          backgroundSize: '400%',
          zIndex: -1,
          animation: 'glow 20s linear infinite',
          width: '100%',
          borderRadius: theme.spacing(4),
        },
        '&::after': {
          filter: 'blur(16px)',
          transform: 'translate3d(0, 0, 0)',
          opacity: 0.5,
        },
      },
    },
  ],

  '@keyframes glow': {
    '0%': {
      backgroundPosition: '0 0',
    },
    '50%': {
      backgroundPosition: '100% 0',
    },
    '100%': {
      backgroundPosition: '0 0',
    },
  },
}));

export const AnnouncementBannerContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  position: 'relative',
  padding: theme.spacing(1, 1.5, 1, 1),
  zIndex: 1,
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.surface2.main,
  }),
  borderRadius: theme.spacing(4),
}));
