import {
  EntityChainStackChainsPlacement,
  EntityChainStackVariant,
} from '@/components/composite/EntityChainStack/EntityChainStack.types';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { EntityChainStack } from '@/components/composite/EntityChainStack/EntityChainStack';
import { StyledSummaryContent, StyledTagsRow } from './DeFiPositionCard.styles';
import { BadgeSkeleton } from '@/components/Badge/BadgeSkeleton';
import { BadgeSize } from '@/components/Badge/Badge.styles';
import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import { COLUMN_SPACING } from './constants';

export const DeFiPositionCardSkeleton = ({}) => {
  const protocolSize = AvatarSize.XXL;
  const chainsSize = AvatarSize.SM;

  return (
    <StyledSummaryContent>
      <EntityChainStack
        variant={EntityChainStackVariant.Protocol}
        protocolSize={protocolSize}
        chainsPlacement={EntityChainStackChainsPlacement.Inline}
        chainsSize={chainsSize}
        spacing={COLUMN_SPACING}
        isLoading
      />

      <StyledTagsRow>
        {Array.from({ length: 5 }).map((_, index) => (
          <BadgeSkeleton key={index} size={BadgeSize.MD} />
        ))}
        <BaseSurfaceSkeleton
          variant="circular"
          sx={{ height: 40, width: 40 }}
        />
      </StyledTagsRow>
    </StyledSummaryContent>
  );
};
