import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { DustModal } from './DustModal';
import { fn } from 'storybook/test';
import { ConnectButton } from '@/components/ConnectButton';
import { PortfolioProvider } from '@/providers/PortfolioProvider/PortfolioProvider';
import { useIsDisconnected } from '@/components/Navbar/hooks';
import { WalletMenuToggle } from '@/components/Navbar/components/Buttons/WalletMenuToggle';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Button } from '@/components/core/buttons/Button/Button';
import { Variant } from '@/components/core/buttons/types';

const meta = {
  component: DustModal,
  title: 'components/composite/Dust Modal',
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof DustModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
  },
};

export const WithToggleAndConnectButton: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const isDisconnected = useIsDisconnected();

    return (
      <PortfolioProvider>
        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={2}>
            {isDisconnected ? <ConnectButton /> : <WalletMenuToggle />}
            <Button
              variant={Variant.Primary}
              onClick={() => setIsOpen(true)}
              aria-label="Open dust modal"
              disabled={isDisconnected}
            >
              Open modal
            </Button>
          </Stack>

          <DustModal
            {...args}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        </Box>
      </PortfolioProvider>
    );
  },
  args: {
    isOpen: false,
  },
};
