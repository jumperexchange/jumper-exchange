import { FC } from 'react';
import {
  BaseSkeleton,
  OverviewEarnCardContainer,
  OverviewEarnCardHeaderContainer,
  OverviewEarnCardContentContainer,
} from '../EarnCard.styles';
import { BadgeSize } from 'src/components/Badge/Badge.styles';
import { BadgeSkeleton } from 'src/components/Badge/BadgeSkeleton';
import { EarnCardProps } from '../EarnCard.types';

export const OverviewEarnSkeleton: FC<Pick<EarnCardProps, 'fullWidth'>> = ({
  fullWidth,
}) => {
  return (
    <OverviewEarnCardContainer sx={{ maxWidth: fullWidth ? '100%' : 408 }}>
      <OverviewEarnCardContentContainer>
        <OverviewEarnCardHeaderContainer>
          <BaseSkeleton variant="rounded" sx={{ height: 24, width: 124 }} />
          <BadgeSkeleton size={BadgeSize.SM} width={96} />
        </OverviewEarnCardHeaderContainer>
        {Array.from({ length: 3 }).map((_, index) => (
          <BaseSkeleton
            key={index}
            variant="rounded"
            sx={{ height: 52, width: '100%', borderRadius: 2 }}
          />
        ))}
      </OverviewEarnCardContentContainer>
    </OverviewEarnCardContainer>
  );
};
