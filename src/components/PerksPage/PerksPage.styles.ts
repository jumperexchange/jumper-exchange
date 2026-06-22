import type { SxProps, Theme } from '@mui/material/styles';

// Perks hub card: the surface and elevation come from SectionCard; we only
// stack the tab bar and the grid with the Figma's 32px gap.
export const perksSectionCardSx: SxProps<Theme> = (theme: Theme) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
});
