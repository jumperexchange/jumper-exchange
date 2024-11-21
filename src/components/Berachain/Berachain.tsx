import {
  BerachainContentContainer,
  BerachainFrame,
  BerachainStarsBackground,
} from './Berachain.style';
import { BerachainFAQ } from './components/BerachainFAQ';
import { BerachainIntroduction } from './components/BerachainIntroduction/BerachainIntroduction';
import { BerachainWelcome } from './components/BerachainWelcome/BerachainWelcome';
import BerachainHeroAnimation from './components/BerchainHeroAnimation/BerachainHeroAnimation';
export const Berachain = () => {
  return (
    <BerachainFrame>
      <BerachainStarsBackground />
      <BerachainHeroAnimation />
      <BerachainContentContainer>
        <BerachainWelcome />
        <BerachainIntroduction />
        <BerachainFAQ />
      </BerachainContentContainer>
    </BerachainFrame>
  );
};
