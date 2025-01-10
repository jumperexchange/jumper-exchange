import type { BoxProps, Breakpoint } from '@mui/material';
import { Box, Typography, styled } from '@mui/material';
import { sequel85, sora } from 'src/fonts/fonts';

export const NFTClaimingContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#fdfbef',
  padding: theme.spacing(2),
  borderRadius: '12px',
  width: '90%',
  boxShadow: theme.shadows[1],
  [theme.breakpoints.down('md' as Breakpoint)]: {
    marginTop: '64px',
  },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(2, 4, 0),
    padding: theme.spacing(3),
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    padding: theme.spacing(4),
    margin: theme.spacing(12, 4, 0),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    padding: theme.spacing(6, 4),
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
  justifyContent: 'center',
  alignContent: 'center',
  textAlign: 'center',
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.white.main,
  }),
}));

export const NFTClaimingTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'styles' && prop !== 'show',
})(({ theme }) => ({
  marginTop: theme.spacing(4),
  fontWeight: 900,
  fontSize: '32px',
  lineHeight: '32px',
  typography: sequel85.style.fontFamily,
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
  maxWidth: '600px',
  marginTop: theme.spacing(4),
  fontWeight: 500,
  fontSize: '16px',
  lineHeight: '24px',
  typography: sora.style.fontFamily,
  color: 'inherit',
  margin: theme.spacing(3, 'auto'),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(0, 'auto'),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    justifyContent: 'flex-start',
    margin: '0 auto',
  },
}));

export const NFTDisplayBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignContent: 'center',
  gap: '16px',
  [theme.breakpoints.down('md' as Breakpoint)]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    flexDirection: 'row',
  },
}));
