import type { Breakpoint, TypographyProps } from '@mui/material';
import { Stack, styled, Typography } from '@mui/material';
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

interface TraitsRemaingProps extends TypographyProps {
  href: string;
}

export const TraitsRemaining = styled(TraitsItem)<TraitsRemaingProps>(
  ({ theme }) => ({
    textDecoration: 'none',
    color: theme.palette.text.primary,
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.alphaDark100.main
        : theme.palette.alphaLight100.main,
    // copy "bodyXSmallStrong" style -->
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: 0,
    transition: 'background-color 300ms ease-in-out',

    '&:hover': {
      backgroundColor:
        theme.palette.mode === 'light'
          ? theme.palette.alphaDark300.main
          : theme.palette.alphaLight300.main,
    },
  }),
);

export const TraitsEntryStack = styled(Stack)(({ theme }) => ({
  background: theme.palette.bgTertiary.main,
  padding: theme.spacing(0, 1),
  borderRadius: '24px',
  marginTop: theme.spacing(3),
  boxShadow: theme.shadows[2],
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(0, 3),
  },
}));
