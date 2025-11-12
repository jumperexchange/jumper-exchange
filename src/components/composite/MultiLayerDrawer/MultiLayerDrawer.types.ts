import { SxProps, Theme } from '@mui/material/styles';
import { ReactNode } from 'react';

/**
 * Defines the type of content to render when a leaf category is selected
 */
export enum CategoryContentType {
  MultiSelect = 'multi-select',
  SingleSelect = 'single-select',
  Slider = 'slider',
  List = 'list',
  Custom = 'custom',
}

/**
 * Base category configuration
 */
export interface BaseCategoryConfig {
  /** Unique identifier for the category */
  id: string;
  /** Display label */
  label: string;
  /** Optional icon to display next to label */
  icon?: ReactNode;
  /** Optional badge to display (e.g., count of applied filters) */
  badgeLabel?: string;
  /** Optional test id */
  testId?: string;
  /** Optional link to navigate to when the category is clicked */
  href?: string;
  /** Optional callback to execute when the category is clicked */
  onClick?: () => void;
}

/**
 * Option for select/multi-select
 */
export interface CategoryOption<T> {
  value: T;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

/**
 * Single select leaf category
 */
export type SingleSelectLeafCategory<TValue extends string | number> =
  BaseCategoryConfig & {
    contentType: CategoryContentType.SingleSelect;
    value?: TValue;
    onChange?: (value: TValue) => void;
    options?: CategoryOption<TValue>[];
    searchable?: boolean;
    searchPlaceholder?: string;
  };

/**
 * Multi select leaf category
 */
export type MultiSelectLeafCategory<TValue extends string | number> =
  BaseCategoryConfig & {
    contentType: CategoryContentType.MultiSelect;
    value?: TValue[];
    onChange?: (value: TValue[]) => void;
    options?: CategoryOption<TValue>[];
    searchable?: boolean;
    searchPlaceholder?: string;
  };

/**
 * Slider leaf category
 */
export type SliderLeafCategory = BaseCategoryConfig & {
  contentType: CategoryContentType.Slider;
  value?: number[];
  onChange?: (value: number[]) => void;
  min: number;
  max: number;
};

/**
 * List leaf category
 */
export type ListLeafCategory<TValue> = BaseCategoryConfig & {
  contentType: CategoryContentType.List;
  value?: TValue;
  onChange?: (value: TValue) => void;
  items: TValue[];
  renderItem: (item: TValue, index: number) => ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
};

/**
 * Custom render leaf category
 */
export type CustomLeafCategory<TValue> = BaseCategoryConfig & {
  contentType: CategoryContentType.Custom;
  value?: TValue;
  onChange?: (value: TValue) => void;
  render: (props: LeafCategoryRenderProps<TValue>) => ReactNode;
};

/**
 * Discriminated union of all leaf category variants
 */
export type LeafCategory<TValue> =
  | SingleSelectLeafCategory<TValue extends string | number ? TValue : string>
  | MultiSelectLeafCategory<TValue extends string | number ? TValue : string>
  | SliderLeafCategory
  | ListLeafCategory<TValue>
  | CustomLeafCategory<TValue>;

/**
 * Props passed to custom render function
 */
export interface LeafCategoryRenderProps<TValue> {
  value?: TValue;
  onChange: (value: TValue) => void;
  category: LeafCategory<TValue>;
}

/**
 * Category with subcategories (branch node in the tree)
 */
export interface CategoryWithSubcategories extends BaseCategoryConfig {
  subcategories?: CategoryConfig[];
}

export type LeafCategoryAny =
  | LeafCategory<string>
  | LeafCategory<number>
  | LeafCategory<boolean>
  | LeafCategory<string[]>
  | LeafCategory<number[]>;

/**
 * Union type for all category configurations
 */
export type CategoryConfig = CategoryWithSubcategories | LeafCategory<unknown>;

/**
 * Type guard to check if category has subcategories
 */
export const hasSubcategories = (
  category: CategoryConfig,
): category is CategoryWithSubcategories & {
  subcategories: CategoryConfig[];
} => {
  return 'subcategories' in category;
};

/**
 * Type guard to check if category is a leaf
 */
export const isLeafCategory = <TValue>(
  category: CategoryConfig,
): category is LeafCategory<TValue> => {
  return 'contentType' in category;
};

/**
 * Navigation breadcrumb item
 */
export interface BreadcrumbItem {
  id: string;
  label: string;
}

/**
 * Props for MultiLayerDrawer component
 */
export interface MultiLayerDrawerProps {
  /** Ref for the drawer */
  ref?: React.RefObject<{ open: () => void; close: () => void }>;
  /** Default trigger button sx */
  defaultTriggerSx?: SxProps<Theme>;
  /** Trigger button to open the drawer */
  triggerButton?: ReactNode;
  /** Root level categories - each can have different value types */
  categories: CategoryConfig[];
  /** Drawer title */
  title: string;
  /** Label for apply button */
  applyButtonLabel?: string;
  /** Label for clear button */
  clearButtonLabel?: string;
  /** Callback when apply button is clicked */
  onApply?: () => void;
  /** Callback when clear button is clicked */
  onClear?: () => void;
  /** Callback when drawer is closed */
  onClose?: () => void;
  /** Whether clear button should be disabled */
  disableClear?: boolean;
  /** Whether apply button should be disabled */
  disableApply?: boolean;
  /** Custom test id */
  testId?: string;
  /** Show/hide footer buttons */
  showFooter?: boolean;
  /** Applied filters count */
  appliedFiltersCount?: number;
}
