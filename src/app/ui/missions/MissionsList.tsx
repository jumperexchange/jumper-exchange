'use client';

import { FC } from 'react';
import { useMissionsInfinite } from 'src/hooks/useMissionsInfinite';
import { StrapiResponseData, QuestData } from 'src/types/strapi';
import { MissionCard } from './MissionCard';
import { MissionsListSkeleton } from './MissionsListSkeleton';
import { InfiniteScroll } from 'src/components/InfiniteScroll/InfiniteScroll';

interface MissionsListProps {
  initialMissions: StrapiResponseData<QuestData>;
  shouldLoadMore?: boolean;
}

export const MissionsList: FC<MissionsListProps> = ({ initialMissions }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMissionsInfinite(initialMissions);

  const missions = data?.pages.flatMap((page) => page.data) || initialMissions;

  return (
    <InfiniteScroll
      isLoading={isFetchingNextPage}
      hasMore={hasNextPage}
      loadMore={fetchNextPage}
      loader={<MissionsListSkeleton count={2} />}
      triggerMargin={400}
    >
      {missions.map((mission: any) => (
        <MissionCard key={mission.id} mission={mission} />
      ))}
    </InfiniteScroll>
  );
};
