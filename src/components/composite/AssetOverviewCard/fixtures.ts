import { MinimalDeFiPosition } from 'src/types/defi';
import { MinimalToken } from 'src/types/tokens';

const ethereumChain = {
  chainId: 1,
  chainKey: 'ethereum' as const,
};

const baseChain = {
  chainId: 8453,
  chainKey: 'base' as const,
};

const tokenAddresses = {
  ETH: '0x0000000000000000000000000000000000000000',
  USDC_ETHEREUM: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  USDC_BASE: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  WBTC: '0x2260FAC5E5542a773Aa44fBCfeDd86a3D015C766',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
};

const assets = {
  USDC: {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    logo: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
    address: tokenAddresses.USDC_ETHEREUM,
    chain: ethereumChain,
  },
  WETH: {
    name: 'Wrapped Ether',
    symbol: 'WETH',
    decimals: 18,
    logo: 'https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png',
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    chain: ethereumChain,
  },
  ETH: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    logo: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
    address: tokenAddresses.ETH,
    chain: ethereumChain,
  },
  USDA: {
    name: 'USDA Stablecoin',
    symbol: 'USDA',
    decimals: 18,
    logo: 'https://strapi-staging.jumper.exchange/uploads/angle_cc79b057df.png',
    address: '0x0000206329b97db379d5e1bf586bbdb969c63274',
    chain: ethereumChain,
  },
};

const protocols = {
  morpho: {
    name: 'Morpho',
    product: 'metamorpho',
    version: '1.0.0',
    logo: 'https://strapi.jumper.exchange/uploads/morpho_eef0686ee3_2e4b8e06a6.png',
  },
  aaveLending: {
    name: 'Aave',
    product: 'lending',
    version: '3.0.0',
    logo: 'https://strapi-staging.jumper.exchange/uploads/aave_3a6741f1bd.png',
  },
  aaveBorrowing: {
    name: 'Aave',
    product: 'borrowing',
    version: '3.0.0',
    logo: 'https://strapi-staging.jumper.exchange/uploads/aave_3a6741f1bd.png',
  },
  angle: {
    name: 'Angle',
    product: 'dex',
    version: '2.1.0',
    logo: 'https://strapi-staging.jumper.exchange/uploads/angle_cc79b057df.png',
  },
  frax: {
    name: 'Frax',
    product: 'frax eth',
    version: '4.0.0',
    logo: 'https://strapi-staging.jumper.exchange/uploads/frax_0e286763eb.png',
  },
  lido: {
    name: 'Lido',
    product: 'liquid-staking',
    version: '2.0.0',
    logo: 'https://strapi-staging.jumper.exchange/uploads/lido_47c6f066b5.png',
  },
};

const lpTokens = {
  mUSDC: {
    name: 'Morpho USDC Vault',
    symbol: 'mUSDC',
    decimals: 18,
    logo: protocols.morpho.logo,
    address: '0x1234567890abcdef1234567890abcdef12345678',
    chain: ethereumChain,
  },
  aEthWETH: {
    name: 'Aave Ethereum WETH',
    symbol: 'aEthWETH',
    decimals: 18,
    logo: protocols.aaveLending.logo,
    address: '0x4d5f47fa6a74757f35c14fd3a6ef8e3c9bc514e8',
    chain: ethereumChain,
  },
  variableDebtEthUSDC: {
    name: 'Aave Ethereum Variable Debt USDC',
    symbol: 'variableDebtEthUSDC',
    decimals: 6,
    logo: protocols.aaveBorrowing.logo,
    address: '0x72e95b8931767c79ba4eee721354d6e99a61d004',
    chain: ethereumChain,
  },
  usdaUsdcLP: {
    name: 'Angle USDA-USDC LP',
    symbol: 'USDA-USDC-LP',
    decimals: 18,
    logo: protocols.angle.logo,
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    chain: ethereumChain,
  },
  frxETH: {
    name: 'Frax Ether',
    symbol: 'frxETH',
    decimals: 18,
    logo: protocols.frax.logo,
    address: '0x5e8422345238f34275888049021821e8e08caa1f',
    chain: ethereumChain,
  },
  stETH: {
    name: 'Lido Staked Ether',
    symbol: 'stETH',
    decimals: 18,
    logo: protocols.lido.logo,
    address: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
    chain: ethereumChain,
  },
};

