'use client';

import { useTranslation } from 'react-i18next';
import { ActionableSection } from '@/components/composite/ActionableSection/ActionableSection';
import { OrdersTable } from './OrdersTable';
import { sampleOrders } from './fixtures';
import type { ReactNode } from 'react';

interface OrdersSectionProps {
  isSidePanelExpanded: boolean;
  action: ReactNode;
}

export const OrdersSection = ({
  isSidePanelExpanded,
  action,
}: OrdersSectionProps) => {
  const { t } = useTranslation();
  return (
    <ActionableSection title={t('limitOrders.orders')} action={action} sx={{ flexShrink: 0 }}>
      <OrdersTable
        orders={sampleOrders}
        showMarketColumn={isSidePanelExpanded}
        stickyHeader
      />
    </ActionableSection>
  );
};
