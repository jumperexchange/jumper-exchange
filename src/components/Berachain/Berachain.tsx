import { BerachainContentContainer, BerachainFrame } from './Berachain.style';
import { BerachainFAQ } from './components/BerachainFAQ';
import { BerachainIntroduction } from './components/BerachainIntroduction/BerachainIntroduction';
import { BerachainStars } from './components/BerachainStars/BerachainStars';
import { BerachainWelcome } from './components/BerachainWelcome/BerachainWelcome';
import BerachainHeroAnimation from './components/BerchainHeroAnimation/BerachainHeroAnimation';
export const Berachain = () => {
  return (
    <BerachainFrame>
      {/* <BerachainStarsBackground /> */}
      <BerachainStars />
      <BerachainHeroAnimation />
      <BerachainContentContainer sx={{ marginTop: 0 }}>
        <BerachainWelcome />
        <BerachainIntroduction />
        <BerachainFAQ />
      </BerachainContentContainer>
    </BerachainFrame>
  );
};
