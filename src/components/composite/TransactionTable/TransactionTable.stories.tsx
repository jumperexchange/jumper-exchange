import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TransactionTable } from './TransactionTable';
import { TransactionTableSkeleton } from './TransactionTableSkeleton';
import { TRANSACTION_SUMMARY_COMPACT_ROW_CONFIG } from './constants';
import {
  mockMultiTokenTradeTransaction,
  mockReceiveTransaction,
  mockSendTransaction,
  mockTradeTransaction,
  mockTransactions,
} from './fixtures';

const meta: Meta<typeof TransactionTable> = {
  title: 'components/Composite/TransactionTable',
  component: TransactionTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    transactions: { table: { disable: true } },
    config: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof TransactionTable>;

export const Trade: Story = {
  args: {
    transactions: [mockTradeTransaction],
    onTransactionClick: (tx) => console.log('clicked', tx.txHash),
  },
};

export const Send: Story = {
  args: {
    transactions: [mockSendTransaction],
  },
};

export const Receive: Story = {
  args: {
    transactions: [mockReceiveTransaction],
  },
};

export const MultiTokenTrade: Story = {
  args: {
    transactions: [mockMultiTokenTradeTransaction],
  },
};

export const TransactionList: Story = {
  args: {
    transactions: mockTransactions,
    onTransactionClick: (tx) => console.log('clicked', tx.txHash),
  },
};

export const TransactionListWithHeader: Story = {
  args: {
    transactions: mockTransactions,
    showHeader: true,
    onTransactionClick: (tx) => console.log('clicked', tx.txHash),
  },
};

export const CompactLayout: Story = {
  args: {
    transactions: mockTransactions,
    config: TRANSACTION_SUMMARY_COMPACT_ROW_CONFIG,
    onTransactionClick: (tx) => console.log('clicked', tx.txHash),
  },
};

export const Skeleton: Story = {
  render: () => <TransactionTableSkeleton />,
};

export const SkeletonWithHeader: Story = {
  render: () => <TransactionTableSkeleton showHeader />,
};