const tags = {
  lending: ['Lending'],
  borrowing: ['Borrowing'],
  dex: ['Dex'],
  liquidStaking: ['Liquid Staking', 'Yield'],
};

const rewards = {
  none: [],
};

const latestData = {
  morphoUsdc: {
    date: '2025-11-07T00:00:00Z',
    tvlUsd: '125000000',
    tvlNative: '125000000',
    apy: {
      base: 8.5,
      reward: 0,
      total: 8.5,
    },
  },
  aaveWeth: {
    date: '2025-11-07T00:00:00Z',
    tvlUsd: '850000000',
    tvlNative: '245000',
    apy: {
      base: 2.8,
      reward: 0.5,
      total: 3.3,
    },
  },
  aaveUsdcBorrow: {
    date: '2025-11-07T00:00:00Z',
    tvlUsd: '350000000',
    tvlNative: '350000000',
    apy: {
      base: -5.2,
      reward: 0,
      total: -5.2,
    },
  },
  angleUsda: {
    date: '2025-11-07T00:00:00Z',
    tvlUsd: '45000000',
    tvlNative: '45000000',
    apy: {
      base: 4.2,
      reward: 8.5,
      total: 12.7,
    },
  },
  fraxEth: {
    date: '2025-11-07T00:00:00Z',
    tvlUsd: '380000000',
    tvlNative: '109000',
    apy: {
      base: 3.8,
      reward: 1.2,
      total: 5.0,
    },
  },
  lidoStEth: {
    date: '2025-11-07T00:00:00Z',
    tvlUsd: '12500000000',
    tvlNative: '3600000',
    apy: {
      base: 3.5,
      reward: 0,
      total: 3.5,
    },
  },
};

export const tokens: MinimalToken[] = [
  {
    address: tokenAddresses.ETH,
    chain: ethereumChain,
    symbol: 'ETH',
    balance: 5.25,
    totalPriceUSD: 18562.5,
  },
  {
    address: tokenAddresses.USDC_ETHEREUM,
    chain: ethereumChain,
    symbol: 'USDC',
    balance: 2.5,
    totalPriceUSD: 8625.3,
    relatedTokens: [
      {
        address: tokenAddresses.USDC_BASE,
        chain: baseChain,
        symbol: 'USDC',
        balance: 1.0,
        totalPriceUSD: 3450.12,
      },
    ],
  },
  {
    address: tokenAddresses.USDT,
    chain: ethereumChain,
    symbol: 'USDT',
    balance: 1.8,
    totalPriceUSD: 6210.24,
  },
  {
    address: tokenAddresses.WBTC,
    chain: ethereumChain,
    symbol: 'WBTC',
    balance: 0.15,
    totalPriceUSD: 9847.5,
  },
  {
    address: tokenAddresses.DAI,
    chain: ethereumChain,
    symbol: 'DAI',
    balance: 3.2,
    totalPriceUSD: 3211.84,
  },
];

