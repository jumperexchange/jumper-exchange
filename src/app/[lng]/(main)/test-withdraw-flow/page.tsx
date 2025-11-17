'use client';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { WithdrawFlowButton } from 'src/components/composite/WithdrawFlow/WithdrawFlow';
import { WithdrawFlowModal } from 'src/components/composite/WithdrawFlow/WithdrawFlow';
import { ConnectButton } from 'src/components/ConnectButton';
import { useIsDisconnected } from 'src/components/Navbar/hooks';
import { WalletMenuToggle } from 'src/components/Navbar/components/Buttons/WalletMenuToggle';

import type { EarnOpportunityExtended } from 'src/stores/withdrawFlow/WithdrawFlowStore';

const mockEarnOpportunity: EarnOpportunityExtended = {
  name: 'morpho',
  slug: 'morpho',
  protocol: {
    name: 'morpho',
    product: 'morpho',
    version: '1.0.0',
    logo: 'logo',
  },
  description: 'morpho',
  tags: ['morpho'],
  rewards: ['morpho'],
  featured: true,
  forYou: true,
  address: '0xE4248e2105508FcBad3fe95691551d1AF14015f7',
  url: 'https://morpho.org/',
  positionUrl:
    'https://app.morpho.org/katana/vault/0xE4248e2105508FcBad3fe95691551d1AF14015f7/gauntlet-weth',
  minFromAmountUSD: 0.29,
  asset: {
    name: 'Asset',
    symbol: 'ASSET',
    decimals: 18,
    logo: 'logo',
    address: '0xE4248e2105508FcBad3fe95691551d1AF14015f7',
    chain: { chainId: 747474, chainKey: 'katana' },
  },
  lpToken: {
    name: 'LP Token',
    symbol: 'LP',
    decimals: 18,
    logo: 'logo',
    address: '0xE4248e2105508FcBad3fe95691551d1AF14015f7',
    chain: { chainId: 747474, chainKey: 'katana' },
  },
  latest: {
    date: '2021-01-01',
    tvlUsd: '1000000',
    tvlNative: '1000000',
    apy: {
      base: 5.5,
      reward: 0,
      total: 5.5,
    },
  },
};

export default function TestWithdrawFlowPage() {
  const isDisconnected = useIsDisconnected();
  const [showTestInfo] = useState(true);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        WithdrawFlow Test Page
      </Typography>

      {showTestInfo && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            bgcolor: 'info.light',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'info.main',
          }}
        >
          <Typography variant="body2">
            This page tests the WithdrawFlow components with mock earn
            opportunity data from the Storybook story.
          </Typography>
        </Box>
      )}

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        {isDisconnected ? <ConnectButton /> : <WalletMenuToggle />}
        <WithdrawFlowButton
          earnOpportunity={mockEarnOpportunity}
          refetchCallback={() => console.log('Refetch callback triggered')}
        />
      </Stack>

      <WithdrawFlowModal />

      <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Mock Earn Opportunity Data:
        </Typography>
        <Box
          component="pre"
          sx={{
            p: 2,
            bgcolor: 'grey.100',
            borderRadius: 1,
            overflow: 'auto',
            fontSize: '0.875rem',
          }}
        >
          {JSON.stringify(mockEarnOpportunity, null, 2)}
        </Box>
      </Box>
    </Box>
  );
}
