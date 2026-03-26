import { useMemo } from 'react';
import type { ParseKeys } from 'i18next';
import { useLearnFiltering } from '@/providers/LearnProvider/filtering/LearnFilteringContext';
import type {
  BlogArticlesFilterWithoutSortByAndOrder,
  OrderEnum,
  SortByEnum,
} from '@/providers/LearnProvider/filtering/types';
import {
  OrderOptions,
  SortByOptions,
} from '@/providers/LearnProvider/filtering/types';
import { sortSelectOptions } from '@/utils/sortSelectOptions';
import { useTranslation } from 'react-i18next';
import { usePendingFilters } from '@/components/composite/MultiLayer/hooks';
import {
  createDateRangeCategory,
  createMultiSelectCategory,
  createSingleSelectCategory,
  createSliderCategory,
} from '@/components/composite/MultiLayer/utils';
import type { NullableFields } from '@/types/internal';
import { countBadge, datesBadge, readingDurationBadge } from './utils';
import type { BlogArticlesPendingFilterValues } from './types';
import { isEqual, startOfDay } from 'date-fns';

type LearnArticlesSortByOption = {
  value: `${SortByEnum}:${OrderEnum}`;
  label: string;
};

const SORT_OPTIONS_CONFIG: Record<
  SortByEnum,
  {
    label: ParseKeys<'translation'>;
    order: Record<OrderEnum, ParseKeys<'translation'>>;
  }
> = {
  [SortByOptions.LEVEL]: {
    label: 'blog.sorting.level',
    order: {
      [OrderOptions.ASC]: 'blog.order.lowest',
      [OrderOptions.DESC]: 'blog.order.highest',
    },
  },
  [SortByOptions.DATE]: {
    label: 'blog.sorting.publishDate',
    order: {
      [OrderOptions.ASC]: 'blog.order.oldest',
      [OrderOptions.DESC]: 'blog.order.newest',
    },
  },
  [SortByOptions.READING_TIME]: {
    label: 'blog.sorting.readingTime',
    order: {
      [OrderOptions.ASC]: 'blog.order.lowest',
      [OrderOptions.DESC]: 'blog.order.highest',
    },
  },
};

