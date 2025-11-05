import { FC, useMemo } from 'react';
import { AvatarStack } from 'src/components/core/AvatarStack/AvatarStack';
import {
  AvatarSize,
  AvatarStackDirection,
} from 'src/components/core/AvatarStack/AvatarStack.types';
import { useTokens } from 'src/hooks/useTokens';

interface TokenStackProps {
  tokens: {
    address: string;
    chain: {
      chainId: number;
      chainKey: string;
    };
  }[];
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
      return {
        id: (_token?.address ?? token.address) + token.chain.chainId,
        src: _token?.logoURI || '',
        alt: _token?.name || '',
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
