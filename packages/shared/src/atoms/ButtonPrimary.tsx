import { styled } from '@mui/material/styles';
import { Button } from './Button';

export const ButtonPrimary = styled(Button)(({ theme }) => ({
  color: theme.palette.white.main,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? theme.palette.primary.main
      : theme.palette.accent1.main,
  // backgroundColor:
  //   theme.palette.mode === 'dark'
  //     ? theme.palette.alphaLight300.main
  //     : theme.palette.white.main,
}));

// backgroundColor={
//   !account.isActive
//     ? theme.palette.accent1.main
//     : !!isDarkMode
//     ? theme.palette.alphaLight300.main
//     : theme.palette.white.main
// }
