import FormHelperText from '@mui/material/FormHelperText';
import { styled } from '@mui/material/styles';

export const WidgetFormHelperText = styled(FormHelperText)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 1,
  color: 'red',
  [theme.breakpoints.down('md')]: {
    maxWidth: 316,
  },
  [theme.breakpoints.up('md')]: {
    maxWidth: '100%',
  },
}));
