import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { BalanceCard } from './BalanceCard';
import { BalanceCardSkeleton } from './components/BalanceCardSkeleton';
import { BalanceCardSize } from './types';
import {
  mockSingleChainBalance,
  mockMultiChainEthBalances,
  mockMultiChainUsdcBalances,
  mockDaiBalance,
  mockLargeBalance,
  mockSmallBalance,
} from './fixtures';

const meta: Meta<typeof BalanceCard> = {
  title: 'components/Composite/BalanceCard',
  component: BalanceCard,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: Object.values(BalanceCardSize),
    },
    onSelect: { action: 'selected' },
  },
};

export default meta;
type Story = StoryObj<typeof BalanceCard>;

export const SingleChainSM: Story = {
  args: {
    balances: mockSingleChainBalance,
    size: BalanceCardSize.SM,
    onSelect: fn(),
  },
};

export const SingleChainMD: Story = {
  args: {
    balances: mockSingleChainBalance,
    size: BalanceCardSize.MD,
    onSelect: fn(),
  },
};

export const MultiChainEthSM: Story = {
  args: {
    balances: mockMultiChainEthBalances,
    size: BalanceCardSize.SM,
    onSelect: fn(),
  },
};

export const MultiChainEthMD: Story = {
  args: {
    balances: mockMultiChainEthBalances,
    size: BalanceCardSize.MD,
    onSelect: fn(),
  },
};

export const MultiChainUSDC: Story = {
  args: {
    balances: mockMultiChainUsdcBalances,
    size: BalanceCardSize.MD,
    onSelect: fn(),
  },
};

export const SingleDAI: Story = {
  args: {
    balances: mockDaiBalance,
    size: BalanceCardSize.MD,
    onSelect: fn(),
  },
};

export const LargeBalance: Story = {
  args: {
    balances: mockLargeBalance,
    size: BalanceCardSize.MD,
    onSelect: fn(),
  },
};

export const SmallBalance: Story = {
  args: {
    balances: mockSmallBalance,
    size: BalanceCardSize.MD,
    onSelect: fn(),
  },
};

export const NotClickable: Story = {
  args: {
    balances: mockSingleChainBalance,
    size: BalanceCardSize.MD,
  },
};

export const WithExpandedEndDivider: Story = {
  args: {
    balances: mockMultiChainEthBalances,
    size: BalanceCardSize.MD,
    onSelect: fn(),
    shouldShowExpandedEndDivider: true,
  },
};

export const CardList: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <BalanceCard
        balances={mockMultiChainEthBalances}
        size={BalanceCardSize.MD}
        onSelect={fn()}
      />
      <BalanceCard
        balances={mockMultiChainUsdcBalances}
        size={BalanceCardSize.MD}
        onSelect={fn()}
      />
      <BalanceCard
        balances={mockDaiBalance}
        size={BalanceCardSize.MD}
        onSelect={fn()}
      />
    </div>
  ),
};

export const SkeletonSM: Story = {
  render: () => <BalanceCardSkeleton size={BalanceCardSize.SM} />,
};

export const SkeletonMD: Story = {
  render: () => <BalanceCardSkeleton size={BalanceCardSize.MD} />,
};

export const SkeletonList: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <BalanceCardSkeleton size={BalanceCardSize.MD} />
      <BalanceCardSkeleton size={BalanceCardSize.MD} />
      <BalanceCardSkeleton size={BalanceCardSize.MD} />
    </div>
  ),
};
