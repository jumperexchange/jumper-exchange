import { styled, alpha, Button } from '@mui/material';

export const MaxButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'mainColor',
})<any>(({ theme, mainColor }) => ({
  padding: theme.spacing(0.5, 1, 0.625, 1),
  lineHeight: 1.0715,
  fontSize: '0.875rem',
  minWidth: 'unset',
  height: 'auto',
  color: '#fff',
  backgroundColor:
    mainColor ?? alpha(mainColor ?? theme.palette.primary.main, 0.75),
  '&:hover': {
    backgroundColor: mainColor ?? theme.palette.primary.main,
  },
}));
