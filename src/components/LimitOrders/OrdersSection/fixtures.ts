import type { LimitOrder } from './types';

const USDC: LimitOrder['fromToken'] = {
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  symbol: 'USDC',
  decimals: 6,
  priceUSD: '1.00',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
};

const UNI: LimitOrder['fromToken'] = {
  address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  symbol: 'UNI',
  decimals: 18,
  priceUSD: '3.31',
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png',
};

const WBTC: LimitOrder['fromToken'] = {
  address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  symbol: 'WBTC',
  decimals: 8,
  priceUSD: '63820',
};

const wstETH: LimitOrder['fromToken'] = {
  address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
  symbol: 'wstETH',
  decimals: 18,
  priceUSD: '2165',
};

const ARB: LimitOrder['fromToken'] = {
  address: '0x912ce59144191c1204e64559fe8253a0e49e6548',
  symbol: 'ARB',
  decimals: 18,
  priceUSD: '0.0851',
};

const OP: LimitOrder['fromToken'] = {
  address: '0x4200000000000000000000000000000000000042',
  symbol: 'OP',
  decimals: 18,
  priceUSD: '1.07',
};

const DAI: LimitOrder['fromToken'] = {
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  symbol: 'DAI',
  decimals: 18,
  priceUSD: '1.00',
};

const LINK: LimitOrder['fromToken'] = {
  address: '0x514910771af9ca656af840dff83e8264ecf986ca',
  symbol: 'LINK',
  decimals: 18,
  priceUSD: '8.04',
};

const ETH: LimitOrder['fromToken'] = {
  address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  symbol: 'ETH',
  decimals: 18,
  priceUSD: '1442',
};

const in4Days = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString();
const in3Days = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

export const sampleOrders: LimitOrder[] = [
  {
    id: 'order-1',
    protocol: '1inch',
    chainId: 42161,
    fromToken: UNI,
    toToken: USDC,
    sellAmount: '450000000000000000000',
    buyAmount: '1479260000',
    limitPrice: '3.29',
    marketPrice: '3.31',
    filledPercent: 37,
    status: 'active',
    expiresAt: in4Days,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'order-2',
    protocol: '1inch',
    chainId: 42161,
    fromToken: USDC,
    toToken: WBTC,
    sellAmount: '6000000000',
    buyAmount: '934700',
    limitPrice: '64191',
    marketPrice: '63820',
    filledPercent: 62,
    status: 'active',
    expiresAt: in3Days,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'order-3',
    protocol: '1inch',
    chainId: 42161,
    fromToken: USDC,
    toToken: wstETH,
    sellAmount: '3000000000',
    buyAmount: '1394500000000000000',
    limitPrice: '2151',
    filledPercent: 100,
    status: 'filled',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'order-4',
    protocol: 'cowswap',
    chainId: 100,
    fromToken: USDC,
    toToken: UNI,
    sellAmount: '2000000000',
    buyAmount: '742960000000000000000',
    limitPrice: '2.69',
    filledPercent: 0,
    status: 'cancelled',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'order-5',
    protocol: 'cowswap',
    chainId: 1,
    fromToken: USDC,
    toToken: LINK,
    sellAmount: '1500000000',
    buyAmount: '186980000000000000000',
    limitPrice: '8.02',
    filledPercent: 100,
    status: 'filled',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'order-6',
    protocol: '1inch',
    chainId: 42161,
    fromToken: USDC,
    toToken: ETH,
    sellAmount: '1600000000',
    buyAmount: '1111300000000000000',
    limitPrice: '1440',
    filledPercent: 0,
    status: 'expired',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'order-7',
    protocol: '1inch',
    chainId: 42161,
    fromToken: ARB,
    toToken: USDC,
    sellAmount: '2400000000000000000000',
    buyAmount: '204370000',
    limitPrice: '0.0852',
    filledPercent: 100,
    status: 'filled',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'order-8',
    protocol: 'cowswap',
    chainId: 10,
    fromToken: USDC,
    toToken: OP,
    sellAmount: '1000000000',
    buyAmount: '9350740000000000000000',
    limitPrice: '0.1069',
    filledPercent: 100,
    status: 'filled',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'order-9',
    protocol: '1inch',
    chainId: 1,
    fromToken: USDC,
    toToken: DAI,
    sellAmount: '5000000000',
    buyAmount: '4999660000000000000000',
    limitPrice: '0.9999',
    filledPercent: 100,
    status: 'filled',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'order-10',
    protocol: '1inch',
    chainId: 42161,
    fromToken: ARB,
    toToken: USDC,
    sellAmount: '2400000000000000000000',
    buyAmount: '204370000',
    limitPrice: '0.0852',
    filledPercent: 100,
    status: 'filled',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'order-11',
    protocol: 'cowswap',
    chainId: 10,
    fromToken: USDC,
    toToken: OP,
    sellAmount: '1000000000',
    buyAmount: '9350740000000000000000',
    limitPrice: '0.1069',
    filledPercent: 100,
    status: 'filled',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'order-12',
    protocol: '1inch',
    chainId: 1,
    fromToken: USDC,
    toToken: DAI,
    sellAmount: '5000000000',
    buyAmount: '4999660000000000000000',
    limitPrice: '0.9999',
    filledPercent: 100,
    status: 'filled',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
];