import type { Breakpoint } from '@mui/material';
import {
  alpha,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Input,
  styled,
} from '@mui/material';

export const MaxButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'mainColor',
})<any>(({ theme, mainColor }) => ({
  padding: theme.spacing(0.5, 1, 0.625, 1),
  lineHeight: 1.0715,
  fontSize: '0.875rem',
  minWidth: 'unset',
  height: 'auto',
  color: '#fff',
  backgroundColor: mainColor ?? alpha(theme.palette.primary.main, 0.75),
  '&:hover': {
    backgroundColor: mainColor ?? theme.palette.primary.main,
  },
}));

export const WidgetFormHelperText = styled(FormHelperText)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 1,
  color: 'red',
  [theme.breakpoints.down('md' as Breakpoint)]: {
    maxWidth: 316,
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    maxWidth: '100%',
  },
}));
