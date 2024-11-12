import {
  sepolia as ethereumSepolia,
  mainnet as ethereumMainnet,
  arbitrumSepolia,
  arbitrum as arbitrumOne,
  baseSepolia,
  base,
} from 'viem/chains';
import { type Chain } from 'viem/chains';

export type SupportedChain = Chain & {
  image: string;
  symbol: string;
};

const EthereumSepolia = {
  ...ethereumSepolia,
  image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  symbol: 'SETH',
};

const EthereumMainnet = {
  ...ethereumMainnet,
  image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  symbol: 'ETH',
};

const ArbitrumSepolia = {
  ...arbitrumSepolia,
  image: 'https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg',
  symbol: 'SARB',
};

const ArbitrumOne = {
  ...arbitrumOne,
  image: 'https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg',
  symbol: 'ARB',
};

const BaseSepolia = {
  ...baseSepolia,
  image: 'https://icons.llamao.fi/icons/chains/rsz_base.jpg',
  symbol: 'SBASE',
};

export const Base = {
  ...base,
  image: 'https://icons.llamao.fi/icons/chains/rsz_base.jpg',
  symbol: 'BASE',
};

export const SupportedChainMap: Record<number, SupportedChain> = {
  [ethereumSepolia.id]: EthereumSepolia,
  [ethereumMainnet.id]: EthereumMainnet,
  [arbitrumSepolia.id]: ArbitrumSepolia,
  [arbitrumOne.id]: ArbitrumOne,
  [baseSepolia.id]: BaseSepolia,
  [base.id]: Base,
};

export const SupportedChainlist = Object.values(SupportedChainMap);
