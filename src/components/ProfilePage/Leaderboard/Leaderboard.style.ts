import { alpha, Box, styled } from '@mui/material';

export const LeaderboardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.bgSecondary.main,
  borderRadius: '32px',
  width: '100%',
  padding: theme.spacing(4),
  margin: theme.spacing(4, 0, 0),
  boxShadow: theme.palette.shadow.main,
}));

export const StyledLeaderboardEntry = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isUserPosition',
})<{ isUserPosition: boolean }>(({ theme, isUserPosition }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  margin: '10px 0',
  position: 'relative',
  ...(isUserPosition && {
    '&:before': {
      position: 'absolute',
      top: '-6px',
      left: '-12px',
      content: '""',
      height: '36px',
      width: '312px',
      borderRadius: '6px',
      backgroundColor: alpha(theme.palette.black.main, 0.04),
    },
  }),
}));
