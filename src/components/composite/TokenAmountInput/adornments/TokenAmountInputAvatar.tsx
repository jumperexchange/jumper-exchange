import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import type { PricedToken } from '@/types/tokens';
import { EntityStackWithBadge } from '@/components/composite/EntityStackWithBadge/EntityStackWithBadge';

interface TokenAmountInputAvatarProps {
  token: PricedToken;
}

export const TokenAmountInputAvatar = ({
  token,
}: TokenAmountInputAvatarProps) => {
  return (
    <EntityStackWithBadge
      entities={[token]}
      badgeEntities={[
        {
          chainId: token.chainId,
          chainKey: token.chainId.toString(),
        },
      ]}
      size={AvatarSize.XL}
      badgeSize={AvatarSize.XXS}
      isContentVisible={false}
    />
  );
};
