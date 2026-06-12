import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TransactionTable } from './TransactionTable';
import { TRANSACTION_SUMMARY_COMPACT_ROW_CONFIG } from './constants';
import {
  mockMultiTokenTradeTransaction,
  mockReceiveTransaction,
  mockSendTransaction,
  mockTradeTransaction,
  mockTransactions,
} from './fixtures';

const meta: Meta<typeof TransactionTable> = {
  title: 'components/Composite/TransactionCard/TransactionTable',
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
  render: () => (
    <TransactionTable
      transactions={[mockTradeTransaction]}
      onTransactionClick={(tx) => console.log('clicked', tx.txHash)}
    />
  ),
};

export const Send: Story = {
  render: () => <TransactionTable transactions={[mockSendTransaction]} />,
};

export const Receive: Story = {
  render: () => <TransactionTable transactions={[mockReceiveTransaction]} />,
};

export const MultiTokenTrade: Story = {
  render: () => (
    <TransactionTable transactions={[mockMultiTokenTradeTransaction]} />
  ),
};

export const TransactionList: Story = {
  render: () => (
    <TransactionTable
      transactions={mockTransactions}
      onTransactionClick={(tx) => console.log('clicked', tx.txHash)}
    />
  ),
};

export const TransactionListWithHeader: Story = {
  render: () => (
    <TransactionTable
      transactions={mockTransactions}
      showHeader
      onTransactionClick={(tx) => console.log('clicked', tx.txHash)}
    />
  ),
};

export const CompactLayout: Story = {
  render: () => (
    <TransactionTable
      transactions={mockTransactions}
      config={TRANSACTION_SUMMARY_COMPACT_ROW_CONFIG}
      onTransactionClick={(tx) => console.log('clicked', tx.txHash)}
    />
  ),
};
