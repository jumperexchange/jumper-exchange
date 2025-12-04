import type { ChainId, ExtendedChain } from '@lifi/sdk';
import type { Chain } from 'src/types/jumper-backend';
import { capitalizeString } from '../capitalizeString';

type GetChainByIdFn = (id: ChainId) => ExtendedChain | undefined;

export const getChainName = (
  chain: Chain,
  getChainById: GetChainByIdFn,
): string => {
  return (
    getChainById(chain.chainId)?.name ?? capitalizeString(chain.chainKey || '')
  );
};
