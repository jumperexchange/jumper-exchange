import { SectionCard } from '@/components/Cards/SectionCard/SectionCard';
import { PortfolioFilterBarSkeleton } from '@/components/PortfolioFilterBar/PortfolioFilterBarSkeleton';
import {
  PortfolioAssetContainer,
  PortfolioAssetsListContainer,
} from './PortfolioPage.styles';
import { TokenListCardTokenSize } from '@/components/composite/TokenListCard/TokenListCard.types';
import { TokenListCardSkeleton } from '@/components/composite/TokenListCard/TokenListCardSkeleton';

export const PortfolioAssetsSectionSkeleton = () => {
  return (
    <SectionCard>
      <PortfolioFilterBarSkeleton />
      <PortfolioAssetsListContainer useFlexGap direction="column">
        {Array.from({ length: 3 }).map((_, index) => (
          <PortfolioAssetContainer key={index}>
            <TokenListCardSkeleton size={TokenListCardTokenSize.MD} />
          </PortfolioAssetContainer>
        ))}
      </PortfolioAssetsListContainer>
    </SectionCard>
  );
};
