import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TokenAmount } from './TokenAmount';
import type { TokenAmountProps } from './types';
import { mockTokenBalances } from './fixtures';

const meta: Meta<TokenAmountProps> = {
  title: 'components/composite/TokenAmount',
  component: TokenAmount,
  tags: ['autodocs'],
  argTypes: {
    balance: { table: { disable: true } },
    amountUSDVariant: {
      control: { type: 'select' },
      options: ['titleXSmall', 'bodySmallStrong', 'bodySmall'],
    },
    amountVariant: {
      control: { type: 'select' },
      options: ['bodyXSmall', 'bodyXXSmall', 'bodySmall'],
    },
    compact: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;

export const Default: StoryObj<TokenAmountProps> = {
  args: {
    balance: mockTokenBalances.eth,
    amountUSDVariant: 'bodySmallStrong',
    amountVariant: 'bodyXXSmall',
  },
};

export const Compact: StoryObj<TokenAmountProps> = {
  args: {
    balance: mockTokenBalances.eth,
    compact: true,
  },
};

export const LargeVariant: StoryObj<TokenAmountProps> = {
  args: {
    balance: mockTokenBalances.usdc,
    amountUSDVariant: 'titleXSmall',
    amountVariant: 'bodyXSmall',
    gap: 4,
  },
};

export const Aggregated: StoryObj<TokenAmountProps> = {
  args: {
    balances: [
      {
        amount: 1000000000000000000000000n,
        amountUSD: 1000000000000000000000000,
        token: {
          ...mockTokenBalances.eth.token,
          chainId: 42161,
        },
      },
      {
        amount: 1000000000000000000000000n,
        amountUSD: 100,
        token: {
          ...mockTokenBalances.eth.token,
          chainId: 137,
        },
      },
    ],
    amountUSDVariant: 'titleXSmall',
    amountVariant: 'bodyXSmall',
    gap: 4,
  },
};
