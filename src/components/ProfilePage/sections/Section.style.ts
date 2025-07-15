import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const SectionContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  gap: theme.spacing(4),
  flexDirection: 'column',
  [theme.breakpoints.up('lg')]: {
    flexDirection: 'row',
  },
}));

// @Note this will be replaced with the actual SectionCard component when available
export const SectionCardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: `${theme.shape.cardBorderRadius}px`,
  boxShadow: theme.shadows[2],
  backgroundColor: (theme.vars || theme).palette.surface2.main,
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.surface1.main,
  }),
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(2),
}));
