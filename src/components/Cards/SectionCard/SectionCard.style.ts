import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const SectionCardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.cardBorderRadius,
  boxShadow: theme.shadows[2],
  backgroundColor: (theme.vars || theme).palette.surface2.main,
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.surface1.main,
  }),
}));
