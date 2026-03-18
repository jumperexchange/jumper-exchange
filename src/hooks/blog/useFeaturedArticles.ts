import { getFeaturedArticle } from '@/app/lib/getFeaturedArticle';
import { ONE_HOUR_MS } from '@/const/time';
import { useQuery } from '@tanstack/react-query';

export const useFeaturedArticles = () => {
  return useQuery({
    queryKey: ['articles-featured'],
    queryFn: () => getFeaturedArticle(),
    select: (payload) => payload.data,
    staleTime: ONE_HOUR_MS,
  });
};
