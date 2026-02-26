import type { Chain, ChainId, ExtendedChain, TokensResponse } from '@lifi/sdk';

export const getChainById = (chains: ExtendedChain[], id: ChainId) => {
  if (!chains.length || !id) {
    return;
  }
  const filteredChain = chains.find((el: Chain) => el.id === id);
  if (filteredChain) {
    return filteredChain;
  } else {
    console.error(`ChainID ${id} is not available`);
  }
};

export const getChainByName = (chains: ExtendedChain[], name: string) => {
  const filteredChain = chains.find(
    (el: Chain) => el.name.toLowerCase() === name.toLowerCase(),
  );
  if (filteredChain) {
    return filteredChain;
  } else {
    console.error(`Chain name ${name} is not available`);
  }
};

export const getTokenBySymbolOnSpecificChain = (
  tokens: TokensResponse['tokens'],
  chainId: number,
  symbol: string,
) => {
  const chainTokens = tokens[chainId] ?? [];
  const filteredToken = chainTokens.find(
    (el) => el.symbol.toLowerCase() === symbol.toLowerCase(),
  );
  return filteredToken;
};
