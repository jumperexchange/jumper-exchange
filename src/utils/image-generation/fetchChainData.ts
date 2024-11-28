import type { ChainId } from '@lifi/sdk';
import { ChainType, getChains } from '@lifi/sdk';
import { getChainById } from '../tokenAndChain';

export async function fetchChainData(chainId: ChainId | null) {
  if (!chainId) {
    return null;
  }
  try {
    const chainsData = await getChains({
      chainTypes: [ChainType.EVM, ChainType.SVM],
    });
    return getChainById(chainsData, chainId as ChainId);
  } catch (error) {
    console.error(`Error fetching chain data: ${error}`);
    return null;
  }
}
