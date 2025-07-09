import Button, { ButtonProps } from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

interface MaxButtonProps extends ButtonProps {
  mainColor?: string;
}

export const MaxButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'mainColor',
})<MaxButtonProps>(({ theme, mainColor }) => ({
  ...theme.typography.bodySmallStrong,
  fontWeight: 600,
  padding: theme.spacing(0.5, 1),
  minWidth: 'unset',
  height: 'auto',
  color: (theme.vars || theme).palette.text.primary,
  backgroundColor: mainColor ?? (theme.vars || theme).palette.bgQuaternary.main,
  '&:hover': {
    backgroundColor:
      mainColor ?? (theme.vars || theme).palette.bgQuaternary.hover,
  },
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.primary.main,
  }),
}));

export const MaxValue = styled(Typography)(({ theme }) => ({
  textAlign: 'right',
}));

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
