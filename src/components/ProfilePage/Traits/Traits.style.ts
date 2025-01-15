import { styled, Typography } from '@mui/material';
import { CardContainer } from '../LeaderboardCard/LeaderboardCard.style';

export const TraitsContainer = styled(CardContainer)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'flex-start',
  gap: theme.spacing(1.5),
  flexWrap: 'wrap',
}));

export const TraitsItem = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(0.75, 1.75),
  alignContent: 'center',
  borderRadius: '16px',
  color:
    theme.palette.mode === 'light'
      ? theme.palette.primary.main
      : theme.palette.white.main,
  backgroundColor: theme.palette.bgQuaternary.main,
}));

export const TraitsRemaining = styled(TraitsItem)(({ theme }) => ({
  color: theme.palette.text.primary,
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.alphaDark100.main
      : theme.palette.alphaLight100.main,
}));
