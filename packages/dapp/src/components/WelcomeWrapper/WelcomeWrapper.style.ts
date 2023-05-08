import { Box, Typography, styled } from '@mui/material';

export const Background = styled('div')(({ theme }) => ({
  backgroundColor: 'transparent',
  height: '100%',
  overflow: 'unset',
  // opacity: theme.palette.mode === 'dark' ? 0.75 : 0.25,
}));

export const GlowTop = styled('span')(({ theme }) => ({
  position: 'absolute',
  background:
    theme.palette.mode === 'dark'
      ? 'radial-gradient(50% 50% at 50% 50%, rgba(190, 160, 235, 0.4) 0%, rgba(190, 160, 235, 0) 100%);'
      : 'radial-gradient(50% 50% at 50% 50%, #8700B8 0%, rgba(255, 255, 255, 0) 100%);',
  top: '50%',
  left: '50%',
  zIndex: -1,
  transform: 'translate(-50%, -50%)',
  width: '85vw',
  height: '85vw',
  maxHeight: 'calc( 100% - 80px )',
}));

export const CustomColor = styled(Typography)(({ theme }) => ({
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(270deg, #D35CFF 0%, #BEA0EB 94.17%)'
      : 'linear-gradient(270deg, #31007A 0%, #8700B8 94.17%);',
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
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg, #24203D 0%, #24203D 100%)'
      : 'linear-gradient(180deg, #F3EBFF 0%, #FFFFFF 100%);',
  ':before': {
    content: '" "',
    height: '288px',
    width: '100%',
    position: 'absolute',
    transform: 'translate(-50%, -287px)',
    background:
      theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg, rgba(36, 32, 61, 0) 0%, #24203D 100%)'
        : 'linear-gradient(180deg, rgba(243, 235, 255, 0) 0%, #F3EBFF 100%);',
  },
}));
