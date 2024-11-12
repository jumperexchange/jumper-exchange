/**
 * @notice deprecated -- use directly from constants
 */

import { SupportedChainMap } from '../constants';

export const useSupportedChains = ({
  testnet = false,
}: {
  testnet?: boolean;
} = {}) => {
  const data = Object.values(SupportedChainMap)
    .filter((chain) => {
      if (testnet === true) {
        return true;
      } else {
        if (chain.testnet === undefined) {
          return true;
        } else {
          return chain.testnet === testnet;
        }
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return { data, map: SupportedChainMap };
};
