import type {
  PnLDataPoint,
  PnLTimeframe,
  PnLTimeframeSummary,
  AccountSummary,
  ProPortfolioData,
} from '@/types/pro-portfolio';

// ─── PNL History (365 days of simulated data) ───────────────────────────────

function generatePnLHistory(
  days: number,
  startValue: number,
  volatility: number,
  drift: number,
): PnLDataPoint[] {
  const points: PnLDataPoint[] = [];
  let value = startValue;
  const costBasis = startValue;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.5) * 2 * volatility + drift;
    value = Math.max(value * (1 + change), 0);
    const pnlUsd = value - costBasis;
    const pnlPercent = ((value - costBasis) / costBasis) * 100;

    points.push({
      date: date.toISOString().split('T')[0],
      valueUsd: Math.round(value * 100) / 100,
      pnlUsd: Math.round(pnlUsd * 100) / 100,
      pnlPercent: Math.round(pnlPercent * 100) / 100,
    });
  }
  return points;
}

export const positivePnLHistory: PnLDataPoint[] = generatePnLHistory(
  365,
  50_000,
  0.015,
  0.001,
);

export const negativePnLHistory: PnLDataPoint[] = generatePnLHistory(
  365,
  50_000,
  0.02,
  -0.002,
);

// ─── Timeframe Summaries ────────────────────────────────────────────────────

function summaryFromHistory(
  history: PnLDataPoint[],
  timeframe: PnLTimeframe,
): PnLTimeframeSummary {
  const last = history[history.length - 1];
  const first = history[0];
  const values = history.map((p) => p.valueUsd);
  const costBasis = first.valueUsd;

  return {
    timeframe,
    startDate: first.date,
    endDate: last.date,
    currentValueUsd: last.valueUsd,
    costBasisUsd: costBasis,
    totalPnlUsd: last.pnlUsd,
    totalPnlPercent: last.pnlPercent,
    realizedPnlUsd: Math.round(last.pnlUsd * 0.35 * 100) / 100,
    unrealizedPnlUsd: Math.round(last.pnlUsd * 0.65 * 100) / 100,
    highUsd: Math.max(...values),
    lowUsd: Math.min(...values),
  };
}

export const positiveSummary = summaryFromHistory(positivePnLHistory, 'all');

export const negativeSummary = summaryFromHistory(negativePnLHistory, 'all');

// ─── Account Summaries ──────────────────────────────────────────────────────

export const primaryAccount: AccountSummary = {
  address: '0x1234567890abcdef1234567890abcdef12345678',
  ensName: 'jumper.eth',
  totalBalanceUsd: 42_350.87,
  chainBreakdown: [
    {
      chainId: 1,
      chainKey: 'eth',
      chainName: 'Ethereum',
      chainLogo:
        'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/ethereum.svg',
      balanceUsd: 22_150.32,
      percentage: 52.3,
      tokenCount: 8,
    },
    {
      chainId: 42161,
      chainKey: 'arb',
      chainName: 'Arbitrum',
      chainLogo:
        'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/arbitrum.svg',
      balanceUsd: 10_200.55,
      percentage: 24.1,
      tokenCount: 5,
    },
    {
      chainId: 8453,
      chainKey: 'base',
      chainName: 'Base',
      chainLogo:
        'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/base.svg',
      balanceUsd: 6_800.0,
      percentage: 16.1,
      tokenCount: 3,
    },
    {
      chainId: 10,
      chainKey: 'opt',
      chainName: 'Optimism',
      chainLogo:
        'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/optimism.svg',
      balanceUsd: 3_200.0,
      percentage: 7.5,
      tokenCount: 4,
    },
  ],
  defiPositionsSummary: {
    totalValueUsd: 18_500.0,
    totalDebtUsd: 2_000.0,
    netValueUsd: 16_500.0,
    positionCount: 7,
    protocolCount: 4,
    topProtocols: [
      {
        name: 'Aave V3',
        logo: 'https://static.debank.com/image/project/logo_url/aave3/54df7839ab09493ba7540ab832590255.png',
        valueUsd: 8_500.0,
        percentage: 45.9,
      },
      {
        name: 'Morpho',
        logo: 'https://static.debank.com/image/project/logo_url/morphoblue/cfe5f811a4fb96355e0fb367b5201f87.png',
        valueUsd: 5_200.0,
        percentage: 28.1,
      },
      {
        name: 'Lido',
        logo: 'https://static.debank.com/image/project/logo_url/lido/081388dbc73b5a05e5851da8d8907f2c.png',
        valueUsd: 3_500.0,
        percentage: 18.9,
      },
      {
        name: 'Uniswap V3',
        logo: 'https://static.debank.com/image/project/logo_url/uniswap3/87a541b3b83b041c8d12119e5a0d19f0.png',
        valueUsd: 1_300.0,
        percentage: 7.1,
      },
    ],
  },
  performance: {
    bestDay: { date: '2025-11-15', pnlUsd: 3_240.0, pnlPercent: 6.8 },
    worstDay: { date: '2025-08-05', pnlUsd: -4_100.0, pnlPercent: -8.2 },
    winRate: 58.4,
    maxDrawdown: 22.3,
    sharpeRatio: 1.42,
    volatility: 18.7,
  },
};

export const secondaryAccount: AccountSummary = {
  address: '0xabcdef1234567890abcdef1234567890abcdef12',
  totalBalanceUsd: 12_800.0,
  chainBreakdown: [
    {
      chainId: 1,
      chainKey: 'eth',
      chainName: 'Ethereum',
      balanceUsd: 8_000.0,
      percentage: 62.5,
      tokenCount: 3,
    },
    {
      chainId: 8453,
      chainKey: 'base',
      chainName: 'Base',
      balanceUsd: 4_800.0,
      percentage: 37.5,
      tokenCount: 2,
    },
  ],
  defiPositionsSummary: {
    totalValueUsd: 4_200.0,
    totalDebtUsd: 0,
    netValueUsd: 4_200.0,
    positionCount: 2,
    protocolCount: 1,
    topProtocols: [
      {
        name: 'Aave V3',
        logo: 'https://static.debank.com/image/project/logo_url/aave3/54df7839ab09493ba7540ab832590255.png',
        valueUsd: 4_200.0,
        percentage: 100,
      },
    ],
  },
  performance: {
    bestDay: { date: '2025-10-22', pnlUsd: 890.0, pnlPercent: 7.2 },
    worstDay: { date: '2025-09-12', pnlUsd: -1_020.0, pnlPercent: -7.8 },
    winRate: 52.1,
    maxDrawdown: 28.6,
    sharpeRatio: 0.89,
    volatility: 24.1,
  },
};

// ─── Complete Page Data ─────────────────────────────────────────────────────

export const defaultProPortfolioData: ProPortfolioData = {
  accounts: [primaryAccount],
  aggregatedPnL: positiveSummary,
  pnlHistory: positivePnLHistory,
  selectedTimeframe: 'all',
};

export const negativePnLPortfolioData: ProPortfolioData = {
  accounts: [primaryAccount],
  aggregatedPnL: negativeSummary,
  pnlHistory: negativePnLHistory,
  selectedTimeframe: 'all',
};

export const multiWalletPortfolioData: ProPortfolioData = {
  accounts: [primaryAccount, secondaryAccount],
  aggregatedPnL: positiveSummary,
  pnlHistory: positivePnLHistory,
  selectedTimeframe: 'all',
};
