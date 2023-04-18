import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { getContrastAlphaColor } from '../../utils';

export const ButtonChainSwitch = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  width: '48px',
  height: '48px',
  marginLeft: theme.spacing(3),
  backgroundColor:
    theme.palette.mode === 'dark'
      ? theme.palette.alphaLight300.main
      : theme.palette.white.main,
  zIndex: 1400,
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.alphaLight300.main
        : theme.palette.white.main,
  },
  '&:hover:before': {
    content: '" "',
    position: 'absolute',
    borderRadius: '50%',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    transition: 'background-color 250ms',
    background: getContrastAlphaColor(theme, '4%'),
  },
}));
