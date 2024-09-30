import Image from 'next/image';
import { alpha, styled } from '@mui/material/styles';

export const ImageWalletMenuButtonStyled = styled(Image)(({ theme }) => ({
  borderRadius: '100%',
  borderStyle: 'solid',
  borderWidth: '2px',
  borderColor:
    theme.palette.mode === 'light'
      ? theme.palette.white.main
      : alpha(theme.palette.white.main, 0.08),
}));
