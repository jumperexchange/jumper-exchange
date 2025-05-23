import type { Breakpoint } from '@mui/material';
import {
  Box,
  IconButton as MuiIconButton,
  Typography,
  alpha,
  styled,
} from '@mui/material';

export const RewardsCarouselContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#fdfbef',
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
}));

export const RewardsCarouselHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  color: (theme.vars || theme).palette.text.primary,
}));

export const RewardsCarouselTitle = styled(Typography)(({ theme }) => ({
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

export const RewardsOpenIconButton = styled(MuiIconButton)(({ theme }) => ({
  color: alpha(theme.palette.white.main, 0.84),
  ...theme.applyStyles('light', {
    backgroundColor: alpha(theme.palette.black.main, 0.84),
  }),
  transition: 'background 0.3s',
  width: '48px',
  height: '48px',
  backgroundColor: '#fef0ca',
  '&:hover': {
    color: '#ffffff',
    backgroundColor: '#FF0420',
  },
}));
