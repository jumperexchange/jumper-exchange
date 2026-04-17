import type {
  ChainPortfolioPosition,
  AppPortfolioPosition,
} from '@/providers/PortfolioProvider/types';
import type { PortfolioBalance, PositionToken } from '@/types/tokens';

// Helper to create a PortfolioToken
const createToken = (
  address: string,
  name: string,
  symbol: string,
  decimals: number,
  logoURI: string,
  priceUSD: string,
  chainId: number,
  chainKey: string,
): PositionToken => ({
  type: 'position',
  address,
  name,
  symbol,
  decimals,
  logoURI,
  priceUSD,
  chainId,
  chain: { chainId, chainKey },
});

// Helper to create a PositionBalance
const createBalance = (
  amount: bigint,
  token: PositionToken,
  amountUSD: number,
): PortfolioBalance<PositionToken> => ({
  amount,
  token,
  amountUSD,
});

// ============= AAVE POSITIONS =============

const usdcArb = createToken(
  '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
  'USD Coin',
  'USDC',
  6,
  'https://static.debank.com/image/arb_token/logo_url/0xaf88d065e77c8cc2239327c5edb3a432268e5831/fffcd27b9efff5a86ab942084c05924d.png',
  '1.000100010001',
  42161,
  'arb',
);

const wethBase = createToken(
  '0x4200000000000000000000000000000000000006',
  'Wrapped Ether',
  'WETH',
  18,
  'https://static.debank.com/image/eth_token/logo_url/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/61844453e63cf81301f845d7864236f6.png',
  '3023.72',
  8453,
  'base',
);

export const aavePositions: ChainPortfolioPosition[] = [
  {
    source: 'chain',
    chain: { chainId: 42161, chainKey: 'arb' },
    name: 'Aave V3',
    assetUsd: 1.0017831783178317,
    debtUsd: 0,
    netUsd: 1.0017831783178317,
    address: '0x794a61358d6845594f94dc1db02a252b5b4814ad',
    type: 'Lending',
    openedAt: '2024-10-15T12:30:00.000Z',
    latest: {
      date: '2025-11-27T00:00:00.000Z',
      tvlUsd: '850000000',
      tvlNative: '850000000',
      apy: {
        base: 2.8,
        reward: 0.5,
        intrinsic: 0,
        total: 3.3,
      },
    },
    protocol: {
      name: 'Aave V3',
      logo: 'https://static.debank.com/image/project/logo_url/aave3/54df7839ab09493ba7540ab832590255.png',
      url: 'https://app.aave.com',
    },
    supplyTokens: [createBalance(1001683n, usdcArb, 1.0017831783178317)],
    borrowTokens: [],
    assetTokens: [],
    collateralTokens: [],
    rewardTokens: [],
  },
  {
    source: 'chain',
    chain: { chainId: 8453, chainKey: 'base' },
    name: 'Aave V3',
    assetUsd: 7.04781961968e-9,
    debtUsd: 1,
    netUsd: -0.99999999295218038,
    address: '0xa238dd80c259a72e81d7e4664a9801593f98d1c5',
    type: 'Lending',
    openedAt: '2024-09-20T08:15:00.000Z',
    latest: {
      date: '2025-11-27T00:00:00.000Z',
      tvlUsd: '850000000',
      tvlNative: '245000',
      apy: {
        base: 2.8,
        reward: 0.5,
        intrinsic: 0,
        total: 3.3,
      },
    },
    protocol: {
      name: 'Aave V3',
      logo: 'https://static.debank.com/image/project/logo_url/aave3/54df7839ab09493ba7540ab832590255.png',
      url: 'https://app.aave.com',
    },
    supplyTokens: [createBalance(2330844n, wethBase, 7.04781961968e-9)],
    borrowTokens: [createBalance(2330844n, wethBase, 1)],
    assetTokens: [],
    collateralTokens: [],
    rewardTokens: [],
  },
];

// ============= MORPHO POSITIONS =============

const vbEthKatana = createToken(
  '0xee7d8bcfb72bc1880d0cf19822eb0a2e6577ab62',
  'Vault Bridge ETH',
  'vbETH',
  18,
  'https://static.debank.com/image/katana_token/logo_url/katana/48bfb74adddd170e936578aec422836d.png',
  '3024.31',
  747474,
  'katana',
);

