'use client';

import { DataTable } from '@/components/composite/DataTable/DataTable';
import { useOrderColumns } from './hooks';
import { type Order } from '@/types/jumper-limit-order';

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
  return (
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
  );
};
