import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';

export const BerachainAnimationFrame = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.black.main,
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
}));

export const BerachainPlanetGround = styled(Box)(({ theme }) => ({
  backgroundColor: 'transparent',
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  backgroundImage: `url(/berachain/berachain-planet-ground.png)`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  paddingTop: 112,
  '&:after': {
    content: '" "',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgb(0 0 0) 100%)',
  },
}));

export const BerchainSpaceGlow = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.black.main,
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
  backgroundImage: `url(/berachain/berachain-spacy-glowish-background.png)`,
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}));

export const BerachainPlanetContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  overflow: 'visible',
  left: 0,
  right: 0,
  top: '60vh',
  height: '40vh',
  width: '100%',
  '&:after': {
    content: '" "',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgb(0 0 0) 100%)',
  },
}));

export const BerachainPlanetCrater = styled(Image)(({ theme }) => ({
  objectFit: 'cover',
  height: '100%',
  width: '100%',
  overflow: 'visible',
}));

export const BerachainAsteroidX1 = styled(Image)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: '50%',
}));

export const BerachainAsteroidX2 = styled(Image)`
  position: absolute;
  top: 0;
  right: 0;
`;

export const BerachainAsteroidX3 = styled(Image)`
  position: absolute;
  top: 0;
  right: 0;
`;

export const BerachainAsteroidX4 = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
`;

export const BerachainAsteroidX5 = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
`;

export const BerachainAsteroidX6 = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
`;

export const BerachainAsteroidX7 = styled(Image)`
  position: absolute;
  top: 0;
  right: 0;
`;
