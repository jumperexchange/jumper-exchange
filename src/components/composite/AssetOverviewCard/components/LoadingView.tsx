import type { FC } from 'react';
import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import {
  ContentContainer,
  NavigationContainer,
  NoContentContainer,
  SharedDescriptionContainer,
  OverviewContainer,
  OverviewColumnContainer,
} from '../AssetOverviewCard.styles';

const OverviewColumnSkeleton: FC = () => (
  <OverviewColumnContainer>
    <SharedDescriptionContainer>
      <BaseSurfaceSkeleton height={16} width={42} />
      <BaseSurfaceSkeleton height={32} width={108} />
    </SharedDescriptionContainer>
    <BaseSurfaceSkeleton height={24} width={24} />
  </OverviewColumnContainer>
);

export const LoadingView: FC = () => {
  return (
    <NoContentContainer>
      <NavigationContainer>
        {Array.from({ length: 3 }).map((_, index) => (
          <BaseSurfaceSkeleton key={index} height={24} width={40} />
        ))}
      </NavigationContainer>
      <ContentContainer>
        <OverviewContainer>
          <OverviewColumnSkeleton />
          <OverviewColumnSkeleton />
        </OverviewContainer>
      </ContentContainer>
    </NoContentContainer>
  );
};
