import { BaseSurfaceSkeleton } from 'src/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import {
  AssetOverviewCardOverviewColumnContainer,
  AssetOverviewCardSharedDescriptionContainer,
} from '../AssetOverviewCard.styles';

export const OverviewCardColumnSkeleton = () => {
  return (
    <AssetOverviewCardOverviewColumnContainer>
      <AssetOverviewCardSharedDescriptionContainer>
        <BaseSurfaceSkeleton height={16} width={42} />
        <BaseSurfaceSkeleton height={32} width={108} />
      </AssetOverviewCardSharedDescriptionContainer>
      <BaseSurfaceSkeleton height={24} width={24} />
    </AssetOverviewCardOverviewColumnContainer>
  );
};
