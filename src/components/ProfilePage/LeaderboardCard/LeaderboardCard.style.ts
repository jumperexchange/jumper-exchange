import type { Breakpoint } from '@mui/material';
import { Box, styled } from '@mui/material';
import { ButtonSecondary, ButtonTransparent } from 'src/components/Button';
import { TierboxInfoTitles } from '../LevelBox/TierBox.style';

export const CardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.bgSecondary.main,
  borderRadius: '16px',
  width: '100%',
  padding: theme.spacing(4),
  boxShadow: theme.palette.shadowLight.main,
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
  justifyContent: 'space-between',
  alignItems: 'center',
  flexGrow: 1,
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
}));

export const CardButton = styled(ButtonSecondary)(({ theme }) => ({
  fontSize: 14,
  width: '100%',
  lineHeight: '18px',
  color:
    theme.palette.mode === 'light'
      ? theme.palette.primary.main
      : theme.palette.white.main,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    minWidth: 192,
  },
}));

export const LeaderboardUserPositionButton = styled(ButtonTransparent)(
  ({ theme }) => ({
    padding: theme.spacing(0, 1),
    marginTop: theme.spacing(0.5),
    height: 64,
    background: 'transparent',
    '&:hover': {
      backgroundColor:
        theme.palette.mode === 'dark'
          ? theme.palette.alphaLight300.main
          : theme.palette.white.main,
    },
  }),
);

export const LeaderboardUserTitle = styled(TierboxInfoTitles)(() => ({
  marginTop: 0,
  alignSelf: 'flex-start',
}));
