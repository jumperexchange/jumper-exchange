import { Box, styled } from '@mui/system';

export const BerachainStarsContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  zIndex: 3,

  '.star': {
    boxShadow: '0px 0px 1px 1px rgba(255, 255, 255, 0.4)',
    position: 'absolute',
    width: 1,
    height: 1,
    borderRadius: '2px',
    backgroundColor: theme.palette.white.main,
  },
}));
