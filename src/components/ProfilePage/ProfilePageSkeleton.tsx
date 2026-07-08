'use client';

import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import { PageContainer } from '../Containers/PageContainer';
import { IntroSectionSkeleton } from './sections/IntroSectionSkeleton';

export const ProfilePageSkeleton = () => {
  return (
    <PageContainer>
      <IntroSectionSkeleton />
      <BaseSurfaceSkeleton
        variant="rounded"
        sx={(theme) => ({
          width: '100%',
          height: theme.spacing(67.5),
          borderRadius: theme.shape.cardBorderRadius,
        })}
      />
    </PageContainer>
  );
};
