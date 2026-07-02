import type { TokenDto } from '@/types/jumper-backend';
import type { PortfolioTransaction, TransactionBalance } from './types';

const createToken = (
  address: string,
  name: string,
  symbol: string,
  decimals: number,
  logoURI: string,
  chainId: number,
  coinKey: TokenDto['coinKey'],
): TokenDto => ({
  address,
  name,
  symbol,
  decimals,
  logoURI,
  chainId,
  coinKey,
  priceUSD: '0',
});

const createBalance = (
  token: TokenDto,
  amount: number,
  amountUsd: number,
): TransactionBalance => ({
  token,
  amount,
  amountUsd,
});

const ethEthereum = createToken(
  '0x0000000000000000000000000000000000000000',
  'Ethereum',
  'ETH',
  18,
  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
  1,
  'ETH',
);

const usdcEthereum = createToken(
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  'USD Coin',
  'USDC',
  6,
  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  1,
  'USDC',
);

const usdcArbitrum = createToken(
  '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
  'USD Coin',
  'USDC',
  6,
  'https://static.debank.com/image/arb_token/logo_url/0xaf88d065e77c8cc2239327c5edb3a432268e5831/fffcd27b9efff5a86ab942084c05924d.png',
  42161,
  'USDC',
);

const wethBase = createToken(
  '0x4200000000000000000000000000000000000006',
  'Wrapped Ether',
  'WETH',
  18,
  'https://static.debank.com/image/eth_token/logo_url/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/61844453e63cf81301f845d7864236f6.png',
  8453,
  'WETH',
);

const uniswapProtocol = {
  name: 'Uniswap V3',
  icon: 'https://static.debank.com/image/project/logo_url/uniswap3/173f61651376c00448deb3979bf4a5c8.png',
};

const aerodromeProtocol = {
  name: 'Aerodrome',
  icon: 'https://static.debank.com/image/project/logo_url/aerodrome/6cccf24f9f1f24a4c5b5c15e26aca87f.png',
};

export const mockTradeTransaction: PortfolioTransaction = {
  fromBalances: [createBalance(ethEthereum, 0.42, 1250.42)],
  toBalances: [createBalance(usdcEthereum, 1250.42, 1250.42)],
  action: 'trade',
  fee: { token: ethEthereum, amount: 0.0012, amountUsd: 3.58 },
  time: '2025-06-10T14:32:00.000Z',
  txHash: '0xabc123def4567890abc123def4567890abc123def4567890abc123def4567890',
  chainId: 1,
  protocol: uniswapProtocol,
};

export const mockSendTransaction: PortfolioTransaction = {
  fromBalances: [createBalance(usdcArbitrum, 500, 500)],
  toBalances: [],
  action: 'send',
  fee: { token: ethEthereum, amount: 0.0003, amountUsd: 0.89 },
  time: '2025-06-08T09:15:00.000Z',
  txHash: '0xdef456abc7890123def456abc7890123def456abc7890123def456abc7890123',
  chainId: 42161,
  protocol: {},
};

export const mockReceiveTransaction: PortfolioTransaction = {
  fromBalances: [],
  toBalances: [createBalance(usdcEthereum, 101.45, 101.45)],
  action: 'receive',
  fee: null,
  time: '2025-06-05T18:45:00.000Z',
  txHash: '0x789012def456abc3789012def456abc3789012def456abc3789012def456abc3',
  chainId: 1,
  protocol: {},
};

export const mockMultiTokenTradeTransaction: PortfolioTransaction = {
  fromBalances: [
    createBalance(wethBase, 0.65, 1965.31),
    createBalance(usdcArbitrum, 882.6, 882.6),
  ],
  toBalances: [
    createBalance(usdcEthereum, 1500, 1500),
    createBalance(ethEthereum, 0.38, 1347.91),
  ],
  action: 'trade',
  fee: { token: wethBase, amount: 0.00045, amountUsd: 1.34 },
  time: '2025-06-01T11:20:00.000Z',
  txHash: '0x456789abc012def3456789abc012def3456789abc012def3456789abc012def3',
  chainId: 8453,
  protocol: aerodromeProtocol,
};

export const mockTransactions = [
  mockTradeTransaction,
  mockSendTransaction,
  mockReceiveTransaction,
  mockMultiTokenTradeTransaction,
];
