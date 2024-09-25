import type { BoxProps, Breakpoint, IconButtonProps } from '@mui/material';
import {
  Box,
  IconButton as MuiIconButton,
  Typography,
  alpha,
  styled,
} from '@mui/material';

export const RewardsCarouselContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.bgSecondary.main,
  borderRadius: '24px',
  boxShadow: theme.palette.shadow.main,
  display: 'flex',
  width: '100%',
  justifyContent: 'start',
  alignContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3, 6, 3, 6),
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
  borderRadius: theme.spacing(3),
  minHeight: theme.spacing(9),
  flexDirection: 'row',
  padding: theme.spacing(2),
  [theme.breakpoints.down('md' as Breakpoint)]: {
    minWidth: 400,
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    minWidth: 300,
  },
}));

export const ClaimButtonBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
  minWidth: theme.spacing(9),
  marginLeft: theme.spacing(4),
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
    minWidth: 160,
  },
}));

export const RewardsOpenIconButton = styled(MuiIconButton, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<IconButtonProps>(({ theme }) => ({
  color: theme.palette.white.main,
  transition: 'background 0.3s',
  width: theme.spacing(6),
  height: theme.spacing(6),
  backgroundColor:
    theme.palette.mode === 'light'
      ? alpha(theme.palette.primary.main, 0.08)
      : alpha(theme.palette.primary.main, 0.42),
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? alpha(theme.palette.primary.main, 0.12)
        : alpha(theme.palette.primary.main, 0.56),
  },
}));
