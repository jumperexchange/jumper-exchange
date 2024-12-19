import { Box, Button, Typography } from '@mui/material';
import type { Breakpoint, SxProps, Theme } from '@mui/material/styles';
import { alpha, darken, styled } from '@mui/material/styles';

export const BerachainMarketHeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  color: theme.palette.text.primary,
  alignItems: 'center',
  borderRadius: '16px',
  border: '1px solid #383433',
  background: 'rgba(30, 29, 28, 0.50)',
  backdropFilter: 'blur(8px)',
  padding: theme.spacing(4),
  [theme.breakpoints.up('md' as Breakpoint)]: {
    gap: theme.spacing(2),
    flexDirection: 'row',
  },
}));

export const BerachainMarketInfos = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  [theme.breakpoints.up('md' as Breakpoint)]: {
    width: 'auto',
  },
}));

export const BerachainMarketHeaderCards = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  gap: theme.spacing(3),
  marginTop: theme.spacing(2),
  [theme.breakpoints.up('md' as Breakpoint)]: {
    width: 'auto',
    marginTop: 0,
  },
}));

export const BerachainMarketHeaderTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  gap: theme.spacing(2),
  alignItems: 'center',
  flexWrap: 'wrap',
}));

export const BerachainMarketHeaderSubtitle = styled(Typography)(
  ({ theme }) => ({
    color: alpha(theme.palette.text.primary, 0.48),
    marginTop: theme.spacing(0.5),
  }),
);

export const BerachainMarketHeaderCTA = styled(Button)(({ theme }) => ({
  color: theme.palette.black.main,
  background: theme.palette.white.main,
  marginTop: theme.spacing(1.5),
  transition: ' background-color 300ms ease-in',
  '&:hover': {
    background: darken(theme.palette.white.main, 0.16),
  },
}));

export const BerachainMarketHeaderProgressCardStyles = (
  theme: Theme,
): SxProps => ({
  width: '50%',
  padding: '16px',
  height: 'auto',
  userSelect: 'none',
  typography: theme.typography.title2XSmall,
  transition: 'background-color 300ms ease-in-out',
  '&:hover': {
    background: alpha(theme.palette.text.primary, 0.16),
  },
  [theme.breakpoints.up('md')]: {
    height: 108,
    padding: '24px',
    width: 228,
  },
});
