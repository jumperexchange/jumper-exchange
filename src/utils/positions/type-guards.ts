import type {
  ChainDefiPosition,
  AppDefiPosition,
} from '@/types/jumper-backend';

export type DefiPosition =
  | ({ source: 'chain' } & ChainDefiPosition)
  | ({ source: 'app' } & AppDefiPosition);

export const isChainDefiPosition = (
  position: DefiPosition,
): position is { source: 'chain' } & ChainDefiPosition =>
  position.source === 'chain';

export const isAppDefiPosition = (
  position: DefiPosition,
): position is { source: 'app' } & AppDefiPosition => position.source === 'app';

export const getPositionGroupKey = (position: DefiPosition): string => {
  if (isChainDefiPosition(position)) {
    return `${position.protocol.name}-${position.chain.chainId}`;
  }
  return `${position.protocol.name}-app-${position.app.key}`;
};
