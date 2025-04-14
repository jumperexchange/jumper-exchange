import { getContrastAlphaColor } from '@/utils/colors';
import { alpha, IconButton as MuiIconButtom, styled } from '@mui/material';

export const ProfileIconButton = styled(MuiIconButtom)(({ theme }) => ({
  color: alpha(theme.palette.white.main, 0.84),
  transition: 'background 0.3s',
  width: '48px',
  height: '48px',
  backgroundColor:
    (theme.vars || theme).palette.alphaLight300.main,
  '&:hover': {
    backgroundColor: alpha(theme.palette.white.main, 0.08),
  },
  ...theme.applyStyles("light", {
    backgroundColor: (theme.vars || theme).palette.white.main,
    color: alpha(theme.palette.black.main, 0.84)
  })
}));
