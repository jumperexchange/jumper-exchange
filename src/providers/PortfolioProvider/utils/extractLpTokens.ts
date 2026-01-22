import { compact, flatMap } from 'lodash';
import type { DefiPosition } from '@/types/jumper-backend';

export interface LpTokenIdentifier {
  address: string;
  chainId: number;
}

export const extractLpTokens = (
  positions: DefiPosition[],
): LpTokenIdentifier[] => {
  return compact(
    flatMap(positions, (position) =>
      position.lpToken?.address && position.lpToken?.chain.chainId
        ? {
            address: position.lpToken.address,
            chainId: position.lpToken.chain.chainId,
          }
        : null,
    ),
  );
};
