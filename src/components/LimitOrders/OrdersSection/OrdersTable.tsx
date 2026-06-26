'use client';

import { DataTable } from '@/components/composite/DataTable/DataTable';
import type { LimitOrder } from './types';
import { useOrderColumns } from './hooks';

interface OrdersTableProps {
  orders: LimitOrder[];
  showMarketColumn?: boolean;
  stickyHeader?: boolean;
}

export const OrdersTable = ({
  orders,
  showMarketColumn = false,
  stickyHeader = false,
}: OrdersTableProps) => {
  const columns = useOrderColumns(showMarketColumn);
  return (
    <DataTable
      rows={orders}
      columns={columns}
      getRowKey={(order) => order.id}
      hasMobileView={false}
      showHeader
      stickyHeader={stickyHeader}
    />
  );
};
