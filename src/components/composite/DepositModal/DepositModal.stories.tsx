import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { DepositModal } from './DepositModal';
import { action } from 'storybook/internal/actions';
import { ConnectButton } from 'src/components/ConnectButton';
import { useIsDisconnected } from 'src/components/Navbar/hooks';
import { WalletMenuToggle } from 'src/components/Navbar/components/Buttons/WalletMenuToggle';
import { DepositButton } from '../DepositButton/DepositButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

const meta = {
  component: DepositModal,
  title: 'Composite/Deposit Modal',
  args: {
    onClose: action('on-close'),
  },
} satisfies Meta<typeof DepositModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    earnOpportunity: {
      name: 'morpho',
      protocol: {
        name: 'morpho',
        product: 'morpho',
        version: '1.0.0',
        logo: 'logo',
      },
      address: '0xC5e7AB07030305fc925175b25B93b285d40dCdFf',
      url: 'https://morpho.org/',
      positionUrl:
        'https://app.morpho.org/katana/vault/0xC5e7AB07030305fc925175b25B93b285d40dCdFf/gauntlet-weth',
      minFromAmountUSD: 0.29,
      asset: {
        name: 'Asset',
        symbol: 'ASSET',
        decimals: 18,
        logo: 'logo',
        address: '0xC5e7AB07030305fc925175b25B93b285d40dCdFf',
        chain: { chainId: 747474, chainKey: 'katana' },
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
          <DepositButton
            onClick={() => setIsOpen(!isOpen)}
            label="Quick deposit"
          />
        </Stack>

        <DepositModal
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
      name: 'morpho',
      protocol: {
        name: 'morpho',
        product: 'morpho',
        version: '1.0.0',
        logo: 'logo',
      },
      address: '0xC5e7AB07030305fc925175b25B93b285d40dCdFf',
      url: 'https://morpho.org/',
      positionUrl:
        'https://app.morpho.org/katana/vault/0xC5e7AB07030305fc925175b25B93b285d40dCdFf/gauntlet-weth',
      minFromAmountUSD: 0.29,
      asset: {
        name: 'Asset',
        symbol: 'ASSET',
        decimals: 18,
        logo: 'logo',
        address: '0xC5e7AB07030305fc925175b25B93b285d40dCdFf',
        chain: { chainId: 747474, chainKey: 'katana' },
      },
    },
  },
};
