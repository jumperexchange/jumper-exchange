import type { Breakpoint } from '@mui/material';
import { Box, styled } from '@mui/material';
import { ButtonSecondary } from 'src/components/Button';

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
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    maxWidth: 256,
  },
}));

export const CardButton = styled(ButtonSecondary)(({ theme }) => ({
  fontSize: 14,
  lineHeight: '18px',
  color:
    theme.palette.mode === 'light'
      ? theme.palette.primary.main
      : theme.palette.white.main,
}));
