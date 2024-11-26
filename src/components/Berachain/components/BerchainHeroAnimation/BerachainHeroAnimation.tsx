import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import {
  BerachainAnimationFrame,
  BerachainAsteroidX1,
  BerachainAsteroidX2,
  BerachainAsteroidX3,
  BerachainAsteroidX4,
  BerachainAsteroidX5,
  BerachainAsteroidX6,
  BerachainAsteroidX7,
  BerachainPlanetContainer,
  BerachainPlanetCrater,
  BerchainSpaceGlow,
} from './BerachainHeroAnimation.style';
import { BerachainHeroImages } from './BerchainHeroImages';
import Starfield from './Starfield';

const BerachainHeroAnimation = () => {
  const animationRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Asteroid X1 Animation
      gsap.fromTo(
        '.BerachainAsteroidX1',
        { x: '-75px', y: '-150px', rotation: 10, scale: 1 },
        {
          x: '-50%',
          y: '200px',
          rotation: 55,
          scale: 0,
          duration: 15,
          ease: 'power1.out',
        },
      );

      // Asteroid X2 Animation
      gsap.to('.BerachainAsteroidX2', {
        x: '-100vw',
        y: '100px',
        rotation: 360,
        scale: -0.5,
        duration: 30,
        repeat: -1,
        yoyo: true,
        ease: 'none',
      });

      // Asteroid X3 Animation
      gsap.to('.BerachainAsteroidX3', {
        x: '-100vw',
        y: '100px',
        rotation: -135,
        scale: 0.4,
        duration: 60,
        repeat: -1,
        yoyo: true,
        ease: 'none',
      });

      // Asteroid X4 Animation
      gsap.to('.BerachainAsteroidX4', {
        x: '100vw',
        y: '400px',
        rotation: 270,
        scale: 0.35,
        duration: 25,
        repeat: -1,
        yoyo: true,
        ease: 'none',
      });

      // Asteroid X5 Animation
      gsap.to('.BerachainAsteroidX5', {
        x: '120vw',
        y: '150px',
        rotation: -170,
        scale: 0.35,
        duration: 90,
        repeat: -1,
        yoyo: true,
        ease: 'none',
      });

      // Asteroid X6 Animation
      gsap.to('.BerachainAsteroidX6', {
        x: '500px',
        y: '-600px',
        rotation: 45,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: 'none',
      });

      // Asteroid X7 Animation
      gsap.to('.BerachainAsteroidX7', {
        x: '-120vw',
        y: '240px',
        rotation: 45,
        scaleX: 0.8,
        duration: 25,
        repeat: -1,
        yoyo: true,
        ease: 'none',
      });
    }, animationRef);

    return () => ctx.revert(); // Clean up animations on unmount
  }, []);

  return (
    <BerachainAnimationFrame className="animation-frame" ref={animationRef}>
      <BerchainSpaceGlow sx={{ zIndex: 2 }} />
      <Starfield sx={{ zIndex: 3 }} />
      <BerachainAsteroidX1
        className="BerachainAsteroidX1"
        src={'/berachain/berachain-asteroid-2.svg'}
        alt="Berachain Asteroid 1"
        width={386}
        height={293}
        style={{ zIndex: 4 }}
      />
      <BerachainAsteroidX2
        className="BerachainAsteroidX2"
        src={'/berachain/berachain-asteroid-2.svg'}
        alt="Berachain Asteroid 2"
        width={386}
        height={293}
        style={{ zIndex: 4 }}
      />
      <BerachainAsteroidX3
        className="BerachainAsteroidX3"
        src={'/berachain/berachain-asteroid-2.svg'}
        alt="Berachain Asteroid 3"
        width={386}
        height={293}
        style={{ zIndex: 4 }}
      />
      <BerachainAsteroidX4
        className="BerachainAsteroidX4"
        src={'/berachain/berachain-asteroid-2.svg'}
        alt="Berachain Asteroid 4"
        width={386}
        height={293}
        style={{ zIndex: 4 }}
      />
      <BerachainAsteroidX5
        className="BerachainAsteroidX5"
        src={'/berachain/berachain-asteroid-2.svg'}
        alt="Berachain Asteroid 5"
        width={386}
        height={293}
        style={{ zIndex: 4 }}
      />
      <BerachainAsteroidX6
        className="BerachainAsteroidX6"
        src={'/berachain/berachain-asteroid-1.svg'}
        alt="Berachain Asteroid 6"
        width={341}
        height={303}
        style={{ zIndex: 4 }}
      />
      <BerachainAsteroidX7
        className="BerachainAsteroidX7"
        src={'/berachain/berachain-asteroid-1.svg'}
        alt="Berachain Asteroid 7"
        width={341}
        height={303}
        style={{ zIndex: 4 }}
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