export const useLearnFilterBar = () => {
  const { t } = useTranslation();
  const {
    allTags,
    allLevels,
    allDates,
    allReadingTimes,
    filter,
    updateFilter,
    clearFilters,
    sortBy,
    setSortBy,
    order,
    setOrder,
  } = useLearnFiltering();

  const tagOptions = useMemo(
    () =>
      sortSelectOptions(
        allTags.map((tag) => {
          return {
            value: tag,
            label: tag,
          };
        }),
      ),
    [allTags],
  );

  const levelOptions = useMemo(
    () =>
      sortSelectOptions(
        allLevels.map((level) => {
          return {
            value: level,
            label: level,
          };
        }),
      ),
    [allLevels],
  );

  const allDateRange = useMemo(() => {
    if (allDates.length === 0) {
      const now = new Date();
      return { min: now, max: now };
    }
    const times = allDates.map((date) => new Date(date).getTime());
    return {
      min: startOfDay(new Date(Math.min(...times))),
      max: startOfDay(new Date(Math.max(...times))),
    };
  }, [allDates]);

  const dateMin = filter?.minDate ?? allDateRange.min;
  const dateMax = filter?.maxDate ?? allDateRange.max;

  const allReadingTimesRange = useMemo(() => {
    if (allReadingTimes.length === 0) {
      return { min: 0, max: 0 };
    }
    return {
      min: Math.min(...allReadingTimes),
      max: Math.max(...allReadingTimes),
    };
  }, [allReadingTimes]);

  const readingDurationRangeMin = allReadingTimesRange.min;
  const readingDurationRangeMax = allReadingTimesRange.max;
  const readingDurationMin =
    filter?.minReadingDuration ?? readingDurationRangeMin;
  const readingDurationMax =
    filter?.maxReadingDuration ?? readingDurationRangeMax;

  const sortByOptions = useMemo((): LearnArticlesSortByOption[] => {
    const sortByValues = Object.values(SortByOptions) as SortByEnum[];
    const orderValues = Object.values(OrderOptions) as OrderEnum[];

    return sortByValues.flatMap((sortBy) =>
      orderValues.map((order) => {
        const config = SORT_OPTIONS_CONFIG[sortBy];
        return {
          value: `${sortBy}:${order}` as LearnArticlesSortByOption['value'],
          label: `${t(config.label)} ${t(config.order[order])}`,
        };
      }),
    );
  }, [t]);

  const handleTagChange = (values: string[]) => {
    updateFilter({
      ...filter,
      tags: values.length > 0 ? values : null,
    });
  };

  const handleLevelChange = (values: string[]) => {
    updateFilter({
      ...filter,
      levels: values.length > 0 ? values : null,
    });
  };

  const handleDatesChange = (values: Date[]) => {
    const hasValues = values.length > 0;
    updateFilter({
      ...filter,
      minDate: hasValues ? values[0] : null,
      maxDate: hasValues ? values[1] : null,
    });
  };

  const handleReadingDurationChange = (value: number[]) => {
    const [min, max] = value;
    const isFullRange =
      min === readingDurationRangeMin && max === readingDurationRangeMax;
    updateFilter({
      ...filter,
      minReadingDuration: isFullRange ? null : min,
      maxReadingDuration: isFullRange ? null : max,
    });
  };

  const handleApplyAllFilters = (
    values: NullableFields<BlogArticlesFilterWithoutSortByAndOrder>,
  ) => {
    updateFilter({ ...values });
  };

  const handleSortBy = (value: string) => {
    setSortBy(value as SortByEnum);
  };

  const handleOrder = (value: string) => {
    setOrder(value as OrderEnum);
  };

  const optionsCount = [
    tagOptions.length,
    levelOptions.length,
    dateMin && dateMax ? 1 : 0,
    readingDurationRangeMax > readingDurationRangeMin ? 1 : 0,
  ].reduce((count, length) => count + (length || 0), 0);

  const arrayFiltersCount = [filter?.tags, filter?.levels].reduce(
    (count, arr) => count + (arr?.length || 0),
    0,
  );

  const hasDateFilterApplied =
    !isEqual(dateMin, allDateRange.min) || !isEqual(dateMax, allDateRange.max);
  const hasReadingDurationFilterApplied =
    readingDurationRangeMax > readingDurationRangeMin &&
    (readingDurationMin !== readingDurationRangeMin ||
      readingDurationMax !== readingDurationRangeMax);
  const valueFilterCount =
    (hasDateFilterApplied ? 1 : 0) + (hasReadingDurationFilterApplied ? 1 : 0);

  const filtersCount = arrayFiltersCount + valueFilterCount;
  const hasFilterApplied = filtersCount > 0 && optionsCount > 0;

  return {
    hasFilterApplied,
    filtersCount,
    tagOptions,
    levelOptions,
    filter,
    dateMin,
    dateMax,
    dateRangeMin: allDateRange.min,
    dateRangeMax: allDateRange.max,
    readingDurationMin,
    readingDurationMax,
    readingDurationRangeMin,
    readingDurationRangeMax,
    sortByOptions,
    sortBy,
    order,
    handleTagChange,
    handleLevelChange,
    handleDatesChange,
    handleReadingDurationChange,
    handleClearAllFilters: clearFilters,
    handleApplyAllFilters,
    handleSortBy,
    handleOrder,
  };
};

