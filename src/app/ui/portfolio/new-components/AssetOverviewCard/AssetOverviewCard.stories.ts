import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { AssetOverviewCard } from './AssetOverviewCard';
import {
  positions,
  positionsTotalValueUSD,
  tokens,
  tokensTotalValueUSD,
  tokenTinyAmounts,
  tokenTinyAmountsTotalValueUSD,
} from './fixtures';

const meta = {
  component: AssetOverviewCard,
  title: 'Composite/AssetOverviewCard',
} satisfies Meta<typeof AssetOverviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const sliceTokens = (count: number) => tokens.slice(0, count);
const slicePositions = (count: number) => positions.slice(0, count);
const sumTokensValue = (t: typeof tokens) =>
  t.reduce((s, token) => s + token.totalValueUSD, 0);
const sumPositionsValue = (p: typeof positions) =>
  p.reduce((s, pos) => s + pos.totalValueUSD, 0);

export const OneAsset: Story = {
  args: {
    tokens: sliceTokens(1),
    tokensTotalValueUSD: sumTokensValue(sliceTokens(1)),
    positions: slicePositions(1),
    positionsTotalValueUSD: sumPositionsValue(slicePositions(1)),
  },
};

export const TwoAssets: Story = {
  args: {
    tokens: sliceTokens(2),
    tokensTotalValueUSD: sumTokensValue(sliceTokens(2)),
    positions: slicePositions(2),
    positionsTotalValueUSD: sumPositionsValue(slicePositions(2)),
  },
};

export const ThreeAssets: Story = {
  args: {
    tokens: sliceTokens(3),
    tokensTotalValueUSD: sumTokensValue(sliceTokens(3)),
    positions: slicePositions(3),
    positionsTotalValueUSD: sumPositionsValue(slicePositions(3)),
  },
};

export const FourAssets: Story = {
  args: {
    tokens: sliceTokens(4),
    tokensTotalValueUSD: sumTokensValue(sliceTokens(4)),
    positions: slicePositions(4),
    positionsTotalValueUSD: sumPositionsValue(slicePositions(4)),
  },
};

export const Overflow: Story = {
  args: {
    tokens,
    tokensTotalValueUSD,
    positions,
    positionsTotalValueUSD,
  },
};

export const NoTokens: Story = {
  args: {
    tokens: [],
    tokensTotalValueUSD: 0,
    positions,
    positionsTotalValueUSD,
  },
};

export const NoDeFiPositions: Story = {
  args: {
    tokens,
    tokensTotalValueUSD,
    positions: [],
    positionsTotalValueUSD: 0,
  },
};

export const TokensTinyAmounts: Story = {
  args: {
    tokens: tokenTinyAmounts,
    tokensTotalValueUSD: tokenTinyAmountsTotalValueUSD,
    positions,
    positionsTotalValueUSD,
  },
};

export const NoContent: Story = {
  args: {
    tokens: [],
    tokensTotalValueUSD: 0,
    positions: [],
    positionsTotalValueUSD: 0,
  },
};

export const Loading: Story = {
  args: {
    tokens: [],
    tokensTotalValueUSD: 0,
    positions: [],
    positionsTotalValueUSD: 0,
    isLoading: true,
  },
};
