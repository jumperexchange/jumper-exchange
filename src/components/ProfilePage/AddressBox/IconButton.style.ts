import type { IconButtonProps } from '@mui/material';
import { IconButton as MuiIconButtom, darken, styled } from '@mui/material';
import { getContrastAlphaColor } from 'src/utils';

export const ProfileIconButton = styled(MuiIconButtom, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<IconButtonProps>(({ theme }) => ({
  color: getContrastAlphaColor(theme, '84%'),
  transition: 'background 0.3s',
  width: '48px',
  height: '48px',
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.white.main
      : theme.palette.alphaLight300.main,
  '&:hover': {
    backgroundColor: getContrastAlphaColor(theme, '8%'),
  },
}));
