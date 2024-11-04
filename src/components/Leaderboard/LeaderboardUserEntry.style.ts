import { Box, styled } from '@mui/material';

export const LeaderboardUserEntryBox = styled(Box)(({ theme }) => ({
  boxShadow: theme.palette.shadowLight.main,
  borderRadius: '24px',
  marginTop: theme.spacing(3),
}));
