import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export const FormInputField = styled(InputBase)(({ theme }) => {
  const surfaceBorder = getSurfaceBorder(theme, 'surface1');
  return {
    width: '100%',
    padding: theme.spacing(1.5, 2),
    gap: theme.spacing(1.5),
    borderRadius: theme.shape.inputTextBorderRadius,
    backgroundColor: (theme.vars || theme).palette.surface1.main,
    border:
      surfaceBorder !== 'none'
        ? surfaceBorder
        : `1px solid ${(theme.vars || theme).palette.grey[100]}`,
    transition: 'border-color 0.2s ease-in-out',
    '&:hover, &:active, &:focus, &:focus-visible, &:focus-within': {
      borderColor: (theme.vars || theme).palette.borderActive,
    },
    boxShadow: theme.shadows[2],
    '& input': {
      ...theme.typography.bodyMedium,
      verticalAlign: 'middle',
      background: 'transparent',
      padding: 0,
      boxShadow: 'none',
    },
    '& input::placeholder': {
      ...theme.typography.bodyMedium,
      opacity: 1,
      color: (theme.vars || theme).palette.textHint,
    },
    '& input:disabled': {
      pointerEvents: 'none',
      '&::placeholder': {
        color: (theme.vars || theme).palette.textDisabled,
      },
    },
    '&.Mui-error': {
      borderColor: (theme.vars || theme).palette.borderError,
    },
  };
});

export const FormInputErrorMessage = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  color: (theme.vars || theme).palette.textError,
}));
