import { BaseSurfaceSkeleton } from 'src/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import {
  AssetOverviewCardContentContainer,
  AssetOverviewCardOverviewContainer,
  AssetOverviewCardSharedContentContainer,
  AssetOverviewNavigationContainer,
} from '../AssetOverviewCard.styles';
import { OverviewCardColumnSkeleton } from '../components/OverviewCardColumnSkeleton';

export const AssetOverviewLoading = () => {
  return (
    <AssetOverviewCardSharedContentContainer>
      <AssetOverviewNavigationContainer>
        {Array.from({ length: 3 }).map((_, index) => (
          <BaseSurfaceSkeleton key={index} height={24} width={40} />
        ))}
      </AssetOverviewNavigationContainer>
      <AssetOverviewCardContentContainer>
        <AssetOverviewCardOverviewContainer>
          <OverviewCardColumnSkeleton />
          <OverviewCardColumnSkeleton />
        </AssetOverviewCardOverviewContainer>
      </AssetOverviewCardContentContainer>
    </AssetOverviewCardSharedContentContainer>
  );
};
