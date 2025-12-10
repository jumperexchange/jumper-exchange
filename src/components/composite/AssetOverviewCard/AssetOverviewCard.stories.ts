import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { AssetOverviewCard } from './AssetOverviewCard';
import { defiPositionGroups, tokens, tokenTinyAmounts } from './fixtures';

const meta = {
  component: AssetOverviewCard,
  title: 'Composite/AssetOverviewCard',
} satisfies Meta<typeof AssetOverviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OneAsset: Story = {
  args: {
    tokens: tokens.slice(0, 1),
    defiPositionGroups: defiPositionGroups.slice(0, 1),
  },
};

export const TwoAssets: Story = {
  args: {
    tokens: tokens.slice(0, 2),
    defiPositionGroups: defiPositionGroups.slice(0, 2),
  },
};

export const ThreeAssets: Story = {
  args: {
    tokens: tokens.slice(0, 3),
    defiPositionGroups: defiPositionGroups.slice(0, 3),
  },
};

export const FourAssets: Story = {
  args: {
    tokens: tokens.slice(0, 4),
    defiPositionGroups: defiPositionGroups.slice(0, 4),
  },
};

export const Overflow: Story = {
  args: {
    tokens,
    defiPositionGroups: defiPositionGroups,
  },
};

export const NoTokens: Story = {
  args: {
    tokens: [],
    defiPositionGroups: defiPositionGroups,
  },
};

export const NoDeFiPositions: Story = {
  args: {
    tokens,
    defiPositionGroups: [],
  },
};

export const TokensTinyAmounts: Story = {
  args: {
    tokens: tokenTinyAmounts,
    defiPositionGroups: defiPositionGroups,
  },
};

export const NoContent: Story = {
  args: {
    tokens: [],
    defiPositionGroups: [],
  },
};

export const Loading: Story = {
  args: {
    tokens: [],
    defiPositionGroups: [],
    isLoading: true,
  },
};
