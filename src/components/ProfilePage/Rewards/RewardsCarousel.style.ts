import type { Breakpoint, IconButtonProps } from '@mui/material';
import { Box, IconButton as MuiIconButton, styled } from '@mui/material';
import { SectionTitle } from '../ProfilePage.style';

interface RewardsCarouselContainerProps {
  rewardsLength?: number;
}

export const RewardsCarouselContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'rewardsLength',
})<RewardsCarouselContainerProps>(({ theme, rewardsLength }) => ({
  color: (theme.vars || theme).palette.text.primary,
  backgroundColor: (theme.vars || theme).palette.bgSecondary.main,
  borderRadius: '24px',
  boxShadow: (theme.vars || theme).shadows[1],
  width: '100%',
  overflow: 'hidden',
  justifyContent: 'start',
  alignContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
  flexDirection: 'column',

  [theme.breakpoints.up('md' as Breakpoint)]: {
    display: 'flex',
    paddingLeft: theme.spacing(4),
    marginTop: 0,
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

export const RewardsCarouselTitle = styled(SectionTitle)(({ theme }) => ({
  [theme.breakpoints.up('md' as Breakpoint)]: {
    whiteSpace: 'nowrap',
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
