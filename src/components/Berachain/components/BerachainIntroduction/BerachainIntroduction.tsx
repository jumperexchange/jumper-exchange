import { Typography } from '@mui/material';
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
              1. Lorem Ipsum
            </Typography>
            <Typography variant="bodyMedium">
              Etiam eget dui cursus, commodo augue sit amet, posuere enim. Etiam
              tristique sem.
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
              2. Pledge your Crypto
            </Typography>
            <Typography variant="bodyMedium">
              Pledge your tokens to various Berachain partner markets for
              exciting rewards.
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
              3. Receive Incentives
            </Typography>
            <Typography variant="bodyMedium">
              Sit back, relax and let your incentives pile up for pledging your
              tokens to Berachain*
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
      <BerachainWelcomeConnectButtonCTA>
        <Typography variant="bodyLargeStrong">Get Started</Typography>
      </BerachainWelcomeConnectButtonCTA>
    </BerachainIntroductionBox>
  );
};
