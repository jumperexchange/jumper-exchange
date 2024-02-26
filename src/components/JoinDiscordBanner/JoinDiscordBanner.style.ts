import type { BoxProps, Breakpoint } from '@mui/material';
import { Box, Typography, alpha } from '@mui/material';

import { styled } from '@mui/material/styles';
import { IconButtonPrimary } from '../IconButton.style';

export const DiscordBanner = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: theme.spacing(1.5),
  alignItems: 'center',
  backgroundColor:
    theme.palette.mode === 'light'
      ? '#F9F5FF' //todo: add to theme
      : alpha(theme.palette.white.main, 0.12),
  borderRadius: '32px',
  cursor: 'pointer',
  padding: theme.spacing(6),
  margin: theme.spacing(6, 2),
  marginBottom: 0,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(12, 8),
    margin: theme.spacing(8),
    marginBottom: 0,
    flexDirection: 'row',
    gap: theme.spacing(4),
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    padding: theme.spacing(12, 8),
    marginTop: theme.spacing(12),
  },
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    margin: `${theme.spacing(12, 'auto')}`,
    maxWidth: theme.breakpoints.values.xl,
  },
}));

export const DiscordBannerLabel = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontFamily: 'Urbanist, Inter',
  fontSize: '32px',
  lineHeight: '44px',
  fontWeight: 700,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    fontSize: '40px',
    lineHeight: '56px',
    textDecoration: 'auto',
  },
}));

export const DiscordBannerButton = styled(IconButtonPrimary)<BoxProps>(
  ({ theme }) => ({
    display: 'flex',
  }),
);
