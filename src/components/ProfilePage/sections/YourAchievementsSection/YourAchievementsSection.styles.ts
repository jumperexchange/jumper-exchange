import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

// Full-width "Your achievements" card. The surface and elevation come from
// SectionCard; we only stack the header / tabbed content.
export const yourAchievementsCardSx: SxProps<Theme> = (theme: Theme) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
});

export const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
}));

export const TabbedContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const AchievementsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  width: '100%',
  // 4 columns at the desktop content width, fewer as the card narrows.
  gridTemplateColumns: `repeat(auto-fill, minmax(${theme.spacing(28)}, 1fr))`,
  gap: theme.spacing(2),
}));

// The shared Pagination brings its own surface chrome; this section places it
// directly on the card surface.
export const paginationSx: SxProps<Theme> = {
  backgroundColor: 'transparent',
  border: 'none',
};
