'use client';

import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { ActionableSection } from '@/components/composite/ActionableSection/ActionableSection';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import { Size, Variant } from '@/components/core/buttons/types';
import { OrdersTable } from './OrdersTable';
import { sampleOrders } from './OrdersTable.stories';
import type { ReactNode } from 'react';

interface OrdersSectionProps {
  isSidePanelExpanded: boolean;
  action: ReactNode;
}

export const OrdersSection = ({
  isSidePanelExpanded,
  action,
}: OrdersSectionProps) => {
  return (
    <ActionableSection title="Orders" action={action} sx={{ flexShrink: 0 }}>
      <OrdersTable
        orders={sampleOrders}
        showMarketColumn={isSidePanelExpanded}
        stickyHeader
      />
    </ActionableSection>
  );
};
