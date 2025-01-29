import { BerachainFrame, BerachainWelcomeContainer } from './Berachain.style';
import { BerachainFAQ } from './components/BerachainFAQ';
import { BerachainIntroduction } from './components/BerachainIntroduction/BerachainIntroduction';
import { BerachainStars } from './components/BerachainStars/BerachainStars';
import { BerachainWelcome } from './components/BerachainWelcome/BerachainWelcome';
import BerachainHeroAnimation from './components/BerchainHeroAnimation/BerachainHeroAnimation';
import BeraStoreSetup from '@/components/Berachain/components/BeraStoreSetup';
export const Berachain = () => {
  return (
    <BerachainFrame>
      <BeraStoreSetup />
      {/* <BerachainStarsBackground /> */}
      <BerachainStars />
      <BerachainHeroAnimation />
      <BerachainWelcomeContainer sx={{ marginTop: 0 }}>
        <BerachainWelcome />
        <BerachainIntroduction />
        <BerachainFAQ />
      </BerachainWelcomeContainer>
    </BerachainFrame>
  );
};
