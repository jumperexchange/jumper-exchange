'use client';
import { MissionsListSkeleton } from './MissionsListSkeleton';
import { MissionsPageContainer } from './MissionsPageContainer';

export const MissionsPageSkeleton = () => {
  return (
    <MissionsPageContainer>
      <MissionsListSkeleton count={5} />
    </MissionsPageContainer>
  );
};
