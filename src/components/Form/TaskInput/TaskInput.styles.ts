import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';

export const TaskInputField = styled(InputBase)(({ theme }) => ({
  width: '100%',
  '& input': {
    ...theme.typography.bodyMedium,
    boxShadow: theme.shadows[2],
    verticalAlign: 'middle',
    padding: theme.spacing(1.5, 2),
    border: `1px solid`,
    transition: 'border-color 0.2s ease-in-out',
    borderColor: (theme.vars || theme).palette.grey[100],
    borderRadius: theme.shape.inputTextBorderRadius,
    backgroundColor: (theme.vars || theme).palette.alphaLight100.main,
    ...theme.applyStyles?.('light', {
      backgroundColor: (theme.vars || theme).palette.surface1.main,
    }),
    '&:hover, &:active, &:focus, &:focus-visible, &:focus-within': {
      borderColor: (theme.vars || theme).palette.borderActive,
    },
  },
  '& input::placeholder': {
    opacity: 1,
    ...theme.typography.bodyMedium,
    color: (theme.vars || theme).palette.textHint,
  },
  '& input:disabled': {
    pointerEvents: 'none',
    '&::placeholder': {
      color: (theme.vars || theme).palette.textDisabled,
    },
  },
}));
