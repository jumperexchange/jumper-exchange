import type { BoxProps } from '@mui/material';
import { Box, Typography, styled } from '@mui/material';

export const StrengthMeterContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  width: '100%',
});

interface StrengthBarProps extends BoxProps {
  score: number;
}

export const StrengthBar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'score',
})<StrengthBarProps>(({ theme, score }) => {
  const p = (theme.vars || theme).palette;
  const strengthColors = [
    p.error.main,
    p.warning.main,
    p.warning.light,
    p.success.light,
    p.success.main,
  ];
  return {
    height: 4,
    borderRadius: 2,
    width: `${((score + 1) / 5) * 100}%`,
    backgroundColor: strengthColors[score] ?? strengthColors[0],
    transition: 'width 0.3s ease, background-color 0.3s ease',
  };
});

export const StrengthBarTrack = styled(Box)(({ theme }) => ({
  height: 4,
  borderRadius: 2,
  width: '100%',
  backgroundColor: (theme.vars || theme).palette.alphaLight200.main,
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.alphaDark200.main,
  }),
}));

export const StrengthLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodySmall,
  color: (theme.vars || theme).palette.text.secondary,
}));
