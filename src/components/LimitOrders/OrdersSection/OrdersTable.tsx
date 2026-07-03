'use client';

import { DataTable } from '@/components/composite/DataTable/DataTable';
import { useOrderColumns } from './hooks';
import { type Order } from '@/types/jumper-limit-order';

interface OrdersTableProps {
  orders: Order[];
  isLoading?: boolean;
  showMarketColumn?: boolean;
  stickyHeader?: boolean;
}

export const OrdersTable = ({
  orders,
  isLoading = false,
  showMarketColumn = false,
  stickyHeader = false,
}: OrdersTableProps) => {
  const columns = useOrderColumns(showMarketColumn);
  return (
    <DataTable
      rows={orders}
      loading={isLoading}
      columns={columns}
      getRowKey={(order) => order.orderId}
      hasMobileView={false}
      showHeader
      stickyHeader={stickyHeader}
    />
  );
};
