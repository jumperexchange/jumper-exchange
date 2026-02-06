import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProcessingTransactionCard } from './ProcessingTransactionCard';
import { addMinutes } from 'date-fns';

const meta = {
  title: 'components/composite/cards/ProcessingTransactionCard',
  component: ProcessingTransactionCard,
  argTypes: {
    status: {
      control: 'select',
      options: ['pending', 'success', 'failed'],
    },
  },
} satisfies Meta<typeof ProcessingTransactionCard>;

export default meta;

type Story = StoryObj<typeof meta>;

const commonArgs = {
  fromToken: {
    address: '0x0000000000000000000000000000000000000000',
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
    type: 'extended',
    priceUSD: '1000',
    chainId: 1,
  },
  toToken: {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    name: 'USDC',
    symbol: 'USDC',
    decimals: 18,
    type: 'extended',
    priceUSD: '1000',
    chainId: 1,
  },
  status: 'pending',
  title: 'Processing Transaction',
  description: 'This is a sample transaction description.',
  targetDate: addMinutes(new Date(), 1).getTime(),
} as const;

export const Default: Story = {
  args: {
    ...commonArgs,
  },
};

export const Success: Story = {
  args: {
    ...commonArgs,
    status: 'success',
  },
};

export const Failed: Story = {
  args: {
    ...commonArgs,
    status: 'failed',
  },
};

export const WithCountUpTargetDate: Story = {
  args: {
    ...commonArgs,
    targetTime: addMinutes(new Date(), -1).getTime(),
  },
};
