import type { ChainId, Token } from '@lifi/sdk';

export const sortTokensByChainId = (chainId: ChainId, chains: Token[]) =>
  chains.find((el) => el.chainId === chainId);
