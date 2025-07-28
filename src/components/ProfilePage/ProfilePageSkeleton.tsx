'use client';

import { PageContainer } from '../Containers/PageContainer';
import { IntroSectionSkeleton } from './sections/IntroSectionSkeleton';

export const ProfilePageSkeleton = () => {
  return (
    <PageContainer>
      <IntroSectionSkeleton />
    </PageContainer>
  );
};
