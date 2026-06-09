import { useQuery } from '@tanstack/react-query';
import { getQuestBySlug } from '@/app/lib/getQuestBySlug';
import { FIVE_MINUTES_MS } from '@/const/time';

export const questBySlugQueryKey = (slug: string) =>
  ['quest-by-slug', slug] as const;

export const fetchQuestBySlug = async (slug: string) => {
  const { data } = await getQuestBySlug(slug);
  return data ?? null;
};

export const useQuestBySlug = (slug: string) => {
  return useQuery({
    queryKey: questBySlugQueryKey(slug),
    queryFn: () => fetchQuestBySlug(slug),
    staleTime: FIVE_MINUTES_MS,
    refetchOnMount: false,
  });
};
