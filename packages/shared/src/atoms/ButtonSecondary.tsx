import { styled } from '@mui/material/styles';
import { Button } from './Button';

export const ButtonSecondary = styled(Button)(({ theme }) => ({
  color:
    theme.palette.mode === 'dark'
      ? theme.palette.white.main
      : theme.palette.black.main,

  backgroundColor:
    theme.palette.mode === 'dark'
      ? theme.palette.alphaLight300.main
      : theme.palette.white.main,
  '&:hover': {
    background:
      theme.palette.mode === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[500],
  },

  // [theme.breakpoints.up('md')]: {
  //   position: 'relative',
  //   left: 'unset',
  //   transform: 'unset',
  // },
}));
