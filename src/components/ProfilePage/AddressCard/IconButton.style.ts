import { getContrastAlphaColor } from '@/utils/colors';
import { IconButton as MuiIconButtom, styled } from '@mui/material';

export const ProfileIconButton = styled(MuiIconButtom)(({ theme }) => ({
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
