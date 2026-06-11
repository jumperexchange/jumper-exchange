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

// --- Achievement tile (shared shell of mission / activity cards) ---

export const AchievementTile = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  boxSizing: 'border-box',
  height: theme.spacing(36),
  padding: theme.spacing(2),
  borderRadius: `${theme.shape.radius12}px`,
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  // Elevation 1 (Figma) — tokenized color.
  boxShadow: `0px 2px 4px 0px ${(theme.vars || theme).palette.alphaDark100.main}`,
}));

const tileImageStyles = (theme: Theme) => ({
  width: '100%',
  height: theme.spacing(14),
  borderRadius: `${theme.shape.radius16}px`,
  objectFit: 'cover' as const,
  backgroundColor: (theme.vars || theme).palette.surface2.main,
});

export const TileImage = styled('img')(({ theme }) => tileImageStyles(theme));

export const TileImagePlaceholder = styled(Box)(({ theme }) =>
  tileImageStyles(theme),
);

export const TileContent = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  flexGrow: 1,
  minHeight: 0,
  width: '100%',
}));

// --- Activity tile internals ---

export const ActivityHeaderGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
}));

export const ActivityHeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  width: '100%',
}));

export const ActivityFooterRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  width: '100%',
}));
