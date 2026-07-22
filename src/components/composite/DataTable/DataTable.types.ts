import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

export interface ColumnDef<T> {
  id: string;
  header?: ReactNode;
  headerAriaLabel?: string;
  renderCell?: (row: T) => ReactNode;
  renderSkeleton?: () => ReactNode;
  cellSx?: SxProps<Theme>;
  headerCellSx?: SxProps<Theme>;
  width?: number;
  align?: 'left' | 'right' | 'center';
  hidden?: boolean;
}

export interface MobileSection {
  columnIds: string[];
  sx?: SxProps<Theme>;
}

export interface DataTableProps<T> {
  rows: T[];
  columns: ColumnDef<T>[];
  getRowKey: (row: T) => string;
  hasMobileView?: boolean;
  sections?: MobileSection[];
  showHeader?: boolean;
  stickyHeader?: boolean;
  rowHeight?: number;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  skeletonCount?: number;
  renderRow?: (row: T, index: number) => ReactNode;
  renderSkeletonRow?: (index: number) => ReactNode;
  testId?: string;
  sx?: SxProps<Theme>;
}
