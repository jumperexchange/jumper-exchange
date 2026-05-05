import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { action } from 'storybook/actions';
import { useState } from 'react';
import { DustModal } from './DustModal';
import { ConnectButton } from '@/components/ConnectButton';
import { PortfolioProvider } from '@/providers/PortfolioProvider/PortfolioProvider';
import { useIsDisconnected } from '@/components/Navbar/hooks';
import { WalletMenuToggle } from '@/components/Navbar/components/Buttons/WalletMenuToggle';
import { DustFlow } from './DustFlow';
import { DustBanner } from './DustBanner';
import Stack from '@mui/material/Stack';

const meta = {
  component: DustFlow,
  title: 'components/composite/Dust Flow',
} satisfies Meta<typeof DustFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const isDisconnected = useIsDisconnected();

    return (
      <PortfolioProvider>
        <Stack sx={{ gap: 2 }}>
          {isDisconnected ? <ConnectButton /> : <WalletMenuToggle />}
          <DustFlow />
        </Stack>
      </PortfolioProvider>
    );
  },
  args: {},
};

export const OnlyBanner: Story = {
  render: () => {
    const isDisconnected = useIsDisconnected();

    return (
      <PortfolioProvider>
        <Stack sx={{ gap: 2 }}>
          {isDisconnected ? <ConnectButton /> : <WalletMenuToggle />}
          <DustBanner forceDisplay onClick={action('click-dust-banner-btn')} />
        </Stack>
      </PortfolioProvider>
    );
  },
  args: {},
};

export const OnlyModal: Story = {
  render: () => {
    const isDisconnected = useIsDisconnected();
    const [isModalOpen, setIsModalOpen] = useState(true);

    return (
      <PortfolioProvider>
        <Stack sx={{ gap: 2 }}>
          {isDisconnected ? <ConnectButton /> : <WalletMenuToggle />}
          <DustModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </Stack>
      </PortfolioProvider>
    );
  },
  args: {},
};
