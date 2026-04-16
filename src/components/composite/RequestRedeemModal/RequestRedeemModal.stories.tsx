import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { useState } from 'react';

import { RequestRedeemModal } from './RequestRedeemModal';
import { ConnectButton } from 'src/components/ConnectButton';
import { useIsDisconnected } from 'src/components/Navbar/hooks';
import { WalletMenuToggle } from 'src/components/Navbar/components/Buttons/WalletMenuToggle';
import { WithdrawButton } from '../WithdrawButton/WithdrawButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

const meta = {
  component: RequestRedeemModal,
  title: 'Composite/RequestRedeem Modal',
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof RequestRedeemModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    earnOpportunity: {
      isRedeemable: true,
      interactionFlags: {
        canDeposit: true,
        canWithdraw: true,
        canRewardClaim: true,
        canRewardCompound: true,
        canRepay: true,
        canBorrow: true,
      },
      name: 'morpho',
      slug: 'morpho',
      protocol: {
        name: 'morpho',
        product: 'morpho',
        version: '1.0.0',
        logo: 'logo',
      },
      description: 'description',
      tags: ['tag1', 'tag2'],
      rewards: [
        {
          name: 'Reward',
          symbol: 'REWARD',
          decimals: 18,
          logo: 'logo',
          address: '0xC5e7AB07030305fc925175b25B93b285d40dCdFf',
          chain: { chainId: 747474, chainKey: 'katana' },
        },
      ],
      featured: true,
      forYou: true,
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
          intrinsic: 0,
          total: 5.5,
        },
      },
    },
  },
};

export const WithToggleAndConnectButton: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const isDisconnected = useIsDisconnected();

    return (
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={2}>
          {isDisconnected ? <ConnectButton /> : <WalletMenuToggle />}
          <WithdrawButton onClick={() => setIsOpen(!isOpen)} label="Withdraw" />
        </Stack>

        <RequestRedeemModal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </Box>
    );
  },
  args: {
    isOpen: false,
    earnOpportunity: {
      isRedeemable: true,
      interactionFlags: {
        canDeposit: true,
        canWithdraw: true,
        canRewardClaim: true,
        canRewardCompound: true,
        canRepay: true,
        canBorrow: true,
      },
      slug: 'morpho',
      name: 'morpho',
      protocol: {
        name: 'morpho',
        product: 'morpho',
        version: '1.0.0',
        logo: 'logo',
      },
      description: 'description',
      tags: ['tag1', 'tag2'],
      rewards: [
        {
          name: 'Reward',
          symbol: 'REWARD',
          decimals: 18,
          logo: 'logo',
          address: '0xC5e7AB07030305fc925175b25B93b285d40dCdFf',
          chain: { chainId: 747474, chainKey: 'katana' },
        },
      ],
      featured: true,
      forYou: true,
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
          intrinsic: 0,
          total: 5.5,
        },
      },
    },
  },
};
