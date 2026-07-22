import type { LimitOrder as Order, TokenDto } from '@/types/jumper-backend';

import { addDays, subDays, getUnixTime } from 'date-fns';
const MAKER_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

const daysFromNow = (days: number): number =>
  getUnixTime(addDays(new Date(), days));
const daysAgo = (days: number): number =>
  getUnixTime(subDays(new Date(), days));

const createToken = (
  chainId: number,
  token: Omit<TokenDto, 'chainId'>,
): TokenDto => ({
  chainId,
  ...token,
});

const createOrder = (
  order: Omit<Order, 'fromAddress'> & { fromAddress?: string },
): Order => ({
  ...order,
  fromAddress: order.fromAddress ?? MAKER_ADDRESS,
});

const filledFromAmount = (fromAmount: string, percent: number): string => {
  const total = BigInt(fromAmount);
  return ((total * BigInt(Math.round(percent * 100))) / 10000n).toString();
};

const filledToAmount = (toAmount: string, percent: number): string => {
  const total = BigInt(toAmount);
  return ((total * BigInt(Math.round(percent * 100))) / 10000n).toString();
};

const USDC = (chainId: number): TokenDto =>
  createToken(chainId, {
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    coinKey: 'USDC',
    priceUSD: '1.00',
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  });

const UNI = (chainId: number): TokenDto =>
  createToken(chainId, {
    address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    symbol: 'UNI',
    name: 'Uniswap',
    decimals: 18,
    priceUSD: '3.31',
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png',
  });

const WBTC = (chainId: number): TokenDto =>
  createToken(chainId, {
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    coinKey: 'WBTC',
    priceUSD: '63820',
  });

const wstETH = (chainId: number): TokenDto =>
  createToken(chainId, {
    address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
    symbol: 'wstETH',
    name: 'Wrapped stETH',
    decimals: 18,
    coinKey: 'WETH',
    priceUSD: '2165',
  });

const ARB = (chainId: number): TokenDto =>
  createToken(chainId, {
    address: '0x912ce59144191c1204e64559fe8253a0e49e6548',
    symbol: 'ARB',
    name: 'Arbitrum',
    decimals: 18,
    priceUSD: '0.0851',
  });

const OP = (chainId: number): TokenDto =>
  createToken(chainId, {
    address: '0x4200000000000000000000000000000000000042',
    symbol: 'OP',
    name: 'Optimism',
    decimals: 18,
    priceUSD: '1.07',
  });

const DAI = (chainId: number): TokenDto =>
  createToken(chainId, {
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    coinKey: 'DAI',
    priceUSD: '1.00',
  });

const LINK = (chainId: number): TokenDto =>
  createToken(chainId, {
    address: '0x514910771af9ca656af840dff83e8264ecf986ca',
    symbol: 'LINK',
    name: 'Chainlink',
    decimals: 18,
    priceUSD: '8.04',
  });

const ETH = (chainId: number): TokenDto =>
  createToken(chainId, {
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    symbol: 'ETH',
    name: 'Ether',
    decimals: 18,
    coinKey: 'ETH',
    priceUSD: '1442',
  });

