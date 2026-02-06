import { EntityChainStack } from '@/components/composite/EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from '@/components/composite/EntityChainStack/EntityChainStack.types';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import type { ExtendedToken } from '@/types/tokens';

interface TokenAmountInputAvatarProps {
  token: ExtendedToken;
}

export const TokenAmountInputAvatar = ({
  token,
}: TokenAmountInputAvatarProps) => {
  return (
    <EntityChainStack
      variant={EntityChainStackVariant.Tokens}
      tokens={[
        {
          ...token,
          chain: {
            chainId: token.chainId,
            chainKey: token.chainId.toString(),
          },
        },
      ]}
      tokensSize={AvatarSize.XL}
      chainsSize={AvatarSize.XXS}
      isContentVisible={false}
    />
  );
};
