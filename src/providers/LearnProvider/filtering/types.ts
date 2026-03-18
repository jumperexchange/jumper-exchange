import type { BlogArticleData, TagAttributes } from '@/types/strapi';

export const SortByOptions = {
  LEVEL: 'level',
  DATE: 'date',
  READING_TIME: 'readingTime',
} as const;

export type SortByEnum = (typeof SortByOptions)[keyof typeof SortByOptions];

export const OrderOptions = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type OrderEnum = (typeof OrderOptions)[keyof typeof OrderOptions];

export type SortAccessors = Partial<
  Record<SortByEnum, (item: BlogArticleData) => string | number>
>;

export interface LearnFilteringParams {
  allTags: string[];
  allLevels: string[];
  allDates: string[];
  allReadingTimes: number[];
}

export interface BlogArticlesFilterWithoutSortByAndOrder {
  tags?: string[];
  levels?: string[];
  minDate?: Date;
  maxDate?: Date;
  minReadingDuration?: number;
  maxReadingDuration?: number;
}

export const TAG_ALL = 'all';
