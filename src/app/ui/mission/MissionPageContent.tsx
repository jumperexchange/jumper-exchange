import { fetchQuestBySlugForPage } from '@/app/lib/missions/cachedMissionsFetch';
import { MissionPage } from '@/app/ui/mission/MissionPage';
import { questBySlugQueryKey } from '@/app/lib/missions/missionQueries';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { makeQueryClient } from '@/app/lib/makeQueryClient';

interface MissionPageContentProps {
  slug: string;
}

export const MissionPageContent = async ({ slug }: MissionPageContentProps) => {
  const queryClient = makeQueryClient();

  const quest = await queryClient
    .fetchQuery({
      queryKey: questBySlugQueryKey(slug),
      queryFn: () => fetchQuestBySlugForPage(slug),
    })
    .catch(() => null);

  if (!quest) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MissionPage slug={slug} />
    </HydrationBoundary>
  );
};
