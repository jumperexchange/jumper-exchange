import { Box, Breakpoint, Typography, styled } from '@mui/material';
import { NavbarHeight } from '../Navbar/Navbar.style';

export const Background = styled('div')(({ theme }) => ({
  backgroundColor: 'transparent',
  overflow: 'hidden',
  position: 'relative',
  height: `calc( 100vh - ${NavbarHeight.XS} )`,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    height: `calc( 100vh - ${NavbarHeight.SM} )`,
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    height: `calc( 100vh - ${NavbarHeight.LG} )`,
  },
}));

export const CustomColor = styled(Typography)(({ theme }) => ({
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(270deg, #D35CFF 0%, #BEA0EB 94.17%)'
      : 'linear-gradient(270deg, #31007A 0%, #8700B8 94.17%);',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

export const ColoredContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  height: '50%',
  width: '100%',
}));

export const ContentContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  bottom: 0,
  width: '100%',
  position: 'absolute',
  paddingBottom: theme.spacing(8),
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg, #24203D 0%, #24203D 100%)'
      : 'linear-gradient(180deg, rgba(237, 224, 255, 0.25) 0%, #EDE0FF 38.54%, #F3EBFF 97.4%);',
}));
