import type { FC } from 'react';
import { useMemo } from 'react';
import type { Address } from 'viem';
import { AvatarItem } from '@/components/core/AvatarStack/AvatarItem';
import { useChains } from '@/hooks/useChains';
import { useTokens } from '@/hooks/useTokens';
import type { EntityAvatarProps } from './types';
import {
  getEntityAvatarData,
  isChain,
  isTokensType,
  getTokenChainId,
} from './utils';

export const EntityAvatar: FC<EntityAvatarProps> = ({
  entity,
  size,
  disableBorder = false,
}) => {
  const { getChainById } = useChains();
  const { getToken } = useTokens();

  const avatarData = useMemo(() => {
    // Chain - needs logo resolution via useChains
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

    return getEntityAvatarData(entity);
  }, [entity, getChainById, getToken]);

  return <AvatarItem avatar={avatarData} size={size} />;
};
