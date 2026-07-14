import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mocked } from 'storybook/test';
import { ChainType } from '@lifi/sdk';
import type { Account } from '@jumperexchange/widget-provider';
import { useAccount } from '@jumperexchange/wallet-management';
import { useLoyaltyPass } from '@/hooks/useLoyaltyPass';
import { usePerks } from '@/hooks/perks/usePerks';
import { PassButton } from './PassButton';

const mockAccount: Account = {
  address: '0x1234567890123456789012345678901234567890',
  chainId: 1,
  chainType: ChainType.EVM,
  isConnected: true,
  isConnecting: false,
  isDisconnected: false,
  isReconnecting: false,
  status: 'connected' as const,
};

const meta = {
  title: 'components/Navbar/components/Buttons/PassButton',
  component: PassButton,
  beforeEach: async () => {
    mocked(useAccount).mockReturnValue({
      account: mockAccount,
      accounts: [mockAccount],
    });
    mocked(usePerks).mockReturnValue({ perks: [], isLoading: false });
  },
} satisfies Meta<typeof PassButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// No points yet — label falls back to plain "Pass".
export const WithoutLevel: Story = {
  beforeEach: async () => {
    mocked(useLoyaltyPass).mockReturnValue({
      isSuccess: true,
      isLoading: false,
      points: undefined,
    });
  },
};

// Enough points to reach level 12 — label shows "Pass - lvl 12".
export const WithLevel: Story = {
  beforeEach: async () => {
    mocked(useLoyaltyPass).mockReturnValue({
      isSuccess: true,
      isLoading: false,
      points: 900,
    });
  },
};
