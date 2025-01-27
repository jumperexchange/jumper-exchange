import type { Breakpoint } from '@mui/material';
import {
  alpha,
  Button,
  FormControl,
  FormHelperText,
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
  backgroundColor:
    mainColor ?? alpha(mainColor ?? theme.palette.primary.main, 0.75),
  '&:hover': {
    backgroundColor: mainColor ?? theme.palette.primary.main,
  },
}));

export const CustomFormControl = styled(FormControl)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: '16px',
  backgroundColor: theme.palette.surface2.main,
  border: `1px solid ${theme.palette.mode === 'light' ? '#E5E1EB' : '#302B52'}`,
  display: 'flex',
  flexDirection: 'row',
  alignContent: 'flex-start',
  alignItems: 'center',
  '& input': {
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: '36px',
    marginLeft: '12px',
    padding: 0,
    height: '1em',
  },
  '& input::placeholder': {
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: '36px',
    marginLeft: '8px',
  },
  '& .MuiInput-underline:before': { borderBottom: 'none' },
  '& .MuiInput-underline:after': { borderBottom: 'none' },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    borderBottom: 'none',
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
