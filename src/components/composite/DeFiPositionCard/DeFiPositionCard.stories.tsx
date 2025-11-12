import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DeFiPositionCard } from './DeFiPositionCard';
import { defiPositions } from './fixtures';

const meta: Meta<typeof DeFiPositionCard> = {
  title: 'Composite/DeFiPositionCard',
  component: DeFiPositionCard,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const SinglePosition: Story = {
  args: {
    defiPosition: defiPositions[0],
  },
};

export const MultiplePositions: Story = {
  args: {
    defiPosition: defiPositions[1],
  },
};

export const NoRewards: Story = {
  args: {
    defiPosition: defiPositions[2],
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};
