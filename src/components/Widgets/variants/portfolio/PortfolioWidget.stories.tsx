import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { PortfolioWidget } from './PortfolioWidget';
import { PortfolioWidgetVariants } from './types';
import {
  BORROW_MARKET_ID,
  mockBorrowEarnOpportunity,
  mockEarnOpportunity,
  mockPortfolioPosition,
} from './fixtures';

const meta = {
  component: PortfolioWidget,
  title: 'Components/Portfolio Widget',
  args: {
    onRouteCompleted: fn(),
    disabledWidgetVariants: [],
  },
} satisfies Meta<typeof PortfolioWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Stories ---

export const Swap: Story = {
  args: {
    widgetVariants: [PortfolioWidgetVariants.Swap],
  },
};

export const Buy: Story = {
  args: {
    widgetVariants: [PortfolioWidgetVariants.Buy],
  },
};

export const Deposit: Story = {
  args: {
    widgetVariants: [PortfolioWidgetVariants.Deposit],
    earnOpportunities: [mockEarnOpportunity],
    minFromAmountUSD: 10,
  },
};

export const Withdraw: Story = {
  args: {
    widgetVariants: [PortfolioWidgetVariants.Withdraw],
    portfolioPositions: [mockPortfolioPosition],
  },
};

export const Borrow: Story = {
  args: {
    widgetVariants: [PortfolioWidgetVariants.Borrow],
    earnOpportunities: [mockBorrowEarnOpportunity],
    marketId: BORROW_MARKET_ID,
  },
};

export const AllVariants: Story = {
  args: {
    widgetVariants: [
      PortfolioWidgetVariants.Swap,
      PortfolioWidgetVariants.Buy,
      PortfolioWidgetVariants.Deposit,
      PortfolioWidgetVariants.Withdraw,
    ],
    earnOpportunities: [mockEarnOpportunity],
    portfolioPositions: [mockPortfolioPosition],
    minFromAmountUSD: 10,
  },
};
