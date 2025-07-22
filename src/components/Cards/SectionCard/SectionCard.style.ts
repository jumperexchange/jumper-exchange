import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const SectionCardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.cardBorderRadius,
  // elevation-4
  boxShadow: `0px 4px 24px 0px rgba(0, 0, 0, 0.08)`,
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.surface1.main,
  }),
}));
