import type { Breakpoint, IconButtonProps } from '@mui/material';
import {
  Box,
  IconButton as MuiIconButton,
  Typography,
  styled,
} from '@mui/material';

interface RewardsCarouselContainerProps {
  rewardsLength?: number;
}

export const RewardsCarouselContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'rewardsLength',
})<RewardsCarouselContainerProps>(({ theme, rewardsLength }) => ({
  backgroundColor: (theme.vars || theme).palette.bgSecondary.main,
  borderRadius: '24px',
  boxShadow: (theme.vars || theme).shadows[1],
  display: 'flex',
  width: '100%',
  justifyContent: 'start',
  alignContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
  flexDirection: rewardsLength && rewardsLength < 3 ? 'row' : 'column',

  [theme.breakpoints.up('md' as Breakpoint)]: {
    paddingLeft: theme.spacing(4),
    flexDirection: 'row',
    gap: '32px',
  },
}));

export const RewardsCarouselItems = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflow: 'hidden',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
}));

export const RewardsCarouselHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  color: (theme.vars || theme).palette.text.primary,
  justifyContent: 'space-between',
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

export const ClaimingBoxContainer = styled(Box)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.alphaLight200.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  alignContent: 'center',
  borderRadius: theme.spacing(3),
  minHeight: theme.spacing(9),
  flexDirection: 'row',
  padding: theme.spacing(2),

  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.white.main,
  }),
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

export const RewardsOpenIconButton = styled(MuiIconButton)<IconButtonProps>(
  ({ theme }) => ({
    color: (theme.vars || theme).palette.white.main,
    transition: 'background 0.3s',
    width: theme.spacing(6),
    height: theme.spacing(6),
    backgroundColor: (theme.vars || theme).palette.bgQuaternary.main,
    '&:hover': {
      backgroundColor: (theme.vars || theme).palette.bgQuaternary.hover,
    },
  }),
);
