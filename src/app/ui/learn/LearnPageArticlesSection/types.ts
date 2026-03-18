import type { SortByEnum } from '@/providers/LearnProvider/filtering/types';

export interface BlogArticlesPendingFilterValues {
  tags: string[];
  levels: string[];
  dates: (Date | null)[];
  sortBy: SortByEnum;
}
