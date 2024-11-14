import { Typography } from '@mui/material';
import Image from 'next/image';
import {
  BeraChainWelcomeBox,
  BeraChainWelcomeButtonsWrapper,
  BeraChainWelcomeConnectButtonCTA,
  BeraChainWelcomeContent,
  BeraChainWelcomeIllustrations,
  BeraChainWelcomeLearnMoreButton,
  BeraChainWelcomeSubtitleBox,
  BeraChainWelcomeSubtitleLabel,
  BeraChainWelcomeTitle,
} from './BerachainWelcome.style';

export const BerachainWelcome = () => {
  return (
    <BeraChainWelcomeBox>
      <BeraChainWelcomeIllustrations>
        <Image
          src="/berachain/sir-bridgealot-w-glow.png"
          alt="Berachain Bear"
          width={278}
          height={395}
        />
        <Image
          src="/berachain/berachain-bear-w-glow.png"
          alt="Berachain Bear"
          width={304}
          height={395}
          style={{ transform: 'translateX(-108px)' }}
        />
      </BeraChainWelcomeIllustrations>
      <BeraChainWelcomeContent>
        <BeraChainWelcomeSubtitleBox>
          <Typography variant="bodyXLarge" marginRight={'16px'}>
            We present
          </Typography>
          <Image
            src="/berachain/berachain-brand.png"
            alt="Berachain Brand"
            width={234}
            height={38}
            style={{ marginRight: '24px' }}
          />
          <BeraChainWelcomeSubtitleLabel variant="bodyMediumStrong">
            Launching soon
          </BeraChainWelcomeSubtitleLabel>
        </BeraChainWelcomeSubtitleBox>
        <BeraChainWelcomeTitle variant="bodyXLarge">
          Earn Rich Incentives
        </BeraChainWelcomeTitle>
        <Typography variant="bodyXLarge">
          by pledging your Crypto across various Berachain partner markets!
        </Typography>
      </BeraChainWelcomeContent>
      <BeraChainWelcomeButtonsWrapper>
        <BeraChainWelcomeConnectButtonCTA>
          <Typography variant="bodyLargeStrong">
            Connect Wallet & Start Pledging
          </Typography>
        </BeraChainWelcomeConnectButtonCTA>
        <BeraChainWelcomeLearnMoreButton>
          Learn more
        </BeraChainWelcomeLearnMoreButton>
      </BeraChainWelcomeButtonsWrapper>
    </BeraChainWelcomeBox>
  );
};
