import { Typography } from '@mui/material';
import Image from 'next/image';
import { BeraChainWelcomeConnectButtonCTA } from '../BerachainWelcome/BerachainWelcome.style';
import {
  BerachainIntroductionBox,
  BerachainIntroductionStep,
  BerachainIntroductionSteps,
} from './BerachainIntroduction.style';

export const BerachainIntroduction = () => {
  return (
    <BerachainIntroductionBox>
      <Typography variant="urbanistTitleXLarge">How does it work?</Typography>
      <BerachainIntroductionSteps>
        <BerachainIntroductionStep>
          <Typography variant="urbanistBody2XLarge">1. Lorem Ipsum</Typography>
          <Typography variant="bodyMedium">
            Etiam eget dui cursus, commodo augue sit amet, posuere enim. Etiam
            tristique sem.
          </Typography>
          <Image
            src={'/berachain/berachain-bear-typing.png'}
            alt={'Berachain on typing machine'}
            width={385}
            height={385}
            style={{ transform: 'translateX(24px)' }}
          />
        </BerachainIntroductionStep>
        <BerachainIntroductionStep>
          <Typography variant="urbanistBody2XLarge">
            2. Pledge your Crypto
          </Typography>
          <Typography variant="bodyMedium">
            Pledge your tokens to various Berachain partner markets for exciting
            rewards.
          </Typography>
          <Image
            src={'/berachain/berachain-bear-loves-honey.png'}
            alt={'Berachain on typing machine'}
            width={385}
            height={385}
          />
        </BerachainIntroductionStep>
        <BerachainIntroductionStep>
          <Typography variant="urbanistBody2XLarge">
            3. Receive Incentives
          </Typography>
          <Typography variant="bodyMedium">
            Sit back, relax and let your incentives pile up for pledging your
            tokens to Berachain*
          </Typography>
          <Image
            src={'/berachain/berachain-bear-chillin.png'}
            alt={'Berachain on typing machine'}
            width={385}
            height={385}
          />
        </BerachainIntroductionStep>
      </BerachainIntroductionSteps>
      <BeraChainWelcomeConnectButtonCTA>
        <Typography variant="bodyLargeStrong">
          Connect Wallet & Start Pledging
        </Typography>
      </BeraChainWelcomeConnectButtonCTA>
    </BerachainIntroductionBox>
  );
};
