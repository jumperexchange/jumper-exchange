import type { ReactNode } from 'react';
import type { GridProps, GridSize } from '@mui/material/Grid';
import type { SxProps, Theme } from '@mui/material/styles';
import type { TypographyProps } from '@mui/material/Typography';

export type ColumnAlignment = 'left' | 'center' | 'right' | 'end' | 'start';

export type ResponsiveGridProps = GridProps & {
  xs?: GridSize;
  sm?: GridSize;
  md?: GridSize;
  lg?: GridSize;
  xl?: GridSize;
};

export interface ColumnDefinition<TData = any> {
  id: string;
  header?: string | ReactNode;
  render: (row: TData, rowIndex: number) => ReactNode;
  gridProps?: ResponsiveGridProps;
  headerGridProps?: ResponsiveGridProps;
  cellGridProps?: ResponsiveGridProps;
  hideHeader?: boolean;
  align?: ColumnAlignment;
  headerSx?: (row: TData, index: number) => SxProps<Theme>;
  cellSx?: (row: TData, index: number) => SxProps<Theme>;
}

export interface ColumnTableProps<TData = any> {
  columns: ColumnDefinition<TData>[];
  data: TData[];
  spacing?: number;
  showHeader?: boolean;
  headerGap?: number;
  dataRowGap?: number;
  headerVariant?: TypographyProps['variant'];
  headerColor?: string;
  sx?: SxProps<Theme>;
  getRowKey?: (row: TData, index: number) => string;
  onRowClick?: (row: TData, index: number) => void;
}
