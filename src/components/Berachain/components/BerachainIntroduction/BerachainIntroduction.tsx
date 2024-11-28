import { Typography } from '@mui/material';
import Link from 'next/link';
import { BerachainWelcomeConnectButtonCTA } from '../BerachainWelcome/BerachainWelcome.style';
import {
  BerachainBearTyping,
  BerachainIntroductionBox,
  BerachainIntroductionStep,
  BerachainIntroductionStepContent,
  BerachainIntroductionStepIllustration,
  BerachainIntroductionSteps,
  BerachainIntroductionTitle,
} from './BerachainIntroduction.style';

export const BerachainIntroduction = () => {
  return (
    <BerachainIntroductionBox>
      <BerachainIntroductionTitle variant="urbanistTitleXLarge">
        How does it work?
      </BerachainIntroductionTitle>
      <BerachainIntroductionSteps>
        <BerachainIntroductionStep>
          <BerachainIntroductionStepContent>
            <Typography variant="urbanistBody2XLarge">
              1. Browse markets
            </Typography>
            <Typography variant="bodyMedium">
              Browse incentivised Boyco markets on mainnet.
            </Typography>
          </BerachainIntroductionStepContent>
          <BerachainBearTyping
            src={'/berachain/berachain-bear-typing.png'}
            alt={'Berachain on typing machine'}
            width={385}
            height={385}
          />
        </BerachainIntroductionStep>
        <BerachainIntroductionStep>
          <BerachainIntroductionStepContent>
            <Typography variant="urbanistBody2XLarge">
              2. Deposit tokens
            </Typography>
            <Typography variant="bodyMedium">
              Select the dApp and pool you would like to deposit liquidity into.
            </Typography>
          </BerachainIntroductionStepContent>
          <BerachainIntroductionStepIllustration
            src={'/berachain/berachain-bear-loves-honey.png'}
            alt={'Berachain on typing machine'}
            width={385}
            height={385}
          />
        </BerachainIntroductionStep>
        <BerachainIntroductionStep>
          <BerachainIntroductionStepContent>
            <Typography variant="urbanistBody2XLarge">
              3. Receive incentives
            </Typography>
            <Typography variant="bodyMedium">
              Sit back, relax, earn while Berachain goes live.
            </Typography>
          </BerachainIntroductionStepContent>
          <BerachainIntroductionStepIllustration
            src={'/berachain/berachain-bear-chillin.png'}
            alt={'Berachain on typing machine'}
            width={385}
            height={385}
          />
        </BerachainIntroductionStep>
      </BerachainIntroductionSteps>
      <Link href="/berachain/explore">
        <BerachainWelcomeConnectButtonCTA>
          <Typography variant="bodyLargeStrong">Get started</Typography>
        </BerachainWelcomeConnectButtonCTA>
      </Link>
    </BerachainIntroductionBox>
  );
};
