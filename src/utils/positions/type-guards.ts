import type {
  ChainDefiPosition,
  AppDefiPosition,
  WalletPositions,
} from '@/types/jumper-backend';

export type DefiPosition = WalletPositions['data'][number];

export const isChainDefiPosition = (
  position: DefiPosition,
): position is ChainDefiPosition => position.source === 'chain';

export const isAppDefiPosition = (
  position: DefiPosition,
): position is AppDefiPosition => position.source === 'app';

export const getPositionGroupKey = (position: DefiPosition): string => {
  if (isChainDefiPosition(position)) {
    return `${position.protocol.name}-${position.chain.chainId}`;
  }
  return `${position.protocol.name}-app-${position.app.key}`;
};
