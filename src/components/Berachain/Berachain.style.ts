import { Box, Button } from '@mui/material';
import { lighten, styled } from '@mui/material/styles';
import { inter } from 'src/fonts/fonts';
import { ProfilePageContainer } from '../ProfilePage/ProfilePage.style';

export const BerachainFrame = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.black.main,
  position: 'fixed',
  overflowY: 'scroll',
  top: 0,
  left: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  paddingTop: 80,
}));

export const BerachainStarsBackground = styled(Box)(({ theme }) => ({
  position: 'fixed',
  left: 0,
  top: 0,
  width: '100vw',
  height: '100vh',
  right: 0,
  bottom: 0,
  backgroundImage: `url(/berachain/berachain-stars-background.png)`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}));

export const BerachainContentContainer = styled(ProfilePageContainer)(() => ({
  width: '100%',
  zIndex: 10,
  fontFamily: 'var(--font-ibm-plex-sans)',
}));

export const BerachainWelcomeContainer = styled(Box)(() => ({
  width: '100%',
  zIndex: 100,
  position: 'relative',
  overflow: 'scroll',
  fontFamily: inter.style.fontFamily,
  paddingBottom: 64,
}));

export const BerachainBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '200%',
  height: 'auto',
  background: `url('/berachain/berachain-bg.png')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}));

export const BerachainBackButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  color: theme.palette.text.primary,
  padding: theme.spacing(0.75, 1.5),
  justifyContent: 'center',
  alignItems: 'center',
  height: 40,
  borderRadius: '20px',
  background: '#1E1D1C',
  transition: 'background ease-in-out 300ms',
  '&:hover': {
    background: lighten('#1E1D1C', 0.04),
  },
}));
