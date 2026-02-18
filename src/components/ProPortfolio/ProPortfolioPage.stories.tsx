import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { ProPortfolioPage } from './ProPortfolioPage';
import type { PnLTimeframe } from '@/types/pro-portfolio';
import {
  defaultProPortfolioData,
  negativePnLPortfolioData,
  multiWalletPortfolioData,
  positivePnLHistory,
  positiveSummary,
  primaryAccount,
} from './fixtures';

const meta = {
  title: 'Pages/ProPortfolio',
  component: ProPortfolioPage,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onTimeframeChange: fn(),
  },
} satisfies Meta<typeof ProPortfolioPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default: Positive PNL ───────────────────────────────────────────────────

export const Default: Story = {
  args: {
    data: defaultProPortfolioData,
  },
};

// ─── Negative PNL ────────────────────────────────────────────────────────────

export const NegativePnL: Story = {
  args: {
    data: negativePnLPortfolioData,
  },
};

// ─── Multiple Wallets ────────────────────────────────────────────────────────

export const MultipleWallets: Story = {
  args: {
    data: multiWalletPortfolioData,
  },
};

// ─── 24h Timeframe ───────────────────────────────────────────────────────────

export const SingleTimeframe: Story = {
  args: {
    data: {
      ...defaultProPortfolioData,
      selectedTimeframe: '24h',
      pnlHistory: positivePnLHistory.slice(-1),
      aggregatedPnL: {
        ...positiveSummary,
        timeframe: '24h' as const,
      },
    },
  },
};

// ─── Loading State ───────────────────────────────────────────────────────────

export const Loading: Story = {
  args: {
    data: null,
    isLoading: true,
  },
};

// ─── Empty State ─────────────────────────────────────────────────────────────

export const EmptyState: Story = {
  args: {
    data: null,
  },
};

// ─── Interactive (timeframe switching) ───────────────────────────────────────

const TIMEFRAME_DAYS: Record<PnLTimeframe, number> = {
  '24h': 1,
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '1y': 365,
  all: Infinity,
};

export const Interactive: Story = {
  args: {
    data: defaultProPortfolioData,
  },
  render: (args) => {
    const [timeframe, setTimeframe] = useState<PnLTimeframe>('all');

    const days = TIMEFRAME_DAYS[timeframe];
    const filteredHistory =
      days === Infinity ? positivePnLHistory : positivePnLHistory.slice(-days);

    const first = filteredHistory[0];
    const last = filteredHistory[filteredHistory.length - 1];
    const values = filteredHistory.map((p) => p.valueUsd);

    const data = {
      accounts: [primaryAccount],
      selectedTimeframe: timeframe,
      pnlHistory: filteredHistory,
      aggregatedPnL: {
        ...positiveSummary,
        timeframe,
        startDate: first?.date ?? '',
        endDate: last?.date ?? '',
        currentValueUsd: last?.valueUsd ?? 0,
        totalPnlUsd: last?.pnlUsd ?? 0,
        totalPnlPercent: last?.pnlPercent ?? 0,
        highUsd: Math.max(...values),
        lowUsd: Math.min(...values),
      },
    };

    return (
      <ProPortfolioPage
        {...args}
        data={data}
        onTimeframeChange={setTimeframe}
      />
    );
  },
};
