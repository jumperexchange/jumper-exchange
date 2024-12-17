import { styled } from '@mui/material';
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
