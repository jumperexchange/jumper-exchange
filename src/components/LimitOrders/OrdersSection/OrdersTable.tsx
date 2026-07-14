'use client';

import { useMediaQuery } from '@mui/material';
import { DataTable } from '@/components/composite/DataTable/DataTable';
import {
  Pagination,
  PaginationVariant,
} from '@/components/core/Pagination/Pagination';
import { type LimitOrder as Order } from '@/types/jumper-backend';
import { useOrderColumns } from './hooks';

interface OrdersTableProps {
  /** Already the current page's rows — pagination is server-side (offset/limit). */
  orders: Order[];
  /** Total order count across all pages, from the backend's pagination meta. */
  total: number;
  /** The limit the backend actually applied to this page's request. */
  pageSize: number;
  /** Math.ceil(total / pageSize), computed once alongside the query result. */
  pageCount: number;
  page: number;
  setPage: (page: number) => void;
  isLoading?: boolean;
  isExpanded?: boolean;
  stickyHeader?: boolean;
}

export const OrdersTable = ({
  orders,
  total,
  pageSize,
  pageCount,
  page,
  setPage,
  isLoading = false,
  isExpanded = false,
  stickyHeader = false,
}: OrdersTableProps) => {
  const columns = useOrderColumns(isExpanded);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const maxVisiblePages = isMobile
    ? 1
    : isTablet || (isSmallScreen && !isExpanded)
      ? 2
      : isSmallScreen
        ? 3
        : 5;

  return (
    <>
      <DataTable
        rows={orders}
        loading={isLoading}
        columns={columns}
        getRowKey={(order) => order.orderId}
        hasMobileView={false}
        showHeader
        stickyHeader={stickyHeader}
        sx={{ marginInline: (theme) => theme.spacing(-1.5) }}
      />
      {pageCount > 1 && (
        <Pagination
          variant={PaginationVariant.WindowedPages}
          page={page}
          setPage={setPage}
          pagination={{
            page,
            pageSize,
            pageCount,
            total,
          }}
          maxVisiblePages={maxVisiblePages}
          sx={{ mt: 1, gap: (theme) => theme.spacing(0.5) }}
        />
      )}
    </>
  );
};
