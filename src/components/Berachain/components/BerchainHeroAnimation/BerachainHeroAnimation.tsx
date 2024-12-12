import { motion } from 'motion/react';
import { BerachainStars } from '../BerachainStars/BerachainStars';
import {
  BerachainAnimationFrame,
  BerachainPlanetContainer,
  BerachainPlanetCrater,
  BerchainSpaceGlow,
} from './BerachainHeroAnimation.style';
import { BerachainHeroImages } from './BerchainHeroImages';

const BerachainHeroAnimation = () => {
  return (
    <BerachainAnimationFrame className="animation-frame">
      <BerchainSpaceGlow sx={{ zIndex: 2 }} />
      <BerachainStars />
      {/* todo: sx -> without casting? */}
      <motion.img
        className="BerachainAsteroidX1"
        src={'/berachain/berachain-asteroid-2.svg'}
        alt="Berachain Asteroid 1"
        width={386}
        height={293}
        style={{ zIndex: 4, position: 'absolute', top: 0, left: '50%' }}
        initial={{ x: '-75px', y: '-150px', rotate: 10, scale: 1 }}
        animate={{ x: '-50%', y: '200px', rotate: 55, scale: 0 }}
        transition={{
          duration: 15,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
      <motion.img
        className="BerachainAsteroidX2"
        src={'/berachain/berachain-asteroid-2.svg'}
        alt="Berachain Asteroid 2"
        width={386}
        height={293}
        style={{
          zIndex: 4,
          position: 'absolute',
          top: 0,
          right: 0,
        }}
        initial={{
          x: '0',
          y: '-140px',
          rotate: 160,
          scale: 0.8,
        }}
        animate={{
          x: ['0', '-100%'],
          y: ['-140px', '100px'],
          rotate: [160, 360],
          scale: [0.8, 0.5],
        }}
        transition={{
          duration: 30,
          times: [0, 0.5, 0.50001, 1],
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
      <motion.img
        className="BerachainAsteroidX3"
        src={'/berachain/berachain-asteroid-2.svg'}
        alt="Berachain Asteroid 3"
        width={386}
        height={293}
        style={{ zIndex: 4, position: 'absolute', top: 0, left: 0 }}
        initial={{ x: '-150px', y: '100px', rotate: -45, scale: 0.4 }}
        animate={{
          x: ['-150px', '150vw'],
          y: ['100px', '100px'],
          rotate: [-45, -135],
          scale: 0.4,
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
      />
      <motion.img
        className="BerachainAsteroidX4"
        src={'/berachain/berachain-asteroid-2.svg'}
        alt="Berachain Asteroid 4"
        width={386}
        height={293}
        style={{ zIndex: 4, position: 'absolute', top: 0, right: 0 }}
        initial={{ x: 0, y: '100px', rotate: 165, scale: 0.35 }}
        animate={{
          x: '100%',
          y: '400px',
          rotate: 270,
          scale: 0.35,
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
      />
      <motion.img
        className="BerachainAsteroidX5"
        src={'/berachain/berachain-asteroid-2.svg'}
        alt="Berachain Asteroid 5"
        width={386}
        height={293}
        style={{ zIndex: 4, position: 'absolute', top: 0, left: 0 }}
        initial={{ x: 0, y: '-50px', rotate: 170, scale: 0.35 }}
        animate={{
          x: '150%',
          y: '350px',
          rotate: -170,
          scale: 0.35,
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />
      <motion.img
        className="BerachainAsteroidX6"
        src={'/berachain/berachain-asteroid-1.svg'}
        alt="Berachain Asteroid 6"
        width={341}
        height={303}
        style={{ zIndex: 4, position: 'absolute', top: 0, left: 0 }}
        initial={{ x: '-150px', y: '200px', rotate: 0, scale: 1 }}
        animate={{
          x: '500px',
          y: '-600px',
          rotate: 45,
          scale: 0.9,
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
      />
      <motion.img
        className="BerachainAsteroidX7"
        src={'/berachain/berachain-asteroid-1.svg'}
        alt="Berachain Asteroid 7"
        width={341}
        height={303}
        style={{ zIndex: 4, position: 'absolute', top: 0, right: 0 }}
        initial={{ x: '150px', y: '200px', rotate: 45, scale: 1 }}
        animate={{
          x: '-100vw',
          y: '200px',
          rotate: -45,
          scale: 0.8,
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
      />
      <BerachainHeroImages sx={{ zIndex: 6 }} />
      <BerachainPlanetContainer sx={{ zIndex: 5 }}>
        <BerachainPlanetCrater
          src={'/berachain/berachain-lunar-crater-resize-raw.svg'}
          alt="Berachain Lunar Crater"
          width={1920}
          height={1080}
        />
      </BerachainPlanetContainer>
    </BerachainAnimationFrame>
  );
};

export default BerachainHeroAnimation;
