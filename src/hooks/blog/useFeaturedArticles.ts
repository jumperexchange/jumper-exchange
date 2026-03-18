import { getFeaturedArticle } from '@/app/lib/getFeaturedArticle';
import { FIVE_MINUTES_MS } from '@/const/time';
import { useQuery } from '@tanstack/react-query';

export const useFeaturedArticles = () => {
  return useQuery({
    queryKey: ['articles-featured'],
    queryFn: () => getFeaturedArticle(),
    select: (payload) => payload.data,
    staleTime: FIVE_MINUTES_MS,
  });
};
