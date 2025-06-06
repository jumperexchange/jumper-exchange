import type { Breakpoint, ButtonProps } from '@mui/material';
import { Box, styled } from '@mui/material';
import Link from 'next/link';
import { ButtonSecondary, ButtonTransparent } from 'src/components/Button';

export const CardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  backgroundColor: (theme.vars || theme).palette.bgSecondary.main,
  borderRadius: '16px',
  width: '100%',
  padding: theme.spacing(2),
  boxShadow: (theme.vars || theme).shadows[2],
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(3),
  },
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.white.main,
  }),
}));

export const RankContainer = styled(CardContainer)(({ theme }) => ({
  justifyContent: 'flex-start',
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    maxWidth: 256,
  },
}));

export const RankContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  alignItems: 'center',
  flexGrow: 1,
  // [theme.breakpoints.up('sm' as Breakpoint)]: {
  //   gap: 0,
  // },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
}));

export const CardButtonContainer = styled(Link)(({ theme }) => ({
  width: '100%',
}));

export const CardButton = styled(ButtonSecondary)(({ theme }) => ({
  fontSize: 14,
  width: '100%',
  lineHeight: '18px',
  height: 40,
  color: (theme.vars || theme).palette.text.primary,
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.primary.main,
  }),
}));

interface LeaderboardUserPositionButtonProps extends ButtonProps {
  isGtMillion: boolean;
}

export const LeaderboardUserPositionButton = styled(ButtonTransparent, {
  shouldForwardProp: (prop) => prop !== 'isGtMillion',
})<LeaderboardUserPositionButtonProps>(({ theme, isGtMillion }) => ({
  padding: theme.spacing(0, 1),
  textDecoration: 'none',
  position: 'relative',
  marginTop: theme.spacing(0.5),
  height: 64,
  background: 'transparent',
  borderRadius: '16px',
  ...(isGtMillion && { fontSize: '38px !important' }),
  ...theme.applyStyles('light', {
    background: (theme.vars || theme).palette.white.main,
  }),
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.alphaLight300.main,
    ...theme.applyStyles('light', {
      backgroundColor: (theme.vars || theme).palette.white.main,
    }),
  },
}));
