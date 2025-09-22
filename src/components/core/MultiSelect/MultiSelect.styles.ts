import { styled } from '@mui/material/styles';
import Select, { SelectProps } from '@mui/material/Select';
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem';
import FormControl, { FormControlProps } from '@mui/material/FormControl';
import InputLabel, { InputLabelProps } from '@mui/material/InputLabel';
import FormHelperText, {
  FormHelperTextProps,
} from '@mui/material/FormHelperText';
import Chip, { ChipProps } from '@mui/material/Chip';
import Box from '@mui/material/Box';

export const StyledFormControl = styled(FormControl)<FormControlProps>(
  ({ theme }) => ({
    minWidth: 120,
  }),
);

const getPillRadius = (size?: 'small' | 'medium') => {
  return size === 'small' ? 16 : 20;
};

export const StyledSelect = styled(Select)<SelectProps>(({ theme, size }) => {
  const pillRadius = getPillRadius(size as 'small' | 'medium');

  return {
    backgroundColor: (theme.vars || theme).palette.action.hover,
    borderRadius: pillRadius,
    '& .MuiSelect-select': {
      padding: size === 'small' ? '6px 32px 6px 16px' : '8px 32px 8px 24px',
      minHeight: size === 'small' ? '20px' : '24px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '&:hover': {
      backgroundColor: (theme.vars || theme).palette.action.hover,
    },
    '&.Mui-focused': {
      backgroundColor: (theme.vars || theme).palette.action.hover,
      '& .MuiOutlinedInput-notchedOutline': {
        border: `2px solid ${(theme.vars || theme).palette.primary.main}`,
        borderRadius: pillRadius,
      },
    },
    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
      border: `2px solid ${(theme.vars || theme).palette.error.main}`,
      borderRadius: pillRadius,
    },
    '& .MuiSelect-icon': {
      right: size === 'small' ? 8 : 12,
      color: (theme.vars || theme).palette.text.secondary,
    },
  };
});

export const StyledMenuItem = styled(MenuItem)<MenuItemProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '&.Mui-selected': {
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: (theme.vars || theme).palette.action.hover,
    },
  },
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.action.hover,
  },
  '&.Mui-disabled': {
    opacity: 0.5,
  },
}));

export const StyledInputLabel = styled(InputLabel)<InputLabelProps>(
  ({ theme }) => ({
    '&.Mui-focused': {
      color: (theme.vars || theme).palette.primary.main,
    },
    '&.Mui-error': {
      color: (theme.vars || theme).palette.error.main,
    },
  }),
);

export const StyledFormHelperText = styled(FormHelperText)<FormHelperTextProps>(
  ({ theme }) => ({
    '&.Mui-error': {
      color: (theme.vars || theme).palette.error.main,
    },
  }),
);

export const ChipContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
  alignItems: 'center',
}));

export const StyledChip = styled(Chip)<ChipProps>(({ theme }) => ({
  height: 24,
  borderRadius: 12,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  '& .MuiChip-label': {
    padding: '0 8px',
    fontSize: '0.875rem',
  },
  '& .MuiChip-deleteIcon': {
    fontSize: '1rem',
    marginRight: 4,
    marginLeft: -4,
    color: (theme.vars || theme).palette.text.secondary,
    '&:hover': {
      color: (theme.vars || theme).palette.text.primary,
    },
  },
}));

export const IconWrapper = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  marginRight: theme.spacing(1),
  verticalAlign: 'middle',
}));

export const GroupHeader = styled('div')(({ theme }) => ({
  padding: theme.spacing(1, 2),
  fontWeight: 600,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: '0.875rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}));
