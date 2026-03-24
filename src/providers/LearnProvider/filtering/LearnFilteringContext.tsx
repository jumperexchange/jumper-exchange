'use client';

import type {
  BlogArticleData,
  StrapiMetaPagination,
  StrapiResponse,
  TagAttributes,
} from '@/types/strapi';
import type {
  BlogArticlesFilterWithoutSortByAndOrder,
  LearnFilteringParams,
  OrderEnum,
  SortByEnum,
} from './types';
import { OrderOptions, SortByOptions, TAG_ALL } from './types';
import type { NullableFields } from '@/types/internal';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs';
import {
  extractFilteringParams,
  filterBlogArticles,
  removeNullValuesFromFilter,
  sanitizeFilter,
  sortBlogArticles,
  tagAccessors,
} from './utils';
import { isEqual } from 'lodash';

const PAGE_SIZE = 6;

export const EMPTY_FILTERING_PARAMS: LearnFilteringParams = {
  allTags: [],
  allLevels: [],
  allDates: [],
  allReadingTimes: [],
};

export interface LearnFilteringContextType extends LearnFilteringParams {
  sortBy: SortByEnum;
  setSortBy: (sortBy: SortByEnum) => void;
  order: OrderEnum;
  setOrder: (order: OrderEnum) => void;
  filter: BlogArticlesFilterWithoutSortByAndOrder;
  updateFilter: (
    filter: NullableFields<BlogArticlesFilterWithoutSortByAndOrder>,
  ) => void;
  clearFilters: () => void;
  changeTab: (tab: string) => void;
  data: BlogArticleData[];
  tab: string | null;
  tabs?: string[];
  page: number;
  setPage: (page: number) => void;
  pagination: StrapiMetaPagination;
}

export const LearnFilteringContext = createContext<LearnFilteringContextType>({
  ...EMPTY_FILTERING_PARAMS,
  sortBy: SortByOptions.DATE,
  setSortBy: () => {},
  order: OrderOptions.ASC,
  setOrder: () => {},
  filter: {},
  updateFilter: () => {},
  clearFilters: () => {},
  tab: '',
  changeTab: () => {},
  data: [],
  page: 0,
  setPage: () => {},
  pagination: {
    page: 0,
    pageSize: PAGE_SIZE,
    pageCount: 0,
    total: 0,
  },
});

export const searchParamsParsers = {
  sortBy: parseAsStringEnum(Object.values(SortByOptions)).withDefault(
    SortByOptions.DATE,
  ),
  tab: parseAsString,
  order: parseAsStringEnum(Object.values(OrderOptions)).withDefault(
    OrderOptions.DESC,
  ),
  tags: parseAsArrayOf(parseAsString),
  levels: parseAsArrayOf(parseAsString),
  minDate: parseAsIsoDate,
  maxDate: parseAsIsoDate,
  minReadingDuration: parseAsInteger,
  maxReadingDuration: parseAsInteger,
};

