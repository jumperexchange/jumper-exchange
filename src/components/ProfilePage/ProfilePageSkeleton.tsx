'use client';

import { PageContainer } from '../Containers/PageContainer';
import { IntroSectionSkeleton } from './sections/IntroSectionSkeleton';
import { CardsSectionSkeleton } from './CardsSection/CardsSectionSkeleton';

export const ProfilePageSkeleton = () => {
  return (
    <PageContainer>
      <IntroSectionSkeleton />
      <CardsSectionSkeleton />
    </PageContainer>
  );
};
