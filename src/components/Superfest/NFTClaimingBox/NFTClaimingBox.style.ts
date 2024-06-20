import type { BoxProps, Breakpoint } from '@mui/material';
import { Box, Stack, Typography, alpha, styled } from '@mui/material';

export const NFTClaimingContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#fdfbef',
  padding: theme.spacing(2),
  borderRadius: '32px',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)'
      : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(8, 8, 0),
    padding: theme.spacing(6, 3),
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    padding: theme.spacing(8, 4, 4),
    margin: theme.spacing(12, 8, 0),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    padding: theme.spacing(6, 6, 4),
  },
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    margin: `${theme.spacing(12, 'auto', 0)}`,
    maxWidth: theme.breakpoints.values.xl,
  },
}));

export const NFTClaimingHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<BoxProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.white.main,
  }),
  justifyContent: 'space-between',
}));

export const NFTClaimingTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'styles' && prop !== 'show',
})(({ theme }) => ({
  fontWeight: 700,
  fontSize: '24px',
  lineHeight: '32px',
  color: 'inherit',
  margin: theme.spacing(3, 1.5, 0),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(0, 1.5, 0),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    justifyContent: 'flex-start',
    margin: 0,
  },
}));

export const NFTClaimingDescription = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'styles' && prop !== 'show',
})(({ theme }) => ({
  fontWeight: 500,
  fontSize: '16px',
  lineHeight: '24px',
  color: 'inherit',
  margin: theme.spacing(3, 1.5, 0),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(0, 1.5, 0),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    justifyContent: 'flex-start',
    margin: 0,
  },
}));
