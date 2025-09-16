import { FC } from 'react';
import {
  BaseSkeleton,
  CompactEarnCardContentContainer,
  CompactEarnCardHeaderContainer,
  CompactEarnCardTagContainer,
  CompactEarnCardContainer,
} from '../EarnCard.styles';
import { BadgeSize } from 'src/components/Badge/Badge.styles';
import { BadgeSkeleton } from 'src/components/Badge/BadgeSkeleton';
import { EntityChainStack } from 'src/components/composite/EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from 'src/components/composite/EntityChainStack/EntityChainStack.types';

export const CompactEarnCardSkeleton: FC<{}> = ({}) => {
  return (
    <CompactEarnCardContainer>
      <CompactEarnCardHeaderContainer direction="row">
        <CompactEarnCardTagContainer direction="row">
          <BadgeSkeleton size={BadgeSize.SM} width={96} />
        </CompactEarnCardTagContainer>
        <BaseSkeleton variant="circular" width={48} height={48} />
      </CompactEarnCardHeaderContainer>
      <CompactEarnCardContentContainer>
        <EntityChainStack
          variant={EntityChainStackVariant.Protocol}
          isLoading
        />
        <BaseSkeleton
          variant="rounded"
          sx={{ height: 76, width: '100%', borderRadius: 2 }}
        />
        <BaseSkeleton
          variant="rounded"
          sx={{ height: 76, width: '100%', borderRadius: 2 }}
        />
      </CompactEarnCardContentContainer>
    </CompactEarnCardContainer>
  );
};
