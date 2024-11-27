import { Typography, useTheme } from '@mui/material';
import { motion } from 'motion/react';
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
      <motion.div
        initial={{ opacity: 0, y: 120 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <BeraChainWelcomeContent>
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
            Jump into Boyco
          </BerachainWelcomeTitle>
          <BerachainWelcomeSubtitle variant="bodyXLarge">
            Provide liquidity to Berachain Apps prior to mainnet launch
          </BerachainWelcomeSubtitle>
        </BeraChainWelcomeContent>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }} // Starts 1 second after the main content animation
      >
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3.5 }} // Starts 1.5 seconds after the main content animation
      >
        <BerachainWelcomeBoxContent>
          <Link href="/berachain/explore">
            <BerachainWelcomeConnectButtonCTA>
              <Typography variant="bodyLargeStrong">
                Start Exploring!
              </Typography>
            </BerachainWelcomeConnectButtonCTA>
          </Link>
          <Link href="/berachain">
            <BerachainWelcomeLearnMoreButton sx={{ padding: '8px 24px' }}>
              <Typography variant="bodyLargeStrong">Learn more</Typography>
            </BerachainWelcomeLearnMoreButton>
          </Link>
        </BerachainWelcomeBoxContent>
      </motion.div>
    </BeraChainWelcomeBox>
  );
};
