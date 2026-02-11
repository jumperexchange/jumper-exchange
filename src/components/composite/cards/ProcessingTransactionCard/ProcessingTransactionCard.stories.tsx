import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProcessingTransactionCard } from './ProcessingTransactionCard';
import { ProcessingTransactionCardStatus } from './types';
import { commonArgs } from './fixtures';
import { addMinutes } from 'date-fns/addMinutes';

const meta = {
  title: 'components/composite/cards/ProcessingTransactionCard',
  component: ProcessingTransactionCard,
  argTypes: {
    status: {
      control: { type: 'select' },
      options: Object.values(ProcessingTransactionCardStatus),
    },
  },
} satisfies Meta<typeof ProcessingTransactionCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...commonArgs,
  },
};

export const Success: Story = {
  args: {
    ...commonArgs,
    status: ProcessingTransactionCardStatus.SUCCESS,
  },
};

export const Failed: Story = {
  args: {
    ...commonArgs,
    status: ProcessingTransactionCardStatus.FAILED,
  },
};

export const WithCountDownTargetDate: Story = {
  args: {
    ...commonArgs,
    targetTime: addMinutes(new Date(), 1).getTime(),
  },
};

export const WithCountUpTargetDate: Story = {
  args: {
    ...commonArgs,
    targetTime: addMinutes(new Date(), -1).getTime(),
  },
};