export const sampleOrders: Order[] = [
  createOrder({
    orderId: 'order-1',
    tool: '1inch',
    chainId: 42161,
    fromToken: UNI(42161),
    toToken: USDC(42161),
    fromAmount: '450000000000000000000',
    toAmount: '1479260000',
    filledFromAmount: filledFromAmount('450000000000000000000', 37),
    filledToAmount: filledToAmount('1479260000', 37),
    status: 'active',
    orderType: 'partial_fill',
    validUntil: daysFromNow(4),
    createdAt: daysAgo(2),
  }),
  createOrder({
    orderId: 'order-2',
    tool: '1inch',
    chainId: 42161,
    fromToken: USDC(42161),
    toToken: WBTC(42161),
    fromAmount: '6000000000',
    toAmount: '9347000',
    filledFromAmount: filledFromAmount('6000000000', 62),
    filledToAmount: filledToAmount('9347000', 62),
    status: 'active',
    orderType: 'partial_fill',
    validUntil: daysFromNow(3),
    createdAt: daysAgo(1),
  }),
  createOrder({
    orderId: 'order-3',
    tool: '1inch',
    chainId: 42161,
    fromToken: USDC(42161),
    toToken: wstETH(42161),
    fromAmount: '3000000000',
    toAmount: '1394500000000000000',
    filledFromAmount: '3000000000',
    filledToAmount: '1394500000000000000',
    status: 'filled',
    validUntil: daysFromNow(1),
    createdAt: daysAgo(5),
    filledAt: daysAgo(4),
    orderType: 'fill_or_kill',
  }),
  createOrder({
    orderId: 'order-4',
    tool: 'cowswap',
    chainId: 100,
    fromToken: USDC(100),
    toToken: UNI(100),
    fromAmount: '2000000000',
    toAmount: '742960000000000000000',
    filledFromAmount: '0',
    filledToAmount: '0',
    status: 'cancelled',
    orderType: 'partial_fill',
    validUntil: daysFromNow(2),
    createdAt: daysAgo(3),
  }),
  createOrder({
    orderId: 'order-5',
    tool: 'cowswap',
    chainId: 1,
    fromToken: USDC(1),
    toToken: LINK(1),
    fromAmount: '1500000000',
    toAmount: '186980000000000000000',
    filledFromAmount: '1500000000',
    filledToAmount: '186980000000000000000',
    status: 'filled',
    validUntil: daysFromNow(1),
    createdAt: daysAgo(7),
    filledAt: daysAgo(6),
    orderType: 'fill_or_kill',
  }),
  createOrder({
    orderId: 'order-6',
    tool: '1inch',
    chainId: 42161,
    fromToken: USDC(42161),
    toToken: ETH(42161),
    fromAmount: '1600000000',
    toAmount: '1111300000000000000',
    filledFromAmount: '0',
    filledToAmount: '0',
    status: 'expired',
    orderType: 'partial_fill',
    validUntil: daysAgo(1),
    createdAt: daysAgo(10),
  }),
  createOrder({
    orderId: 'order-7',
    tool: '1inch',
    chainId: 42161,
    fromToken: ARB(42161),
    toToken: USDC(42161),
    fromAmount: '2400000000000000000000',
    toAmount: '204370000',
    filledFromAmount: '2400000000000000000000',
    filledToAmount: '204370000',
    status: 'filled',
    validUntil: daysFromNow(1),
    createdAt: daysAgo(4),
    filledAt: daysAgo(3),
    orderType: 'fill_or_kill',
  }),
  createOrder({
    orderId: 'order-8',
    tool: 'cowswap',
    chainId: 10,
    fromToken: USDC(10),
    toToken: OP(10),
    fromAmount: '1000000000',
    toAmount: '9350740000000000000000',
    filledFromAmount: '1000000000',
    filledToAmount: '9350740000000000000000',
    status: 'filled',
    validUntil: daysFromNow(1),
    createdAt: daysAgo(6),
    filledAt: daysAgo(5),
    orderType: 'fill_or_kill',
  }),
  createOrder({
    orderId: 'order-9',
    tool: '1inch',
    chainId: 1,
    fromToken: USDC(1),
    toToken: DAI(1),
    fromAmount: '5000000000',
    toAmount: '4999660000000000000000',
    filledFromAmount: '5000000000',
    filledToAmount: '4999660000000000000000',
    status: 'filled',
    validUntil: daysFromNow(1),
    createdAt: daysAgo(8),
    filledAt: daysAgo(7),
    orderType: 'fill_or_kill',
  }),
  createOrder({
    orderId: 'order-10',
    tool: '1inch',
    chainId: 42161,
    fromToken: ARB(42161),
    toToken: USDC(42161),
    fromAmount: '2400000000000000000000',
    toAmount: '204370000',
    filledFromAmount: '2400000000000000000000',
    filledToAmount: '204370000',
    status: 'filled',
    validUntil: daysFromNow(1),
    createdAt: daysAgo(4),
    filledAt: daysAgo(3),
    orderType: 'fill_or_kill',
  }),
  createOrder({
    orderId: 'order-11',
    tool: 'cowswap',
    chainId: 10,
    fromToken: USDC(10),
    toToken: OP(10),
    fromAmount: '1000000000',
    toAmount: '9350740000000000000000',
    filledFromAmount: '1000000000',
    filledToAmount: '9350740000000000000000',
    status: 'filled',
    validUntil: daysFromNow(1),
    createdAt: daysAgo(6),
    filledAt: daysAgo(5),
    orderType: 'fill_or_kill',
  }),
  createOrder({
    orderId: 'order-12',
    tool: '1inch',
    chainId: 1,
    fromToken: USDC(1),
    toToken: DAI(1),
    fromAmount: '5000000000',
    toAmount: '4999660000000000000000',
    filledFromAmount: '5000000000',
    filledToAmount: '4999660000000000000000',
    status: 'filled',
    validUntil: daysFromNow(1),
    createdAt: daysAgo(8),
    filledAt: daysAgo(7),
    orderType: 'fill_or_kill',
  }),
];
