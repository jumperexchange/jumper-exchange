import { Box, Breakpoint, Typography, styled } from '@mui/material';

export const Background = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.surface2.main,
  height: '100%',
  // opacity: theme.palette.mode === 'dark' ? 0.75 : 0.25,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    backgroundColor: 'transparent',
  },
}));

export const GlowTop = styled('span')(({ theme }) => ({
  position: 'absolute',
  background:
    'radial-gradient(50% 50% at 50% 50%, rgba(190, 160, 235, 0.4) 0%, rgba(190, 160, 235, 0) 100%);',
  top: '50%',
  left: '50%',
  zIndex: -1,
  transform: 'translate(-50%, -50%)',
  width: '85vw',
  height: '85vw',
}));

export const CustomColor = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(270deg, #D35CFF 0%, #BEA0EB 94.17%)',
  backgroundClip: 'text',
  paddingTop: theme.spacing(10),
  textFillColor: 'transparent',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

export const ColoredContainer = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  height: '288px',
  width: '100%',
  background: 'linear-gradient(180deg, rgba(36, 32, 61, 0) 0%, #24203D 100%)',
}));

export const ContentContainer = styled(Box)(({ theme }) => ({
  position: 'sticky',
  textAlign: 'center',
  bottom: 0,
  height: '50%',
  width: '100%',
  background: 'linear-gradient(180deg, #24203D 0%, #24203D 100%)',
  ':before': {
    content: '" "',
    height: '288px',
    width: '100%',
    position: 'absolute',
    transform: 'translate(-50%, -287px)',
    background: 'linear-gradient(180deg, rgba(36, 32, 61, 0) 0%, #24203D 100%)',
  },
}));
