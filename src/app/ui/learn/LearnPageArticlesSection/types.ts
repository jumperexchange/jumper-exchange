import type { DateRangeValue } from '@/components/composite/MultiLayer/MultiLayer.types';
import type {
  SortByEnum,
  OrderEnum,
} from '@/providers/LearnProvider/filtering/types';

export interface BlogArticlesPendingFilterValues {
  tags: string[];
  levels: string[];
  dates: DateRangeValue;
  readingDuration: number[];
  sortBy: SortByEnum;
  order: OrderEnum;
}
