import { Typography } from '@mui/material';
import {
  BerachainButtonWrapperLink,
  BerachainWelcomeConnectButtonCTA,
} from '../BerachainWelcome/BerachainWelcome.style';
import {
  BerachainBearTyping,
  BerachainIntroductionBox,
  BerachainIntroductionStep,
  BerachainIntroductionStepContent,
  BerachainIntroductionStepIllustration,
  BerachainIntroductionSteps,
  BerachainIntroductionStepTitle,
  BerachainIntroductionTitle,
} from './BerachainIntroduction.style';

export const BerachainIntroduction = () => {
  return (
    <BerachainIntroductionBox>
      <BerachainIntroductionTitle
        variant="urbanistTitleXLarge"
        sx={(theme) => ({
          typography: {
            xs: theme.typography.urbanistTitleMedium,
            sm: theme.typography.urbanistTitleLarge,
            md: theme.typography.urbanistTitleXLarge,
          },
        })}
      >
        How does it work?
      </BerachainIntroductionTitle>
      <BerachainIntroductionSteps container columnSpacing={{ xs: 3, lg: 4 }}>
        <BerachainIntroductionStep size={{ xs: 12, lg: 4 }}>
          {/* <Link href="/berachain/explore" as="button"> */}
          <BerachainIntroductionStepContent>
            <BerachainIntroductionStepTitle
              variant="urbanistBody2XLarge"
              sx={{
                typography: (theme) => ({
                  xs: theme.typography.urbanistTitleXSmall,
                  sm: theme.typography.urbanistBody2XLarge,
                  md: theme.typography.urbanistBody2XLarge,
                }),
              }}
            >
              1. Browse markets
            </BerachainIntroductionStepTitle>
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
          {/* </Link> */}
        </BerachainIntroductionStep>

        <BerachainIntroductionStep size={{ xs: 12, lg: 4 }}>
          {/* <Link href="/berachain/explore" as="button"> */}
          <BerachainIntroductionStepContent>
            <BerachainIntroductionStepTitle
              variant="urbanistBody2XLarge"
              sx={{
                typography: (theme) => ({
                  xs: theme.typography.urbanistTitleXSmall,
                  sm: theme.typography.urbanistBody2XLarge,
                  md: theme.typography.urbanistBody2XLarge,
                }),
              }}
            >
              2. Deposit tokens
            </BerachainIntroductionStepTitle>
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
          {/* </Link> */}
        </BerachainIntroductionStep>

        <BerachainIntroductionStep size={{ xs: 12, lg: 4 }}>
          {/* <Link href="/berachain/explore" as="button"> */}
          <BerachainIntroductionStepContent>
            <BerachainIntroductionStepTitle
              variant="urbanistBody2XLarge"
              sx={{
                typography: (theme) => ({
                  xs: theme.typography.urbanistTitleXSmall,
                  sm: theme.typography.urbanistBody2XLarge,
                  md: theme.typography.urbanistBody2XLarge,
                }),
              }}
            >
              3. Receive incentives
            </BerachainIntroductionStepTitle>
            <Typography variant="bodyMedium">
              Sit back, relax, earn incentives while Berachain goes live.
            </Typography>
          </BerachainIntroductionStepContent>
          <BerachainIntroductionStepIllustration
            src={'/berachain/berachain-bear-chillin.png'}
            alt={'Berachain on typing machine'}
            width={385}
            height={385}
          />
          {/* </Link> */}
        </BerachainIntroductionStep>
      </BerachainIntroductionSteps>
      <BerachainButtonWrapperLink href="/berachain/explore">
        <BerachainWelcomeConnectButtonCTA>
          <Typography variant="bodyLargeStrong">Get started</Typography>
        </BerachainWelcomeConnectButtonCTA>
      </BerachainButtonWrapperLink>
    </BerachainIntroductionBox>
  );
};
