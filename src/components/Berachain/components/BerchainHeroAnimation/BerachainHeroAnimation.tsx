import { motion } from 'motion/react';
import Image from 'next/image';
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
      <motion.div
        className="BerachainAsteroidX1"
        style={{
          zIndex: 4,
          position: 'absolute',
          top: '-10vh',
          left: '60vw',
          width: '30vw',
          height: 'auto',
          aspectRatio: 386 / 293,
        }}
        initial={{
          x: '-10vw',
          y: '0vh',
          rotate: 10,
        }}
        animate={{
          x: ['-10vw', '-120vw', '-10vw', '100vw', '-10vw'],
          y: ['0vh', '30vh', '0vh', '-30vh', '0vh'],
          rotate: [10, 55, 10, -35, 10],
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <Image
          src={'/berachain/berachain-asteroid-2.svg'}
          alt="Berachain Asteroid 1"
          width={386}
          height={293}
          style={{ width: '100%', height: 'auto' }}
        />
      </motion.div>
      <motion.div
        className="BerachainAsteroidX2"
        style={{
          zIndex: 4,
          position: 'absolute',
          top: 0,
          right: 0,
          width: '18vw',
          height: 'auto',
          aspectRatio: 386 / 293,
        }}
        initial={{
          x: '0',
          y: '10vh',
          rotate: 160,
          scale: 0.8,
        }}
        animate={{
          x: ['0', '-120vw'],
          y: ['10vh', '60vh'],
          rotate: [160, 360],
          scale: [0.8, 0.5],
        }}
        transition={{
          duration: 25,
          times: [0, 0.5, 0.50001, 1],
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        <Image
          src={'/berachain/berachain-asteroid-2.svg'}
          alt="Berachain Asteroid 2"
          width={386}
          height={293}
          style={{ width: '100%', height: 'auto' }}
        />
      </motion.div>
      <motion.div
        className="BerachainAsteroidX3"
        style={{
          zIndex: 4,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '25vw',
          height: 'auto',
          aspectRatio: 386 / 293,
        }}
        initial={{
          x: '0vw',
          y: '0vh',
          rotate: -45,
          scale: 0.4,
        }}
        animate={{
          x: ['0vw', '120vw'],
          y: ['0vh', '60vh'],
          rotate: [-45, -135],
          scale: 0.4,
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      >
        <Image
          src={'/berachain/berachain-asteroid-2.svg'}
          alt="Berachain Asteroid 3"
          width={386}
          height={293}
          style={{ width: '100%', height: 'auto' }}
        />
      </motion.div>
      <motion.div
        className="BerachainAsteroidX4"
        style={{
          zIndex: 4,
          position: 'absolute',
          top: 0,
          right: 0,
          width: '30vw',
          height: 'auto',
          aspectRatio: 386 / 293,
        }}
        initial={{
          x: '-20vw',
          y: '30vh',
          rotate: 270,
          scale: 0.8,
        }}
        animate={{
          x: ['-20vw', '-80vw', '-20vw', '40vw', '-20vw'],
          y: ['30vh', '10vh', '30vh', '40vh', '30vh'],
          rotate: [270, 150, 270, 390, 270],
        }}
        transition={{
          duration: 55,
          repeat: Infinity,
          // repeatType: 'reverse',
          ease: 'linear',
        }}
      >
        <Image
          src={'/berachain/berachain-asteroid-2.svg'}
          alt="Berachain Asteroid 4"
          width={386}
          height={293}
          style={{ width: '100%', height: 'auto' }}
        />
      </motion.div>
      <motion.div
        className="BerachainAsteroidX5"
        style={{
          zIndex: 4,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '28vw',
          height: 'auto',
          aspectRatio: 386 / 293,
        }}
        initial={{ x: '20vw', y: '30vh', rotate: 170, scale: 0.35 }}
        animate={{
          x: ['20vw', '120vw', '20vw', '-80vw', '20vw'],
          y: ['30vh', '40vh', '30vh', '20vh', '30vh'],
          rotate: [180, 0, -180, -360, -540],
          scale: [0.35, 0.7, 0.35, 0, 0.35],
        }}
        transition={{
          duration: 42,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <Image
          src={'/berachain/berachain-asteroid-2.svg'}
          alt="Berachain Asteroid 5"
          width={386}
          height={293}
          style={{ width: '100%', height: 'auto' }}
        />
      </motion.div>
      <motion.div
        className="BerachainAsteroidX6"
        style={{
          zIndex: 4,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '12%',
          height: 'auto',
          aspectRatio: 341 / 303,
        }}
        initial={{ x: '20vw', y: '20vh', rotate: 45, scale: 0.9 }}
        animate={{
          x: ['20vw', '105vw', '20vw', '-65vw', '20vw'],
          y: ['20vh', '28vh', '20vh', '12vh', '20vh'],
          rotate: [45, 0, 45, 90, 45],
          scale: [0.9, 1.2, 0.9, 0.7, 0.9],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <Image
          src={'/berachain/berachain-asteroid-1.svg'}
          alt="Berachain Asteroid 6"
          width={341}
          height={303}
          style={{ width: '100%', height: 'auto' }}
        />
      </motion.div>
      <motion.div
        className="BerachainAsteroidX7"
        style={{
          zIndex: 4,
          position: 'absolute',
          top: 0,
          right: 0,
          width: '18%',
          height: 'auto',
          aspectRatio: 341 / 303,
        }}
        initial={{
          x: '-100vw',
          y: '40vh',
          rotate: -45,
          scale: 0.8,
        }}
        animate={{
          x: ['-100vw', '110vw'],
          y: ['40vh', '50vh'],
          rotate: [-45, 60],
          scale: [0.8, 1],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
      >
        <Image
          src={'/berachain/berachain-asteroid-1.svg'}
          alt="Berachain Asteroid 7"
          width={341}
          height={303}
          style={{ width: '100%', height: 'auto' }}
        />
      </motion.div>
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
