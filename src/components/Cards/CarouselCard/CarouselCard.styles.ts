import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

export const CarouselCardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  // We need to fit the carousel arrows alongside the card.
  boxSizing: 'border-box',
  height: theme.spacing(35.5),
  padding: theme.spacing(2),
  borderRadius: `${theme.shape.radius12}px`,
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  boxShadow: `0px 2px 4px 0px ${(theme.vars || theme).palette.alphaDark100.main}`,
}));

export const CarouselCardMedia = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: theme.spacing(14),
  flexShrink: 0,
}));

const mediaStyles = (theme: Theme) => ({
  width: '100%',
  height: '100%',
  display: 'block',
  borderRadius: `${theme.shape.radius16}px`,
  objectFit: 'cover' as const,
  backgroundColor: (theme.vars || theme).palette.surface2.main,
});

export const CarouselCardImage = styled('img')(({ theme }) =>
  mediaStyles(theme),
);

export const CarouselCardImagePlaceholder = styled(Box)(({ theme }) =>
  mediaStyles(theme),
);

// Anchored to the bottom-left of the media and straddling its edge, e.g. a
// chain avatar.
export const CarouselCardMediaOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: theme.spacing(2),
  bottom: 0,
  transform: 'translateY(50%)',
}));

export const CarouselCardContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  minHeight: 0,
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
}));

export const CarouselCardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const CarouselCardBadges = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));
