'use client';

import { useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { DataTable } from '@/components/composite/DataTable/DataTable';
import {
  Pagination,
  PaginationVariant,
} from '@/components/core/Pagination/Pagination';
import { type Order } from '@/types/jumper-limit-order';
import { useOrderColumns } from './hooks';

const PAGE_SIZE = 10;

interface OrdersTableProps {
  orders: Order[];
  isLoading?: boolean;
  isExpanded?: boolean;
  stickyHeader?: boolean;
}

export const OrdersTable = ({
  orders,
  isLoading = false,
  isExpanded = false,
  stickyHeader = false,
}: OrdersTableProps) => {
  const columns = useOrderColumns(isExpanded);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [page, setPage] = useState(0);

  const maxVisiblePages = isMobile
    ? 1
    : isTablet || (isSmallScreen && !isExpanded)
      ? 2
      : isSmallScreen
        ? 3
        : 5;

  // TODO: replace with server-side pagination once the API exposes limit/offset total count
  const pageCount = Math.ceil(orders.length / PAGE_SIZE);
  const pagedOrders = orders.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <>
      <DataTable
        rows={pagedOrders}
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
            pageSize: PAGE_SIZE,
            pageCount,
            total: orders.length,
          }}
          maxVisiblePages={maxVisiblePages}
          sx={{ mt: 1, gap: (theme) => theme.spacing(0.5) }}
        />
      )}
    </>
  );
};
