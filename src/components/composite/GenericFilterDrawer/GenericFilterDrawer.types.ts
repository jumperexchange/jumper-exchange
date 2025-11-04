import {
  SelectVariant,
  TData,
} from 'src/components/core/form/Select/Select.types';

export interface FilterOption<T extends TData> {
  value: T;
  label: string;
  [key: string]: any;
}

export interface FilterCategoryConfig<TFilterKey extends string = string> {
  id: TFilterKey;
  label: string;
  selectType: SelectVariant;
  getBadgeLabel?: (filterValue: TData) => string | null;
  testId?: string;
}

export interface GenericFilterDrawerProps<TFilterKey extends string = string> {
  categories: FilterCategoryConfig<TFilterKey>[];
  filterValues: Record<TFilterKey, TData>;
  filterOptions: Record<TFilterKey, FilterOption<any>[]>;
  onFilterChange: (key: TFilterKey, value: TData) => void;
  onClearAll: () => void;
  sliderRanges?: Record<TFilterKey, { min: number; max: number }>;
  hasFilterApplied: boolean;
  filtersCount: number;
  drawerTitle?: string;
  clearButtonLabel?: string;
  applyButtonLabel?: string;
}
