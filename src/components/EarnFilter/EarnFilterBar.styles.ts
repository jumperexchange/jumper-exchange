import { Box, styled } from '@mui/material';

export const EarnFilterBarContainer = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.cardBorderRadius,
  boxShadow: theme.shadows[2],
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  padding: theme.spacing(2),
}));
