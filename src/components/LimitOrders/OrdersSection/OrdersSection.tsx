'use client';

import { useTranslation } from 'react-i18next';
import { ActionableSection } from '@/components/composite/ActionableSection/ActionableSection';
import { OrdersTable } from './OrdersTable';
import type { ReactNode } from 'react';
import { useLimitOrders } from '@/hooks/useLimitOrders';

interface OrdersSectionProps {
  isSidePanelExpanded: boolean;
  action: ReactNode;
}

export const OrdersSection = ({
  isSidePanelExpanded,
  action,
}: OrdersSectionProps) => {
  const { t } = useTranslation();
  const { data, isLoading } = useLimitOrders();
  return (
    <ActionableSection
      title={t('limitOrders.orders')}
      action={action}
      sx={{ flexShrink: 0 }}
    >
      <OrdersTable
        orders={data ?? []}
        isLoading={isLoading}
        showMarketColumn={isSidePanelExpanded}
        stickyHeader
      />
    </ActionableSection>
  );
};