export const defiPositions: MinimalDeFiPosition[] = [
  {
    name: 'Morpho USDC Vault',
    openedAt: '2025-11-07T00:00:00Z',
    asset: assets.USDC,
    protocol: protocols.morpho,
    url: 'https://app.morpho.org/vault',
    description:
      "Earn optimized yield on USDC through Morpho's MetaMorpho vaults with automated lending strategies.",
    tags: tags.lending,
    rewards: rewards.none,
    lpToken: lpTokens.mUSDC,
    slug: 'morpho-usdc-vault',
    featured: true,
    forYou: true,
    latest: latestData.morphoUsdc,
    balance: 2.5,
    totalPriceUSD: 8625.3,
  },
  {
    name: 'Aave V3 WETH',
    openedAt: '2025-11-07T00:00:00Z',
    asset: assets.WETH,
    protocol: protocols.aaveLending,
    url: 'https://app.aave.com',
    description:
      'Supply WETH to Aave V3 and earn interest while maintaining liquidity with your collateral.',
    tags: tags.lending,
    rewards: rewards.none,
    lpToken: lpTokens.aEthWETH,
    slug: 'aave-v3-weth',
    featured: true,
    forYou: false,
    latest: latestData.aaveWeth,
    balance: 1.8,
    totalPriceUSD: 6210.24,
    relatedPositions: [
      {
        name: 'Aave V3 USDC Borrow',
        asset: assets.USDC,
        protocol: protocols.aaveBorrowing,
        url: 'https://app.aave.com',
        description: 'Borrow USDC against your WETH collateral on Aave V3.',
        tags: tags.borrowing,
        rewards: rewards.none,
        lpToken: lpTokens.variableDebtEthUSDC,
        slug: 'aave-v3-usdc-borrow',
        featured: false,
        openedAt: '2025-09-07T00:00:00Z',
        forYou: false,
        latest: latestData.aaveUsdcBorrow,
        balance: 0.5,
        totalPriceUSD: 1725.06,
      },
    ],
  },
  {
    name: 'Angle USDA/USDC LP',
    openedAt: '2025-11-07T00:00:00Z',
    asset: assets.USDA,
    protocol: protocols.angle,
    url: 'https://app.angle.money',
    description:
      'Provide liquidity to the USDA/USDC pool and earn trading fees plus ANGLE rewards.',
    tags: tags.dex,
    rewards: rewards.none,
    lpToken: lpTokens.usdaUsdcLP,
    slug: 'angle-usda-usdc-lp',
    featured: false,
    forYou: true,
    latest: latestData.angleUsda,
    balance: 0.75,
    totalPriceUSD: 2587.5,
  },
  {
    name: 'Frax ETH Staking',
    openedAt: '2025-11-07T00:00:00Z',
    asset: assets.ETH,
    protocol: protocols.frax,
    url: 'https://app.frax.finance/frxeth/stake',
    description:
      'Stake ETH through Frax Finance to receive frxETH and earn staking rewards.',
    tags: tags.liquidStaking,
    rewards: rewards.none,
    lpToken: lpTokens.frxETH,
    slug: 'frax-eth-staking',
    featured: true,
    forYou: true,
    latest: latestData.fraxEth,
    balance: 3.2,
    totalPriceUSD: 11043.84,
  },
  {
    name: 'Lido Staked Ether',
    openedAt: '2025-11-07T00:00:00Z',
    asset: assets.ETH,
    protocol: protocols.lido,
    url: 'https://stake.lido.fi',
    description:
      'Stake ETH with Lido and receive stETH, maintaining liquidity while earning staking rewards.',
    tags: tags.liquidStaking,
    rewards: rewards.none,
    lpToken: lpTokens.stETH,
    slug: 'lido-staked-ether',
    featured: true,
    forYou: false,
    latest: latestData.lidoStEth,
    balance: 1.5,
    totalPriceUSD: 5175.18,
  },
];

export const tokenTinyAmounts: MinimalToken[] = [
  {
    address: tokenAddresses.ETH,
    chain: ethereumChain,
    symbol: 'ETH',
    balance: 5.25,
    totalPriceUSD: 0.0005,
  },
  {
    address: tokenAddresses.USDC_ETHEREUM,
    chain: ethereumChain,
    symbol: 'USDC',
    balance: 2.5,
    totalPriceUSD: 0.0001,
    relatedTokens: [
      {
        address: tokenAddresses.USDC_BASE,
        chain: baseChain,
        symbol: 'USDC',
        balance: 1.0,
        totalPriceUSD: 0.0001,
      },
    ],
  },
  {
    address: tokenAddresses.USDT,
    chain: ethereumChain,
    symbol: 'USDT',
    balance: 1.8,
    totalPriceUSD: 0.0001,
  },
  {
    address: tokenAddresses.WBTC,
    chain: ethereumChain,
    symbol: 'WBTC',
    balance: 0.15,
    totalPriceUSD: 0.0003,
  },
];
