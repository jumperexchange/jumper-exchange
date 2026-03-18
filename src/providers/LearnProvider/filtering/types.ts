import type { BlogArticleData, TagAttributes } from '@/types/strapi';

export const SortByOptions = {
  TAG: 'tag',
  LEVEL: 'level',
  DATE: 'date',
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
}

export interface BlogArticlesFilterWithoutSortByAndOrder {
  tags?: string[];
  levels?: string[];
  minDate?: Date;
  maxDate?: Date;
}

export const TAG_ALL = 'all';
