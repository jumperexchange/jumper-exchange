import {
  PortfolioHeaderOverviewContainer,
  PortfolioHeaderOverviewHeaderContainer,
  PortfolioHeaderOverviewContentContainer,
} from './PortfolioPage.styles';
import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';

export const PortfolioHeaderOverviewSkeleton = () => {
  return (
    <PortfolioHeaderOverviewContainer>
      <PortfolioHeaderOverviewHeaderContainer>
        <BaseSurfaceSkeleton height={24} width={74} variant="rounded" />
        <BaseSurfaceSkeleton height={40} width={40} variant="circular" />
      </PortfolioHeaderOverviewHeaderContainer>
      <PortfolioHeaderOverviewContentContainer>
        <BaseSurfaceSkeleton height={32} width={154} variant="rounded" />
      </PortfolioHeaderOverviewContentContainer>
    </PortfolioHeaderOverviewContainer>
  );
};
