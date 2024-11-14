import type { ChainId } from '@lifi/sdk';
import { ChainType, getChains } from '@lifi/sdk';

export async function fetchChainData(chainId: string | null) {
  if (!chainId) {
    return null;
  }
  try {
    const chainsData = await getChains({
      chainTypes: [ChainType.EVM, ChainType.SVM],
    });
    return chainsData.find(
      (chainEl) => chainEl.id === (parseInt(chainId) as ChainId),
    );
  } catch (error) {
    console.error(`Error fetching chain data: ${error}`);
    return null;
  }
}
