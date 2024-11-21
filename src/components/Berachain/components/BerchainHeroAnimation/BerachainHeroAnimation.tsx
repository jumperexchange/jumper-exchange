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
import Starfield from './Starfield';

const BerachainHeroAnimation = () => {
  return (
    <BerachainAnimationFrame className="anmimation-frame">
      <BerchainSpaceGlow sx={{ zIndex: 2 }} />
      <Starfield sx={{ zIndex: 3 }} />
      <BerachainAsteroidX1
        src={'/berachain/berachain-asteroid-2.svg'}
        alt="Berachain Asteroid 1"
        width={386}
        height={293}
        style={{ zIndex: 4 }}
      />
      <BerachainAsteroidX2
        src={'/berachain/berachain-asteroid-2.svg'}
        alt="Berachain Asteroid 2"
        width={386}
        height={293}
        style={{ zIndex: 4 }}
      />
      <BerachainAsteroidX3
        src={'/berachain/berachain-asteroid-2.svg'}
        alt="Berachain Asteroid 3"
        width={386}
        height={293}
        style={{ zIndex: 4 }}
      />
      <BerachainAsteroidX4
        src={'/berachain/berachain-asteroid-2.svg'}
        alt="Berachain Asteroid 4"
        width={386}
        height={293}
        style={{ zIndex: 4 }}
      />
      <BerachainAsteroidX5
        src={'/berachain/berachain-asteroid-2.svg'}
        alt="Berachain Asteroid 5"
        width={386}
        height={293}
        style={{ zIndex: 4 }}
      />
      <BerachainAsteroidX6
        src={'/berachain/berachain-asteroid-1.svg'}
        alt="Berachain Asteroid 6"
        width={341}
        height={303}
        style={{ zIndex: 4 }}
      />
      <BerachainAsteroidX7
        src={'/berachain/berachain-asteroid-1.svg'}
        alt="Berachain Asteroid 7"
        width={341}
        height={303}
        style={{ zIndex: 4 }}
      />

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
