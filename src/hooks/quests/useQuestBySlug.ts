import { useQuery } from '@tanstack/react-query';

import {
  fetchQuestBySlug,
  questBySlugQueryKey,
} from '@/app/lib/missions/missionQueries';
import { FIVE_MINUTES_MS } from '@/const/time';

export const useQuestBySlug = (slug: string) => {
  return useQuery({
    queryKey: questBySlugQueryKey(slug),
    queryFn: () => fetchQuestBySlug(slug),
    staleTime: FIVE_MINUTES_MS,
    refetchOnMount: false,
  });
};
