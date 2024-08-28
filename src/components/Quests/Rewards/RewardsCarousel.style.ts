import { getContrastAlphaColor } from '@/utils/colors';
import type { BoxProps, Breakpoint, IconButtonProps } from '@mui/material';
import {
  Box,
  IconButton as MuiIconButton,
  Typography,
  styled,
} from '@mui/material';
import { urbanist } from 'src/fonts/fonts';

export const RewardsCarouselContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#fdfbef',
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
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
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  alignContent: 'center',
  padding: '32px',
  [theme.breakpoints.down('md' as Breakpoint)]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    flexDirection: 'row',
  },
}));

export const ClaimButtonBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('md' as Breakpoint)]: {
    width: '85%',
    marginTop: '16px',
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    flexDirection: 'row',
    marginLeft: '32px',
    width: '15%',
  },
}));

export const EarnedTypography = styled(Typography)(({ theme }) => ({
  typography: urbanist.style.fontFamily,
  [theme.breakpoints.down('md' as Breakpoint)]: {
    fontSize: '32px',
    lineHeight: '32px',
    fontWeight: 700,
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    fontSize: '32px',
    lineHeight: '48px',
    fontWeight: 700,
  },
}));

export const RewardsOpenIconButton = styled(MuiIconButton, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<IconButtonProps>(({ theme }) => ({
  color: getContrastAlphaColor(theme, '84%'),
  transition: 'background 0.3s',
  width: '48px',
  height: '48px',
  backgroundColor: '#fef0ca',
  '&:hover': {
    color: '#ffffff',
    backgroundColor: '#FF0420',
  },
}));
