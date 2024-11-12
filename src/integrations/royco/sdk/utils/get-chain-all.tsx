/**
 * @notice deprecated
 */

import * as all from 'viem/chains';
import type { Chain } from 'viem/chains';

const { ...chains } = all;

/**
 * @description Gets the chain object for the given chain id.
 * @see {@link https://github.com/wevm/viem/discussions/418#discussioncomment-5740428}
 * @param chainId - Chain id of the target EVM chain.
 * @returns Viem's chain object.
 */
const getChain = (chainId: number): Chain => {
  for (const chain of Object.values(chains)) {
    if (chain.id === chainId) {
      return chain;
    }
  }

  throw new Error(`Chain with id ${chainId} not found`);
};

export { getChain };
