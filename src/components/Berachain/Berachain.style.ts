import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
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