export const LearnFilteringProvider = ({
  children,
  tags,
}: {
  children: React.ReactNode;
  tags: StrapiResponse<TagAttributes>;
}) => {
  const [searchParamsState, setSearchParamsState] = useQueryStates(
    searchParamsParsers,
    {
      history: 'replace',
    },
  );
  const {
    sortBy: initialSortBy,
    order: initialOrder,
    tab,
    ...rest
  } = searchParamsState;

  const initialFilter = useMemo(() => {
    return removeNullValuesFromFilter(rest);
  }, [rest]);

  useEffect(() => {
    if (tab) {
      return;
    }
    setSearchParamsState({
      tab: TAG_ALL,
    });
  }, [tab, setSearchParamsState]);

  const [sortBy, setSortBy] = useState<SortByEnum>(initialSortBy);
  const [order, setOrder] = useState<OrderEnum>(initialOrder);
  const [filter, setFilter] =
    useState<BlogArticlesFilterWithoutSortByAndOrder>(initialFilter);
  const [page, setPage] = useState(0);

  const tabs = useMemo(() => {
    return tags.data?.map(tagAccessors.title);
  }, [tags]);

  const allData = useMemo(() => {
    if (!tags.data) {
      return [];
    }
    return tags.data;
  }, [tags]);

  const unfilteredTabData = useMemo(() => {
    if (!tab) {
      return [];
    }
    if (tab === TAG_ALL) {
      return allData.map(tagAccessors.articles).flat();
    }
    const selectedTag = allData.find((tag) => tag.Title === tab);
    if (
      !selectedTag ||
      !selectedTag.blog_articles ||
      !selectedTag.blog_articles.length
    ) {
      return [];
    }

    return selectedTag.blog_articles;
  }, [allData, tab]);

  const filteredSortedData = useMemo(() => {
    const filteredData = filterBlogArticles(unfilteredTabData, filter);

    const sortedData = sortBlogArticles(filteredData, sortBy, order);

    return sortedData;
  }, [unfilteredTabData, filter, sortBy, order]);

  const { data, pagination } = useMemo(() => {
    const total = filteredSortedData.length;
    const pageCount = Math.ceil(total / PAGE_SIZE);
    const pagination = {
      page,
      pageSize: PAGE_SIZE,
      pageCount,
      total,
    };

    const startIndex = page * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const paginatedData = filteredSortedData.slice(startIndex, endIndex);

    return { data: paginatedData, pagination };
  }, [filteredSortedData, page]);

  const stats = useMemo((): LearnFilteringParams => {
    if (unfilteredTabData.length === 0) {
      return EMPTY_FILTERING_PARAMS;
    }

    return extractFilteringParams(unfilteredTabData);
  }, [unfilteredTabData]);

  useEffect(() => {
    const sanitized = sanitizeFilter(filter, stats);

    if (!isEqual(sanitized, filter)) {
      setFilter(removeNullValuesFromFilter(sanitized));
      setSearchParamsState(sanitized);
    }
  }, [stats]);

  const updateFilter = useCallback(
    (newFilter: NullableFields<BlogArticlesFilterWithoutSortByAndOrder>) => {
      setPage(0);
      const newFilterValue = { ...filter, ...newFilter };
      setFilter(removeNullValuesFromFilter(newFilterValue));
      setSearchParamsState(newFilterValue);
    },
    [filter, setFilter, setSearchParamsState],
  );

  const updateSortBy = useCallback(
    (newSortBy: SortByEnum) => {
      setPage(0);
      setSortBy(newSortBy);
      setSearchParamsState({ sortBy: newSortBy });
    },
    [setSortBy, setSearchParamsState],
  );

  const updateOrder = useCallback(
    (newOrder: OrderEnum) => {
      setPage(0);
      setOrder(newOrder);
      setSearchParamsState({ order: newOrder });
    },
    [setOrder, setSearchParamsState],
  );

  const clearFilters = useCallback(() => {
    updateFilter({
      tags: null,
      levels: null,
      minDate: null,
      maxDate: null,
      minReadingDuration: null,
      maxReadingDuration: null,
    });
  }, [updateFilter]);

  const changeTab = useCallback(
    (tab: string) => {
      setPage(0);
      setSearchParamsState({ tab });
      clearFilters();
    },
    [setSearchParamsState, clearFilters],
  );

  const context = useMemo(() => {
    return {
      sortBy,
      setSortBy: updateSortBy,
      order,
      setOrder: updateOrder,
      filter,
      updateFilter,
      clearFilters,
      tab,
      tabs,
      changeTab,
      data,
      page,
      setPage,
      pagination,
      ...stats,
    };
  }, [
    tab,
    tabs,
    changeTab,
    sortBy,
    updateSortBy,
    order,
    updateOrder,
    filter,
    updateFilter,
    data,
    page,
    pagination,
    clearFilters,
    stats,
  ]);

  return (
    <LearnFilteringContext.Provider value={context}>
      {children}
    </LearnFilteringContext.Provider>
  );
};

export const useLearnFiltering = (): LearnFilteringContextType => {
  return useContext(LearnFilteringContext);
};
