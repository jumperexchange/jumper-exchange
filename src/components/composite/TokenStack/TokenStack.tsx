import type { FC } from 'react';
import { useMemo } from 'react';
import { AvatarStack } from 'src/components/core/AvatarStack/AvatarStack';
import type {
  AvatarSize,
  AvatarStackDirection,
} from 'src/components/core/AvatarStack/AvatarStack.types';
import { useTokens } from 'src/hooks/useTokens';
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
  const { getTokenByAddressAndChain } = useTokens();
  const enhancedTokens = useMemo(() => {
    return tokens.map((token) => {
      const _token = getTokenByAddressAndChain(
        token.address,
        token.chain.chainId,
      );

      const id = token.address + token.chain.chainId;
      const src = _token?.logoURI || token.logoURI;
      const alt = token.name || token.symbol || token.address;
      return {
        id,
        src,
        alt,
      };
    });
  }, [tokens, getTokenByAddressAndChain]);

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
