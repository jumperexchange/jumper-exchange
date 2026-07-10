'use client';

import { useAccount } from '@lifi/wallet-management';
import { AnimatePresence, motion } from 'motion/react';
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
  const { account } = useAccount();
  const { data, isLoading } = useLimitOrders();

  const shouldShow = !!account?.address && !isLoading && !!data?.length;

  return (
    <AnimatePresence mode="popLayout">
      {shouldShow && (
        <motion.div
          key="orders-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <ActionableSection
            title={t('limitOrders.orders')}
            action={action}
            sx={{ flexShrink: 0 }}
          >
            <OrdersTable
              orders={data ?? []}
              isExpanded={isSidePanelExpanded}
              stickyHeader
            />
          </ActionableSection>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
