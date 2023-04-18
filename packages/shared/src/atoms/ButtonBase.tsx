import { Button as MuiButton, ButtonProps } from '@mui/material'; //ButtonProps
import { styled } from '@mui/material/styles';

export const ButtonBase = styled(MuiButton)<ButtonProps>(({ theme }) => ({
  height: '48px',
  borderRadius: '24px',
  fontSize: '16px',
  letterSpacing: '0',
  textTransform: 'none',
  fontWeight: 'bold',
  color:
    theme.palette.mode === 'dark'
      ? theme.palette.white.main
      : theme.palette.black.main,
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.primary.main
        : theme.palette.accent1.main,
  },
}));
