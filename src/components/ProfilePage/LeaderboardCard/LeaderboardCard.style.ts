import type { Breakpoint } from '@mui/material';
import { Box, styled } from '@mui/material';
import Link from 'next/link';
import { ButtonSecondary, ButtonTransparent } from 'src/components/Button';
import { TierboxInfoTitles } from '../LevelBox/TierBox.style';

export const CardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.white.main
      : theme.palette.bgSecondary.main,
  borderRadius: '16px',
  width: '100%',
  padding: theme.spacing(2),
  boxShadow: theme.palette.shadowLight.main,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(3),
  },
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
  color:
    theme.palette.mode === 'light'
      ? theme.palette.primary.main
      : theme.palette.white.main,
}));

export const LeaderboardUserPositionButton = styled(ButtonTransparent)(
  ({ theme }) => ({
    padding: theme.spacing(0, 1),
    marginTop: theme.spacing(0.5),
    height: 64,
    background: 'transparent',
    borderRadius: '16px',
    '&:hover': {
      backgroundColor:
        theme.palette.mode === 'dark'
          ? theme.palette.alphaLight300.main
          : theme.palette.white.main,
    },
  }),
);

export const LeaderboardUserTitle = styled(TierboxInfoTitles)(({ theme }) => ({
  width: '100%',
  alignSelf: 'flex-start',
  marginTop: theme.spacing(1),
}));
