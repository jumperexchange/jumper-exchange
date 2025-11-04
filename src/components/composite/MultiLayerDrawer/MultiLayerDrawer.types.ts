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
}

/**
 * Category with subcategories (branch node in the tree)
 */
export interface CategoryWithSubcategories extends BaseCategoryConfig {
  /** Array of subcategories */
  subcategories: CategoryConfig[];
}

/**
 * Leaf category with content type and data
 */
export interface LeafCategory<TValue = any> extends BaseCategoryConfig {
  /** Type of content to render */
  contentType: CategoryContentType;
  /** Current value for this category */
  value?: TValue;
  /** Callback when value changes */
  onChange?: (value: TValue) => void;
  /** For Select/MultiSelect: options to display */
  options?: CategoryOption[];
  /** For Slider: min value */
  min?: number;
  /** For Slider: max value */
  max?: number;
  /** For Custom: custom render function */
  render?: (props: LeafCategoryRenderProps<TValue>) => ReactNode;
  /** For List: custom render function for each item */
  renderItem?: (item: any, index: number) => ReactNode;
  /** For List: array of items */
  items?: any[];
  /** Enable search/filter functionality */
  searchable?: boolean;
  /** Placeholder text for search input */
  searchPlaceholder?: string;
}

/**
 * Props passed to custom render function
 */
export interface LeafCategoryRenderProps<TValue = any> {
  value: TValue;
  onChange: (value: TValue) => void;
  category: LeafCategory<TValue>;
}

/**
 * Option for select/multi-select
 */
export interface CategoryOption<T = string> {
  value: T;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  sx?: any;
}

/**
 * Union type for all category configurations
 */
export type CategoryConfig = CategoryWithSubcategories | LeafCategory;

/**
 * Type guard to check if category has subcategories
 */
export const hasSubcategories = (
  category: CategoryConfig,
): category is CategoryWithSubcategories => {
  return 'subcategories' in category;
};

/**
 * Type guard to check if category is a leaf
 */
export const isLeafCategory = (
  category: CategoryConfig,
): category is LeafCategory => {
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
  /** Root level categories */
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
  /** Whether clear button should be disabled */
  disableClear?: boolean;
  /** Whether apply button should be disabled */
  disableApply?: boolean;
  /** Custom test id */
  testId?: string;
  /** Show/hide footer buttons */
  showFooter?: boolean;
}
