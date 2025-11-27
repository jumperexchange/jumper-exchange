import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DeFiPositionCard } from './DeFiPositionCard';
import {
  aavePositions,
  morphoPositions,
  gauntletPositions,
  merklPositions,
} from './fixtures';

const meta: Meta<typeof DeFiPositionCard> = {
  title: 'Composite/DeFiPositionCard',
  component: DeFiPositionCard,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const AaveMultiplePositions: Story = {
  args: {
    defiPositions: aavePositions,
  },
};

export const MorphoMultiplePositions: Story = {
  args: {
    defiPositions: morphoPositions,
  },
};

export const SinglePosition: Story = {
  args: {
    defiPositions: gauntletPositions,
  },
};

export const SinglePositionMultipleSuppliedTokens: Story = {
  args: {
    defiPositions: merklPositions,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};
