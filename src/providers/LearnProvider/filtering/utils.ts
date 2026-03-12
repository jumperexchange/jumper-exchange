import type { Nullable } from 'nuqs';
import type { OrderEnum, SortAccessors, SortByEnum } from './types';
import {
  OrderOptions,
  SortByOptions,
  type BlogArticlesFilterWithoutSortByAndOrder,
  type LearnFilteringParams,
} from './types';
import type { BlogArticleData, TagAttributes } from '@/types/strapi';
import { flatMap, map, orderBy, uniq } from 'lodash';
import { isAfter, isBefore } from 'date-fns';

export const removeNullValuesFromFilter = (
  filter: Nullable<BlogArticlesFilterWithoutSortByAndOrder>,
) => {
  return Object.fromEntries(
    Object.entries(filter).filter(([_, value]) => value !== null),
  ) as BlogArticlesFilterWithoutSortByAndOrder;
};

export const extractFilteringParams = (
  data: BlogArticleData[],
): LearnFilteringParams => {
  let allTags = data.flatMap(
    (item) => item.tags?.map((tag) => tag.Title) ?? [],
  );
  allTags = uniq(allTags).filter(Boolean);

  // @NOTE: this needs to be implemented
  const allLevels: string[] = [];

  const allDates = flatMap(data, (article) => [
    article.publishedAt,
    article.updatedAt,
    article.createdAt,
  ]).filter((date): date is string => !!date);

  return {
    allTags,
    allLevels,
    allDates,
  };
};

export const sanitizeFilter = (
  filter: BlogArticlesFilterWithoutSortByAndOrder,
  stats: LearnFilteringParams,
): Nullable<BlogArticlesFilterWithoutSortByAndOrder> => {
  if (!stats.allTags.length || !stats.allLevels.length) {
    return filter;
  }

  const validTags = new Set(stats.allTags);
  const validLevels = new Set(stats.allLevels);
  const validDates = new Set(
    stats.allDates.map((date) => new Date(date).getTime()),
  );
  const minDate = validDates.size ? Math.min(...validDates) : null;
  const maxDate = validDates.size ? Math.max(...validDates) : null;

  return {
    ...filter,
    tags: filter.tags?.filter((t) => validTags.has(t)) ?? null,
    levels: filter.levels?.filter((t) => validLevels.has(t)) ?? null,
    minDate: filter.minDate
      ? minDate && maxDate
        ? new Date(
            Math.max(Math.min(filter.minDate.getTime(), maxDate), minDate),
          )
        : filter.minDate
      : null,
    maxDate: filter.maxDate
      ? minDate && maxDate
        ? new Date(
            Math.max(Math.min(filter.maxDate.getTime(), maxDate), minDate),
          )
        : filter.maxDate
      : null,
  };
};

export const filterBlogArticles = (
  data: BlogArticleData[],
  filter: BlogArticlesFilterWithoutSortByAndOrder,
) => {
  return data.filter((item) => {
    const { tags, levels, minDate, maxDate } = filter;
    if (tags?.length && item.tags?.length) {
      const itemTags = item.tags.map((tag) => tag.Title);

      const hasTag = itemTags.some((itemTag) => tags.includes(itemTag));

      if (!hasTag) {
        return false;
      }
    }

    // @TODO needs to be implemented
    if (levels?.length) {
    }

    const itemDate = item.publishedAt ?? item.updatedAt ?? item.createdAt;

    if (minDate && isBefore(itemDate, minDate)) {
      return false;
    }

    if (maxDate && isAfter(itemDate, maxDate)) {
      return false;
    }

    return true;
  });
};

export const tagAccessors = {
  title: (item: TagAttributes) => item.Title,
  articles: (item: TagAttributes) => item.blog_articles ?? [],
};

export const sortAccessors: SortAccessors = {
  [SortByOptions.DATE]: (item) =>
    item.publishedAt ?? item.updatedAt ?? item.createdAt,
  // [SortByOptions.TAG]: (item) => '',
  // @TODO needs to be implemented
  // [SortByOptions.LEVEL]: (item) => '',
};

export function sortBlogArticles(
  data: BlogArticleData[],
  sortBy: SortByEnum,
  order: OrderEnum = OrderOptions.DESC,
): BlogArticleData[] {
  const accessor = sortAccessors[sortBy];
  if (!accessor) {
    return data;
  }

  return orderBy(
    data,
    [accessor],
    [order === OrderOptions.ASC ? 'asc' : 'desc'],
  );
}
