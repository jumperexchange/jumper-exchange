import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import { SectionCardContainer } from 'src/components/Cards/SectionCard/SectionCard.style';

// Keeps a section's tab pill group left-aligned and intrinsically sized (the
// shared HorizontalTabs container otherwise stretches to fill the row).
export const sectionTabsSx: SxProps<Theme> = (theme: Theme) => ({
  width: 'fit-content',
  flex: 'unset',
  '& button:not(.Mui-selected)': {
    color: `${(theme.vars || theme).palette.text.secondary} !important`,
  },
});

// The hero row: Jumper Pass card (grows) + RankCard (fixed width), matching the
// Figma. Stacks vertically below the lg breakpoint.
export const IntroHeroRow = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  gap: theme.spacing(4),
  flexDirection: 'column',
  [theme.breakpoints.up('lg')]: {
    flexDirection: 'row',
  },
}));

export const RewardsSectionContainer = styled(SectionCardContainer)(
  ({ theme }) => ({
    overflowX: 'hidden',
    backgroundColor: (theme.vars || theme).palette.surface2.main,
    border: getSurfaceBorder(theme, 'surface2'),
  }),
);

export const RewardsSectionContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    alignItems: 'center',
    flexDirection: 'row',
  },
}));

export const RewardsSectionHeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexShrink: 0,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
}));

// --- Achievement tile (shared shell of the mission / activity cards in the
// "Your achievements" and "Earn XP" sections) ---

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
  width: '100%',
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

export const TileHeaderGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
}));

export const TileHeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  width: '100%',
}));

export const TileFooterRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  width: '100%',
}));
