import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { AssetOverviewCard } from './AssetOverviewCard';
import { defiPositions, tokens, tokenTinyAmounts } from './fixtures';

const meta = {
  component: AssetOverviewCard,
  title: 'Composite/AssetOverviewCard',
} satisfies Meta<typeof AssetOverviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OneAsset: Story = {
  args: {
    tokens: tokens.slice(0, 1),
    defiPositions: defiPositions.slice(0, 1),
  },
};

export const TwoAssets: Story = {
  args: {
    tokens: tokens.slice(0, 2),
    defiPositions: defiPositions.slice(0, 2),
  },
};

export const ThreeAssets: Story = {
  args: {
    tokens: tokens.slice(0, 3),
    defiPositions: defiPositions.slice(0, 3),
  },
};

export const FourAssets: Story = {
  args: {
    tokens: tokens.slice(0, 4),
    defiPositions: defiPositions.slice(0, 4),
  },
};

export const Overflow: Story = {
  args: {
    tokens,
    defiPositions,
  },
};

export const NoTokens: Story = {
  args: {
    tokens: [],
    defiPositions,
  },
};

export const NoDeFiPositions: Story = {
  args: {
    tokens,
    defiPositions: [],
  },
};

export const TokensTinyAmounts: Story = {
  args: {
    tokens: tokenTinyAmounts,
    defiPositions,
  },
};

export const NoContent: Story = {
  args: {
    tokens: [],
    defiPositions: [],
  },
};

export const Loading: Story = {
  args: {
    tokens: [],
    defiPositions: [],
    isLoading: true,
  },
};
