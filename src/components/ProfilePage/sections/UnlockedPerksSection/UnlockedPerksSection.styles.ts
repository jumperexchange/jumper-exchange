import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { getTextEllipsisStyles } from 'src/utils/styles/getTextEllipsisStyles';

// Two-column card (info | perks carousel). Stacks on small screens. The surface
// itself comes from SectionCard (surface2); we add the grid + inset highlight.
export const unlockedPerksCardSx: SxProps<Theme> = (theme: Theme) => {
  const palette = (theme.vars || theme).palette;
  return {
    display: 'grid',
    // minmax(0, …) (not bare 1fr) so the column can't be widened past the card
    // by the carousel's intrinsic content width — otherwise cards bleed out.
    gridTemplateColumns: 'minmax(0, 1fr)',
    rowGap: theme.spacing(4),
    columnGap: theme.spacing(4),
    boxShadow: `inset 0px 1px 0px 0px ${palette.white.main}, 0px 4px 24px 0px ${palette.alphaDark200.main}`,
    [theme.breakpoints.up('lg')]: {
      gridTemplateColumns: 'minmax(0, 0.5fr) minmax(0, 1fr)',
    },
  };
};

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

export const UnlockedPerksTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.urbanistTitleXSmall,
  color: (theme.vars || theme).palette.accent1.main,
}));

export const UnlockedPerksDescription = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodyMediumParagraph,
  color: (theme.vars || theme).palette.text.secondary,
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

export const UnlockedPerksCount = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodySmallParagraph,
  color: (theme.vars || theme).palette.text.secondary,
}));

export const PerksColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  // Lets the Swiper compute available width inside the grid cell.
  minWidth: 0,
}));

// Relative wrapper so the nav buttons can sit centered on the carousel edges
// (its overflow stays visible so the straddling buttons aren't clipped; the
// Swiper clips its own slides).
export const CarouselViewport = styled(Box)(() => ({
  position: 'relative',
  minWidth: 0,
}));

// Nav button centered on the left/right edge of the carousel, with the Figma
// "halo": a 4px surface-2 ring around the light button (no edge fade).
export const perksNavButtonSx = (side: 'left' | 'right') => (theme: Theme) => ({
  position: 'absolute',
  top: '50%',
  [side]: 0,
  transform: `translate(${side === 'left' ? '-50%' : '50%'}, -50%)`,
  zIndex: 2,
  border: `${theme.spacing(0.5)} solid ${(theme.vars || theme).palette.surface2.main}`,
});

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

export const PerkCardTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodyMediumStrong,
  color: (theme.vars || theme).palette.text.primary,
  // Clamp long titles to one line, matching the app's PerksCard.
  ...getTextEllipsisStyles(1),
}));

export const PerkCardDescription = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodyXSmall,
  color: (theme.vars || theme).palette.text.secondary,
  // Clamp to two lines so variable-length descriptions don't grow the card.
  ...getTextEllipsisStyles(2, 32),
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

// --- Carousel controls (Showing X of Y + dots) ---

export const PerksControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2),
}));

export const PerksControlsLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodySmallParagraph,
  color: (theme.vars || theme).palette.text.secondary,
}));

export const PerksDots = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

export const PerksDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  width: theme.spacing(1),
  height: theme.spacing(1),
  borderRadius: theme.shape.radiusRoundedFull,
  cursor: 'pointer',
  backgroundColor: active
    ? (theme.vars || theme).palette.accent1.main
    : (theme.vars || theme).palette.alpha300.main,
}));
