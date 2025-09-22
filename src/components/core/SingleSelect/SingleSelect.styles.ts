import { styled } from '@mui/material/styles';
import Select, { SelectProps } from '@mui/material/Select';
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem';
import FormControl, { FormControlProps } from '@mui/material/FormControl';
import InputLabel, { InputLabelProps } from '@mui/material/InputLabel';
import FormHelperText, { FormHelperTextProps } from '@mui/material/FormHelperText';

export const StyledFormControl = styled(FormControl)<FormControlProps>(
  ({ theme }) => ({
    minWidth: 120,
  })
);

export const StyledSelect = styled(Select)<SelectProps>(({ theme }) => ({
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: (theme.vars || theme).palette.primary.main,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: (theme.vars || theme).palette.primary.light,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: (theme.vars || theme).palette.primary.dark,
  },
  '&.Mui-error .MuiOutlinedInput-notchedOutline': {
    borderColor: (theme.vars || theme).palette.error.main,
  },
}));

export const StyledMenuItem = styled(MenuItem)<MenuItemProps>(
  ({ theme }) => ({
    '&.Mui-selected': {
      backgroundColor: (theme.vars || theme).palette.primary.main + '20',
    },
    '&.Mui-selected:hover': {
      backgroundColor: (theme.vars || theme).palette.primary.main + '30',
    },
    '&:hover': {
      backgroundColor: (theme.vars || theme).palette.action.hover,
    },
    '&.Mui-disabled': {
      opacity: 0.5,
    },
  })
);

export const StyledInputLabel = styled(InputLabel)<InputLabelProps>(
  ({ theme }) => ({
    '&.Mui-focused': {
      color: (theme.vars || theme).palette.primary.main,
    },
    '&.Mui-error': {
      color: (theme.vars || theme).palette.error.main,
    },
  })
);

export const StyledFormHelperText = styled(
  FormHelperText
)<FormHelperTextProps>(({ theme }) => ({
  '&.Mui-error': {
    color: (theme.vars || theme).palette.error.main,
  },
}));

export const IconWrapper = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  marginRight: theme.spacing(1),
  verticalAlign: 'middle',
}));