const vbUsdcKatana = createToken(
  '0x203a662b0bd271a6ed5a60edfbd04bfce608fd36',
  'Vault Bridge USDC',
  'vbUSDC',
  6,
  'https://static.debank.com/image/coin/logo_url/usdc/e87790bfe0b3f2ea855dc29069b38818.png',
  '1',
  747474,
  'katana',
);

export const morphoPositions: ChainPortfolioPosition[] = [
  {
    source: 'chain',
    chain: { chainId: 747474, chainKey: 'katana' },
    name: 'Morpho',
    assetUsd: 0.33359629049812184,
    debtUsd: 0,
    netUsd: 0.33359629049812184,
    address: '0xc5e7ab07030305fc925175b25b93b285d40dcdff',
    type: 'Yield',
    openedAt: '2024-11-05T14:20:00.000Z',
    unlockAt: '2025-05-05T14:20:00.000Z',
    latest: {
      date: '2025-11-27T00:00:00.000Z',
      tvlUsd: '125000000',
      tvlNative: '125000000',
      apy: {
        base: 8.5,
        reward: 0,
        intrinsic: 0,
        total: 8.5,
      },
    },
    protocol: {
      name: 'Morpho',
      logo: 'https://static.debank.com/image/project/logo_url/morphoblue/cfe5f811a4fb96355e0fb367b5201f87.png',
      url: 'https://app.morpho.org',
    },
    supplyTokens: [
      createBalance(110304925916365n, vbEthKatana, 0.33359629049812184),
    ],
    borrowTokens: [],
    assetTokens: [],
    collateralTokens: [],
    rewardTokens: [],
  },
  {
    source: 'chain',
    chain: { chainId: 747474, chainKey: 'katana' },
    name: 'Morpho',
    assetUsd: 119.705551,
    debtUsd: 0,
    netUsd: 119.705551,
    address: '0xe4248e2105508fcbad3fe95691551d1af14015f7',
    type: 'Yield',
    openedAt: '2024-07-22T16:30:00.000Z',
    unlockAt: '2025-01-22T16:30:00.000Z',
    latest: {
      date: '2025-11-27T00:00:00.000Z',
      tvlUsd: '125000000',
      tvlNative: '125000000',
      apy: {
        base: 9.1,
        reward: 0,
        intrinsic: 0,
        total: 9.1,
      },
    },
    protocol: {
      name: 'Morpho',
      logo: 'https://static.debank.com/image/project/logo_url/morphoblue/cfe5f811a4fb96355e0fb367b5201f87.png',
      url: 'https://app.morpho.org',
    },
    supplyTokens: [createBalance(119705551n, vbUsdcKatana, 119.705551)],
    borrowTokens: [],
    assetTokens: [],
    collateralTokens: [],
    rewardTokens: [],
  },
];

// ============= GAUNTLET POSITIONS =============

const usdcBase = createToken(
  '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  'USD Coin',
  'USDC',
  6,
  'https://static.debank.com/image/eth_token/logo_url/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/fffcd27b9efff5a86ab942084c05924d.png',
  '1.000100010001',
  8453,
  'base',
);

export const gauntletPositions: ChainPortfolioPosition[] = [
  {
    source: 'chain',
    chain: { chainId: 8453, chainKey: 'base' },
    name: 'Gauntlet USDC Prime',
    assetUsd: 1.5076017601760177,
    debtUsd: 0,
    netUsd: 1.5076017601760177,
    address: '0xee8f4ec5672f09119b96ab6fb59c27e1b7e44b61',
    earn: 'gauntlet-usdc-prime-on-base',
    latest: {
      date: '2025-11-27T00:00:00.000Z',
      tvlUsd: '120919299',
      tvlNative: '120941021471490',
      apy: {
        base: 0.0676,
        reward: 0,
        intrinsic: 0,
        total: 0.0676,
      },
    },
    type: 'Yield',
    protocol: {
      name: 'morpho',
      product: 'metamorpho',
      version: '',
      logo: 'https://strapi-staging.jumper.exchange/uploads/protocols_morpho_22aad9e9df.png',
      url: 'https://app.morpho.org/',
    },
    supplyTokens: [createBalance(1507451n, usdcBase, 1.5076017601760177)],
    borrowTokens: [],
    assetTokens: [],
    collateralTokens: [],
    rewardTokens: [],
  },
];

