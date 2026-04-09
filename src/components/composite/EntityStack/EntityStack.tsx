import type { FC } from 'react';
import { useMemo } from 'react';
import type { Address } from 'viem';
import { AvatarStack } from '@/components/core/AvatarStack/AvatarStack';
import type { AvatarData } from '@/components/core/AvatarStack/AvatarStack.types';
import { useChains } from '@/hooks/useChains';
import { useTokens } from '@/hooks/useTokens';
import type { EntityStackProps } from './types';
import {
  getEntityAvatarData,
  isChain,
  isTokensType,
  getTokenChainId,
  isBackendToken,
} from '../EntityAvatar/utils';

export const EntityStack: FC<EntityStackProps> = ({
  entities,
  size,
  spacing = -1,
  direction = 'row',
  limit,
  disableBorder = false,
  useAvatarOverflow = false,
  avatarSx,
}) => {
  const { getChainById } = useChains();
  const { getToken } = useTokens();

  const avatars = useMemo<AvatarData[]>(() => {
    return entities.map((entity) => {
      // Chain - resolve via useChains
      if (isChain(entity)) {
        const extendedChain = getChainById(entity.chainId);
        return {
          id: entity.chainId.toString(),
          src: extendedChain?.logoURI,
          alt: extendedChain?.name ?? entity.chainKey,
        };
      }

      // Token types - use logoURI with fallback from useTokens
      if (isTokensType(entity)) {
        const chainId = getTokenChainId(entity);
        const fallbackToken = chainId
          ? getToken(chainId, entity.address as Address)
          : undefined;

        return {
          id: `${entity.address}-${chainId ?? 'unknown'}`,
          src: entity.logoURI ?? fallbackToken?.logoURI,
          alt: entity.name || entity.symbol || entity.address,
        };
      }

      if (isBackendToken(entity)) {
        const chainId = entity.chain.chainId;
        const fallbackToken = chainId
          ? getToken(chainId, entity.address as Address)
          : undefined;

        return {
          id: `${entity.address}-${chainId ?? 'unknown'}`,
          src: entity.logo ?? fallbackToken?.logoURI,
          alt: entity.name || entity.symbol || entity.address,
        };
      }

      return getEntityAvatarData(entity);
    });
  }, [entities, getChainById, getToken]);

  return (
    <AvatarStack
      avatars={avatars}
      size={size}
      spacing={spacing}
      direction={direction}
      limit={limit}
      disableBorder={disableBorder}
      avatarSx={avatarSx}
      useAvatarOverflow={useAvatarOverflow}
    />
  );
};
