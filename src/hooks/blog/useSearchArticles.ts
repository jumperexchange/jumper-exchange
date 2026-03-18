import { useQuery } from '@tanstack/react-query';
import { searchArticles } from '@/app/lib/searchArticles';
import type { BlogArticleData } from '@/types/strapi';
import { ONE_HOUR_MS } from '@/const/time';

const SEARCH_ARTICLES_QUERY_KEY = 'articles-search';
const MIN_SEARCH_LENGTH = 1;

export const getSearchArticlesQueryKey = (searchText: string) => [
  SEARCH_ARTICLES_QUERY_KEY,
  searchText.trim().toLowerCase(),
];

interface UseSearchArticlesProps {
  searchText: string;
  pageSize?: number;
}

interface UseSearchArticlesResult {
  data: BlogArticleData[];
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
}

export const useSearchArticles = ({
  searchText,
}: UseSearchArticlesProps): UseSearchArticlesResult => {
  const trimmed = searchText.trim();
  const enabled = trimmed.length >= MIN_SEARCH_LENGTH;

  const { data, isLoading, isFetching, isSuccess, isError, error } = useQuery({
    queryKey: getSearchArticlesQueryKey(trimmed),
    queryFn: () => searchArticles(trimmed),
    enabled,
    staleTime: ONE_HOUR_MS,
  });

  return {
    data: data?.data ?? [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error: error as Error | null,
  };
};
