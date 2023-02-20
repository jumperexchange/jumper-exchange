import { styled } from '@mui/material/styles';
import { ButtonBase } from './ButtonBase';

export const ButtonPrimary = styled(ButtonBase)(({ theme }) => ({
  color: theme.palette.white.main,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? theme.palette.primary.main
      : theme.palette.accent1.main,
  ':hover': {
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgb(80, 47, 130)' : 'rgb(39, 0, 97)',
  },
}));
