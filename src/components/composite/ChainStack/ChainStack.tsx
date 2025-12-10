import { FC, useMemo } from 'react';
import { useChains } from 'src/hooks/useChains';
import { AvatarStack } from '../../core/AvatarStack/AvatarStack';
import {
  AvatarSize,
  AvatarStackDirection,
} from '../../core/AvatarStack/AvatarStack.types';

interface ChainStackProps {
  chainIds: string[];
  size?: AvatarSize;
  limit?: number;
  spacing?: number;
  direction?: AvatarStackDirection;
  disableBorder?: boolean;
}

// @TODO use this for the missions cards
export const ChainStack: FC<ChainStackProps> = ({
  chainIds,
  size,
  limit,
  spacing = -1.5,
  direction = 'row',
  disableBorder = false,
}) => {
  const { getChainById } = useChains();
  const enhancedChains = useMemo(() => {
    return chainIds.map((chainId) => {
      const chain = getChainById(Number(chainId));
      return {
        id: chainId,
        src: chain?.logoURI || '',
        alt: chain?.name || '',
      };
    });
  }, [chainIds, getChainById]);

  return (
    <AvatarStack
      avatars={enhancedChains}
      size={size}
      limit={limit}
      spacing={spacing}
      direction={direction}
      disableBorder={disableBorder}
    />
  );
};
