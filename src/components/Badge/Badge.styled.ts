import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const StyledBadge = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: (theme.vars || theme).palette.accent1Alt.main,
  color: (theme.vars || theme).palette.primary.main,
}));

export const StyledBadgeLabel = styled(Typography)(({ theme }) => ({
  fontSize: 10,
  lineHeight: '140%',
  fontWeight: theme.typography.fontWeightBold,
  padding: theme.spacing(0.1, 0.5),
}));
