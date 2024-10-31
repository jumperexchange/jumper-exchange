import { Box, Stack, styled, Typography } from '@mui/material';

export const LeaderboardContainer = styled(Box)(({ theme }) => ({
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.bgSecondary.main,
  borderRadius: '32px',
  width: '100%',
  padding: theme.spacing(4),
  margin: theme.spacing(4, 0, 0),
  boxShadow: theme.palette.shadow.main,
}));

export const LeaderboardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingLeft: theme.spacing(3),
}));

export const LeaderboardUpdateDateLabel = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.alphaDark100.main,
  borderRadius: '16px',
}));

export const LeaderboardEntryStack = styled(Stack)(({ theme }) => ({
  background: theme.palette.bgTertiary.main,
  padding: theme.spacing(0, 3),
  borderRadius: '24px',
  marginTop: theme.spacing(3),
}));
