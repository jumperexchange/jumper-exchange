'use client';
import { MissionsListSkeleton } from './MissionsListSkeleton';
import { MissionsPageContainer } from './MissionsPageContainer';
import { MissionsPageContentContainer } from './MissionsPageContentContainer';

export const MissionsPageSkeleton = () => {
  return (
    <MissionsPageContainer>
      <MissionsPageContentContainer>
        <MissionsListSkeleton count={5} />
      </MissionsPageContentContainer>
    </MissionsPageContainer>
  );
};
