import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

export const unlockedPerksCardSx: SxProps<Theme> = (theme: Theme) => {
  const palette = (theme.vars || theme).palette;
  return {
    display: 'grid',
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

export const PerkCardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  // We need to fit the arrows
  boxSizing: 'border-box',
  padding: theme.spacing(2),
  borderRadius: `${theme.shape.radius12}px`,
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  boxShadow: `0px 2px 4px 0px ${(theme.vars || theme).palette.alphaDark100.main}`,
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
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));
