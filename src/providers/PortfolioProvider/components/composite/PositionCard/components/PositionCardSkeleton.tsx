import type { FC } from 'react';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { EntityStackWithBadge } from '../../EntityStackWithBadge/EntityStackWithBadge';
import { EntityStackBadgePlacement } from '../../EntityStackWithBadge/types';
import { StyledSummaryContent, StyledTagsRow } from '../PositionCard.styles';
import { BadgeSkeleton } from '@/components/Badge/BadgeSkeleton';
import { BadgeSize } from '@/components/Badge/Badge.styles';
import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import { COLUMN_SPACING } from '../constants';

export const PositionCardSkeleton: FC = () => {
  return (
    <StyledSummaryContent>
      <EntityStackWithBadge
        entities={[]}
        size={AvatarSize.XXL}
        badgeSize={AvatarSize.SM}
        placement={EntityStackBadgePlacement.Inline}
        spacing={{
          badge: COLUMN_SPACING.badge,
        }}
        isLoading
      />

      <StyledTagsRow>
        {Array.from({ length: 3 }).map((_, index) => (
          <BadgeSkeleton key={index} size={BadgeSize.MD} />
        ))}
        <BaseSurfaceSkeleton variant="rounded" sx={{ height: 24, width: 80 }} />
      </StyledTagsRow>
    </StyledSummaryContent>
  );
};
