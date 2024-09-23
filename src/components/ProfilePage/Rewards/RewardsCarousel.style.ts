import type { BoxProps, Breakpoint } from '@mui/material';
import {
  Box,
  Typography,
  styled,
  IconButton as MuiIconButton,
  alpha,
  darken,
} from '@mui/material';
import type { IconButtonProps } from '@mui/material';

export const RewardsCarouselContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.bgSecondary.main,
  borderRadius: '24px',
  boxShadow: theme.palette.shadow.main,
  display: 'flex',
  width: '100%',
  justifyContent: 'start',
  alignContent: 'center',
  alignItems: 'center',
  marginBottom: '32px',
  paddingTop: '24px',
  paddingBottom: '24px',
  paddingLeft: '48px',
  paddingRight: '48px',
  [theme.breakpoints.down('md' as Breakpoint)]: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    flexDirection: 'row',
    gap: '32px',
  },
}));

export const RewardsCarouselHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<BoxProps>(({ theme }) => ({
  display: 'flex',
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.white.main,
  }),
  justifyContent: 'space-between',
}));

export const RewardsCarouselTitle = styled(Typography, {
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

export const RewardsCarouselMainBox = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? '#FFFFFF'
      : alpha(theme.palette.white.main, 0.08),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  alignContent: 'center',
  borderRadius: '24px',
  minHeight: '72px',
  flexDirection: 'row',
  padding: '16px',
  [theme.breakpoints.down('md' as Breakpoint)]: {
    minWidth: '400px',
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    minWidth: '300px',
  },
}));

export const ClaimButtonBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
  minWidth: '72px',
  marginLeft: '32px',
}));

export const EarnedTypography = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  lineHeight: '32px',
  fontWeight: 700,
}));

export const AmountInputBox = styled(Box)(({ theme }) => ({
  marginLeft: '8px',
  [theme.breakpoints.down('md' as Breakpoint)]: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    minWidth: '160px',
  },
}));

export const RewardsOpenIconButton = styled(MuiIconButton, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<IconButtonProps>(({ theme }) => ({
  color: theme.palette.white.main,
  transition: 'background 0.3s',
  width: '48px',
  height: '48px',
  backgroundColor: theme.palette.primary.main,
  ':hover': {
    color: '#ffffff',
    backgroundColor: darken(theme.palette.primary.main, 0.16),
  },
}));
