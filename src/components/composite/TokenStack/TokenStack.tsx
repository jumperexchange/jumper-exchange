import { type FC, useMemo } from 'react';
import type { Address } from 'viem';

import { AvatarStack } from '@/components/core/AvatarStack/AvatarStack';
import type {
  AvatarSize,
  AvatarStackDirection,
} from '@/components/core/AvatarStack/AvatarStack.types';
import { useTokens } from '@/hooks/useTokens';

import type { TokenStackToken } from './types';

interface TokenStackProps {
  tokens: TokenStackToken[];
  size?: AvatarSize;
  spacing?: number;
  direction?: AvatarStackDirection;
  limit?: number;
}

export const TokenStack: FC<TokenStackProps> = ({
  tokens,
  size,
  spacing = -1.5,
  direction = 'row',
  limit,
}) => {
  const { getToken } = useTokens();
  const enhancedTokens = useMemo(() => {
    return tokens.map((token) => {
      const tokenInner = getToken(
        token.chain.chainId,
        token.address as Address,
      );

      return {
        id: (tokenInner?.address ?? token.address) + token.chain.chainId,
        src: tokenInner?.logoURI || token.logoURI,
        alt: token.name || token.symbol || token.address,
      };
    });
  }, [tokens, getToken]);

  return (
    <AvatarStack
      avatars={enhancedTokens}
      size={size}
      spacing={spacing}
      direction={direction}
      disableBorder
      limit={limit}
    />
  );
};
