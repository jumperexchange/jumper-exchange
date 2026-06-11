import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

// Two-column card (info | perks carousel). Stacks on small screens. The surface
// and elevation come from SectionCard (surface2); we add the grid.
export const unlockedPerksCardSx: SxProps<Theme> = (theme: Theme) => ({
  display: 'grid',
  // minmax(0, …) (not bare 1fr) so the column can't be widened past the card
  // by the carousel's intrinsic content width — otherwise cards bleed out.
  gridTemplateColumns: 'minmax(0, 1fr)',
  rowGap: theme.spacing(4),
  columnGap: theme.spacing(4),
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'minmax(0, 0.5fr) minmax(0, 1fr)',
  },
});

export const InfoColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: theme.spacing(4),
  height: '100%',
}));

export const InfoTop = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
}));

export const OpenHubWrapper = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(2),
}));

export const InfoBottom = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const InfoDivider = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '1px',
  backgroundColor: (theme.vars || theme).palette.border,
}));

// --- Compact perk card ---

export const PerkCardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  // Include padding in the width so the card fills the slide exactly (the slide
  // is sized to 100% of the card's box) instead of overflowing by its padding.
  boxSizing: 'border-box',
  padding: theme.spacing(2),
  borderRadius: `${theme.shape.radius12}px`,
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  // Elevation 1 (Figma) — tokenized color.
  boxShadow: `0px 2px 4px 0px ${(theme.vars || theme).palette.alphaDark100.main}`,
  // Fill the Swiper slide (slide width is driven by slidesPerView).
  width: '100%',
}));

const perkImageStyles = (theme: Theme) => ({
  width: '100%',
  height: theme.spacing(14),
  borderRadius: `${theme.shape.radius16}px`,
  objectFit: 'cover' as const,
  backgroundColor: (theme.vars || theme).palette.surface2.main,
});

export const PerkCardImage = styled('img')(({ theme }) =>
  perkImageStyles(theme),
);

export const PerkCardImagePlaceholder = styled(Box)(({ theme }) =>
  perkImageStyles(theme),
);

export const PerkCardContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const PerkCardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const PerkCardBadges = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  // Wrap rather than overflow when the card is too narrow for both badges
  // side by side (otherwise the right badge spills past the card edge).
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));
