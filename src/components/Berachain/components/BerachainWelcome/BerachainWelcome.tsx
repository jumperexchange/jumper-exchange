import { Typography } from '@mui/material';
import Image from 'next/image';
import {
  BeraChainWelcomeBear,
  BeraChainWelcomeBox,
  BeraChainWelcomeButtonsWrapper,
  BeraChainWelcomeConnectButtonCTA,
  BeraChainWelcomeContent,
  BeraChainWelcomeIllustrations,
  BeraChainWelcomeLearnMoreButton,
  BeraChainWelcomeSubtitle,
  BeraChainWelcomeSubtitleBox,
  BeraChainWelcomeSubtitleLabel,
  BeraChainWelcomeTitle,
} from './BerachainWelcome.style';

export const BerachainWelcome = () => {
  return (
    <BeraChainWelcomeBox>
      <BeraChainWelcomeIllustrations>
        <BeraChainWelcomeBear
          src="/berachain/sir-bridgealot-w-glow.png"
          alt="Berachain Pepe"
          width={278}
          height={395}
          sx={{
            position: 'absolute',
            aspectRatio: 0.8,
            height: '100%',
            width: 'auto',
            left: 0,
          }}
        />
        <BeraChainWelcomeBear
          src="/berachain/berachain-bear-w-glow.png"
          alt="Berachain Bear"
          width={304}
          height={395}
          style={{
            position: 'absolute',
            aspectRatio: 0.8,
            height: '100%',
            width: 'auto',
            right: 0,
          }}
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
        <BeraChainWelcomeTitle
          variant="urbanistTitle3XLarge"
          sx={{
            typography: {
              xs: 'urbanistTitleXLarge',
              sm: 'urbanistTitle2XLarge',
              md: 'urbanistTitle3XLarge',
            },
          }}
        >
          Earn Rich Incentives
        </BeraChainWelcomeTitle>
        <BeraChainWelcomeSubtitle variant="bodyXLarge">
          by pledging your Crypto across various Berachain partner markets!
        </BeraChainWelcomeSubtitle>
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
