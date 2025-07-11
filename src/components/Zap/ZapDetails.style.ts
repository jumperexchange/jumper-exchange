import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const ZapDetailsColumnContainer = styled(Box)(({ theme }) => ({
  width: '100%',
}));

export const ZapDetailsCardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  backgroundColor: (theme.vars || theme).palette.surface2.main,
  borderRadius: `${theme.shape.cardBorderRadius}px`,
  boxShadow: theme.shadows[2],
}));

export const ZapDetailsInfoContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));
