import { Box, styled } from '@mui/material';

export const LeaderboardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.bgSecondary.main,
  borderRadius: '32px',
  width: '100%',
  padding: theme.spacing(4),
  margin: theme.spacing(4, 0, 0),
  boxShadow: theme.palette.shadow.main,
}));
