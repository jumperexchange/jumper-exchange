import { Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { BerachainProgressCard } from '../BerachainProgressCard/BerachainProgressCard';
import {
  BeraChainWelcomeBox,
  BerachainWelcomeBoxContent,
  BerachainWelcomeConnectButtonCTA,
  BeraChainWelcomeContent,
  BerachainWelcomeLearnMoreButton,
  BerachainWelcomeSubtitle,
  BerachainWelcomeTitle,
} from './BerachainWelcome.style';

export const BerachainWelcome = () => {
  const theme = useTheme();
  return (
    <BeraChainWelcomeBox>
      <BeraChainWelcomeContent>
        {/* <BerachainWelcomeSubtitleBox>
          <Typography variant="bodyXLarge" marginRight={'16px'}>
            We present
          </Typography>
          <Image
            src="/berachain/berachain-brand-logo-full.png"
            alt="Berachain Brand"
            width={234}
            height={38}
            style={{ marginRight: '24px' }}
          />
          <BerachainWelcomeSubtitleLabel variant="bodyMediumStrong">
            Launching soon
          </BerachainWelcomeSubtitleLabel>
        </BerachainWelcomeSubtitleBox> */}
        <BerachainWelcomeTitle
          variant="urbanistTitle3XLarge"
          sx={{
            typography: {
              xs: theme.typography.urbanistTitleXLarge,
              sm: theme.typography.urbanistTitle2XLarge,
              md: theme.typography.urbanistTitle3XLarge,
            },
          }}
        >
          Earn Rich Incentives
        </BerachainWelcomeTitle>
        <BerachainWelcomeSubtitle variant="bodyXLarge">
          by pledging your Crypto across various Berachain partner markets!
        </BerachainWelcomeSubtitle>
      </BeraChainWelcomeContent>
      <BerachainWelcomeBoxContent>
        <BerachainProgressCard
          title={'Total Value Locked'}
          value="$718K.88"
          icon={
            <Image
              src="/berachain/tvl.svg"
              alt="TVL illustration"
              width={26}
              height={26}
            />
          }
          sx={{
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.20)',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(8px)',
            minWidth: '212px',
          }}
        />
        <BerachainProgressCard
          title={'Incentives'}
          value="$520.64K"
          icon={
            <Image
              src="/berachain/gift.svg"
              alt="Gift illustration"
              width={26}
              height={26}
            />
          }
          sx={{
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.20)',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(8px)',
            minWidth: '212px',
          }}
        />
      </BerachainWelcomeBoxContent>
      <BerachainWelcomeBoxContent>
        <Link href="/berachain/explore">
          <BerachainWelcomeConnectButtonCTA>
            <Typography variant="bodyLargeStrong">Start Exploring!</Typography>
          </BerachainWelcomeConnectButtonCTA>
        </Link>
        <Link href="/berachain">
          <BerachainWelcomeLearnMoreButton sx={{ padding: '8px 24px' }}>
            <Typography variant="bodyLargeStrong">Learn more</Typography>
          </BerachainWelcomeLearnMoreButton>
        </Link>
      </BerachainWelcomeBoxContent>
    </BeraChainWelcomeBox>
  );
};
