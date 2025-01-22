import { Box, styled } from '@mui/material';
import { alpha, Button } from '@mui/material';

export const MaxButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'mainColor',
})<any>(({ theme, mainColor }) => ({
  padding: theme.spacing(0.5, 1, 0.625, 1),
  lineHeight: 1.0715,
  fontSize: '0.875rem',
  minWidth: 'unset',
  height: 'auto',
  color: theme.palette.text.primary,
  backgroundColor: alpha(mainColor ?? theme.palette.primary.main, 0.78),
  '&:hover': {
    backgroundColor: alpha(mainColor ?? theme.palette.primary.main, 0.48),
  },
}));

export const NotConnectedBox = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
  display: 'grid', // 'place-content-center' is equivalent to a grid with centered content.
  placeContent: 'center', // Centers content horizontally and vertically.
  alignItems: 'start', // Aligns items at the start along the cross-axis.
}));
