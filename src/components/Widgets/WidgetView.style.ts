import type { BoxProps } from '@mui/material';
import { Box, Skeleton, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

interface WidgetSkeletonContainerProps extends BoxProps {
  welcomeScreenClosed: boolean;
}

export const WidgetSkeletonContainer = styled(
  Box,
)<WidgetSkeletonContainerProps>(({ theme, welcomeScreenClosed }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: theme.palette.surface1.main,
  boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
  borderRadius: theme.shape.borderRadius,

  marginTop: !welcomeScreenClosed ? '24px' : theme.spacing(3.5),
  cursor: !welcomeScreenClosed ? 'pointer' : 'auto',
  [`@media screen and (min-height: 700px)`]: {
    marginTop: !welcomeScreenClosed
      ? 'calc( 50vh - 680px / 2.75 - 40px)'
      : theme.spacing(3.5), // (mid viewheight - half-two/thirds widget height - navbar height )
  },

  [`@media screen and (min-height: 900px)`]: {
    marginTop: !welcomeScreenClosed
      ? 'calc( 50vh - 680px / 2.75 - 128px)'
      : theme.spacing(3.5), // (mid viewheight - half-two/thirds widget height - ( navbar height + additional spacing) )
  },
}));

export const WidgetSkeletonHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  display: 'flex',
  width: '100%',
  justifyContent: 'flex-start',
}));

export const WidgetSkeletonTitle = styled(Typography)(({ theme }) => ({
  lineHeight: 1.5,
  textAlign: 'left',
  overflow: 'hidden',
  flexGrow: 1,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: 24,
  fontWeight: 700,
}));

export const WidgetSkeletonIconButton = styled(Box)(({ theme }) => ({
  borderRadius: '50%',
  padding: 8,
  width: 40,
  height: 40,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const WidgetSkeletonWalletButton = styled(WidgetSkeletonIconButton)(
  ({ theme }) => ({
    height: '48px',
    width: '48px',
    padding: '10px 14px',
    backgroundColor:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.primary.main, 0.42)
        : alpha(theme.palette.primary.main, 0.08),
  }),
);

export const WidgetFooter = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(3),
  display: 'flex',
  gap: theme.spacing(1.5),
  padding: theme.spacing(0, 3),
  width: '100%',
}));

export const WidgetSkeletonMainButton = styled(Box)(({ theme }) => ({
  borderRadius: 24,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.primary.main,
  padding: 8,
  flexGrow: 1,
  height: 48,
}));

export const WidgetSkeletonMainButtonTypography = styled(Typography)(
  ({ theme }) => ({
    textAlign: 'center',
    lineHeight: 1.75,
    fontSize: '16px',
    fontWeight: 600,
    color: theme.palette.white.main,
  }),
);

export const WidgetSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: theme.palette.surface2.main,
  border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[300]}`,
}));
