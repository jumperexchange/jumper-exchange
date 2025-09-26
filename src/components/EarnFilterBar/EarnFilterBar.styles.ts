import { Box, styled } from '@mui/material';

export const EarnFilterBarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.cardBorderRadius,
  boxShadow: `0px 4px 24px 0px rgba(0, 0, 0, 0.08)`,
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  padding: theme.spacing(3),
  gap: theme.spacing(2),
  overflow: 'hidden',
}));

export const EarnFilterBarContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  gap: theme.spacing(2),
}));
