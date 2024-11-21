import { Box } from '@mui/material';
import { keyframes, styled } from '@mui/material/styles';
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
    // zIndex: 3,
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
  // backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}));

export const BerachainPlanetContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  top: '35vh',
  height: '65vh',
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
}));

export const BerachainAsteroidX1Animation = keyframes`
  0% {
    transform: translateX(calc(-50% - 75px)) translateY(-150px) rotate(10deg) scale(1);
  }
  100% {
    transform: translateX(calc(-50% - 50%)) translateY(200px) rotate(55deg) scale(0);
  }
`;

export const BerachainAsteroidX1 = styled(Image)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: '50%',
  // transform: 'translateX(calc(-50% - 75px)) translateY(-150px) rotate(10deg)',
  animation: `${BerachainAsteroidX1Animation} 15s ease-out 1 forwards`,
  animationIterationCount: 1,
}));

const BerachainAsteroidX2Animation = keyframes`
  0% {
    transform: translateX(50px) translateY(-140px) rotate(160deg) scale(-0.8);
  }
  50% {
    transform: translateX(-100vw) translateY(100px) rotate(360deg) scale(-0.5);
  }
  50.001% {
    transform: translateX(120vw) translateY(-140px) rotate(100deg) scale(-0.8);
  }
  100% {
    transform: translateX(50px) translateY(-140px) rotate(160deg) scale(-0.8);
  }
`;

export const BerachainAsteroidX2 = styled(Image)`
  position: absolute;
  top: 0;
  right: 0;
  animation: ${BerachainAsteroidX2Animation} 30s linear infinite;
`;

const BerachainAsteroidX3Animation = keyframes`
  0% {
    transform: translateX(-200px) translateY(100px) rotate(-45deg) scale(0.4);
  }
  60% {
    transform: translateX(-100vw) translateY(100px) rotate(-135deg) scale(0.4);
  }
  60.001% {
    transform: translateX(140vw) translateY(100px) rotate(-40deg) scale(0.4);
  }
  100% {
    transform: translateX(-200px) translateY(100px) rotate(-45deg) scale(0.4);
  }
`;

export const BerachainAsteroidX3 = styled(Image)`
  position: absolute;
  top: 0;
  right: 0;
  animation: ${BerachainAsteroidX3Animation} 60s linear infinite;
`;

const BerachainAsteroidX4Animation = keyframes`
  0% {
    transform: translateX(200px) translateY(100px) rotate(165deg) scale(0.35);
  }
  70% {
    transform: translateX(100vw) translateY(400px) rotate(270deg) scale(0.35);
  }
  70.001% {
    transform: translateX(-20vw) translateY(0px) rotate(135deg) scale(0.35);
  }
  100% {
    transform: translateX(200px) translateY(100px) rotate(165deg) scale(0.35);
  }
`;

export const BerachainAsteroidX4 = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
  animation: ${BerachainAsteroidX4Animation} 25s linear infinite;
`;

const BerachainAsteroidX5Animation = keyframes`
  0% {
    transform: translateX(0px) translateY(-50px) rotate(170deg) scale(0.35);
  }
  80% {
    transform: translateX(120vw) translateY(150px) rotate(-170deg) scale(0.35);
  }
  80.001% {
    transform: translateX(-40vw) translateY(-30px) rotate(180deg) scale(0.35);
  }
  100% {
    transform: translateX(0px) translateY(-50px) rotate(170deg) scale(0.35);
  }
`;

export const BerachainAsteroidX5 = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
  animation: ${BerachainAsteroidX5Animation} 90s linear infinite;
`;

const BerachainAsteroidX6Animation = keyframes`
  0% {
    transform: translateX(-150px) translateY(200px) rotate(0deg) scaleX(1) scaleY(1);
  }
  80% {
    transform: translateX(500px) translateY(-600px) rotate(45deg) scaleX(0.9) scaleY(0.9);
  }
  80.001% {
    transform: translateX(-300px) translateY(400px) rotate(-5deg) scaleX(1) scaleY(1);
  }
  100% {
    transform: translateX(-150px) translateY(200px) rotate(0deg) scaleX(1) scaleY(1);
  }
`;

export const BerachainAsteroidX6 = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
  animation: ${BerachainAsteroidX6Animation} 20s linear infinite;
`;

const BerachainAsteroidX7Animation = keyframes`
  0% {
    transform: translateX(150px) translateY(200px) rotate(-45deg) scaleX(1);
  }
  65% {
    transform: translateX(-120vw) translateY(240px) rotate(45deg) scaleX(0.8);
  }
  65.001% {
    transform: translateX(100vw) translateY(190px) rotate(5deg) scaleX(1.05);
  }
  100% {
    transform: translateX(150px) translateY(200px) rotate(-45deg) scaleX(1);
  }
`;

export const BerachainAsteroidX7 = styled(Image)`
  position: absolute;
  top: 0;
  right: 0;
  animation: ${BerachainAsteroidX7Animation} 25s linear infinite;
`;
