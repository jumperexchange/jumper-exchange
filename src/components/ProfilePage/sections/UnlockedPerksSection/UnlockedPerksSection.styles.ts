import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

export const unlockedPerksCardSx: SxProps<Theme> = (theme: Theme) => {
  const palette = (theme.vars || theme).palette;
  return {
    display: 'grid',
    rowGap: theme.spacing(4),
    columnGap: theme.spacing(4),
    boxShadow: `0px 4px 24px 0px ${palette.alphaDark200.main}`,
    gridTemplateColumns: 'minmax(0, 1fr)',
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

export const openHubButtonSx: SxProps<Theme> = (theme: Theme) => ({
  marginTop: theme.spacing(1),
  alignSelf: 'flex-start',
});

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