export const useBlogArticlesFilteringCategories = () => {
  const { t } = useTranslation();
  const {
    filtersCount,
    tagOptions,
    levelOptions,
    filter,
    dateMin,
    dateMax,
    dateRangeMin,
    dateRangeMax,
    readingDurationMin,
    readingDurationMax,
    readingDurationRangeMin,
    readingDurationRangeMax,
    sortByOptions,
    sortBy,
    order,
    handleClearAllFilters,
    handleApplyAllFilters,
    handleSortBy,
    handleOrder,
  } = useLearnFilterBar();

  const {
    pendingValues,
    setPendingValue,
    applyFilters,
    clearAll,
    resetPending,
    hasPendingFiltersApplied,
  } = usePendingFilters<BlogArticlesPendingFilterValues>({
    initialValues: {
      tags: filter?.tags ?? [],
      levels: filter?.levels ?? [],
      dates: [dateMin, dateMax],
      readingDuration: [readingDurationMin, readingDurationMax],
      sortBy,
      order,
    },
    onApply: (values) => {
      handleApplyAllFilters({
        tags: values.tags,
        levels: values.levels,
        minDate: values.dates[0],
        maxDate: values.dates[1],
        minReadingDuration:
          values.readingDuration[0] !== readingDurationRangeMin
            ? values.readingDuration[0]
            : null,
        maxReadingDuration:
          values.readingDuration[1] !== readingDurationRangeMax
            ? values.readingDuration[1]
            : null,
      });
      handleSortBy(values.sortBy);
      handleOrder(values.order);
    },
    onClear: handleClearAllFilters,
    isFilterApplied: (values) =>
      values.tags.length > 0 ||
      values.levels.length > 0 ||
      !values.dates[0] ||
      !isEqual(values.dates[0], dateRangeMin) ||
      !values.dates[1] ||
      !isEqual(values.dates[1], dateRangeMax) ||
      values.readingDuration[0] !== readingDurationRangeMin ||
      values.readingDuration[1] !== readingDurationRangeMax ||
      values.sortBy != sortBy ||
      values.order != order,
  });

  const usedMin = pendingValues.dates[0] ?? dateMin;
  const usedMax = pendingValues.dates[1] ?? dateMax;
  const usedReadingDuration = pendingValues.readingDuration ?? [
    readingDurationMin,
    readingDurationMax,
  ];

  const categories = [
    tagOptions.length > 1
      ? createMultiSelectCategory({
          id: 'tag',
          label: t('blog.filter.tag'),
          badgeLabel: countBadge(pendingValues.tags.length),
          value: pendingValues.tags,
          onChange: (v) => setPendingValue('tags', v),
          options: tagOptions,
          searchable: true,
          searchPlaceholder: t('blog.filter.search', {
            filterBy: t('blog.filter.tag').toLowerCase(),
          }),
          testId: 'blog-filter-tag-select',
        })
      : null,
    levelOptions.length > 1
      ? createMultiSelectCategory({
          id: 'level',
          label: t('blog.filter.level'),
          badgeLabel: countBadge(pendingValues.levels.length),
          value: pendingValues.levels,
          onChange: (v) => setPendingValue('levels', v),
          options: levelOptions,
          searchable: true,
          searchPlaceholder: t('blog.filter.search', {
            filterBy: t('blog.filter.level').toLowerCase(),
          }),
          testId: 'blog-filter-level-select',
        })
      : null,
    readingDurationRangeMax > readingDurationRangeMin
      ? createSliderCategory({
          id: 'readingDuration',
          label: t('blog.filter.readingDuration'),
          badgeLabel: readingDurationBadge(
            usedReadingDuration,
            readingDurationRangeMin,
            readingDurationRangeMax,
          ),
          renderLabel: (value) =>
            Array.isArray(value) || value !== 1 ? 'mins' : 'min',
          value: usedReadingDuration,
          onChange: (v) => setPendingValue('readingDuration', v),
          min: readingDurationRangeMin,
          max: readingDurationRangeMax,
          testId: 'blog-filter-reading-duration-slider',
        })
      : null,
    dateRangeMin && dateRangeMax && !isEqual(dateRangeMin, dateRangeMax)
      ? createDateRangeCategory({
          id: 'publishDate',
          label: t('blog.filter.publishDate'),
          badgeLabel: datesBadge(
            usedMin,
            usedMax,
            dateRangeMin,
            dateRangeMax,
            pendingValues.dates,
          ),
          value: pendingValues.dates,
          onChange: (v) => setPendingValue('dates', v),
          min: dateRangeMin,
          max: dateRangeMax,
          testId: 'blog-filter-publish-date-select',
        })
      : null,
    sortByOptions.length > 1
      ? createSingleSelectCategory<`${SortByEnum}:${OrderEnum}`>({
          id: 'sortBy',
          label: t('blog.sorting.sortBy'),
          value: `${pendingValues.sortBy}:${pendingValues.order}`,
          onChange: (v) => {
            if (!v) {
              return;
            }
            const [nextSortBy, nextOrder] = v.split(':') as [
              SortByEnum,
              OrderEnum,
            ];
            if (nextSortBy && nextOrder) {
              setPendingValue('sortBy', nextSortBy);
              setPendingValue('order', nextOrder);
            }
          },
          options: sortByOptions,
          testId: 'blog-filter-sort-select',
        })
      : null,
  ].filter((category) => !!category);

  return {
    categories,
    filtersCount,
    applyFilters,
    clearAll,
    resetPending,
    hasPendingFiltersApplied,
  };
};
