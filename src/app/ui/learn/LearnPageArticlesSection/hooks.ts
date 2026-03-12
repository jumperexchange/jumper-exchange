import { useMemo } from 'react';
import { useLearnFiltering } from '@/providers/LearnProvider/filtering/LearnFilteringContext';
import type {
  BlogArticlesFilterWithoutSortByAndOrder,
  SortByEnum,
} from '@/providers/LearnProvider/filtering/types';
import { SortByOptions } from '@/providers/LearnProvider/filtering/types';
import { sortSelectOptions } from '@/utils/sortSelectOptions';
import { useTranslation } from 'react-i18next';
import { usePendingFilters } from '@/components/composite/MultiLayer/hooks';
import {
  createDateRangeCategory,
  createMultiSelectCategory,
  createSingleSelectCategory,
} from '@/components/composite/MultiLayer/utils';
import type { NullableFields } from '@/types/internal';
import { countBadge, datesBadge } from './utils';
import type { BlogArticlesPendingFilterValues } from './types';

export const useLearnFilterBar = () => {
  const { t } = useTranslation();
  const {
    allTags,
    allLevels,
    allDates,
    filter,
    updateFilter,
    clearFilters,
    sortBy,
    setSortBy,
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

  const allDateRange = {
    min: new Date(
      Math.min(...allDates.map((date) => new Date(date).getTime())),
    ),
    max: new Date(
      Math.max(...allDates.map((date) => new Date(date).getTime())),
    ),
  };

  const dateMin = filter?.minDate ?? allDateRange.min;
  const dateMax = filter?.maxDate ?? allDateRange.max;

  const sortByOptions = useMemo(
    () => [
      { value: SortByOptions.TAG, label: t('blog.sorting.tag') },
      { value: SortByOptions.LEVEL, label: t('blog.sorting.level') },
      { value: SortByOptions.DATE, label: t('blog.sorting.publishDate') },
    ],
    [t],
  );

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

  const handleApplyAllFilters = (
    values: NullableFields<BlogArticlesFilterWithoutSortByAndOrder>,
  ) => {
    updateFilter({ ...values });
  };

  const handleSortBy = (value: string) => {
    setSortBy(value as SortByEnum);
  };

  const optionsCount = [
    tagOptions.length,
    levelOptions.length,
    dateMin && dateMax ? 1 : 0,
  ].reduce((count, length) => count + (length || 0), 0);

  const arrayFiltersCount = [filter?.tags, filter?.levels].reduce(
    (count, arr) => count + (arr?.length || 0),
    0,
  );

  const hasValueFilterApplied =
    dateMin !== allDateRange.min || dateMax !== allDateRange.max;
  const valueFilterCount = hasValueFilterApplied ? 1 : 0;

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
    sortByOptions,
    sortBy,
    handleTagChange,
    handleLevelChange,
    handleDatesChange,
    handleClearAllFilters: clearFilters,
    handleApplyAllFilters,
    handleSortBy,
  };
};

export const useBlogArticlesFilteringCategories = () => {
  const { t } = useTranslation();
  const {
    hasFilterApplied,
    filtersCount,
    tagOptions,
    levelOptions,
    filter,
    dateMin,
    dateMax,
    dateRangeMin,
    dateRangeMax,
    sortByOptions,
    sortBy,
    handleClearAllFilters,
    handleApplyAllFilters,
    handleSortBy,
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
      sortBy,
    },
    onApply: (values) => {
      handleApplyAllFilters({
        tags: values.tags,
        levels: values.levels,
        minDate: values.dates[0],
        maxDate: values.dates[1],
      });
      handleSortBy(values.sortBy);
    },
    onClear: handleClearAllFilters,
    isFilterApplied: (values) =>
      values.tags.length > 0 ||
      values.levels.length > 0 ||
      values.dates[0] !== dateRangeMin ||
      values.dates[1] !== dateRangeMax,
  });

  const usedMin = pendingValues.dates[0] ?? dateMin;
  const usedMax = pendingValues.dates[1] ?? dateMax;

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
    dateRangeMin && dateRangeMax && dateRangeMin !== dateRangeMax
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
      ? createSingleSelectCategory<SortByEnum>({
          id: 'sortBy',
          label: t('blog.sorting.sortBy'),
          value: pendingValues.sortBy,
          onChange: (v) => {
            if (v) {
              setPendingValue('sortBy', v);
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
