'use client';

import { FC, useRef } from 'react';
import { useMissionsInfinite } from 'src/hooks/useMissionsInfinite';
import { StrapiResponseData, QuestData } from 'src/types/strapi';
import { MissionCard } from './MissionCard';
import { MissionsListSkeleton } from './MissionsListSkeleton';
import { useIntersectionObserver } from 'src/hooks/useIntersectionObserver';

interface MissionsListProps {
  initialMissions: StrapiResponseData<QuestData>;
  shouldLoadMore?: boolean;
}

export const MissionsList: FC<MissionsListProps> = ({ initialMissions }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMissionsInfinite(initialMissions);

  const observerRef = useRef<HTMLDivElement>(null);

  useIntersectionObserver(observerRef, {
    onIntersect: fetchNextPage,
    enabled: hasNextPage && !isFetchingNextPage,
  });

  const missions =
    data?.pages.flatMap((page) => page.missions) || initialMissions;

  return (
    <>
      {missions.map((mission: any) => (
        <MissionCard key={mission.id} mission={mission} />
      ))}
      {hasNextPage && (
        <div
          ref={observerRef}
          style={{
            width: 1,
            height: 1,
            overflow: 'hidden',
            opacity: 0,
            position: 'fixed',
            bottom: 0,
            left: 0,
            pointerEvents: 'none',
          }}
        />
      )}
      {isFetchingNextPage && <MissionsListSkeleton count={2} />}
    </>
  );
};
