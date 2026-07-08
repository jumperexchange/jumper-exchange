import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export const JumperPassCardContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('lg')]: {
    flex: 1,
  },
}));

export const jumperPassCardSx: SxProps<Theme> = (theme: Theme) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: '100%',
  gap: theme.spacing(0.75),
  overflow: 'hidden',
});

export const JumperPassTitle = styled(Typography)(({ theme }) => {
  const palette = (theme.vars || theme).palette;
  return {
    fontWeight: theme.typography.fontWeightBold,
    width: 'fit-content',
    background: `linear-gradient(90deg, ${palette.accent1.main}, ${palette.accent2.main})`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
  };
});

export const JumperPassProgressContainer = styled(Box)(() => ({
  width: '100%',
}));

export const JumperPassLevelLabels = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  marginTop: theme.spacing(1),
}));

export const JumperPassStatsContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(3),
  right: theme.spacing(3),
  // Hidden on the smallest screens where the chips would clash with the
  // title/subtitle; shown from the sm breakpoint up.
  display: 'none',
  gap: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    display: 'flex',
  },
}));

export const PassStatChipContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2),
  borderRadius: `${theme.shape.radius8}px`,
  backgroundColor: (theme.vars || theme).palette.alpha100.main,
}));

export const PassStatChipText = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));