// ============= MERKL POSITIONS (with rewards) =============

const morphoBase = createToken(
  '0xbaa5cc21fd487b8fcc2f632f3f4e8d37262a0842',
  'Morpho Token',
  'MORPHO',
  18,
  'https://static.debank.com/image/base_token/logo_url/0xbaa5cc21fd487b8fcc2f632f3f4e8d37262a0842/c092d2c513136e17883955cdd2c62ff1.png',
  '1.5323',
  8453,
  'base',
);

export const merklPositions: ChainPortfolioPosition[] = [
  {
    source: 'chain',
    chain: { chainId: 8453, chainKey: 'base' },
    name: 'Merkl',
    assetUsd: 0.03301631879858625,
    debtUsd: 0,
    netUsd: 0.03301631879858625,
    address: '0x3ef3d8ba38ebe18db133cec108f4d14ce00dd9ae',
    type: 'Rewards',
    openedAt: '2024-10-15T12:30:00.000Z',
    latest: {
      date: '2025-11-27T00:00:00.000Z',
      tvlUsd: '850000000',
      tvlNative: '850000000',
      apy: {
        base: 2.8,
        reward: 0.5,
        intrinsic: 0,
        total: 3.3,
      },
    },
    protocol: {
      name: 'Merkl',
      logo: 'https://static.debank.com/image/project/logo_url/merkl/7c4a97689b3310cc3436bc6e1a215476.png',
      url: 'https://app.merkl.xyz',
    },
    supplyTokens: [],
    borrowTokens: [],
    assetTokens: [],
    collateralTokens: [],
    rewardTokens: [
      createBalance(21228119770743320n, morphoBase, 0.03252784792470999),
      createBalance(161546331630n, wethBase, 0.0004884708738762635),
    ],
  },
];

// ============= APP POSITIONS (Hyperliquid, Polymarket) =============

const usdcHyperliquid: PositionToken = {
  type: 'position',
  address: 'cbc85c2463806ead7328a5da06425a2b',
  name: 'USDC',
  symbol: 'USDC',
  decimals: 8,
  logoURI: 'https://static.debank.com/image/coin/logo_url/usdc/usdc.png',
  priceUSD: '1',
  chainId: -1,
  app: {
    key: 'hyperliquid',
    logo: 'https://static.debank.com/image/project/logo_url/hyperliquid/hyperliquid.png',
    url: 'https://app.hyperliquid.xyz',
  },
};

export const hyperliquidPositions: AppPortfolioPosition[] = [
  {
    source: 'app',
    app: {
      key: 'hyperliquid',
      logo: 'https://static.debank.com/image/project/logo_url/hyperliquid/hyperliquid.png',
      url: 'https://app.hyperliquid.xyz',
    },
    name: 'Hyperliquid',
    description: 'Main-Account Spot',
    assetUsd: 101.45,
    debtUsd: 0,
    netUsd: 101.45,
    address: '0x1234567890abcdef1234567890abcdef12345678',
    type: 'Deposit',
    protocol: {
      name: 'Hyperliquid',
      logo: 'https://static.debank.com/image/project/logo_url/hyperliquid/hyperliquid.png',
      url: 'https://app.hyperliquid.xyz',
    },
    supplyTokens: [createBalance(101451288n, usdcHyperliquid, 101.45)],
    borrowTokens: [],
    assetTokens: [],
    collateralTokens: [],
    rewardTokens: [],
  },
];

export const polymarketPositions: AppPortfolioPosition[] = [
  {
    source: 'app',
    app: {
      key: 'polymarket',
      logo: 'https://static.debank.com/image/project/logo_url/polymarket/polymarket.png',
      url: 'https://polymarket.com/',
    },
    name: 'Polymarket',
    assetUsd: 399.99,
    debtUsd: 0,
    netUsd: 399.99,
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    type: 'Prediction',
    protocol: {
      name: 'Polymarket',
      logo: 'https://static.debank.com/image/project/logo_url/polymarket/polymarket.png',
      url: 'https://polymarket.com/',
    },
    supplyTokens: [],
    borrowTokens: [],
    assetTokens: [],
    collateralTokens: [],
    rewardTokens: [],
  },
];

// ============= EXPORTS FOR STORIES =============

export const mockChainPositions = aavePositions;
export const mockAppPositions = hyperliquidPositions;
