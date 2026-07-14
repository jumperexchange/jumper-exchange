'use client';

import { useState } from 'react';
import { useAccount } from '@lifi/wallet-management';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { ActionableSection } from '@/components/composite/ActionableSection/ActionableSection';
import { CancelOrderFlowModal } from '@/components/composite/CancelOrderFlow/CancelOrderFlow';
import { ModifyOrderFlowModal } from '@/components/composite/ModifyOrderFlow/ModifyOrderFlow';
import { RepeatOrderFlowModal } from '@/components/composite/RepeatOrderFlow/RepeatOrderFlow';
import { OrdersTable } from './OrdersTable';
import type { ReactNode } from 'react';
import { useLimitOrders } from '@/hooks/useLimitOrders';
import { ORDERS_PAGE_SIZE } from './constants';

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
  const [page, setPage] = useState(0);
  const { data, isLoading } = useLimitOrders(page);

  const shouldShow = !!account?.address && !isLoading && !!data?.total;

  return (
    <>
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
                orders={data?.orders ?? []}
                total={data?.total ?? 0}
                pageSize={data?.pageSize ?? ORDERS_PAGE_SIZE}
                pageCount={data?.pageCount ?? 0}
                page={page}
                setPage={setPage}
                isExpanded={isSidePanelExpanded}
                stickyHeader
              />
            </ActionableSection>
          </motion.div>
        )}
      </AnimatePresence>
      <CancelOrderFlowModal />
      <ModifyOrderFlowModal />
      <RepeatOrderFlowModal />
    </>
  );
};
