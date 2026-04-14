import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mocked } from 'storybook/test';
import { ChainType } from '@lifi/sdk';
import type { Account } from '@lifi/widget-provider';
import { useAccount } from '@lifi/wallet-management';

import { WalletBalanceCard } from './WalletBalanceCard';
import { walletBalanceCardFixture } from './fixtures';

// Mock data for useAccount hook
const mockAccounts: Account[] = [
  {
    address: walletBalanceCardFixture.walletAddress,
    chainId: 1,
    chainType: ChainType.EVM,
    isConnected: true,
    isConnecting: false,
    isDisconnected: false,
    isReconnecting: false,
    status: 'connected' as const,
  },
];

const meta = {
  title: 'Composite/WalletBalanceCard',
  component: WalletBalanceCard,
  parameters: {
    nextRouter: {
      path: '/',
      asPath: '/',
      query: {},
    },
  },
  // 👇 This will run before each story is rendered
  beforeEach: async () => {
    // 👇 Force known, consistent behavior for mocked useAccount
    mocked(useAccount).mockReturnValue({
      account: mockAccounts[0],
      accounts: mockAccounts,
    });
  },
} satisfies Meta<typeof WalletBalanceCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...walletBalanceCardFixture,
  },
};

export const WithError: Story = {
  args: {
    walletAddress: '0x1234567890123456789012345678901234567890',
    updatedAt: 12345,
    refetch: () => {},
    isFetching: false,
    isSuccess: false,
    data: {},
    error: new Error('Failed to load balances'),
  },
};
