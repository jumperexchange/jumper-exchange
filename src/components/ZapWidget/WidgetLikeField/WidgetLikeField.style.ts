import type { Breakpoint } from '@mui/material';
import {
  alpha,
  Button,
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
  backgroundColor:
    mainColor ?? alpha(mainColor ?? theme.palette.primary.main, 0.75),
  '&:hover': {
    backgroundColor: mainColor ?? theme.palette.primary.main,
  },
}));

export const WidgetLikeGrid = styled(Grid)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: '16px',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  border: `1px solid ${alpha(theme.palette.white.main, 0.08)}`,
  gap: '8px',
  backgroundColor: theme.palette.surface2.main,
  boxShadow:
    theme.palette.mode === 'light'
      ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
      : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
}));

export const WidgetLikeInput = styled(Input)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: '16px',
  backgroundColor: theme.palette.surface2.main,
  border: `1px solid #E5E1EB`,
  '& input': {
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: '36px',
    marginLeft: '8px',
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
