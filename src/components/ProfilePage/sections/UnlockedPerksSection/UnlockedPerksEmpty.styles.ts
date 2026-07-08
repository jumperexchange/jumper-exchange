import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

// Empty state shown in the perks column when the wallet has unlocked no perks.
// Mirrors the perk-card shell (surface1, radius, elevation) but centers an
// illustration with a short message.
export const EmptyCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(3),
  boxSizing: 'border-box',
  height: '100%',
  minHeight: theme.spacing(30),
  padding: theme.spacing(2),
  borderRadius: `${theme.shape.radius12}px`,
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  boxShadow: `0px 2px 4px 0px ${(theme.vars || theme).palette.alphaDark100.main}`,
  textAlign: 'center',
}));

export const EmptyText = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
}));
