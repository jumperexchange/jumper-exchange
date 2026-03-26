import type { Nullable } from 'nuqs';
import type { OrderEnum, SortAccessors, SortByEnum } from './types';
import {
  OrderOptions,
  SortByOptions,
  type BlogArticlesFilterWithoutSortByAndOrder,
  type LearnFilteringParams,
} from './types';
import type { BlogArticleData, TagAttributes } from '@/types/strapi';
import { readingTime } from '@/utils/readingTime';
import { flatMap, map, orderBy, uniq } from 'lodash';
import { isAfter, isBefore, startOfDay } from 'date-fns';

export const getReadingTimeMinutes = (item: BlogArticleData): number => {
  const t = readingTime(item.WordCount);
  return typeof t === 'number' ? t : 1;
};

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

  const allLevels: string[] = uniq(map(data, (item) => item.Level)).filter(
    (x): x is string => !!x,
  );

  const allDates = flatMap(data, (article) => [
    article.publishedAt,
    article.createdAt,
  ]).filter((date): date is string => !!date);

  const allReadingTimes = uniq(data.map(getReadingTimeMinutes));

  return {
    allTags,
    allLevels,
    allDates,
    allReadingTimes,
  };
};

export const sanitizeFilter = (
  filter: BlogArticlesFilterWithoutSortByAndOrder,
  stats: LearnFilteringParams,
): Nullable<BlogArticlesFilterWithoutSortByAndOrder> => {
  if (
    !stats.allTags.length &&
    !stats.allLevels.length &&
    !stats.allDates.length &&
    !stats.allReadingTimes.length
  ) {
    return filter;
  }

  const validTags = new Set(stats.allTags);
  const validLevels = new Set(stats.allLevels);
  const validDates = new Set(
    stats.allDates.map((date) => new Date(date).getTime()),
  );
  const validReadingTimes = new Set(stats.allReadingTimes);
  const minDate = validDates.size ? Math.min(...validDates) : null;
  const maxDate = validDates.size ? Math.max(...validDates) : null;
  const readingDurationMin = validReadingTimes.size
    ? Math.min(...validReadingTimes)
    : 0;
  const readingDurationMax = validReadingTimes.size
    ? Math.max(...validReadingTimes)
    : 0;

  return {
    ...filter,
    tags: filter.tags?.filter((t) => validTags.has(t)) ?? null,
    levels: filter.levels?.filter((t) => validLevels.has(t)) ?? null,
    minDate: filter.minDate
      ? minDate != null && maxDate != null
        ? new Date(
            Math.max(Math.min(filter.minDate.getTime(), maxDate), minDate),
          )
        : filter.minDate
      : null,
    maxDate: filter.maxDate
      ? minDate != null && maxDate != null
        ? new Date(
            Math.max(Math.min(filter.maxDate.getTime(), maxDate), minDate),
          )
        : filter.maxDate
      : null,
    minReadingDuration:
      filter.minReadingDuration != null
        ? Math.max(
            readingDurationMin,
            Math.min(filter.minReadingDuration, readingDurationMax),
          )
        : undefined,
    maxReadingDuration:
      filter.maxReadingDuration != null
        ? Math.min(
            readingDurationMax,
            Math.max(filter.maxReadingDuration, readingDurationMin),
          )
        : undefined,
  };
};

export const filterBlogArticles = (
  data: BlogArticleData[],
  filter: BlogArticlesFilterWithoutSortByAndOrder,
) => {
  return data.filter((item) => {
    const {
      tags,
      levels,
      minDate,
      maxDate,
      minReadingDuration,
      maxReadingDuration,
    } = filter;

    if (tags?.length && item.tags?.length) {
      const itemTags = item.tags.map((tag) => tag.Title);
      if (!itemTags.some((itemTag) => tags.includes(itemTag))) {
        return false;
      }
    }

    if (levels?.length && item.Level) {
      if (!levels.includes(item.Level)) {
        return false;
      }
    }

    const itemDate = startOfDay(item.publishedAt ?? item.createdAt);

    if (minDate && isBefore(itemDate, minDate)) {
      return false;
    }
    if (maxDate && isAfter(itemDate, maxDate)) {
      return false;
    }

    const readingMin = getReadingTimeMinutes(item);
    if (
      minReadingDuration != null &&
      minReadingDuration > 0 &&
      readingMin < minReadingDuration
    ) {
      return false;
    }
    if (
      maxReadingDuration != null &&
      maxReadingDuration > 0 &&
      readingMin > maxReadingDuration
    ) {
      return false;
    }

    return true;
  });
};

const LEVEL_SORT_ORDER: Record<string, number> = {
  Beginner: 0,
  Intermediate: 1,
  Expert: 2,
};

const getLevelSortOrder = (level: string | undefined): number =>
  level && level in LEVEL_SORT_ORDER ? LEVEL_SORT_ORDER[level] : 0;

export const tagAccessors = {
  title: (item: TagAttributes) => item.Title,
  articles: (item: TagAttributes) => item.blog_articles ?? [],
};

export const sortAccessors: SortAccessors = {
  [SortByOptions.DATE]: (item) => item.publishedAt ?? item.createdAt,
  [SortByOptions.LEVEL]: (item) => getLevelSortOrder(item.Level),
  [SortByOptions.READING_TIME]: (item) => getReadingTimeMinutes(item),
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
