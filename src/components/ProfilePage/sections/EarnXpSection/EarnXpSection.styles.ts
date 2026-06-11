import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

// Full-width "Earn XP" card. The surface and elevation come from SectionCard;
// we only stack the header / tabs.
export const earnXpCardSx: SxProps<Theme> = (theme: Theme) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
});

export const HeaderGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const HeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
}));

export const HeaderText = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
}));

export const HeaderDivider = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '1px',
  backgroundColor: (theme.vars || theme).palette.border,
}));

export const TabsGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const TabBarRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
}));

export const XpStat = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  flexShrink: 0,
}));

// Placeholder while the Activity tab has no data source yet; matches the
// mission card height so switching tabs doesn't jump the layout.
export const ActivityPlaceholder = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: theme.spacing(36),
  textAlign: 'center',
}));
