import type { PortfolioPosition } from '@/providers/PortfolioProvider/types';
import type {
  EarnOpportunityWithLatestAnalytics,
  LoopoorMarket,
} from '@/types/jumper-backend';
import {
  loopoorApyToPercent,
  loopoorLltvToFraction,
  transformLoopoorMarketToOpportunity,
} from '@/utils/loopoor/transformLoopoorMarket';

export const CHAIN = { chainId: 1, chainKey: 'eth' };
export const ASSET_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // USDC
export const LP_ADDRESS = '0xC5e7AB07030305fc925175b25B93b285d40dCdFf';

export const mockProtocol = {
  name: 'Morpho',
  product: 'Morpho Vaults',
  logo: 'https://cdn.zerion.io/images/dapps/morpho.png',
};

export const mockEarnOpportunity: EarnOpportunityWithLatestAnalytics = {
  name: 'Morpho USDC Vault',
  slug: 'morpho-usdc-vault',
  description: 'Earn yield on USDC via Morpho',
  tags: ['lending'],
  featured: true,
  forYou: true,
  isRedeemable: true,
  protocol: mockProtocol,
  asset: {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    address: ASSET_ADDRESS,
    chain: CHAIN,
  },
  lpToken: {
    name: 'Morpho USDC LP',
    symbol: 'mUSDC',
    decimals: 6,
    address: LP_ADDRESS,
    chain: CHAIN,
  },
  rewards: [],
  latest: {
    date: '2024-01-01',
    tvlUsd: '10000000',
    tvlNative: '10000000',
    apy: { base: 5.5, reward: 1.2, total: 6.7, intrinsic: 3 },
  },
  interactionFlags: {
    canDeposit: true,
    canWithdraw: true,
    canRewardClaim: false,
    canRewardCompound: false,
    canRepay: false,
    canBorrow: false,
  },
};

// --- Borrow / Loopoor fixtures ---

export const BORROW_CHAIN_ID = 8453; // Base
export const BORROW_MARKET_ID =
  '0xffd35206a772174c04f599e4034a2f132fc3f7a462ca732affcea92136716573';
export const WETH_ADDRESS = '0x4200000000000000000000000000000000000006';

export const mockLoopoorMarket: LoopoorMarket = {
  chainId: BORROW_CHAIN_ID,
  marketId: BORROW_MARKET_ID,
  label: 'WETH/WETH',
  loanToken: {
    address: WETH_ADDRESS,
    symbol: 'WETH',
    decimals: 18,
  },
  collateralToken: {
    address: WETH_ADDRESS,
    symbol: 'WETH',
    decimals: 18,
  },
  oracle: '0x0000000000000000000000000000000000000000',
  irm: '0x0000000000000000000000000000000000000000',
  lltv: '945000000000000000',
  state: {
    price: '1234567890000000000000000000000000000',
    borrowApy: 0.0421,
    supplyApy: 0.0315,
    utilization: 0.83,
    borrowAssets: '12345678900000000000000',
    supplyAssets: '14583453000000000000000',
    collateralAssets: '25000000000000000000000',
    rewards: [],
  },
};

// Derived constants — declared after mockLoopoorMarket to avoid TDZ errors
export const BORROW_LLTV = loopoorLltvToFraction(mockLoopoorMarket.lltv);
export const BORROW_APY = loopoorApyToPercent(
  mockLoopoorMarket.state.borrowApy,
);

export const mockBorrowEarnOpportunity = transformLoopoorMarketToOpportunity(
  mockLoopoorMarket,
  'base',
  {
    name: 'Morpho',
    product: 'Morpho Blue',
    logo: 'https://cdn.zerion.io/images/dapps/morpho.png',
  },
);

export const mockPortfolioPosition: PortfolioPosition = {
  source: 'chain',
  name: 'Morpho USDC Position',
  description: 'Active USDC position on Morpho',
  assetUsd: 1500,
  debtUsd: 0,
  netUsd: 1500,
  address: ASSET_ADDRESS,
  type: 'lending',
  protocol: mockProtocol,
  lpToken: {
    amount: BigInt('1500000000'),
    amountUSD: 1500,
    token: {
      type: 'position',
      address: LP_ADDRESS,
      name: 'Morpho USDC LP',
      symbol: 'mUSDC',
      decimals: 6,
      chainId: CHAIN.chainId,
      priceUSD: '1.0',
      chain: CHAIN,
    },
  },
  supplyTokens: [],
  borrowTokens: [],
  assetTokens: [],
  collateralTokens: [],
  rewardTokens: [],
};
