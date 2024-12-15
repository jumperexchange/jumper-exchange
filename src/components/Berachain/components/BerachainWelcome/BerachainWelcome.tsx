import type { Breakpoint } from '@mui/material';
import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'motion/react';
import Image from 'next/image';
import { BerachainProgressCard } from '../BerachainProgressCard/BerachainProgressCard';
import {
  BerachainButtonWrapperLink,
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
                xs: theme.typography.urbanistTitleLarge,
                sm: theme.typography.urbanistTitle2XLarge,
                md: theme.typography.urbanistTitle3XLarge,
              },
            }}
          >
            Jump into Boyco
          </BerachainWelcomeTitle>
          <BerachainWelcomeSubtitle
            variant="bodyXLarge"
            sx={{
              typography: {
                xs: theme.typography.bodyLarge,
                sm: theme.typography.bodyXLarge,
              },
            }}
          >
            Provide liquidity to Berachain apps prior to mainnet launch
          </BerachainWelcomeSubtitle>
        </BeraChainWelcomeContent>
      </motion.div>

      <Box
        sx={(theme) => ({
          [theme.breakpoints.down('sm')]: {
            width: '100%',
          },
        })}
      >
        <motion.div
          initial={{ opacity: 0, width: '100%' }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }} // Starts 1 second after the main content animation
        >
          <BerachainWelcomeBoxContent>
            <BerachainProgressCard
              title={'TVL'}
              value="$718K"
              icon={
                <Image
                  src="/berachain/tvl.svg"
                  alt="TVL illustration"
                  width={26}
                  height={26}
                />
              }
              sx={(theme) => ({
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.20)',
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)',
                padding: theme.spacing(2, 2.5),
                justifyContent: 'center',
                [theme.breakpoints.up('sm')]: {
                  justifyContent: 'flex-start',
                  minWidth: '240px',
                  padding: '18px',
                },
              })}
            />
            <BerachainProgressCard
              title={'Incentives'}
              value="$420K"
              icon={
                <Image
                  src="/berachain/gift.svg"
                  alt="Gift illustration"
                  width={26}
                  height={26}
                />
              }
              sx={(theme) => ({
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.20)',
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)',
                padding: theme.spacing(2, 2.5),
                justifyContent: 'center',
                [theme.breakpoints.up('sm')]: {
                  justifyContent: 'flex-start',
                  minWidth: '240px',
                  padding: '18px',
                },
              })}
            />
          </BerachainWelcomeBoxContent>
        </motion.div>
      </Box>

      <Box
        sx={{
          [theme.breakpoints.down('sm' as Breakpoint)]: {
            width: '100%',
          },
        }}
      >
        <motion.div
          initial={{ opacity: 0, width: '100%' }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.25 }} // Starts 1.5 seconds after the main content animation
        >
          <BerachainWelcomeBoxContent
            sx={(theme) => ({
              [theme.breakpoints.down('sm' as Breakpoint)]: {
                gap: theme.spacing(1),
                flexDirection: 'column',
                width: '100%',
              },
            })}
          >
            <BerachainButtonWrapperLink href="/berachain/explore">
              <BerachainWelcomeConnectButtonCTA>
                <Typography variant="bodyLargeStrong">
                  Start exploring
                </Typography>
              </BerachainWelcomeConnectButtonCTA>
            </BerachainButtonWrapperLink>
            <BerachainButtonWrapperLink
              href="https://blog.berachain.com/blog/rfb-boyco"
              rel="noopener noreferrer"
              target="_blank"
            >
              <BerachainWelcomeLearnMoreButton sx={{ padding: '8px 24px' }}>
                <Typography variant="bodyLargeStrong">Learn more</Typography>
              </BerachainWelcomeLearnMoreButton>
            </BerachainButtonWrapperLink>
          </BerachainWelcomeBoxContent>
        </motion.div>
      </Box>
    </BeraChainWelcomeBox>
  );
};
