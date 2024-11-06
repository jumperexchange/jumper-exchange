import { type SupportedChain, SupportedChainMap } from '../constants';

const getSupportedChain = (
  chainId: number | undefined,
): SupportedChain | undefined => {
  if (!chainId) {
    return undefined;
  }

  const chain = SupportedChainMap[chainId];

  if (chain) {
    return chain;
  } else {
    return undefined;
  }
};

export { getSupportedChain };
