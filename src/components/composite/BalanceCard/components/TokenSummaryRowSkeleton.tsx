import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { EntityStackWithBadge } from '../../EntityStackWithBadge/EntityStackWithBadge';
import { TitleWithHintSkeleton } from '@/components/composite/TitleWithHint/TitleWithHintSkeleton';

export const TokenSummaryRowSkeleton = () => (
  <>
    <EntityStackWithBadge
      entities={[]}
      size={AvatarSize.XXL}
      badgeSize={AvatarSize.SM}
      spacing={{ badge: -0.5 }}
      isLoading
    />
    <TitleWithHintSkeleton />
  </>
);
