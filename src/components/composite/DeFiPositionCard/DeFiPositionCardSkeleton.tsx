import {
  EntityChainStackChainsPlacement,
  EntityChainStackVariant,
} from '../EntityChainStack/EntityChainStack.types';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import { EntityChainStack } from '../EntityChainStack/EntityChainStack';
import { StyledSummaryContent, StyledTagsRow } from './DeFiPositionCard.styles';
import { BadgeSkeleton } from 'src/components/Badge/BadgeSkeleton';
import { BadgeSize } from 'src/components/Badge/Badge.styles';
import { BaseSurfaceSkeleton } from 'src/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
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
