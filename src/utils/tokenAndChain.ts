import type { Chain, ChainId, ExtendedChain, TokensResponse } from '@lifi/sdk';
import { zeroAddress } from 'viem';

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
  const chainTokens = tokens[chainId];
  if (!chainTokens) {
    return;
  }

  const filteredToken = chainTokens.find(
    (el) => el.symbol.toLowerCase() === symbol.toLowerCase(),
  );
  if (filteredToken) {
    return filteredToken;
  } else {
    console.error(
      `Token symbol ${symbol} is not available on chain ${chainId}`,
    );
  }
};

export const getTokenBySymbol = (
  tokens: TokensResponse['tokens'],
  symbol: string,
) => {
  return Object.values(tokens)
    .flat()
    .filter((el) => {
      return el.symbol.toLowerCase() === symbol.toLowerCase();
    });
};

export const getTokenByName = (
  tokens: TokensResponse['tokens'],
  name: string,
) => {
  return Object.values(tokens)
    .flat()
    .filter((el) => {
      return el.name.toLowerCase() === name.toLowerCase();
    });
};

export const getTokenByAddressOnSpecificChain = (
  tokens: TokensResponse['tokens'],
  chainId: number,
  address: string,
) => {
  const chainTokens = tokens[chainId];
  if (!chainTokens) {
    return;
  }

  const filteredToken = chainTokens.find(
    (el) => el.address.toLowerCase() === address.toLowerCase(),
  );
  if (filteredToken) {
    return filteredToken;
  } else {
    console.error(
      `Token address ${address} is not available on chain ${chainId}`,
    );
  }
};

// @Note: this works only for EVM chains
export const getNativeTokenForChain = (
  tokens: TokensResponse['tokens'],
  chainId: number,
) => {
  const chainTokens = tokens[chainId];
  if (!chainTokens) {
    return;
  }
  return chainTokens.find((token) => token.address === zeroAddress);
};
