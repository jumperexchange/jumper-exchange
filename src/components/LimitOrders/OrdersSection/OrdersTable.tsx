'use client';

import { DataTable } from '@/components/composite/DataTable/DataTable';
import { CursorPagination } from '@/components/core/Pagination/CursorPagination';
import { type LimitOrder as Order } from '@/types/jumper-backend';
import { useOrderColumns } from './hooks';
import { ORDERS_PAGE_SIZE } from './constants';

interface OrdersTableProps {
  /** Already the current page's rows — pagination is server-side (cursor-based). */
  orders: Order[];
  /** Whether the backend has more results beyond this page. */
  hasMore: boolean;
  /** Whether a previous page is available to navigate back to. */
  canGoPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
  isLoading?: boolean;
  isExpanded?: boolean;
  stickyHeader?: boolean;
}

export const OrdersTable = ({
  orders,
  hasMore,
  canGoPrev,
  onNext,
  onPrev,
  isLoading = false,
  isExpanded = false,
  stickyHeader = false,
}: OrdersTableProps) => {
  const columns = useOrderColumns(isExpanded);

  return (
    <>
      <DataTable
        rows={orders}
        loading={isLoading}
        columns={columns}
        getRowKey={(order) => order.orderId}
        hasMobileView={false}
        skeletonCount={ORDERS_PAGE_SIZE}
        showHeader
        stickyHeader={stickyHeader}
        sx={{ marginInline: (theme) => theme.spacing(-1.5) }}
      />
      {(canGoPrev || hasMore) && (
        <CursorPagination
          hasPrevious={canGoPrev}
          hasNext={hasMore}
          onPrevious={onPrev}
          onNext={onNext}
          disabled={isLoading}
          sx={{ mt: 1 }}
        />
      )}
    </>
  );
};
