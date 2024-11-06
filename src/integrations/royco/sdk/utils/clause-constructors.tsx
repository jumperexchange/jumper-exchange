import type { BaseQueryFilter, BaseSortingFilter } from '../types';

export const constructBaseQueryFilterClauses = (
  filters: Array<BaseQueryFilter> | undefined,
): string | undefined => {
  if (!filters) {
    return undefined;
  }

  let filterClauses = '';

  /**
   * @note To filter string: wrap in single quotes
   * @note To filter number: no quotes
   */
  filters.forEach((filter, filterIndex) => {
    const filterValueType = typeof filter.value;

    if (filterValueType === 'number') {
      filterClauses += ` ${filter.id} ${filter.condition && filter.condition === 'NOT' ? `!=` : `=`} ${filter.value} `;
    } else {
      ` ${filter.id} ${filter.condition && filter.condition === 'NOT' ? `!=` : `=`} '${filter.value}' `;
    }

    if (filterIndex !== filters.length - 1) {
      filterClauses += ` ${filter.join ?? 'OR'} `;
    }
  });

  return filterClauses;
};

export const constructBaseSortingFilterClauses = (
  sorting: Array<BaseSortingFilter> | undefined,
): string | undefined => {
  if (!sorting) {
    return undefined;
  }

  if (sorting.length === 0) {
    return;
  }

  let sortingClauses = '';

  sorting.forEach((sort, sortIndex) => {
    sortingClauses += ` ${sort.id} `;

    if (sort.desc) {
      sortingClauses += ' DESC ';
    } else {
      sortingClauses += ' ASC ';
    }

    if (sortIndex !== sorting.length - 1) {
      sortingClauses += ', ';
    }
  });

  return sortingClauses;
};
