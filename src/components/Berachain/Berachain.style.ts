import { Box, Button } from '@mui/material';
import { lighten, styled } from '@mui/material/styles';
import { ProfilePageContainer } from '../ProfilePage/ProfilePage.style';

export const BerachainContainer = styled(ProfilePageContainer)(({ theme }) => ({
  width: '100%',
  position: 'relative',
  fontFamily: 'var(--font-ibm-plex-sans)',
}));

export const BeraChainBackground = styled(Box)(({ theme }) => ({
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

export const BeraChainBackButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  color: theme.palette.text.primary,
  padding: theme.spacing(0.75),
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
